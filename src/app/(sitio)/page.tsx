import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/contact-form";
import QuickEstimate from "@/components/quick-estimate";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Corretaje de propiedades en Chillán y Ñuble",
  description:
    "CVR Propiedades: venta, arriendo y asesoría de compra en Chillán y la Región de Ñuble. Revisión técnica y legal del inmueble antes de firmar.",
  alternates: { canonical: "/" },
};

const SERVICIOS = [
  {
    href: "/servicios/venta",
    tag: "Para quien vende",
    title: "Venta de propiedades",
    desc: "Fijamos el precio con datos, preparamos el inmueble, filtramos compradores y conducimos la operación hasta la escritura.",
  },
  {
    href: "/servicios/arriendo",
    tag: "Para quien arrienda",
    title: "Arriendo y administración",
    desc: "Selección del arrendatario, contrato y administración mensual: cobranza, mantención y renovaciones.",
  },
  {
    href: "/servicios/asesoria-de-compra",
    tag: "Para quien compra",
    title: "Asesoría de compra",
    desc: "Revisamos el inmueble antes de la promesa: títulos, cargas, construcciones y uso de suelo. El comprador decide con la información completa.",
  },
];

const CREDENCIALES = [
  "Administrador Público, IPLACEX. Título legalizado ante notario.",
  "Diplomado en Tasación Inmobiliaria y Agrícola, Braniff Institute, 2022.",
  "Curso de Tasación Inmobiliaria, Universidad Adolfo Ibáñez, 2026.",
  "Diplomado en Recursos Hídricos, Universidad de Concepción, 2026.",
  "Estudio de Títulos, LawJusto, 2026.",
  "Subdivisión de Predios, LawJusto, 2026.",
  "Regularización de Bienes Nacionales, LawJusto, 2026.",
  "Concesión de Derechos de Aguas, LawJusto, 2026.",
  "Corretaje de Propiedades, Braniff Institute.",
  "Administración de Edificios y Condominios, Braniff Institute.",
  "Gestor de Proyectos Inmobiliarios, Braniff Institute.",
  "Diplomado en Derecho Inmobiliario, Universidad Andrés Bello, en curso.",
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-bg" aria-hidden="true" />
        <div className="container hero-inner">
          <p className="eyebrow">Corretaje · Chillán y Región de Ñuble</p>
          <h1 className="hero-title">
            Vender, arrendar o comprar una propiedad,
            <em> con la revisión hecha antes de firmar.</em>
          </h1>
          <p className="hero-lead">
            CVR Propiedades opera en Ñuble. Cada operación parte por entender el inmueble
            —su título, sus cargas, su estado y su precio de mercado— y termina con un
            cliente que sabe exactamente qué está firmando.
          </p>
          <div className="hero-actions">
            <Link href="/propiedades" className="btn-gold">
              Ver propiedades
            </Link>
            <Link href="/tasacion" className="btn-outline">
              Estimar el valor de mi propiedad
            </Link>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="servicios">
        <div className="container">
          <p className="eyebrow">Servicios</p>
          <h2 id="servicios" className="section-title">
            Tres formas de trabajar con CVR
          </h2>
          <p className="section-lead">
            El corretaje es el negocio de este sitio. La revisión técnica y legal que lo
            respalda es lo que distingue cada operación.
          </p>
          <div className="grid three-col">
            {SERVICIOS.map((s) => (
              <article key={s.href} className="card service-card">
                <span className="tag">{s.tag}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <Link href={s.href} className="link-arrow">
                  Ver el servicio <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="revision">
        <div className="container split">
          <div>
            <p className="eyebrow">Antes de la firma</p>
            <h2 id="revision" className="section-title">
              Lo que se revisa de un inmueble no se ve en la foto
            </h2>
            <p>
              Inscripción y cadena de dominio, hipotecas y prohibiciones, herencias,
              servidumbres, derechos de agua, construcciones sin recepción municipal y
              deslindes. Son las materias que deciden si una compra es una buena
              oportunidad o un problema heredado.
            </p>
            <p>
              Ese trabajo lo realiza la línea pericial de CVR, con informes firmados y
              responsabilidad profesional. Este sitio lo deriva allí: no duplicamos el
              contenido ni prometemos un documento que no emitimos.
            </p>
            <div className="inline-actions">
              <a href={SITE.tasaciones.estudioTitulos} className="btn-outline" rel="noopener">
                Estudio de títulos ↗
              </a>
              <a href={SITE.tasaciones.dueDiligence} className="btn-outline" rel="noopener">
                Due diligence ↗
              </a>
            </div>
          </div>
          <div className="card">
            <h3>Señales que conviene mirar primero</h3>
            <ul className="check-list">
              <li>El vendedor no es el titular inscrito.</li>
              <li>Hay una herencia sin posesión efectiva inscrita.</li>
              <li>La propiedad tiene hipoteca o prohibición vigente.</li>
              <li>La construcción no coincide con lo inscrito.</li>
              <li>El predio rural no acredita sus derechos de agua.</li>
            </ul>
            <Link href="/herramientas/diagnostico-predio" className="link-arrow">
              Hacer el diagnóstico en diez preguntas <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="herramientas">
        <div className="container">
          <p className="eyebrow">Herramientas</p>
          <h2 id="herramientas" className="section-title">
            Números antes de la decisión
          </h2>
          <p className="section-lead">
            Dos calculadoras para dimensionar la operación. Ambas muestran el criterio con
            el que calculan y el origen de cada dato.
          </p>
          <div className="grid three-col">
            <QuickEstimate />
            <article className="card service-card">
              <span className="tag">Costo de entrada</span>
              <h3>¿Cuánto cuesta realmente comprar?</h3>
              <p>
                Precio, timbres, notaría, Conservador y corretaje en un solo desglose, con
                la fuente y la fecha de cada ítem.
              </p>
              <Link href="/herramientas/costos-de-compra" className="link-arrow">
                Abrir la calculadora <span aria-hidden="true">→</span>
              </Link>
            </article>
            <article className="card service-card">
              <span className="tag">Riesgo del predio</span>
              <h3>Diez preguntas antes de ofertar</h3>
              <p>
                Un semáforo por área y el informe que corresponde pedir según el resultado.
                Sin veredicto legal: solo señales de alerta.
              </p>
              <Link href="/herramientas/diagnostico-predio" className="link-arrow">
                Hacer el diagnóstico <span aria-hidden="true">→</span>
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="quien">
        <div className="container split">
          <div>
            <p className="eyebrow">Quién te atiende</p>
            <h2 id="quien" className="section-title">
              Carlos Vivanco Riquelme
            </h2>
            <p>
              Fundador de CVR Propiedades SpA. Su formación inmobiliaria parte en 2022 y
              se puede verificar documento por documento. La credibilidad de este sitio no
              se apoya en una cifra de trayectoria: se apoya en lo que estudió, cuándo y
              dónde.
            </p>
            <p>
              Administrador Público, diplomado en Tasación Inmobiliaria y Agrícola (Braniff
              Institute, 2022), aprobado en el Curso de Tasación Inmobiliaria de la
              Universidad Adolfo Ibáñez (2026) y diplomado en Recursos Hídricos
              (Universidad de Concepción, 2026).
            </p>
          </div>
          <div className="card">
            <h3>Formación y credenciales</h3>
            <ul className="cred-list">
              {CREDENCIALES.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <p className="hint">
              Los respaldos documentales están disponibles para revisión en la entrevista.
              Las credenciales académicas no reemplazan la revisión de cada inmueble.
            </p>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="contacto">
        <div className="container split">
          <div>
            <p className="eyebrow">Contacto</p>
            <h2 id="contacto" className="section-title">
              Conversemos sobre tu propiedad
            </h2>
            <p>
              Cuéntanos qué necesitas y te respondemos con un diagnóstico inicial. Si el
              caso requiere un informe firmado, te derivamos a la línea pericial.
            </p>
            <ul className="contact-list">
              <li>
                <span className="contact-label">Correo</span>
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              </li>
              <li>
                <span className="contact-label">Teléfono</span>
                <a href={`tel:+${SITE.phoneE164}`}>{SITE.phoneDisplay}</a>
              </li>
              <li>
                <span className="contact-label">Ubicación</span>
                {SITE.city}, {SITE.region}, Chile
              </li>
            </ul>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
