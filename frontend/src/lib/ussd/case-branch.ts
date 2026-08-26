import {
  normalizeCaseNumber,
  normalizePhoneForDb,
  type CaseRecord,
} from "@/lib/case-status";
import { sendSMS } from "@/lib/sms";
import { createServiceClient } from "@/lib/supabase/server";
import {
  formatCaseStatus,
  formatGoodbye,
  formatSubscribeConfirmSms,
  ussdResponse,
  USSD_COPY,
} from "@/lib/ussd/formatters";
import type { Lang } from "@/lib/ussd/language";

export async function handleCaseBranch(
  steps: string[],
  lang: Lang,
  phoneNumber: string,
): Promise<Response> {
  if (steps.length === 0) {
    return ussdResponse("CON", USSD_COPY.casePrompt[lang], lang);
  }

  if (steps.length === 1) {
    if (steps[0] === "0") {
      return ussdResponse("END", formatGoodbye(lang), lang);
    }
    return handleCaseLookup(steps[0], lang);
  }

  if (steps.length === 2) {
    const [rawCaseNumber, action] = steps;
    if (action === "0") {
      return ussdResponse("END", formatGoodbye(lang), lang);
    }
    if (action === "1") {
      return handleSubscribe(rawCaseNumber, phoneNumber, lang);
    }
    return ussdResponse("END", formatGoodbye(lang), lang);
  }

  return ussdResponse("END", formatGoodbye(lang), lang);
}

async function handleCaseLookup(
  rawCaseNumber: string,
  lang: Lang,
): Promise<Response> {
  const supabase = createServiceClient();
  const normalized = normalizeCaseNumber(rawCaseNumber);

  const { data: caseRecord, error } = await supabase
    .from("cases")
    .select("*")
    .eq("case_number_normalized", normalized)
    .maybeSingle();

  if (error) {
    console.error("[USSD] Lookup error:", error);
    return ussdResponse("CON", USSD_COPY.serviceUnavailable[lang], lang);
  }

  if (!caseRecord) {
    return ussdResponse("CON", USSD_COPY.caseNotFound[lang], lang);
  }

  return ussdResponse(
    "CON",
    formatCaseStatus(caseRecord as CaseRecord, lang),
    lang,
  );
}

async function handleSubscribe(
  rawCaseNumber: string,
  phoneNumber: string,
  lang: Lang,
): Promise<Response> {
  const supabase = createServiceClient();
  const normalized = normalizeCaseNumber(rawCaseNumber);
  const phone = normalizePhoneForDb(phoneNumber);

  const { data: caseRecord } = await supabase
    .from("cases")
    .select("id, case_number, next_hearing_date, court_station, current_status")
    .eq("case_number_normalized", normalized)
    .maybeSingle();

  if (!caseRecord) {
    return ussdResponse("CON", USSD_COPY.caseNotFound[lang], lang);
  }

  if (!caseRecord.next_hearing_date) {
    return ussdResponse("END", USSD_COPY.noHearing[lang], lang);
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
    return ussdResponse("END", USSD_COPY.subscribeFailed[lang], lang);
  }

  const smsMessage = formatSubscribeConfirmSms(
    caseRecord as Pick<
      CaseRecord,
      "case_number" | "next_hearing_date" | "court_station" | "current_status"
    >,
    lang,
  );
  await sendSMS(phoneNumber, smsMessage);

  return ussdResponse("END", USSD_COPY.subscribeSuccess[lang], lang);
}
