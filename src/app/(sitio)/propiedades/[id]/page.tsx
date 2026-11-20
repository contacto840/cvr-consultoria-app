import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import JsonLd from "@/components/json-ld";
import PropertyContactForm from "@/components/property-contact-form";
import { prisma } from "@/lib/prisma";
import { SITE } from "@/lib/site";

// La ficha se arma por request: depende de la base y de datos que cambian.
export const dynamic = "force-dynamic";

const TIPO: Record<string, string> = {
  casa: "Casa",
  departamento: "Departamento",
  terreno: "Terreno",
  agricola: "Predio agrícola",
};

const ESTADO: Record<string, string> = {
  disponible: "Disponible",
  reservado: "Reservado",
  vendido: "Vendido",
};

/**
 * Consulta memoizada: generateMetadata y la página piden lo mismo y se ejecuta
 * una sola vez (ver 01-getting-started/14-metadata-and-og-images.md).
 * Solo se seleccionan campos publicables: la dirección exacta y los datos de
 * contacto del propietario no salen de la base hacia una página indexable.
 */
const getListing = cache(async (id: string) => {
  try {
    return await prisma.propertyListing.findFirst({
      where: { id, isActive: true },
      select: {
        id: true,
        title: true,
        description: true,
        propertyType: true,
        transactionType: true,
        comuna: true,
        sector: true,
        surface: true,
        terrainSurface: true,
        bedrooms: true,
        bathrooms: true,
        parkingSpaces: true,
        priceUF: true,
        priceNegotiable: true,
        status: true,
        features: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  } catch (error) {
    console.error("[ficha] error consultando la propiedad:", error);
    return null;
  }
});

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const l = await getListing(id);
  if (!l) {
    return {
      title: "Propiedad no encontrada",
      robots: { index: false, follow: false },
    };
  }

  const ubicacion = [l.sector, l.comuna].filter(Boolean).join(", ");
  const description = `${TIPO[l.propertyType] ?? "Propiedad"} en ${
    l.transactionType === "arriendo" ? "arriendo" : "venta"
  } en ${ubicacion}, Región de Ñuble. ${l.surface} m².`;

  return {
    title: `${l.title} — ${l.comuna}`,
    description,
    alternates: { canonical: `/propiedades/${l.id}` },
    openGraph: {
      title: `${l.title} | CVR Propiedades`,
      description,
      url: `/propiedades/${l.id}`,
      type: "article",
    },
  };
}

function parseFeatures(raw: string): string[] {
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((f): f is string => typeof f === "string") : [];
  } catch {
    return [];
  }
}

const AVAILABILITY: Record<string, string> = {
  disponible: "https://schema.org/InStock",
  reservado: "https://schema.org/LimitedAvailability",
  vendido: "https://schema.org/SoldOut",
};

export default async function FichaPage({ params }: Props) {
  const { id } = await params;
  const l = await getListing(id);
  if (!l) notFound();

  const ubicacion = [l.sector, l.comuna].filter(Boolean).join(", ");
  const features = parseFeatures(l.features);

  const offerLd = {
    "@context": "https://schema.org",
    "@type": "Offer",
    url: `${SITE.domain}/propiedades/${l.id}`,
    name: l.title,
    description: l.description,
    price: l.priceUF,
    priceCurrency: "CLF",
    availability: AVAILABILITY[l.status] ?? "https://schema.org/InStock",
    businessFunction:
      l.transactionType === "arriendo"
        ? "http://purl.org/goodrelations/v1#LeaseOut"
        : "http://purl.org/goodrelations/v1#Sell",
    seller: { "@id": `${SITE.domain}/#organization` },
    itemOffered: {
      "@type": "Residence",
      name: l.title,
      address: {
        "@type": "PostalAddress",
        addressLocality: l.comuna,
        addressRegion: SITE.region,
        addressCountry: SITE.country,
      },
      floorSize: {
        "@type": "QuantitativeValue",
        value: l.surface,
        unitCode: "MTK",
      },
    },
  };

  return (
    <>
      <JsonLd data={offerLd} />

      <div className="container breadcrumb">
        <Link href="/propiedades">Propiedades</Link>
        <span aria-hidden="true"> / </span>
        <span>{l.title}</span>
      </div>

      <section className="section section-tight">
        <div className="container split split-wide">
          <article>
            <p className="eyebrow">
              {TIPO[l.propertyType] ?? l.propertyType} ·{" "}
              {l.transactionType === "arriendo" ? "Arriendo" : "Venta"}
            </p>
            <h1 className="page-title">{l.title}</h1>
            <p className="muted">
              {ubicacion} · Estado: {ESTADO[l.status] ?? l.status}
            </p>

            <p className="price price-lg">
              {l.priceUF.toLocaleString("es-CL", { maximumFractionDigits: 2 })} UF
              {l.priceNegotiable && <span className="muted small"> · precio negociable</span>}
            </p>
            <p className="hint">
              El precio se expresa en UF. Su equivalente en pesos corresponde al valor de la
              UF del día de la operación.
            </p>

            {l.description && <p className="prose">{l.description}</p>}

            <h2 className="h3">Características</h2>
            <dl className="listing-facts listing-facts-wide">
              <div>
                <dt>Superficie construida</dt>
                <dd>{l.surface} m²</dd>
              </div>
              {l.terrainSurface ? (
                <div>
                  <dt>Superficie de terreno</dt>
                  <dd>{l.terrainSurface} m²</dd>
                </div>
              ) : null}
              {l.bedrooms ? (
                <div>
                  <dt>Dormitorios</dt>
                  <dd>{l.bedrooms}</dd>
                </div>
              ) : null}
              {l.bathrooms ? (
                <div>
                  <dt>Baños</dt>
                  <dd>{l.bathrooms}</dd>
                </div>
              ) : null}
              {l.parkingSpaces ? (
                <div>
                  <dt>Estacionamientos</dt>
                  <dd>{l.parkingSpaces}</dd>
                </div>
              ) : null}
              <div>
                <dt>Comuna</dt>
                <dd>{l.comuna}</dd>
              </div>
            </dl>

            {features.length > 0 && (
              <>
                <h2 className="h3">Adicionales</h2>
                <ul className="check-list">
                  {features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </>
            )}

            <div className="callout">
              <h2 className="h3">Antes de ofertar, revisa los títulos</h2>
              <p>
                Que la propiedad se vea bien no significa que el título esté limpio. La
                revisión de dominio, cargas y servidumbres se hace con documentos y antes de
                firmar la promesa.
              </p>
              <a href={SITE.tasaciones.estudioTitulos} className="link-arrow" rel="noopener">
                Estudio de títulos antes de comprar <span aria-hidden="true">↗</span>
              </a>
            </div>

            <p className="hint">
              Publicado el{" "}
              {new Date(l.createdAt).toLocaleDateString("es-CL", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
              . La información de esta ficha es referencial y puede cambiar; se confirma en
              la visita y en la documentación de la operación.
            </p>
          </article>

          <aside className="ficha-aside">
            <PropertyContactForm listingId={l.id} />
            <div className="card">
              <h2 className="h3">¿Quieres vender algo similar?</h2>
              <p className="muted small">
                Revisamos tu propiedad, fijamos un precio con comparables y te decimos qué
                conviene corregir antes de publicar.
              </p>
              <Link href="/servicios/venta" className="link-arrow">
                Cómo trabajamos la venta <span aria-hidden="true">→</span>
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
