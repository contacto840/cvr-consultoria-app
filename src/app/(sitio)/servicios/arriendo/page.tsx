import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/json-ld";
import { honorarioDe } from "@/lib/honorarios";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Arriendo y administración",
  description:
    "Arriendo de propiedades en Ñuble: selección del arrendatario, contrato, inventario y administración mensual con cobranza y mantención.",
  alternates: { canonical: "/servicios/arriendo" },
  openGraph: {
    title: "Arriendo y administración | CVR Propiedades",
    description:
      "Selección del arrendatario, contrato y administración mensual de la propiedad.",
    url: "/servicios/arriendo",
  },
};

const serviceLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Arriendo y administración de propiedades",
  serviceType: "Corretaje de arriendo y administración de inmuebles",
  description:
    "Selección de arrendatario, redacción del contrato, inventario y administración mensual: cobranza, mantención y renovaciones.",
  provider: { "@id": `${SITE.domain}/#organization` },
  areaServed: { "@type": "AdministrativeArea", name: SITE.region },
  url: `${SITE.domain}/servicios/arriendo`,
};

export default function ArriendoPage() {
  const colocacion = honorarioDe("arriendo");
  const administracion = honorarioDe("administracion");
  return (
    <>
      <JsonLd data={serviceLd} />

      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Para propietarios</p>
          <h1 className="page-title">Arriendo y administración</h1>
          <p className="page-lead">
            Un buen arriendo se decide antes de firmar: en la selección de quien va a vivir
            ahí y en un contrato que prevea lo que suele salir mal.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Tres etapas, una sola responsabilidad</h2>
          <div className="grid three-col">
            <div className="card">
              <span className="tag">1. Selección</span>
              <h3>Quién entra</h3>
              <ul className="check-list">
                <li>Verificación de identidad y de ingresos declarados.</li>
                <li>Referencias laborales y de arriendos anteriores.</li>
                <li>Evaluación de aval o codeudor solidario cuando corresponde.</li>
                <li>Informe al propietario con la recomendación y sus razones.</li>
              </ul>
            </div>
            <div className="card">
              <span className="tag">2. Contrato</span>
              <h3>Qué se firma</h3>
              <ul className="check-list">
                <li>Contrato de arriendo con plazo, renta, reajuste y garantía.</li>
                <li>Inventario y acta de entrega con estado del inmueble.</li>
                <li>Reglas de mantención, mascotas, subarriendo y término anticipado.</li>
                <li>Inscripción y respaldos que correspondan al caso.</li>
              </ul>
            </div>
            <div className="card">
              <span className="tag">3. Administración</span>
              <h3>Qué pasa cada mes</h3>
              <ul className="check-list">
                <li>Cobranza de la renta y perseguimiento de mora.</li>
                <li>Liquidación mensual al propietario con el detalle de gastos.</li>
                <li>Coordinación de mantenciones y reparaciones.</li>
                <li>Renovaciones, ajustes de renta y término del contrato.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container narrow">
          <h2 className="section-title">Qué se revisa antes de arrendar</h2>
          <p>
            La propiedad debe estar en condiciones de ser arrendada y el propietario debe
            poder acreditarla. Antes de publicar revisamos que la inscripción esté a nombre
            de quien arrienda, que no exista una prohibición vigente y que las
            instalaciones esenciales funcionen.
          </p>
          <p>
            Si el inmueble viene de una herencia, si hay copropietarios o si la construcción
            no tiene recepción municipal, conviene resolverlo antes y no con el arrendatario
            adentro. Ese tipo de revisión se pide a la línea pericial:{" "}
            <a href={SITE.tasaciones.estudioTitulos} rel="noopener">
              estudio de títulos
            </a>
            .
          </p>
          <h2 className="section-title">Honorarios</h2>
          <p>
            <strong>Colocación: {colocacion.honorario}.</strong>{" "}
            {colocacion.determina} <strong>Administración mensual:{" "}
            {administracion.honorario}.</strong> Se cobra a la parte que encarga la
            gestión y se declara por escrito en el contrato.
          </p>
          <p>
            El honorario se fija por escrito antes de empezar y no varía después, salvo
            que cambie el alcance acordado. El IVA se declara por separado. La tabla
            completa está en <Link href="/honorarios">honorarios</Link>.
          </p>

          <div className="grid two-col">
            <div className="card">
              <h3>Qué recibes y cuándo</h3>
              <ul className="check-list">
                <li>La verificación del arrendatario y la recomendación, por escrito.</li>
                <li>El contrato y el inventario firmados antes de la entrega.</li>
                <li>La liquidación mensual con el detalle de gastos.</li>
                <li>
                  El plazo se acuerda por escrito al aceptar el encargo. La colocación
                  depende del mercado y no se promete una fecha que no se controle.
                </li>
              </ul>
            </div>
            <div className="card">
              <h3>Lo que no incluye</h3>
              <ul className="check-list">
                <li>
                  Obras y reparaciones: las coordina CVR, pero el costo lo paga el
                  propietario.
                </li>
                <li>Cobranza judicial y juicios de arriendo: se derivan a abogado.</li>
                <li>Regularizaciones, permisos y trámites municipales.</li>
                <li>Informes de tasación firmados: se contratan en la línea pericial.</li>
              </ul>
            </div>
          </div>

          <div className="inline-actions">
            <Link href="/#contacto" className="btn-gold">
              Quiero arrendar mi propiedad
            </Link>
            <Link href="/propiedades" className="btn-outline">
              Ver arriendos disponibles
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
