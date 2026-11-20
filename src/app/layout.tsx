import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import JsonLd from "@/components/json-ld";
import { SITE } from "@/lib/site";
import "./globals.css";

// Self-hosted via next/font (downloaded at build time). Exposed as CSS variables
// so the stylesheet and inline styles keep using the same families.
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: {
    default: "CVR Propiedades — Corretaje en Chillán y Región de Ñuble",
    template: "%s | CVR Propiedades",
  },
  description:
    "Venta, arriendo y asesoría de compra de propiedades en Chillán y la Región de Ñuble. Revisión técnica y legal del inmueble antes de firmar.",
  applicationName: SITE.name,
  authors: [{ name: SITE.legalName, url: SITE.domain }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: SITE.domain,
    siteName: SITE.name,
    title: "CVR Propiedades — Corretaje en Chillán y Región de Ñuble",
    description:
      "Venta, arriendo y asesoría de compra de propiedades en Chillán y la Región de Ñuble.",
  },
  robots: { index: true, follow: true },
};

// RealEstateAgent describe el negocio, no un servicio puntual. No lleva precios
// ni promesas de validez: eso se declara en cada página de servicio.
const organizationLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "@id": `${SITE.domain}/#organization`,
  name: SITE.name,
  legalName: SITE.legalName,
  url: SITE.domain,
  email: SITE.email,
  telephone: `+${SITE.phoneE164}`,
  description:
    "Corretaje de propiedades en la Región de Ñuble: venta, arriendo, administración y asesoría de compra con revisión técnica y legal del inmueble.",
  address: {
    "@type": "PostalAddress",
    addressLocality: SITE.city,
    addressRegion: SITE.region,
    addressCountry: SITE.country,
  },
  areaServed: {
    "@type": "AdministrativeArea",
    name: SITE.region,
  },
  knowsAbout: [
    "Corretaje de propiedades",
    "Compraventa de inmuebles",
    "Arriendo y administración de propiedades",
    "Revisión de títulos",
  ],
  sameAs: [SITE.tasacionesUrl],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CL" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <JsonLd data={organizationLd} />
        {children}
      </body>
    </html>
  );
}
