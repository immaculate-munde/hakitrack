import { NextRequest, NextResponse } from "next/server";
import {
  getFamilySessionFromRequest,
  lookupFamilyCase,
  unauthorizedResponse,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = getFamilySessionFromRequest(request);

  if (!session) {
    return unauthorizedResponse();
  }

  const body = await request.json();
  const caseNumber = String(body.case_number ?? "").trim();

  if (!caseNumber) {
    return NextResponse.json(
      { error: "Case number is required." },
      { status: 400 },
    );
  }

  const result = await lookupFamilyCase(session.phone, caseNumber);

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 403 });
  }

  return NextResponse.json({ success: true, caseId: result.caseId });
}
