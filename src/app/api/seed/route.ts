import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SEED_DATA } from "@/lib/seed-data";

export async function POST() {
  try {
    let upserted = 0;

    for (const item of SEED_DATA) {
      await prisma.propertyData.upsert({
        where: {
          comuna_sector_propertyType: {
            comuna: item.comuna,
            sector: item.sector,
            propertyType: item.propertyType,
          },
        },
        update: {
          avgPricePerM2: item.avgPricePerM2,
          minPricePerM2: item.minPricePerM2,
          maxPricePerM2: item.maxPricePerM2,
          sampleSize: item.sampleSize,
          referenceYear: 2025,
        },
        create: {
          comuna: item.comuna,
          sector: item.sector,
          propertyType: item.propertyType,
          avgPricePerM2: item.avgPricePerM2,
          minPricePerM2: item.minPricePerM2,
          maxPricePerM2: item.maxPricePerM2,
          sampleSize: item.sampleSize,
          referenceYear: 2025,
        },
      });
      upserted++;
    }

    const total = await prisma.propertyData.count();
    return NextResponse.json({
      ok: true,
      message: `Seed completado: ${upserted} registros procesados. Total en BD: ${total}`,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ ok: false, error: "Error al sembrar datos" }, { status: 500 });
  }
}

export async function GET() {
  const [total, porComuna] = await Promise.all([
    prisma.propertyData.count(),
    prisma.propertyData.groupBy({
      by: ["comuna"],
      _count: { id: true },
      orderBy: { comuna: "asc" },
    }),
  ]);
  return NextResponse.json({ ok: true, totalRecords: total, porComuna });
}
