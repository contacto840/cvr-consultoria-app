import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Cómo trata CVR Propiedades SpA los datos personales que recibe en este sitio: finalidades, base de licitud, conservación, destinatarios y derechos del titular.",
  alternates: { canonical: "/privacidad" },
  robots: { index: true, follow: true },
};

const ACTUALIZADO = "20 de noviembre de 2026";

export default function PrivacidadPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container narrow">
          <p className="eyebrow">Legal</p>
          <h1 className="page-title">Política de privacidad</h1>
          <p className="page-lead">
            Tratamos datos personales de quienes consultan, publican una propiedad o
            encargan un informe. Esta política explica qué datos son, para qué se usan y
            cómo ejercer los derechos que reconoce la Ley 21.719.
          </p>
          <p className="hint">Última actualización: {ACTUALIZADO}.</p>
        </div>
      </section>

      <section className="section">
        <div className="container narrow prose">
          <div className="notice" role="note">
            <strong>Texto pendiente de revisión legal.</strong> Esta política fue redactada
            para el sitio y debe ser revisada por la abogada de CVR Propiedades SpA antes de
            su publicación. Los datos marcados con {"{{PENDIENTE}}"} no están confirmados.
          </div>

          <h2>1. Responsable del tratamiento</h2>
          <p>
            El responsable es <strong>{SITE.legalName}</strong>, RUT{" "}
            <strong>{"{{RUT_PENDIENTE}}"}</strong>, con domicilio en {SITE.city},{" "}
            {SITE.region}, Chile. Canal de contacto para materias de datos personales:{" "}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
          </p>
          <p className="pending">
            {"{{PENDIENTE: domicilio legal y correo de privacidad definitivos, confirmar con Carlos}}"}
          </p>

          <h2>2. Qué datos tratamos y para qué</h2>
          <p>
            Solo tratamos datos necesarios para las finalidades que se indican. No pedimos
            datos sensibles y no usamos los datos para publicidad de terceros.
          </p>

          <div className="table-wrap">
            <table className="data-table">
              <caption className="sr-only">
                Datos personales tratados, finalidad, base de licitud y conservación
              </caption>
              <thead>
                <tr>
                  <th scope="col">Dato</th>
                  <th scope="col">Finalidad</th>
                  <th scope="col">Base de licitud</th>
                  <th scope="col">Conservación</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Nombre, correo y teléfono del formulario de contacto</th>
                  <td>Responder la consulta y coordinar la atención.</td>
                  <td>Consentimiento del titular al enviar el formulario.</td>
                  <td>{"{{PENDIENTE: plazo de conservación de consultas}}"}</td>
                </tr>
                <tr>
                  <th scope="row">
                    Nombre, correo, teléfono y datos del inmueble (comuna, sector, tipo,
                    superficie, estado, antigüedad)
                  </th>
                  <td>
                    Calcular la estimación referencial, emitirla y contactar al solicitante
                    por esa solicitud.
                  </td>
                  <td>Consentimiento del titular, marcado en la casilla del formulario.</td>
                  <td>{"{{PENDIENTE: plazo de conservación de solicitudes de estimación}}"}</td>
                </tr>
                <tr>
                  <th scope="row">Datos de la operación pagada (identificador de solicitud, estado del pago)</th>
                  <td>Gestionar el encargo y acreditar el pago.</td>
                  <td>Ejecución del contrato entre el titular y CVR Propiedades SpA.</td>
                  <td>Mientras dure la relación y los plazos legales aplicables.</td>
                </tr>
                <tr>
                  <th scope="row">Datos de pago (tarjeta, medio de pago)</th>
                  <td>Procesar el pago del encargo.</td>
                  <td>Ejecución del contrato, a través del procesador de pagos.</td>
                  <td>
                    No los almacenamos: los trata MercadoPago según sus propias políticas.
                  </td>
                </tr>
                <tr>
                  <th scope="row">
                    Datos del anunciante y de la propiedad publicada (nombre, teléfono,
                    correo, sector, comuna, características)
                  </th>
                  <td>Revisar y publicar el aviso, y contactar al anunciante.</td>
                  <td>Consentimiento del anunciante al enviar el formulario.</td>
                  <td>{"{{PENDIENTE: plazo de conservación de publicaciones}}"}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            <strong>Lo que no hacemos:</strong> no usamos cookies no esenciales, no
            incorporamos analítica de terceros ni píxeles de redes sociales, y no elaboramos
            perfiles publicitarios. Por eso este sitio no muestra un banner de cookies.
          </p>

          <h2>3. Destinatarios y encargados</h2>
          <p>
            Para operar el sitio trabajamos con proveedores que tratan datos por cuenta de
            CVR Propiedades SpA y solo para las finalidades indicadas:
          </p>
          <ul className="check-list">
            <li>
              <strong>MercadoPago</strong>, como procesador de pagos. Recibe los datos
              necesarios para cobrar el encargo.
            </li>
            <li>
              <strong>Proveedor de correo electrónico</strong>, para enviar la estimación y
              las comunicaciones del encargo.
            </li>
            <li>
              <strong>Proveedor de alojamiento y base de datos</strong>, donde se almacenan
              las solicitudes y las publicaciones.
            </li>
          </ul>
          <p>
            No vendemos ni cedemos datos personales a terceros con fines publicitarios.
            Podemos entregar información cuando exista una obligación legal o un
            requerimiento de autoridad competente.
          </p>

          <h2>4. Transferencias internacionales</h2>
          <p>
            Los proveedores de alojamiento, base de datos y pagos pueden almacenar
            información fuera de Chile. En ese caso el tratamiento se sujeta a las
            condiciones contractuales del proveedor y a la normativa aplicable.
          </p>
          <p className="pending">
            {"{{PENDIENTE: detalle de países de destino y cláusulas contractuales de cada encargado}}"}
          </p>

          <h2>5. Plazo de conservación</h2>
          <p>
            Conservamos los datos mientras sean necesarios para la finalidad por la que se
            recolectaron y, después, durante los plazos de prescripción o de conservación
            que exija la ley. Cuando dejan de ser necesarios se eliminan o se anonimizan.
          </p>
          <p className="pending">
            {"{{PENDIENTE: plazos concretos por categoría, definir con la abogada}}"}
          </p>

          <h2>6. Derechos del titular</h2>
          <p>
            La Ley 21.719 reconoce al titular los derechos de acceso, rectificación,
            supresión, oposición y portabilidad, además del derecho a oponerse al
            tratamiento de datos para fines de marketing directo.
          </p>
          <p>Para ejercerlos, escribe a <a href={`mailto:${SITE.email}`}>{SITE.email}</a> indicando:</p>
          <ul className="check-list">
            <li>Tu nombre completo y un medio para responderte.</li>
            <li>El derecho que ejerces.</li>
            <li>Los antecedentes que permitan identificar los datos involucrados.</li>
          </ul>
          <p>
            Respondemos en los plazos que fija la ley. Si consideras que la respuesta no es
            adecuada, puedes reclamar ante la Agencia de Protección de Datos Personales.
          </p>

          <h2>7. Seguridad</h2>
          <p>
            Aplicamos medidas técnicas y organizativas razonables para proteger los datos:
            acceso restringido a la base, credenciales por variable de entorno, validación de
            las entradas antes de escribir en la base y comunicación cifrada con los
            proveedores. Ningún sistema es infalible; si ocurre un incidente que afecte datos
            personales, se informará a los titulares y a la autoridad cuando corresponda.
          </p>

          <h2>8. Menores de edad</h2>
          <p>
            El sitio está dirigido a personas mayores de edad. No recogemos deliberadamente
            datos de menores. Si detectamos ese tipo de datos, se eliminan.
          </p>

          <h2>9. Cambios a esta política</h2>
          <p>
            Si cambia el tratamiento o la normativa, actualizamos esta página y su fecha de
            última actualización. Los cambios sustanciales se comunican por los canales
            habituales.
          </p>

          <h2>10. Contacto</h2>
          <p>
            {SITE.legalName}
            <br />
            {SITE.city}, {SITE.region}, Chile
            <br />
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            <br />
            <a href={`tel:+${SITE.phoneE164}`}>{SITE.phoneDisplay}</a>
          </p>
        </div>
      </section>
    </>
  );
}
