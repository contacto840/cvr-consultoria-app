"use client";

import Link from "next/link";
import { useId, useState } from "react";

type Estado = "idle" | "enviando" | "ok" | "error";

const MOTIVOS = [
  "Quiero vender una propiedad",
  "Quiero arrendar o administrar una propiedad",
  "Busco comprar con asesoría",
  "Soy corredor y quiero asociarme",
  "Consulta general",
];

export default function ContactForm({ compact = false }: { compact?: boolean }) {
  const uid = useId();
  const [estado, setEstado] = useState<Estado>("idle");
  const [error, setError] = useState("");
  const [consent, setConsent] = useState(false);

  const ids = {
    nombre: `${uid}-nombre`,
    email: `${uid}-email`,
    telefono: `${uid}-telefono`,
    motivo: `${uid}-motivo`,
    mensaje: `${uid}-mensaje`,
    consent: `${uid}-consent`,
    empresa: `${uid}-empresa`,
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const datos = new FormData(form);
    setEstado("enviando");
    setError("");

    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: datos.get("nombre"),
          email: datos.get("email"),
          telefono: datos.get("telefono"),
          motivo: datos.get("motivo"),
          mensaje: datos.get("mensaje"),
          consentimiento: consent,
          empresa: datos.get("empresa"),
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "No pudimos enviar el mensaje. Intenta nuevamente.");
        setEstado("error");
        return;
      }
      setEstado("ok");
      form.reset();
      setConsent(false);
    } catch {
      setError("Error de conexión. Revisa tu red e intenta otra vez.");
      setEstado("error");
    }
  }

  if (estado === "ok") {
    return (
      <div className="card form-card" role="status" aria-live="polite">
        <h3>Mensaje enviado</h3>
        <p className="muted">
          Gracias. Respondemos dentro del horario de atención. Si el asunto es urgente,
          escríbenos por WhatsApp.
        </p>
      </div>
    );
  }

  return (
    <form className={`card form-card${compact ? " form-compact" : ""}`} onSubmit={onSubmit} noValidate>
      <h3>Escríbenos</h3>
      <p className="muted small">
        Los campos marcados con <span aria-hidden="true">*</span>
        <span className="sr-only">asterisco</span> son obligatorios.
      </p>

      <div className="field-grid">
        <div className="field">
          <label htmlFor={ids.nombre}>Nombre *</label>
          <input id={ids.nombre} name="nombre" type="text" required autoComplete="name" maxLength={120} />
        </div>
        <div className="field">
          <label htmlFor={ids.email}>Correo electrónico *</label>
          <input id={ids.email} name="email" type="email" required autoComplete="email" maxLength={160} />
        </div>
        <div className="field">
          <label htmlFor={ids.telefono}>Teléfono (opcional)</label>
          <input id={ids.telefono} name="telefono" type="tel" autoComplete="tel" maxLength={40} />
        </div>
        <div className="field">
          <label htmlFor={ids.motivo}>Motivo *</label>
          <select id={ids.motivo} name="motivo" required defaultValue={MOTIVOS[4]}>
            {MOTIVOS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor={ids.mensaje}>Mensaje *</label>
        <textarea id={ids.mensaje} name="mensaje" required rows={compact ? 3 : 5} maxLength={2000} />
      </div>

      {/* Honeypot: invisible para personas, tentador para bots. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor={ids.empresa}>Empresa</label>
        <input id={ids.empresa} name="empresa" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="check-row">
        <input
          id={ids.consent}
          name="consentimiento"
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          required
          aria-describedby={`${ids.consent}-ayuda`}
        />
        <label htmlFor={ids.consent}>
          Autorizo a {`CVR Propiedades SpA`} a usar estos datos para responder mi consulta.
          <span id={`${ids.consent}-ayuda`} className="hint">
            Puedes leer el detalle en la{" "}
            <Link href="/privacidad">política de privacidad</Link>. No usamos estos datos
            para publicidad ni los cedemos a terceros ajenos al servicio.
          </span>
        </label>
      </div>

      {estado === "error" && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="btn-gold" disabled={estado === "enviando" || !consent}>
        {estado === "enviando" ? "Enviando…" : "Enviar mensaje"}
      </button>
    </form>
  );
}
