import { SiteShell } from "@/components/layout/SiteShell";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <SiteShell darkMain>
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">{children}</div>
    </SiteShell>
  );
}
