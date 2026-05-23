import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { generateTasacionPDF } from "@/lib/pdf-generator";
import { sendTasacionReport } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const topic = url.searchParams.get("topic") || url.searchParams.get("type");
    const id = url.searchParams.get("id") || url.searchParams.get("data.id");
    const body = await req.json().catch(() => ({}));

    const paymentId = id || body?.data?.id;
    const resourceType = topic || body?.type;

    if (resourceType === "payment" && paymentId) {
      const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
      if (accessToken && accessToken !== "TEST-123456789") {
        const client = new MercadoPagoConfig({ accessToken });
        const payment = new Payment(client);
        const paymentData = await payment.get({ id: paymentId });

        if (paymentData.status === "approved") {
          const tasacionId = paymentData.external_reference;
          if (tasacionId) {
            const record = await prisma.tasacionRequest.findUnique({ where: { id: tasacionId } });

            if (record && record.paymentStatus !== "paid") {
              await prisma.tasacionRequest.update({
                where: { id: tasacionId },
                data: { paymentStatus: "paid", paymentId: String(paymentId) },
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
                console.error("[webhook] PDF/email error:", err);
              }
            }
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
