export const dynamic = "force-dynamic";

import { FamilyDashboard } from "@/components/family/FamilyDashboard";
import { getFamilySession } from "@/lib/auth";
import { AuditLogRecord, CaseRecord } from "@/lib/case-status";
import { createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function FamilyPage() {
  const session = await getFamilySession();

  if (!session) {
    redirect("/family/login");
  }

  const supabase = createServiceClient();

  const { data: caseRecord } = await supabase
    .from("cases")
    .select("*")
    .eq("id", session.caseId)
    .maybeSingle();

  if (!caseRecord) {
    redirect("/family/login");
  }

  const [{ count: subscriberCount }, { data: auditLogs }] = await Promise.all([
    supabase
      .from("case_subscribers")
      .select("*", { count: "exact", head: true })
      .eq("case_id", session.caseId),
    supabase
      .from("case_audit_log")
      .select("*")
      .eq("case_id", session.caseId)
      .order("changed_at", { ascending: false }),
  ]);

  return (
    <FamilyDashboard
      caseRecord={caseRecord as CaseRecord}
      auditLogs={(auditLogs ?? []) as AuditLogRecord[]}
      subscriberCount={subscriberCount ?? 0}
    />
  );
}
