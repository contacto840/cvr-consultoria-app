import { prisma } from "@/lib/prisma";
import { generateTasacionPDF } from "@/lib/pdf-generator";
import { sendEstimacionReferencial } from "@/lib/mailer";

/**
 * Cierra el pago de un encargo: marca la solicitud como pagada y envía al
 * cliente la estimación referencial automática.
 *
 * Ojo: lo que se envía es la estimación, no un informe firmado. El informe del
 * encargo lo elabora el perito y no se emite desde este flujo.
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
    // El registro guarda 0 en `estimatedValueCLP` cuando la UF no estaba
    // disponible al calcular: en ese caso el PDF se emite solo en UF.
    const tienePesos = record.estimatedValueCLP > 0 && record.estimatedValueUF > 0;
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
      // La UF usada se recupera del monto guardado; la fecha es la de la
      // solicitud, que es el día al que correspondía ese valor.
      ufValueCLP: tienePesos
        ? Math.round((record.estimatedValueCLP / record.estimatedValueUF) * 100) / 100
        : null,
      ufDate: tienePesos ? record.createdAt : null,
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
