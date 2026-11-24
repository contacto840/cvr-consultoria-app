/**
 * Tabla de honorarios de CVR Propiedades.
 *
 * Una sola fuente de verdad: la página /honorarios y las menciones de cada
 * página de servicio leen de acá. Cambiar un honorario es cambiar una línea.
 *
 * Reglas editoriales que sostiene este archivo:
 *  - el IVA se declara siempre y por separado;
 *  - "desde" es un mínimo real, no un gancho;
 *  - los recargos, si existen, van en la tabla y no en letra chica;
 *  - no hay precios tachados, ofertas, "antes/ahora" ni cuenta regresiva.
 *
 * Los porcentajes son los que Carlos fijó para la operación chilena. No se
 * deducen ni se "mejoran" acá.
 */

export const IVA_TASA = 0.19;

export interface Honorario {
  id: string;
  servicio: string;
  /** Qué cubre el honorario, en una frase verificable. */
  incluye: string;
  /** Qué variable manda en el precio. */
  determina: string;
  /** Texto exacto que se publica en la columna Honorario. */
  honorario: string;
  /** Mínimo en UF cuando el honorario parte "desde" un valor fijo. */
  ufMinima?: number;
}

export const HONORARIOS: Honorario[] = [
  {
    id: "venta",
    servicio: "Venta de propiedades",
    incluye:
      "Fijación del precio con comparables, ficha técnica, difusión, filtro de compradores, visitas, negociación y coordinación hasta la inscripción.",
    determina: "El precio final de venta. Se paga contra la escritura.",
    honorario: "2% + IVA del precio de venta, por parte",
  },
  {
    id: "arriendo",
    servicio: "Arriendo",
    incluye:
      "Verificación del arrendatario, contrato, inventario y acta de entrega.",
    determina: "La primera renta mensual pactada en el contrato.",
    honorario: "50% de la primera renta + IVA, por parte",
  },
  {
    id: "administracion",
    servicio: "Administración mensual",
    incluye:
      "Cobranza, liquidación mensual al propietario, coordinación de mantenciones y renovaciones.",
    determina: "La renta mensual vigente.",
    honorario: "8% de la renta mensual + IVA",
  },
  {
    id: "asesoria",
    servicio: "Asesoría de compra",
    incluye:
      "Revisión documental previa a la promesa, coordinación de estudio de títulos y due diligence, y conducción de la operación hasta la inscripción.",
    determina:
      "El alcance del encargo, no el precio de la propiedad: es un honorario fijo.",
    honorario: "Honorario fijo desde 12 UF + IVA",
    ufMinima: 12,
  },
  {
    id: "corredores",
    servicio: "Corredores asociados",
    incluye:
      "Trabajo conjunto de la operación, con respaldo técnico y documental.",
    determina: "La comisión que corresponde a la parte aportada.",
    honorario: "Reparto 50/50 de la comisión de la parte aportada",
  },
];

/** Búsqueda por id para las páginas de servicio. Falla ruidosamente si falta. */
export function honorarioDe(id: string): Honorario {
  const h = HONORARIOS.find((item) => item.id === id);
  if (!h) throw new Error(`Honorario desconocido: ${id}`);
  return h;
}
