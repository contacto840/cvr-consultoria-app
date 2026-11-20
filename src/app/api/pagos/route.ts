import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { ENCARGO } from "@/lib/encargo";

const ID_ITEM = "cvr-encargo-tasacion";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => null)) as { tasacionId?: unknown } | null;
    const tasacionId = typeof body?.tasacionId === "string" ? body.tasacionId : "";
    if (!tasacionId) {
      return NextResponse.json({ ok: false, error: "tasacionId es requerido" }, { status: 400 });
    }

    const tasacion = await prisma.tasacionRequest.findUnique({ where: { id: tasacionId } });
    if (!tasacion) {
      return NextResponse.json({ ok: false, error: "Solicitud no encontrada" }, { status: 404 });
    }

    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Sin credenciales solo se simula fuera de producción. En producción, un
    // token ausente debe fallar en vez de dar por pagado un encargo.
    if (!accessToken || accessToken === "TEST-123456789") {
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
          { ok: false, error: "El medio de pago no está disponible en este momento." },
          { status: 503 }
        );
      }
      return NextResponse.json({
        ok: true,
        init_point: `${baseUrl}/tasacion?status=approved&id=${tasacionId}&simulated=true`,
      });
    }

    const client = new MercadoPagoConfig({ accessToken });
    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            id: ID_ITEM,
            title: `${ENCARGO.nombre} - CVR Propiedades`,
            quantity: 1,
            unit_price: ENCARGO.precioCLP,
            currency_id: "CLP",
          },
        ],
        back_urls: {
          success: `${baseUrl}/tasacion?status=approved&id=${tasacionId}`,
          failure: `${baseUrl}/tasacion?status=failed&id=${tasacionId}`,
          pending: `${baseUrl}/tasacion?status=pending&id=${tasacionId}`,
        },
        auto_return: "approved",
        external_reference: tasacionId,
      },
    });

    return NextResponse.json({ ok: true, init_point: result.init_point });
  } catch (error) {
    console.error("Error creando preferencia MercadoPago:", error);
    return NextResponse.json({ ok: false, error: "Error al procesar pago" }, { status: 500 });
  }
}
