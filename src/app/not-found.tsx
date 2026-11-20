import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="contenido" tabIndex={-1}>
        <section className="page-hero">
          <div className="container narrow">
            <p className="eyebrow">Error 404</p>
            <h1 className="page-title">No encontramos esa página</h1>
            <p className="page-lead">
              Puede que el enlace esté mal escrito o que la propiedad ya no esté publicada.
              Desde aquí puedes seguir buscando.
            </p>
            <div className="inline-actions">
              <Link href="/propiedades" className="btn-gold">
                Ver propiedades
              </Link>
              <Link href="/" className="btn-outline">
                Volver al inicio
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
