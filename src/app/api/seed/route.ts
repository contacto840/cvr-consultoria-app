import { NextRequest, NextResponse } from "next/server";
import { adminConfigurado, esAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { SEED_DATA } from "@/lib/seed-data";

/**
 * Carga de datos de referencia.
 *
 * Antes, `POST /api/seed` era alcanzable sin autenticación: cualquiera podía
 * reescribir los precios por m² con los que se calcula la estimación pública.
 * Ahora exige la misma credencial del panel de administración y falla cerrado si
 * `ADMIN_PASSWORD` no está configurada.
 */
export async function POST(req: NextRequest) {
  if (!esAdmin(req)) {
    return NextResponse.json(
      {
        ok: false,
        error: adminConfigurado()
          ? "No autorizado"
          : "ADMIN_PASSWORD no está configurada en el entorno.",
      },
      { status: 401 }
    );
  }

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

// Solo agregados: no devuelve datos personales.
export async function GET(req: NextRequest) {
  if (!esAdmin(req)) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

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
