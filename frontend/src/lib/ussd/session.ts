import { normalizeCaseNumber, normalizePhoneForDb } from "@/lib/case-status";
import { createServiceClient } from "@/lib/supabase/server";
import {
  formatCaseNotFound,
  formatCaseStatus,
  formatGoodbye,
  formatWelcome,
  ussdResponse,
} from "@/lib/ussd/formatters";

type UssdInput = {
  sessionId: string;
  serviceCode: string;
  phoneNumber: string;
  text: string;
};

export async function handleUssdSession(input: UssdInput): Promise<Response> {
  const parts = (input.text ?? "").split("*").filter((part) => part.length > 0);
  const level = parts.length;

  if (level === 0) {
    return ussdResponse("CON", formatWelcome());
  }

  if (level === 1) {
    return handleCaseLookup(parts[0]!);
  }

  if (level === 2) {
    const action = parts[1];
    if (action === "0") {
      return ussdResponse("END", formatGoodbye().replace("END ", ""));
    }
    if (action === "1") {
      return handleSubscribe(parts[0]!, input.phoneNumber);
    }
    return ussdResponse("END", formatGoodbye().replace("END ", ""));
  }

  return ussdResponse("END", formatGoodbye().replace("END ", ""));
}

async function handleCaseLookup(rawCaseNumber: string): Promise<Response> {
  const supabase = createServiceClient();
  const normalized = normalizeCaseNumber(rawCaseNumber);

  const { data: caseRecord, error } = await supabase
    .from("cases")
    .select("*")
    .eq("case_number_normalized", normalized)
    .maybeSingle();

  if (error) {
    console.error("[USSD] Lookup error:", error);
    return ussdResponse("CON", "Service unavailable.\nTry again later.\n\n0=Exit");
  }

  if (!caseRecord) {
    return ussdResponse("CON", formatCaseNotFound());
  }

  return ussdResponse("CON", formatCaseStatus(caseRecord));
}

async function handleSubscribe(
  rawCaseNumber: string,
  phoneNumber: string,
): Promise<Response> {
  const supabase = createServiceClient();
  const normalized = normalizeCaseNumber(rawCaseNumber);
  const phone = normalizePhoneForDb(phoneNumber);

  const { data: caseRecord } = await supabase
    .from("cases")
    .select("id, next_hearing_date")
    .eq("case_number_normalized", normalized)
    .maybeSingle();

  if (!caseRecord) {
    return ussdResponse("CON", formatCaseNotFound());
  }

  if (!caseRecord.next_hearing_date) {
    return ussdResponse("END", "No hearing scheduled for this case yet.");
  }

  const { error } = await supabase.from("case_subscribers").upsert(
    {
      case_id: caseRecord.id,
      phone_number: phone,
    },
    { onConflict: "case_id,phone_number" },
  );

  if (error) {
    console.error("[USSD] Subscribe error:", error);
    return ussdResponse("END", "Could not save subscription. Try again.");
  }

  return ussdResponse("END", "You will receive an SMS reminder before the next hearing. Asante.");
}
