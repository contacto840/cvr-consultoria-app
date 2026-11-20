import type { Metadata } from "next";
import { Suspense } from "react";
import Estimador from "@/components/estimador";

export const metadata: Metadata = {
  title: "Estimación referencial de valor",
  description:
    "Calcula un rango de valor referencial para una propiedad en Ñuble a partir de valores de mercado por comuna, sector y tipo. Es una orientación, no una tasación.",
  alternates: { canonical: "/tasacion" },
  openGraph: {
    title: "Estimación referencial de valor | CVR Propiedades",
    description:
      "Rango de valor referencial para una propiedad en Ñuble, con la fórmula, la muestra y el año de los datos a la vista.",
    url: "/tasacion",
  },
};

export default function TasacionPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Herramienta</p>
          <h1 className="page-title">Estimación referencial de valor</h1>
          <p className="page-lead">
            Un rango de precio para orientar una decisión de venta o compra. Se calcula con
            valores de mercado por comuna, sector y tipo de propiedad, y muestra la muestra
            y el año de esos valores.
          </p>
          <div className="notice notice-top" role="note">
            <strong>No es una tasación.</strong> Es una estimación automática, sin
            inspección del inmueble ni homologación de comparables. No sirve para trámites
            bancarios, judiciales, hereditarios ni de compraventa: para eso se requiere un
            informe de tasación con inspección y firma.
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Suspense
            fallback={
              <div className="card" role="status">
                Cargando el estimador…
              </div>
            }
          >
            <Estimador />
          </Suspense>
        </div>
      </section>
    </>
  );
}
