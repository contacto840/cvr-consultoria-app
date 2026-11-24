import type { Metadata } from "next";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

export const metadata: Metadata = {
  title: "Administración",
  alternates: { canonical: "/admin" },
  // Panel interno: no se indexa ni se sigue.
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main id="contenido" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
