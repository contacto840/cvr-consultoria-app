import { createHash, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

/**
 * Autenticación del panel de administración.
 *
 * Antes existía una contraseña por defecto escrita en el código y publicada en la
 * propia pantalla de login. Ahora la única fuente es `ADMIN_PASSWORD`, y si no
 * está definida el acceso se niega (fail closed). El valor por defecto conocido
 * también se rechaza explícitamente.
 */
const CLAVE_FILTRADA = "cvr2025admin";

export function adminConfigurado(): boolean {
  const esperado = process.env.ADMIN_PASSWORD;
  return Boolean(esperado && esperado !== CLAVE_FILTRADA);
}

export function esAdmin(req: NextRequest): boolean {
  const esperado = process.env.ADMIN_PASSWORD;
  if (!esperado || esperado === CLAVE_FILTRADA) return false;

  const recibido = req.headers.get("x-admin-password") ?? "";
  if (!recibido) return false;

  // Comparación en tiempo constante sobre el hash, para no filtrar longitud ni
  // prefijos de la clave por diferencias de tiempo.
  const a = createHash("sha256").update(recibido).digest();
  const b = createHash("sha256").update(esperado).digest();
  return timingSafeEqual(a, b);
}
