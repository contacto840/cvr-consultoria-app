"use client";

import Link from "next/link";
import { useState } from "react";
import { ÑUBLE_COMMUNES, SECTORS_BY_COMMUNE } from "@/lib/seed-data";

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
  color: "var(--text-sub)",
  fontWeight: 600,
  marginBottom: 6,
  textTransform: "uppercase",
  letterSpacing: 0.8,
};

export default function AgregarPropiedadPage() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [consent, setConsent] = useState(false);

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

  const sectors = SECTORS_BY_COMMUNE[form.comuna] ?? [];
  const set = (field: string, value: string | boolean) =>
    setForm((f) => ({ ...f, [field]: value, ...(field === "comuna" ? { sector: "" } : {}) }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!consent) {
      setError("Debes autorizar el tratamiento de tus datos para publicar.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/propiedades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, consentimiento: consent }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) {
        setSuccess(true);
      } else {
        setError(data.error ?? "No pudimos recibir la publicación.");
      }
    } catch {
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <main id="contenido" className="container section-tight">
        <div className="card form-card">
          <h1 className="h3">Propiedad recibida</h1>
          <p>
            La publicación queda en revisión antes de aparecer en el portal. Revisamos que
            los datos sean coherentes y que la propiedad esté efectivamente disponible.
          </p>
          <p className="muted small">
            La dirección exacta y tu teléfono no se publican: el contacto llega por el
            formulario de la ficha y lo gestiona el equipo.
          </p>
          <div className="inline-actions">
            <Link href="/propiedades" className="btn-gold">
              Ver propiedades
            </Link>
            <button
              type="button"
              className="btn-outline"
              onClick={() => {
                setSuccess(false);
                setConsent(false);
              }}
            >
              Publicar otra
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main id="contenido">
      <section className="page-hero">
        <div className="container narrow">
          <p className="eyebrow">Portal de propiedades</p>
          <h1 className="page-title">Publicar una propiedad</h1>
          <p className="page-lead">
            Publicar es gratuito y queda sujeto a revisión. No mostramos la dirección exacta
            ni tu teléfono: el interesado escribe por el formulario y el equipo coordina la
            visita.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container narrow">
          <form className="card form-card" onSubmit={onSubmit} noValidate>
            <h2 className="h3">1. Operación</h2>
            <div className="field-grid">
              <div className="field">
                <label style={labelStyle} htmlFor="p-tipo">
                  Tipo de propiedad *
                </label>
                <select
                  id="p-tipo"
                  value={form.propertyType}
                  onChange={(e) => set("propertyType", e.target.value)}
                  style={inputStyle}
                >
                  <option value="casa">Casa</option>
                  <option value="departamento">Departamento</option>
                  <option value="terreno">Terreno</option>
                  <option value="agricola">Agrícola / rural</option>
                </select>
              </div>
              <div className="field">
                <label style={labelStyle} htmlFor="p-operacion">
                  Operación *
                </label>
                <select
                  id="p-operacion"
                  value={form.transactionType}
                  onChange={(e) => set("transactionType", e.target.value)}
                  style={inputStyle}
                >
                  <option value="venta">Venta</option>
                  <option value="arriendo">Arriendo</option>
                </select>
              </div>
            </div>

            <h2 className="h3">2. Ubicación</h2>
            <div className="field-grid">
              <div className="field">
                <label style={labelStyle} htmlFor="p-comuna">
                  Comuna *
                </label>
                <select
                  id="p-comuna"
                  value={form.comuna}
                  onChange={(e) => set("comuna", e.target.value)}
                  style={inputStyle}
                >
                  {ÑUBLE_COMMUNES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label style={labelStyle} htmlFor="p-sector">
                  Sector o barrio
                </label>
                {sectors.length > 0 ? (
                  <select
                    id="p-sector"
                    value={form.sector}
                    onChange={(e) => set("sector", e.target.value)}
                    style={inputStyle}
                  >
                    <option value="">— Seleccionar —</option>
                    {sectors.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id="p-sector"
                    type="text"
                    value={form.sector}
                    onChange={(e) => set("sector", e.target.value)}
                    style={inputStyle}
                  />
                )}
              </div>
            </div>
            <div className="field">
              <label style={labelStyle} htmlFor="p-direccion">
                Dirección (uso interno, no se publica)
              </label>
              <input
                id="p-direccion"
                type="text"
                placeholder="Calle y número"
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
                style={inputStyle}
              />
            </div>

            <h2 className="h3">3. Descripción</h2>
            <div className="field">
              <label style={labelStyle} htmlFor="p-titulo">
                Título del aviso *
              </label>
              <input
                id="p-titulo"
                type="text"
                placeholder="Ej: Casa 3 dormitorios en sector Las Mariposas"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                maxLength={120}
                style={inputStyle}
                required
              />
            </div>
            <div className="field">
              <label style={labelStyle} htmlFor="p-desc">
                Descripción
              </label>
              <textarea
                id="p-desc"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={5}
                maxLength={4000}
                style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }}
              />
            </div>

            <h2 className="h3">4. Características</h2>
            <div className="field-grid three">
              <div className="field">
                <label style={labelStyle} htmlFor="p-sup">
                  Superficie construida (m²) *
                </label>
                <input
                  id="p-sup"
                  type="number"
                  min={1}
                  value={form.surface}
                  onChange={(e) => set("surface", e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
              <div className="field">
                <label style={labelStyle} htmlFor="p-terreno">
                  Superficie de terreno (m²)
                </label>
                <input
                  id="p-terreno"
                  type="number"
                  min={1}
                  value={form.terrainSurface}
                  onChange={(e) => set("terrainSurface", e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div className="field">
                <label style={labelStyle} htmlFor="p-precio">
                  Precio en UF *
                </label>
                <input
                  id="p-precio"
                  type="number"
                  min={0.1}
                  step={0.01}
                  value={form.priceUF}
                  onChange={(e) => set("priceUF", e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
            </div>

            {(form.propertyType === "casa" || form.propertyType === "departamento") && (
              <div className="field-grid three">
                <div className="field">
                  <label style={labelStyle} htmlFor="p-dorm">
                    Dormitorios
                  </label>
                  <input
                    id="p-dorm"
                    type="number"
                    min={0}
                    max={20}
                    value={form.bedrooms}
                    onChange={(e) => set("bedrooms", e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div className="field">
                  <label style={labelStyle} htmlFor="p-banos">
                    Baños
                  </label>
                  <input
                    id="p-banos"
                    type="number"
                    min={0}
                    max={20}
                    value={form.bathrooms}
                    onChange={(e) => set("bathrooms", e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div className="field">
                  <label style={labelStyle} htmlFor="p-estac">
                    Estacionamientos
                  </label>
                  <input
                    id="p-estac"
                    type="number"
                    min={0}
                    max={10}
                    value={form.parkingSpaces}
                    onChange={(e) => set("parkingSpaces", e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>
            )}

            <div className="check-row">
              <input
                id="p-negociable"
                type="checkbox"
                checked={form.priceNegotiable}
                onChange={(e) => set("priceNegotiable", e.target.checked)}
              />
              <label htmlFor="p-negociable">Precio negociable</label>
            </div>

            <h2 className="h3">5. Tus datos</h2>
            <p className="muted small">
              Los usamos para contactarte por esta publicación. No se publican en la ficha.
            </p>
            <div className="field-grid three">
              <div className="field">
                <label style={labelStyle} htmlFor="p-nombre">
                  Nombre *
                </label>
                <input
                  id="p-nombre"
                  type="text"
                  value={form.contactName}
                  onChange={(e) => set("contactName", e.target.value)}
                  style={inputStyle}
                  maxLength={120}
                  required
                />
              </div>
              <div className="field">
                <label style={labelStyle} htmlFor="p-telefono">
                  Teléfono *
                </label>
                <input
                  id="p-telefono"
                  type="tel"
                  value={form.contactPhone}
                  onChange={(e) => set("contactPhone", e.target.value)}
                  style={inputStyle}
                  maxLength={40}
                  required
                />
              </div>
              <div className="field">
                <label style={labelStyle} htmlFor="p-email">
                  Correo
                </label>
                <input
                  id="p-email"
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) => set("contactEmail", e.target.value)}
                  style={inputStyle}
                  maxLength={160}
                />
              </div>
            </div>

            <div className="check-row">
              <input
                id="p-consent"
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                required
                aria-describedby="p-consent-ayuda"
              />
              <label htmlFor="p-consent">
                Declaro que soy el propietario, mandatario o corredor autorizado y autorizo
                el tratamiento de estos datos para gestionar la publicación.
                <span id="p-consent-ayuda" className="hint">
                  Ver <Link href="/privacidad">política de privacidad</Link> y{" "}
                  <Link href="/terminos">términos de uso</Link>.
                </span>
              </label>
            </div>

            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}

            <div className="inline-actions">
              <button type="submit" className="btn-gold" disabled={submitting || !consent}>
                {submitting ? "Enviando…" : "Enviar publicación"}
              </button>
              <Link href="/propiedades" className="btn-outline">
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
