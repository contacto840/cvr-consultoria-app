import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { cumplirEncargo } from "@/lib/fulfill";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => null)) as
      | { tasacionId?: unknown; payment_id?: unknown; simulated?: unknown }
      | null;

    const tasacionId = typeof body?.tasacionId === "string" ? body.tasacionId : "";
    if (!tasacionId) {
      return NextResponse.json({ ok: false, error: "tasacionId requerido" }, { status: 400 });
    }

    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    const sinCredenciales = !accessToken || accessToken === "TEST-123456789";

    // El modo simulado existía y era alcanzable en producción: un POST con
    // {simulated:true} marcaba el encargo como pagado. Ahora solo se acepta en
    // desarrollo y sin credenciales reales.
    const simulacionPermitida = sinCredenciales && process.env.NODE_ENV !== "production";

    if (body?.simulated === true) {
      if (!simulacionPermitida) {
        return NextResponse.json(
          { ok: false, error: "El modo de prueba no está disponible." },
          { status: 403 }
        );
      }
      await cumplirEncargo(tasacionId, `simulated_${Date.now()}`);
      return NextResponse.json({ ok: true, message: "Pago simulado. Estimación enviada." });
    }

    if (sinCredenciales) {
      return NextResponse.json(
        { ok: false, error: "El medio de pago no está disponible." },
        { status: 503 }
      );
    }

    if (typeof body?.payment_id !== "string" || !body.payment_id) {
      return NextResponse.json({ ok: false, error: "payment_id requerido" }, { status: 400 });
    }

    const client = new MercadoPagoConfig({ accessToken });
    const payment = new Payment(client);
    const paymentData = await payment.get({ id: body.payment_id });

    if (paymentData.status === "approved" && paymentData.external_reference === tasacionId) {
      await cumplirEncargo(tasacionId, String(body.payment_id));
      return NextResponse.json({ ok: true, message: "Pago confirmado. Estimación enviada." });
    }

    return NextResponse.json(
      { ok: false, error: "El pago no está aprobado o no coincide la solicitud" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error confirmando pago:", error);
    return NextResponse.json({ ok: false, error: "Error al confirmar pago" }, { status: 500 });
  }
}
