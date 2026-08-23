import { NextRequest, NextResponse } from "next/server";
import {
  getFamilySessionFromRequest,
  unauthorizedResponse,
  verifyFamilyCaseAccess,
} from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const session = getFamilySessionFromRequest(request);

  if (!session) {
    return unauthorizedResponse();
  }

  const allowed = await verifyFamilyCaseAccess(session.caseId, session.phone);
  if (!allowed) {
    return unauthorizedResponse();
  }

  const supabase = createServiceClient();

  const { data: caseRecord, error } = await supabase
    .from("cases")
    .select(
      "id, case_number, defendant_name, court_station, current_status, bail_amount, next_hearing_date, holding_location, judge_name, last_updated",
    )
    .eq("id", session.caseId)
    .maybeSingle();

  if (error || !caseRecord) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  }

  const { data: auditLogs } = await supabase
    .from("case_audit_log")
    .select("id, old_status, new_status, changed_at")
    .eq("case_id", session.caseId)
    .order("changed_at", { ascending: false })
    .limit(10);

  return NextResponse.json({
    case: caseRecord,
    auditLogs: auditLogs ?? [],
  });
}
