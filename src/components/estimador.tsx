"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SECTORS_BY_COMMUNE } from "@/lib/seed-data";
import { ENCARGO } from "@/lib/encargo";
import { SITE } from "@/lib/site";

const TIPOS = [
  { value: "casa", label: "Casa" },
  { value: "departamento", label: "Departamento" },
  { value: "terreno", label: "Terreno urbano" },
  { value: "agricola", label: "Predio agrícola / rural" },
];

const CONDICIONES = [
  { value: "excelente", label: "Excelente", help: "Nuevo o remodelado hace poco" },
  { value: "bueno", label: "Bueno", help: "Bien mantenido, pocos desperfectos" },
  { value: "normal", label: "Normal", help: "Estado promedio de mercado" },
  { value: "regular", label: "Regular", help: "Requiere reparaciones menores" },
  { value: "malo", label: "Malo", help: "Requiere reparaciones importantes" },
];

interface Resultado {
  estimatedValueUF: number;
  estimatedValueCLP: number;
  minValueUF: number;
  maxValueUF: number;
  pricePerM2UF: number;
  comuna: string;
  sector: string;
  propertyType: string;
  surface: number;
  ufValueCLP: number;
  referenceYear: number;
  usedSector: string;
  sampleSize?: number;
  conditionFactor?: number;
  ageFactor?: number;
}

const fmt = (n: number, d = 0) =>
  n.toLocaleString("es-CL", { minimumFractionDigits: d, maximumFractionDigits: d });

export default function Estimador() {
  const sp = useSearchParams();
  const qTipo = sp.get("tipo");
  const qComuna = sp.get("comuna");
  const qSup = sp.get("superficie");
  const prellenado = Boolean(qTipo && qComuna && qSup);

  const paymentStatus = sp.get("status");
  const paymentId = sp.get("payment_id");
  const paidId = sp.get("id");
  const simulated = sp.get("simulated") === "true";
  const debeVerificar = paymentStatus === "approved" && Boolean(paidId);

  const [comunas, setComunas] = useState<string[]>([]);
  const [form, setForm] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    comuna: qComuna ?? "",
    sector: "",
    propertyType: qTipo ?? "casa",
    surface: qSup ?? "",
    condition: "normal",
    age: "10",
  });
  const [consent, setConsent] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [error, setError] = useState(
    paymentStatus === "failed" ? "El pago fue rechazado. Puedes intentarlo de nuevo." : ""
  );
  const [tasacionId, setTasacionId] = useState("");
  const [pagando, setPagando] = useState(false);
  const [verificacion, setVerificacion] = useState<"verificada" | "error" | null>(null);

  const verificando = debeVerificar && verificacion === null;
  const pagoOk = verificacion === "verificada";
  const sectores = SECTORS_BY_COMMUNE[form.comuna] ?? [];

  useEffect(() => {
    fetch("/api/tasacion")
      .then((r) => r.json())
      .then((d: { ok?: boolean; data?: string[] }) => {
        if (d.ok && d.data) setComunas([...new Set(d.data)].sort());
      })
      .catch(() => setComunas([]));
  }, []);

  useEffect(() => {
    if (!debeVerificar || !paidId) return;
    let cancelado = false;
    fetch("/api/pagos/confirmar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tasacionId: paidId, payment_id: paymentId, simulated }),
    })
      .then((res) => res.json())
      .then((data: { ok?: boolean; error?: string }) => {
        if (cancelado) return;
        if (data.ok) {
          setVerificacion("verificada");
          setTasacionId(paidId);
        } else {
          setVerificacion("error");
          setError(data.error ?? "No pudimos verificar el pago.");
        }
      })
      .catch(() => {
        if (cancelado) return;
        setVerificacion("error");
        setError("Error de conexión al verificar el pago.");
      });
    return () => {
      cancelado = true;
    };
  }, [debeVerificar, paidId, paymentId, simulated]);

  function cambiar(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "comuna" ? { sector: "" } : {}),
    }));
    setError("");
  }

  async function calcular(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!consent) {
      setError("Para calcular necesitamos que autorices el uso de tus datos.");
      return;
    }
    setCargando(true);
    setError("");
    setResultado(null);
    try {
      const res = await fetch("/api/tasacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, consentimiento: consent }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; result?: Resultado; tasacionId?: string };
      if (!res.ok || !data.ok || !data.result) {
        throw new Error(data.error ?? "No pudimos calcular la estimación.");
      }
      setResultado(data.result);
      setTasacionId(data.tasacionId ?? "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos calcular la estimación.");
    } finally {
      setCargando(false);
    }
  }

  async function pagar() {
    setPagando(true);
    setError("");
    try {
      const res = await fetch("/api/pagos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasacionId }),
      });
      const data = (await res.json()) as { ok?: boolean; init_point?: string; error?: string };
      if (data.ok && data.init_point) {
        window.location.href = data.init_point;
        return;
      }
      throw new Error(data.error ?? "No se pudo iniciar el pago.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar el pago.");
      setPagando(false);
    }
  }

  if (verificando) {
    return (
      <div className="card" role="status" aria-live="polite">
        <h2 className="h3">Verificando el pago…</h2>
        <p className="muted">No cierres esta página. Esto toma unos segundos.</p>
      </div>
    );
  }

  if (pagoOk) {
    return (
      <div className="card encargo-ok">
        <h2 className="h3">Encargo registrado</h2>
        <p>
          El pago quedó confirmado y tu encargo entró a la lista de trabajo del perito. La
          tasación se elabora con revisión del inmueble y se entrega firmada.
        </p>
        <p className="pending">{ENCARGO.plazoTexto}</p>
        <div className="id-box">
          <span className="muted small">Número de solicitud</span>
          <code>{tasacionId}</code>
        </div>
        <p className="muted small">
          Enviamos a tu correo la estimación referencial automática. Ese documento no es el
          producto que compraste ni lleva firma: sirve como referencia mientras se prepara
          el informe. Si pagaste y no recibes respuesta, escríbenos a{" "}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>
        <div className="inline-actions">
          <Link href="/" className="btn-outline">
            Volver al inicio
          </Link>
          <a href={SITE.tasacionesUrl} className="btn-gold" rel="noopener">
            Ir a tasaciones y peritajes ↗
          </a>
        </div>
      </div>
    );
  }

  if (resultado) {
    const tipo = TIPOS.find((t) => t.value === resultado.propertyType)?.label ?? resultado.propertyType;
    return (
      <div className="estimador-resultado">
        <div className="card">
          <p className="eyebrow">Estimación referencial</p>
          <h2 className="value-big">{fmt(resultado.estimatedValueUF, 1)} UF</h2>
          <p className="muted">
            ${fmt(resultado.estimatedValueCLP)} CLP a la UF de referencia de $
            {fmt(resultado.ufValueCLP)}.
          </p>
          <p className="hint">
            El valor en pesos usa una UF fija de referencia, no el valor oficial del día.{" "}
            {"{{PENDIENTE: automatizar el valor de la UF con la fuente oficial}}"}
          </p>
          <dl className="listing-facts listing-facts-wide">
            <div>
              <dt>Rango</dt>
              <dd>
                {fmt(resultado.minValueUF, 1)} – {fmt(resultado.maxValueUF, 1)} UF
              </dd>
            </div>
            <div>
              <dt>Tipo</dt>
              <dd>{tipo}</dd>
            </div>
            <div>
              <dt>Ubicación usada</dt>
              <dd>
                {resultado.usedSector
                  ? `${resultado.usedSector}, ${resultado.comuna}`
                  : resultado.comuna}
              </dd>
            </div>
            <div>
              <dt>Superficie</dt>
              <dd>{fmt(resultado.surface, 1)} m²</dd>
            </div>
            <div>
              <dt>Precio de referencia</dt>
              <dd>{fmt(resultado.pricePerM2UF, 2)} UF/m²</dd>
            </div>
            <div>
              <dt>Muestra</dt>
              <dd>
                {resultado.sampleSize
                  ? `${resultado.sampleSize} registros`
                  : "Sin dato de muestra"}
              </dd>
            </div>
            <div>
              <dt>Año de los valores</dt>
              <dd>{resultado.referenceYear}</dd>
            </div>
          </dl>

          <h3 className="h3">Cómo se calculó</h3>
          <p className="small muted">
            Valor = superficie ({fmt(resultado.surface, 1)} m²) × precio de referencia por
            m² ({fmt(resultado.pricePerM2UF, 2)} UF/m²) × factor de estado
            {resultado.conditionFactor ? ` (${resultado.conditionFactor.toFixed(2)})` : ""}
            {resultado.ageFactor ? ` × factor de antigüedad (${resultado.ageFactor.toFixed(2)})` : ""}.
            Los valores de referencia son promedios de mercado por comuna, sector y tipo de
            propiedad, con la muestra y el año indicados arriba.
          </p>

          <p className="disclaimer">
            <strong>Esto no es una tasación.</strong> Es una orientación referencial
            calculada automáticamente, sin inspección del inmueble ni homologación de
            comparables. No sirve para trámites bancarios, judiciales, hereditarios ni de
            compraventa. Para eso se necesita un informe de tasación con inspección y firma.
          </p>
        </div>

        <div className="grid two-col">
          <div className="card service-card featured">
            <span className="tag">Trabajo humano</span>
            <h2 className="h3">{ENCARGO.nombre}</h2>
            <p>
              El perito revisa los antecedentes, inspecciona el inmueble y emite un informe
              firmado. No es una descarga automática: es un encargo que se trabaja y se
              entrega con responsabilidad profesional.
            </p>
            <p className="muted small">{ENCARGO.plazoTexto}</p>
            <p className="price">${fmt(ENCARGO.precioCLP)} CLP</p>
            <button type="button" className="btn-gold" onClick={pagar} disabled={pagando}>
              {pagando ? "Redirigiendo a MercadoPago…" : "Encargar la tasación"}
            </button>
            <p className="hint">
              Al pagar se abre MercadoPago. El encargo queda registrado con el número de
              solicitud que aparece en esta página.
            </p>
          </div>

          <div className="card service-card">
            <span className="tag">Antes de comprar</span>
            <h2 className="h3">Estudio de títulos y due diligence</h2>
            <p>
              Si el problema no es el precio sino lo que hay detrás del título, lo que
              corresponde es una revisión documental, no una tasación.
            </p>
            <a
              href={SITE.tasaciones.estudioTitulos}
              className="btn-outline"
              rel="noopener"
            >
              Pedir estudio de títulos ↗
            </a>
          </div>
        </div>

        <p className="hint">
          Número de solicitud: <code>{tasacionId}</code>.{" "}
          <button
            type="button"
            className="link-button"
            onClick={() => {
              setResultado(null);
              setTasacionId("");
            }}
          >
            Hacer otra estimación
          </button>
        </p>

        <p>
          ¿Necesitas el documento para un banco, un tribunal o una herencia?{" "}
          <a href={SITE.tasaciones.tasacionComercial} rel="noopener">
            Pedir una tasación con firma ↗
          </a>
        </p>
      </div>
    );
  }

  return (
    <form className="card form-card" onSubmit={calcular} noValidate>
      {prellenado && (
        <p className="notice small">
          Datos precargados desde el inicio: {qComuna} · {qSup}{" "}
          {form.propertyType === "agricola" ? "ha" : "m²"}. Puedes corregirlos abajo.
        </p>
      )}

      <h2 className="h3">1. Tus datos de contacto</h2>
      <div className="field-grid three">
        <div className="field">
          <label htmlFor="t-nombre">Nombre *</label>
          <input
            id="t-nombre"
            name="clientName"
            value={form.clientName}
            onChange={cambiar}
            required
            maxLength={120}
            autoComplete="name"
          />
        </div>
        <div className="field">
          <label htmlFor="t-email">Correo electrónico *</label>
          <input
            id="t-email"
            name="clientEmail"
            type="email"
            value={form.clientEmail}
            onChange={cambiar}
            required
            maxLength={160}
            autoComplete="email"
          />
        </div>
        <div className="field">
          <label htmlFor="t-telefono">Teléfono *</label>
          <input
            id="t-telefono"
            name="clientPhone"
            type="tel"
            value={form.clientPhone}
            onChange={cambiar}
            required
            maxLength={40}
            autoComplete="tel"
          />
        </div>
      </div>

      <h2 className="h3">2. Datos del inmueble</h2>
      <div className="field-grid">
        <div className="field">
          <label htmlFor="t-comuna">Comuna *</label>
          <select id="t-comuna" name="comuna" value={form.comuna} onChange={cambiar} required>
            <option value="">— Seleccionar —</option>
            {comunas.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {sectores.length > 0 && (
          <div className="field">
            <label htmlFor="t-sector">Sector (mejora la precisión)</label>
            <select id="t-sector" name="sector" value={form.sector} onChange={cambiar}>
              <option value="">— Sin sector específico —</option>
              {sectores.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="field">
          <label htmlFor="t-tipo">Tipo de propiedad *</label>
          <select id="t-tipo" name="propertyType" value={form.propertyType} onChange={cambiar}>
            {TIPOS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="t-sup">
            Superficie {form.propertyType === "agricola" ? "(hectáreas) *" : "(m²) *"}
          </label>
          <input
            id="t-sup"
            name="surface"
            type="number"
            min={1}
            step="0.1"
            value={form.surface}
            onChange={cambiar}
            required
            inputMode="decimal"
          />
          {form.propertyType === "agricola" && (
            <p className="hint">Se convierte a m² para el cálculo.</p>
          )}
        </div>

        {(form.propertyType === "casa" || form.propertyType === "departamento") && (
          <div className="field">
            <label htmlFor="t-edad">Antigüedad aproximada (años)</label>
            <input
              id="t-edad"
              name="age"
              type="number"
              min={0}
              max={120}
              value={form.age}
              onChange={cambiar}
            />
          </div>
        )}
      </div>

      <fieldset className="fieldset">
        <legend>3. Estado de conservación</legend>
        <div className="radio-row">
          {CONDICIONES.map((c) => (
            <label
              key={c.value}
              className={`radio-card${form.condition === c.value ? " is-checked" : ""}`}
            >
              <input
                type="radio"
                name="condition"
                value={c.value}
                checked={form.condition === c.value}
                onChange={cambiar}
              />
              <span>
                <strong>{c.label}</strong>
                <span className="hint">{c.help}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="check-row">
        <input
          id="t-consent"
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          required
          aria-describedby="t-consent-ayuda"
        />
        <label htmlFor="t-consent">
          Autorizo el tratamiento de mis datos y de los del inmueble para calcular esta
          estimación y contactarme por ella.
          <span id="t-consent-ayuda" className="hint">
            La estimación no se envía a terceros. Detalle en la{" "}
            <Link href="/privacidad">política de privacidad</Link>.
          </span>
        </label>
      </div>

      {error && (
        <p className="form-error" role="alert" aria-live="assertive">
          {error}
        </p>
      )}

      <button type="submit" className="btn-gold" disabled={cargando || !consent}>
        {cargando ? "Calculando…" : "Calcular estimación"}
      </button>

      <p className="disclaimer">
        El resultado es una estimación referencial y automática. No constituye una tasación,
        no sirve para trámites bancarios, judiciales, hereditarios ni de compraventa, y no
        reemplaza un informe firmado.
      </p>
    </form>
  );
}
