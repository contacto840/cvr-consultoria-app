import type { Metadata } from "next";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

export const metadata: Metadata = {
  title: "Publicar una propiedad",
  description:
    "Publica tu propiedad en CVR Propiedades sin costo. La publicación se revisa antes de aparecer y no expone tu dirección ni tu teléfono.",
  alternates: { canonical: "/propiedades/agregar" },
};

export default function AgregarLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
