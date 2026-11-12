"use client";

import { useState } from "react";
import Link from "next/link";
import { ÑUBLE_COMMUNES, SECTORS_BY_COMMUNE } from "@/lib/seed-data";

const PHONE = "56938689157";

const inputStyle: React.CSSProperties = {
  background: "rgba(5,12,23,0.8)",
  border: "1px solid rgba(143,163,188,0.25)",
  borderRadius: 8,
  color: "#fff",
  padding: "12px 16px",
  fontSize: 15,
  width: "100%",
  outline: "none",
  fontFamily: "var(--font-inter), sans-serif",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  color: "#8fa3bc",
  fontWeight: 600,
  marginBottom: 6,
  textTransform: "uppercase",
  letterSpacing: 0.8,
};

const sectionStyle: React.CSSProperties = {
  background: "rgba(13,22,36,0.8)",
  border: "1px solid rgba(197,168,91,0.15)",
  borderRadius: 12,
  padding: "28px",
  marginBottom: 24,
};

const gridRow: React.CSSProperties = {
  display: "grid",
  gap: 16,
  gridTemplateColumns: "1fr 1fr",
};

export default function AgregarPropiedadPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    propertyType: "casa",
    transactionType: "venta",
    comuna: "Chillán",
    sector: "",
    address: "",
    surface: "",
    terrainSurface: "",
    bedrooms: "",
    bathrooms: "",
    parkingSpaces: "",
    priceUF: "",
    priceNegotiable: false,
    contactName: "",
    contactPhone: "",
    contactEmail: "",
  });

  // Sectors depend on the selected commune (derived during render)
  const sectors = SECTORS_BY_COMMUNE[form.comuna] ?? [];

  // Changing commune invalidates the dependent sector selection
  const set = (field: string, value: string | boolean) =>
    setForm(f => ({ ...f, [field]: value, ...(field === "comuna" ? { sector: "" } : {}) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.title || !form.surface || !form.priceUF || !form.contactName || !form.contactPhone) {
      setError("Por favor completa todos los campos obligatorios (*).");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/propiedades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setSuccess(true);
      } else {
        setError(data.error ?? "Error al publicar. Intenta nuevamente.");
      }
    } catch {
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div style={{ minHeight: "100vh", background: "#050c17", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ textAlign: "center", maxWidth: 480 }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: "#fff", marginBottom: 12 }}>¡Propiedad publicada!</h1>
          <p style={{ color: "#8fa3bc", marginBottom: 8, lineHeight: 1.6 }}>
            Tu propiedad ya está visible en el portal de CVR Consultoría Predial.
          </p>
          <p style={{ color: "#8fa3bc", marginBottom: 32, lineHeight: 1.6 }}>
            Los interesados se contactarán directamente al número que indicaste.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/propiedades" style={{ background: "#c5a85b", color: "#050c17", padding: "14px 28px", borderRadius: 8, fontWeight: 800, textDecoration: "none", fontSize: 15 }}>
              Ver propiedades
            </Link>
            <button onClick={() => setSuccess(false)} style={{ background: "transparent", color: "#8fa3bc", border: "1px solid rgba(143,163,188,0.3)", padding: "14px 28px", borderRadius: 8, fontSize: 15, cursor: "pointer" }}>
              Publicar otra
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#050c17", color: "#fff", fontFamily: "var(--font-inter), sans-serif" }}>
      {/* ── NAVBAR ───────────────────────────────────────────── */}
      <nav style={{ background: "rgba(5,12,23,0.97)", borderBottom: "1px solid rgba(197,168,91,0.2)", position: "sticky", top: 0, zIndex: 100, padding: "0 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontWeight: 900, fontSize: 22, color: "#fff" }}>CVR</span>
            <span style={{ fontSize: 11, color: "#8fa3bc", lineHeight: 1.3 }}>Consultoría<br />Predial</span>
          </Link>
          <div className="desktop-nav" style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <Link href="/" style={{ color: "#8fa3bc", textDecoration: "none", fontSize: 14 }}>Inicio</Link>
            <Link href="/tasacion" style={{ color: "#8fa3bc", textDecoration: "none", fontSize: 14 }}>Tasación</Link>
            <Link href="/propiedades" style={{ color: "#c5a85b", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>← Propiedades</Link>
          </div>
          <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)} style={{ display: "none", background: "none", border: "none", color: "#c5a85b", fontSize: 24, cursor: "pointer" }}>☰</button>
        </div>
        {menuOpen && (
          <div className="mobile-menu" style={{ padding: "16px 24px 20px", borderTop: "1px solid rgba(197,168,91,0.15)", display: "flex", flexDirection: "column", gap: 14 }}>
            <Link href="/" style={{ color: "#8fa3bc", textDecoration: "none" }}>Inicio</Link>
            <Link href="/tasacion" style={{ color: "#8fa3bc", textDecoration: "none" }}>Tasación</Link>
            <Link href="/propiedades" style={{ color: "#c5a85b", fontWeight: 600, textDecoration: "none" }}>← Propiedades</Link>
          </div>
        )}
      </nav>

      {/* ── HEADER ───────────────────────────────────────────── */}
      <div style={{ background: "linear-gradient(135deg, #0d1624 0%, #050c17 100%)", padding: "40px 24px 32px", borderBottom: "1px solid rgba(197,168,91,0.15)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ fontSize: 11, color: "#c5a85b", letterSpacing: 2, fontWeight: 700, marginBottom: 10, textTransform: "uppercase" }}>
            Portal de propiedades CVR
          </div>
          <h1 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 900, margin: "0 0 10px", color: "#fff" }}>
            Publicar Propiedad
          </h1>
          <p style={{ color: "#8fa3bc", margin: 0, fontSize: 15, lineHeight: 1.6 }}>
            Publica tu propiedad en el portal de CVR y llega directamente a compradores y arrendatarios de la Región de Ñuble. <strong style={{ color: "#c5a85b" }}>100% gratis.</strong>
          </p>
        </div>
      </div>

      {/* ── FORM ────────────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "36px 24px 60px" }}>
        <form onSubmit={handleSubmit}>

          {/* SECCIÓN 1: Tipo */}
          <div style={sectionStyle}>
            <h2 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 700, color: "#c5a85b", display: "flex", alignItems: "center", gap: 8 }}>
              <span>📋</span> Tipo de operación
            </h2>
            <div style={gridRow}>
              <div>
                <label style={labelStyle}>Tipo de propiedad *</label>
                <select value={form.propertyType} onChange={e => set("propertyType", e.target.value)} style={inputStyle}>
                  <option value="casa">Casa</option>
                  <option value="departamento">Departamento</option>
                  <option value="terreno">Terreno</option>
                  <option value="agricola">Agrícola / Rural</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Operación *</label>
                <select value={form.transactionType} onChange={e => set("transactionType", e.target.value)} style={inputStyle}>
                  <option value="venta">Venta</option>
                  <option value="arriendo">Arriendo</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: Ubicación */}
          <div style={sectionStyle}>
            <h2 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 700, color: "#c5a85b", display: "flex", alignItems: "center", gap: 8 }}>
              <span>📍</span> Ubicación
            </h2>
            <div style={{ ...gridRow, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Comuna *</label>
                <select value={form.comuna} onChange={e => set("comuna", e.target.value)} style={inputStyle}>
                  {ÑUBLE_COMMUNES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Sector / Barrio</label>
                {sectors.length > 0 ? (
                  <select value={form.sector} onChange={e => set("sector", e.target.value)} style={inputStyle}>
                    <option value="">— Seleccionar sector —</option>
                    {sectors.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                ) : (
                  <input type="text" placeholder="Nombre del sector (opcional)" value={form.sector} onChange={e => set("sector", e.target.value)} style={inputStyle} />
                )}
              </div>
            </div>
            <div>
              <label style={labelStyle}>Dirección (opcional)</label>
              <input type="text" placeholder="Ej: Av. El Roble 1234 — se mostrará si la agregas" value={form.address} onChange={e => set("address", e.target.value)} style={inputStyle} />
            </div>
          </div>

          {/* SECCIÓN 3: Descripción */}
          <div style={sectionStyle}>
            <h2 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 700, color: "#c5a85b", display: "flex", alignItems: "center", gap: 8 }}>
              <span>📝</span> Descripción
            </h2>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Título del aviso *</label>
              <input
                type="text"
                placeholder="Ej: Casa 3D 2B 120m² en Las Mariposas, Chillán"
                value={form.title}
                onChange={e => set("title", e.target.value)}
                style={inputStyle}
                maxLength={120}
              />
            </div>
            <div>
              <label style={labelStyle}>Descripción detallada</label>
              <textarea
                placeholder="Describe la propiedad: características, estado, orientación, vecindario, etc."
                value={form.description}
                onChange={e => set("description", e.target.value)}
                rows={4}
                style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }}
              />
            </div>
          </div>

          {/* SECCIÓN 4: Características */}
          <div style={sectionStyle}>
            <h2 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 700, color: "#c5a85b", display: "flex", alignItems: "center", gap: 8 }}>
              <span>📐</span> Características
            </h2>
            <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr", marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Superficie construida m² *</label>
                <input type="number" placeholder="Ej: 120" min={1} max={100000} value={form.surface} onChange={e => set("surface", e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Superficie terreno m²</label>
                <input type="number" placeholder="Ej: 300" min={1} value={form.terrainSurface} onChange={e => set("terrainSurface", e.target.value)} style={inputStyle} />
              </div>
            </div>
            {(form.propertyType === "casa" || form.propertyType === "departamento") && (
              <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr 1fr" }}>
                <div>
                  <label style={labelStyle}>Dormitorios</label>
                  <input type="number" placeholder="3" min={0} max={20} value={form.bedrooms} onChange={e => set("bedrooms", e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Baños</label>
                  <input type="number" placeholder="2" min={0} max={20} value={form.bathrooms} onChange={e => set("bathrooms", e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Estacionamientos</label>
                  <input type="number" placeholder="1" min={0} max={10} value={form.parkingSpaces} onChange={e => set("parkingSpaces", e.target.value)} style={inputStyle} />
                </div>
              </div>
            )}
          </div>

          {/* SECCIÓN 5: Precio */}
          <div style={sectionStyle}>
            <h2 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 700, color: "#c5a85b", display: "flex", alignItems: "center", gap: 8 }}>
              <span>💰</span> Precio
            </h2>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Precio en UF *</label>
              <input
                type="number"
                placeholder="Ej: 2500"
                min={0.1}
                step={0.01}
                value={form.priceUF}
                onChange={e => set("priceUF", e.target.value)}
                style={inputStyle}
              />
              {form.priceUF && (
                <div style={{ fontSize: 12, color: "#8fa3bc", marginTop: 6 }}>
                  ≈ $ {(parseFloat(form.priceUF) * 38500).toLocaleString("es-CL", { maximumFractionDigits: 0 })} CLP
                </div>
              )}
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={form.priceNegotiable}
                onChange={e => set("priceNegotiable", e.target.checked)}
                style={{ width: 18, height: 18, accentColor: "#c5a85b" }}
              />
              <span style={{ fontSize: 14, color: "#8fa3bc" }}>Precio negociable</span>
            </label>
          </div>

          {/* SECCIÓN 6: Contacto */}
          <div style={sectionStyle}>
            <h2 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 700, color: "#c5a85b", display: "flex", alignItems: "center", gap: 8 }}>
              <span>📞</span> Datos de contacto
            </h2>
            <p style={{ color: "#8fa3bc", fontSize: 13, margin: "0 0 20px" }}>
              Los interesados se contactarán directamente contigo. Tu teléfono se mostrará en el aviso.
            </p>
            <div style={{ ...gridRow, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Nombre *</label>
                <input type="text" placeholder="Tu nombre o empresa" value={form.contactName} onChange={e => set("contactName", e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Teléfono / WhatsApp *</label>
                <input type="tel" placeholder="+56 9 1234 5678" value={form.contactPhone} onChange={e => set("contactPhone", e.target.value)} style={inputStyle} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Correo electrónico</label>
              <input type="email" placeholder="correo@ejemplo.com (opcional)" value={form.contactEmail} onChange={e => set("contactEmail", e.target.value)} style={inputStyle} />
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "14px 18px", marginBottom: 20, color: "#ef4444", fontSize: 14 }}>
              ⚠️ {error}
            </div>
          )}

          {/* SUBMIT */}
          <div style={{ display: "flex", gap: 16, justifyContent: "flex-end", flexWrap: "wrap" }}>
            <Link href="/propiedades" style={{
              background: "transparent", color: "#8fa3bc",
              border: "1px solid rgba(143,163,188,0.3)",
              padding: "14px 28px", borderRadius: 8, fontSize: 15,
              textDecoration: "none", display: "inline-block",
            }}>
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={submitting}
              style={{
                background: submitting ? "#6b7280" : "linear-gradient(135deg, #c5a85b, #a8893d)",
                color: "#050c17", border: "none",
                padding: "14px 36px", borderRadius: 8,
                fontWeight: 800, fontSize: 15, cursor: submitting ? "not-allowed" : "pointer",
              }}
            >
              {submitting ? "Publicando..." : "✓ Publicar propiedad gratis"}
            </button>
          </div>
        </form>

        {/* INFO EXTRA */}
        <div style={{ marginTop: 40, background: "rgba(197,168,91,0.06)", border: "1px solid rgba(197,168,91,0.15)", borderRadius: 10, padding: "20px 24px" }}>
          <h3 style={{ color: "#c5a85b", margin: "0 0 10px", fontSize: 14, fontWeight: 700 }}>¿Necesitas una tasación antes de publicar?</h3>
          <p style={{ color: "#8fa3bc", fontSize: 13, margin: "0 0 14px", lineHeight: 1.5 }}>
            Obtén el valor estimado de tu propiedad en segundos con nuestra herramienta de tasación referencial.
          </p>
          <Link href="/tasacion" style={{ color: "#c5a85b", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
            → Tasar mi propiedad gratis
          </Link>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background: "#050c17", borderTop: "1px solid rgba(197,168,91,0.15)", padding: "24px", textAlign: "center", color: "#8fa3bc", fontSize: 13 }}>
        <p style={{ margin: 0 }}>CVR Consultoría Predial · contacto@cvrpropiedades.com · +56 9 3868 9157</p>
      </footer>

      {/* WHATSAPP */}
      <a href={`https://wa.me/${PHONE}`} target="_blank" rel="noopener noreferrer"
        style={{ position: "fixed", bottom: 24, right: 24, background: "#25d366", borderRadius: "50%", width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, boxShadow: "0 4px 20px rgba(37,211,102,0.4)", textDecoration: "none", zIndex: 200 }}>
        💬
      </a>
    </div>
  );
}
