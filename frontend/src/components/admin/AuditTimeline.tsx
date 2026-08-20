import { Card } from "@/components/ui/Card";
import { AuditLogRecord, STATUS_LABELS } from "@/lib/case-status";

export function AuditTimeline({ logs }: { logs: AuditLogRecord[] }) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-text-primary">Change History</h3>
      <p className="mt-1 text-sm text-text-muted">
        Clerk updates recorded for this case
      </p>

      {logs.length === 0 ? (
        <p className="mt-6 text-sm text-text-muted">No changes recorded yet.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {logs.map((log) => (
            <div
              key={log.id}
              className="rounded-xl border border-border bg-surface-elevated px-4 py-3"
            >
              <p className="text-sm text-text-primary">
                {log.old_status
                  ? `${STATUS_LABELS[log.old_status]} → ${STATUS_LABELS[log.new_status]}`
                  : STATUS_LABELS[log.new_status]}
              </p>
              <p className="mt-1 text-xs text-text-muted">
                {new Date(log.changed_at).toLocaleString("en-KE")}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
