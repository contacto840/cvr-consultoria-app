import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import type { PDFPage, PDFFont } from "pdf-lib";

/**
 * Estimación referencial de valor.
 *
 * Este documento NO es un informe de tasación. Lo genera una consulta a una
 * tabla de valores de referencia por comuna, sector y tipo de propiedad, sin
 * inspección del inmueble y sin revisión de una persona. Por eso:
 *
 *  - se titula "ESTIMACIÓN REFERENCIAL DE VALOR" y nunca "oficial";
 *  - no invoca la NCh 3658 ni ninguna otra norma de tasación, porque no se aplicó;
 *  - no lleva firma ni la describe como documento firmado;
 *  - declara en el encabezado para qué no sirve.
 *
 * El informe firmado es otro producto, se trabaja a mano y vive en la línea de
 * tasaciones y peritajes.
 */

const GOLD = rgb(0.788, 0.659, 0.298); // #c9a84c
const NAVY = rgb(0.020, 0.047, 0.09); // #050c17
const DARK = rgb(0.051, 0.086, 0.149); // #0d1624
const GRAY = rgb(0.561, 0.639, 0.737); // #8fa3bc
const WHITE = rgb(1, 1, 1);

const UF = (n: number) =>
  n.toLocaleString("es-CL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const CLP = (n: number) =>
  n.toLocaleString("es-CL", { maximumFractionDigits: 0 });
const fecha = (d?: Date) =>
  (d ?? new Date()).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

/** Fecha en horario de Chile, para no correr el día cuando el servidor corre en UTC. */
const fechaChile = (d: Date) =>
  d.toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Santiago",
  });

function rect(page: PDFPage, x: number, y: number, w: number, h: number, color: ReturnType<typeof rgb>) {
  page.drawRectangle({ x, y, width: w, height: h, color });
}

function line(page: PDFPage, x1: number, y1: number, x2: number, y2: number, color = GOLD, thickness = 0.5) {
  page.drawLine({ start: { x: x1, y: y1 }, end: { x: x2, y: y2 }, thickness, color });
}

/** Ajusta texto al ancho disponible midiendo la fuente y dibuja cada línea. */
function paragraph(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  font: PDFFont,
  size: number,
  color: ReturnType<typeof rgb>,
  maxWidth: number,
  leading: number
): number {
  const palabras = text.split(" ");
  const lineas: string[] = [];
  let actual = "";
  for (const p of palabras) {
    const prueba = actual ? `${actual} ${p}` : p;
    if (font.widthOfTextAtSize(prueba, size) > maxWidth && actual) {
      lineas.push(actual);
      actual = p;
    } else {
      actual = prueba;
    }
  }
  if (actual) lineas.push(actual);
  lineas.forEach((l, i) => {
    page.drawText(l, { x, y: y - i * leading, size, font, color });
  });
  return y - (lineas.length - 1) * leading;
}

const TIPO: Record<string, string> = {
  casa: "Casa habitación",
  departamento: "Departamento",
  terreno: "Terreno urbano",
  agricola: "Predio agrícola / rural",
};

const ESTADO: Record<string, string> = {
  excelente: "Excelente",
  bueno: "Bueno",
  normal: "Normal",
  regular: "Regular",
  malo: "Malo",
};

export interface EstimacionData {
  tasacionId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  comuna: string;
  sector?: string;
  propertyType: string;
  surface: number; // m²
  condition: string;
  estimatedValueUF: number;
  /** null cuando no se pudo obtener el valor oficial de la UF: el PDF va solo en UF. */
  estimatedValueCLP: number | null;
  minValueUF: number;
  maxValueUF: number;
  pricePerM2UF: number;
  ufValueCLP: number | null;
  /** Fecha a la que correspondía el valor de la UF usado en el cálculo. */
  ufDate?: Date | null;
  referenceYear: number;
  sampleSize?: number;
  createdAt?: Date;
}

export async function generateTasacionPDF(data: EstimacionData): Promise<Uint8Array> {
  const doc = await PDFDocument.create();

  doc.setTitle("Estimación referencial de valor — CVR Propiedades");
  doc.setAuthor("CVR Propiedades SpA");
  doc.setCreator("CVR Propiedades — cvrpropiedades.cl");
  doc.setSubject(
    `Estimación referencial de valor: ${TIPO[data.propertyType] ?? data.propertyType} en ${data.comuna}`
  );
  doc.setKeywords(["estimación referencial", "valor de mercado", "CVR Propiedades", "Ñuble"]);

  const W = 595;
  const H = 842;
  const page = doc.addPage([W, H]);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const italic = await doc.embedFont(StandardFonts.HelveticaOblique);

  // Solo se muestra una cifra en pesos si además se conoce la UF usada: una
  // cifra sin su UF y su fecha no es auditable.
  const conversion =
    data.estimatedValueCLP !== null && data.ufValueCLP !== null
      ? { clp: data.estimatedValueCLP, uf: data.ufValueCLP }
      : null;

  // ── ENCABEZADO ──────────────────────────────────────────────
  rect(page, 0, H - 86, W, 86, NAVY);
  rect(page, 0, H - 89, W, 3, GOLD);

  page.drawText("CVR", { x: 30, y: H - 44, size: 26, font: bold, color: WHITE });
  page.drawText("Propiedades", { x: 78, y: H - 41, size: 9, font: regular, color: GRAY });
  page.drawText("Chillán · Región de Ñuble · Chile", {
    x: 78,
    y: H - 55,
    size: 7.5,
    font: regular,
    color: GRAY,
  });

  page.drawText("ESTIMACIÓN REFERENCIAL DE VALOR", {
    x: W - 30 - bold.widthOfTextAtSize("ESTIMACIÓN REFERENCIAL DE VALOR", 10),
    y: H - 40,
    size: 10,
    font: bold,
    color: GOLD,
  });
  const ref = `Ref. ${data.tasacionId.slice(0, 18)}`;
  page.drawText(ref, { x: W - 30 - regular.widthOfTextAtSize(ref, 8), y: H - 55, size: 8, font: regular, color: GRAY });
  const emitido = `Emitido: ${fecha(data.createdAt)}`;
  page.drawText(emitido, {
    x: W - 30 - regular.widthOfTextAtSize(emitido, 8),
    y: H - 68,
    size: 8,
    font: regular,
    color: GRAY,
  });

  // ── DESCARGO EN EL ENCABEZADO ───────────────────────────────
  let y = H - 104;
  rect(page, 30, y - 56, W - 60, 60, rgb(0.08, 0.13, 0.2));
  rect(page, 30, y - 56, 4, 60, GOLD);
  page.drawText("LEA ESTO PRIMERO", { x: 42, y: y - 11, size: 8, font: bold, color: GOLD });
  paragraph(
    page,
    "Esta estimación no es una tasación. Es un cálculo automático, sin inspección del inmueble y sin revisión de un profesional, que no sirve para trámites bancarios, judiciales, hereditarios ni de compraventa.",
    42,
    y - 25,
    regular,
    8,
    WHITE,
    515,
    10
  );
  paragraph(
    page,
    "Para esos efectos se requiere un informe de tasación con inspección y firma.",
    42,
    y - 45,
    bold,
    8,
    GOLD,
    515,
    10
  );

  // ── RESULTADO ───────────────────────────────────────────────
  y -= 82;
  rect(page, 30, y - 78, W - 60, 78, DARK);
  rect(page, 30, y + 2, W - 60, 3, GOLD);
  page.drawText("VALOR ESTIMADO (REFERENCIAL)", { x: 44, y: y - 16, size: 8, font: bold, color: GOLD });
  page.drawText(`${UF(data.estimatedValueUF)} UF`, { x: 44, y: y - 44, size: 26, font: bold, color: WHITE });
  if (conversion) {
    page.drawText(`$ ${CLP(conversion.clp)} CLP`, { x: 44, y: y - 62, size: 11, font: regular, color: GRAY });
  } else {
    page.drawText("Conversión a pesos no disponible en este momento", {
      x: 44,
      y: y - 62,
      size: 9,
      font: regular,
      color: GRAY,
    });
  }

  const rx = W - 205;
  line(page, rx - 12, y - 14, rx - 12, y - 68, GRAY, 0.4);
  page.drawText("RANGO DE REFERENCIA", { x: rx, y: y - 16, size: 7.5, font: bold, color: GRAY });
  page.drawText(`Mínimo: ${UF(data.minValueUF)} UF`, { x: rx, y: y - 32, size: 9.5, font: regular, color: WHITE });
  page.drawText(`Máximo: ${UF(data.maxValueUF)} UF`, { x: rx, y: y - 47, size: 9.5, font: regular, color: WHITE });
  page.drawText(`Referencia: ${UF(data.pricePerM2UF)} UF/m²`, {
    x: rx,
    y: y - 62,
    size: 8,
    font: regular,
    color: GRAY,
  });

  // ── DATOS DE LA PROPIEDAD ───────────────────────────────────
  y -= 100;
  line(page, 30, y, W - 30, y);
  page.drawText("DATOS DECLARADOS DE LA PROPIEDAD", { x: 30, y: y - 15, size: 8.5, font: bold, color: GOLD });
  y -= 30;

  const filas: [string, string][] = [
    ["Tipo", TIPO[data.propertyType] ?? data.propertyType],
    ["Ubicación", `${data.sector ? data.sector + ", " : ""}${data.comuna}, Región de Ñuble`],
    [
      "Superficie",
      data.propertyType === "agricola"
        ? `${(data.surface / 10000).toFixed(2)} ha (${CLP(data.surface)} m²)`
        : `${CLP(data.surface)} m²`,
    ],
    ["Estado declarado", ESTADO[data.condition] ?? data.condition],
  ];

  filas.forEach(([k, v], i) => {
    const fy = y - i * 20;
    rect(page, 30, fy - 5, W - 60, 18, i % 2 === 0 ? rgb(0.04, 0.08, 0.14) : rgb(0.03, 0.06, 0.11));
    page.drawText(k, { x: 38, y: fy + 3, size: 8.5, font: bold, color: GRAY });
    page.drawText(v.length > 62 ? v.slice(0, 61) + "…" : v, { x: 150, y: fy + 3, size: 8.5, font: regular, color: WHITE });
  });

  // ── SOLICITANTE ─────────────────────────────────────────────
  y -= filas.length * 20 + 22;
  line(page, 30, y, W - 30, y);
  page.drawText("SOLICITANTE", { x: 30, y: y - 15, size: 8.5, font: bold, color: GOLD });
  y -= 30;

  const cliente: [string, string][] = [
    ["Nombre", data.clientName],
    ["Correo", data.clientEmail],
    ["Teléfono", data.clientPhone],
  ];
  cliente.forEach(([k, v], i) => {
    const fy = y - i * 18;
    page.drawText(k, { x: 38, y: fy, size: 8.5, font: bold, color: GRAY });
    page.drawText(v.length > 70 ? v.slice(0, 69) + "…" : v, { x: 150, y: fy, size: 8.5, font: regular, color: WHITE });
  });
  page.drawText("Datos entregados por el solicitante. No fueron verificados.", {
    x: 38,
    y: y - 52,
    size: 7,
    font: italic,
    color: GRAY,
  });

  // ── METODOLOGÍA ─────────────────────────────────────────────
  y -= 74;
  line(page, 30, y, W - 30, y);
  page.drawText("CÓMO SE CALCULÓ ESTE VALOR", { x: 30, y: y - 15, size: 8.5, font: bold, color: GOLD });
  y -= 28;

  const muestra = data.sampleSize ? `${data.sampleSize} registros` : "muestra no informada";
  const metodo =
    `Valor estimado = superficie × precio de referencia por m² × factor de estado de conservación` +
    (data.propertyType === "casa" || data.propertyType === "departamento"
      ? " × factor de antigüedad"
      : "") +
    `. El precio de referencia corresponde a valores de mercado por comuna, sector y tipo de propiedad, ` +
    `del año ${data.referenceYear}, con una muestra de ${muestra}.`;

  y = paragraph(page, metodo, 30, y, regular, 8, GRAY, 535, 11);

  y -= 12;
  if (conversion) {
    const fechaUf = data.ufDate ? ` (UF del ${fechaChile(data.ufDate)})` : "";
    y = paragraph(
      page,
      `El equivalente en pesos se calcula con el valor de la UF aplicado en el cálculo: $${UF(
        conversion.uf
      )} por UF${fechaUf}. Ese valor lo publica el Servicio de Impuestos Internos; la UF cambia todos los días.`,
      30,
      y,
      regular,
      8,
      GRAY,
      535,
      11
    );
  } else {
    y = paragraph(
      page,
      "No se incluye equivalente en pesos: el valor oficial de la UF no estaba disponible al generar esta estimación, que se expresa solo en UF.",
      30,
      y,
      regular,
      8,
      GRAY,
      535,
      11
    );
  }

  y -= 14;
  y = paragraph(
    page,
    "Lo que este cálculo no hace: no inspecciona el inmueble, no verifica la superficie ni el estado declarado, no homologa comparables, no revisa títulos, cargas ni derechos de agua y no aplica una norma de tasación.",
    30,
    y,
    regular,
    8,
    GRAY,
    535,
    11
  );

  // ── EMISOR (sin firma) ──────────────────────────────────────
  y -= 18;
  line(page, 30, y, W - 30, y, GRAY, 0.3);
  y -= 16;
  page.drawText("EMITIDO POR EL SISTEMA DE CVR PROPIEDADES", {
    x: 30,
    y,
    size: 7,
    font: bold,
    color: GOLD,
  });
  page.drawText("CVR Propiedades SpA · RUT 78.342.064-3 · Chillán, Región de Ñuble", {
    x: 30,
    y: y - 12,
    size: 7.5,
    font: regular,
    color: WHITE,
  });
  page.drawText(
    "Documento generado automáticamente. No lleva firma ni representa la opinión de un profesional.",
    { x: 30, y: y - 24, size: 7, font: italic, color: GRAY }
  );

  // ── PIE ─────────────────────────────────────────────────────
  rect(page, 0, 0, W, 30, NAVY);
  page.drawText("CVR Propiedades SpA · RUT 78.342.064-3 · cvrpropiedades.cl", {
    x: 30,
    y: 12,
    size: 7,
    font: regular,
    color: GRAY,
  });
  const pag = "Pág. 1 de 1";
  page.drawText(pag, { x: W - 30 - regular.widthOfTextAtSize(pag, 7), y: 12, size: 7, font: regular, color: GRAY });

  return doc.save();
}
