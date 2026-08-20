export const dynamic = "force-dynamic";

import { AuditTimeline } from "@/components/admin/AuditTimeline";
import { CaseHeroCard } from "@/components/admin/CaseHeroCard";
import { CaseStatsBar } from "@/components/admin/CaseStatsBar";
import { CaseUpdatePanel } from "@/components/admin/CaseUpdatePanel";
import { AdminShell } from "@/components/layout/AdminShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { isAuthenticated } from "@/lib/auth";
import { AuditLogRecord, CaseRecord } from "@/lib/case-status";
import { createServiceClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const supabase = createServiceClient();

  const { data: caseRecord } = await supabase
    .from("cases")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!caseRecord) {
    notFound();
  }

  const [{ count: subscriberCount }, { data: auditLogs }] = await Promise.all([
    supabase
      .from("case_subscribers")
      .select("*", { count: "exact", head: true })
      .eq("case_id", id),
    supabase
      .from("case_audit_log")
      .select("*")
      .eq("case_id", id)
      .order("changed_at", { ascending: false }),
  ]);

  return (
    <AdminShell>
      <PageHeader
        title={caseRecord.case_number}
        subtitle={`${caseRecord.defendant_name} · ${caseRecord.court_station}`}
        backHref="/admin"
        backLabel="Back to Registry"
      />

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <CaseHeroCard caseRecord={caseRecord as CaseRecord} />
        <CaseUpdatePanel caseRecord={caseRecord as CaseRecord} />
      </div>

      <div className="mt-6 space-y-6">
        <CaseStatsBar
          caseRecord={caseRecord as CaseRecord}
          subscriberCount={subscriberCount ?? 0}
          auditCount={auditLogs?.length ?? 0}
        />
        <AuditTimeline logs={(auditLogs ?? []) as AuditLogRecord[]} />
      </div>
    </AdminShell>
  );
}
