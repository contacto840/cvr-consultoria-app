import { NextRequest, NextResponse } from "next/server";
import { sendConsultaInterna } from "@/lib/mailer";
import { prisma } from "@/lib/prisma";
import { SITE } from "@/lib/site";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function texto(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/**
 * POST /api/consultas — consulta por una ficha de propiedad.
 *
 * El contacto va a la casilla de CVR, no al teléfono del propietario. Así no se
 * publica un dato personal en una página indexable y queda registro de la
 * consulta en el correo del equipo.
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) {
      return NextResponse.json({ ok: false, error: "Solicitud inválida." }, { status: 400 });
    }

    if (texto(body.empresa, 100)) {
      return NextResponse.json({ ok: true });
    }

    if (body.consentimiento !== true) {
      return NextResponse.json(
        { ok: false, error: "Necesitamos tu autorización para tratar los datos de la consulta." },
        { status: 400 }
      );
    }

    const listingId = texto(body.listingId, 40);
    const nombre = texto(body.nombre, 120);
    const email = texto(body.email, 160);
    const telefono = texto(body.telefono, 40);
    const mensaje = texto(body.mensaje, 1500);

    if (!listingId) {
      return NextResponse.json({ ok: false, error: "Falta la propiedad consultada." }, { status: 400 });
    }
    if (nombre.length < 2) {
      return NextResponse.json({ ok: false, error: "Indica tu nombre." }, { status: 400 });
    }
    if (!EMAIL.test(email)) {
      return NextResponse.json({ ok: false, error: "El correo no es válido." }, { status: 400 });
    }
    if (mensaje.length < 5) {
      return NextResponse.json({ ok: false, error: "Escribe tu consulta." }, { status: 400 });
    }

    // Solo se acepta el id de una propiedad activa: evita usar el formulario
    // como relay para consultas de fichas inexistentes o despublicadas.
    const listing = await prisma.propertyListing.findFirst({
      where: { id: listingId, isActive: true },
      select: { id: true, title: true, comuna: true },
    });

    if (!listing) {
      return NextResponse.json(
        { ok: false, error: "Esta propiedad ya no está disponible." },
        { status: 404 }
      );
    }

    const enviado = await sendConsultaInterna({
      nombre,
      email,
      telefono,
      motivo: `Consulta por propiedad: ${listing.title} (${listing.comuna})`,
      mensaje,
      origen: `${SITE.domain}/propiedades/${listing.id}`,
    });

    if ("skipped" in enviado) {
      return NextResponse.json(
        {
          ok: false,
          error: `El envío de correo no está disponible ahora. Escríbenos por WhatsApp al ${SITE.phoneDisplay}.`,
        },
        { status: 503 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[consultas] error:", error);
    return NextResponse.json({ ok: false, error: "Error interno." }, { status: 500 });
  }
}
