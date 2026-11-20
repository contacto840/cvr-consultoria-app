import type { Metadata } from "next";
import Link from "next/link";
import PropiedadesList from "@/components/propiedades-list";

export const metadata: Metadata = {
  title: "Propiedades en venta y arriendo",
  description:
    "Propiedades disponibles en Chillán y la Región de Ñuble. Fichas con superficie, características y contacto directo con CVR Propiedades.",
  alternates: { canonical: "/propiedades" },
  openGraph: {
    title: "Propiedades en venta y arriendo | CVR Propiedades",
    description: "Propiedades disponibles en Chillán y la Región de Ñuble.",
    url: "/propiedades",
  },
};

export default function PropiedadesPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container page-hero-row">
          <div>
            <p className="eyebrow">Portal de propiedades</p>
            <h1 className="page-title">Propiedades en venta y arriendo</h1>
            <p className="page-lead">
              Publicamos propiedades que conocemos. Cada ficha indica sector y comuna, no la
              dirección exacta: la ubicación precisa y la visita se coordinan con el equipo.
            </p>
          </div>
          <Link href="/propiedades/agregar" className="btn-gold">
            Publicar mi propiedad
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <PropiedadesList />
        </div>
      </section>
    </>
  );
}
