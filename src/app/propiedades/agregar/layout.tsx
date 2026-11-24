import type { Metadata } from "next";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

export const metadata: Metadata = {
  title: "Publicar una propiedad",
  description:
    "Publica tu propiedad en CVR Propiedades sin costo. La publicación se revisa antes de aparecer y no expone tu dirección ni tu teléfono.",
  alternates: { canonical: "/propiedades/agregar" },
  // Formulario interno de carga: no se indexa. La ruta también está bloqueada
  // en src/app/robots.ts.
  robots: { index: false, follow: false, nocache: true },
};

export default function AgregarLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main id="contenido" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
