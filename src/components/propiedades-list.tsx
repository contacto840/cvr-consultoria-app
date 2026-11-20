"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Listing {
  id: string;
  title: string;
  propertyType: string;
  transactionType: string;
  comuna: string;
  sector: string;
  surface: number;
  terrainSurface: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  priceUF: number;
  priceNegotiable: boolean;
  status: string;
  description: string;
  createdAt: string;
}

const TIPO: Record<string, string> = {
  casa: "Casa",
  departamento: "Departamento",
  terreno: "Terreno",
  agricola: "Predio agrícola",
};

const ESTADO: Record<string, string> = {
  disponible: "Disponible",
  reservado: "Reservado",
  vendido: "Vendido",
};

const COMUNAS = [
  "Bulnes", "Chillán", "Chillán Viejo", "Cobquecura", "Coelemu",
  "Coihueco", "El Carmen", "Ninhue", "Ñiquén", "Pemuco",
  "Pinto", "Portezuelo", "Quillón", "Quirihue", "Ránquil",
  "San Carlos", "San Fabián", "San Ignacio", "San Nicolás",
  "Santa Bárbara", "Tucapel", "Yungay",
];

const queryKey = (page: number, tipo: string, transaccion: string, comuna: string, refresh: number) =>
  `${page}|${tipo}|${transaccion}|${comuna}|${refresh}`;

export default function PropiedadesList() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [refreshToken, setRefreshToken] = useState(0);

  const [tipo, setTipo] = useState("");
  const [transaccion, setTransaccion] = useState("");
  const [comuna, setComuna] = useState("");

  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const loading = loadedKey !== queryKey(page, tipo, transaccion, comuna, refreshToken);

  useEffect(() => {
    let cancelado = false;
    const key = queryKey(page, tipo, transaccion, comuna, refreshToken);
    const params = new URLSearchParams({ page: String(page) });
    if (tipo) params.set("tipo", tipo);
    if (transaccion) params.set("transaccion", transaccion);
    if (comuna) params.set("comuna", comuna);

    fetch(`/api/propiedades?${params}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelado) return;
        if (data) {
          setListings(data.listings as Listing[]);
          setTotal(data.total as number);
          setPages(data.pages as number);
        }
        setLoadedKey(key);
      })
      .catch(() => {
        if (!cancelado) setLoadedKey(key);
      });

    return () => {
      cancelado = true;
    };
  }, [page, tipo, transaccion, comuna, refreshToken]);

  const cambiar = (setter: (v: string) => void) => (v: string) => {
    setter(v);
    setPage(1);
  };

  return (
    <>
      <form
        className="card filters"
        onSubmit={(e) => {
          e.preventDefault();
          setPage(1);
          setRefreshToken((t) => t + 1);
        }}
      >
        <div className="field-grid three">
          <div className="field">
            <label htmlFor="f-operacion">Operación</label>
            <select
              id="f-operacion"
              value={transaccion}
              onChange={(e) => cambiar(setTransaccion)(e.target.value)}
            >
              <option value="">Venta y arriendo</option>
              <option value="venta">Venta</option>
              <option value="arriendo">Arriendo</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="f-tipo">Tipo de propiedad</label>
            <select id="f-tipo" value={tipo} onChange={(e) => cambiar(setTipo)(e.target.value)}>
              <option value="">Todos</option>
              {Object.entries(TIPO).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="f-comuna">Comuna</label>
            <select id="f-comuna" value={comuna} onChange={(e) => cambiar(setComuna)(e.target.value)}>
              <option value="">Todas</option>
              {COMUNAS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="inline-actions">
          <button type="submit" className="btn-gold">
            Buscar
          </button>
          {(tipo || transaccion || comuna) && (
            <button
              type="button"
              className="btn-outline"
              onClick={() => {
                setTipo("");
                setTransaccion("");
                setComuna("");
                setPage(1);
              }}
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </form>

      <p className="muted small" role="status">
        {loading ? "Buscando propiedades…" : `${total} ${total === 1 ? "propiedad" : "propiedades"} en el portal`}
      </p>

      {!loading && listings.length === 0 && (
        <div className="card empty">
          <h2 className="h3">Todavía no hay propiedades con esos filtros</h2>
          <p>
            Puedes publicar la tuya para que la revise el equipo, o escribirnos y te
            avisamos cuando aparezca algo que calce.
          </p>
          <div className="inline-actions">
            <Link href="/propiedades/agregar" className="btn-gold">
              Publicar mi propiedad
            </Link>
            <Link href="/#contacto" className="btn-outline">
              Avisarme
            </Link>
          </div>
        </div>
      )}

      <ul className="listing-grid">
        {listings.map((l) => (
          <li key={l.id} className="card listing-card">
            <div className="listing-top">
              <span className="tag">
                {TIPO[l.propertyType] ?? l.propertyType} ·{" "}
                {l.transactionType === "arriendo" ? "Arriendo" : "Venta"}
              </span>
              <span className={`status status-${l.status}`}>{ESTADO[l.status] ?? l.status}</span>
            </div>
            <h2 className="listing-title">
              <Link href={`/propiedades/${l.id}`}>{l.title}</Link>
            </h2>
            <p className="muted small">
              {[l.sector, l.comuna].filter(Boolean).join(", ")}
            </p>
            {l.description && <p className="listing-desc">{l.description}</p>}
            <dl className="listing-facts">
              <div>
                <dt>Superficie</dt>
                <dd>{l.surface} m²</dd>
              </div>
              {l.terrainSurface ? (
                <div>
                  <dt>Terreno</dt>
                  <dd>{l.terrainSurface} m²</dd>
                </div>
              ) : null}
              {l.bedrooms ? (
                <div>
                  <dt>Dormitorios</dt>
                  <dd>{l.bedrooms}</dd>
                </div>
              ) : null}
              {l.bathrooms ? (
                <div>
                  <dt>Baños</dt>
                  <dd>{l.bathrooms}</dd>
                </div>
              ) : null}
            </dl>
            <p className="price">
              {l.priceUF.toLocaleString("es-CL", { maximumFractionDigits: 2 })} UF
              {l.priceNegotiable && <span className="muted small"> · negociable</span>}
            </p>
            <Link href={`/propiedades/${l.id}`} className="link-arrow">
              Ver ficha y consultar <span aria-hidden="true">→</span>
            </Link>
          </li>
        ))}
      </ul>

      {pages > 1 && (
        <nav className="pager" aria-label="Paginación de propiedades">
          <button
            type="button"
            className="btn-outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            ← Anterior
          </button>
          <span className="muted small">
            Página {page} de {pages}
          </span>
          <button
            type="button"
            className="btn-outline"
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={page === pages}
          >
            Siguiente →
          </button>
        </nav>
      )}
    </>
  );
}
