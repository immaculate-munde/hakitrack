"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { CaseRecord, formatDate } from "@/lib/case-status";

export function CaseListRow({ caseRecord }: { caseRecord: CaseRecord }) {
  return (
    <Link href={`/admin/cases/${caseRecord.id}`}>
      <Card className="p-5 transition-colors hover:border-accent/40">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-semibold text-text-primary">
              {caseRecord.case_number}
            </p>
            <p className="text-sm text-text-muted">{caseRecord.defendant_name}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge status={caseRecord.current_status} />
            <span className="text-sm text-text-muted">
              Next: {formatDate(caseRecord.next_hearing_date)}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
