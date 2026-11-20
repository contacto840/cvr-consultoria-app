/**
 * Datos del encargo de tasación con inspección y firma.
 *
 * El precio es el que ya cobra MercadoPago en este repositorio: se centraliza
 * acá para que la preferencia de pago y la interfaz no puedan desincronizarse.
 * Sigue pendiente la confirmación comercial de Carlos.
 */
export const ENCARGO = {
  precioCLP: 15000,
  /** El plazo real de entrega lo define el perito: no se inventa una cifra. */
  plazoTexto: "{{PENDIENTE: plazo de entrega del encargo de tasación, confirmar con Carlos}}",
  nombre: "Encargo de tasación con inspección y firma",
} as const;
