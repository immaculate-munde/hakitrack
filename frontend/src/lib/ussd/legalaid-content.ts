
import { createServiceClient } from "@/lib/supabase/server";
import { sendSMS } from "@/lib/sms";
import { ussdResponse } from "./formatters";
import { Lang } from "./language";  

const COUNTIES: Record<string, string> = {
  "1": "Nairobi",
  "2": "Mombasa",
  "3": "Kisumu",
  "4": "Nakuru",
};

const CASE_TYPES: Record<string, string> = {
  "1": "family",
  "2": "land",
  "3": "criminal",
  "4": "all",
};

const FALLBACK_PROVIDERS = [
  { name: "Kituo Cha Sheria", phone: "0800720529" },
  { name: "FIDA Kenya", phone: "0800720501" },
  { name: "NLAS (State Legal Aid)", phone: "0800720640" },
];

export async function handleLegalAidBranch(
  steps: string[],
  lang: "sw" | "en",
  phoneNumber: string
): Promise<Response> {
  // Step 0: Prompt for County Selection
  if (steps.length === 0) {
    const text = lang === "sw"
      ? "Chagua kaunti:\n1. Nairobi  2. Mombasa\n3. Kisumu  4. Nakuru\n0. Nyingine (SMS list)"
      : "Select county:\n1. Nairobi  2. Mombasa\n3. Kisumu  4. Nakuru\n0. Other (SMS list)";
    return ussdResponse("CON", text);
  }

  const countyChoice = steps[0];

  // If user selected 0 (Other), send SMS with full directory fallback
  if (countyChoice === "0") {
    await sendLegalAidSMS(phoneNumber, "All Counties");
    const smsSentText = lang === "sw"
      ? "Tumekutumia SMS yenye orodha ya msaada wa kisheria. Asante."
      : "We sent an SMS with legal aid providers. Thank you.";
    return ussdResponse("END", smsSentText, lang);
  }

  const county = COUNTIES[countyChoice];
  if (!county) {
    const invalidText =
      lang === "sw"
        ? "Chaguo si sahihi. Tafadhali jaribu tena."
        : "Invalid choice. Please try again.";
    return ussdResponse("END", invalidText, lang);
  }

  // Step 1: Prompt for Case Type Selection
  if (steps.length === 1) {
    const text = lang === "sw"
      ? `Aina ya kesi (${county}):\n1. Familia  2. Ardhi\n3. Uhalifu  4. Yote`
      : `Case type (${county}):\n1. Family  2. Land\n3. Criminal  4. All`;
    return ussdResponse("CON", text);
  }

  // Step 2: Query legal aid providers and display results
  const caseTypeChoice = steps[1];
  const caseCategory = CASE_TYPES[caseTypeChoice] ?? "all";

  const providers = await getProviders(county, caseCategory);

  const header = lang === "sw"
    ? `Msaada karibu nawe (${county}):`
    : `Legal aid near you (${county}):`;

  const providerLines = providers
    .slice(0, 3)
    ?.map((p) => `${p.name} - ${p.phone_number}`);

  const footer = lang === "sw" ? "Piga simu bure kwa msaada." : "Call toll-free for assistance.";

  const body = [header, ...providerLines, footer].join("\n").slice(0, 182);

  return ussdResponse("END", body, lang);
}

async function getProviders(county: string, caseCategory: string) {
  try {
    const supabase = createServiceClient();
    let query = supabase
      .from("legal_aid_providers")
      .select("name, phone_number, case_types")
      .eq("active", true);

    if (county !== "All Counties") {
      query = query.or(`county.eq.${county},county.eq.All`);
    }

    if (caseCategory !== "all") {
      query = query.contains("case_types", [caseCategory]);
    }

    const { data, error } = await query.limit(3);

    if (error || !data || data.length === 0) {
      return FALLBACK_PROVIDERS.map((p) => ({ name: p.name, phone_number: p.phone }));
    }

    return data.map((d) => ({ name: d.name, phone_number: d.phone_number }));
  } catch (err) {
    console.error("[USSD Legal Aid] Database query failed, using fallback:", err);
    return FALLBACK_PROVIDERS.map((p) => ({ name: p.name, phone_number: p.phone }));
  }
}

async function sendLegalAidSMS(phoneNumber: string, county: string) {
  const providers = await getProviders(county, "all");
  const lines = providers.map((p) => `${p.name}: ${p.phone_number}`);
  const message = `HakiTrack - Msaada wa Kisheria (${county}):\n` + lines.join("\n");
  await sendSMS(phoneNumber, message);
}





