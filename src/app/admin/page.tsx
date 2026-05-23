"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface PropertyData {
  id: string;
  comuna: string;
  propertyType: string;
  avgPricePerM2: number;
  minPricePerM2: number | null;
  maxPricePerM2: number | null;
  referenceYear: number;
}

interface TasacionRecord {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  comuna: string;
  propertyType: string;
  surface: number;
  estimatedValueUF: number;
  estimatedValueCLP: number;
  paymentStatus: string;
  createdAt: string;
}

const TYPE_LABELS: Record<string, string> = {
  casa: "🏠 Casa",
  departamento: "🏢 Depto.",
  terreno: "🌿 Terreno",
  agricola: "🌾 Agrícola",
};

const fmtUF = (n: number) => n.toLocaleString("es-CL", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const fmtCLP = (n: number) => `$${n.toLocaleString("es-CL", { maximumFractionDigits: 0 })}`;
const fmtDate = (s: string) => new Date(s).toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric" });

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");
  const [activeTab, setActiveTab] = useState<"precios" | "tasaciones">("precios");

  const [propertyData, setPropertyData] = useState<PropertyData[]>([]);
  const [tasaciones, setTasaciones] = useState<TasacionRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [seedStatus, setSeedStatus] = useState("");

  // Form para nuevo/editar registro
  const [form, setForm] = useState({
    comuna: "", propertyType: "casa",
    avgPricePerM2: "", minPricePerM2: "", maxPricePerM2: "", referenceYear: "2025",
  });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const fetchData = useCallback(async (pw: string) => {
    setLoading(true);
    const res = await fetch("/api/admin", { headers: { "x-admin-password": pw } });
    const data = await res.json();
    setLoading(false);
    if (!data.ok) { setAuthError("Contraseña incorrecta."); return false; }
    setPropertyData(data.propertyData);
    setTasaciones(data.tasaciones);
    return true;
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    const ok = await fetchData(password);
    if (ok) setAuthed(true);
  };

  const handleSeed = async () => {
    setSeedStatus("Cargando datos de Ñuble...");
    const res = await fetch("/api/seed", { method: "POST" });
    const data = await res.json();
    setSeedStatus(data.message ?? "Error al cargar datos.");
    if (data.ok) fetchData(password);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg("");
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({
        ...form,
        avgPricePerM2: parseFloat(form.avgPricePerM2),
        minPricePerM2: form.minPricePerM2 ? parseFloat(form.minPricePerM2) : null,
        maxPricePerM2: form.maxPricePerM2 ? parseFloat(form.maxPricePerM2) : null,
        referenceYear: parseInt(form.referenceYear, 10),
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (data.ok) {
      setSaveMsg("✅ Guardado correctamente.");
      setForm({ comuna: "", propertyType: "casa", avgPricePerM2: "", minPricePerM2: "", maxPricePerM2: "", referenceYear: "2025" });
      fetchData(password);
    } else {
      setSaveMsg("❌ " + data.error);
    }
  };

  const handleDelete = async (id: string, label: string) => {
    if (!confirm(`¿Eliminar ${label}?`)) return;
    await fetch("/api/admin", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ id }),
    });
    fetchData(password);
  };

  const handleEdit = (row: PropertyData) => {
    setForm({
      comuna: row.comuna,
      propertyType: row.propertyType,
      avgPricePerM2: String(row.avgPricePerM2),
      minPricePerM2: row.minPricePerM2 != null ? String(row.minPricePerM2) : "",
      maxPricePerM2: row.maxPricePerM2 != null ? String(row.maxPricePerM2) : "",
      referenceYear: String(row.referenceYear),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => { if (!authed) return; }, [authed]);

  // ─── LOGIN ────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <Link href="/" className="text-2xl font-bold">CVR</Link>
            <p className="text-slate-400 text-sm mt-2">Panel de Administración</p>
          </div>
          <form onSubmit={handleLogin} className="glass-card p-8 space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Contraseña de acceso</label>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" required autoFocus
                className="w-full bg-white/5 border border-[var(--color-glass-border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-gold)] transition-colors"
              />
            </div>
            {authError && <p className="text-red-400 text-sm">{authError}</p>}
            <button type="submit" className="w-full btn-primary py-3">Ingresar →</button>
            <p className="text-xs text-center text-slate-600">
              Contraseña por defecto: <code>cvr2025admin</code><br />
              Cámbiala en el archivo <code>.env</code> con <code>ADMIN_PASSWORD=tuClave</code>
            </p>
          </form>
        </div>
      </div>
    );
  }

  // ─── PANEL PRINCIPAL ──────────────────────────────────────
  return (
    <div className="min-h-screen">
      {/* Top nav */}
      <nav className="fixed w-full top-0 z-50 bg-[var(--color-navy-dark)]/90 backdrop-blur-lg border-b border-[var(--color-glass-border)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold">CVR</span>
            <span className="text-xs text-[var(--color-gold)] uppercase tracking-widest font-semibold">Admin</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/tasacion" className="text-sm text-slate-400 hover:text-white transition-colors">Ver tasación pública</Link>
            <button onClick={() => setAuthed(false)} className="text-sm text-slate-500 hover:text-red-400 transition-colors">Cerrar sesión</button>
          </div>
        </div>
      </nav>

      <main className="pt-28 pb-20 px-6 max-w-7xl mx-auto">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Comunas con datos", value: [...new Set(propertyData.map((p) => p.comuna))].length },
            { label: "Registros de precios", value: propertyData.length },
            { label: "Tasaciones recibidas", value: tasaciones.length },
            { label: "Tasaciones pagadas", value: tasaciones.filter((t) => t.paymentStatus === "paid").length },
          ].map((s) => (
            <div key={s.label} className="glass-card p-5 text-center">
              <div className="text-3xl font-bold text-[var(--color-gold)]">{s.value}</div>
              <div className="text-xs text-slate-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Seed button */}
        <div className="glass-card p-5 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold">Cargar datos iniciales de Ñuble</h3>
            <p className="text-sm text-slate-400">Carga los valores de referencia de las 21 comunas de la región desde TocToc / Portal Inmobiliario.</p>
          </div>
          <div className="flex items-center gap-4">
            {seedStatus && <span className="text-sm text-[var(--color-gold)]">{seedStatus}</span>}
            <button onClick={handleSeed} className="btn-primary text-sm whitespace-nowrap">
              Cargar datos base →
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white/5 rounded-lg p-1 w-fit">
          {(["precios", "tasaciones"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-md text-sm font-semibold transition-all capitalize ${
                activeTab === tab ? "bg-[var(--color-gold)] text-black" : "text-slate-400 hover:text-white"
              }`}
            >
              {tab === "precios" ? "💰 Precios por m²" : "📋 Solicitudes"}
            </button>
          ))}
        </div>

        {loading && <div className="text-center py-12 text-slate-400">Cargando datos...</div>}

        {/* ─── TAB: PRECIOS ──────────────────────────────── */}
        {!loading && activeTab === "precios" && (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Form agregar/editar */}
            <div className="glass-card p-6">
              <h3 className="font-bold mb-4 text-[var(--color-gold)]">Agregar / Actualizar precio</h3>
              <form onSubmit={handleSave} className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Comuna</label>
                  <input name="comuna" value={form.comuna} onChange={(e) => setForm((p) => ({ ...p, comuna: e.target.value }))}
                    placeholder="Ej: Chillán" required
                    className="w-full bg-white/5 border border-[var(--color-glass-border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Tipo</label>
                  <select value={form.propertyType} onChange={(e) => setForm((p) => ({ ...p, propertyType: e.target.value }))}
                    className="w-full bg-[#0d1e35] border border-[var(--color-glass-border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                  >
                    <option value="casa">Casa</option>
                    <option value="departamento">Departamento</option>
                    <option value="terreno">Terreno</option>
                    <option value="agricola">Agrícola</option>
                  </select>
                </div>
                {[
                  { key: "avgPricePerM2", label: "Precio promedio UF/m² *" },
                  { key: "minPricePerM2", label: "Precio mínimo UF/m²" },
                  { key: "maxPricePerM2", label: "Precio máximo UF/m²" },
                  { key: "referenceYear", label: "Año de referencia" },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block text-xs text-slate-400 mb-1">{f.label}</label>
                    <input
                      type="number" step="0.01" min="0"
                      value={form[f.key as keyof typeof form]}
                      onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                      required={f.key === "avgPricePerM2"}
                      className="w-full bg-white/5 border border-[var(--color-glass-border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                    />
                  </div>
                ))}
                {saveMsg && <p className="text-sm">{saveMsg}</p>}
                <button type="submit" disabled={saving} className="w-full btn-primary py-2 text-sm">
                  {saving ? "Guardando..." : "Guardar →"}
                </button>
              </form>
            </div>

            {/* Tabla */}
            <div className="md:col-span-2 glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--color-glass-border)]">
                      <th className="text-left px-4 py-3 text-slate-400 font-semibold">Comuna</th>
                      <th className="text-left px-4 py-3 text-slate-400 font-semibold">Tipo</th>
                      <th className="text-right px-4 py-3 text-slate-400 font-semibold">Prom. UF/m²</th>
                      <th className="text-right px-4 py-3 text-slate-400 font-semibold">Rango</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {propertyData.map((row) => (
                      <tr key={row.id} className="border-b border-[var(--color-glass-border)] hover:bg-white/3 transition-colors">
                        <td className="px-4 py-3 font-semibold">{row.comuna}</td>
                        <td className="px-4 py-3 text-slate-400">{TYPE_LABELS[row.propertyType] ?? row.propertyType}</td>
                        <td className="px-4 py-3 text-right text-[var(--color-gold)] font-bold">{fmtUF(row.avgPricePerM2)}</td>
                        <td className="px-4 py-3 text-right text-slate-500 text-xs">
                          {row.minPricePerM2 != null ? fmtUF(row.minPricePerM2) : "—"} –{" "}
                          {row.maxPricePerM2 != null ? fmtUF(row.maxPricePerM2) : "—"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button onClick={() => handleEdit(row)} className="text-xs text-slate-400 hover:text-[var(--color-gold)] mr-3 transition-colors">Editar</button>
                          <button onClick={() => handleDelete(row.id, `${row.comuna} – ${row.propertyType}`)} className="text-xs text-red-500 hover:text-red-300 transition-colors">Eliminar</button>
                        </td>
                      </tr>
                    ))}
                    {propertyData.length === 0 && (
                      <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">No hay datos. Use el botón &ldquo;Cargar datos base&rdquo; para comenzar.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB: TASACIONES ──────────────────────────── */}
        {!loading && activeTab === "tasaciones" && (
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-glass-border)]">
                    {["Fecha", "Cliente", "Contacto", "Propiedad", "Valor UF", "Valor CLP", "Estado"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-slate-400 font-semibold whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tasaciones.map((t) => (
                    <tr key={t.id} className="border-b border-[var(--color-glass-border)] hover:bg-white/3 transition-colors">
                      <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">{fmtDate(t.createdAt)}</td>
                      <td className="px-4 py-3 font-semibold">{t.clientName}</td>
                      <td className="px-4 py-3 text-slate-400 text-xs">
                        <div>{t.clientEmail}</div>
                        <div>{t.clientPhone}</div>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <div className="font-semibold">{t.comuna}</div>
                        <div className="text-slate-400">{TYPE_LABELS[t.propertyType]} · {t.surface} m²</div>
                      </td>
                      <td className="px-4 py-3 text-[var(--color-gold)] font-bold whitespace-nowrap">{fmtUF(t.estimatedValueUF)} UF</td>
                      <td className="px-4 py-3 text-slate-300 text-xs whitespace-nowrap">{fmtCLP(t.estimatedValueCLP)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase ${
                          t.paymentStatus === "paid" ? "bg-green-900/50 text-green-400" : "bg-yellow-900/50 text-yellow-400"
                        }`}>
                          {t.paymentStatus === "paid" ? "Pagado" : "Pendiente"}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {tasaciones.length === 0 && (
                    <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-500">Aún no hay solicitudes de tasación.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
