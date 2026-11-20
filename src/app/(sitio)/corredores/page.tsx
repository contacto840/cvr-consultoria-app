import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/json-ld";
import { SITE, waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Corredores asociados",
  description:
    "Programa de corredores asociados de CVR Propiedades: derivación de operaciones, respaldo técnico y revisión documental para las propiedades que representas en Ñuble.",
  alternates: { canonical: "/corredores" },
  openGraph: {
    title: "Corredores asociados | CVR Propiedades",
    description:
      "Trabaja con CVR: derivación de operaciones, respaldo técnico y revisión documental.",
    url: "/corredores",
  },
};

const serviceLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Programa de corredores asociados",
  serviceType: "Corretaje de propiedades con corredores asociados",
  description:
    "Programa para corredores y agencias que quieren derivar operaciones y contar con respaldo técnico y documental en la Región de Ñuble.",
  provider: { "@id": `${SITE.domain}/#organization` },
  areaServed: { "@type": "AdministrativeArea", name: SITE.region },
  url: `${SITE.domain}/corredores`,
};

const BENEFICIOS = [
  {
    title: "Respaldo documental",
    body: "La propiedad que representas llega al comprador con sus títulos, cargas y construcciones revisadas. Menos promesas que se caen en el banco.",
  },
  {
    title: "Derivación de operaciones",
    body: "Si tienes un comprador y no tienes la propiedad, o al revés, se puede trabajar la operación en conjunto con reglas claras desde el inicio.",
  },
  {
    title: "Un solo interlocutor",
    body: "Coordinamos visitas, documentación, notaría y Conservador. Tú mantienes la relación con tu cliente.",
  },
  {
    title: "Sin exclusividad forzada",
    body: "Las condiciones se acuerdan por escrito para cada operación. No hay permanencia ni cuotas de entrada.",
  },
];

export default function CorredoresPage() {
  return (
    <>
      <JsonLd data={serviceLd} />

      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Para corredores y agencias</p>
          <h1 className="page-title">Corredores asociados</h1>
          <p className="page-lead">
            Un corredor no debería tener que elegir entre cerrar rápido y cerrar bien. El
            programa existe para que la revisión del inmueble no sea la parte que se salta.
          </p>
          <div className="inline-actions">
            <a
              className="btn-gold"
              href={waLink("Hola CVR, soy corredor y quiero conocer el programa de corredores asociados.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              Hablar con CVR
            </a>
            <Link href="#como-funciona" className="btn-outline">
              Cómo funciona
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Qué obtiene el corredor</h2>
          <div className="grid two-col">
            {BENEFICIOS.map((b) => (
              <article key={b.title} className="card">
                <h3>{b.title}</h3>
                <p>{b.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="como-funciona" className="section section-alt">
        <div className="container narrow">
          <h2 className="section-title">Cómo funciona</h2>
          <ol className="steps-list">
            <li>Conversamos sobre la cartera y el tipo de operaciones que manejas.</li>
            <li>Se acuerda por escrito la forma de trabajo y la comisión de cada caso.</li>
            <li>Derivas la propiedad o el comprador, con la documentación disponible.</li>
            <li>CVR revisa lo que corresponda y coordina la operación contigo.</li>
            <li>La comisión se paga contra la escritura, según lo pactado.</li>
          </ol>

          <h2 className="section-title">Condiciones comerciales</h2>
          <p>
            No publicamos planes ni precios en esta página porque no existe un tarifario
            único: cada acuerdo depende del tipo de operación, del trabajo que aporta cada
            parte y de si la propiedad requiere revisión documental.
          </p>
          <p className="pending">
            {"{{PENDIENTE: condiciones y comisiones del programa de corredores, definir con Carlos}}"}
          </p>

          <div className="callout">
            <p>
              <strong>Lo que no prometemos:</strong> informes firmados automáticos, validez
              bancaria sin revisión, ni plazos que no dependan del perito. Los informes
              firmados se emiten en la línea de{" "}
              <a href={SITE.tasacionesUrl} rel="noopener">
                tasaciones y peritajes
              </a>
              , con sus propios plazos.
            </p>
          </div>

          <div className="inline-actions">
            <a
              className="btn-gold"
              href={waLink("Hola CVR, quiero asociarme como corredor.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              Quiero asociarme
            </a>
            <Link href="/propiedades" className="btn-outline">
              Ver propiedades publicadas
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
