import { NextRequest, NextResponse } from "next/server";
import { esAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

/**
 * PATCH /api/admin/propiedades — publica o retira una publicación.
 *
 * Las propiedades que envían los anunciantes se guardan con `isActive: false`
 * y quedan invisibles hasta que alguien del equipo las revisa. Sin esta ruta,
 * la moderación dejaría publicaciones imposibles de activar.
 */
export async function PATCH(req: NextRequest) {
  if (!esAdmin(req)) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as
    | { id?: unknown; isActive?: unknown; status?: unknown }
    | null;

  const id = typeof body?.id === "string" ? body.id : "";
  if (!id) {
    return NextResponse.json({ ok: false, error: "ID requerido" }, { status: 400 });
  }

  const estados = new Set(["disponible", "reservado", "vendido"]);
  const data: { isActive?: boolean; status?: string } = {};

  if (typeof body?.isActive === "boolean") data.isActive = body.isActive;
  if (typeof body?.status === "string" && estados.has(body.status)) data.status = body.status;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ ok: false, error: "Nada que actualizar" }, { status: 400 });
  }

  const listing = await prisma.propertyListing.update({ where: { id }, data });
  return NextResponse.json({ ok: true, listing: { id: listing.id, isActive: listing.isActive, status: listing.status } });
}
