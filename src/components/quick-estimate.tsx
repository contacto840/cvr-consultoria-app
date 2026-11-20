"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";

const COMUNAS = [
  "Bulnes", "Chillán", "Chillán Viejo", "Cobquecura", "Coelemu",
  "Coihueco", "El Carmen", "Ninhue", "Ñiquén", "Pemuco",
  "Pinto", "Portezuelo", "Quillón", "Quirihue", "Ránquil",
  "San Carlos", "San Fabián", "San Ignacio", "San Nicolás",
  "Santa Bárbara", "Tucapel", "Yungay",
];

const TIPOS = [
  { value: "casa", label: "Casa" },
  { value: "departamento", label: "Departamento" },
  { value: "terreno", label: "Terreno" },
  { value: "agricola", label: "Predio agrícola" },
];

export default function QuickEstimate() {
  const router = useRouter();
  const [tipo, setTipo] = useState("casa");
  const [comuna, setComuna] = useState("Chillán");
  const [superficie, setSuperficie] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const valor = Number(superficie);
    if (!Number.isFinite(valor) || valor <= 0) return;
    const params = new URLSearchParams({ tipo, comuna, superficie });
    router.push(`/tasacion?${params.toString()}`);
  }

  return (
    <form className="card quick-card" onSubmit={onSubmit}>
      <h2 className="h3">Estimación referencial en un minuto</h2>
      <p className="muted small">
        Orientación de precio para decidir si conviene vender o comprar. No es una
        tasación y no reemplaza un informe firmado.
      </p>
      <div className="field-grid three">
        <div className="field">
          <label htmlFor="q-tipo">Tipo de propiedad</label>
          <select id="q-tipo" value={tipo} onChange={(e) => setTipo(e.target.value)}>
            {TIPOS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="q-comuna">Comuna</label>
          <select id="q-comuna" value={comuna} onChange={(e) => setComuna(e.target.value)}>
            {COMUNAS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="q-sup">
            Superficie ({tipo === "agricola" ? "hectáreas" : "m²"})
          </label>
          <input
            id="q-sup"
            type="number"
            min={1}
            step="0.1"
            inputMode="decimal"
            value={superficie}
            onChange={(e) => setSuperficie(e.target.value)}
            required
            placeholder={tipo === "agricola" ? "Ej: 5,5" : "Ej: 85"}
          />
        </div>
      </div>
      <button type="submit" className="btn-gold">
        Estimar valor
      </button>
    </form>
  );
}
