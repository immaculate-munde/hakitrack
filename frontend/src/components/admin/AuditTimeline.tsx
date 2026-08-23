import { Card } from "@/components/ui/Card";
import { AuditLogRecord, STATUS_LABELS } from "@/lib/case-status";

export function AuditTimeline({ logs }: { logs: AuditLogRecord[] }) {
  return (
    <Card className="site-panel p-6">
      <p className="site-mono-label text-xs">[ Change History ]</p>
      <h3 className="mt-2 text-lg font-light text-site-on-dark">Audit Timeline</h3>
      <p className="mt-1 text-sm text-site-on-dark-muted">
        Clerk updates recorded for this case
      </p>

      {logs.length === 0 ? (
        <p className="mt-6 text-sm text-site-on-dark-muted">No changes recorded yet.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {logs.map((log) => (
            <div
              key={log.id}
              className="site-panel rounded-xl px-4 py-3"
            >
              <p className="text-sm text-site-on-dark">
                {log.old_status
                  ? `${STATUS_LABELS[log.old_status]} → ${STATUS_LABELS[log.new_status]}`
                  : STATUS_LABELS[log.new_status]}
              </p>
              <p className="mt-1 text-xs text-site-on-dark-muted">
                {new Date(log.changed_at).toLocaleString("en-KE")}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
