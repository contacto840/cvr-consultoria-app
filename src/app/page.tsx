"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const PHONE = "56938689157";
const WA_MSG = encodeURIComponent(
  "Hola CVR Consultoría Predial, me gustaría consultar sobre sus servicios."
);

const COMMUNES = [
  "Bulnes", "Chillán", "Chillán Viejo", "Cobquecura", "Coelemu",
  "Coihueco", "El Carmen", "Ninhue", "Ñiquén", "Pemuco",
  "Pinto", "Portezuelo", "Quillón", "Quirihue", "Ranquil",
  "San Carlos", "San Fabián", "San Ignacio", "San Nicolás",
  "Santa Bárbara", "Tucapel", "Yungay",
];

const PROPERTY_TYPES = [
  { value: "casa", label: "🏠 Casa" },
  { value: "departamento", label: "🏢 Departamento" },
  { value: "terreno", label: "🌿 Terreno" },
  { value: "agricola", label: "🌾 Agrícola" },
];

const TESTIMONIALS = [
  {
    avatar: "👨‍💼",
    name: "Pedro Muñoz R.",
    role: "Inversionista · San Carlos",
    text: "Antes de cerrar la compra de un terreno agrícola, CVR detectó una servidumbre no declarada que habría complicado todo el proyecto. Su informe fue clave para renegociar el precio.",
    stars: 5,
  },
  {
    avatar: "👩‍👧",
    name: "Ana Vera P.",
    role: "Familia compradora · Chillán",
    text: "Contratamos el estudio de títulos antes de comprar nuestra primera casa. Encontraron una hipoteca pendiente que ni el corredor mencionó. Fue la mejor inversión del proceso.",
    stars: 5,
  },
  {
    avatar: "👨‍🌾",
    name: "Roberto Henríquez",
    role: "Agrónomo · Coihueco",
    text: "Necesitaba tasación para un crédito hipotecario agrícola en el banco. El informe fue aceptado sin observaciones por BCI. Proceso rápido y muy profesional.",
    stars: 5,
  },
];

export default function Home() {
  const router = useRouter();
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "done">("idle");
  const [menuOpen, setMenuOpen] = useState(false);

  // Quick estimate state
  const [quickType, setQuickType] = useState("casa");
  const [quickComune, setQuickComune] = useState("Chillán");
  const [quickSurface, setQuickSurface] = useState("");

  const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus("sending");
    await new Promise((r) => setTimeout(r, 1200));
    setFormStatus("done");
  };

  const handleQuickEstimate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickSurface || parseFloat(quickSurface) <= 0) return;
    const params = new URLSearchParams({
      tipo: quickType,
      comuna: quickComune,
      superficie: quickSurface,
    });
    router.push(`/tasacion?${params.toString()}`);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {/* ── NAVBAR ───────────────────────────────────────── */}
      <nav className="navbar">
        <Link href="/" className="nav-logo" onClick={closeMenu}>
          <span className="nav-logo-cvr">CVR</span>
          <span className="nav-logo-sub">Consultoría Predial</span>
        </Link>
        <ul className="nav-links">
          <li><a href="#servicios">Servicios</a></li>
          <li><a href="#proceso">Proceso</a></li>
          <li><a href="#nosotros">Nosotros</a></li>
          <li><a href="#precios">Precios</a></li>
          <li><Link href="/propiedades">Propiedades</Link></li>
          <li><a href="#contacto">Contacto</a></li>
          <li>
            <Link href="/tasacion" className="btn-gold nav-cta">
              Tasación Online
            </Link>
          </li>
        </ul>
        <button
          className={`nav-hamburger${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menú"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* ── MOBILE MENU ──────────────────────────────────── */}
      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        <a href="#servicios" onClick={closeMenu}>Servicios</a>
        <a href="#proceso" onClick={closeMenu}>Proceso</a>
        <a href="#nosotros" onClick={closeMenu}>Nosotros</a>
        <a href="#precios" onClick={closeMenu}>Precios</a>
        <Link href="/propiedades" onClick={closeMenu}>🏠 Propiedades</Link>
        <a href="#contacto" onClick={closeMenu}>Contacto</a>
        <Link href="/tasacion" className="btn-gold mobile-menu-cta" onClick={closeMenu}>
          Tasación Online →
        </Link>
      </div>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-bg-img" />
        <div className="hero-overlay" />
        <div className="hero-overlay-bottom" />

        <div className="container hero-content">
          <div className="hero-eyebrow">
            <span className="hero-line" />
            <span className="hero-eyebrow-text">Auditoría Técnica y Legal · Ñuble, Chile</span>
          </div>

          <h1 className="hero-title serif">
            No somos corredores.<br />
            <em>Somos tu filtro de riesgo.</em>
          </h1>

          <p className="hero-desc">
            Más de 20 años asegurando inversiones inmobiliarias e industriales
            en la Región de Ñuble. Due Diligence, Estudio de Títulos y
            Tasaciones con rigor técnico y legal.
          </p>

          <div className="hero-actions">
            <a href="#quick-estimate" className="btn-gold">
              Tasación Express — Gratis
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a
              href={`https://wa.me/${PHONE}?text=${WA_MSG}`}
              target="_blank"
              className="btn-outline"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652c1.746.943 3.71 1.444 5.71 1.444h.005c6.585 0 11.946-5.336 11.949-11.896.002-3.176-1.24-6.165-3.479-8.447z"/>
              </svg>
              Consultar por WhatsApp
            </a>
          </div>

          <div className="hero-stats">
            {[
              { num: "20+", label: "Años de Experiencia" },
              { num: "500+", label: "Propiedades Evaluadas" },
              { num: "21", label: "Comunas de Ñuble" },
              { num: "100%", label: "Independiente" },
            ].map((s) => (
              <div key={s.label} className="hero-stat">
                <div className="hero-stat-num serif">{s.num}</div>
                <div className="hero-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUICK ESTIMATE ───────────────────────────────── */}
      <section id="quick-estimate" className="quick-section">
        <div className="container">
          <div className="quick-card">
            <div className="quick-card-header">
              <div className="quick-card-headline">
                <span className="badge-pill">⚡ Tasación Express</span>
                <h2 className="serif" style={{ marginTop: "0.6rem" }}>
                  Valoriza tu propiedad en 30 segundos
                </h2>
                <p>Sin registro. Sin costo. Sin compromiso.</p>
              </div>
              <div className="quick-card-badge">
                <span className="quick-free-tag">100% Gratuito</span>
              </div>
            </div>

            <form onSubmit={handleQuickEstimate}>
              <div className="quick-type-tabs">
                {PROPERTY_TYPES.map((pt) => (
                  <button
                    key={pt.value}
                    type="button"
                    className={`quick-type-tab${quickType === pt.value ? " active" : ""}`}
                    onClick={() => setQuickType(pt.value)}
                  >
                    {pt.label}
                  </button>
                ))}
              </div>
              <div className="quick-inputs">
                <div className="quick-input-group">
                  <label>
                    {quickType === "agricola" ? "Superficie (hectáreas)" : "Superficie (m²)"}
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.1"
                    placeholder={quickType === "agricola" ? "Ej: 5.5" : "Ej: 85"}
                    value={quickSurface}
                    onChange={(e) => setQuickSurface(e.target.value)}
                    required
                  />
                </div>
                <div className="quick-input-group">
                  <label>Comuna</label>
                  <select
                    value={quickComune}
                    onChange={(e) => setQuickComune(e.target.value)}
                  >
                    {COMMUNES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn-gold" style={{ whiteSpace: "nowrap" }}>
                  Calcular Valor →
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ────────────────────────────────────── */}
      <div className="trust-bar">
        <div className="container trust-bar-inner">
          <span className="trust-bar-label">Informes con validez para</span>
          <span className="trust-bar-divider" />
          <div className="trust-bar-items">
            {["Banco Estado", "BCI", "Scotiabank", "Santander", "Banco de Chile", "Conservador de Bienes Raíces", "Notarías", "SII"].map((b) => (
              <span key={b} className="trust-bar-item">{b}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── SERVICIOS ────────────────────────────────────── */}
      <section id="servicios" className="services-section">
        <div className="container">
          <div className="section-eyebrow">
            <span className="section-line" />
            <span className="section-eyebrow-text">Nuestra Experiencia</span>
          </div>
          <h2 className="section-title serif">Servicios Especializados</h2>
          <p className="section-desc">
            Análisis riguroso y auditoría de alto nivel para proteger su
            capital antes de cada operación inmobiliaria.
          </p>

          <div className="services-grid">
            {[
              {
                icon: "🏗️",
                tag: "Estudio Técnico",
                title: "Due Diligence Técnico",
                desc: "Auditoría integral de proyectos. Detectamos riesgos normativos, estructurales y constructivos antes de que usted firme cualquier instrumento.",
                href: "#contacto",
                cta: "Solicitar Due Diligence",
              },
              {
                icon: "⚖️",
                tag: "Estudio Legal",
                title: "Estudio de Títulos",
                desc: "Revisión exhaustiva del historial legal de la propiedad. Verificamos servidumbres, hipotecas, prohibiciones y dominio limpio.",
                href: "#contacto",
                cta: "Solicitar Estudio",
              },
              {
                icon: "📊",
                tag: "Tasación · Online",
                title: "Tasación Comercial",
                desc: "Valorización precisa bajo normativa NCh 3658 para propiedades habitacionales, agrícolas e industriales. Informe oficial con firma de perito.",
                href: "/tasacion",
                cta: "Iniciar Tasación Online",
              },
              {
                icon: "🌾",
                tag: "Sector Agrícola",
                title: "Predios Rurales y Agrícolas",
                desc: "Especialistas en la valorización y análisis de riesgo de predios rurales, hectáreas agrícolas y propiedades industriales en la región.",
                href: "#contacto",
                cta: "Consultar",
              },
              {
                icon: "🏦",
                tag: "Banca e Inversión",
                title: "Informes para Créditos",
                desc: "Tasaciones con validez para trámites bancarios, herencias y compraventas formales. Documentación compatible con requerimientos SBIF.",
                href: "#contacto",
                cta: "Solicitar Informe",
              },
              {
                icon: "🔍",
                tag: "Prevención de Riesgo",
                title: "Auditoría de Riesgo Predial",
                desc: "Identificamos problemáticas ocultas: irregularidades de superficie, zonas de riesgo natural, litigios pendientes y problemas de subdivisión.",
                href: "#contacto",
                cta: "Solicitar Auditoría",
              },
            ].map((svc) => (
              <div key={svc.title} className="service-card">
                <div className="service-icon">{svc.icon}</div>
                <span className="service-tag">{svc.tag}</span>
                <h3>{svc.title}</h3>
                <p>{svc.desc}</p>
                <a href={svc.href} className="service-link">
                  {svc.cta}
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESO ──────────────────────────────────────── */}
      <section id="proceso" className="process-section">
        <div className="container">
          <div className="process-header">
            <div className="section-eyebrow">
              <span className="section-line" />
              <span className="section-eyebrow-text">Cómo Funciona</span>
            </div>
            <h2 className="section-title serif">Tasación en 3 pasos simples</h2>
            <p className="section-desc">
              El proceso más rápido y riguroso para valorizar su propiedad en la Región de Ñuble.
              Desde el formulario hasta el informe firmado.
            </p>
          </div>

          <div className="process-steps">
            <div className="process-step">
              <div className="process-step-icon">
                🏠
                <span className="process-step-num">1</span>
              </div>
              <h3>Ingresa los datos</h3>
              <p>
                Completa el formulario online con los datos básicos de tu propiedad:
                tipo, superficie, ubicación y estado. Tarda menos de 2 minutos.
              </p>
            </div>

            <div className="process-connector">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </div>

            <div className="process-step">
              <div className="process-step-icon">
                📊
                <span className="process-step-num">2</span>
              </div>
              <h3>Recibe tu valorización</h3>
              <p>
                Nuestro motor de cálculo basado en datos reales de mercado entrega
                una valorización referencial al instante. Incluye rango mínimo y máximo.
              </p>
            </div>

            <div className="process-connector">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </div>

            <div className="process-step">
              <div className="process-step-icon">
                📄
                <span className="process-step-num">3</span>
              </div>
              <h3>Informe oficial firmado</h3>
              <p>
                Si necesitas el informe con validez legal, lo emitimos con firma
                de perito en un máximo de 24 horas. Válido para bancos, notarías y tribunales.
              </p>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: "3.5rem" }}>
            <Link href="/tasacion" className="btn-gold">
              Comenzar Ahora — Es Gratis
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── NOSOTROS ─────────────────────────────────────── */}
      <section id="nosotros" className="about-section">
        <div className="container">
          <div className="about-grid">
            <div className="about-visual">
              <div className="about-card-main">
                <p className="about-quote">
                  &ldquo;En bienes raíces, la diferencia entre una buena y una
                  mala inversión suele ser información que nadie te dijo.
                  Nosotros somos esa información.&rdquo;
                </p>
                <div className="about-quote-author">Carlos Vivanco R. — Fundador, Perito Tasador</div>

                <div className="about-stats-row">
                  {[
                    { num: "20+", label: "Años activos" },
                    { num: "500+", label: "Informes emitidos" },
                    { num: "Ñuble", label: "Especialización regional" },
                    { num: "NCh 3658", label: "Norma aplicada" },
                  ].map((s) => (
                    <div key={s.label} className="about-stat-box">
                      <span className="about-stat-num serif">{s.num}</span>
                      <span className="about-stat-label">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="about-text">
              <div className="section-eyebrow">
                <span className="section-line" />
                <span className="section-eyebrow-text">Sobre CVR</span>
              </div>
              <h2 className="section-title serif">
                Independencia Técnica al Servicio de su Inversión
              </h2>
              <p>
                CVR Consultoría Predial nació de la necesidad de contar con un
                aliado técnico independiente en las operaciones inmobiliarias de
                la Región de Ñuble. No vendemos propiedades: protegemos su
                inversión con análisis objetivo y rigor profesional.
              </p>
              <p>
                Desde Chillán asesoramos a inversionistas, familias y empresas
                agrícolas en cada etapa del proceso: verificación legal,
                valoración técnica, y detección de riesgos ocultos antes de la
                firma.
              </p>

              <div className="about-features">
                {[
                  "Perito tasador certificado con más de 20 años de trayectoria",
                  "Metodología basada en la Norma Chilena NCh 3658 vigente",
                  "Cobertura en las 21 comunas de la Región de Ñuble",
                  "Informes con validez para bancos, notarías y tribunales",
                  "Sin conflicto de interés: no somos corredores ni vendedores",
                ].map((f) => (
                  <div key={f} className="about-feature">
                    <div className="about-feature-icon">✓</div>
                    <span className="about-feature-text">{f}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: "2.5rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <a href="#contacto" className="btn-gold">
                  Hablar con el Perito
                </a>
                <Link href="/tasacion" className="btn-outline">
                  Tasación Automática →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIOS ──────────────────────────────────── */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-eyebrow">
            <span className="section-line" />
            <span className="section-eyebrow-text">Clientes</span>
          </div>
          <h2 className="section-title serif">Lo que dicen nuestros clientes</h2>
          <p className="section-desc">
            Familias, inversionistas y empresas que protegieron su capital con una auditoría técnica independiente.
          </p>

          <div className="testimonials-grid">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="testimonial-card">
                <div className="testimonial-stars">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="testimonial-text">&ldquo;{t.text}&rdquo;</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.avatar}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRECIOS ──────────────────────────────────────── */}
      <section id="precios" className="pricing-section">
        <div className="container">
          <div className="section-eyebrow">
            <span className="section-line" />
            <span className="section-eyebrow-text">Transparencia de Precios</span>
          </div>
          <h2 className="section-title serif">Servicio a su medida</h2>
          <p className="section-desc">
            Desde una tasación referencial gratuita hasta una auditoría técnica completa.
            Siempre sin conflicto de interés.
          </p>

          <div className="pricing-grid">
            {/* Card 1: Tasación Express */}
            <div className="pricing-card">
              <div className="pricing-tag">Tasación Online</div>
              <h3>Estimación Referencial</h3>
              <p className="pricing-desc">
                Valorización instantánea basada en datos reales de mercado de la Región de Ñuble.
              </p>
              <div className="pricing-price-block">
                <div className="pricing-amount free">Gratis</div>
                <div className="pricing-period">Resultado inmediato · Sin registro</div>
              </div>
              <ul className="pricing-features">
                {[
                  "Valorización en UF y pesos chilenos",
                  "Rango mínimo y máximo de mercado",
                  "Precio por m² de referencia",
                  "21 comunas de la Región de Ñuble",
                  "Tipos: casa, depto, terreno, agrícola",
                ].map((f) => (
                  <li key={f}><span className="pricing-check">✓</span>{f}</li>
                ))}
              </ul>
              <Link href="/tasacion" className="btn-outline" style={{ textAlign: "center", justifyContent: "center" }}>
                Calcular Gratis →
              </Link>
            </div>

            {/* Card 2: Informe Oficial (FEATURED) */}
            <div className="pricing-card featured">
              <span className="pricing-badge">⭐ Más Solicitado</span>
              <div className="pricing-tag">Informe con Perito</div>
              <h3>Tasación Oficial</h3>
              <p className="pricing-desc">
                Informe firmado por perito tasador certificado. Válido para bancos, notarías, herencias y compraventas formales.
              </p>
              <div className="pricing-price-block">
                <div className="pricing-amount">$15.000</div>
                <div className="pricing-period">CLP · Entrega en 24 horas hábiles</div>
              </div>
              <ul className="pricing-features">
                {[
                  "Todo lo del plan gratuito",
                  "Firma de perito tasador certificado",
                  "Validez para trámites bancarios",
                  "Válido en notarías y tribunales",
                  "Envío digital al correo registrado",
                  "Compatible con requisitos SBIF",
                ].map((f) => (
                  <li key={f}><span className="pricing-check">✓</span>{f}</li>
                ))}
              </ul>
              <Link href="/tasacion" className="btn-gold" style={{ justifyContent: "center" }}>
                Solicitar Informe Oficial
              </Link>
            </div>

            {/* Card 3: Servicios Profesionales */}
            <div className="pricing-card">
              <div className="pricing-tag">Servicios Profesionales</div>
              <h3>Due Diligence & Títulos</h3>
              <p className="pricing-desc">
                Auditoría técnica y legal completa para inversiones de mayor escala. Cotización según la complejidad del caso.
              </p>
              <div className="pricing-price-block">
                <div className="pricing-amount consult">A Cotizar</div>
                <div className="pricing-period">Según complejidad del predio</div>
              </div>
              <ul className="pricing-features">
                {[
                  "Due Diligence técnico completo",
                  "Estudio de títulos exhaustivo",
                  "Verificación de servidumbres e hipotecas",
                  "Auditoría de riesgo predial",
                  "Informes para créditos agrícolas",
                  "Cobertura en toda la Región de Ñuble",
                ].map((f) => (
                  <li key={f}><span className="pricing-check">✓</span>{f}</li>
                ))}
              </ul>
              <a
                href={`https://wa.me/${PHONE}?text=${encodeURIComponent("Hola CVR, necesito cotizar un servicio de Due Diligence / Estudio de Títulos.")}`}
                target="_blank"
                className="btn-outline"
                style={{ textAlign: "center", justifyContent: "center" }}
              >
                Solicitar Cotización
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── CORREDORES B2B BANNER ────────────────────────── */}
      <section style={{
        padding: "4rem 0",
        background: "linear-gradient(135deg, var(--navy-card) 0%, var(--navy-mid) 100%)",
        borderTop: "1px solid var(--border-gold)",
        borderBottom: "1px solid var(--border-gold)",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at right center, rgba(197,168,91,0.08) 0%, transparent 60%)",
          pointerEvents: "none",
        }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "2rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <span className="badge-pill" style={{ marginBottom: "1rem", display: "inline-flex" }}>
                Para Corredores de Propiedades
              </span>
              <h2 className="serif" style={{ fontSize: "clamp(1.4rem,2.5vw,2rem)", fontWeight: 900, marginBottom: "0.75rem" }}>
                ¿Eres corredor o agencia inmobiliaria?
              </h2>
              <p style={{ color: "var(--text-sub)", fontSize: "0.95rem", maxWidth: 520, lineHeight: 1.7, fontWeight: 300 }}>
                Accede a tasaciones con firma de perito ilimitadas para tus clientes.
                Tu proceso se cierra más rápido — CVR emite el informe, tú te llevas la comisión.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", flexShrink: 0 }}>
              <Link href="/corredores" className="btn-gold">
                Ver Planes de Corredor →
              </Link>
              <a
                href={`https://wa.me/${PHONE}?text=${encodeURIComponent("Hola CVR, soy corredor de propiedades y me interesa el plan para corredores.")}`}
                target="_blank"
                className="btn-outline"
                style={{ textAlign: "center", justifyContent: "center" }}
              >
                Consultar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BAND ─────────────────────────────────────── */}
      <section className="cta-band">
        <div className="container cta-band-inner">
          <span className="badge-pill">Respuesta en menos de 24 horas</span>
          <h2 className="section-title serif" style={{ marginTop: "1.2rem" }}>
            ¿Va a comprar o vender una propiedad?
          </h2>
          <p className="section-desc">
            Antes de firmar cualquier instrumento, asegúrese con una auditoría
            técnica independiente. Hablemos hoy.
          </p>
          <div className="cta-buttons">
            <a
              href={`https://wa.me/${PHONE}?text=${WA_MSG}`}
              target="_blank"
              className="btn-gold"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652c1.746.943 3.71 1.444 5.71 1.444h.005c6.585 0 11.946-5.336 11.949-11.896.002-3.176-1.24-6.165-3.479-8.447z"/>
              </svg>
              Contactar por WhatsApp
            </a>
            <a href="mailto:contacto@cvrpropiedades.com" className="btn-outline">
              contacto@cvrpropiedades.com
            </a>
          </div>
        </div>
      </section>

      {/* ── CONTACTO ─────────────────────────────────────── */}
      <section id="contacto" className="contact-section">
        <div className="container">
          <div className="contact-grid">
            <div>
              <div className="section-eyebrow">
                <span className="section-line" />
                <span className="section-eyebrow-text">Contáctenos</span>
              </div>
              <h2 className="section-title serif">
                Conversemos sobre su Propiedad
              </h2>
              <p className="section-desc">
                Cada caso es único. Cuéntenos qué necesita y le daremos una
                respuesta directa, sin rodeos.
              </p>

              <div className="contact-items">
                {[
                  {
                    icon: "📍",
                    label: "Ubicación",
                    value: "Chillán, Región de Ñuble, Chile",
                    href: "#",
                  },
                  {
                    icon: "📧",
                    label: "Correo Electrónico",
                    value: "contacto@cvrpropiedades.com",
                    href: "mailto:contacto@cvrpropiedades.com",
                  },
                  {
                    icon: "💬",
                    label: "WhatsApp Directo",
                    value: `+${PHONE.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, "$1 $2 $3 $4")}`,
                    href: `https://wa.me/${PHONE}?text=${WA_MSG}`,
                  },
                  {
                    icon: "🕒",
                    label: "Horario de Atención",
                    value: "Lunes a Viernes · 9:00 – 18:00 hrs",
                    href: "#",
                  },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="contact-item"
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                  >
                    <div className="contact-item-icon">{item.icon}</div>
                    <div>
                      <div className="contact-item-label">{item.label}</div>
                      <div className="contact-item-value">{item.value}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="contact-form">
              <h3 className="serif" style={{ fontSize: "1.3rem", marginBottom: "1.5rem" }}>
                Solicitar Asesoría
              </h3>
              {formStatus === "done" ? (
                <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>✅</div>
                  <p style={{ color: "var(--gold)", fontWeight: 600, fontSize: "1.05rem" }}>¡Mensaje enviado!</p>
                  <p style={{ color: "var(--text-sub)", fontSize: "0.88rem", marginTop: "0.5rem" }}>
                    Le responderemos en menos de 24 horas hábiles.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleForm}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Nombre</label>
                      <input type="text" placeholder="Carlos González" required />
                    </div>
                    <div className="form-group">
                      <label>Teléfono / WhatsApp</label>
                      <input type="tel" placeholder="+56 9 1234 5678" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Correo Electrónico</label>
                    <input type="email" placeholder="correo@ejemplo.cl" required />
                  </div>
                  <div className="form-group">
                    <label>Servicio de Interés</label>
                    <select>
                      <option value="">— Seleccionar —</option>
                      <option>Due Diligence Técnico</option>
                      <option>Estudio de Títulos</option>
                      <option>Tasación Comercial</option>
                      <option>Informe para Banco</option>
                      <option>Auditoría Predial</option>
                      <option>Otro</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Descripción breve</label>
                    <textarea placeholder="Cuéntenos brevemente sobre la propiedad y su consulta…" />
                  </div>
                  <button
                    type="submit"
                    className="btn-gold"
                    style={{ width: "100%", justifyContent: "center" }}
                    disabled={formStatus === "sending"}
                  >
                    {formStatus === "sending" ? "Enviando…" : "Enviar Solicitud →"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer>
        <div className="container footer-inner">
          <div className="footer-left">
            <span className="footer-cvr">CVR</span>
            <span className="footer-sub">Consultoría Predial</span>
          </div>
          <p className="footer-copy">
            © {new Date().getFullYear()} CVR Consultoría Predial · Chillán, Región de Ñuble, Chile
          </p>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            <a href="/tasacion" style={{ color: "var(--text-muted)", fontSize: "0.78rem", textDecoration: "none" }}>
              Tasación Online
            </a>
            <Link href="/corredores" style={{ color: "var(--text-muted)", fontSize: "0.78rem", textDecoration: "none" }}>
              Plan Corredores
            </Link>
            <a href="#precios" style={{ color: "var(--text-muted)", fontSize: "0.78rem", textDecoration: "none" }}>
              Precios
            </a>
            <a href="#contacto" style={{ color: "var(--text-muted)", fontSize: "0.78rem", textDecoration: "none" }}>
              Contacto
            </a>
          </div>
        </div>
      </footer>

      {/* ── WHATSAPP FLOTANTE ────────────────────────────── */}
      <a
        href={`https://wa.me/${PHONE}?text=${WA_MSG}`}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label="Contactar por WhatsApp"
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
          <path d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652c1.746.943 3.71 1.444 5.71 1.444h.005c6.585 0 11.946-5.336 11.949-11.896.002-3.176-1.24-6.165-3.479-8.447zM12.05 21.785h-.004c-1.774 0-3.513-.476-5.031-1.378l-.361-.214-3.741.975.997-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.002-5.45 4.436-9.884 9.889-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.892 6.993c-.003 5.45-4.437 9.884-9.884 9.884zm5.421-7.403c-.297-.149-1.758-.867-2.031-.967-.272-.099-.47-.148-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z"/>
        </svg>
      </a>
    </>
  );
}
