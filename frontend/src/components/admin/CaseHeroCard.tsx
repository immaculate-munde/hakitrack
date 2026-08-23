"use client";

import { Copy, Phone } from "lucide-react";
import { Badge, Pill } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  CaseRecord,
  formatCurrency,
  formatDateTime,
  getCaseType,
} from "@/lib/case-status";
import { previewUssdText } from "@/lib/ussd/formatters";

export function CaseHeroCard({ caseRecord }: { caseRecord: CaseRecord }) {
  async function copyCaseNumber() {
    await navigator.clipboard.writeText(caseRecord.case_number);
  }

  function showUssdPreview() {
    alert(previewUssdText(caseRecord));
  }

  return (
    <Card className="site-panel overflow-hidden">
      <div className="hero-gradient hero-grid h-40 border-b border-border" />
      <div className="-mt-16 px-6 pb-6">
        <div className="site-panel rounded-2xl p-6 backdrop-blur">
          <div className="space-y-3">
            <h2 className="text-2xl font-light text-site-on-dark">
              {caseRecord.case_number}
            </h2>
            <p className="text-site-on-dark">{caseRecord.defendant_name}</p>
            <p className="text-sm text-site-on-dark-muted">{caseRecord.court_station}</p>
            {caseRecord.judge_name ? (
              <p className="text-sm text-site-on-dark-muted">
                Judge: {caseRecord.judge_name}
              </p>
            ) : null}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Badge status={caseRecord.current_status} />
            <Pill>{getCaseType(caseRecord.case_number)}</Pill>
            <Pill>{formatCurrency(caseRecord.bail_amount)}</Pill>
            <Pill>{formatDateTime(caseRecord.next_hearing_date)}</Pill>
            {caseRecord.holding_location ? (
              <Pill>{caseRecord.holding_location}</Pill>
            ) : null}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Button variant="ghost" type="button" onClick={copyCaseNumber}>
              <Copy className="h-4 w-4" />
              Copy case #
            </Button>
            <Button variant="ghost" type="button" onClick={showUssdPreview}>
              <Phone className="h-4 w-4" />
              View USSD preview
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
