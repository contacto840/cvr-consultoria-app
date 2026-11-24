"use client";

import Link from "next/link";
import { useState } from "react";
import { ÑUBLE_COMMUNES, SECTORS_BY_COMMUNE } from "@/lib/seed-data";

type Campo = "title" | "surface" | "priceUF" | "contactName" | "contactPhone" | "contactEmail";

const ID_CAMPO: Record<Campo, string> = {
  title: "p-titulo",
  surface: "p-sup",
  priceUF: "p-precio",
  contactName: "p-nombre",
  contactPhone: "p-telefono",
  contactEmail: "p-email",
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AgregarPropiedadPage() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState("");

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

  const [errores, setErrores] = useState<Partial<Record<Campo, string>>>({});

  const sectors = SECTORS_BY_COMMUNE[form.comuna] ?? [];

  const set = (field: string, value: string | boolean) => {
    setForm((f) => ({ ...f, [field]: value, ...(field === "comuna" ? { sector: "" } : {}) }));
    setErrores((prev) => {
      if (!(field in prev)) return prev;
      const siguiente = { ...prev };
      delete siguiente[field as Campo];
      return siguiente;
    });
  };

  /** Mismas reglas que POST /api/propiedades, para marcar el campo que falla. */
  function validar(): Partial<Record<Campo, string>> {
    const e: Partial<Record<Campo, string>> = {};

    if (!form.title.trim()) e.title = "Escribe un título para el aviso.";

    const superficie = Number(form.surface);
    if (
      !form.surface.trim() ||
      !Number.isFinite(superficie) ||
      superficie <= 0 ||
      superficie > 1_000_000
    ) {
      e.surface = "Indica una superficie construida mayor que 0 y hasta 1.000.000 m².";
    }

    const precio = Number(form.priceUF);
    if (!form.priceUF.trim() || !Number.isFinite(precio) || precio <= 0 || precio > 1_000_000) {
      e.priceUF = "Indica un precio en UF mayor que 0 y hasta 1.000.000.";
    }

    if (!form.contactName.trim()) e.contactName = "Indica tu nombre.";

    if (!form.contactPhone.trim()) e.contactPhone = "Indica un teléfono de contacto.";

    if (form.contactEmail.trim() && !EMAIL.test(form.contactEmail)) {
      e.contactEmail = "El correo no tiene un formato válido.";
    }

    return e;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const encontrados = validar();
    setErrores(encontrados);
    setConsentError(consent ? "" : "Debes autorizar el tratamiento de tus datos para publicar.");

    const primero = (Object.keys(encontrados) as Campo[])[0];
    if (primero) {
      document.getElementById(ID_CAMPO[primero])?.focus();
      return;
    }
    if (!consent) {
      document.getElementById("p-consent")?.focus();
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
      <section className="section-tight">
        <div className="container narrow">
          <div className="card form-card">
            <h1 className="page-title">Propiedad recibida</h1>
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
        </div>
      </section>
    );
  }

  return (
    <>
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
            <fieldset className="form-section">
              <legend className="form-section-title">1. Operación</legend>
              <div className="field-grid">
                <div className="field">
                  <label htmlFor="p-tipo">Tipo de propiedad *</label>
                  <select
                    id="p-tipo"
                    value={form.propertyType}
                    onChange={(e) => set("propertyType", e.target.value)}
                  >
                    <option value="casa">Casa</option>
                    <option value="departamento">Departamento</option>
                    <option value="terreno">Terreno</option>
                    <option value="agricola">Agrícola / rural</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="p-operacion">Operación *</label>
                  <select
                    id="p-operacion"
                    value={form.transactionType}
                    onChange={(e) => set("transactionType", e.target.value)}
                  >
                    <option value="venta">Venta</option>
                    <option value="arriendo">Arriendo</option>
                  </select>
                </div>
              </div>
            </fieldset>

            <fieldset className="form-section">
              <legend className="form-section-title">2. Ubicación</legend>
              <div className="field-grid">
                <div className="field">
                  <label htmlFor="p-comuna">Comuna *</label>
                  <select
                    id="p-comuna"
                    value={form.comuna}
                    onChange={(e) => set("comuna", e.target.value)}
                  >
                    {ÑUBLE_COMMUNES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="p-sector">Sector o barrio</label>
                  {sectors.length > 0 ? (
                    <select
                      id="p-sector"
                      value={form.sector}
                      onChange={(e) => set("sector", e.target.value)}
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
                    />
                  )}
                </div>
              </div>
              <div className="field">
                <label htmlFor="p-direccion">Dirección (uso interno, no se publica)</label>
                <input
                  id="p-direccion"
                  type="text"
                  placeholder="Calle y número"
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                  aria-describedby="p-direccion-ayuda"
                />
                <span className="hint" id="p-direccion-ayuda">
                  La usamos para coordinar la visita. La ficha pública no muestra calle ni número.
                </span>
              </div>
            </fieldset>

            <fieldset className="form-section">
              <legend className="form-section-title">3. Descripción</legend>
              <div className="field">
                <label htmlFor="p-titulo">Título del aviso *</label>
                <input
                  id="p-titulo"
                  type="text"
                  placeholder="Ej: Casa 3 dormitorios en sector Las Mariposas"
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  maxLength={120}
                  required
                  aria-invalid={errores.title ? true : undefined}
                  aria-describedby={errores.title ? "p-titulo-error" : undefined}
                />
                {errores.title && (
                  <p className="field-error" id="p-titulo-error" role="alert">
                    {errores.title}
                  </p>
                )}
              </div>
              <div className="field">
                <label htmlFor="p-desc">Descripción</label>
                <textarea
                  id="p-desc"
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  rows={5}
                  maxLength={4000}
                />
              </div>
            </fieldset>

            <fieldset className="form-section">
              <legend className="form-section-title">4. Características</legend>
              <div className="field-grid three">
                <div className="field">
                  <label htmlFor="p-sup">Superficie construida (m²) *</label>
                  <input
                    id="p-sup"
                    type="number"
                    min={1}
                    value={form.surface}
                    onChange={(e) => set("surface", e.target.value)}
                    required
                    aria-invalid={errores.surface ? true : undefined}
                    aria-describedby={errores.surface ? "p-sup-error" : undefined}
                  />
                  {errores.surface && (
                    <p className="field-error" id="p-sup-error" role="alert">
                      {errores.surface}
                    </p>
                  )}
                </div>
                <div className="field">
                  <label htmlFor="p-terreno">Superficie de terreno (m²)</label>
                  <input
                    id="p-terreno"
                    type="number"
                    min={1}
                    value={form.terrainSurface}
                    onChange={(e) => set("terrainSurface", e.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="p-precio">Precio en UF *</label>
                  <input
                    id="p-precio"
                    type="number"
                    min={0.1}
                    step={0.01}
                    value={form.priceUF}
                    onChange={(e) => set("priceUF", e.target.value)}
                    required
                    aria-invalid={errores.priceUF ? true : undefined}
                    aria-describedby={errores.priceUF ? "p-precio-error" : undefined}
                  />
                  {errores.priceUF && (
                    <p className="field-error" id="p-precio-error" role="alert">
                      {errores.priceUF}
                    </p>
                  )}
                </div>
              </div>

              {(form.propertyType === "casa" || form.propertyType === "departamento") && (
                <div className="field-grid three">
                  <div className="field">
                    <label htmlFor="p-dorm">Dormitorios</label>
                    <input
                      id="p-dorm"
                      type="number"
                      min={0}
                      max={20}
                      value={form.bedrooms}
                      onChange={(e) => set("bedrooms", e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="p-banos">Baños</label>
                    <input
                      id="p-banos"
                      type="number"
                      min={0}
                      max={20}
                      value={form.bathrooms}
                      onChange={(e) => set("bathrooms", e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="p-estac">Estacionamientos</label>
                    <input
                      id="p-estac"
                      type="number"
                      min={0}
                      max={10}
                      value={form.parkingSpaces}
                      onChange={(e) => set("parkingSpaces", e.target.value)}
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
            </fieldset>

            <fieldset className="form-section">
              <legend className="form-section-title">5. Tus datos</legend>
              <p className="muted small">
                Los usamos para contactarte por esta publicación. No se publican en la ficha.
              </p>
              <div className="field-grid three">
                <div className="field">
                  <label htmlFor="p-nombre">Nombre *</label>
                  <input
                    id="p-nombre"
                    type="text"
                    value={form.contactName}
                    onChange={(e) => set("contactName", e.target.value)}
                    maxLength={120}
                    required
                    aria-invalid={errores.contactName ? true : undefined}
                    aria-describedby={errores.contactName ? "p-nombre-error" : undefined}
                  />
                  {errores.contactName && (
                    <p className="field-error" id="p-nombre-error" role="alert">
                      {errores.contactName}
                    </p>
                  )}
                </div>
                <div className="field">
                  <label htmlFor="p-telefono">Teléfono *</label>
                  <input
                    id="p-telefono"
                    type="tel"
                    value={form.contactPhone}
                    onChange={(e) => set("contactPhone", e.target.value)}
                    maxLength={40}
                    required
                    aria-invalid={errores.contactPhone ? true : undefined}
                    aria-describedby={errores.contactPhone ? "p-telefono-error" : undefined}
                  />
                  {errores.contactPhone && (
                    <p className="field-error" id="p-telefono-error" role="alert">
                      {errores.contactPhone}
                    </p>
                  )}
                </div>
                <div className="field">
                  <label htmlFor="p-email">Correo</label>
                  <input
                    id="p-email"
                    type="email"
                    value={form.contactEmail}
                    onChange={(e) => set("contactEmail", e.target.value)}
                    maxLength={160}
                    aria-invalid={errores.contactEmail ? true : undefined}
                    aria-describedby={errores.contactEmail ? "p-email-error" : undefined}
                  />
                  {errores.contactEmail && (
                    <p className="field-error" id="p-email-error" role="alert">
                      {errores.contactEmail}
                    </p>
                  )}
                </div>
              </div>

              <div className="check-row">
                <input
                  id="p-consent"
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => {
                    setConsent(e.target.checked);
                    if (e.target.checked) setConsentError("");
                  }}
                  required
                  aria-invalid={consentError ? true : undefined}
                  aria-describedby={`p-consent-ayuda${consentError ? " p-consent-error" : ""}`}
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
              {consentError && (
                <p className="field-error" id="p-consent-error" role="alert">
                  {consentError}
                </p>
              )}
            </fieldset>

            {error && (
              <p className="form-error" role="alert" aria-live="assertive">
                {error}
              </p>
            )}

            <div className="inline-actions">
              <button type="submit" className="btn-gold" disabled={submitting}>
                {submitting ? "Enviando…" : "Enviar publicación"}
              </button>
              <Link href="/propiedades" className="btn-outline">
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
