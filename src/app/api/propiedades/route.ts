import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/propiedades?comuna=&tipo=&transaccion=&page=1
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const comuna = searchParams.get("comuna") ?? undefined;
  const propertyType = searchParams.get("tipo") ?? undefined;
  const transactionType = searchParams.get("transaccion") ?? undefined;
  const sector = searchParams.get("sector") ?? undefined;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const perPage = 12;

  const where = {
    isActive: true,
    ...(comuna ? { comuna } : {}),
    ...(propertyType ? { propertyType } : {}),
    ...(transactionType ? { transactionType } : {}),
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
        contactPhone: true,
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
    pages: Math.ceil(total / perPage),
  });
}

// POST /api/propiedades — Create a new listing
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const required = ["title", "propertyType", "comuna", "surface", "priceUF", "contactName", "contactPhone"];
    for (const field of required) {
      if (!body[field] && body[field] !== 0) {
        return NextResponse.json({ error: `Campo requerido: ${field}` }, { status: 400 });
      }
    }

    const listing = await prisma.propertyListing.create({
      data: {
        title: String(body.title).trim(),
        description: String(body.description ?? "").trim(),
        propertyType: body.propertyType,
        transactionType: body.transactionType ?? "venta",
        comuna: body.comuna,
        sector: body.sector ?? "",
        address: String(body.address ?? "").trim(),
        surface: parseFloat(body.surface),
        terrainSurface: body.terrainSurface ? parseFloat(body.terrainSurface) : null,
        bedrooms: body.bedrooms ? parseInt(body.bedrooms) : null,
        bathrooms: body.bathrooms ? parseInt(body.bathrooms) : null,
        parkingSpaces: body.parkingSpaces ? parseInt(body.parkingSpaces) : null,
        priceUF: parseFloat(body.priceUF),
        priceNegotiable: Boolean(body.priceNegotiable),
        contactName: String(body.contactName).trim(),
        contactPhone: String(body.contactPhone).trim(),
        contactEmail: String(body.contactEmail ?? "").trim(),
        features: JSON.stringify(body.features ?? []),
        status: "disponible",
        isActive: true,
      },
    });

    return NextResponse.json({ id: listing.id, ok: true }, { status: 201 });
  } catch (err) {
    console.error("Error creando propiedad:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
