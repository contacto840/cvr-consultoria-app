import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Cómo trata CVR Propiedades SpA los datos personales que recibe en este sitio: finalidades, base de licitud, conservación, destinatarios, transferencias internacionales y derechos del titular.",
  alternates: { canonical: "/privacidad" },
  robots: { index: true, follow: true },
};

const ACTUALIZADO = "23 de noviembre de 2026";

export default function PrivacidadPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container narrow">
          <p className="eyebrow">Legal</p>
          <h1 className="page-title">Política de privacidad</h1>
          <p className="page-lead">
            Tratamos datos personales de quienes consultan, publican una propiedad o piden
            una estimación. Esta política explica qué datos son, para qué se usan, dónde se
            alojan y cómo ejercer los derechos que reconoce la Ley 21.719.
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
            <strong>78.342.064-3</strong>, con domicilio en Chillán, Región de Ñuble, Chile.
            Canal de contacto para materias de datos personales:{" "}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
          </p>
          <p>
            No se publica una dirección de calle: la atención se coordina por correo,
            teléfono o WhatsApp, y la dirección exacta se entrega cuando corresponde a una
            operación en curso.
          </p>

          <h2>2. Qué datos tratamos y para qué</h2>
          <p>
            Solo tratamos datos necesarios para las finalidades que se indican. No pedimos
            datos sensibles y no usamos los datos para publicidad de terceros.
          </p>

          <div
            className="table-wrap"
            role="region"
            tabIndex={0}
            aria-label="Datos que se tratan y con qué finalidad, tabla desplazable"
          >
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
                  <td>12 meses desde la última interacción.</td>
                </tr>
                <tr>
                  <th scope="row">
                    Nombre, correo, teléfono y datos del inmueble (comuna, sector, tipo,
                    superficie, estado, antigüedad)
                  </th>
                  <td>
                    Calcular la estimación referencial, emitirla, cotizar el informe cuando
                    se solicita y contactar al solicitante por esa solicitud.
                  </td>
                  <td>Consentimiento del titular, marcado en la casilla del formulario.</td>
                  <td>24 meses desde la solicitud.</td>
                </tr>
                <tr>
                  <th scope="row">
                    Datos del anunciante y de la propiedad publicada (nombre, teléfono,
                    correo, sector, comuna, características)
                  </th>
                  <td>Revisar y publicar el aviso, y contactar al anunciante.</td>
                  <td>Consentimiento del anunciante al enviar el formulario.</td>
                  <td>Mientras la publicación esté activa, más 12 meses.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="pending">
            Plazos propuestos de conservación, pendientes de revisión legal.
          </p>

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
              <strong>Neon (Neon, Inc.)</strong>, como encargado de la base de datos donde
              se almacenan las solicitudes y las publicaciones.
            </li>
            <li>
              <strong>Vercel (Vercel Inc.)</strong>, como encargado del alojamiento y de la
              ejecución del sitio.
            </li>
            <li>
              <strong>Proveedor de correo electrónico</strong>, como encargado del envío de
              la estimación y de los avisos internos del sitio.
            </li>
          </ul>
          <p>
            El sitio no cobra en línea y no procesa pagos, así que no hay un procesador de
            pagos entre los destinatarios. No vendemos ni cedemos datos personales a
            terceros con fines publicitarios. Podemos entregar información cuando exista
            una obligación legal o un requerimiento de autoridad competente.
          </p>

          <h2>4. Transferencias internacionales</h2>
          <p>
            <strong>Sección pendiente de revisión legal.</strong> Los datos personales que
            se envían por los formularios salen de Chile y se tratan fuera del país. Esto es
            lo que se puede acreditar hoy, con el encargado y el instrumento de cada
            tratamiento:
          </p>
          <ul className="check-list">
            <li>
              <strong>Base de datos: Neon (Neon, Inc.).</strong> La cadena de conexión
              configurada apunta a la región <strong>sa-east-1</strong>, que corresponde a
              la infraestructura de AWS en <strong>São Paulo, Brasil</strong>. Neon es
              encargado del tratamiento. Instrumento: el Data Processing Addendum de Neon,
              que incorpora las Cláusulas Contractuales Tipo de la Comisión Europea
              (2021/914) y el Marco de Privacidad de Datos entre la Unión Europea y Estados
              Unidos. Neon, Inc. puede acceder a los datos desde{" "}
              <strong>Estados Unidos</strong> y desde las jurisdicciones donde operan sus
              subencargados.
            </li>
            <li>
              <strong>Alojamiento: Vercel (Vercel Inc.).</strong> Vercel es encargado del
              tratamiento. Su Data Processing Addendum declara que sus instalaciones
              principales de procesamiento están en <strong>Estados Unidos</strong> y que
              puede transferir datos a ese país y a donde operan sus subencargados.
              Instrumento: el Data Processing Addendum de Vercel, aplicable a los planes Pro
              y Enterprise, con las Cláusulas Contractuales Tipo (2021/914). La región
              específica de ejecución de las funciones{" "}
              <strong>no está determinada en los archivos del proyecto</strong>:{" "}
              {"{{PENDIENTE: confirmar la región del proyecto en Vercel}}"}.
            </li>
            <li>
              <strong>Correo: proveedor SMTP (por defecto, Gmail de Google).</strong> Se usa
              para enviar la estimación y los avisos internos. Instrumento: el acuerdo de
              tratamiento de datos de Google Workspace o Google Cloud, según la cuenta que
              se use. La cuenta y el país de procesamiento{" "}
              <strong>no están determinados en los archivos del proyecto</strong>:{" "}
              {"{{PENDIENTE: confirmar proveedor y país de correo}}"}.
            </li>
          </ul>
          <p>
            No se transfieren datos a otros países por analítica, publicidad ni cookies: el
            sitio no las usa. Si cambia un proveedor o una región, esta sección se actualiza
            antes de seguir tratando datos con ese proveedor.
          </p>

          <h2>5. Plazo de conservación</h2>
          <p>
            Conservamos los datos mientras sean necesarios para la finalidad por la que se
            recolectaron y, después, durante los plazos de prescripción o de conservación
            que exija la ley. Cuando dejan de ser necesarios se eliminan o se anonimizan.
          </p>
          <p>
            Los plazos propuestos son los de la tabla anterior: 12 meses para las consultas
            de contacto, 24 meses para las solicitudes de estimación y, para las
            publicaciones de propiedades, mientras estén activas más 12 meses. Son una
            política propuesta y están pendientes de revisión legal.
          </p>

          <h2>6. Derechos del titular</h2>
          <p>
            La Ley 21.719 reconoce al titular los derechos de acceso, rectificación,
            supresión, oposición y portabilidad, además del derecho a oponerse al
            tratamiento de datos para fines de marketing directo.
          </p>
          <p>
            Para ejercerlos, escribe a <a href={`mailto:${SITE.email}`}>{SITE.email}</a>{" "}
            indicando:
          </p>
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
            Chillán, Región de Ñuble, Chile
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
