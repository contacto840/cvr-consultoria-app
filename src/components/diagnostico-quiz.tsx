"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { SITE } from "@/lib/site";
import {
  ETIQUETA_SEMAFORO,
  PREGUNTAS,
  evaluar,
  type Respuesta,
  type Semaforo,
} from "@/lib/diagnostico";

const STORAGE_KEY = "cvr-diagnostico-v1";

interface Estado {
  respuestas: Record<string, Respuesta>;
  paso: number;
  terminado: boolean;
}

/** Lee el avance guardado. En el servidor no hay almacenamiento. */
function leerEstado(): Estado {
  const vacio: Estado = { respuestas: {}, paso: 0, terminado: false };
  if (typeof window === "undefined") return vacio;
  try {
    const crudo = sessionStorage.getItem(STORAGE_KEY);
    if (!crudo) return vacio;
    const data = JSON.parse(crudo) as Partial<Estado>;
    return {
      respuestas: data.respuestas ?? {},
      paso:
        typeof data.paso === "number" && data.paso >= 0 && data.paso < PREGUNTAS.length
          ? data.paso
          : 0,
      terminado: data.terminado === true,
    };
  } catch {
    return vacio;
  }
}

const OPCIONES: { value: Respuesta; label: string }[] = [
  { value: "si", label: "Sí" },
  { value: "no", label: "No" },
  { value: "nose", label: "No sé" },
];

export default function DiagnosticoQuiz() {
  // El cuestionario se renderiza en el servidor como esqueleto y se hidrata con
  // el avance guardado. `useSyncExternalStore` evita el setState dentro de un
  // efecto y mantiene el HTML del servidor igual al primer render del cliente.
  const montado = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const [estado, setEstado] = useState<Estado>(leerEstado);
  const { respuestas, paso, terminado } = estado;

  // Persistencia sin setState: solo escribe en el almacenamiento del navegador.
  useEffect(() => {
    if (!montado) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
    } catch {
      // sessionStorage no disponible: se sigue sin persistencia.
    }
  }, [estado, montado]);

  const pregunta = PREGUNTAS[paso];
  const respondidas = Object.keys(respuestas).length;
  const resultado = useMemo(() => evaluar(respuestas), [respuestas]);
  const alertas = resultado.filter((r) => r.semaforo === "rojo");

  function responder(valor: Respuesta) {
    setEstado((prev) => ({
      ...prev,
      respuestas: { ...prev.respuestas, [pregunta.id]: valor },
    }));
  }

  function irA(nuevo: number) {
    setEstado((prev) => ({ ...prev, paso: nuevo }));
  }

  function reiniciar() {
    setEstado({ respuestas: {}, paso: 0, terminado: false });
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // sin persistencia
    }
  }

  if (!montado) {
    return (
      <div className="card">
        <p>Cargando el cuestionario…</p>
      </div>
    );
  }

  if (terminado) {
    return (
      <div className="diagnostico-resultado">
        <div className="card">
          <h2 className="h3">Resultado por área</h2>
          <p className="muted small">
            El semáforo resume tus respuestas, no el estado legal del predio. Tres áreas
            pueden estar en verde y aun así faltar un documento: por eso la recomendación
            es revisar antes de firmar.
          </p>

          <ul className="semaforo-list">
            {resultado.map(({ area, semaforo, senales }) => (
              <li key={area.id} className={`semaforo semaforo-${semaforo}`}>
                <div className="semaforo-head">
                  <span className={`dot dot-${semaforo}`} aria-hidden="true" />
                  <h3>{area.nombre}</h3>
                  <span className="semaforo-label">{ETIQUETA_SEMAFORO[semaforo]}</span>
                </div>
                <p>{area.explicacion}</p>
                {senales.length > 0 && (
                  <p className="small">
                    <strong>Señal declarada:</strong>{" "}
                    {senales.map((s) => s.texto.replace(/\?$/, "")).join("; ")}.
                  </p>
                )}
                <a className="link-arrow" href={area.informe.url} rel="noopener">
                  {textoInforme(area.informe.titulo, semaforo)} <span aria-hidden="true">→</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h2 className="h3">Qué hacer ahora</h2>
          <p>
            {alertas.length > 0
              ? `Hay ${alertas.length} ${alertas.length === 1 ? "área con señales de alerta" : "áreas con señales de alerta"}. Antes de ofertar conviene revisar esos puntos con documentos en mano.`
              : "No declaraste señales de alerta. Aun así, la revisión documental se hace igual: las respuestas dependen de lo que sabes hoy, no de lo que dice el Conservador."}
          </p>
          <ol className="steps-list">
            <li>Pide el certificado de dominio vigente y el de gravámenes.</li>
            <li>Revisa que la construcción coincida con lo inscrito.</li>
            <li>
              Si el predio es rural, verifica los derechos de agua en el título y en el
              Registro de Aguas.
            </li>
            <li>No firmes promesa sin haber leído el borrador completo.</li>
          </ol>
          <p className="disclaimer">
            Este diagnóstico entrega señales de alerta y recomendaciones de revisión. No es
            un informe legal, no determina la validez de un título y no reemplaza la
            revisión de un profesional con los documentos a la vista.
          </p>
          <div className="inline-actions">
            <button type="button" className="btn-outline" onClick={reiniciar}>
              Empezar de nuevo
            </button>
            <a
              className="btn-gold"
              href={SITE.tasaciones.estudioTitulos}
              rel="noopener"
            >
              Pedir estudio de títulos ↗
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card quiz">
      <div className="quiz-progress">
        <span className="muted small">
          Pregunta {paso + 1} de {PREGUNTAS.length} · {respondidas} respondidas
        </span>
        <div
          className="progress-bar"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={PREGUNTAS.length}
          aria-valuenow={paso + 1}
          aria-label="Avance del cuestionario"
        >
          <span style={{ width: `${((paso + 1) / PREGUNTAS.length) * 100}%` }} />
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (paso < PREGUNTAS.length - 1) irA(paso + 1);
          else setEstado((prev) => ({ ...prev, terminado: true }));
        }}
      >
        <fieldset className="fieldset">
          <legend className="quiz-question">{pregunta.texto}</legend>
          <p className="hint">{pregunta.ayuda}</p>
          <div className="radio-row">
            {OPCIONES.map((o) => (
              <label key={o.value} className={`radio-card${respuestas[pregunta.id] === o.value ? " is-checked" : ""}`}>
                <input
                  type="radio"
                  name={pregunta.id}
                  value={o.value}
                  checked={respuestas[pregunta.id] === o.value}
                  onChange={() => responder(o.value)}
                />
                <span>{o.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="quiz-actions">
          <button
            type="button"
            className="btn-outline"
            onClick={() => irA(Math.max(0, paso - 1))}
            disabled={paso === 0}
          >
            ← Anterior
          </button>
          <button type="submit" className="btn-gold" disabled={!respuestas[pregunta.id]}>
            {paso === PREGUNTAS.length - 1 ? "Ver resultado" : "Siguiente →"}
          </button>
        </div>
      </form>

      <p className="disclaimer">
        Orientación referencial. No constituye asesoría legal ni una tasación, y no
        reemplaza un informe profesional firmado.
      </p>
    </div>
  );
}

function textoInforme(titulo: string, semaforo: Semaforo) {
  if (semaforo === "rojo") return `Pedir ${titulo.toLowerCase()}`;
  if (semaforo === "amarillo") return `Ver qué revisa el ${titulo.toLowerCase()}`;
  return `Conocer el ${titulo.toLowerCase()}`;
}
