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

const TABS = [
  { id: "precios", label: "Precios por m²" },
  { id: "solicitudes", label: "Solicitudes" },
  { id: "publicaciones", label: "Publicaciones" },
] as const;

type Tab = (typeof TABS)[number]["id"];
type CampoPrecio = "comuna" | "avgPricePerM2" | "minPricePerM2" | "maxPricePerM2" | "referenceYear";

const ID_CAMPO: Record<CampoPrecio, string> = {
  comuna: "a-comuna",
  avgPricePerM2: "a-avgPricePerM2",
  minPricePerM2: "a-minPricePerM2",
  maxPricePerM2: "a-maxPricePerM2",
  referenceYear: "a-referenceYear",
};

const fmtUF = (n: number) => n.toLocaleString("es-CL", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const fmtUF2 = (n: number) => n.toLocaleString("es-CL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtCLP = (n: number) => `$${n.toLocaleString("es-CL", { maximumFractionDigits: 0 })}`;
const fmtFecha = (s: string) =>
  new Date(s).toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric" });

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");
  const [tab, setTab] = useState<Tab>("precios");

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
  const [errores, setErrores] = useState<Partial<Record<CampoPrecio, string>>>({});
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [saveOk, setSaveOk] = useState(false);

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

  function campo(nombre: keyof typeof form, valor: string) {
    setForm((p) => ({ ...p, [nombre]: valor }));
    setErrores((p) => {
      if (!(nombre in p)) return p;
      const siguiente = { ...p };
      delete siguiente[nombre as CampoPrecio];
      return siguiente;
    });
  }

  function validarPrecio(): Partial<Record<CampoPrecio, string>> {
    const e: Partial<Record<CampoPrecio, string>> = {};

    if (!form.comuna.trim()) e.comuna = "Indica la comuna.";

    const promedio = Number(form.avgPricePerM2);
    if (!form.avgPricePerM2.trim() || !Number.isFinite(promedio) || promedio <= 0 || promedio > 10000) {
      e.avgPricePerM2 = "Ingresa un promedio mayor que 0 y hasta 10.000 UF/m².";
    }

    for (const clave of ["minPricePerM2", "maxPricePerM2"] as const) {
      const valor = form[clave];
      if (valor.trim() && !Number.isFinite(Number(valor))) {
        e[clave] = "Debe ser un número.";
      }
    }

    const anio = Number(form.referenceYear);
    if (!Number.isInteger(anio) || anio < 2000 || anio > 2100) {
      e.referenceYear = "Indica un año entre 2000 y 2100.";
    }

    return e;
  }

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    setSaveMsg("");

    const encontrados = validarPrecio();
    setErrores(encontrados);
    const primero = (Object.keys(encontrados) as CampoPrecio[])[0];
    if (primero) {
      document.getElementById(ID_CAMPO[primero])?.focus();
      return;
    }

    setSaving(true);
    setSaveOk(false);
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
      setSaveOk(true);
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
      setSaveOk(false);
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

  function moverFocoTab(e: React.KeyboardEvent<HTMLButtonElement>, indice: number) {
    const ultimo = TABS.length - 1;
    let destino: number | null = null;
    if (e.key === "ArrowRight") destino = indice === ultimo ? 0 : indice + 1;
    else if (e.key === "ArrowLeft") destino = indice === 0 ? ultimo : indice - 1;
    else if (e.key === "Home") destino = 0;
    else if (e.key === "End") destino = ultimo;
    if (destino === null) return;
    e.preventDefault();
    setTab(TABS[destino].id);
    document.getElementById(`tab-${TABS[destino].id}`)?.focus();
  }

  if (!authed) {
    return (
      <>
        <section className="page-hero">
          <div className="container narrow">
            <p className="eyebrow">Acceso restringido</p>
            <h1 className="page-title">Administración</h1>
            <p className="page-lead">
              Panel interno de CVR Propiedades. Contiene datos personales de solicitantes y
              publicantes: úsalo solo para gestionarlos.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container narrow">
            <form className="card form-card" onSubmit={login}>
              <h2 className="h3">Ingreso</h2>
              <div className="field">
                <label htmlFor="admin-password">Contraseña</label>
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (authError) setAuthError("");
                  }}
                  autoComplete="current-password"
                  required
                  aria-invalid={authError ? true : undefined}
                  aria-describedby={`admin-password-hint${authError ? " admin-error" : ""}`}
                />
                <span className="hint" id="admin-password-hint">
                  La clave se configura en la variable de entorno <code>ADMIN_PASSWORD</code>. Si
                  no está definida, el acceso se rechaza.
                </span>
              </div>
              {authError && (
                <p className="form-error" id="admin-error" role="alert" aria-live="assertive">
                  {authError}
                </p>
              )}
              <button type="submit" className="btn-gold">
                Ingresar
              </button>
            </form>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="page-hero-row">
            <div>
              <p className="eyebrow">Panel interno</p>
              <h1 className="page-title">Administración</h1>
              <p className="page-lead">
                Datos de referencia, solicitudes y publicaciones de CVR Propiedades.
              </p>
            </div>
            <div className="inline-actions">
              <Link href="/tasacion" className="btn-outline">
                Ver el estimador
              </Link>
              <button type="button" className="btn-outline" onClick={() => setAuthed(false)}>
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <div className="notice small" role="note">
            Esta pantalla muestra datos personales de solicitantes reales. Úsala solo para
            gestionar solicitudes y no copies esos datos a otros sistemas.
          </div>

          <h2 className="sr-only">Resumen</h2>
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
              {seedStatus && (
                <span className="small muted" role="status">
                  {seedStatus}
                </span>
              )}
            </div>
          </div>

          <div className="tabs" role="tablist" aria-label="Secciones del panel">
            {TABS.map((t, i) => (
              <button
                key={t.id}
                id={`tab-${t.id}`}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                aria-controls={tab === t.id ? `panel-${t.id}` : undefined}
                tabIndex={tab === t.id ? 0 : -1}
                className={tab === t.id ? "tab is-active" : "tab"}
                onClick={() => setTab(t.id)}
                onKeyDown={(e) => moverFocoTab(e, i)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {loading && (
            <p className="muted" role="status" aria-live="polite">
              Cargando…
            </p>
          )}

          {!loading && tab === "precios" && (
            <div role="tabpanel" id="panel-precios" aria-labelledby="tab-precios">
              <div className="grid admin-grid">
                <form className="card" onSubmit={guardar} noValidate>
                  <h2 className="h3">Agregar o actualizar</h2>

                  <div className="field">
                    <label htmlFor="a-comuna">Comuna</label>
                    <input
                      id="a-comuna"
                      value={form.comuna}
                      onChange={(e) => campo("comuna", e.target.value)}
                      required
                      aria-invalid={errores.comuna ? true : undefined}
                      aria-describedby={errores.comuna ? "a-comuna-error" : undefined}
                    />
                    {errores.comuna && (
                      <p className="field-error" id="a-comuna-error" role="alert">
                        {errores.comuna}
                      </p>
                    )}
                  </div>

                  <div className="field">
                    <label htmlFor="a-sector">Sector (vacío = referencia general)</label>
                    <input
                      id="a-sector"
                      value={form.sector}
                      onChange={(e) => campo("sector", e.target.value)}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="a-tipo">Tipo</label>
                    <select
                      id="a-tipo"
                      value={form.propertyType}
                      onChange={(e) => campo("propertyType", e.target.value)}
                    >
                      {Object.entries(TIPO).map(([v, l]) => (
                        <option key={v} value={v}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>

                  {[
                    { key: "avgPricePerM2" as const, label: "Precio promedio UF/m²", req: true },
                    { key: "minPricePerM2" as const, label: "Precio mínimo UF/m²", req: false },
                    { key: "maxPricePerM2" as const, label: "Precio máximo UF/m²", req: false },
                    { key: "referenceYear" as const, label: "Año de referencia", req: false },
                  ].map((f) => (
                    <div className="field" key={f.key}>
                      <label htmlFor={ID_CAMPO[f.key]}>{f.label}</label>
                      <input
                        id={ID_CAMPO[f.key]}
                        type="number"
                        step="0.01"
                        min="0"
                        value={form[f.key]}
                        onChange={(e) => campo(f.key, e.target.value)}
                        required={f.req}
                        aria-invalid={errores[f.key] ? true : undefined}
                        aria-describedby={errores[f.key] ? `${ID_CAMPO[f.key]}-error` : undefined}
                      />
                      {errores[f.key] && (
                        <p className="field-error" id={`${ID_CAMPO[f.key]}-error`} role="alert">
                          {errores[f.key]}
                        </p>
                      )}
                    </div>
                  ))}

                  {saveMsg && (
                    <p
                      className={saveOk ? "hint" : "form-error"}
                      role={saveOk ? "status" : "alert"}
                      aria-live={saveOk ? "polite" : "assertive"}
                    >
                      {saveMsg}
                    </p>
                  )}

                  <button type="submit" className="btn-gold" disabled={saving}>
                    {saving ? "Guardando…" : "Guardar"}
                  </button>
                </form>

                <div className="card table-card">
                  <div
                    className="table-wrap"
                    role="region"
                    tabIndex={0}
                    aria-label="Valores de referencia por comuna y sector"
                  >
                    <table className="data-table">
                      <caption className="sr-only">Valores de referencia por comuna</caption>
                      <thead>
                        <tr>
                          <th scope="col">Comuna / sector</th>
                          <th scope="col">Tipo</th>
                          <th scope="col">Prom. UF/m²</th>
                          <th scope="col">Año</th>
                          <th scope="col">
                            <span className="sr-only">Acciones</span>
                          </th>
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
            </div>
          )}

          {!loading && tab === "publicaciones" && (
            <div role="tabpanel" id="panel-publicaciones" aria-labelledby="tab-publicaciones">
              <div className="card table-card">
                <div
                  className="table-wrap"
                  role="region"
                  tabIndex={0}
                  aria-label="Publicaciones enviadas por anunciantes"
                >
                  <table className="data-table">
                    <caption className="sr-only">Publicaciones enviadas por anunciantes</caption>
                    <thead>
                      <tr>
                        <th scope="col">Publicación</th>
                        <th scope="col">Ubicación</th>
                        <th scope="col">Precio UF</th>
                        <th scope="col">Contacto</th>
                        <th scope="col">Estado</th>
                        <th scope="col">
                          <span className="sr-only">Acciones</span>
                        </th>
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
            </div>
          )}

          {!loading && tab === "solicitudes" && (
            <div role="tabpanel" id="panel-solicitudes" aria-labelledby="tab-solicitudes">
              <div className="card table-card">
                <div
                  className="table-wrap"
                  role="region"
                  tabIndex={0}
                  aria-label="Solicitudes de estimación recibidas"
                >
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
                            <span
                              className={t.paymentStatus === "paid" ? "badge badge-ok" : "badge badge-warn"}
                            >
                              {t.paymentStatus === "paid" ? "Pagado" : "Pendiente"}
                            </span>
                            <div className="small muted">
                              {t.estimatedValueCLP > 0 && t.estimatedValueUF > 0
                                ? `${fmtCLP(t.estimatedValueCLP)} · UF $${fmtUF2(
                                    Math.round((t.estimatedValueCLP / t.estimatedValueUF) * 100) / 100
                                  )} del ${fmtFecha(t.createdAt)}`
                                : "Sin conversión a pesos"}
                            </div>
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
            </div>
          )}
        </div>
      </section>
    </>
  );
}
