import { SITE } from "./site";

/**
 * Módulo B — diagnóstico de riesgo de un predio en diez preguntas.
 *
 * No emite veredicto legal: entrega señales de alerta por área y recomienda qué
 * revisar. Cada área enlaza al informe que corresponde en cvrtasaciones.cl.
 */

export type AreaId =
  | "dominio"
  | "sucesion"
  | "agua"
  | "servidumbres"
  | "construcciones"
  | "deslindes"
  | "cargas"
  | "uso-suelo"
  | "copropiedad"
  | "ocupacion";

export type Respuesta = "si" | "no" | "nose";

export interface Pregunta {
  id: string;
  area: AreaId;
  texto: string;
  /** Texto de ayuda: por qué importa. */
  ayuda: string;
  /** La respuesta que enciende la alerta. */
  alertaEn: "si" | "no";
}

export interface Area {
  id: AreaId;
  nombre: string;
  /** Qué se revisa y por qué. */
  explicacion: string;
  /** Informe recomendado cuando hay alerta. */
  informe: { titulo: string; url: string };
}

export const AREAS: Record<AreaId, Area> = {
  dominio: {
    id: "dominio",
    nombre: "Dominio e inscripción",
    explicacion:
      "El dominio vigente y su inscripción en el Conservador de Bienes Raíces determinan quién puede vender. Un título no inscrito o una cadena con saltos es la alerta más grave del listado.",
    informe: { titulo: "Estudio de títulos", url: SITE.tasaciones.estudioTitulos },
  },
  sucesion: {
    id: "sucesion",
    nombre: "Herencia y sucesión",
    explicacion:
      "Si el inmueble viene de una herencia sin posesión efectiva inscrita, los herederos pueden aparecer después de la compra. Se revisa la inscripción especial de herencia y la inscripción a nombre de todos los adjudicatarios.",
    informe: { titulo: "Paquete hereditario", url: SITE.tasaciones.paqueteHereditario },
  },
  agua: {
    id: "agua",
    nombre: "Derechos de agua",
    explicacion:
      "En predios rurales el agua puede estar separada del suelo. Los derechos de aprovechamiento se inscriben en el Registro de Aguas del CBR y en la Dirección General de Aguas; si no están en la escritura, no se están comprando.",
    informe: { titulo: "Matriz de riesgo hídrico", url: SITE.tasaciones.riesgoHidrico },
  },
  servidumbres: {
    id: "servidumbres",
    nombre: "Servidumbres y gravámenes",
    explicacion:
      "Una servidumbre de tránsito, de acueducto o eléctrica puede limitar el uso del predio y no siempre aparece en la publicidad de la venta. Se revisa en el certificado de gravámenes y en el título.",
    informe: { titulo: "Due diligence", url: SITE.tasaciones.dueDiligence },
  },
  construcciones: {
    id: "construcciones",
    nombre: "Construcciones y recepción municipal",
    explicacion:
      "Ampliaciones sin permiso ni recepción final pueden impedir la inscripción, el crédito hipotecario o el cambio de uso. La regularización tiene costo y plazo propios.",
    informe: { titulo: "Due diligence", url: SITE.tasaciones.dueDiligence },
  },
  deslindes: {
    id: "deslindes",
    nombre: "Deslindes y cabida",
    explicacion:
      "Los deslindes escriturados deben coincidir con el terreno que se muestra. Diferencias de cabida o deslindes imprecisos obligan a revisar planos y, a veces, a rectificar la inscripción.",
    informe: { titulo: "Estudio de títulos", url: SITE.tasaciones.estudioTitulos },
  },
  cargas: {
    id: "cargas",
    nombre: "Hipotecas, prohibiciones y embargos",
    explicacion:
      "El certificado de gravámenes muestra hipotecas, prohibiciones de enajenar y embargos. Una hipoteca que no se alza antes de la escritura queda sobre el inmueble que usted compra.",
    informe: { titulo: "Estudio de títulos", url: SITE.tasaciones.estudioTitulos },
  },
  "uso-suelo": {
    id: "uso-suelo",
    nombre: "Uso de suelo y plan regulador",
    explicacion:
      "El certificado de informaciones previas indica qué se puede hacer en el predio. Comprar para un proyecto que la zonificación no permite es un costo irrecuperable.",
    informe: { titulo: "Due diligence", url: SITE.tasaciones.dueDiligence },
  },
  copropiedad: {
    id: "copropiedad",
    nombre: "Copropiedad y régimen de condominio",
    explicacion:
      "Si el inmueble pertenece a varias personas, la venta necesita la voluntad de todas o un mandato válido. En condominios se revisan además gastos comunes y reglamento.",
    informe: { titulo: "Estudio de títulos", url: SITE.tasaciones.estudioTitulos },
  },
  ocupacion: {
    id: "ocupacion",
    nombre: "Ocupantes y arriendos vigentes",
    explicacion:
      "Un arriendo inscrito o un ocupante con contrato puede sobrevivir a la compra. La entrega material del inmueble es parte del negocio y se acuerda por escrito.",
    informe: { titulo: "Due diligence", url: SITE.tasaciones.dueDiligence },
  },
};

export const PREGUNTAS: Pregunta[] = [
  {
    id: "p1",
    area: "dominio",
    texto: "¿La propiedad está inscrita a nombre del vendedor en el Conservador de Bienes Raíces?",
    ayuda: "Pida el certificado de dominio vigente y compare el nombre y el rol de avalúo.",
    alertaEn: "no",
  },
  {
    id: "p2",
    area: "sucesion",
    texto: "¿La propiedad llega al vendedor por una herencia?",
    ayuda: "En herencias se revisa la posesión efectiva y la inscripción a nombre de los herederos.",
    alertaEn: "si",
  },
  {
    id: "p3",
    area: "cargas",
    texto: "¿Sabe si la propiedad tiene hipoteca, prohibición de enajenar o embargo vigente?",
    ayuda: "El certificado de gravámenes e interdicciones se pide antes de firmar la promesa.",
    alertaEn: "no",
  },
  {
    id: "p4",
    area: "agua",
    texto: "Si es un predio rural: ¿los derechos de agua están incluidos y acreditados en la escritura?",
    ayuda: "Marque «no sé» si no ha visto el título de aguas ni su inscripción.",
    alertaEn: "no",
  },
  {
    id: "p5",
    area: "servidumbres",
    texto: "¿La propiedad tiene servidumbres de tránsito, acueducto o tendido eléctrico?",
    ayuda: "Una servidumbre puede limitar el uso y el valor; conviene saberlo antes de ofertar.",
    alertaEn: "si",
  },
  {
    id: "p6",
    area: "construcciones",
    texto: "¿La construcción tiene recepción final municipal y coincide con lo inscrito?",
    ayuda: "Ampliaciones sin permiso suelen aparecer recién en el crédito o en la inscripción.",
    alertaEn: "no",
  },
  {
    id: "p7",
    area: "deslindes",
    texto: "¿Los deslindes de la escritura coinciden con el terreno que está viendo?",
    ayuda: "Revise planos y compare cabida escriturada con superficie medida.",
    alertaEn: "no",
  },
  {
    id: "p8",
    area: "uso-suelo",
    texto: "¿Revisó el certificado de informaciones previas para el uso que planea darle?",
    ayuda: "La zonificación del plan regulador define qué se puede construir y para qué.",
    alertaEn: "no",
  },
  {
    id: "p9",
    area: "copropiedad",
    texto: "¿La propiedad pertenece a más de una persona?",
    ayuda: "Si hay varios dueños, todos deben firmar o existir mandato suficiente.",
    alertaEn: "si",
  },
  {
    id: "p10",
    area: "ocupacion",
    texto: "¿El inmueble está arrendado o habitado por alguien distinto del vendedor?",
    ayuda: "Un contrato de arriendo vigente puede retrasar la entrega material.",
    alertaEn: "si",
  },
];

export type Semaforo = "verde" | "amarillo" | "rojo";

export interface ResultadoArea {
  area: Area;
  semaforo: Semaforo;
  senales: Pregunta[];
}

/**
 * Semáforo por área:
 * - rojo: hay al menos una respuesta que enciende la alerta.
 * - amarillo: no hay alerta, pero quedó al menos una respuesta "no sé".
 * - verde: todas las respuestas del área son tranquilizadoras.
 */
export function evaluar(respuestas: Record<string, Respuesta>): ResultadoArea[] {
  const usadas: AreaId[] = [];
  for (const p of PREGUNTAS) {
    if (!usadas.includes(p.area)) usadas.push(p.area);
  }

  return usadas.map((areaId) => {
    const preguntas = PREGUNTAS.filter((p) => p.area === areaId);
    const respondidas = preguntas.filter((p) => respuestas[p.id]);
    const senales = respondidas.filter((p) => respuestas[p.id] === p.alertaEn);
    const dudas = respondidas.filter((p) => respuestas[p.id] === "nose");

    let semaforo: Semaforo = "verde";
    if (senales.length > 0) semaforo = "rojo";
    else if (dudas.length > 0 || respondidas.length < preguntas.length) semaforo = "amarillo";

    return { area: AREAS[areaId], semaforo, senales };
  });
}

export const ETIQUETA_SEMAFORO: Record<Semaforo, string> = {
  verde: "Sin alertas declaradas",
  amarillo: "Falta información",
  rojo: "Señal de alerta",
};
