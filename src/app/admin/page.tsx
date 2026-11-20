"use client";

import Link from "next/link";
import { useCallback, useState } from "react";

interface PropertyData {
  id: string;
  comuna: string;
  sector: string;
  propertyType: string;
  avgPricePerM2: number;
  minPricePerM2: number | null;
  maxPricePerM2: number | null;
  referenceYear: number;
}

interface ListingRecord {
  id: string;
  title: string;
  comuna: string;
  sector: string;
  propertyType: string;
  transactionType: string;
  priceUF: number;
  status: string;
  isActive: boolean;
  createdAt: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
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

const TIPO: Record<string, string> = {
  casa: "Casa",
  departamento: "Departamento",
  terreno: "Terreno",
  agricola: "Agrícola",
};

const fmtUF = (n: number) => n.toLocaleString("es-CL", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const fmtCLP = (n: number) => `$${n.toLocaleString("es-CL", { maximumFractionDigits: 0 })}`;
const fmtFecha = (s: string) =>
  new Date(s).toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric" });

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");
  const [tab, setTab] = useState<"precios" | "solicitudes" | "publicaciones">("precios");

  const [propertyData, setPropertyData] = useState<PropertyData[]>([]);
  const [tasaciones, setTasaciones] = useState<TasacionRecord[]>([]);
  const [listings, setListings] = useState<ListingRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [seedStatus, setSeedStatus] = useState("");

  const [form, setForm] = useState({
    comuna: "",
    sector: "",
    propertyType: "casa",
    avgPricePerM2: "",
    minPricePerM2: "",
    maxPricePerM2: "",
    referenceYear: "2025",
  });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const fetchData = useCallback(async (pw: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin", { headers: { "x-admin-password": pw } });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        propertyData?: PropertyData[];
        tasaciones?: TasacionRecord[];
        listings?: ListingRecord[];
      };
      if (!data.ok) {
        setAuthError(data.error ?? "No autorizado.");
        return false;
      }
      setPropertyData(data.propertyData ?? []);
      setTasaciones(data.tasaciones ?? []);
      setListings(data.listings ?? []);
      return true;
    } catch {
      setAuthError("No se pudo conectar con el servidor.");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    const ok = await fetchData(password);
    if (ok) setAuthed(true);
  }

  async function cargarDatos() {
    setSeedStatus("Cargando…");
    const res = await fetch("/api/seed", {
      method: "POST",
      headers: { "x-admin-password": password },
    });
    const data = (await res.json()) as { ok?: boolean; message?: string; error?: string };
    setSeedStatus(data.ok ? (data.message ?? "Listo.") : (data.error ?? "Error al cargar."));
    if (data.ok) fetchData(password);
  }

  async function guardar(e: React.FormEvent) {
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
    const data = (await res.json()) as { ok?: boolean; error?: string };
    setSaving(false);
    if (data.ok) {
      setSaveMsg("Guardado.");
      setForm({
        comuna: "",
        sector: "",
        propertyType: "casa",
        avgPricePerM2: "",
        minPricePerM2: "",
        maxPricePerM2: "",
        referenceYear: "2025",
      });
      fetchData(password);
    } else {
      setSaveMsg(data.error ?? "No se pudo guardar.");
    }
  }

  async function cambiarPublicacion(id: string, isActive: boolean) {
    await fetch("/api/admin/propiedades", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ id, isActive }),
    });
    fetchData(password);
  }

  async function eliminar(id: string, etiqueta: string) {
    if (!window.confirm(`¿Eliminar ${etiqueta}?`)) return;
    await fetch("/api/admin", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ id }),
    });
    fetchData(password);
  }

  if (!authed) {
    return (
      <main id="contenido" className="admin-login">
        <div className="card form-card">
          <h1 className="h3">Administración</h1>
          <p className="muted small">CVR Propiedades · acceso restringido</p>
          <form onSubmit={login}>
            <div className="field">
              <label htmlFor="admin-password">Contraseña</label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            {authError && (
              <p className="form-error" role="alert">
                {authError}
              </p>
            )}
            <button type="submit" className="btn-gold">
              Ingresar
            </button>
          </form>
          <p className="hint">
            La clave se configura en la variable de entorno <code>ADMIN_PASSWORD</code>. Si no
            está definida, el acceso se rechaza.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main id="contenido" className="admin">
      <header className="admin-bar">
        <div className="admin-bar-inner">
          <div>
            <strong>CVR Propiedades</strong> <span className="muted small">· Administración</span>
          </div>
          <div className="admin-actions">
            <Link href="/tasacion" className="nav-link">
              Ver estimador
            </Link>
            <button type="button" className="link-button" onClick={() => setAuthed(false)}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <div className="container section-tight">
        <div className="notice small" role="note">
          Esta pantalla muestra datos personales de solicitantes reales. Úsala solo para
          gestionar solicitudes y no copies esos datos a otros sistemas.
        </div>

        <div className="grid four-col">
          {[
            { label: "Comunas con datos", value: new Set(propertyData.map((p) => p.comuna)).size },
            { label: "Registros de precios", value: propertyData.length },
            { label: "Solicitudes recibidas", value: tasaciones.length },
            { label: "Solicitudes pagadas", value: tasaciones.filter((t) => t.paymentStatus === "paid").length },
          ].map((s) => (
            <div key={s.label} className="card stat-card">
              <span className="stat-num">{s.value}</span>
              <span className="muted small">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="card">
          <h2 className="h3">Datos de referencia</h2>
          <p className="muted small">
            Valores por comuna, sector y tipo de propiedad incluidos en el repositorio. Se
            usan para la estimación referencial pública.
          </p>
          <div className="inline-actions">
            <button type="button" className="btn-outline" onClick={cargarDatos}>
              Cargar / actualizar datos base
            </button>
            {seedStatus && <span className="small muted">{seedStatus}</span>}
          </div>
        </div>

        <div className="tabs" role="tablist" aria-label="Secciones del panel">
          {(["precios", "solicitudes", "publicaciones"] as const).map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              className={tab === t ? "tab is-active" : "tab"}
              onClick={() => setTab(t)}
            >
              {t === "precios"
                ? "Precios por m²"
                : t === "solicitudes"
                  ? "Solicitudes"
                  : "Publicaciones"}
            </button>
          ))}
        </div>

        {loading && <p className="muted">Cargando…</p>}

        {!loading && tab === "precios" && (
          <div className="grid admin-grid">
            <form className="card" onSubmit={guardar}>
              <h2 className="h3">Agregar o actualizar</h2>
              <div className="field">
                <label htmlFor="a-comuna">Comuna</label>
                <input
                  id="a-comuna"
                  value={form.comuna}
                  onChange={(e) => setForm((p) => ({ ...p, comuna: e.target.value }))}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="a-sector">Sector (vacío = referencia general)</label>
                <input
                  id="a-sector"
                  value={form.sector}
                  onChange={(e) => setForm((p) => ({ ...p, sector: e.target.value }))}
                />
              </div>
              <div className="field">
                <label htmlFor="a-tipo">Tipo</label>
                <select
                  id="a-tipo"
                  value={form.propertyType}
                  onChange={(e) => setForm((p) => ({ ...p, propertyType: e.target.value }))}
                >
                  {Object.entries(TIPO).map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
              {[
                { key: "avgPricePerM2", label: "Precio promedio UF/m²", req: true },
                { key: "minPricePerM2", label: "Precio mínimo UF/m²", req: false },
                { key: "maxPricePerM2", label: "Precio máximo UF/m²", req: false },
                { key: "referenceYear", label: "Año de referencia", req: false },
              ].map((f) => (
                <div className="field" key={f.key}>
                  <label htmlFor={`a-${f.key}`}>{f.label}</label>
                  <input
                    id={`a-${f.key}`}
                    type="number"
                    step="0.01"
                    min="0"
                    value={form[f.key as keyof typeof form]}
                    onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                    required={f.req}
                  />
                </div>
              ))}
              {saveMsg && <p className="small muted">{saveMsg}</p>}
              <button type="submit" className="btn-gold" disabled={saving}>
                {saving ? "Guardando…" : "Guardar"}
              </button>
            </form>

            <div className="card table-card">
              <div className="table-wrap">
                <table className="data-table">
                  <caption className="sr-only">Valores de referencia por comuna</caption>
                  <thead>
                    <tr>
                      <th scope="col">Comuna / sector</th>
                      <th scope="col">Tipo</th>
                      <th scope="col">Prom. UF/m²</th>
                      <th scope="col">Año</th>
                      <th scope="col"><span className="sr-only">Acciones</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {propertyData.map((row) => (
                      <tr key={row.id}>
                        <th scope="row">
                          {row.comuna}
                          {row.sector ? <span className="muted small"> · {row.sector}</span> : null}
                        </th>
                        <td>{TIPO[row.propertyType] ?? row.propertyType}</td>
                        <td>{fmtUF(row.avgPricePerM2)}</td>
                        <td>{row.referenceYear}</td>
                        <td>
                          <button
                            type="button"
                            className="link-button danger"
                            onClick={() => eliminar(row.id, `${row.comuna} ${row.sector}`)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                    {propertyData.length === 0 && (
                      <tr>
                        <td colSpan={5}>Sin datos. Usa «Cargar / actualizar datos base».</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {!loading && tab === "publicaciones" && (
          <div className="card table-card">
            <div className="table-wrap">
              <table className="data-table">
                <caption className="sr-only">Publicaciones enviadas por anunciantes</caption>
                <thead>
                  <tr>
                    <th scope="col">Publicación</th>
                    <th scope="col">Ubicación</th>
                    <th scope="col">Precio UF</th>
                    <th scope="col">Contacto</th>
                    <th scope="col">Estado</th>
                    <th scope="col"><span className="sr-only">Acciones</span></th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((l) => (
                    <tr key={l.id}>
                      <th scope="row">
                        {l.title}
                        <span className="muted small">
                          {" "}
                          · {TIPO[l.propertyType] ?? l.propertyType} ·{" "}
                          {l.transactionType === "arriendo" ? "Arriendo" : "Venta"}
                        </span>
                      </th>
                      <td className="small">
                        {l.sector ? `${l.sector}, ` : ""}
                        {l.comuna}
                      </td>
                      <td>{fmtUF(l.priceUF)}</td>
                      <td className="small">
                        {l.contactName}
                        <br />
                        {l.contactPhone}
                      </td>
                      <td>
                        <span className={l.isActive ? "badge badge-ok" : "badge badge-warn"}>
                          {l.isActive ? "Publicada" : "En revisión"}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="link-button"
                          onClick={() => cambiarPublicacion(l.id, !l.isActive)}
                        >
                          {l.isActive ? "Retirar" : "Publicar"}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {listings.length === 0 && (
                    <tr>
                      <td colSpan={6}>Aún no hay publicaciones de terceros.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && tab === "solicitudes" && (
          <div className="card table-card">
            <div className="table-wrap">
              <table className="data-table">
                <caption className="sr-only">Solicitudes de estimación recibidas</caption>
                <thead>
                  <tr>
                    <th scope="col">Fecha</th>
                    <th scope="col">Solicitante</th>
                    <th scope="col">Contacto</th>
                    <th scope="col">Propiedad</th>
                    <th scope="col">Valor UF</th>
                    <th scope="col">Pago</th>
                  </tr>
                </thead>
                <tbody>
                  {tasaciones.map((t) => (
                    <tr key={t.id}>
                      <td>{fmtFecha(t.createdAt)}</td>
                      <th scope="row">{t.clientName}</th>
                      <td className="small">
                        {t.clientEmail}
                        <br />
                        {t.clientPhone}
                      </td>
                      <td className="small">
                        {TIPO[t.propertyType] ?? t.propertyType} · {t.comuna} · {t.surface} m²
                      </td>
                      <td>{fmtUF(t.estimatedValueUF)}</td>
                      <td>
                        <span className={t.paymentStatus === "paid" ? "badge badge-ok" : "badge badge-warn"}>
                          {t.paymentStatus === "paid" ? "Pagado" : "Pendiente"}
                        </span>
                        <div className="small muted">{fmtCLP(t.estimatedValueCLP)}</div>
                      </td>
                    </tr>
                  ))}
                  {tasaciones.length === 0 && (
                    <tr>
                      <td colSpan={6}>Aún no hay solicitudes.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
