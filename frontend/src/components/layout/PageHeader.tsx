import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export function PageHeader({
  title,
  subtitle,
  backHref,
  backLabel = "Back",
  action,
}: {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="space-y-3">
        {backHref ? (
          <Link
            href={backHref}
            className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-primary"
          >
            <ChevronLeft className="h-4 w-4" />
            {backLabel}
          </Link>
        ) : null}
        <div>
          <h1 className="text-3xl font-bold text-text-primary">{title}</h1>
          {subtitle ? (
            <p className="mt-1 text-sm text-text-muted">{subtitle}</p>
          ) : null}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {action}
        <ThemeToggle />
      </div>
    </div>
  );
}
