"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SECTORS_BY_COMMUNE } from "@/lib/seed-data";
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
  estimatedValueCLP: number | null;
  minValueUF: number;
  maxValueUF: number;
  pricePerM2UF: number;
  comuna: string;
  sector: string;
  propertyType: string;
  surface: number;
  ufValueCLP: number | null;
  ufDate: string | null;
  referenceYear: number;
  usedSector: string;
  sampleSize?: number;
  conditionFactor?: number;
  ageFactor?: number;
}

const fmt = (n: number, d = 0) =>
  n.toLocaleString("es-CL", { minimumFractionDigits: d, maximumFractionDigits: d });

/** "2026-11-23" → "23 de noviembre de 2026". Se arma en horario local para no correr el día. */
const fechaLarga = (iso: string | null) => {
  if (!iso) return "";
  const [anio, mes, dia] = iso.split("-").map(Number);
  if (!anio || !mes || !dia) return "";
  return new Date(anio, mes - 1, dia).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function Estimador() {
  const sp = useSearchParams();
  const qTipo = sp.get("tipo");
  const qComuna = sp.get("comuna");
  const qSup = sp.get("superficie");
  const prellenado = Boolean(qTipo && qComuna && qSup);

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
  const [error, setError] = useState("");
  const [tasacionId, setTasacionId] = useState("");
  const [solicitando, setSolicitando] = useState(false);
  const [solicitudOk, setSolicitudOk] = useState(false);
  const [solicitudError, setSolicitudError] = useState("");

  const sectores = SECTORS_BY_COMMUNE[form.comuna] ?? [];

  useEffect(() => {
    fetch("/api/tasacion")
      .then((r) => r.json())
      .then((d: { ok?: boolean; data?: string[] }) => {
        if (d.ok && d.data) setComunas([...new Set(d.data)].sort());
      })
      .catch(() => setComunas([]));
  }, []);

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
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        result?: Resultado;
        tasacionId?: string;
      };
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

  async function pedirCotizacion() {
    if (!tasacionId) {
      setSolicitudError(
        "Falta el número de solicitud. Vuelve a calcular la estimación antes de pedir la cotización."
      );
      return;
    }
    setSolicitando(true);
    setSolicitudError("");
    try {
      const res = await fetch("/api/tasacion/cotizacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasacionId }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "No pudimos enviar la solicitud de cotización.");
      }
      setSolicitudOk(true);
    } catch (err) {
      setSolicitudError(
        err instanceof Error ? err.message : "No pudimos enviar la solicitud de cotización."
      );
    } finally {
      setSolicitando(false);
    }
  }

  if (resultado) {
    const tipo = TIPOS.find((t) => t.value === resultado.propertyType)?.label ?? resultado.propertyType;
    return (
      <div className="estimador-resultado">
        <div className="card">
          <p className="eyebrow">Estimación referencial</p>
          <p className="hint">
            Esta estimación es gratuita. No genera cobro ni encargo: el informe firmado se
            cotiza aparte, por escrito.
          </p>
          <h2 className="value-big">{fmt(resultado.estimatedValueUF, 1)} UF</h2>
          {resultado.estimatedValueCLP !== null && resultado.ufValueCLP !== null ? (
            <>
              <p className="muted">
                ${fmt(resultado.estimatedValueCLP)} CLP al valor de la UF del{" "}
                {fechaLarga(resultado.ufDate)} (${fmt(resultado.ufValueCLP, 2)}).
              </p>
              <p className="hint">
                Conversión calculada con el valor de la UF publicado por el Servicio de
                Impuestos Internos para el {fechaLarga(resultado.ufDate)}. La UF cambia
                todos los días: el valor en pesos corresponde a esa fecha.
              </p>
            </>
          ) : (
            <p className="notice small" role="status">
              La conversión a pesos no está disponible en este momento: no pudimos obtener
              el valor oficial de la UF. La estimación se expresa solo en UF.
            </p>
          )}
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
            <span className="tag">Se cotiza</span>
            <h2 className="h3">Informe de tasación con inspección y firma</h2>
            <p>
              La revisión la hace una persona: antecedentes, inspección del inmueble cuando
              corresponde e informe firmado. No es una descarga automática y no se cobra en
              línea.
            </p>
            <p>
              Envías la solicitud con los datos de esta estimación y CVR responde por
              escrito con el honorario y el plazo. Nada se cobra antes de que aceptes esa
              cotización.
            </p>
            {solicitudOk ? (
              <p className="notice small" role="status">
                Solicitud de cotización enviada. Te respondemos a{" "}
                <strong>{form.clientEmail}</strong> con el honorario y el plazo por escrito.
              </p>
            ) : (
              <button
                type="button"
                className="btn-gold"
                onClick={pedirCotizacion}
                disabled={solicitando}
              >
                {solicitando ? "Enviando la solicitud…" : "Pedir cotización"}
              </button>
            )}
            {solicitudError && (
              <p className="form-error" role="alert">
                {solicitudError}
              </p>
            )}
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
              setSolicitudOk(false);
              setSolicitudError("");
            }}
          >
            Hacer otra estimación
          </button>
        </p>

        <p>
          La estimación en línea queda como referencia. Si el documento se necesita para un
          banco, un tribunal o una herencia, se pide la cotización del informe firmado en la
          tarjeta de arriba o en{" "}
          <a href={SITE.tasacionesUrl} rel="noopener">
            cvrtasaciones.cl
          </a>
          .
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
        {cargando ? "Calculando…" : "Calcular estimación gratis"}
      </button>

      <p className="hint">
        Calcular no tiene costo y no crea un encargo. Si después pides el informe firmado,
        recibes primero una cotización por escrito con el honorario y el plazo.
      </p>

      <p className="disclaimer">
        El resultado es una estimación referencial y automática. No constituye una tasación,
        no sirve para trámites bancarios, judiciales, hereditarios ni de compraventa, y no
        reemplaza un informe firmado.
      </p>
    </form>
  );
}
