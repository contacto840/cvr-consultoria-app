import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/json-ld";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Venta de propiedades",
  description:
    "Cómo vende CVR Propiedades: precio de lista con comparables, preparación del inmueble, filtro de compradores y conducción de la operación hasta la escritura.",
  alternates: { canonical: "/servicios/venta" },
  openGraph: {
    title: "Venta de propiedades | CVR Propiedades",
    description:
      "Precio de lista con comparables, filtro de compradores y conducción de la operación hasta la escritura.",
    url: "/servicios/venta",
  },
};

const serviceLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Venta de propiedades",
  serviceType: "Corretaje de propiedades en venta",
  description:
    "Gestión de la venta de un inmueble: fijación del precio de lista, preparación y difusión, filtro de compradores, negociación y conducción de la operación hasta la inscripción.",
  provider: { "@id": `${SITE.domain}/#organization` },
  areaServed: { "@type": "AdministrativeArea", name: SITE.region },
  url: `${SITE.domain}/servicios/venta`,
};

export default function VentaPage() {
  return (
    <>
      <JsonLd data={serviceLd} />

      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Para quien vende</p>
          <h1 className="page-title">Venta de propiedades</h1>
          <p className="page-lead">
            Vender bien no es publicar rápido: es poner el precio correcto, llegar al
            comprador que puede pagar y sostener la operación hasta la inscripción en el
            Conservador.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container narrow">
          <h2 className="section-title">Cómo se fija el precio de lista</h2>
          <p>
            El precio no se decide por lo que el propietario necesita ni por lo que pide el
            vecino. Se decide con comparables: propiedades similares, en el mismo sector,
            vendidas o publicadas en un período reciente, corregidas por superficie,
            estado de conservación, antigüedad y estacionamiento.
          </p>
          <p>
            De ese análisis sale un rango. El precio de lista se fija dentro del rango
            según la urgencia del propietario y el tiempo que esté dispuesto a esperar.
            Publicar por sobre el mercado no acelera la venta: alarga el tiempo en pantalla
            y desgasta la propiedad frente a los compradores que ya la vieron.
          </p>
          <div className="callout">
            <p>
              <strong>Precio y tasación no son lo mismo.</strong> Una tasación firmada
              sirve para un banco, un tribunal o una herencia y tiene metodología y
              responsabilidad profesional. El precio de lista es una decisión comercial.
              Si el caso necesita el informe firmado, se pide en{" "}
              <a href={SITE.tasaciones.tasacionComercial} rel="noopener">
                cvrtasaciones.cl
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title">Qué incluye la gestión</h2>
          <div className="grid two-col">
            <div className="card">
              <h3>Preparación y difusión</h3>
              <ul className="check-list">
                <li>Ficha técnica del inmueble con superficies y características reales.</li>
                <li>Revisión de documentos básicos antes de publicar.</li>
                <li>Fotografías y texto del aviso orientados a compradores, no a visitas.</li>
                <li>Publicación en este portal y en los canales que correspondan al caso.</li>
              </ul>
            </div>
            <div className="card">
              <h3>Filtro y negociación</h3>
              <ul className="check-list">
                <li>Calificación del comprador: capacidad de pago y origen de los fondos.</li>
                <li>Visitas coordinadas y acompañadas.</li>
                <li>Negociación de precio, plazos y condiciones de entrega.</li>
                <li>Redacción y revisión de la promesa junto a las partes.</li>
              </ul>
            </div>
            <div className="card">
              <h3>Cierre</h3>
              <ul className="check-list">
                <li>Coordinación con notaría para la escritura.</li>
                <li>Coordinación con el Conservador de Bienes Raíces.</li>
                <li>Verificación de alzamiento de hipotecas y prohibiciones.</li>
                <li>Entrega material del inmueble según lo pactado.</li>
              </ul>
            </div>
            <div className="card">
              <h3>Lo que no incluye</h3>
              <ul className="check-list">
                <li>Informes de tasación firmados: se contratan aparte.</li>
                <li>Estudio de títulos y due diligence: se contratan aparte.</li>
                <li>Obras, regularizaciones o trámites municipales.</li>
                <li>Asesoría legal de las partes: cada parte puede tener la suya.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container narrow">
          <h2 className="section-title">Honorarios</h2>
          <p>
            La comisión de corretaje se pacta por escrito antes de comenzar, se calcula
            sobre el precio de venta y se paga contra la escritura. No hay cobros por
            publicar ni por recibir visitas.
          </p>
          <p className="pending">
            {"{{PENDIENTE: honorarios, definir porcentaje y condiciones con Carlos}}"}
          </p>
          <p>
            El detalle de lo que cuesta comprar —timbres, notaría, Conservador y
            corretaje— está en la{" "}
            <Link href="/herramientas/costos-de-compra">calculadora de costos de compra</Link>.
          </p>
          <div className="inline-actions">
            <Link href="/#contacto" className="btn-gold">
              Quiero vender
            </Link>
            <Link href="/tasacion" className="btn-outline">
              Estimar el valor primero
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
