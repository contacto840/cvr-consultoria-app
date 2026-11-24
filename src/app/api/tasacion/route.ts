import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { obtenerUfDelDia } from "@/lib/uf";

const TIPOS = new Set(["casa", "departamento", "terreno", "agricola"]);
const CONDICIONES = new Set(["excelente", "bueno", "normal", "regular", "malo"]);

const FACTOR_CONDICION: Record<string, number> = {
  excelente: 1.2,
  bueno: 1.05,
  normal: 1.0,
  regular: 0.88,
  malo: 0.75,
};

function factorEdad(anios: number): number {
  if (anios <= 5) return 1.1;
  if (anios <= 15) return 1.0;
  if (anios <= 30) return 0.9;
  return 0.8;
}

function texto(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/tasacion — estimación referencial.
 *
 * No es una tasación: calcula un rango a partir de valores de referencia por
 * comuna, sector y tipo, guarda la solicitud y devuelve la muestra y el año de
 * los datos para que el resultado sea auditable.
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) {
      return NextResponse.json({ ok: false, error: "Solicitud inválida." }, { status: 400 });
    }

    if (body.consentimiento !== true) {
      return NextResponse.json(
        { ok: false, error: "Debes autorizar el tratamiento de tus datos para calcular." },
        { status: 400 }
      );
    }

    const clientName = texto(body.clientName, 120);
    const clientEmail = texto(body.clientEmail, 160);
    const clientPhone = texto(body.clientPhone, 40);
    const comuna = texto(body.comuna, 80);
    const sector = texto(body.sector, 80);
    const propertyType = texto(body.propertyType, 20);
    const condition = texto(body.condition, 20) || "normal";

    if (!clientName || clientName.length < 2) {
      return NextResponse.json({ ok: false, error: "Indica tu nombre." }, { status: 400 });
    }
    if (!EMAIL.test(clientEmail)) {
      return NextResponse.json({ ok: false, error: "El correo no es válido." }, { status: 400 });
    }
    if (clientPhone.replace(/\D/g, "").length < 8) {
      return NextResponse.json({ ok: false, error: "El teléfono no es válido." }, { status: 400 });
    }
    if (!comuna) {
      return NextResponse.json({ ok: false, error: "Indica la comuna." }, { status: 400 });
    }
    if (!TIPOS.has(propertyType)) {
      return NextResponse.json({ ok: false, error: "Tipo de propiedad inválido." }, { status: 400 });
    }
    if (!CONDICIONES.has(condition)) {
      return NextResponse.json({ ok: false, error: "Estado de conservación inválido." }, { status: 400 });
    }

    const superficieIngresada = Number(body.surface);
    if (!Number.isFinite(superficieIngresada) || superficieIngresada <= 0) {
      return NextResponse.json({ ok: false, error: "Superficie inválida." }, { status: 400 });
    }
    // Los predios agrícolas se ingresan en hectáreas; el resto en m².
    const surface = propertyType === "agricola" ? superficieIngresada * 10000 : superficieIngresada;
    if (surface > 100_000_000) {
      return NextResponse.json({ ok: false, error: "Superficie fuera de rango." }, { status: 400 });
    }

    const edadNum = Number(body.age);
    const edad = Number.isFinite(edadNum) && edadNum >= 0 && edadNum <= 120 ? Math.round(edadNum) : 0;

    let refData = sector
      ? await prisma.propertyData.findUnique({
          where: { comuna_sector_propertyType: { comuna, sector, propertyType } },
        })
      : null;

    if (!refData) {
      refData = await prisma.propertyData.findUnique({
        where: { comuna_sector_propertyType: { comuna, sector: "", propertyType } },
      });
    }

    if (!refData) {
      refData = await prisma.propertyData.findFirst({
        where: { comuna, propertyType },
        orderBy: { sampleSize: "desc" },
      });
    }

    if (!refData) {
      return NextResponse.json(
        {
          ok: false,
          error: `No hay valores de referencia para ese tipo de propiedad en ${comuna}. Escríbenos y lo revisamos a mano.`,
        },
        { status: 404 }
      );
    }

    const fCondicion = FACTOR_CONDICION[condition] ?? 1;
    const fEdad =
      propertyType === "casa" || propertyType === "departamento" ? factorEdad(edad) : 1;

    const precioM2 = refData.avgPricePerM2 * fCondicion * fEdad;
    const estimatedValueUF = Math.round(precioM2 * surface * 100) / 100;
    const minValueUF =
      Math.round((refData.minPricePerM2 ?? refData.avgPricePerM2 * 0.85) * surface * 100) / 100;
    const maxValueUF =
      Math.round((refData.maxPricePerM2 ?? refData.avgPricePerM2 * 1.15) * surface * 100) / 100;

    // La conversión a pesos depende del valor oficial de la UF del día (SII).
    // Si la fuente no responde, no se inventa una cifra: la estimación queda
    // solo en UF y se guardan `ufValueCLP`/`ufDate` para no reconstruir la
    // conversión desde el monto. `estimatedValueCLP` queda null en ese caso.
    const uf = await obtenerUfDelDia();
    const estimatedValueCLP = uf ? Math.round(estimatedValueUF * uf.valorCLP) : null;
    const ufDate = uf ? new Date(`${uf.fecha}T12:00:00Z`) : null;

    const record = await prisma.tasacionRequest.create({
      data: {
        clientName,
        clientEmail,
        clientPhone,
        comuna,
        sector,
        propertyType,
        surface,
        condition,
        estimatedValueUF,
        estimatedValueCLP,
        ufValueCLP: uf?.valorCLP ?? null,
        ufDate,
        paymentStatus: "pending",
      },
    });

    return NextResponse.json({
      ok: true,
      tasacionId: record.id,
      result: {
        estimatedValueUF,
        estimatedValueCLP,
        minValueUF,
        maxValueUF,
        pricePerM2UF: Math.round(precioM2 * 100) / 100,
        comuna,
        sector,
        propertyType,
        surface,
        condition,
        ufValueCLP: uf?.valorCLP ?? null,
        ufDate: uf?.fecha ?? null,
        referenceYear: refData.referenceYear,
        usedSector: refData.sector,
        sampleSize: refData.sampleSize,
        conditionFactor: fCondicion,
        ageFactor: fEdad,
      },
    });
  } catch (error) {
    console.error("Tasacion error:", error);
    return NextResponse.json({ ok: false, error: "Error interno del servidor." }, { status: 500 });
  }
}

// GET: comunas con datos de referencia. No devuelve datos personales.
export async function GET() {
  const rows = await prisma.propertyData.findMany({
    select: { comuna: true },
    distinct: ["comuna"],
    orderBy: { comuna: "asc" },
  });
  return NextResponse.json({ ok: true, data: rows.map((r) => r.comuna) });
}
