import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// Rutas estáticas. Las fichas de propiedad se agregan cuando exista un sitemap
// dinámico con acceso a la base; no se consulta la base en el build.
const RUTAS = [
  "",
  "/propiedades",
  "/servicios/venta",
  "/servicios/arriendo",
  "/servicios/asesoria-de-compra",
  "/honorarios",
  "/herramientas/costos-de-compra",
  "/herramientas/diagnostico-predio",
  "/tasacion",
  "/corredores",
  "/privacidad",
  "/terminos",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const ultima = new Date();
  return RUTAS.map((ruta) => ({
    url: `${SITE.domain}${ruta}`,
    lastModified: ultima,
    changeFrequency: ruta === "" || ruta === "/propiedades" ? "weekly" : "monthly",
    priority: ruta === "" ? 1 : ruta === "/propiedades" ? 0.9 : 0.7,
  }));
}
