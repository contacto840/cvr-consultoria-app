import { NextRequest, NextResponse } from "next/server";
import { adminConfigurado, esAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

// GET: datos de referencia + últimas solicitudes. Contiene datos personales
// (nombre, correo y teléfono de solicitantes), por lo que exige autenticación.
export async function GET(req: NextRequest) {
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

  const [propertyData, tasaciones, listings] = await Promise.all([
    prisma.propertyData.findMany({
      orderBy: [{ comuna: "asc" }, { sector: "asc" }, { propertyType: "asc" }],
    }),
    prisma.tasacionRequest.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
    prisma.propertyListing.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        title: true,
        comuna: true,
        sector: true,
        propertyType: true,
        transactionType: true,
        priceUF: true,
        status: true,
        isActive: true,
        createdAt: true,
        contactName: true,
        contactPhone: true,
        contactEmail: true,
      },
    }),
  ]);

  return NextResponse.json({ ok: true, propertyData, tasaciones, listings });
}

function numero(value: unknown): number | null {
  const n = typeof value === "string" ? Number(value.replace(",", ".")) : Number(value);
  return Number.isFinite(n) ? n : null;
}

function texto(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

const TIPOS = new Set(["casa", "departamento", "terreno", "agricola"]);

// POST: crear o actualizar un valor de referencia por comuna, sector y tipo.
export async function POST(req: NextRequest) {
  if (!esAdmin(req)) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) {
    return NextResponse.json({ ok: false, error: "Cuerpo inválido." }, { status: 400 });
  }

  const comuna = texto(body.comuna, 80);
  const sector = texto(body.sector, 80);
  const propertyType = texto(body.propertyType, 20);
  const avg = numero(body.avgPricePerM2);
  const min = body.minPricePerM2 == null ? null : numero(body.minPricePerM2);
  const max = body.maxPricePerM2 == null ? null : numero(body.maxPricePerM2);
  const year = body.referenceYear == null ? 2025 : numero(body.referenceYear);

  if (!comuna || !TIPOS.has(propertyType) || avg === null || avg <= 0 || avg > 10000) {
    return NextResponse.json({ ok: false, error: "Faltan campos requeridos o son inválidos." }, { status: 400 });
  }
  if (year === null || year < 2000 || year > 2100) {
    return NextResponse.json({ ok: false, error: "Año de referencia inválido." }, { status: 400 });
  }

  const record = await prisma.propertyData.upsert({
    where: { comuna_sector_propertyType: { comuna, sector, propertyType } },
    update: { avgPricePerM2: avg, minPricePerM2: min, maxPricePerM2: max, referenceYear: year },
    create: {
      comuna,
      sector,
      propertyType,
      avgPricePerM2: avg,
      minPricePerM2: min,
      maxPricePerM2: max,
      referenceYear: year,
    },
  });

  return NextResponse.json({ ok: true, record });
}

// DELETE: eliminar un registro de referencia por id.
export async function DELETE(req: NextRequest) {
  if (!esAdmin(req)) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as { id?: unknown } | null;
  const id = typeof body?.id === "string" ? body.id : "";
  if (!id) return NextResponse.json({ ok: false, error: "ID requerido" }, { status: 400 });

  await prisma.propertyData.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
