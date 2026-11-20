import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SECTORS_BY_COMMUNE } from "@/lib/seed-data";

const TIPOS = new Set(["casa", "departamento", "terreno", "agricola"]);

// GET /api/sectores?comuna=Chillán&tipo=casa
// Devuelve sectores de una comuna y, si se pide el tipo, precios agregados.
// No expone datos personales: solo valores de referencia.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const comuna = searchParams.get("comuna")?.trim().slice(0, 80) ?? "";
  const propertyType = searchParams.get("tipo")?.trim() ?? "";

  if (!comuna) {
    return NextResponse.json({ error: "Parámetro 'comuna' requerido" }, { status: 400 });
  }
  if (propertyType && !TIPOS.has(propertyType)) {
    return NextResponse.json({ error: "Tipo de propiedad inválido" }, { status: 400 });
  }

  const sectors = SECTORS_BY_COMMUNE[comuna] ?? [];

  if (propertyType) {
    const priceData = await prisma.propertyData.findMany({
      where: {
        comuna,
        propertyType,
        sector: { not: "" },
      },
      select: {
        sector: true,
        avgPricePerM2: true,
        minPricePerM2: true,
        maxPricePerM2: true,
        sampleSize: true,
      },
      orderBy: { sector: "asc" },
    });

    const priceMap: Record<string, { avg: number; min: number | null; max: number | null; samples: number }> = {};
    for (const row of priceData) {
      priceMap[row.sector] = {
        avg: row.avgPricePerM2,
        min: row.minPricePerM2,
        max: row.maxPricePerM2,
        samples: row.sampleSize,
      };
    }

    return NextResponse.json({ comuna, sectors, prices: priceMap });
  }

  return NextResponse.json({ comuna, sectors });
}
