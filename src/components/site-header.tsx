"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";

const LINKS = [
  { href: "/propiedades", label: "Propiedades" },
  { href: "/servicios/venta", label: "Vender" },
  { href: "/servicios/arriendo", label: "Arrendar" },
  { href: "/servicios/asesoria-de-compra", label: "Comprar" },
  { href: "/herramientas/diagnostico-predio", label: "Diagnóstico" },
  { href: "/honorarios", label: "Honorarios" },
  { href: "/corredores", label: "Corredores" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="site-header">
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <div className="site-header-inner">
        <Link href="/" className="brand" aria-label={`${SITE.name} — inicio`}>
          <span className="brand-cvr">CVR</span>
          <span className="brand-sub">Propiedades</span>
        </Link>

        <nav className="site-nav" aria-label="Navegación principal">
          <ul>
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={pathname === l.href ? "nav-link is-active" : "nav-link"}
                  aria-current={pathname === l.href ? "page" : undefined}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header-actions">
          <Link href="/tasacion" className="btn-gold nav-cta">
            Estimar valor
          </Link>
          <button
            type="button"
            className={`nav-toggle${open ? " is-open" : ""}`}
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </div>

      <div id="menu-movil" className={`mobile-menu${open ? " is-open" : ""}`} hidden={!open}>
        <ul>
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <a href={SITE.tasacionesUrl} rel="noopener" onClick={() => setOpen(false)}>
              Tasaciones y peritajes ↗
            </a>
          </li>
          <li>
            <Link href="/tasacion" className="btn-gold mobile-cta" onClick={() => setOpen(false)}>
              Estimar valor
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
