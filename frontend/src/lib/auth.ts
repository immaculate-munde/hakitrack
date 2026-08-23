import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_COOKIE,
  FAMILY_AUTH_COOKIE,
} from "@/lib/auth-constants";
import {
  createFamilyToken,
  getClerkToken,
  parseFamilyToken,
} from "@/lib/auth-tokens";
import {
  normalizeCaseNumber,
  normalizePhoneForDb,
} from "@/lib/case-status";
import { createServiceClient } from "@/lib/supabase/server";

export { AUTH_COOKIE, FAMILY_AUTH_COOKIE };
export { createFamilyToken, parseFamilyToken };

export type FamilyMember = {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
};

export function verifyPin(pin: string): boolean {
  const expected = process.env.CLERK_PIN ?? "1234";
  return pin === expected;
}

export function setClerkAuthCookie(response: NextResponse): NextResponse {
  response.cookies.set(AUTH_COOKIE, getClerkToken(), cookieOptions());
  return response;
}

export function setFamilyAuthCookie(
  response: NextResponse,
  memberId: string,
  phone: string,
): NextResponse {
  response.cookies.set(
    FAMILY_AUTH_COOKIE,
    createFamilyToken(memberId, normalizePhoneForDb(phone)),
    cookieOptions(),
  );
  return response;
}

export function clearClerkAuthCookie(response: NextResponse): NextResponse {
  response.cookies.delete(AUTH_COOKIE);
  return response;
}

export function clearFamilyAuthCookie(response: NextResponse): NextResponse {
  response.cookies.delete(FAMILY_AUTH_COOKIE);
  return response;
}

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}

export async function isClerkAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE)?.value === getClerkToken();
}

export async function getFamilySession(): Promise<{
  memberId: string;
  phone: string;
} | null> {
  const cookieStore = await cookies();
  return parseFamilyToken(cookieStore.get(FAMILY_AUTH_COOKIE)?.value);
}

export function isClerkAuthenticatedRequest(request: NextRequest): boolean {
  return request.cookies.get(AUTH_COOKIE)?.value === getClerkToken();
}

export function getFamilySessionFromRequest(
  request: NextRequest,
): { memberId: string; phone: string } | null {
  return parseFamilyToken(request.cookies.get(FAMILY_AUTH_COOKIE)?.value);
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

export async function getFamilyMember(
  memberId: string,
): Promise<FamilyMember | null> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("family_members")
    .select("id, full_name, email, phone_number")
    .eq("id", memberId)
    .maybeSingle();

  return (data as FamilyMember | null) ?? null;
}

export async function registerFamilyMember(
  fullName: string,
  email: string,
  phone: string,
): Promise<{ memberId: string; phone: string } | { error: string }> {
  const supabase = createServiceClient();
  const normalizedPhone = normalizePhoneForDb(phone);
  const normalizedEmail = email.trim().toLowerCase();
  const trimmedName = fullName.trim();

  if (!trimmedName || !normalizedEmail || !normalizedPhone) {
    return { error: "Name, email, and phone are required." };
  }

  const { data: existing } = await supabase
    .from("family_members")
    .select("id")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (existing) {
    const { data, error } = await supabase
      .from("family_members")
      .update({
        full_name: trimmedName,
        phone_number: normalizedPhone,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id)
      .select("id, phone_number")
      .single();

    if (error || !data) {
      return { error: "Could not update your account. Try again." };
    }

    return { memberId: data.id, phone: data.phone_number };
  }

  const { data, error } = await supabase
    .from("family_members")
    .insert({
      full_name: trimmedName,
      email: normalizedEmail,
      phone_number: normalizedPhone,
    })
    .select("id, phone_number")
    .single();

  if (error || !data) {
    return { error: "Could not create your account. Try again." };
  }

  return { memberId: data.id, phone: data.phone_number };
}

export async function verifyFamilyCaseAccess(
  caseId: string,
  phone: string,
): Promise<boolean> {
  const supabase = createServiceClient();
  const normalizedPhone = normalizePhoneForDb(phone);

  const { data: caseRecord } = await supabase
    .from("cases")
    .select("id, family_contact_phone")
    .eq("id", caseId)
    .maybeSingle();

  if (!caseRecord) return false;

  if (caseRecord.family_contact_phone === normalizedPhone) {
    return true;
  }

  const { data: subscriber } = await supabase
    .from("case_subscribers")
    .select("id")
    .eq("case_id", caseId)
    .eq("phone_number", normalizedPhone)
    .maybeSingle();

  return Boolean(subscriber);
}

export async function subscribePhoneToCase(
  caseId: string,
  phone: string,
): Promise<void> {
  const supabase = createServiceClient();
  const normalizedPhone = normalizePhoneForDb(phone);

  await supabase.from("case_subscribers").upsert(
    {
      case_id: caseId,
      phone_number: normalizedPhone,
    },
    { onConflict: "case_id,phone_number" },
  );
}

export async function lookupFamilyCase(
  phone: string,
  caseNumber: string,
): Promise<{ caseId: string } | { error: string }> {
  const supabase = createServiceClient();
  const normalized = normalizeCaseNumber(caseNumber);
  const normalizedPhone = normalizePhoneForDb(phone);

  const { data: caseRecord, error } = await supabase
    .from("cases")
    .select("id, family_contact_phone")
    .eq("case_number_normalized", normalized)
    .maybeSingle();

  if (error || !caseRecord) {
    return { error: "Case not found. Check the case number and try again." };
  }

  const phoneAllowed =
    caseRecord.family_contact_phone === normalizedPhone ||
    (await supabase
      .from("case_subscribers")
      .select("id")
      .eq("case_id", caseRecord.id)
      .eq("phone_number", normalizedPhone)
      .maybeSingle()).data;

  if (!phoneAllowed) {
    return {
      error:
        "Your phone is not linked to this case yet. Ask the court clerk to register your number, or subscribe via USSD (*384*XYZ#).",
    };
  }

  await subscribePhoneToCase(caseRecord.id, normalizedPhone);

  return { caseId: caseRecord.id };
}

// Backward-compatible aliases
export const isAuthenticated = isClerkAuthenticated;
export const isAuthenticatedRequest = isClerkAuthenticatedRequest;
export const setAuthCookie = setClerkAuthCookie;
export const clearAuthCookie = clearClerkAuthCookie;
