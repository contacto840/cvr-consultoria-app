import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const TIPOS = new Set(["casa", "departamento", "terreno", "agricola"]);
const TRANSACCIONES = new Set(["venta", "arriendo"]);

// GET /api/propiedades?comuna=&tipo=&transaccion=&page=1
// Solo devuelve campos publicables. La dirección exacta y los datos de contacto
// del propietario quedan fuera de la respuesta: el contacto se canaliza por el
// formulario de la ficha.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const comuna = searchParams.get("comuna")?.slice(0, 80) ?? undefined;
  const propertyType = searchParams.get("tipo") ?? undefined;
  const transactionType = searchParams.get("transaccion") ?? undefined;
  const sector = searchParams.get("sector")?.slice(0, 80) ?? undefined;

  const pageParam = Number(searchParams.get("page") ?? "1");
  const page = Number.isFinite(pageParam) && pageParam > 0 ? Math.floor(pageParam) : 1;
  const perPage = 12;

  const where = {
    isActive: true,
    ...(comuna ? { comuna } : {}),
    ...(propertyType && TIPOS.has(propertyType) ? { propertyType } : {}),
    ...(transactionType && TRANSACCIONES.has(transactionType) ? { transactionType } : {}),
    ...(sector ? { sector } : {}),
  };

  const [listings, total] = await Promise.all([
    prisma.propertyListing.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
      select: {
        id: true,
        title: true,
        propertyType: true,
        transactionType: true,
        comuna: true,
        sector: true,
        surface: true,
        terrainSurface: true,
        bedrooms: true,
        bathrooms: true,
        priceUF: true,
        priceNegotiable: true,
        status: true,
        createdAt: true,
        description: true,
      },
    }),
    prisma.propertyListing.count({ where }),
  ]);

  return NextResponse.json({
    listings,
    total,
    page,
    pages: Math.max(1, Math.ceil(total / perPage)),
  });
}

function texto(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function numero(value: unknown): number | null {
  if (value === "" || value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

// POST /api/propiedades — un anunciante publica su propiedad.
// Queda inactiva hasta que el equipo la revise (moderación antes de publicar).
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) {
      return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
    }

    if (body.consentimiento !== true) {
      return NextResponse.json(
        { error: "Debes autorizar el tratamiento de tus datos para publicar." },
        { status: 400 }
      );
    }

    const title = texto(body.title, 120);
    const propertyType = texto(body.propertyType, 20);
    const transactionType = texto(body.transactionType, 20) || "venta";
    const comuna = texto(body.comuna, 80);
    const contactName = texto(body.contactName, 120);
    const contactPhone = texto(body.contactPhone, 40);
    const contactEmail = texto(body.contactEmail, 160);
    const surface = numero(body.surface);
    const priceUF = numero(body.priceUF);

    const faltantes: string[] = [];
    if (!title) faltantes.push("título");
    if (!TIPOS.has(propertyType)) faltantes.push("tipo de propiedad");
    if (!TRANSACCIONES.has(transactionType)) faltantes.push("operación");
    if (!comuna) faltantes.push("comuna");
    if (surface === null || surface <= 0 || surface > 1000000) faltantes.push("superficie");
    if (priceUF === null || priceUF <= 0 || priceUF > 1000000) faltantes.push("precio");
    if (!contactName) faltantes.push("nombre de contacto");
    if (!contactPhone) faltantes.push("teléfono de contacto");
    if (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) faltantes.push("correo válido");

    if (faltantes.length > 0) {
      return NextResponse.json(
        { error: `Revisa estos campos: ${faltantes.join(", ")}.` },
        { status: 400 }
      );
    }

    const listing = await prisma.propertyListing.create({
      data: {
        title,
        description: texto(body.description, 4000),
        propertyType,
        transactionType,
        comuna,
        sector: texto(body.sector, 80),
        address: texto(body.address, 200),
        surface: surface as number,
        terrainSurface: numero(body.terrainSurface),
        bedrooms: numero(body.bedrooms),
        bathrooms: numero(body.bathrooms),
        parkingSpaces: numero(body.parkingSpaces),
        priceUF: priceUF as number,
        priceNegotiable: body.priceNegotiable === true,
        contactName,
        contactPhone,
        contactEmail,
        features: JSON.stringify(
          Array.isArray(body.features)
            ? body.features.filter((f): f is string => typeof f === "string").slice(0, 30)
            : []
        ),
        status: "disponible",
        isActive: false, // se activa tras la revisión del equipo
      },
    });

    return NextResponse.json({ id: listing.id, ok: true, revision: true }, { status: 201 });
  } catch (err) {
    console.error("Error creando propiedad:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
