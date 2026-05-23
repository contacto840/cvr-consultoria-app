import { PDFDocument, rgb, StandardFonts, PDFFont, PDFPage } from "pdf-lib";

const GOLD = rgb(0.773, 0.659, 0.357);   // #c5a85b
const NAVY = rgb(0.020, 0.047, 0.090);   // #050c17
const DARK = rgb(0.051, 0.086, 0.149);   // #0d1624
const GRAY = rgb(0.561, 0.639, 0.737);   // #8fa3bc
const WHITE = rgb(1, 1, 1);

function drawLine(page: PDFPage, x1: number, y1: number, x2: number, y2: number, color = GOLD, thickness = 0.5) {
  page.drawLine({ start: { x: x1, y: y1 }, end: { x: x2, y: y2 }, thickness, color });
}

function drawRect(page: PDFPage, x: number, y: number, w: number, h: number, color: ReturnType<typeof rgb>) {
  page.drawRectangle({ x, y, width: w, height: h, color });
}

function truncate(text: string, maxLen: number): string {
  return text.length > maxLen ? text.slice(0, maxLen - 1) + "…" : text;
}

export interface TasacionReportData {
  tasacionId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  comuna: string;
  propertyType: string;
  surface: number;
  condition: string;
  estimatedValueUF: number;
  estimatedValueCLP: number;
  minValueUF: number;
  maxValueUF: number;
  pricePerM2UF: number;
  ufValueCLP: number;
  referenceYear: number;
  createdAt?: Date;
}

const PROPERTY_LABELS: Record<string, string> = {
  casa: "Casa Habitación",
  departamento: "Departamento",
  terreno: "Terreno Urbano",
  agricola: "Predio Agrícola / Rural",
};

const CONDITION_LABELS: Record<string, string> = {
  excelente: "Excelente — Nuevo o remodelado recientemente",
  bueno: "Bueno — Bien mantenido, pocos desperfectos",
  normal: "Normal — Estado promedio de mercado",
  regular: "Regular — Requiere reparaciones menores",
  malo: "Malo — Requiere reparaciones importantes",
};

const fmtUF = (n: number) => n.toLocaleString("es-CL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtCLP = (n: number) => n.toLocaleString("es-CL", { maximumFractionDigits: 0 });
const fmtDate = (d?: Date) => {
  const date = d ?? new Date();
  return date.toLocaleDateString("es-CL", { day: "2-digit", month: "long", year: "numeric" });
};

export async function generateTasacionPDF(data: TasacionReportData): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle(`Informe de Tasación CVR — ${data.tasacionId}`);
  doc.setAuthor("CVR Consultoría Predial");
  doc.setCreator("CVR Consultoría Predial — cvrpropiedades.com");
  doc.setSubject(`Tasación ${PROPERTY_LABELS[data.propertyType] ?? data.propertyType} — ${data.comuna}`);

  const pageWidth = 595;   // A4 portrait
  const pageHeight = 842;
  const page = doc.addPage([pageWidth, pageHeight]);

  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const oblique = await doc.embedFont(StandardFonts.HelveticaOblique);

  // ── HEADER BAND ────────────────────────────────────────────
  drawRect(page, 0, pageHeight - 90, pageWidth, 90, NAVY);
  drawRect(page, 0, pageHeight - 93, pageWidth, 3, GOLD);

  page.drawText("CVR", {
    x: 40, y: pageHeight - 52,
    size: 28, font: bold, color: WHITE,
  });
  page.drawText("Consultoría Predial", {
    x: 87, y: pageHeight - 48,
    size: 9, font: regular, color: GRAY,
  });
  page.drawText("Auditoría Técnica y Legal · Región de Ñuble, Chile", {
    x: 87, y: pageHeight - 61,
    size: 7.5, font: regular, color: GRAY,
  });

  // Report title (right aligned)
  page.drawText("INFORME OFICIAL DE TASACIÓN", {
    x: pageWidth - 240, y: pageHeight - 45,
    size: 11, font: bold, color: GOLD,
  });
  page.drawText(`Ref. ${data.tasacionId.slice(0, 16)}`, {
    x: pageWidth - 240, y: pageHeight - 61,
    size: 8, font: regular, color: GRAY,
  });
  page.drawText(`Emitido: ${fmtDate(data.createdAt)}`, {
    x: pageWidth - 240, y: pageHeight - 73,
    size: 8, font: regular, color: GRAY,
  });

  // ── SECTION: RESULTADO PRINCIPAL ───────────────────────────
  let y = pageHeight - 135;

  drawRect(page, 30, y - 90, pageWidth - 60, 95, DARK);
  drawRect(page, 30, y + 5, pageWidth - 60, 3, GOLD);

  page.drawText("VALORIZACIÓN ESTIMADA REFERENCIAL", {
    x: 50, y: y - 18,
    size: 8, font: bold, color: GOLD,
  });
  page.drawText(`${fmtUF(data.estimatedValueUF)} UF`, {
    x: 50, y: y - 48,
    size: 32, font: bold, color: WHITE,
  });
  page.drawText(`$ ${fmtCLP(data.estimatedValueCLP)} CLP`, {
    x: 50, y: y - 68,
    size: 14, font: regular, color: GRAY,
  });

  // Rango derecha
  const rightX = pageWidth - 220;
  drawLine(page, rightX - 15, y - 20, rightX - 15, y - 80, GRAY, 0.5);
  page.drawText("RANGO DE MERCADO", { x: rightX, y: y - 20, size: 7.5, font: bold, color: GRAY });
  page.drawText(`Mínimo: ${fmtUF(data.minValueUF)} UF`, { x: rightX, y: y - 38, size: 10, font: regular, color: WHITE });
  page.drawText(`Máximo: ${fmtUF(data.maxValueUF)} UF`, { x: rightX, y: y - 56, size: 10, font: regular, color: WHITE });
  page.drawText(`Precio/m²: ${fmtUF(data.pricePerM2UF)} UF`, { x: rightX, y: y - 74, size: 9, font: regular, color: GRAY });

  y -= 110;

  // ── SECTION: DATOS DE LA PROPIEDAD ─────────────────────────
  y -= 20;
  drawLine(page, 30, y, pageWidth - 30, y);
  page.drawText("DATOS DE LA PROPIEDAD", { x: 30, y: y - 16, size: 8.5, font: bold, color: GOLD });
  y -= 32;

  const col1X = 30, col2X = 310;
  const propRows: [string, string][] = [
    ["Tipo de Propiedad", PROPERTY_LABELS[data.propertyType] ?? data.propertyType],
    ["Comuna / Ubicación", `${data.comuna}, Región de Ñuble`],
    ["Superficie", `${data.propertyType === "agricola" ? (data.surface / 10000).toFixed(2) + " ha" : data.surface + " m²"}`],
    ["Estado / Condición", truncate(CONDITION_LABELS[data.condition] ?? data.condition, 40)],
  ];

  propRows.forEach(([label, value], i) => {
    const rowY = y - i * 22;
    const bg = i % 2 === 0 ? rgb(0.04, 0.08, 0.14) : rgb(0.03, 0.06, 0.11);
    drawRect(page, 30, rowY - 6, pageWidth - 60, 20, bg);
    page.drawText(label, { x: col1X + 8, y: rowY + 5, size: 8.5, font: bold, color: GRAY });
    page.drawText(truncate(value, 50), { x: col2X, y: rowY + 5, size: 8.5, font: regular, color: WHITE });
  });

  y -= propRows.length * 22 + 20;

  // ── SECTION: DATOS DEL SOLICITANTE ─────────────────────────
  drawLine(page, 30, y, pageWidth - 30, y);
  page.drawText("DATOS DEL SOLICITANTE", { x: 30, y: y - 16, size: 8.5, font: bold, color: GOLD });
  y -= 32;

  const clientRows: [string, string][] = [
    ["Nombre completo", truncate(data.clientName, 45)],
    ["Correo electrónico", truncate(data.clientEmail, 45)],
    ["Teléfono de contacto", data.clientPhone],
  ];

  clientRows.forEach(([label, value], i) => {
    const rowY = y - i * 22;
    const bg = i % 2 === 0 ? rgb(0.04, 0.08, 0.14) : rgb(0.03, 0.06, 0.11);
    drawRect(page, 30, rowY - 6, pageWidth - 60, 20, bg);
    page.drawText(label, { x: col1X + 8, y: rowY + 5, size: 8.5, font: bold, color: GRAY });
    page.drawText(truncate(value, 50), { x: col2X, y: rowY + 5, size: 8.5, font: regular, color: WHITE });
  });

  y -= clientRows.length * 22 + 20;

  // ── SECTION: METODOLOGÍA ───────────────────────────────────
  drawLine(page, 30, y, pageWidth - 30, y);
  page.drawText("METODOLOGÍA Y VALIDEZ", { x: 30, y: y - 16, size: 8.5, font: bold, color: GOLD });
  y -= 32;

  const metodRows = [
    "Este informe fue elaborado bajo los criterios de la Norma Chilena NCh 3658 de Tasación de Bienes",
    `Raíces vigente. Los valores de referencia corresponden a datos de mercado del año ${data.referenceYear}`,
    "para la Región de Ñuble, actualizados periódicamente por CVR Consultoría Predial.",
    "",
    "La valorización presentada es de carácter referencial y comercial. Para efectos de créditos",
    "hipotecarios, herencias o compraventas formales, la firma del perito acredita el documento.",
  ];

  metodRows.forEach((line, i) => {
    if (line) {
      page.drawText(line, { x: 30, y: y - i * 13, size: 8, font: regular, color: GRAY });
    }
  });

  y -= metodRows.length * 13 + 25;

  // ── DISCLAIMER BOX ─────────────────────────────────────────
  drawRect(page, 30, y - 42, pageWidth - 60, 46, rgb(0.08, 0.13, 0.20));
  drawRect(page, 30, y + 4, 4, 46, GOLD);
  page.drawText("IMPORTANTE", { x: 40, y: y - 10, size: 8, font: bold, color: GOLD });
  page.drawText("Los valores expresados son estimaciones referenciales basadas en datos comparativos de", {
    x: 40, y: y - 24, size: 7.5, font: regular, color: GRAY,
  });
  page.drawText("mercado. No constituyen una oferta de compra ni reemplazan una tasación formal in situ.", {
    x: 40, y: y - 36, size: 7.5, font: regular, color: GRAY,
  });

  y -= 70;

  // ── FIRMA DEL PERITO ───────────────────────────────────────
  drawLine(page, 30, y, pageWidth - 30, y, GRAY, 0.3);
  y -= 20;

  // Firma izquierda
  drawLine(page, 30, y - 30, 200, y - 30, GRAY, 0.5);
  page.drawText("Carlos Vivanco R.", { x: 30, y: y - 44, size: 9, font: bold, color: WHITE });
  page.drawText("Perito Tasador Certificado", { x: 30, y: y - 56, size: 7.5, font: regular, color: GRAY });
  page.drawText("CVR Consultoría Predial", { x: 30, y: y - 68, size: 7.5, font: regular, color: GRAY });

  // Sello derecha
  const selloX = pageWidth - 180;
  page.drawText("EMITIDO POR", { x: selloX, y: y - 15, size: 7, font: bold, color: GOLD });
  page.drawText("CVR Consultoría Predial", { x: selloX, y: y - 28, size: 8.5, font: bold, color: WHITE });
  page.drawText("contacto@cvrpropiedades.com", { x: selloX, y: y - 41, size: 7, font: regular, color: GRAY });
  page.drawText("+56 9 3868 9157", { x: selloX, y: y - 54, size: 7, font: regular, color: GRAY });
  page.drawText("Chillán, Región de Ñuble", { x: selloX, y: y - 67, size: 7, font: regular, color: GRAY });

  // ── FOOTER ─────────────────────────────────────────────────
  drawRect(page, 0, 0, pageWidth, 28, NAVY);
  page.drawText("CVR Consultoría Predial · Chillán, Región de Ñuble, Chile · cvrpropiedades.com", {
    x: 30, y: 10, size: 7, font: regular, color: GRAY,
  });
  page.drawText(`Pág. 1 de 1`, { x: pageWidth - 60, y: 10, size: 7, font: regular, color: GRAY });

  return doc.save();
}
