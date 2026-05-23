import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UF_VALUE_CLP } from "@/lib/seed-data";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clientName, clientEmail, clientPhone, comuna, sector, propertyType, surface, condition, age } = body;

    // Validaciones básicas
    if (!clientName || !clientEmail || !clientPhone || !comuna || !propertyType || !surface) {
      return NextResponse.json({ ok: false, error: "Todos los campos son requeridos." }, { status: 400 });
    }
    if (surface <= 0 || surface > 100000) {
      return NextResponse.json({ ok: false, error: "Superficie inválida." }, { status: 400 });
    }

    // Buscar datos de referencia: primero por sector específico, luego sin sector
    const sectorStr = sector ?? "";
    let refData = sectorStr
      ? await prisma.propertyData.findUnique({
          where: { comuna_sector_propertyType: { comuna, sector: sectorStr, propertyType } },
        })
      : null;

    // Fallback: registro sin sector (sector = "")
    if (!refData) {
      refData = await prisma.propertyData.findUnique({
        where: { comuna_sector_propertyType: { comuna, sector: "", propertyType } },
      });
    }

    // Último fallback: cualquier registro de esa comuna y tipo
    if (!refData) {
      refData = await prisma.propertyData.findFirst({
        where: { comuna, propertyType },
        orderBy: { sampleSize: "desc" },
      });
    }

    if (!refData) {
      return NextResponse.json(
        { ok: false, error: `No tenemos datos de referencia para ${propertyType} en ${comuna}. Contáctenos para una tasación manual.` },
        { status: 404 }
      );
    }

    // ─── MOTOR DE CÁLCULO ─────────────────────────────────────
    let basePrice = refData.avgPricePerM2;

    // Factor por condición del inmueble
    const conditionFactor: Record<string, number> = {
      excelente: 1.20,
      bueno: 1.05,
      normal: 1.00,
      regular: 0.88,
      malo: 0.75,
    };
    basePrice *= conditionFactor[condition] ?? 1.0;

    // Factor por antigüedad (solo casas y departamentos)
    if (propertyType === "casa" || propertyType === "departamento") {
      const ageNum = parseInt(age ?? "0", 10);
      if (ageNum <= 5) basePrice *= 1.10;
      else if (ageNum <= 15) basePrice *= 1.00;
      else if (ageNum <= 30) basePrice *= 0.90;
      else basePrice *= 0.80;
    }

    const estimatedValueUF = Math.round(basePrice * surface * 100) / 100;
    const estimatedValueCLP = Math.round(estimatedValueUF * UF_VALUE_CLP);
    const minValueUF = Math.round((refData.minPricePerM2 ?? basePrice * 0.8) * surface * 100) / 100;
    const maxValueUF = Math.round((refData.maxPricePerM2 ?? basePrice * 1.2) * surface * 100) / 100;

    // Guardar la solicitud en BD
    const record = await prisma.tasacionRequest.create({
      data: {
        clientName,
        clientEmail,
        clientPhone,
        comuna,
        sector: sectorStr,
        propertyType,
        surface: parseFloat(surface),
        condition: condition ?? "normal",
        estimatedValueUF,
        estimatedValueCLP,
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
        pricePerM2UF: Math.round(basePrice * 100) / 100,
        comuna,
        sector: sectorStr,
        propertyType,
        surface: parseFloat(surface),
        condition: condition ?? "normal",
        ufValueCLP: UF_VALUE_CLP,
        referenceYear: refData.referenceYear,
        usedSector: refData.sector,
      },
    });
  } catch (error) {
    console.error("Tasacion error:", error);
    return NextResponse.json({ ok: false, error: "Error interno del servidor." }, { status: 500 });
  }
}

export async function GET() {
  const rows = await prisma.propertyData.findMany({
    select: { comuna: true, sector: true, propertyType: true },
    distinct: ["comuna"],
    orderBy: { comuna: "asc" },
  });
  const communas = [...new Set(rows.map((r) => r.comuna))];
  return NextResponse.json({ ok: true, data: communas });
}
