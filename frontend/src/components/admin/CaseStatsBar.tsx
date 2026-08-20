import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { StatCell } from "@/components/ui/StatCell";
import {
  CaseRecord,
  daysUntil,
  formatDateTime,
  STATUS_LABELS,
} from "@/lib/case-status";

export function CaseStatsBar({
  caseRecord,
  subscriberCount,
  auditCount,
}: {
  caseRecord: CaseRecord;
  subscriberCount: number;
  auditCount: number;
}) {
  const days = daysUntil(caseRecord.next_hearing_date);

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-border bg-accent-muted px-6 py-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">
            Case Overview
          </p>
          <Badge status={caseRecord.current_status} />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4">
        <StatCell label="SMS Subscribers" value={subscriberCount} />
        <StatCell
          label="Days to Hearing"
          value={days === null ? "—" : days}
        />
        <StatCell
          label="Last Updated"
          value={formatDateTime(caseRecord.last_updated).split(",")[0] ?? "—"}
        />
        <StatCell label="Status Changes" value={auditCount} />
      </div>
      <div className="border-t border-border px-6 py-3 text-xs text-text-muted">
        Current status: {STATUS_LABELS[caseRecord.current_status]}
      </div>
    </Card>
  );
}
