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
    <Card className="site-panel overflow-hidden">
      <div className="site-dotted-rule border-t-0 bg-site-dark-elevated px-6 py-3">
        <div className="flex items-center justify-between gap-3">
          <p className="site-mono-label text-xs uppercase">Case Overview</p>
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
      <div className="border-t border-site-border px-6 py-3 text-xs text-site-on-dark-muted">
        Current status: {STATUS_LABELS[caseRecord.current_status]}
      </div>
    </Card>
  );
}
