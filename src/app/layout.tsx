import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
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
  title: "CVR Consultoría Predial | Auditoría Técnica y Legal — Ñuble, Chile",
  description:
    "Más de 20 años asegurando inversiones inmobiliarias e industriales en la Región de Ñuble. Due Diligence técnico, Estudio de Títulos, Tasaciones Comerciales y Auditoría Predial.",
  keywords:
    "tasación inmobiliaria Chillán, due diligence Ñuble, estudio de títulos Chile, perito tasador Chillán, consultoría predial Ñuble",
  openGraph: {
    title: "CVR Consultoría Predial | No somos corredores. Somos tu filtro de riesgo.",
    description:
      "Auditoría técnica y legal para inversiones inmobiliarias en la Región de Ñuble, Chile.",
    locale: "es_CL",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": "https://cvrpropiedades.com",
      "name": "CVR Consultoría Predial",
      "description": "Auditoría técnica y legal para inversiones inmobiliarias en la Región de Ñuble. Due Diligence, Estudio de Títulos y Tasaciones Comerciales.",
      "url": "https://cvrpropiedades.com",
      "telephone": "+56912345678",
      "email": "contacto@cvrpropiedades.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Chillán",
        "addressRegion": "Región de Ñuble",
        "addressCountry": "CL",
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": -36.6067,
        "longitude": -72.1034,
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00",
      },
      "priceRange": "$$",
      "areaServed": "Región de Ñuble, Chile",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Servicios de Consultoría Predial",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Tasación Referencial Online",
              "description": "Valorización automática de propiedades en la Región de Ñuble",
            },
            "price": "0",
            "priceCurrency": "CLP",
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Informe Oficial de Tasación con firma de Perito",
              "description": "Tasación con validez legal para bancos, notarías y tribunales",
            },
            "price": "15000",
            "priceCurrency": "CLP",
          },
        ],
      },
    },
    {
      "@type": "WebSite",
      "url": "https://cvrpropiedades.com",
      "name": "CVR Consultoría Predial",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://cvrpropiedades.com/tasacion",
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
