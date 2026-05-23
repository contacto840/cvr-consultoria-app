import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { generateTasacionPDF } from "@/lib/pdf-generator";
import { sendTasacionReport } from "@/lib/mailer";

async function fulfillTasacion(tasacionId: string, paymentId: string) {
  const record = await prisma.tasacionRequest.findUnique({ where: { id: tasacionId } });
  if (!record || record.paymentStatus === "paid") return;

  await prisma.tasacionRequest.update({
    where: { id: tasacionId },
    data: { paymentStatus: "paid", paymentId },
  });

  try {
    const pdfBytes = await generateTasacionPDF({
      tasacionId: record.id,
      clientName: record.clientName,
      clientEmail: record.clientEmail,
      clientPhone: record.clientPhone,
      comuna: record.comuna,
      propertyType: record.propertyType,
      surface: record.surface,
      condition: "normal",
      estimatedValueUF: record.estimatedValueUF,
      estimatedValueCLP: record.estimatedValueCLP,
      minValueUF: record.estimatedValueUF * 0.85,
      maxValueUF: record.estimatedValueUF * 1.15,
      pricePerM2UF: record.estimatedValueUF / record.surface,
      ufValueCLP: Math.round(record.estimatedValueCLP / record.estimatedValueUF),
      referenceYear: new Date().getFullYear(),
      createdAt: record.createdAt,
    });

    await sendTasacionReport({
      to: record.clientEmail,
      clientName: record.clientName,
      tasacionId: record.id,
      pdfBytes,
    });
  } catch (err) {
    console.error("[confirmar] PDF/email error:", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { tasacionId, payment_id, simulated } = await req.json();

    if (!tasacionId) {
      return NextResponse.json({ ok: false, error: "tasacionId requerido" }, { status: 400 });
    }

    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    const isTest = !accessToken || accessToken === "TEST-123456789";

    if (simulated === true || isTest) {
      await fulfillTasacion(tasacionId, "simulated_" + Date.now());
      return NextResponse.json({ ok: true, message: "Pago simulado. Informe enviado por email." });
    }

    if (!payment_id) {
      return NextResponse.json({ ok: false, error: "payment_id requerido" }, { status: 400 });
    }

    const client = new MercadoPagoConfig({ accessToken });
    const payment = new Payment(client);
    const paymentData = await payment.get({ id: payment_id });

    if (paymentData.status === "approved" && paymentData.external_reference === tasacionId) {
      await fulfillTasacion(tasacionId, String(payment_id));
      return NextResponse.json({ ok: true, message: "Pago confirmado. Informe enviado por email." });
    }

    return NextResponse.json({ ok: false, error: "El pago no está aprobado o no coincide el ID" }, { status: 400 });
  } catch (error) {
    console.error("Error confirmando pago:", error);
    return NextResponse.json({ ok: false, error: "Error al confirmar pago" }, { status: 500 });
  }
}
