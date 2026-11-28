// 27 de noviembre de 2026: esta aplicación se retiró. La empresa opera solo con
// cvrpropiedades.com (.cl), cvrtasaciones.cl y querencia.cl.
//
// Toda página redirige a cvrpropiedades.com y las rutas de API responden 410: no se reciben
// formularios, pagos ni accesos de administración. Los datos y el código siguen intactos.
// Para volver a encenderla, borrar este archivo y publicar.
import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.json({ error: "Este servicio fue descontinuado." }, { status: 410 });
  }
  return NextResponse.redirect("https://cvrpropiedades.com/", 308);
}

export const config = { matcher: "/:path*" };
