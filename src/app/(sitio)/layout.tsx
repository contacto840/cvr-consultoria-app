import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

export default function SitioLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
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
