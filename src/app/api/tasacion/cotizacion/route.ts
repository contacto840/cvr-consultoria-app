import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendConsultaInterna } from "@/lib/mailer";
import { SITE } from "@/lib/site";

const TIPO: Record<string, string> = {
  casa: "Casa",
  departamento: "Departamento",
  terreno: "Terreno urbano",
  agricola: "Predio agrícola / rural",
};

/**
 * POST /api/tasacion/cotizacion
 *
 * El informe de tasación dejó de cobrarse en línea: se cotiza. Este endpoint
 * toma la solicitud de estimación ya guardada y avisa a CVR para que responda
 * con honorario y plazo por escrito. No crea un pago ni marca nada como
 * pagado; el cobro en línea quedó fuera de la interfaz.
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => null)) as { tasacionId?: unknown } | null;
    const tasacionId = typeof body?.tasacionId === "string" ? body.tasacionId : "";
    if (!tasacionId) {
      return NextResponse.json(
        { ok: false, error: "Falta el número de solicitud." },
        { status: 400 }
      );
    }

    const record = await prisma.tasacionRequest.findUnique({
      where: { id: tasacionId },
      select: {
        id: true,
        clientName: true,
        clientEmail: true,
        clientPhone: true,
        comuna: true,
        sector: true,
        propertyType: true,
        surface: true,
        condition: true,
        estimatedValueUF: true,
        ufValueCLP: true,
        ufDate: true,
        createdAt: true,
      },
    });

    if (!record) {
      return NextResponse.json(
        { ok: false, error: "No encontramos esa solicitud." },
        { status: 404 }
      );
    }

    const ufTexto =
      record.ufValueCLP !== null && record.ufDate
        ? `UF usada: $${record.ufValueCLP.toLocaleString("es-CL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })} CLP del ${record.ufDate.toLocaleDateString("es-CL", {
            day: "numeric",
            month: "long",
            year: "numeric",
            timeZone: "America/Santiago",
          })}.`
        : "UF no disponible al calcular: la estimación quedó solo en UF.";

    const mensaje = [
      "El cliente pide cotización del informe de tasación con inspección y firma.",
      "",
      `Solicitud: ${record.id}`,
      `Inmueble: ${TIPO[record.propertyType] ?? record.propertyType} en ${
        record.sector ? `${record.sector}, ` : ""
      }${record.comuna}`,
      `Superficie: ${record.surface.toLocaleString("es-CL")} m² · Estado: ${record.condition}`,
      `Estimación referencial: ${record.estimatedValueUF.toLocaleString("es-CL", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} UF`,
      ufTexto,
      "",
      "La estimación en línea fue gratuita y no hubo cobro. Responde al cliente con el honorario y el plazo por escrito antes de que acepte.",
    ].join("\n");

    const enviado = await sendConsultaInterna({
      nombre: record.clientName,
      email: record.clientEmail,
      telefono: record.clientPhone,
      motivo: "Cotización de informe de tasación",
      mensaje,
      origen: `${SITE.domain}/tasacion — solicitud de cotización`,
    });

    if ("skipped" in enviado) {
      return NextResponse.json(
        {
          ok: false,
          error: `El envío por correo no está disponible ahora. Escríbenos a ${SITE.email} o por WhatsApp al ${SITE.phoneDisplay}.`,
        },
        { status: 503 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[tasacion/cotizacion] error:", error);
    return NextResponse.json(
      { ok: false, error: "No pudimos enviar la solicitud. Intenta nuevamente." },
      { status: 500 }
    );
  }
}
