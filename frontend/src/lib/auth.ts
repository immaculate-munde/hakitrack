import crypto from "crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE } from "@/lib/auth-constants";

export { AUTH_COOKIE };

function getAuthToken(): string {
  const secret = process.env.AUTH_SECRET ?? "dev-secret";
  return crypto.createHmac("sha256", secret).update("clerk-authenticated").digest("hex");
}

export function verifyPin(pin: string): boolean {
  const expected = process.env.CLERK_PIN ?? "1234";
  return pin === expected;
}

export function setAuthCookie(response: NextResponse): NextResponse {
  response.cookies.set(AUTH_COOKIE, getAuthToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
}

export function clearAuthCookie(response: NextResponse): NextResponse {
  response.cookies.delete(AUTH_COOKIE);
  return response;
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE)?.value === getAuthToken();
}

export function isAuthenticatedRequest(request: NextRequest): boolean {
  return request.cookies.get(AUTH_COOKIE)?.value === getAuthToken();
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function verifyCronSecret(request: NextRequest): boolean {
  const secret = request.headers.get("authorization");
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;
  return secret === `Bearer ${expected}`;
}
