import type { Metadata } from "next";
import Link from "next/link";
import CostosCalculator from "@/components/costos-calculator";
import { ITEMS, FECHA_REVISION } from "@/lib/costos-compra";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Calculadora de costos reales de compra",
  description:
    "Cuánto cuesta realmente comprar una propiedad en Chile: precio, impuesto de timbres, notaría, inscripción en el Conservador y corretaje, con fuente y fecha de cada dato.",
  alternates: { canonical: "/herramientas/costos-de-compra" },
  openGraph: {
    title: "Costos reales de compra | CVR Propiedades",
    description:
      "Desglose de lo que se desembolsa al comprar una propiedad, con el criterio y la fuente de cada ítem.",
    url: "/herramientas/costos-de-compra",
  },
};

export default function CostosPage() {
  const pendientes = ITEMS.filter((i) => i.estado === "pendiente").length;

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Herramienta</p>
          <h1 className="page-title">Costos reales de compra</h1>
          <p className="page-lead">
            El precio de la propiedad no es lo único que se paga. Esta calculadora muestra
            qué más entra en la cuenta, con la fórmula, la fuente y la fecha de cada dato.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="notice" role="note">
            <strong>Es una orientación referencial.</strong> No es una cotización ni una
            tasación, y no reemplaza la asesoría de tu banco, tu notaría o tu abogado. De{" "}
            {ITEMS.length} ítems, {pendientes} dependen de un tercero y se muestran como
            «a cotizar» en lugar de inventar un monto.
          </div>

          <CostosCalculator />

          <div className="card">
            <h2 className="h3">Por qué algunos ítems no traen monto</h2>
            <p>
              Los aranceles notariales y del Conservador de Bienes Raíces se calculan sobre
              el monto del acto y varían por oficio. Publicar un porcentaje único sería
              cómodo y falso: el cliente presupuestaría con un número que no va a pagar.
              Preferimos mostrarlos como pendientes de cotización y explicar de qué dependen.
            </p>
            <p className="small muted">
              Tabla de constantes revisada en {FECHA_REVISION}. Si un arancel cambia, se
              actualiza en <code>src/lib/costos-compra.ts</code>, en un solo lugar.
            </p>
          </div>

          <div className="inline-actions">
            <Link href="/tasacion" className="btn-gold">
              Estimar el valor de la propiedad
            </Link>
            <Link href="/servicios/asesoria-de-compra" className="btn-outline">
              Ver la asesoría de compra
            </Link>
          </div>

          <p className="small muted">
            Si necesitas una revisión de títulos o un informe firmado antes de comprar, eso
            se pide en{" "}
            <a href={SITE.tasaciones.estudioTitulos} rel="noopener">
              cvrtasaciones.cl
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
