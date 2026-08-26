import { createServiceClient } from "@/lib/supabase/server";
import { sendSMS } from "@/lib/sms";
import { ussdResponse } from "./formatters";
import type { Lang } from "./language";
import {
  formatResourceLinksBlock,
  RESOURCE_LINKS,
} from "@/lib/ussd/resource-links";

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

export const LEGAL_AID_MENU = {
  root: {
    sw: "Msaada wa Kisheria:\n1. Msaada wa kisheria ni nini?\n2. Nani anastahili?\n3. Tafuta msaada karibu\n0. Toka",
    en: "Legal Aid:\n1. What is legal aid?\n2. Who qualifies?\n3. Find help near you\n0. Exit",
  },
  about: {
    sw: "Msaada wa kisheria:\n- Msaada bure/kwa gharama nafuu\n- Kwa wasiojiweza kulipa wakili\n- NLAS na mashirika kama Kituo\n- Simu za bure zinapatikana\nSMS yenye viungo imetumwa.",
    en: "Legal aid:\n- Free or low-cost legal help\n- For those who cannot afford a lawyer\n- NLAS and NGOs like Kituo\n- Toll-free helplines available\nLinks sent via SMS.",
  },
  qualify: {
    sw: "Unastahili ikiwa:\n- Huwezi kulipa wakili\n- Kesi ya familia, ardhi, uhalifu\n- Ukiwa katika hatari au ukiwa dhaifu\n- Chini ya Sheria ya Msaada wa Kisheria 2016\nSMS yenye viungo imetumwa.",
    en: "You may qualify if:\n- You cannot afford a lawyer\n- Family, land, or criminal matter\n- You are vulnerable or at risk\n- Under the Legal Aid Act 2016\nLinks sent via SMS.",
  },
  county: {
    sw: "Chagua kaunti:\n1. Nairobi  2. Mombasa\n3. Kisumu  4. Nakuru\n0. Nyingine (SMS orodha)",
    en: "Select county:\n1. Nairobi  2. Mombasa\n3. Kisumu  4. Nakuru\n0. Other (SMS list)",
  },
  caseType: (county: string, lang: Lang) =>
    lang === "sw"
      ? `Aina ya kesi (${county}):\n1. Familia  2. Ardhi\n3. Uhalifu  4. Yote`
      : `Case type (${county}):\n1. Family  2. Land\n3. Criminal  4. All`,
} as const;

const SMS_BODY: Record<"about" | "qualify", Record<Lang, string>> = {
  about: {
    sw: `HakiTrack - Msaada wa Kisheria:\n• Msaada wa kisheria unatoa ushauri na uwakilishi kwa gharama nafuu au bure\n• NLAS (0800720640) ni huduma rasmi ya serikali\n• Kituo Cha Sheria (0800720529) hutoa msaada kwa jamii dhaifu\n• FIDA Kenya (0800720501) — haki za wanawake na familia\n\n${formatResourceLinksBlock("sw")}`,
    en: `HakiTrack - Legal Aid:\n• Legal aid provides advice and representation at low or no cost\n• NLAS (0800720640) is the official state service\n• Kituo Cha Sheria (0800720529) serves vulnerable communities\n• FIDA Kenya (0800720501) — women's and family rights\n\n${formatResourceLinksBlock("en")}`,
  },
  qualify: {
    sw: `HakiTrack - Nani anastahili?\n• Wasiojiweza kulipa wakili binafsi\n• Kesi za familia, ardhi, uhalifu, na haki za binadamu\n• Watoto, waliokamatwa, na waliokumbwa na GBV\n• Omba msaada kupitia NLAS au Kituo\n\n${formatResourceLinksBlock("sw")}`,
    en: `HakiTrack - Who qualifies?\n• Those who cannot afford a private lawyer\n• Family, land, criminal, and human rights cases\n• Children, detainees, and GBV survivors\n• Apply through NLAS or Kituo Cha Sheria\n\n${formatResourceLinksBlock("en")}`,
  },
};

export async function handleLegalAidBranch(
  steps: string[],
  lang: Lang,
  phoneNumber: string,
): Promise<Response> {
  if (steps.length === 0) {
    return ussdResponse("CON", LEGAL_AID_MENU.root[lang], lang);
  }

  const rootChoice = steps[0];

  if (rootChoice === "0") {
    const text =
      lang === "sw"
        ? "Asante kwa kutumia HakiTrack."
        : "Thank you for using HakiTrack.";
    return ussdResponse("END", text, lang);
  }

  if (rootChoice === "1") {
    await sendSMS(phoneNumber, SMS_BODY.about[lang]);
    return ussdResponse("END", LEGAL_AID_MENU.about[lang], lang);
  }

  if (rootChoice === "2") {
    await sendSMS(phoneNumber, SMS_BODY.qualify[lang]);
    return ussdResponse("END", LEGAL_AID_MENU.qualify[lang], lang);
  }

  if (rootChoice !== "3") {
    const invalidText =
      lang === "sw"
        ? "Chaguo si sahihi. Tafadhali jaribu tena."
        : "Invalid choice. Please try again.";
    return ussdResponse("END", invalidText, lang);
  }

  return handleProviderLookup(steps.slice(1), lang, phoneNumber);
}

async function handleProviderLookup(
  steps: string[],
  lang: Lang,
  phoneNumber: string,
): Promise<Response> {
  if (steps.length === 0) {
    return ussdResponse("CON", LEGAL_AID_MENU.county[lang], lang);
  }

  const countyChoice = steps[0];

  if (countyChoice === "0") {
    await sendLegalAidSMS(phoneNumber, "All Counties", lang);
    const smsSentText =
      lang === "sw"
        ? "Tumekutumia SMS yenye orodha ya msaada wa kisheria na viungo. Asante."
        : "We sent an SMS with legal aid providers and links. Thank you.";
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

  if (steps.length === 1) {
    return ussdResponse("CON", LEGAL_AID_MENU.caseType(county, lang), lang);
  }

  const caseTypeChoice = steps[1];
  const caseCategory = CASE_TYPES[caseTypeChoice] ?? "all";
  const providers = await getProviders(county, caseCategory);

  await sendLegalAidSMS(phoneNumber, county, lang, providers, caseCategory);

  const header =
    lang === "sw"
      ? `Msaada karibu nawe (${county}):`
      : `Legal aid near you (${county}):`;

  const providerLines = providers
    .slice(0, 3)
    .map((p) => `${p.name} - ${p.phone_number}`);

  const footer =
    lang === "sw"
      ? "Orodha kamili na viungo vimetumwa kwa SMS."
      : "Full list and links sent via SMS.";

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

    const { data, error } = await query.limit(5);

    if (error || !data || data.length === 0) {
      return FALLBACK_PROVIDERS.map((p) => ({
        name: p.name,
        phone_number: p.phone,
      }));
    }

    return data.map((d) => ({
      name: d.name,
      phone_number: d.phone_number,
    }));
  } catch (err) {
    console.error("[USSD Legal Aid] Database query failed, using fallback:", err);
    return FALLBACK_PROVIDERS.map((p) => ({
      name: p.name,
      phone_number: p.phone,
    }));
  }
}

async function sendLegalAidSMS(
  phoneNumber: string,
  county: string,
  lang: Lang,
  providers?: { name: string; phone_number: string }[],
  caseCategory = "all",
) {
  const list = providers ?? (await getProviders(county, caseCategory));
  const lines = list.map((p) => `${p.name}: ${p.phone_number}`);

  const intro =
    lang === "sw"
      ? `HakiTrack - Msaada wa Kisheria (${county}):\n`
      : `HakiTrack - Legal Aid (${county}):\n`;

  const tollFree =
    lang === "sw"
      ? "\n\nSimu za bure:\nNLAS: 0800720640\nKituo: 0800720529\nFIDA: 0800720501"
      : "\n\nToll-free:\nNLAS: 0800720640\nKituo: 0800720529\nFIDA: 0800720501";

  const links =
    lang === "sw"
      ? `\n\nSoma zaidi:\nKituo: ${RESOURCE_LINKS.kituo}\nKenya Law: ${RESOURCE_LINKS.kenyaLaw}\nNCAJ: ${RESOURCE_LINKS.ncajBail}`
      : `\n\nLearn more:\nKituo: ${RESOURCE_LINKS.kituo}\nKenya Law: ${RESOURCE_LINKS.kenyaLaw}\nNCAJ: ${RESOURCE_LINKS.ncajBail}`;

  await sendSMS(phoneNumber, intro + lines.join("\n") + tollFree + links);
}
