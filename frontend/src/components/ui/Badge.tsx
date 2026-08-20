import { CaseStatus, STATUS_LABELS } from "@/lib/case-status";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<CaseStatus, string> = {
  REMANDED:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/60 dark:bg-transparent dark:text-amber-400",
  BAIL_SET:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/60 dark:bg-transparent dark:text-emerald-400",
  BAIL_POSTED:
    "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-400/60 dark:bg-transparent dark:text-blue-400",
  HEARING_SCHEDULED:
    "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-400/60 dark:bg-transparent dark:text-purple-400",
  DISCHARGED:
    "border-gray-200 bg-gray-100 text-gray-600 dark:border-gray-400/60 dark:bg-transparent dark:text-gray-400",
  TRANSFERRED:
    "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-400/60 dark:bg-transparent dark:text-orange-400",
};

export function Badge({
  status,
  className,
}: {
  status: CaseStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
        STATUS_STYLES[status],
        className,
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

export function Pill({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-surface-elevated px-3 py-1 text-xs text-text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}
