import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { cumplirEncargo } from "@/lib/fulfill";

/**
 * Webhook de MercadoPago. Solo actúa con un pago aprobado que MercadoPago
 * confirme contra su API; no se confía en el contenido del cuerpo.
 *
 * Pendiente recomendado (fuera del alcance): validar la firma `x-signature` del
 * webhook con el secreto del panel de MercadoPago.
 */
export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const topic = url.searchParams.get("topic") || url.searchParams.get("type");
    const id = url.searchParams.get("id") || url.searchParams.get("data.id");
    const body = (await req.json().catch(() => ({}))) as {
      data?: { id?: string | number };
      type?: string;
    };

    const paymentId = id || body?.data?.id;
    const resourceType = topic || body?.type;

    if (resourceType === "payment" && paymentId) {
      const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
      if (accessToken && accessToken !== "TEST-123456789") {
        const client = new MercadoPagoConfig({ accessToken });
        const payment = new Payment(client);
        const paymentData = await payment.get({ id: String(paymentId) });

        if (paymentData.status === "approved") {
          const tasacionId = paymentData.external_reference;
          if (tasacionId) {
            await cumplirEncargo(tasacionId, String(paymentId));
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
