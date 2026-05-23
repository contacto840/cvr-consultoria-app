import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MercadoPagoConfig, Preference } from "mercadopago";

export async function POST(req: NextRequest) {
  try {
    const { tasacionId } = await req.json();

    if (!tasacionId) {
      return NextResponse.json({ ok: false, error: "tasacionId es requerido" }, { status: 400 });
    }

    const tasacion = await prisma.tasacionRequest.findUnique({
      where: { id: tasacionId },
    });

    if (!tasacion) {
      return NextResponse.json({ ok: false, error: "Tasación no encontrada" }, { status: 404 });
    }

    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!accessToken || accessToken === "TEST-123456789") {
      // Si estamos en modo de desarrollo local sin credenciales,
      // retornamos una URL simulada para probar el flujo de redirección.
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      return NextResponse.json({
        ok: true,
        init_point: `${baseUrl}/tasacion?status=approved&id=${tasacionId}&simulated=true`,
      });
    }

    const client = new MercadoPagoConfig({ accessToken });
    const preference = new Preference(client);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const result = await preference.create({
      body: {
        items: [
          {
            id: 'cvr-tasacion-oficial',
            title: 'Informe Oficial de Tasación - CVR Consultoría',
            quantity: 1,
            unit_price: 15000,
            currency_id: 'CLP',
          },
        ],
        back_urls: {
          success: `${baseUrl}/tasacion?status=approved&id=${tasacionId}`,
          failure: `${baseUrl}/tasacion?status=failed&id=${tasacionId}`,
          pending: `${baseUrl}/tasacion?status=pending&id=${tasacionId}`,
        },
        auto_return: 'approved',
        external_reference: tasacionId,
      },
    });

    return NextResponse.json({ ok: true, init_point: result.init_point });
  } catch (error) {
    console.error("Error creando preferencia MercadoPago:", error);
    return NextResponse.json({ ok: false, error: "Error al procesar pago" }, { status: 500 });
  }
}
