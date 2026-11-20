import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/json-ld";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Asesoría de compra",
  description:
    "Acompañamiento al comprador en Ñuble: qué se revisa antes de firmar la promesa, revisión de títulos, cargas, construcciones y uso de suelo, y derivación a informes firmados.",
  alternates: { canonical: "/servicios/asesoria-de-compra" },
  openGraph: {
    title: "Asesoría de compra | CVR Propiedades",
    description:
      "Qué se revisa antes de firmar y cuándo corresponde un informe firmado de títulos o due diligence.",
    url: "/servicios/asesoria-de-compra",
  },
};

const serviceLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Asesoría de compra de propiedades",
  serviceType: "Acompañamiento al comprador en la adquisición de inmuebles",
  description:
    "Acompañamiento al comprador: definición del inmueble objetivo, revisión documental previa a la promesa, coordinación del estudio de títulos y del due diligence, y conducción de la operación hasta la inscripción.",
  provider: { "@id": `${SITE.domain}/#organization` },
  areaServed: { "@type": "AdministrativeArea", name: SITE.region },
  url: `${SITE.domain}/servicios/asesoria-de-compra`,
};

const REVISIONES = [
  {
    title: "Quién vende y qué inscribe",
    body: "Certificado de dominio vigente, cadena de inscripciones y coincidencia entre el vendedor y el titular inscrito. Si hay herencia, se revisa la posesión efectiva y la inscripción especial.",
  },
  {
    title: "Qué pesa sobre el inmueble",
    body: "Certificado de gravámenes e interdicciones: hipotecas, prohibiciones de enajenar, embargos y servidumbres. Lo que no se alza antes de la escritura queda sobre la propiedad comprada.",
  },
  {
    title: "Qué se puede hacer en ese suelo",
    body: "Certificado de informaciones previas y revisión de la normativa municipal aplicable al predio, para no comprar un proyecto que la zonificación no permite.",
  },
  {
    title: "Qué se construyó de verdad",
    body: "Recepción final, permisos y coincidencia entre lo construido, lo inscrito y lo publicitado. Ampliaciones irregulares pueden bloquear el crédito o la inscripción.",
  },
  {
    title: "Agua, acceso y deslindes",
    body: "En predios rurales: derechos de aprovechamiento de aguas, inscripción, servidumbres de tránsito y coincidencia de deslindes y cabida con el terreno ofrecido.",
  },
  {
    title: "Precio y condiciones",
    body: "Comparación con el mercado, revisión de la promesa, plazos, multas, condiciones resolutorias y entrega material del inmueble.",
  },
];

export default function AsesoriaCompraPage() {
  return (
    <>
      <JsonLd data={serviceLd} />

      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Para quien compra</p>
          <h1 className="page-title">Asesoría de compra</h1>
          <p className="page-lead">
            El comprador es quien asume el riesgo después de la firma. Este servicio existe
            para que ese riesgo se conozca antes, no después.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container narrow">
          <h2 className="section-title">Qué se revisa antes de firmar</h2>
          <p>
            La promesa de compraventa obliga. Una vez firmada, arrepentirse cuesta la
            garantía o una indemnización. La revisión se hace antes, con documentos en
            mano y no con lo que dice el aviso.
          </p>
        </div>
        <div className="container">
          <div className="grid two-col">
            {REVISIONES.map((r) => (
              <article key={r.title} className="card">
                <h3>{r.title}</h3>
                <p>{r.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container split">
          <div>
            <h2 className="section-title">Cuándo se necesita un informe firmado</h2>
            <p>
              La asesoría de compra ordena la operación y detecta señales de alerta. Cuando
              el caso exige un documento con metodología, respaldo documental y firma
              responsable —para un banco, un tribunal, una herencia o una compra de alto
              monto— corresponde un informe pericial.
            </p>
            <p>
              Ese trabajo lo hace la línea de tasaciones y peritajes de CVR, en un sitio
              distinto, con sus propios alcances y honorarios.
            </p>
            <div className="inline-actions">
              <a href={SITE.tasaciones.estudioTitulos} className="btn-gold" rel="noopener">
                Estudio de títulos ↗
              </a>
              <a href={SITE.tasaciones.dueDiligence} className="btn-outline" rel="noopener">
                Due diligence ↗
              </a>
            </div>
          </div>
          <div className="card">
            <h3>El orden que funciona</h3>
            <ol className="steps-list">
              <li>Definir qué se busca y con qué presupuesto real.</li>
              <li>Revisar el inmueble y su documentación antes de ofertar.</li>
              <li>Ofertar por escrito, con condiciones y plazos.</li>
              <li>Revisar la promesa antes de firmarla.</li>
              <li>Pedir el informe firmado si el caso lo requiere.</li>
              <li>Escriturar, inscribir y recibir el inmueble.</li>
            </ol>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container narrow">
          <h2 className="section-title">Honorarios</h2>
          <p>
            El acompañamiento se cotiza según el tipo de inmueble, la cantidad de
            documentos a revisar y el grado de participación solicitado. Los informes
            firmados se cotizan por separado en la línea pericial.
          </p>
          <p className="pending">
            {"{{PENDIENTE: honorarios de asesoría de compra, definir con Carlos}}"}
          </p>
          <div className="inline-actions">
            <Link href="/#contacto" className="btn-gold">
              Quiero asesoría para comprar
            </Link>
            <Link href="/herramientas/diagnostico-predio" className="btn-outline">
              Diagnosticar un predio primero
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
