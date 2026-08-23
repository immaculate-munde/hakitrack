import { NextResponse } from "next/server";
import { clearFamilyAuthCookie } from "@/lib/auth";

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  return clearFamilyAuthCookie(response);
}
