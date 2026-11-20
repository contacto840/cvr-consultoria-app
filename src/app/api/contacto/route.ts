import { NextRequest, NextResponse } from "next/server";
import { sendConsultaInterna } from "@/lib/mailer";
import { SITE } from "@/lib/site";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function texto(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/**
 * POST /api/contacto — formulario general del sitio.
 * Valida todo antes de enviar: nada toca servicios externos con datos basura.
 * No persiste en base (no hay modelo de consultas) y no hay analítica.
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) {
      return NextResponse.json({ ok: false, error: "Solicitud inválida." }, { status: 400 });
    }

    // Honeypot: si viene completo, es un bot. Se responde ok sin enviar nada.
    if (texto(body.empresa, 100)) {
      return NextResponse.json({ ok: true });
    }

    if (body.consentimiento !== true) {
      return NextResponse.json(
        { ok: false, error: "Necesitamos tu autorización para tratar los datos de la consulta." },
        { status: 400 }
      );
    }

    const nombre = texto(body.nombre, 120);
    const email = texto(body.email, 160);
    const telefono = texto(body.telefono, 40);
    const motivo = texto(body.motivo, 120) || "Consulta general";
    const mensaje = texto(body.mensaje, 2000);

    if (nombre.length < 2) {
      return NextResponse.json({ ok: false, error: "Indica tu nombre." }, { status: 400 });
    }
    if (!EMAIL.test(email)) {
      return NextResponse.json({ ok: false, error: "El correo no es válido." }, { status: 400 });
    }
    if (mensaje.length < 10) {
      return NextResponse.json(
        { ok: false, error: "Cuéntanos un poco más en el mensaje (mínimo 10 caracteres)." },
        { status: 400 }
      );
    }

    const enviado = await sendConsultaInterna({
      nombre,
      email,
      telefono,
      motivo,
      mensaje,
      origen: `${SITE.domain}/ — formulario de contacto`,
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
    console.error("[contacto] error:", error);
    return NextResponse.json({ ok: false, error: "Error interno." }, { status: 500 });
  }
}
