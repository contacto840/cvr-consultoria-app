/**
 * Valor de la UF del día — fuente oficial.
 *
 * FUENTE: Servicio de Impuestos Internos (SII), página oficial de valores y
 * fechas de la UF: https://www.sii.cl/valores_y_fechas/uf/uf<AAAA>.htm
 * (por ejemplo, https://www.sii.cl/valores_y_fechas/uf/uf2026.htm).
 *
 * No exige clave, token ni API: es la página pública del SII. Se lee la tabla
 * `id="table_export"` (días en filas, meses en columnas) y se toma el valor
 * publicado para la fecha de hoy en Chile. Si esa fecha todavía no está
 * publicada, se usa el último valor publicado con fecha anterior o igual a hoy
 * y se informa ESA fecha, nunca la de hoy.
 *
 * Cuando la fuente no responde, cambia de formato o no trae un valor
 * utilizable, la función devuelve `null`. No hay respaldo con un agregador ni
 * con una constante: quien consume esto debe mostrar solo UF y decir que la
 * conversión a pesos no está disponible.
 *
 * Caché: el `fetch` pide revalidación cada 24 h (REVALIDACION_SEGUNDOS), de
 * modo que la fuente se consulta una vez al día y no en cada visita. Si falla,
 * se reintenta a lo más una vez cada ESPERA_TRAS_FALLO_MS por instancia, para
 * no martillar al SII mientras está caído.
 */

export interface UfDelDia {
  /** Valor de la UF en pesos, con sus dos decimales oficiales. */
  valorCLP: number;
  /** Fecha a la que corresponde el valor, en formato ISO `AAAA-MM-DD`. */
  fecha: string;
}

const FUENTE_BASE = "https://www.sii.cl/valores_y_fechas/uf/";
const ZONA_HORARIA = "America/Santiago";
const REVALIDACION_SEGUNDOS = 86_400;
const ESPERA_TRAS_FALLO_MS = 5 * 60 * 1000;
const TIMEOUT_MS = 8_000;

const MESES: Record<string, number> = {
  ene: 1,
  feb: 2,
  mar: 3,
  abr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  ago: 8,
  sep: 9,
  set: 9, // algunas versiones de la página usan "Set"
  oct: 10,
  nov: 11,
  dic: 12,
};

let ultimoFallo = 0;

function texto(celda: string): string {
  return celda
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&aacute;/gi, "á")
    .replace(/&eacute;/gi, "é")
    .replace(/&iacute;/gi, "í")
    .replace(/&oacute;/gi, "ó")
    .replace(/&uacute;/gi, "ú")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function sinAcentos(valor: string): string {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/** Convierte "39.731,79" o "39731.79" en 39731.79. Devuelve null si no es un precio. */
function precio(celda: string): number | null {
  const limpio = texto(celda);
  if (!limpio) return null;
  const normalizado = limpio.includes(",")
    ? limpio.replace(/\./g, "").replace(",", ".")
    : limpio;
  const n = Number(normalizado);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/**
 * Fecha de hoy en Chile. El servidor puede correr en UTC, así que la fecha no
 * se toma del reloj local del proceso.
 */
export function fechaEnChile(ahora: Date = new Date()): { anio: number; iso: string } {
  const partes = new Intl.DateTimeFormat("en-CA", {
    timeZone: ZONA_HORARIA,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(ahora);

  const valor = (tipo: string) => partes.find((p) => p.type === tipo)?.value ?? "";
  const anio = Number(valor("year"));
  const mes = valor("month");
  const dia = valor("day");
  return { anio, iso: `${anio}-${mes}-${dia}` };
}

/**
 * Extrae de la página del SII un mapa `AAAA-MM-DD -> valor UF`.
 *
 * La página trae más de una tabla con el mismo id; se recorren todas y se usa
 * la que tenga el encabezado de doce meses y filas con doce celdas. Si el
 * formato cambia, el mapa queda vacío y la conversión se informa como no
 * disponible en vez de mostrar una cifra dudosa.
 */
export function parsearTablaUf(html: string, anio: number): Map<string, number> {
  const mapa = new Map<string, number>();
  const tablas = html.matchAll(
    /<table[^>]*id=["']table_export["'][^>]*>([\s\S]*?)<\/table>/gi
  );

  for (const tabla of tablas) {
    const contenido = tabla[1];
    const thead = contenido.match(/<thead[^>]*>([\s\S]*?)<\/thead>/i);
    if (!thead) continue;

    const encabezados = [...thead[1].matchAll(/<th[^>]*>([\s\S]*?)<\/th>/gi)]
      .map((m) => sinAcentos(texto(m[1])))
      .slice(1); // la primera columna es "Día"
    const meses = encabezados.map((e) => MESES[e.slice(0, 3)] ?? 0);
    if (meses.length < 12 || meses.some((m) => m === 0)) continue;

    const tbody = contenido.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i);
    if (!tbody) continue;

    for (const fila of tbody[1].matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)) {
      const diaTexto = fila[1].match(/<th[^>]*>([\s\S]*?)<\/th>/i);
      const dia = diaTexto ? Number(texto(diaTexto[1])) : NaN;
      if (!Number.isInteger(dia) || dia < 1 || dia > 31) continue;

      const celdas = [...fila[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)];
      if (celdas.length < 12) continue;

      celdas.slice(0, 12).forEach((celda, i) => {
        const valor = precio(celda[1]);
        if (valor === null) return;
        const mes = String(meses[i]).padStart(2, "0");
        mapa.set(`${anio}-${mes}-${String(dia).padStart(2, "0")}`, valor);
      });
    }

    if (mapa.size > 0) return mapa;
  }

  return mapa;
}

/** Última fecha del mapa que sea anterior o igual a `hasta` (ISO). */
export function fechaMasRecienteHasta(mapa: Map<string, number>, hasta: string): string | null {
  let elegida: string | null = null;
  for (const fecha of mapa.keys()) {
    if (fecha <= hasta && (elegida === null || fecha > elegida)) elegida = fecha;
  }
  return elegida;
}

async function descargarTabla(anio: number): Promise<string> {
  const res = await fetch(`${FUENTE_BASE}uf${anio}.htm`, {
    headers: {
      // La página del SII rechaza clientes sin identificación.
      "User-Agent": "CVR-Propiedades/1.0 (+https://cvrpropiedades.cl)",
    },
    // Una consulta al día; la tabla publica el mes completo por adelantado.
    next: { revalidate: REVALIDACION_SEGUNDOS, tags: ["uf-sii"] },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!res.ok) throw new Error(`El SII respondió ${res.status}`);

  const html = await res.text();
  if (!html.includes("table_export")) {
    throw new Error("La página del SII no trae la tabla de UF esperada.");
  }
  return html;
}

/**
 * Valor de la UF vigente para hoy en Chile, desde el SII.
 * Devuelve null si no se puede obtener: nunca inventa ni recicla un valor.
 */
export async function obtenerUfDelDia(ahora: Date = new Date()): Promise<UfDelDia | null> {
  const reloj = Date.now();
  if (ultimoFallo > 0 && reloj - ultimoFallo < ESPERA_TRAS_FALLO_MS) return null;

  const hoy = fechaEnChile(ahora);

  try {
    const html = await descargarTabla(hoy.anio);
    const mapa = parsearTablaUf(html, hoy.anio);
    const fecha = fechaMasRecienteHasta(mapa, hoy.iso);
    const valorCLP = fecha ? mapa.get(fecha) : undefined;

    if (!fecha || valorCLP === undefined) {
      ultimoFallo = reloj;
      return null;
    }

    ultimoFallo = 0;
    return { valorCLP, fecha };
  } catch (error) {
    console.error("[uf] no se pudo obtener el valor desde el SII:", error);
    ultimoFallo = reloj;
    return null;
  }
}
