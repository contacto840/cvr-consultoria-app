"use client";

import { useMemo, useState } from "react";
import {
  calcularCostos,
  COMISION_SUGERIDA,
  FECHA_REVISION,
  fmtCLP,
  IVA,
} from "@/lib/costos-compra";

const fmtInput = (v: string) => v;

export default function CostosCalculator() {
  const [precio, setPrecio] = useState("120000000");
  const [conCredito, setConCredito] = useState(true);
  const [pie, setPie] = useState("20");
  const [plazo, setPlazo] = useState("20");
  const [comision, setComision] = useState(String(COMISION_SUGERIDA));

  const precioNum = Number(precio.replace(/\D/g, "")) || 0;

  const resultado = useMemo(
    () =>
      calcularCostos({
        precioCLP: precioNum,
        conCredito,
        piePct: Number(pie) || 0,
        plazoAnios: Number(plazo) || 0,
        comisionPct: Number(comision) || 0,
      }),
    [precioNum, conCredito, pie, plazo, comision]
  );

  // El porcentaje se mide sobre los costos adicionales, no sobre el total con
  // el precio dentro: "100,2% del precio" no le dice nada a quien compra.
  const sobrePrecio =
    precioNum > 0 ? (resultado.totalAdicionalesCLP / precioNum) * 100 : 0;
  const fmtPct = (n: number) =>
    `${n.toLocaleString("es-CL", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;

  return (
    <div className="calc">
      <div className="card calc-form">
        <h2 className="h3">Datos de la operación</h2>
        <div className="field">
          <label htmlFor="c-precio">Precio de la propiedad (CLP)</label>
          <input
            id="c-precio"
            type="text"
            inputMode="numeric"
            value={precio}
            onChange={(e) => setPrecio(fmtInput(e.target.value))}
            aria-describedby="c-precio-ayuda"
          />
          <p id="c-precio-ayuda" className="hint">
            {fmtCLP(precioNum)}. Escribe el monto en pesos, sin puntos.
          </p>
        </div>

        <div className="check-row">
          <input
            id="c-credito"
            type="checkbox"
            checked={conCredito}
            onChange={(e) => setConCredito(e.target.checked)}
          />
          <label htmlFor="c-credito">La compra lleva crédito hipotecario</label>
        </div>

        {conCredito && (
          <>
            <div className="field">
              <label htmlFor="c-pie">Pie pagado al contado (%)</label>
              <input
                id="c-pie"
                type="number"
                min={0}
                max={100}
                step={1}
                value={pie}
                onChange={(e) => setPie(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="c-plazo">Plazo del crédito (años)</label>
              <input
                id="c-plazo"
                type="number"
                min={1}
                max={40}
                step={1}
                value={plazo}
                onChange={(e) => setPlazo(e.target.value)}
              />
            </div>
          </>
        )}

        <div className="field">
          <label htmlFor="c-comision">Comisión de corretaje (% del precio)</label>
          <input
            id="c-comision"
            type="number"
            min={0}
            max={10}
            step={0.1}
            value={comision}
            onChange={(e) => setComision(e.target.value)}
            aria-describedby="c-comision-ayuda"
          />
          <p id="c-comision-ayuda" className="hint">
            No existe una tasa legal: es la que se pacta en el contrato de corretaje. Se le
            suma IVA {Math.round(IVA * 100)}%.
          </p>
        </div>

        <p className="hint">
          Fórmulas y tasas revisadas en {FECHA_REVISION}. Puedes editar los valores y el
          desglose se recalcula al instante.
        </p>
      </div>

      <div className="card calc-result">
        <h2 className="h3">Desglose</h2>
        <p className="muted small">
          Los ítems «a cotizar» dependen de un tercero, no tienen cifra y no se suman.
          Los marcados «por confirmar» sí suman, pero su tasa la confirma el banco o el
          contador. El precio de la propiedad se muestra aparte de los costos.{" "}
          {resultado.pendientes > 0
            ? `Hoy quedan ${resultado.pendientes} ítems a cotizar, así que los costos adicionales reales serán mayores que la cifra de abajo.`
            : ""}
        </p>

        <div className="table-wrap" role="region" aria-label="Desglose de costos" tabIndex={0}>
          <table className="cost-table">
            <caption className="sr-only">
              Desglose de costos de compra, con fuente y fecha de cada dato
            </caption>
          <thead>
            <tr>
              <th scope="col">Ítem</th>
              <th scope="col">Criterio</th>
              <th scope="col">Monto</th>
            </tr>
          </thead>
          <tbody>
            {resultado.lineas.map(({ item, montoCLP, detalle }) => (
              <tr key={item.id}>
                <th scope="row">
                  {item.nombre}
                  <span
                    className={`badge ${item.estado === "confirmado" ? "badge-ok" : "badge-warn"}`}
                  >
                    {item.estado === "confirmado"
                      ? "Dato propio"
                      : item.estado === "estimado"
                        ? "Por confirmar"
                        : "A cotizar"}
                  </span>
                  <span className="source">
                    {item.fuente} · {item.fechaDato}
                    {item.nota ? ` · ${item.nota}` : ""}
                  </span>
                </th>
                <td>
                  {item.formula}
                  <span className="source">{detalle}</span>
                </td>
                <td className="amount">
                  {montoCLP === null ? "—" : fmtCLP(montoCLP)}
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>

        <div className="calc-total" aria-live="polite">
          <div>
            <span className="muted small">Costos adicionales cuantificados</span>
            <strong>{fmtCLP(resultado.totalAdicionalesCLP)}</strong>
          </div>
          <div>
            <span className="muted small">Sobre el precio</span>
            <strong>{fmtPct(sobrePrecio)}</strong>
          </div>
          <div>
            <span className="muted small">Precio más esos costos</span>
            <strong>{fmtCLP(resultado.totalCLP)}</strong>
          </div>
          {conCredito && (
            <div>
              <span className="muted small">Monto del crédito</span>
              <strong>{fmtCLP(resultado.montoCreditoCLP)}</strong>
            </div>
          )}
        </div>

        <p className="disclaimer">
          Orientación referencial para presupuestar. No constituye una cotización, una
          tasación ni asesoría legal o financiera. Los valores de notaría, Conservador y
          certificados dependen de cada prestador y deben confirmarse antes de firmar. Este
          cálculo no reemplaza un informe profesional firmado.
        </p>
      </div>
    </div>
  );
}
