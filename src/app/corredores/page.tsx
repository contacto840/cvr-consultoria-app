"use client";

import Link from "next/link";

const PHONE = "56938689157";
const WA_CORREDORES = encodeURIComponent(
  "Hola CVR, me interesa el Plan Corredor para acceso ilimitado a tasaciones. ¿Podemos hablar?"
);

const PLANES = [
  {
    id: "starter",
    name: "Starter",
    price: "$39.990",
    period: "/mes",
    desc: "Para corredores independientes que necesitan tasaciones frecuentes.",
    features: [
      "10 tasaciones con informe oficial al mes",
      "Entrega automática en 24 hrs",
      "Informes en PDF con firma de perito",
      "Válidos para bancos y notarías",
      "Soporte por WhatsApp",
    ],
    cta: "Suscribirme",
    featured: false,
  },
  {
    id: "pro",
    name: "Pro Corredor",
    price: "$79.990",
    period: "/mes",
    desc: "Para agencias activas que cierran varias operaciones al mes.",
    features: [
      "Tasaciones ilimitadas con informe oficial",
      "Entrega prioritaria en 12 hrs",
      "Informe PDF con firma de perito",
      "Due Diligence Express incluido (2/mes)",
      "Acceso al panel de historial",
      "Soporte prioritario por WhatsApp",
      "Descuento en Estudios de Títulos",
    ],
    cta: "Empezar Ahora",
    featured: true,
  },
  {
    id: "agencia",
    name: "Agencia",
    price: "A cotizar",
    period: "",
    desc: "Para inmobiliarias y agencias con volumen alto y múltiples agentes.",
    features: [
      "Todo del plan Pro",
      "Múltiples usuarios / agentes",
      "Factura mensual unificada",
      "Integraciones con su CRM",
      "Account manager dedicado",
      "SLA de respuesta garantizado",
    ],
    cta: "Solicitar Cotización",
    featured: false,
  },
];

const BENEFITS = [
  {
    icon: "⚡",
    title: "Cierra más rápido",
    desc: "Entrega el informe de tasación a tu cliente en horas, no días. Acelera la toma de decisión y el cierre.",
  },
  {
    icon: "🏦",
    title: "Informes con validez bancaria",
    desc: "Todos los informes tienen firma de perito certificado. Válidos para BCI, Banco Estado, Scotiabank y más.",
  },
  {
    icon: "📊",
    title: "Respaldo técnico independiente",
    desc: "Ofrecele a tu cliente el rigor de un perito externo. Sin conflicto de interés. Diferénciate de la competencia.",
  },
  {
    icon: "🔄",
    title: "Proceso 100% automático",
    desc: "Solicitas el informe, tu cliente recibe el PDF firmado por email. Tú no haces nada más.",
  },
];

export default function CorredoresPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--navy)" }}>

      {/* NAV */}
      <nav className="navbar">
        <Link href="/" className="nav-logo">
          <span className="nav-logo-cvr">CVR</span>
          <span className="nav-logo-sub">Consultoría Predial</span>
        </Link>
        <ul className="nav-links">
          <li><Link href="/#servicios">Servicios</Link></li>
          <li><Link href="/#precios">Precios</Link></li>
          <li><Link href="/#contacto">Contacto</Link></li>
          <li>
            <Link href="/tasacion" className="btn-gold nav-cta">
              Tasación Online
            </Link>
          </li>
        </ul>
      </nav>

      {/* HERO */}
      <section style={{ paddingTop: "120px", paddingBottom: "5rem", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 60% 30%, rgba(197,168,91,0.07) 0%, transparent 60%)",
          pointerEvents: "none",
        }} />
        <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <span className="badge-pill" style={{ marginBottom: "1.5rem", display: "inline-flex" }}>
            Para Corredores de Propiedades
          </span>
          <h1 className="serif" style={{ fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: "1.2rem" }}>
            Tu respaldo técnico independiente.<br />
            <em style={{ color: "var(--gold)", fontStyle: "italic" }}>Ilimitado y automático.</em>
          </h1>
          <p style={{ color: "var(--text-sub)", fontSize: "1.05rem", maxWidth: 580, margin: "0 auto 2.5rem", lineHeight: 1.75, fontWeight: 300 }}>
            Ofrece informes de tasación oficiales con firma de perito a tus clientes —
            sin hacer nada extra. CVR emite, firma y entrega. Tú cierras la venta.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a href={`https://wa.me/${PHONE}?text=${WA_CORREDORES}`} target="_blank" className="btn-gold">
              Hablar con CVR →
            </a>
            <a href="#planes" className="btn-outline">Ver Planes</a>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section style={{ padding: "4rem 0", background: "var(--navy-mid)", borderTop: "1px solid var(--border)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "2rem" }}>
            {BENEFITS.map((b) => (
              <div key={b.title} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div style={{
                  width: 48, height: 48, borderRadius: "var(--radius-md)",
                  background: "var(--gold-dim)", border: "1px solid var(--border-gold)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem",
                }}>
                  {b.icon}
                </div>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text)", fontFamily: "'Playfair Display',serif" }}>
                  {b.title}
                </h3>
                <p style={{ fontSize: "0.88rem", color: "var(--text-sub)", lineHeight: 1.65, fontWeight: 300 }}>
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANES */}
      <section id="planes" style={{ padding: "6rem 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div className="section-eyebrow" style={{ justifyContent: "center" }}>
              <span className="section-line" />
              <span className="section-eyebrow-text">Planes de Suscripción</span>
              <span className="section-line" />
            </div>
            <h2 className="serif section-title" style={{ marginTop: "1rem" }}>
              Elige el plan para tu agencia
            </h2>
            <p className="section-desc" style={{ margin: "0 auto" }}>
              Sin contrato de permanencia. Cancela cuando quieras. Precios en pesos chilenos + IVA.
            </p>
          </div>

          <div className="pricing-grid">
            {PLANES.map((plan) => (
              <div
                key={plan.id}
                className={`pricing-card${plan.featured ? " featured" : ""}`}
              >
                {plan.featured && (
                  <span className="pricing-badge">⭐ Más Elegido</span>
                )}
                <div className="pricing-tag">{plan.name}</div>
                <h3>{plan.name}</h3>
                <p className="pricing-desc">{plan.desc}</p>

                <div className="pricing-price-block">
                  <div className={`pricing-amount${plan.price === "A cotizar" ? " consult" : ""}`}>
                    {plan.price}
                  </div>
                  {plan.period && (
                    <div className="pricing-period">CLP + IVA{plan.period}</div>
                  )}
                </div>

                <ul className="pricing-features">
                  {plan.features.map((f) => (
                    <li key={f}>
                      <span className="pricing-check">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href={`https://wa.me/${PHONE}?text=${encodeURIComponent(`Hola CVR, me interesa el Plan ${plan.name} para corredores.`)}`}
                  target="_blank"
                  className={plan.featured ? "btn-gold" : "btn-outline"}
                  style={{ textAlign: "center", justifyContent: "center" }}
                >
                  {plan.cta} →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{
        padding: "5rem 0",
        background: "var(--navy-mid)",
        borderTop: "1px solid var(--border)",
        textAlign: "center",
      }}>
        <div className="container">
          <span className="badge-pill" style={{ marginBottom: "1.5rem", display: "inline-flex" }}>
            Sin permanencia · Activación inmediata
          </span>
          <h2 className="serif section-title">¿Listo para diferenciarte?</h2>
          <p className="section-desc" style={{ margin: "0 auto 2.5rem" }}>
            Escríbenos hoy y activamos tu cuenta en menos de 24 horas.
            Tu primer informe puede salir mañana.
          </p>
          <a
            href={`https://wa.me/${PHONE}?text=${WA_CORREDORES}`}
            target="_blank"
            className="btn-gold"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652c1.746.943 3.71 1.444 5.71 1.444h.005c6.585 0 11.946-5.336 11.949-11.896.002-3.176-1.24-6.165-3.479-8.447z"/>
            </svg>
            Activar mi Plan de Corredor
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="container footer-inner">
          <div className="footer-left">
            <span className="footer-cvr">CVR</span>
            <span className="footer-sub">Consultoría Predial</span>
          </div>
          <p className="footer-copy">
            © {new Date().getFullYear()} CVR Consultoría Predial · Chillán, Región de Ñuble
          </p>
          <Link href="/" style={{ color: "var(--text-muted)", fontSize: "0.78rem", textDecoration: "none" }}>
            ← Volver al inicio
          </Link>
        </div>
      </footer>
    </div>
  );
}
