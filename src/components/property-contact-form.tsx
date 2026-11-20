"use client";

import Link from "next/link";
import { useId, useState } from "react";

type Estado = "idle" | "enviando" | "ok" | "error";

export default function PropertyContactForm({ listingId }: { listingId: string }) {
  const uid = useId();
  const [estado, setEstado] = useState<Estado>("idle");
  const [error, setError] = useState("");
  const [consent, setConsent] = useState(false);

  const ids = {
    nombre: `${uid}-nombre`,
    email: `${uid}-email`,
    telefono: `${uid}-telefono`,
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
      const res = await fetch("/api/consultas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId,
          nombre: datos.get("nombre"),
          email: datos.get("email"),
          telefono: datos.get("telefono"),
          mensaje: datos.get("mensaje"),
          consentimiento: consent,
          empresa: datos.get("empresa"),
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "No pudimos enviar la consulta. Intenta nuevamente.");
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
        <h2 className="h3">Consulta enviada</h2>
        <p className="muted">
          Te contactamos para coordinar la visita. La dirección exacta se entrega en esa
          conversación, no en la ficha pública.
        </p>
      </div>
    );
  }

  return (
    <form className="card form-card" onSubmit={onSubmit} noValidate>
      <h2 className="h3">Consultar por esta propiedad</h2>
      <p className="muted small">
        Coordinamos la visita y respondemos las dudas documentales antes de cualquier
        oferta. <span aria-hidden="true">*</span> campos obligatorios.
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
      </div>
      <div className="field">
        <label htmlFor={ids.telefono}>Teléfono (opcional)</label>
        <input id={ids.telefono} name="telefono" type="tel" autoComplete="tel" maxLength={40} />
      </div>
      <div className="field">
        <label htmlFor={ids.mensaje}>Mensaje *</label>
        <textarea id={ids.mensaje} name="mensaje" rows={4} required maxLength={1500} />
      </div>

      <div className="hp" aria-hidden="true">
        <label htmlFor={ids.empresa}>Empresa</label>
        <input id={ids.empresa} name="empresa" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="check-row">
        <input
          id={ids.consent}
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          required
          aria-describedby={`${ids.consent}-ayuda`}
        />
        <label htmlFor={ids.consent}>
          Autorizo a CVR Propiedades SpA a usar estos datos para responder esta consulta.
          <span id={`${ids.consent}-ayuda`} className="hint">
            Ver <Link href="/privacidad">política de privacidad</Link>.
          </span>
        </label>
      </div>

      {estado === "error" && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="btn-gold" disabled={estado === "enviando" || !consent}>
        {estado === "enviando" ? "Enviando…" : "Enviar consulta"}
      </button>
    </form>
  );
}
