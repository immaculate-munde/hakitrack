"use client";

import { Phone } from "lucide-react";
import { AuditTimeline } from "@/components/admin/AuditTimeline";
import { CaseHeroCard } from "@/components/admin/CaseHeroCard";
import { CaseStatsBar } from "@/components/admin/CaseStatsBar";
import { SiteShell } from "@/components/layout/SiteShell";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  AuditLogRecord,
  CaseRecord,
  formatDateTime,
  STATUS_LABELS,
} from "@/lib/case-status";

export function FamilyCaseView({
  caseRecord,
  auditLogs,
  subscriberCount,
}: {
  caseRecord: CaseRecord;
  auditLogs: AuditLogRecord[];
  subscriberCount: number;
}) {
  return (
    <SiteShell darkMain>
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <PageHeader
          title={caseRecord.case_number}
          subtitle={`Tracking for ${caseRecord.defendant_name}`}
          backHref="/family"
          backLabel="Back to dashboard"
        />

        <div className="site-panel mb-6 flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-site-mono" />
            <div>
              <p className="text-sm font-medium text-site-on-dark">
                Also track via USSD
              </p>
              <p className="text-sm text-site-on-dark-muted">
                Dial *384*XYZ# → option 1 → enter{" "}
                {caseRecord.case_number.replace(/-/g, "")}
              </p>
            </div>
          </div>
          <p className="text-xs text-site-on-dark-muted">
            Last updated: {formatDateTime(caseRecord.last_updated)}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <CaseHeroCard caseRecord={caseRecord} />
          <div className="site-panel p-6">
            <p className="site-mono-label text-xs">[ Current Status ]</p>
            <h2 className="mt-4 text-2xl font-light text-site-on-dark">
              {STATUS_LABELS[caseRecord.current_status]}
            </h2>
            <dl className="mt-6 space-y-4 text-sm">
              <div>
                <dt className="text-site-on-dark-muted">Next hearing</dt>
                <dd className="mt-1 text-site-on-dark">
                  {formatDateTime(caseRecord.next_hearing_date)}
                </dd>
              </div>
              <div>
                <dt className="text-site-on-dark-muted">Court station</dt>
                <dd className="mt-1 text-site-on-dark">{caseRecord.court_station}</dd>
              </div>
              {caseRecord.holding_location ? (
                <div>
                  <dt className="text-site-on-dark-muted">Holding location</dt>
                  <dd className="mt-1 text-site-on-dark">
                    {caseRecord.holding_location}
                  </dd>
                </div>
              ) : null}
            </dl>
            <p className="mt-6 text-xs leading-5 text-site-on-dark-muted">
              This dashboard is read-only. SMS updates are sent to your
              registered phone when the clerk changes case status.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          <CaseStatsBar
            caseRecord={caseRecord}
            subscriberCount={subscriberCount}
            auditCount={auditLogs.length}
          />
          <AuditTimeline logs={auditLogs} />
        </div>
      </div>
    </SiteShell>
  );
}
