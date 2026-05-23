"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const PHONE = "56938689157";

const PROPERTY_LABELS: Record<string, string> = {
  casa: "Casa",
  departamento: "Depto.",
  terreno: "Terreno",
  agricola: "Agrícola",
};

const TYPE_ICONS: Record<string, string> = {
  casa: "🏡",
  departamento: "🏢",
  terreno: "📐",
  agricola: "🌾",
};

const STATUS_COLORS: Record<string, string> = {
  disponible: "#22c55e",
  reservado: "#f59e0b",
  vendido: "#6b7280",
};

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
  contactPhone: string;
  description: string;
  createdAt: string;
}

const fmtUF = (n: number) => n.toLocaleString("es-CL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtCLP = (n: number) => (n * 38500).toLocaleString("es-CL", { maximumFractionDigits: 0 });

export default function PropiedadesPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  // Filters
  const [filterTipo, setFilterTipo] = useState("");
  const [filterTransaccion, setFilterTransaccion] = useState("");
  const [filterComuna, setFilterComuna] = useState("");

  const fetchListings = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (filterTipo) params.set("tipo", filterTipo);
    if (filterTransaccion) params.set("transaccion", filterTransaccion);
    if (filterComuna) params.set("comuna", filterComuna);

    const res = await fetch(`/api/propiedades?${params}`);
    if (res.ok) {
      const data = await res.json();
      setListings(data.listings);
      setTotal(data.total);
      setPages(data.pages);
    }
    setLoading(false);
  }, [page, filterTipo, filterTransaccion, filterComuna]);

  useEffect(() => { fetchListings(); }, [fetchListings]);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [filterTipo, filterTransaccion, filterComuna]);

  const applyFilter = () => { setPage(1); fetchListings(); };

  return (
    <div style={{ minHeight: "100vh", background: "#050c17", color: "#fff", fontFamily: "Inter, sans-serif" }}>
      {/* ── NAVBAR ─────────────────────────────────────────── */}
      <nav style={{ background: "rgba(5,12,23,0.97)", borderBottom: "1px solid rgba(197,168,91,0.2)", position: "sticky", top: 0, zIndex: 100, padding: "0 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontWeight: 900, fontSize: 22, color: "#fff" }}>CVR</span>
            <span style={{ fontSize: 11, color: "#8fa3bc", lineHeight: 1.3 }}>Consultoría<br />Predial</span>
          </Link>
          <div className="desktop-nav" style={{ display: "flex", gap: 28, alignItems: "center" }}>
            <Link href="/" style={{ color: "#8fa3bc", textDecoration: "none", fontSize: 14 }}>Inicio</Link>
            <Link href="/tasacion" style={{ color: "#8fa3bc", textDecoration: "none", fontSize: 14 }}>Tasación</Link>
            <Link href="/propiedades" style={{ color: "#c5a85b", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>Propiedades</Link>
            <Link href="/corredores" style={{ color: "#8fa3bc", textDecoration: "none", fontSize: 14 }}>Corredores</Link>
            <Link href="/propiedades/agregar" style={{ background: "#c5a85b", color: "#050c17", padding: "8px 18px", borderRadius: 6, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
              + Publicar
            </Link>
          </div>
          <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)} style={{ display: "none", background: "none", border: "none", color: "#c5a85b", fontSize: 24, cursor: "pointer" }}>☰</button>
        </div>
        {menuOpen && (
          <div className="mobile-menu" style={{ padding: "16px 24px 20px", borderTop: "1px solid rgba(197,168,91,0.15)", display: "flex", flexDirection: "column", gap: 14 }}>
            <Link href="/" style={{ color: "#8fa3bc", textDecoration: "none" }}>Inicio</Link>
            <Link href="/tasacion" style={{ color: "#8fa3bc", textDecoration: "none" }}>Tasación</Link>
            <Link href="/propiedades" style={{ color: "#c5a85b", fontWeight: 600, textDecoration: "none" }}>Propiedades</Link>
            <Link href="/corredores" style={{ color: "#8fa3bc", textDecoration: "none" }}>Corredores</Link>
            <Link href="/propiedades/agregar" style={{ color: "#c5a85b", fontWeight: 700, textDecoration: "none" }}>+ Publicar propiedad</Link>
          </div>
        )}
      </nav>

      {/* ── HERO ────────────────────────────────────────────── */}
      <div style={{ background: "linear-gradient(135deg, #0d1624 0%, #050c17 100%)", padding: "48px 24px 36px", borderBottom: "1px solid rgba(197,168,91,0.15)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
            <div>
              <div style={{ fontSize: 11, color: "#c5a85b", letterSpacing: 2, fontWeight: 700, marginBottom: 10, textTransform: "uppercase" }}>
                Región de Ñuble · Chile
              </div>
              <h1 style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 900, margin: "0 0 10px", color: "#fff" }}>
                Propiedades en Venta y Arriendo
              </h1>
              <p style={{ color: "#8fa3bc", margin: 0, fontSize: 15 }}>
                {total > 0 ? `${total} propiedades disponibles` : "Publicaciones directas — sin intermediarios"}
              </p>
            </div>
            <Link href="/propiedades/agregar" style={{
              background: "linear-gradient(135deg, #c5a85b, #a8893d)",
              color: "#050c17", padding: "14px 28px", borderRadius: 8,
              fontWeight: 800, fontSize: 15, textDecoration: "none",
              display: "inline-block", whiteSpace: "nowrap",
            }}>
              + Publicar mi propiedad
            </Link>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        {/* ── FILTERS ────────────────────────────────────────── */}
        <div style={{
          background: "rgba(13,22,36,0.8)", border: "1px solid rgba(197,168,91,0.2)",
          borderRadius: 10, padding: "20px 24px", marginBottom: 32,
          display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-end",
        }}>
          <div style={{ flex: "1 1 160px" }}>
            <label style={{ display: "block", fontSize: 11, color: "#8fa3bc", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>
              Tipo de propiedad
            </label>
            <select value={filterTipo} onChange={e => setFilterTipo(e.target.value)} style={selectStyle}>
              <option value="">Todos</option>
              <option value="casa">Casa</option>
              <option value="departamento">Departamento</option>
              <option value="terreno">Terreno</option>
              <option value="agricola">Agrícola</option>
            </select>
          </div>
          <div style={{ flex: "1 1 160px" }}>
            <label style={{ display: "block", fontSize: 11, color: "#8fa3bc", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>
              Operación
            </label>
            <select value={filterTransaccion} onChange={e => setFilterTransaccion(e.target.value)} style={selectStyle}>
              <option value="">Todas</option>
              <option value="venta">Venta</option>
              <option value="arriendo">Arriendo</option>
            </select>
          </div>
          <div style={{ flex: "1 1 200px" }}>
            <label style={{ display: "block", fontSize: 11, color: "#8fa3bc", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>
              Comuna
            </label>
            <input
              type="text"
              placeholder="Ej: Chillán, San Carlos..."
              value={filterComuna}
              onChange={e => setFilterComuna(e.target.value)}
              style={{ ...selectStyle, fontFamily: "Inter, sans-serif" }}
            />
          </div>
          <button onClick={applyFilter} style={{
            background: "#c5a85b", color: "#050c17", border: "none",
            padding: "11px 24px", borderRadius: 6, fontWeight: 700, fontSize: 14,
            cursor: "pointer", whiteSpace: "nowrap",
          }}>
            Buscar
          </button>
          {(filterTipo || filterTransaccion || filterComuna) && (
            <button onClick={() => { setFilterTipo(""); setFilterTransaccion(""); setFilterComuna(""); }} style={{
              background: "transparent", color: "#8fa3bc", border: "1px solid rgba(143,163,188,0.3)",
              padding: "11px 16px", borderRadius: 6, fontSize: 13, cursor: "pointer",
            }}>
              Limpiar
            </button>
          )}
        </div>

        {/* ── GRID ────────────────────────────────────────────── */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#8fa3bc" }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>⏳</div>
            <p>Cargando propiedades...</p>
          </div>
        ) : listings.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 24px" }}>
            <div style={{ fontSize: 56, marginBottom: 20 }}>🏠</div>
            <h2 style={{ color: "#fff", fontWeight: 800, marginBottom: 12 }}>No hay publicaciones aún</h2>
            <p style={{ color: "#8fa3bc", marginBottom: 28, maxWidth: 400, margin: "0 auto 28px" }}>
              Sé el primero en publicar una propiedad en la Región de Ñuble. Es gratis y llega directamente a compradores locales.
            </p>
            <Link href="/propiedades/agregar" style={{
              background: "#c5a85b", color: "#050c17", padding: "14px 32px",
              borderRadius: 8, fontWeight: 800, textDecoration: "none", fontSize: 15,
            }}>
              Publicar propiedad gratis
            </Link>
          </div>
        ) : (
          <>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: 24, marginBottom: 40,
            }}>
              {listings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>

            {/* PAGINATION */}
            {pages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={pageBtnStyle(page === 1)}>← Anterior</button>
                {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)} style={pageBtnStyle(false, p === page)}>
                    {p}
                  </button>
                ))}
                <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} style={pageBtnStyle(page === pages)}>Siguiente →</button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer style={{ background: "#050c17", borderTop: "1px solid rgba(197,168,91,0.15)", padding: "32px 24px", textAlign: "center", color: "#8fa3bc", fontSize: 13 }}>
        <p style={{ margin: "0 0 8px", fontWeight: 700, color: "#fff" }}>CVR Consultoría Predial</p>
        <p style={{ margin: 0 }}>Chillán, Región de Ñuble · contacto@cvrpropiedades.com · +56 9 3868 9157</p>
      </footer>

      {/* ── WHATSAPP FLOAT ─────────────────────────────────────── */}
      <a href={`https://wa.me/${PHONE}?text=Hola, vi las propiedades en cvrpropiedades.com`} target="_blank" rel="noopener noreferrer"
        style={{ position: "fixed", bottom: 24, right: 24, background: "#25d366", borderRadius: "50%", width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, boxShadow: "0 4px 20px rgba(37,211,102,0.4)", textDecoration: "none", zIndex: 200 }}>
        💬
      </a>
    </div>
  );
}

function ListingCard({ listing }: { listing: Listing }) {
  const locationStr = [listing.sector, listing.comuna].filter(Boolean).join(", ");

  return (
    <div style={{
      background: "rgba(13,22,36,0.9)",
      border: "1px solid rgba(197,168,91,0.2)",
      borderRadius: 12, overflow: "hidden",
      transition: "border-color 0.2s, transform 0.2s",
      cursor: "default",
    }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(197,168,91,0.5)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(197,168,91,0.2)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
      }}
    >
      {/* Card header */}
      <div style={{ background: "rgba(5,12,23,0.8)", padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>{TYPE_ICONS[listing.propertyType] ?? "🏠"}</span>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#c5a85b", textTransform: "uppercase" }}>
              {PROPERTY_LABELS[listing.propertyType]} · {listing.transactionType === "arriendo" ? "Arriendo" : "Venta"}
            </div>
            <div style={{ fontSize: 11, color: "#8fa3bc" }}>{locationStr || listing.comuna}</div>
          </div>
        </div>
        <div style={{
          background: STATUS_COLORS[listing.status] + "22",
          color: STATUS_COLORS[listing.status],
          border: `1px solid ${STATUS_COLORS[listing.status]}44`,
          borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 600,
        }}>
          {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: "18px" }}>
        <h3 style={{ margin: "0 0 10px", fontSize: 16, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>
          {listing.title}
        </h3>
        {listing.description && (
          <p style={{ color: "#8fa3bc", fontSize: 13, margin: "0 0 14px", lineHeight: 1.5 }}>
            {listing.description.length > 100 ? listing.description.slice(0, 100) + "…" : listing.description}
          </p>
        )}

        {/* Stats */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
          <Stat label="Superficie" value={`${listing.surface} m²`} />
          {listing.terrainSurface && <Stat label="Terreno" value={`${listing.terrainSurface} m²`} />}
          {listing.bedrooms && <Stat label="Dorm." value={String(listing.bedrooms)} />}
          {listing.bathrooms && <Stat label="Baños" value={String(listing.bathrooms)} />}
        </div>

        {/* Price */}
        <div style={{ background: "rgba(197,168,91,0.08)", border: "1px solid rgba(197,168,91,0.2)", borderRadius: 8, padding: "12px 16px", marginBottom: 16 }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#c5a85b" }}>
            {listing.priceUF.toLocaleString("es-CL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} UF
          </div>
          <div style={{ fontSize: 12, color: "#8fa3bc" }}>
            $ {fmtCLP(listing.priceUF)} CLP aprox.
            {listing.priceNegotiable && " · Precio negociable"}
          </div>
        </div>

        {/* CTA */}
        <a
          href={`https://wa.me/${listing.contactPhone.replace(/\D/g, "")}?text=Hola, me interesa la propiedad: ${encodeURIComponent(listing.title)} en ${listing.comuna}`}
          target="_blank" rel="noopener noreferrer"
          style={{
            display: "block", textAlign: "center",
            background: "#25d366", color: "#fff",
            padding: "11px 0", borderRadius: 8,
            fontWeight: 700, fontSize: 14, textDecoration: "none",
          }}
        >
          💬 Consultar por WhatsApp
        </a>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{value}</div>
      <div style={{ fontSize: 10, color: "#8fa3bc", textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
    </div>
  );
}

const selectStyle: React.CSSProperties = {
  background: "rgba(5,12,23,0.8)",
  border: "1px solid rgba(143,163,188,0.25)",
  borderRadius: 6,
  color: "#fff",
  padding: "10px 14px",
  fontSize: 14,
  width: "100%",
  outline: "none",
};

function pageBtnStyle(disabled: boolean, active = false): React.CSSProperties {
  return {
    padding: "8px 14px", borderRadius: 6, fontSize: 14, cursor: disabled ? "default" : "pointer",
    border: active ? "1px solid #c5a85b" : "1px solid rgba(143,163,188,0.25)",
    background: active ? "rgba(197,168,91,0.15)" : "rgba(13,22,36,0.8)",
    color: disabled ? "#4a5568" : active ? "#c5a85b" : "#8fa3bc",
    fontWeight: active ? 700 : 400,
  };
}
