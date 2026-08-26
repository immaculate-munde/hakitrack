import {
  isValidCaseNumberInput,
  normalizeCaseNumber,
  normalizePhoneForDb,
  type CaseRecord,
} from "@/lib/case-status";
import { sendSMS } from "@/lib/sms";
import { createServiceClient } from "@/lib/supabase/server";
import {
  formatCaseStatus,
  formatSubscribeConfirmSms,
  ussdResponse,
  USSD_COPY,
} from "@/lib/ussd/formatters";
import {
  getUssdIdentity,
  logUssdCaseAccess,
  upsertUssdIdentity,
  verifyDefendantName,
  type VerificationMethod,
} from "@/lib/ussd/kyc";
import type { Lang } from "@/lib/ussd/language";

type CaseContext = {
  id: string;
  case_number: string;
  defendant_name: string;
  family_contact_phone: string | null;
  next_hearing_date: string | null;
  court_station: string;
  current_status: CaseRecord["current_status"];
  bail_amount: number | null;
  holding_location: string | null;
};

export async function handleCaseBranch(
  steps: string[],
  lang: Lang,
  phoneNumber: string,
): Promise<Response> {
  if (
    steps.length >= 2 &&
    steps[steps.length - 1] === "1" &&
    steps[steps.length - 2] === "1"
  ) {
    return ussdResponse("CON", USSD_COPY.subscribeSuccess[lang], lang);
  }

  const subscribeRequested = isSubscribeRequest(steps);
  const kycSteps = subscribeRequested ? steps.slice(0, -1) : steps;

  if (kycSteps.length === 0 || !isValidCaseNumberInput(kycSteps[0] ?? "")) {
    return ussdResponse("CON", USSD_COPY.casePrompt[lang], lang);
  }

  const caseRecord = await fetchCase(kycSteps[0]);
  if (!caseRecord) {
    return ussdResponse("CON", USSD_COPY.caseNotFound[lang], lang);
  }

  const phone = normalizePhoneForDb(phoneNumber);
  const identity = await getUssdIdentity(phoneNumber);
  const clerkVerified = caseRecord.family_contact_phone === phone;

  const kycResult = await resolveKyc(kycSteps, {
    caseRecord,
    identity,
    clerkVerified,
    lang,
    phoneNumber,
  });

  if (kycResult.type === "prompt") {
    return ussdResponse("CON", kycResult.message, lang);
  }

  if (kycResult.type === "failed") {
    return ussdResponse("CON", kycResult.message, lang);
  }

  if (!subscribeRequested) {
    await logUssdCaseAccess({
      caseId: caseRecord.id,
      phoneNumber,
      callerName: kycResult.callerName,
      method: kycResult.method,
    });
  }

  if (subscribeRequested) {
    return handleSubscribe(
      caseRecord,
      phoneNumber,
      kycResult.callerName,
      kycResult.method,
      lang,
    );
  }

  return ussdResponse(
    "CON",
    formatCaseStatus(caseRecord as CaseRecord, lang),
    lang,
  );
}

async function fetchCase(rawCaseNumber: string): Promise<CaseContext | null> {
  const supabase = createServiceClient();
  const normalized = normalizeCaseNumber(rawCaseNumber);

  const { data, error } = await supabase
    .from("cases")
    .select(
      "id, case_number, defendant_name, family_contact_phone, next_hearing_date, court_station, current_status, bail_amount, holding_location",
    )
    .eq("case_number_normalized", normalized)
    .maybeSingle();

  if (error) {
    console.error("[USSD] Lookup error:", error);
    return null;
  }

  return (data as CaseContext | null) ?? null;
}

type KycContext = {
  caseRecord: CaseContext;
  identity: Awaited<ReturnType<typeof getUssdIdentity>>;
  clerkVerified: boolean;
  lang: Lang;
  phoneNumber: string;
};

type KycResult =
  | { type: "prompt"; message: string }
  | { type: "failed"; message: string }
  | {
      type: "verified";
      callerName: string;
      method: "defendant_name" | "clerk_phone";
    };

async function resolveKyc(
  kycSteps: string[],
  ctx: KycContext,
): Promise<KycResult> {
  const { caseRecord, identity, clerkVerified, lang, phoneNumber } = ctx;

  if (clerkVerified) {
    if (!identity) {
      if (kycSteps.length === 1) {
        return { type: "prompt", message: USSD_COPY.kycNamePrompt[lang] };
      }

      const callerName = kycSteps[1]?.trim() ?? "";
      if (!callerName) {
        return { type: "prompt", message: USSD_COPY.kycNamePrompt[lang] };
      }

      await upsertUssdIdentity(phoneNumber, callerName);
      return {
        type: "verified",
        callerName,
        method: "clerk_phone",
      };
    }

    if (kycSteps.length === 1) {
      return {
        type: "verified",
        callerName: identity.full_name,
        method: "clerk_phone",
      };
    }

    return {
      type: "verified",
      callerName: identity.full_name,
      method: "clerk_phone",
    };
  }

  if (!identity) {
    if (kycSteps.length === 1) {
      return { type: "prompt", message: USSD_COPY.kycNamePrompt[lang] };
    }

    const callerName = kycSteps[1]?.trim() ?? "";
    if (!callerName) {
      return { type: "prompt", message: USSD_COPY.kycNamePrompt[lang] };
    }

    if (kycSteps.length === 2) {
      return { type: "prompt", message: USSD_COPY.kycDefendantPrompt[lang] };
    }

    const defendantInput = getDefendantAnswer(kycSteps);
    if (!defendantInput) {
      return { type: "prompt", message: USSD_COPY.kycDefendantPrompt[lang] };
    }

    if (!verifyDefendantName(defendantInput, caseRecord.defendant_name)) {
      return { type: "failed", message: USSD_COPY.kycFailed[lang] };
    }

    await upsertUssdIdentity(phoneNumber, callerName);
    return {
      type: "verified",
      callerName,
      method: "defendant_name",
    };
  }

  if (kycSteps.length === 1) {
    return { type: "prompt", message: USSD_COPY.kycDefendantPrompt[lang] };
  }

  const defendantInput = getDefendantAnswer(kycSteps);
  if (!defendantInput) {
    return { type: "prompt", message: USSD_COPY.kycDefendantPrompt[lang] };
  }

  if (!verifyDefendantName(defendantInput, caseRecord.defendant_name)) {
    return { type: "failed", message: USSD_COPY.kycFailed[lang] };
  }

  return {
    type: "verified",
    callerName: identity.full_name,
    method: "defendant_name",
  };
}

/** Defendant answer is always the last step after the case number. */
function getDefendantAnswer(kycSteps: string[]): string {
  if (kycSteps.length < 2) {
    return "";
  }

  return kycSteps[kycSteps.length - 1]?.trim() ?? "";
}

/** SMS subscribe — only after a valid case number, not when "1" is the case input. */
function isSubscribeRequest(steps: string[]): boolean {
  if (steps.length < 2 || steps[steps.length - 1] !== "1") {
    return false;
  }

  const caseInput = steps[0] ?? "";
  return isValidCaseNumberInput(caseInput);
}

async function handleSubscribe(
  caseRecord: CaseContext,
  phoneNumber: string,
  callerName: string,
  method: VerificationMethod,
  lang: Lang,
): Promise<Response> {
  if (!caseRecord.next_hearing_date) {
    return ussdResponse("CON", USSD_COPY.noHearing[lang], lang);
  }

  const supabase = createServiceClient();
  const phone = normalizePhoneForDb(phoneNumber);

  const { error } = await supabase.from("case_subscribers").upsert(
    {
      case_id: caseRecord.id,
      phone_number: phone,
      caller_name: callerName,
      kyc_verified_at: new Date().toISOString(),
    },
    { onConflict: "case_id,phone_number" },
  );

  if (error) {
    console.error("[USSD] Subscribe error:", error);
    return ussdResponse("CON", USSD_COPY.subscribeFailed[lang], lang);
  }

  await logUssdCaseAccess({
    caseId: caseRecord.id,
    phoneNumber,
    callerName,
    method,
  });

  const smsMessage = formatSubscribeConfirmSms(caseRecord, lang);
  await sendSMS(phoneNumber, smsMessage);

  return ussdResponse("CON", USSD_COPY.subscribeSuccess[lang], lang);
}
