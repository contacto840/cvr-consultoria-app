import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Términos de uso",
  description:
    "Condiciones de uso del sitio de CVR Propiedades SpA: alcance de la información, herramientas referenciales, estimación gratuita, encargos cotizados por escrito y limitación de responsabilidad.",
  alternates: { canonical: "/terminos" },
};

const ACTUALIZADO = "20 de noviembre de 2026";

export default function TerminosPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container narrow">
          <p className="eyebrow">Legal</p>
          <h1 className="page-title">Términos de uso</h1>
          <p className="page-lead">
            Estas condiciones rigen el uso de este sitio y de las herramientas que ofrece.
            Léelas antes de usar la calculadora, el diagnóstico o contratar un servicio.
          </p>
          <p className="hint">Última actualización: {ACTUALIZADO}.</p>
        </div>
      </section>

      <section className="section">
        <div className="container narrow prose">
          <div className="notice" role="note">
            <strong>Texto pendiente de revisión legal.</strong> Estos términos deben ser
            revisados por la abogada de CVR Propiedades SpA antes de su publicación. Las
            condiciones de cada encargo se confirman por escrito antes de empezar.
          </div>

          <h2>1. Identificación del prestador</h2>
          <p>
            Este sitio es operado por <strong>{SITE.legalName}</strong>, RUT{" "}
            <strong>{"78.342.064-3"}</strong>, con domicilio en {SITE.city},{" "}
            {SITE.region}, Chile, correo <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
            El dominio canónico es {SITE.domain}.
          </p>

          <h2>2. Alcance de la información del sitio</h2>
          <p>
            La información de propiedades, servicios y herramientas es de carácter general e
            informativo. Las fichas de propiedades no constituyen una oferta de venta ni de
            arriendo: son antecedentes que se confirman en la visita y en la documentación de
            la operación. Los precios, superficies y características pueden cambiar sin aviso
            previo.
          </p>
          <p>
            Las propiedades publicadas por terceros son de responsabilidad de quien las
            publica. CVR revisa los antecedentes antes de activar una publicación y puede
            rechazarla o retirarla si la información no es verificable.
          </p>

          <h2>3. Herramientas interactivas</h2>
          <p>
            La estimación referencial de valor, la calculadora de costos de compra y el
            diagnóstico de un predio son herramientas de orientación. Sus resultados:
          </p>
          <ul className="check-list">
            <li>Se calculan con los datos que ingresa el usuario y con valores de referencia propios o de terceros.</li>
            <li>No constituyen una tasación, un informe pericial ni asesoría legal o financiera.</li>
            <li>No sirven para trámites bancarios, judiciales, hereditarios ni de compraventa.</li>
            <li>Pueden contener ítems marcados como pendientes de cotización, que no forman parte del total.</li>
          </ul>
          <p>
            Los aranceles de notarías, Conservadores de Bienes Raíces, municipios y otros
            terceros son estimaciones o datos pendientes de confirmación. El usuario debe
            verificar cada monto con el prestador correspondiente antes de comprometer
            dinero.
          </p>

          <h2>4. Estimación referencial y encargos</h2>
          <p>
            La estimación referencial que entrega el estimador es <strong>gratuita</strong>{" "}
            y automática. No constituye una tasación ni genera un encargo.
          </p>
          <p>
            El <strong>informe de tasación con inspección y firma no se cobra en línea: se
            cotiza</strong>. El formulario envía una solicitud y CVR Propiedades SpA
            responde por escrito con el honorario y el plazo antes de que el cliente
            acepte. El documento automático que puede enviarse es una{" "}
            <strong>estimación referencial</strong>, no el informe del encargo: no lleva
            firma, no invoca una norma de tasación y no sirve para trámites. El producto
            del encargo es el informe firmado, y su alcance y plazo son los que se acuerdan
            por escrito.
          </p>
          <p>
            <strong>Reembolsos.</strong> Como no se cobra en línea, las condiciones de cada
            encargo se acuerdan por escrito antes de empezar y no hay cobro anticipado. Si
            un encargo ya comenzó y se interrumpe, se aplica lo que se haya acordado por
            escrito para ese encargo.
          </p>
          <p>
            Este sitio no solicita ni almacena datos de tarjeta ni medios de pago.
          </p>

          <h2>5. Publicación de propiedades</h2>
          <p>
            Quien publica declara ser el propietario, mandatario o corredor autorizado, y
            responde por la veracidad de los datos. Está prohibido publicar propiedades sin
            autorización, información falsa o contenido que infrinja derechos de terceros.
          </p>
          <p>
            Por protección de los propietarios, la dirección exacta y los datos de contacto
            personales no se muestran en la ficha pública: el contacto se canaliza por el
            formulario del sitio.
          </p>

          <h2>6. Limitación de responsabilidad</h2>
          <p>
            En la medida permitida por la ley, CVR Propiedades SpA no responde por decisiones
            tomadas exclusivamente a partir de la información general del sitio o de los
            resultados de las herramientas interactivas, ni por la información contenida en
            sitios de terceros enlazados. Nada en estos términos limita los derechos que la
            ley reconoce al consumidor.
          </p>

          <h2>7. Propiedad intelectual</h2>
          <p>
            Los textos, la estructura del sitio, las fichas y los elementos gráficos son de
            CVR Propiedades SpA o se usan con autorización. No se permite su reproducción
            total o parcial sin autorización escrita, salvo el uso personal y las citas
            permitidas por la ley.
          </p>
          <p>
            Las normas técnicas de tasación y los estándares internacionales son documentos
            de sus titulares. Este sitio no reproduce su texto.
          </p>

          <h2>8. Enlaces externos</h2>
          <p>
            El sitio enlaza a {SITE.tasacionesUrl} para informes firmados. Ese sitio tiene sus
            propios términos y política de privacidad. CVR no controla el contenido de sitios
            de terceros.
          </p>

          <h2>9. Ley aplicable y jurisdicción</h2>
          <p>
            Estos términos se rigen por la ley chilena. Las controversias que no se resuelvan
            por acuerdo entre las partes se someterán a los tribunales competentes de{" "}
            {SITE.city}, Chile, sin perjuicio de las reglas de protección al consumidor.
          </p>

          <h2>10. Contacto</h2>
          <p>
            Consultas sobre estos términos:{" "}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. Ver también la{" "}
            <Link href="/privacidad">política de privacidad</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
