// Identidad del sitio. Un solo lugar para la marca, el dominio y los canales.
// El dominio canónico es cvrpropiedades.cl; el .com solo redirige y no se usa
// en metadatos, JSON-LD ni enlaces canónicos.

export const SITE = {
  name: "CVR Propiedades",
  legalName: "CVR Propiedades SpA",
  domain: "https://cvrpropiedades.cl",
  email: "contacto@cvrpropiedades.com",
  phoneDisplay: "+56 9 3868 9157",
  phoneE164: "56938689157",
  city: "Chillán",
  region: "Región de Ñuble",
  country: "CL",
  /** Sitio hermano: informes de tasación y peritajes firmados por el perito. */
  tasacionesUrl: "https://cvrtasaciones.cl",
  tasaciones: {
    estudioTitulos: "https://cvrtasaciones.cl/estudio-titulos.html",
    dueDiligence: "https://cvrtasaciones.cl/due-diligence.html",
    tasacionComercial: "https://cvrtasaciones.cl/tasacion-comercial.html",
    peritajeJudicial: "https://cvrtasaciones.cl/peritaje-judicial.html",
    paqueteHereditario: "https://cvrtasaciones.cl/paquete-hereditario.html",
    riesgoHidrico: "https://cvrtasaciones.cl/matriz-riesgo-hidrico.html",
  },
} as const;

/**
 * Pie legal exigido en todas las páginas. El RUT queda como marcador literal
 * hasta que Carlos entregue el número de la sociedad (ver
 * docs/credenciales-publicables.md, regla 6).
 */
export const LEGAL_LINE = `${SITE.legalName} · RUT {{RUT_PENDIENTE}} · ${SITE.city}, ${SITE.region}`;

export const waLink = (message: string) =>
  `https://wa.me/${SITE.phoneE164}?text=${encodeURIComponent(message)}`;
