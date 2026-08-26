import { Card } from "@/components/ui/Card";

export type UssdAccessRecord = {
  id: string;
  phone_number: string;
  caller_name: string;
  verification_method: string;
  accessed_at: string;
};

const METHOD_LABELS: Record<string, string> = {
  defendant_name: "Name match",
  clerk_phone: "Clerk-linked phone",
};

function maskPhone(phone: string): string {
  if (phone.length <= 4) return phone;
  return `***${phone.slice(-4)}`;
}

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function UssdAccessLog({ records }: { records: UssdAccessRecord[] }) {
  return (
    <Card className="p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        USSD access log
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Callers verified by phone + name before viewing this case.
      </p>

      {records.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          No USSD lookups recorded yet.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {records.map((record) => (
            <li
              key={record.id}
              className="rounded-lg border border-border/60 px-3 py-2 text-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium">{record.caller_name}</span>
                <span className="text-muted-foreground">
                  {formatWhen(record.accessed_at)}
                </span>
              </div>
              <div className="mt-1 text-muted-foreground">
                {maskPhone(record.phone_number)} ·{" "}
                {METHOD_LABELS[record.verification_method] ??
                  record.verification_method}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
