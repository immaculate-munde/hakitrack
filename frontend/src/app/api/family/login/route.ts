import { NextRequest, NextResponse } from "next/server";
import { registerFamilyMember, setFamilyAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const fullName = String(body.name ?? body.full_name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();

  if (!fullName || !email || !phone) {
    return NextResponse.json(
      { error: "Name, email, and phone are required." },
      { status: 400 },
    );
  }

  const result = await registerFamilyMember(fullName, email, phone);

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const response = NextResponse.json({ success: true });
  return setFamilyAuthCookie(response, result.memberId, result.phone);
}
