import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/json-ld";
import { HONORARIOS, IVA_TASA } from "@/lib/honorarios";
import { SITE } from "@/lib/site";
import { obtenerUfDelDia } from "@/lib/uf";

export const metadata: Metadata = {
  title: "Honorarios",
  description:
    "Honorarios de CVR Propiedades: venta, arriendo, administración, asesoría de compra y corredores asociados. Porcentajes, IVA y quién paga cada parte, publicados antes de firmar.",
  alternates: { canonical: "/honorarios" },
  openGraph: {
    title: "Honorarios | CVR Propiedades",
    description:
      "La tabla completa de honorarios, con IVA explícito y quién paga cada parte. Sin letra chica.",
    url: "/honorarios",
  },
};

const catalogLd = {
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  name: "Honorarios de CVR Propiedades",
  url: `${SITE.domain}/honorarios`,
  itemListElement: HONORARIOS.map((h) => ({
    "@type": "Offer",
    name: h.servicio,
    description: `${h.honorario}. ${h.determina}`,
    seller: { "@id": `${SITE.domain}/#organization` },
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      name: h.honorario,
    },
  })),
};

/** "2026-11-23" → "23 de noviembre de 2026", sin correr el día por zona horaria. */
function fechaLarga(iso: string): string {
  const [anio, mes, dia] = iso.split("-").map(Number);
  if (!anio || !mes || !dia) return iso;
  return new Date(anio, mes - 1, dia).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const fmtCLP = (n: number) =>
  n.toLocaleString("es-CL", { maximumFractionDigits: 0 });

export default async function HonorariosPage() {
  // La UF solo se usa para mostrar el equivalente en pesos del mínimo de la
  // asesoría. Si el SII no responde, la página muestra solo UF: no se inventa
  // una conversión ni se recicla un valor de otro día.
  const uf = await obtenerUfDelDia();
  const asesoria = HONORARIOS.find((h) => h.id === "asesoria");
  const equivalenteCLP =
    uf && asesoria?.ufMinima ? Math.round(asesoria.ufMinima * uf.valorCLP) : null;

  return (
    <>
      <JsonLd data={catalogLd} />

      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Honorarios</p>
          <h1 className="page-title">Lo que cuesta trabajar con CVR</h1>
          <p className="page-lead">
            La tabla completa, con el IVA explícito y la parte que paga cada honorario.
            Publicarla antes de que alguien firme una orden de corretaje es parte del
            servicio: un precio que aparece después de la firma no es un precio, es una
            condición.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Tabla de honorarios</h2>
          <p className="section-lead">
            Todos los valores se expresan sin IVA. El IVA aplicable es{" "}
            {Math.round(IVA_TASA * 100)}% y se suma al honorario que corresponda.
          </p>
          <p className="hint honorarios-hint">
            En pantalla pequeña, desliza la tabla para ver la columna «Honorario». La
            primera columna queda fija para no perder el servicio.
          </p>

          <div
            className="table-wrap honorarios-wrap"
            role="region"
            tabIndex={0}
            aria-label="Tabla de honorarios, desplazable en horizontal"
          >
            <table className="data-table honorarios-table">
              <caption className="sr-only">
                Honorarios por servicio: qué incluye, qué determina el precio y el
                honorario que se cobra
              </caption>
              <thead>
                <tr>
                  <th scope="col">Servicio</th>
                  <th scope="col">Qué incluye</th>
                  <th scope="col">Qué determina el precio</th>
                  <th scope="col">Honorario</th>
                </tr>
              </thead>
              <tbody>
                {HONORARIOS.map((h) => (
                  <tr key={h.id}>
                    <th scope="row">{h.servicio}</th>
                    <td>{h.incluye}</td>
                    <td>{h.determina}</td>
                    <td className="honorario-amount">
                      {h.honorario}
                      {h.id === "asesoria" && equivalenteCLP !== null && uf ? (
                        <span className="source">
                          {h.ufMinima} UF equivalen a ${fmtCLP(equivalenteCLP)} CLP al
                          valor de la UF del {fechaLarga(uf.fecha)}. Fuente: Servicio de
                          Impuestos Internos (SII).
                        </span>
                      ) : h.id === "asesoria" ? (
                        <span className="source">
                          Conversión a pesos no disponible: no pudimos obtener el valor
                          oficial de la UF. El honorario se expresa solo en UF.
                        </span>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="hint">
            La columna «Honorario» es la condición que se lleva al documento. Si una
            operación necesita un alcance distinto, el recargo se escribe en la tabla del
            encargo antes de empezar, no después.
          </p>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container split">
          <div>
            <h2 className="section-title">Quién paga</h2>
            <p>
              En Chile es costumbre que la comisión la paguen ambas partes y no existe una
              ley que fije ese reparto. Por eso cada operación declara por escrito, antes
              de firmar la orden de corretaje, qué parte paga qué honorario. Si el reparto
              no está en el documento, no está acordado.
            </p>
            <p>
              El honorario de venta de 2% + IVA es el de la parte que representa CVR y se
              paga contra la escritura. El arriendo y la administración se cobran a la
              parte que encarga la gestión. La asesoría de compra la paga quien la
              contrata.
            </p>
          </div>
          <div className="card">
            <h3>Reglas que no cambian</h3>
            <ul className="check-list">
              <li>
                El honorario se fija por escrito antes de empezar y no varía después,
                salvo que cambie el alcance acordado.
              </li>
              <li>
                «Desde» es un mínimo real: por debajo de ese honorario no se toma el
                encargo.
              </li>
              <li>El IVA se declara siempre y por separado.</li>
              <li>Los recargos van en la tabla del encargo, no en letra chica.</li>
              <li>No hay precios tachados, ofertas, «antes/ahora» ni cuenta regresiva.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <h2 className="section-title">Por qué la asesoría de compra no es un porcentaje</h2>
            <p>
              El honorario de asesoría de compra es fijo, desde 12 UF + IVA, y no un
              porcentaje del precio de la propiedad. Es a propósito. Un porcentaje hace
              ganar más al asesor cuando el cliente compra y cuando compra caro: exactamente
              el conflicto de interés que este servicio dice resolver. Con honorario fijo, a
              CVR le da lo mismo si el cliente compra o se arrepiente, y eso es lo que está
              comprando.
            </p>
            <p>
              El precio de la propiedad no cambia el honorario. El alcance del encargo sí:
              cuántos inmuebles se revisan, qué documentos faltan y hasta dónde llega el
              acompañamiento. Ese alcance se escribe antes de empezar.
            </p>
          </div>
          <div className="card">
            <h3>Antes de aceptar</h3>
            <ul className="check-list">
              <li>Recibes esta tabla y el detalle del alcance por escrito.</li>
              <li>Sabes qué parte paga el honorario y desde cuándo se debe.</li>
              <li>El IVA está calculado y a la vista, no sorpresa en la factura.</li>
              <li>El plazo del encargo se acuerda en el mismo documento.</li>
            </ul>
            <div className="inline-actions">
              <Link href="/#contacto" className="btn-gold">
                Conversemos sobre tu operación
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
