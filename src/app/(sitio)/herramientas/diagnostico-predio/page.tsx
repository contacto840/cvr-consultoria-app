import type { Metadata } from "next";
import DiagnosticoQuiz from "@/components/diagnostico-quiz";
import { AREAS } from "@/lib/diagnostico";

export const metadata: Metadata = {
  title: "Diagnóstico de riesgo de un predio",
  description:
    "Diez preguntas para identificar señales de alerta antes de comprar una propiedad: dominio, herencia, derechos de agua, servidumbres, construcciones y deslindes.",
  alternates: { canonical: "/herramientas/diagnostico-predio" },
  openGraph: {
    title: "Diagnóstico de riesgo de un predio | CVR Propiedades",
    description:
      "Un semáforo por área y el informe que corresponde pedir, antes de ofertar por una propiedad.",
    url: "/herramientas/diagnostico-predio",
  },
};

export default function DiagnosticoPage() {
  const areas = Object.values(AREAS);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Herramienta</p>
          <h1 className="page-title">Diez preguntas antes de ofertar</h1>
          <p className="page-lead">
            Responde lo que sepas. Al final verás un semáforo por área y qué informe
            corresponde pedir. No es un veredicto legal: es una lista de lo que conviene
            mirar con documentos a la vista.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="notice" role="note">
            <strong>Antes de empezar:</strong> este diagnóstico no reemplaza una revisión
            profesional. Su valor está en ordenar las dudas y en mostrar dónde conviene
            poner el esfuerzo antes de firmar.
          </div>

          <DiagnosticoQuiz />

          <div className="card">
            <h2 className="h3">Qué se evalúa en cada área</h2>
            <ul className="area-list">
              {areas.map((a) => (
                <li key={a.id}>
                  <h3>{a.nombre}</h3>
                  <p>{a.explicacion}</p>
                </li>
              ))}
            </ul>
            <p className="small muted">
              Los criterios del semáforo: rojo si declaraste una señal de alerta; amarillo
              si falta información o respondiste «no sé»; verde si todas las respuestas del
              área fueron tranquilizadoras. El detalle se calcula en el navegador, no se
              envía a ningún servidor.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
