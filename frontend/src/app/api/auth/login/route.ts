import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookie, setAuthCookie, verifyPin } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!verifyPin(body.pin ?? "")) {
    return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  return setAuthCookie(response);
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  return clearAuthCookie(response);
}
