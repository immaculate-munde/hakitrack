import { normalizeCaseNumber, normalizePhoneForDb } from "@/lib/case-status";
import { sendSMS } from "@/lib/sms";
import { createServiceClient } from "@/lib/supabase/server";
import {
  formatCaseStatus,
  formatGoodbye,
  formatWelcome,
  ussdResponse,
  USSD_COPY,
} from "@/lib/ussd/formatters";
import {
  getCaseTypeByKey,
  getCountyByKey,
  LEGAL_AID_COPY,
  type LegalAidProvider,
} from "@/lib/ussd/legalaid-content";
import type { Lang } from "@/lib/ussd/language";
import { parseSession } from "@/lib/ussd/language";
import {
  getRightsContentKey,
  RIGHTS_MENU,
} from "@/lib/ussd/rights-content";

type UssdInput = {
  sessionId: string;
  serviceCode: string;
  phoneNumber: string;
  text: string;
};

export async function handleUssdSession(input: UssdInput): Promise<Response> {
  const { branch, steps, lang } = parseSession(input.text ?? "");

  if (branch === "root") {
    if (steps[0] === "0") {
      return ussdResponse("END", formatGoodbye(lang), lang);
    }
    return ussdResponse("CON", formatWelcome(lang), lang);
  }

  switch (branch) {
    case "case":
      return handleCaseBranch(steps, lang, input.phoneNumber);
    case "rights":
      return handleRightsBranch(steps, lang);
    case "legalaid":
      return handleLegalAidBranch(steps, lang, input.phoneNumber);
    default:
      return ussdResponse("END", formatGoodbye(lang), lang);
  }
}

async function handleCaseBranch(
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
    return handleCaseLookup(steps[0]!, lang);
  }

  if (steps.length === 2) {
    const [rawCaseNumber, action] = steps;
    if (action === "0") {
      return ussdResponse("END", formatGoodbye(lang), lang);
    }
    if (action === "1") {
      return handleSubscribe(rawCaseNumber!, phoneNumber, lang);
    }
    return ussdResponse("END", formatGoodbye(lang), lang);
  }

  return ussdResponse("END", formatGoodbye(lang), lang);
}

function handleRightsBranch(steps: string[], lang: Lang): Response {
  if (steps.length === 0) {
    return ussdResponse("CON", RIGHTS_MENU.root[lang], lang);
  }

  const choice = steps[0];
  if (choice === "0") {
    return ussdResponse("END", formatGoodbye(lang), lang);
  }

  const key = getRightsContentKey(choice ?? "");
  return ussdResponse("END", RIGHTS_MENU[key][lang], lang);
}

async function handleLegalAidBranch(
  steps: string[],
  lang: Lang,
  phoneNumber: string,
): Promise<Response> {
  if (steps.length === 0) {
    return ussdResponse("CON", LEGAL_AID_COPY.countyMenu[lang], lang);
  }

  const countyChoice = steps[0];

  if (countyChoice === "0") {
    await sendLegalAidSMS(phoneNumber, null, lang);
    return ussdResponse("END", LEGAL_AID_COPY.smsSent[lang], lang);
  }

  const county = getCountyByKey(countyChoice ?? "");
  if (!county) {
    return ussdResponse("CON", LEGAL_AID_COPY.countyMenu[lang], lang);
  }

  if (steps.length === 1) {
    return ussdResponse("CON", LEGAL_AID_COPY.caseTypeMenu[lang], lang);
  }

  const caseType = getCaseTypeByKey(steps[1] ?? "");
  if (!caseType) {
    return ussdResponse("CON", LEGAL_AID_COPY.caseTypeMenu[lang], lang);
  }

  const providers = await getProvidersByCountyAndType(county, caseType);

  if (providers.length === 0) {
    await sendLegalAidSMS(phoneNumber, county, lang);
    return ussdResponse("END", LEGAL_AID_COPY.noProviders[lang], lang);
  }

  const body = formatLegalAidResult(providers, lang);
  return ussdResponse("END", body, lang);
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

  return ussdResponse("CON", formatCaseStatus(caseRecord, lang), lang);
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
    .select("id, next_hearing_date")
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

  return ussdResponse("END", USSD_COPY.subscribeSuccess[lang], lang);
}

async function getProvidersByCountyAndType(
  county: string,
  caseType: string,
): Promise<LegalAidProvider[]> {
  const supabase = createServiceClient();

  let query = supabase
    .from("legal_aid_providers")
    .select("*")
    .eq("active", true)
    .or(`county.eq.${county},county.eq.All`);

  if (caseType !== "general") {
    query = query.contains("case_types", [caseType]);
  }

  const { data, error } = await query.order("name").limit(4);

  if (error) {
    console.error("[USSD] Legal aid query error:", error);
    return [];
  }

  return (data ?? []) as LegalAidProvider[];
}

async function getAllActiveProviders(county: string | null): Promise<LegalAidProvider[]> {
  const supabase = createServiceClient();

  let query = supabase.from("legal_aid_providers").select("*").eq("active", true);

  if (county) {
    query = query.or(`county.eq.${county},county.eq.All`);
  }

  const { data, error } = await query.order("name");

  if (error) {
    console.error("[USSD] Legal aid list error:", error);
    return [];
  }

  return (data ?? []) as LegalAidProvider[];
}

function formatLegalAidResult(providers: LegalAidProvider[], lang: Lang): string {
  const header = LEGAL_AID_COPY.providersHeader[lang];
  const footer = LEGAL_AID_COPY.callFree[lang];
  const lines = providers
    .slice(0, 3)
    .map((provider) => `${provider.name} - ${provider.phone_number}`);
  return `${header}\n${lines.join("\n")}\n${footer}`.slice(0, 182);
}

async function sendLegalAidSMS(
  phone: string,
  county: string | null,
  lang: Lang,
): Promise<void> {
  const providers = await getAllActiveProviders(county);
  const countyLabel = county ?? (lang === "sw" ? "Kenya" : "Kenya");
  const body = providers
    .map((provider) => `${provider.name}: ${provider.phone_number}`)
    .join("\n");

  const prefix =
    lang === "sw"
      ? `HakiTrack - Msaada wa Kisheria (${countyLabel}):\n`
      : `HakiTrack - Legal Aid (${countyLabel}):\n`;

  await sendSMS(phone, `${prefix}${body}`);
}
