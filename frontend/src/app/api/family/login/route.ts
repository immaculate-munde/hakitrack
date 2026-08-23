import { NextRequest, NextResponse } from "next/server";
import {
  authenticateFamilyLogin,
  setFamilyAuthCookie,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const caseNumber = String(body.case_number ?? "").trim();
  const phone = String(body.phone ?? "").trim();

  if (!caseNumber || !phone) {
    return NextResponse.json(
      { error: "Case number and phone are required." },
      { status: 400 },
    );
  }

  const result = await authenticateFamilyLogin(caseNumber, phone);

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  return setFamilyAuthCookie(response, result.caseId, phone);
}
