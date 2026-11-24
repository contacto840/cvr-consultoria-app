import { prisma } from "@/lib/prisma";
import { generateTasacionPDF } from "@/lib/pdf-generator";
import { sendEstimacionReferencial } from "@/lib/mailer";

/**
 * Cierra el pago de un encargo: marca la solicitud como pagada y envía al
 * cliente la estimación referencial automática.
 *
 * Ojo: lo que se envía es la estimación, no un informe firmado. El informe del
 * encargo lo elabora el perito y no se emite desde este flujo.
 *
 * ESTADO: este camino quedó sin uso. El informe de tasación se cotiza y el
 * cobro en línea se retiró de la interfaz; /api/pagos y /api/pagos/confirmar
 * siguen existiendo, pero nada del sitio los alcanza.
 */
export async function cumplirEncargo(tasacionId: string, paymentId: string) {
  const record = await prisma.tasacionRequest.findUnique({ where: { id: tasacionId } });
  if (!record || record.paymentStatus === "paid") return;

  await prisma.tasacionRequest.update({
    where: { id: tasacionId },
    data: { paymentStatus: "paid", paymentId },
  });

  const ref =
    (record.sector
      ? await prisma.propertyData.findUnique({
          where: {
            comuna_sector_propertyType: {
              comuna: record.comuna,
              sector: record.sector,
              propertyType: record.propertyType,
            },
          },
        })
      : null) ??
    (await prisma.propertyData.findFirst({
      where: { comuna: record.comuna, propertyType: record.propertyType },
      orderBy: { sampleSize: "desc" },
    }));

  try {
    const valorM2 = record.surface > 0 ? record.estimatedValueUF / record.surface : 0;
    // La UF usada se guardó al calcular. Si falta, el PDF se emite solo en UF:
    // no se reconstruye desde el monto ni se usa la fecha de la solicitud como
    // si fuera la fecha del valor.
    const tienePesos =
      record.estimatedValueCLP !== null &&
      record.ufValueCLP !== null &&
      record.estimatedValueUF > 0;
    const pdf = await generateTasacionPDF({
      tasacionId: record.id,
      clientName: record.clientName,
      clientEmail: record.clientEmail,
      clientPhone: record.clientPhone,
      comuna: record.comuna,
      sector: record.sector,
      propertyType: record.propertyType,
      surface: record.surface,
      condition: record.condition,
      estimatedValueUF: record.estimatedValueUF,
      estimatedValueCLP: tienePesos ? record.estimatedValueCLP : null,
      minValueUF: ref?.minPricePerM2
        ? Math.round(ref.minPricePerM2 * record.surface * 100) / 100
        : Math.round(record.estimatedValueUF * 0.85 * 100) / 100,
      maxValueUF: ref?.maxPricePerM2
        ? Math.round(ref.maxPricePerM2 * record.surface * 100) / 100
        : Math.round(record.estimatedValueUF * 1.15 * 100) / 100,
      pricePerM2UF: Math.round(valorM2 * 100) / 100,
      ufValueCLP: record.ufValueCLP ?? null,
      ufDate: record.ufDate ?? null,
      referenceYear: ref?.referenceYear ?? new Date().getFullYear(),
      sampleSize: ref?.sampleSize,
      createdAt: record.createdAt,
    });

    await sendEstimacionReferencial({
      to: record.clientEmail,
      clientName: record.clientName,
      tasacionId: record.id,
      pdfBytes: pdf,
    });
  } catch (err) {
    console.error("[encargo] error generando o enviando la estimación:", err);
  }
}
