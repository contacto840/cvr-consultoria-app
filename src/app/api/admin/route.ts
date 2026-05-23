import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "cvr2025admin";

function checkAuth(req: NextRequest) {
  const auth = req.headers.get("x-admin-password");
  return auth === ADMIN_PASSWORD;
}

// GET: Listar todos los datos de propiedad + últimas tasaciones
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  const [propertyData, tasaciones] = await Promise.all([
    prisma.propertyData.findMany({ orderBy: [{ comuna: "asc" }, { sector: "asc" }, { propertyType: "asc" }] }),
    prisma.tasacionRequest.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
  ]);

  return NextResponse.json({ ok: true, propertyData, tasaciones });
}

// POST: Crear o actualizar un dato de propiedad
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const { comuna, sector = "", propertyType, avgPricePerM2, minPricePerM2, maxPricePerM2, referenceYear } = body;

  if (!comuna || !propertyType || !avgPricePerM2) {
    return NextResponse.json({ ok: false, error: "Faltan campos requeridos." }, { status: 400 });
  }

  const record = await prisma.propertyData.upsert({
    where: { comuna_sector_propertyType: { comuna, sector, propertyType } },
    update: { avgPricePerM2, minPricePerM2, maxPricePerM2, referenceYear: referenceYear ?? 2025 },
    create: { comuna, sector, propertyType, avgPricePerM2, minPricePerM2, maxPricePerM2, referenceYear: referenceYear ?? 2025 },
  });

  return NextResponse.json({ ok: true, record });
}

// DELETE: Eliminar un registro
export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  const { id } = await req.json();
  if (!id) return NextResponse.json({ ok: false, error: "ID requerido" }, { status: 400 });

  await prisma.propertyData.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
