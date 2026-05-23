import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SECTORS_BY_COMMUNE } from "@/lib/seed-data";

// GET /api/sectores?comuna=Chillán
// Returns sectors for a commune and avg prices per property type
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const comuna = searchParams.get("comuna");
  const propertyType = searchParams.get("tipo");

  if (!comuna) {
    return NextResponse.json({ error: "Parámetro 'comuna' requerido" }, { status: 400 });
  }

  // Get sectors from static map (fast, no DB)
  const sectors = SECTORS_BY_COMMUNE[comuna] ?? [];

  // If propertyType is also requested, return prices per sector
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
