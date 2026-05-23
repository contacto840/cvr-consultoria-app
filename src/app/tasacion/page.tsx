"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SECTORS_BY_COMMUNE } from "@/lib/seed-data";

const PROPERTY_TYPES = [
  { value: "casa", label: "🏠 Casa" },
  { value: "departamento", label: "🏢 Departamento" },
  { value: "terreno", label: "🌿 Terreno Urbano" },
  { value: "agricola", label: "🌾 Predio Agrícola / Rural" },
];

const CONDITIONS = [
  { value: "excelente", label: "Excelente — Nuevo o remodelado recientemente" },
  { value: "bueno", label: "Bueno — Bien mantenido, pocos desperfectos" },
  { value: "normal", label: "Normal — Estado promedio de mercado" },
  { value: "regular", label: "Regular — Requiere reparaciones menores" },
  { value: "malo", label: "Malo — Requiere reparaciones importantes" },
];

interface TasacionResult {
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
}

const fmt = (n: number) => n.toLocaleString("es-CL", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
const fmtUF = (n: number) => n.toLocaleString("es-CL", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

function TasacionContent() {
  const searchParams = useSearchParams();
  const [communes, setCommunes] = useState<string[]>([]);
  const [sectors, setSectors] = useState<string[]>([]);
  const [form, setForm] = useState({
    clientName: "", clientEmail: "", clientPhone: "",
    comuna: "", sector: "", propertyType: "casa",
    surface: "", condition: "normal", age: "10",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TasacionResult | null>(null);
  const [error, setError] = useState("");
  const [tasacionId, setTasacionId] = useState("");

  // Payment states
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [verifyingPayment, setVerifyingPayment] = useState(false);

  // Quick-estimate pre-fill from URL params (from homepage widget)
  const quickTipo = searchParams.get("tipo");
  const quickComuna = searchParams.get("comuna");
  const quickSuperficie = searchParams.get("superficie");
  const isQuickMode = !!(quickTipo && quickComuna && quickSuperficie);

  useEffect(() => {
    fetch("/api/tasacion")
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) {
          const unique = [...new Set<string>(d.data.map((x: { comuna: string }) => x.comuna))].sort();
          setCommunes(unique);
          // Pre-fill from quick mode after communes load
          if (quickTipo || quickComuna || quickSuperficie) {
            setForm((prev) => ({
              ...prev,
              propertyType: quickTipo || prev.propertyType,
              comuna: quickComuna || prev.comuna,
              surface: quickSuperficie || prev.surface,
            }));
          }
        }
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update sectors when commune changes
  useEffect(() => {
    const s = SECTORS_BY_COMMUNE[form.comuna] ?? [];
    setSectors(s);
    setForm(f => ({ ...f, sector: "" }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.comuna]);

  // Check for MercadoPago redirect status
  useEffect(() => {
    const status = searchParams.get("status");
    const payment_id = searchParams.get("payment_id");
    const id = searchParams.get("id"); // tasacionId from our back_urls
    const simulated = searchParams.get("simulated");

    if (status === "approved" && id) {
      setVerifyingPayment(true);
      // Verify payment with our backend
      fetch("/api/pagos/confirmar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasacionId: id, payment_id, simulated: simulated === "true" }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.ok) {
            setPaymentSuccess(true);
            setTasacionId(id);
          } else {
            setError(data.error || "Error verificando el pago.");
          }
        })
        .catch(() => setError("Error de conexión al verificar pago."))
        .finally(() => setVerifyingPayment(false));
    } else if (status === "failed") {
      setError("El pago ha fallado o fue rechazado. Por favor, intente nuevamente.");
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/tasacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      setResult(data.result);
      setTasacionId(data.tasacionId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al calcular. Inténtelo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setIsProcessingPayment(true);
    setError("");
    
    try {
      const res = await fetch("/api/pagos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasacionId }),
      });
      const data = await res.json();
      
      if (data.ok && data.init_point) {
        window.location.href = data.init_point;
      } else {
        throw new Error(data.error || "No se pudo iniciar el pago");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error iniciando MercadoPago.");
      setIsProcessingPayment(false);
    }
  };

  const propertyTypeLabel = PROPERTY_TYPES.find((p) => p.value === result?.propertyType)?.label ?? "";

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="fixed w-full top-0 z-50 bg-[var(--color-navy-dark)]/80 backdrop-blur-lg border-b border-[var(--color-glass-border)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="text-xl font-bold">CVR</span>
            <span className="text-xs text-slate-400 uppercase tracking-widest">Consultoría Predial</span>
          </Link>
          <Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors">
            ← Volver al inicio
          </Link>
        </div>
      </nav>

      <main className="pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1 rounded-full border border-[var(--color-glass-border)] bg-[var(--color-glass)] text-[var(--color-gold)] text-xs font-bold tracking-widest uppercase mb-4">
              Servicio Online
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              Tasación{" "}
              <span className="text-[var(--color-gold)]">Automática</span>
            </h1>
            <p className="text-slate-400 max-w-xl mx-auto">
              Obtén una valorización referencial de tu propiedad en la Región de Ñuble. Basado en datos reales de mercado.
            </p>
          </div>

          {verifyingPayment ? (
            <div className="glass-card p-12 text-center">
              <svg className="animate-spin h-10 w-10 mx-auto mb-4 text-[var(--color-gold)]" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <h2 className="text-xl font-bold">Verificando su pago...</h2>
              <p className="text-slate-400 mt-2">Por favor, espere un momento.</p>
            </div>
          ) : paymentSuccess ? (
            /* PANTALLA DE ÉXITO PREMIUM */
            <div className="glass-card p-10 md:p-16 border-[var(--color-gold)]/50 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,168,91,0.1),transparent_70%)]" />
              <div className="text-6xl mb-6 relative z-10">✨</div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--color-gold)] mb-4 relative z-10">
                ¡Pago Confirmado Exitosamente!
              </h2>
              <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto relative z-10 leading-relaxed">
                Agradecemos su confianza en CVR Consultoría Predial. Su solicitud está en proceso.
                Nuestro perito técnico elaborará y firmará su <strong>Informe Oficial de Tasación</strong>.
              </p>
              
              <div className="bg-black/40 border border-white/10 rounded-xl p-6 inline-block text-left mb-8 relative z-10">
                <div className="text-sm text-slate-400 mb-1">ID de Solicitud</div>
                <code className="text-lg font-mono text-white">{tasacionId}</code>
              </div>
              
              <p className="text-sm text-slate-400 max-w-lg mx-auto relative z-10">
                El informe será enviado al correo electrónico registrado en un plazo máximo de <strong>24 horas hábiles</strong>.
                Si requiere asistencia inmediata, responda a nuestro correo de contacto.
              </p>
              
              <div className="mt-10 relative z-10">
                <button onClick={() => window.location.href = "/"} className="btn-secondary">
                  Volver al inicio
                </button>
              </div>
            </div>
          ) : !result ? (
            /* FORMULARIO */
            <div className="glass-card p-8 md:p-12">
              {isQuickMode && (
                <div className="mb-6 p-4 rounded-xl border border-[var(--color-border-gold)] bg-[var(--color-gold-dim)] flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">⚡</span>
                  <div>
                    <p className="text-sm font-bold text-[var(--color-gold)]">Datos de propiedad pre-cargados</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {quickTipo === "casa" ? "Casa" : quickTipo === "departamento" ? "Departamento" : quickTipo === "terreno" ? "Terreno" : "Predio Agrícola"} · {quickComuna} · {quickSuperficie} {quickTipo === "agricola" ? "ha" : "m²"}.
                      Solo ingresa tus datos de contacto para calcular.
                    </p>
                  </div>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Datos de contacto */}
                <div>
                  <h2 className="text-lg font-bold mb-4 text-[var(--color-gold)]">
                    {isQuickMode ? "1. Solo tus datos de contacto" : "1. Sus datos de contacto"}
                  </h2>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Nombre completo *</label>
                      <input
                        name="clientName" value={form.clientName} onChange={handleChange}
                        placeholder="Ej: Carlos Vivanco" required
                        className="w-full bg-white/5 border border-[var(--color-glass-border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Correo electrónico *</label>
                      <input
                        name="clientEmail" value={form.clientEmail} onChange={handleChange}
                        type="email" placeholder="correo@ejemplo.cl" required
                        className="w-full bg-white/5 border border-[var(--color-glass-border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Teléfono *</label>
                      <input
                        name="clientPhone" value={form.clientPhone} onChange={handleChange}
                        placeholder="+56 9 1234 5678" required
                        className="w-full bg-white/5 border border-[var(--color-glass-border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Datos del inmueble */}
                <div>
                  <h2 className="text-lg font-bold mb-4 text-[var(--color-gold)]">2. Datos del inmueble</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Comuna *</label>
                      <select
                        name="comuna" value={form.comuna} onChange={handleChange} required
                        className="w-full bg-[#0d1e35] border border-[var(--color-glass-border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                      >
                        <option value="">— Seleccionar comuna —</option>
                        {communes.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    {sectors.length > 0 && (
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">
                          Sector / Barrio
                          <span className="text-slate-500 font-normal"> — mejora la precisión</span>
                        </label>
                        <select
                          name="sector" value={form.sector} onChange={handleChange}
                          className="w-full bg-[#0d1e35] border border-[var(--color-glass-border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                        >
                          <option value="">— Sin sector específico —</option>
                          {sectors.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Tipo de propiedad *</label>
                      <select
                        name="propertyType" value={form.propertyType} onChange={handleChange}
                        className="w-full bg-[#0d1e35] border border-[var(--color-glass-border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                      >
                        {PROPERTY_TYPES.map((p) => (
                          <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">
                        Superficie {form.propertyType === "agricola" ? "(Hectáreas)" : "(m²)"} *
                      </label>
                      <input
                        name="surface" value={form.surface} onChange={handleChange}
                        type="number" min="1" step="0.1" placeholder={form.propertyType === "agricola" ? "Ej: 5.5" : "Ej: 85"} required
                        className="w-full bg-white/5 border border-[var(--color-glass-border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                      />
                      {form.propertyType === "agricola" && (
                        <p className="text-xs text-slate-500 mt-1">Ingrese en hectáreas. El sistema convierte a m² automáticamente.</p>
                      )}
                    </div>
                    {(form.propertyType === "casa" || form.propertyType === "departamento") && (
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">Antigüedad aproximada (años)</label>
                        <input
                          name="age" value={form.age} onChange={handleChange}
                          type="number" min="0" max="100" placeholder="Ej: 15"
                          className="w-full bg-white/5 border border-[var(--color-glass-border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Condición */}
                <div>
                  <h2 className="text-lg font-bold mb-4 text-[var(--color-gold)]">3. Estado actual de la propiedad</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {CONDITIONS.map((c) => (
                      <label
                        key={c.value}
                        className={`cursor-pointer rounded-lg border p-4 transition-all ${
                          form.condition === c.value
                            ? "border-[var(--color-gold)] bg-[var(--color-gold)]/10"
                            : "border-[var(--color-glass-border)] hover:border-white/30"
                        }`}
                      >
                        <input
                          type="radio" name="condition" value={c.value}
                          checked={form.condition === c.value} onChange={handleChange}
                          className="sr-only"
                        />
                        <div className="text-sm font-semibold mb-1">
                          {c.label.split("—")[0]}
                        </div>
                        <div className="text-xs text-slate-500">{c.label.split("—")[1]?.trim()}</div>
                      </label>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="bg-red-900/30 border border-red-500/40 rounded-lg p-4 text-sm text-red-400">
                    ⚠️ {error}
                  </div>
                )}

                <button
                  type="submit" disabled={loading}
                  className="w-full btn-primary py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Calculando valorización...
                    </span>
                  ) : (
                    "Calcular Tasación Gratuita →"
                  )}
                </button>

                <p className="text-xs text-center text-slate-500">
                  Este informe es referencial. Para una tasación legal y oficial con firma de perito, contáctenos directamente.
                </p>
              </form>
            </div>
          ) : (
            /* RESULTADO DE TASACIÓN */
            <div className="space-y-6">
              {error && (
                <div className="bg-red-900/30 border border-red-500/40 rounded-lg p-4 text-sm text-red-400">
                  ⚠️ {error}
                </div>
              )}
              
              {/* Main result card */}
              <div className="glass-card p-8 md:p-12 border-[var(--color-gold)]/30">
                <div className="text-center mb-8">
                  <div className="text-sm text-slate-400 uppercase tracking-widest mb-2">Valorización Estimada Referencial</div>
                  <div className="text-6xl md:text-7xl font-extrabold text-[var(--color-gold)] mb-2">
                    {fmtUF(result.estimatedValueUF)} UF
                  </div>
                  <div className="text-2xl text-slate-300 font-semibold">
                    $ {fmt(result.estimatedValueCLP)} CLP
                  </div>
                  <div className="text-sm text-slate-500 mt-2">
                    (UF = ${fmt(result.ufValueCLP)} — Año ref. {result.referenceYear})
                  </div>
                </div>

                {/* Range */}
                <div className="flex justify-center gap-8 mb-8">
                  <div className="text-center">
                    <div className="text-xs text-slate-500 uppercase mb-1">Rango Mínimo</div>
                    <div className="text-xl font-bold text-slate-300">{fmtUF(result.minValueUF)} UF</div>
                  </div>
                  <div className="w-px bg-[var(--color-glass-border)]" />
                  <div className="text-center">
                    <div className="text-xs text-slate-500 uppercase mb-1">Rango Máximo</div>
                    <div className="text-xl font-bold text-slate-300">{fmtUF(result.maxValueUF)} UF</div>
                  </div>
                </div>

                {/* Detail table */}
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  {[
                    { label: "Tipo de propiedad", value: propertyTypeLabel },
                    { label: "Comuna", value: result.usedSector ? `${result.comuna} — ${result.usedSector}` : result.comuna },
                    { label: "Superficie", value: `${result.surface} m²` },
                    { label: "Precio ref. por m²", value: `${fmtUF(result.pricePerM2UF)} UF/m²` },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between py-3 border-b border-[var(--color-glass-border)]">
                      <span className="text-slate-400">{row.label}</span>
                      <span className="font-semibold">{row.value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-xs text-slate-500 text-center">
                  ID de solicitud: <code className="font-mono">{tasacionId}</code>
                </div>
              </div>

              {/* CTA cards */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-card p-6 border-[var(--color-gold)]/40 relative overflow-hidden flex flex-col h-full">
                  <div className="absolute top-0 right-0 bg-[var(--color-gold)] text-black text-[10px] font-bold px-3 py-1 uppercase rounded-bl-lg">
                    Recomendado
                  </div>
                  <div className="text-3xl mb-4">📄</div>
                  <h3 className="text-xl font-bold mb-2">Informe Oficial con Firma de Perito</h3>
                  <p className="text-slate-400 text-sm mb-6 flex-grow">
                    Necesitas este documento para trámites bancarios, herencias, juicios o compraventas formales. Tiene validez legal e incluye visita a terreno o evaluación digital experta.
                  </p>
                  <div className="text-xl font-bold text-[var(--color-gold)] mb-4">$15.000 CLP</div>
                  
                  <button 
                    onClick={handlePayment} 
                    disabled={isProcessingPayment}
                    className="w-full btn-primary py-3 text-sm disabled:opacity-50 flex justify-center items-center gap-2"
                  >
                    {isProcessingPayment ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Redirigiendo a MercadoPago...
                      </>
                    ) : (
                      "Adquirir Informe Oficial"
                    )}
                  </button>
                </div>
                
                <div className="glass-card p-6 flex flex-col h-full">
                  <div className="text-3xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold mb-2">Due Diligence o Estudio de Títulos</h3>
                  <p className="text-slate-400 text-sm mb-6 flex-grow">
                    ¿Va a comprar esta propiedad? Antes de firmar, verifique la situación legal, servidumbres y cargas hipotecarias con nuestra auditoría profunda.
                  </p>
                  <a href={`mailto:contacto@cvrpropiedades.com?subject=Solicito%20Due%20Diligence%20-%20ID%20${tasacionId}`}
                    className="w-full btn-secondary text-center py-3 text-sm mt-auto">
                    Consultar Honorarios
                  </a>
                </div>
              </div>

              <div className="text-center pt-4">
                <button onClick={() => { setResult(null); setTasacionId(""); }}
                  className="text-sm text-slate-400 hover:text-white underline transition-colors">
                  ← Hacer otra tasación
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function TasacionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--color-gold)] animate-pulse">Cargando...</div>
      </div>
    }>
      <TasacionContent />
    </Suspense>
  );
}
