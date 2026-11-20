import Link from "next/link";
import { LEGAL_LINE, SITE } from "@/lib/site";

const SERVICIOS = [
  { href: "/servicios/venta", label: "Venta de propiedades" },
  { href: "/servicios/arriendo", label: "Arriendo y administración" },
  { href: "/servicios/asesoria-de-compra", label: "Asesoría de compra" },
  { href: "/propiedades", label: "Propiedades disponibles" },
  { href: "/corredores", label: "Corredores asociados" },
];

const HERRAMIENTAS = [
  { href: "/tasacion", label: "Estimación referencial de valor" },
  { href: "/herramientas/costos-de-compra", label: "Costos reales de compra" },
  { href: "/herramientas/diagnostico-predio", label: "Diagnóstico de un predio" },
];

const LEGAL = [
  { href: "/privacidad", label: "Política de privacidad" },
  { href: "/terminos", label: "Términos de uso" },
  { href: "/admin", label: "Administración" },
];

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <div className="footer-brand">
            <span className="brand-cvr">CVR</span>
            <span className="brand-sub">Propiedades</span>
          </div>
          <p className="footer-text">
            Corretaje de propiedades en {SITE.city} y la {SITE.region}. Venta, arriendo y
            acompañamiento en la compra, con revisión técnica y legal del inmueble.
          </p>
          <p className="footer-text">
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            <br />
            <a href={`tel:+${SITE.phoneE164}`}>{SITE.phoneDisplay}</a>
            <br />
            {SITE.city}, {SITE.region}, Chile
          </p>
        </div>

        <nav aria-label="Servicios">
          <h2 className="footer-heading">Servicios</h2>
          <ul className="footer-list">
            {SERVICIOS.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Herramientas">
          <h2 className="footer-heading">Herramientas</h2>
          <ul className="footer-list">
            {HERRAMIENTAS.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="footer-heading">Informes firmados</h2>
          <ul className="footer-list">
            <li>
              <a href={SITE.tasacionesUrl} rel="noopener">
                Tasaciones y peritajes ↗
              </a>
            </li>
            <li>
              <a href={SITE.tasaciones.estudioTitulos} rel="noopener">
                Estudio de títulos ↗
              </a>
            </li>
            <li>
              <a href={SITE.tasaciones.dueDiligence} rel="noopener">
                Due diligence ↗
              </a>
            </li>
            <li>
              <a href={SITE.tasaciones.peritajeJudicial} rel="noopener">
                Peritajes judiciales ↗
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container footer-legal">
        <p>{LEGAL_LINE}</p>
        <ul className="footer-legal-links">
          {LEGAL.map((l) => (
            <li key={l.href}>
              <Link href={l.href}>{l.label}</Link>
            </li>
          ))}
        </ul>
        <p>© {new Date().getFullYear()} {SITE.legalName}. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
