import { normalizePhoneForDb } from "@/lib/case-status";
import { createServiceClient } from "@/lib/supabase/server";

export type UssdIdentity = {
  phone_number: string;
  full_name: string;
};

export type VerificationMethod = "defendant_name" | "clerk_phone";

export function verifyDefendantFirstName(
  input: string,
  defendantName: string,
): boolean {
  const normalize = (value: string) =>
    value.trim().toLowerCase().replace(/[^a-z]/g, "");

  const given = normalize(input);
  const expected = normalize(defendantName.split(/\s+/)[0] ?? "");

  if (given.length < 2 || expected.length < 2) {
    return false;
  }

  return (
    given === expected ||
    expected.startsWith(given) ||
    given.startsWith(expected)
  );
}

export async function getUssdIdentity(
  phoneNumber: string,
): Promise<UssdIdentity | null> {
  const supabase = createServiceClient();
  const phone = normalizePhoneForDb(phoneNumber);

  const { data } = await supabase
    .from("ussd_identities")
    .select("phone_number, full_name")
    .eq("phone_number", phone)
    .maybeSingle();

  return (data as UssdIdentity | null) ?? null;
}

export async function upsertUssdIdentity(
  phoneNumber: string,
  fullName: string,
): Promise<void> {
  const supabase = createServiceClient();
  const phone = normalizePhoneForDb(phoneNumber);
  const trimmedName = fullName.trim();

  if (!trimmedName) return;

  const { data: existing } = await supabase
    .from("ussd_identities")
    .select("id")
    .eq("phone_number", phone)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("ussd_identities")
      .update({
        full_name: trimmedName,
        last_seen_at: new Date().toISOString(),
      })
      .eq("phone_number", phone);
    return;
  }

  await supabase.from("ussd_identities").insert({
    phone_number: phone,
    full_name: trimmedName,
  });
}

export async function logUssdCaseAccess(input: {
  caseId: string;
  phoneNumber: string;
  callerName: string;
  method: VerificationMethod;
}): Promise<void> {
  const supabase = createServiceClient();

  await supabase.from("ussd_case_access").insert({
    case_id: input.caseId,
    phone_number: normalizePhoneForDb(input.phoneNumber),
    caller_name: input.callerName.trim(),
    verification_method: input.method,
  });
}
