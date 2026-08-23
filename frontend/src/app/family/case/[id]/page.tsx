export const dynamic = "force-dynamic";

import { FamilyCaseView } from "@/components/family/FamilyCaseView";
import { getFamilySession, verifyFamilyCaseAccess } from "@/lib/auth";
import { AuditLogRecord, CaseRecord } from "@/lib/case-status";
import { createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export default async function FamilyCasePage({ params }: RouteContext) {
  const session = await getFamilySession();
  const { id } = await params;

  if (!session) {
    redirect("/family/login");
  }

  const allowed = await verifyFamilyCaseAccess(id, session.phone);
  if (!allowed) {
    redirect("/family");
  }

  const supabase = createServiceClient();

  const { data: caseRecord } = await supabase
    .from("cases")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!caseRecord) {
    redirect("/family");
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
    <FamilyCaseView
      caseRecord={caseRecord as CaseRecord}
      auditLogs={(auditLogs ?? []) as AuditLogRecord[]}
      subscriberCount={subscriberCount ?? 0}
    />
  );
}
