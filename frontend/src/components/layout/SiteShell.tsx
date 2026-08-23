import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export function SiteShell({
  children,
  darkMain = false,
}: {
  children: React.ReactNode;
  darkMain?: boolean;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main
        className={
          darkMain
            ? "flex-1 bg-site-dark text-site-on-dark"
            : "flex-1 bg-background"
        }
      >
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
