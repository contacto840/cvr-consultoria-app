/**
 * Constantes del Módulo A — calculadora de costos reales de compra.
 *
 * Regla del encargo: cada ítem muestra su fuente y la fecha del dato, y todos
 * los porcentajes viven acá, no esparcidos por los componentes, para poder
 * actualizarlos cuando cambien.
 *
 * Nada de lo que está marcado `confirmado: false` se presenta como un arancel
 * cierto: se muestra como monto a cotizar. Un número equivocado en esta
 * herramienta es un cliente que presupuestó mal.
 */

/**
 * "confirmado": el valor sale de un dato propio o de una tasa legal cierta.
 * "estimado":   se puede calcular una cifra de referencia, pero la tasa o el
 *               tope los confirma un tercero. Suma al total, marcada como tal.
 * "pendiente":  no hay cifra; depende de un prestador. No suma al total.
 */
export type EstadoDato = "confirmado" | "estimado" | "pendiente";

export interface ItemCosto {
  id: string;
  nombre: string;
  /** Fórmula en palabras, visible en la interfaz. */
  formula: string;
  /** De dónde sale el dato. */
  fuente: string;
  /** Fecha del dato (mes de revisión), visible en la interfaz. */
  fechaDato: string;
  estado: EstadoDato;
  /** Nota visible: qué es el valor y con quién se confirma. */
  nota?: string;
  /**
   * Tasa usada en el cálculo, cuando el ítem es cuantificable.
   * `null` deja el ítem fuera del total y lo muestra "a cotizar".
   */
  tasa?: { valor: number; unidad: "%" | "mensual" };
}

/** IVA vigente en Chile. */
export const IVA = 0.19;

/** Fecha de revisión de esta tabla. Se muestra junto a cada ítem. */
export const FECHA_REVISION = "noviembre de 2026";

/**
 * Impuesto de timbres y estampillas aplicado a un crédito hipotecario.
 * Se calcula sobre el monto del crédito, no sobre el precio.
 * El tope de 90 días (3 meses) es la referencia habitual para cédulas
 * hipotecarias, pero la tasa efectiva y las exenciones las confirma el banco.
 */
export const TIMBRES = {
  tasaMensual: 0.00066, // 0,066% mensual sobre el monto del crédito
  mesesTope: 3, // tope de 90 días
  estado: "estimado" as EstadoDato,
  fuente:
    "Ley sobre Impuesto de Timbres y Estampillas. Tasa de referencia para créditos hipotecarios; el banco informa la tasa y el tope aplicables a cada operación.",
  nota: "Valor referencial: la tasa y el tope definitivos los entrega el banco al momento de la operación.",
};

export const ITEMS: ItemCosto[] = [
  {
    id: "precio",
    nombre: "Precio de la propiedad",
    formula: "Monto pactado en la promesa o escritura.",
    fuente: "Dato ingresado por el usuario.",
    fechaDato: FECHA_REVISION,
    estado: "confirmado",
  },
  {
    id: "timbres",
    nombre: "Impuesto de timbres y estampillas (solo con crédito)",
    formula:
      "Monto del crédito × 0,066% × meses de plazo, con tope de 90 días (3 meses). No se aplica si la compra es al contado.",
    fuente: TIMBRES.fuente,
    fechaDato: FECHA_REVISION,
    estado: TIMBRES.estado,
    nota: TIMBRES.nota,
  },
  {
    id: "notaria",
    nombre: "Gastos notariales",
    formula:
      "Arancel notarial según el monto del acto: el notario cobra por la escritura y por las copias. No es un porcentaje fijo.",
    fuente:
      "Arancel notarial vigente del oficio de cada notaría. Varía por notaría y por monto de la operación.",
    fechaDato: FECHA_REVISION,
    estado: "pendiente",
    nota: "Valor referencial: el arancel exacto lo entrega la notaría elegida al momento de la operación.",
  },
  {
    id: "cbr",
    nombre: "Inscripción en el Conservador de Bienes Raíces",
    formula:
      "Arancel del CBR según el monto de la compraventa y el valor de la inscripción, más el timbre del Conservador.",
    fuente:
      "Arancel del Conservador de Bienes Raíces competente. Se calcula sobre el valor de la inscripción, no sobre el precio de lista.",
    fechaDato: FECHA_REVISION,
    estado: "pendiente",
    nota: "Valor referencial: el arancel exacto lo entrega el Conservador al momento de la inscripción.",
  },
  {
    id: "corretaje",
    nombre: "Corretaje de propiedades",
    formula:
      "Precio de la propiedad × comisión pactada, más IVA 19%. La comisión se acuerda por escrito en el contrato de corretaje.",
    fuente:
      "Comisión pactada entre las partes en el contrato de corretaje; no existe una tasa legal obligatoria. IVA conforme a la tasa general vigente.",
    fechaDato: FECHA_REVISION,
    estado: "confirmado",
  },
  {
    id: "otros",
    nombre: "Certificados y trámites previos",
    formula:
      "Certificado de informaciones previas, certificado de avalúo del SII y otros certificados que pida el banco o la notaría.",
    fuente: "Valores publicados por cada municipio y por el SII para el trámite específico.",
    fechaDato: FECHA_REVISION,
    estado: "pendiente",
    nota: "Valor referencial: el monto exacto lo informa cada municipio y el SII al momento del trámite.",
  },
];

/** Comisión de corretaje por defecto: 0 para no sugerir una cifra no pactada. */
export const COMISION_SUGERIDA = 0;

export interface EntradaCalculo {
  precioCLP: number;
  conCredito: boolean;
  piePct: number; // porcentaje del precio pagado al contado (0-100)
  plazoAnios: number;
  comisionPct: number; // comisión de corretaje, sin IVA
}

export interface LineaCalculo {
  item: ItemCosto;
  montoCLP: number | null;
  detalle: string;
}

export interface ResultadoCalculo {
  lineas: LineaCalculo[];
  /** Precio mas los costos adicionales cuantificables. */
  totalCLP: number;
  /** Solo los costos adicionales, sin el precio de la propiedad. */
  totalAdicionalesCLP: number;
  pendientes: number;
  montoCreditoCLP: number;
}

export function calcularCostos(e: EntradaCalculo): ResultadoCalculo {
  const precio = Math.max(0, e.precioCLP);
  const pie = Math.min(100, Math.max(0, e.piePct)) / 100;
  const montoCredito = e.conCredito ? Math.round(precio * (1 - pie)) : 0;

  const lineas: LineaCalculo[] = ITEMS.map((item) => {
    switch (item.id) {
      case "precio":
        return { item, montoCLP: precio, detalle: "Precio pactado" };
      case "timbres": {
        if (!e.conCredito || montoCredito <= 0) {
          return { item, montoCLP: 0, detalle: "No aplica: compra al contado" };
        }
        const meses = Math.min(
          TIMBRES.mesesTope,
          Math.max(1, Math.round(e.plazoAnios * 12))
        );
        const monto = Math.round(montoCredito * TIMBRES.tasaMensual * meses);
        return {
          item,
          montoCLP: monto,
          detalle: `${meses} ${meses === 1 ? "mes" : "meses"} sobre $${montoCredito.toLocaleString("es-CL")} de crédito`,
        };
      }
      case "corretaje": {
        const comision = Math.round(precio * (Math.max(0, e.comisionPct) / 100) * (1 + IVA));
        return {
          item,
          montoCLP: comision,
          detalle:
            e.comisionPct > 0
              ? `${e.comisionPct}% + IVA 19% sobre $${precio.toLocaleString("es-CL")}`
              : "Sin comisión ingresada",
        };
      }
      default:
        return {
          item,
          montoCLP: null,
          detalle: "A cotizar con el prestador del servicio",
        };
    }
  });

  const totalCLP = lineas.reduce((acc, l) => acc + (l.montoCLP ?? 0), 0);
  // El precio no es un costo adicional: separarlo es lo unico que hace util
  // la cifra que mira el comprador.
  const totalAdicionalesCLP = lineas
    .filter((l) => l.item.id !== "precio")
    .reduce((acc, l) => acc + (l.montoCLP ?? 0), 0);
  const pendientes = lineas.filter((l) => l.montoCLP === null).length;

  return { lineas, totalCLP, totalAdicionalesCLP, pendientes, montoCreditoCLP: montoCredito };
}

export const fmtCLP = (n: number) =>
  `$${Math.round(n).toLocaleString("es-CL", { maximumFractionDigits: 0 })}`;
