/**
 * Datos del encargo de tasación con inspección y firma.
 *
 * El informe dejó de venderse con cobro en línea: se cotiza. El precio y el
 * nombre se conservan porque los usa el código de pagos heredado
 * (/api/pagos), que ya no es alcanzable desde la interfaz. No se publican como
 * oferta en ninguna página.
 *
 * El plazo no se inventa: se acuerda por escrito al aceptar el encargo.
 */
export const ENCARGO = {
  /** Precio legado del flujo de MercadoPago; sin uso en la interfaz. */
  precioCLP: 15000,
  plazoTexto: "El plazo se acuerda por escrito al aceptar el encargo.",
  nombre: "Encargo de tasación con inspección y firma",
} as const;
