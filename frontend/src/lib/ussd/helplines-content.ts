import {
  formatAllHelplinesSms,
  formatHelplineList,
  HELPLINE_CATEGORIES,
  type HelplineCategory,
} from "@/lib/helplines";
import { sendSMS } from "@/lib/sms";
import { ussdResponse } from "@/lib/ussd/formatters";
import type { Lang } from "@/lib/ussd/language";
import { formatResourceLinksBlock } from "@/lib/ussd/resource-links";

const CATEGORY_KEYS: Record<string, HelplineCategory> = {
  "1": "legal",
  "2": "family",
  "3": "emergency",
};

export const HELPLINES_MENU = {
  root: {
    sw: "Simu za Msaada:\n1. Msaada wa kisheria\n2. Wanawake na familia\n3. Dharura\n4. Tuma orodha (SMS)\n0. Toka",
    en: "Helplines:\n1. Legal aid\n2. Women & family\n3. Emergency\n4. Send full list (SMS)\n0. Exit",
  },
} as const;

const EXIT: Record<Lang, string> = {
  sw: "Asante kwa kutumia HakiTrack.",
  en: "Thank you for using HakiTrack.",
};

export async function handleHelplinesBranch(
  steps: string[],
  lang: Lang,
  phoneNumber: string,
): Promise<Response> {
  const exitHint = lang === "sw" ? "0=Toka" : "0=Exit";

  if (steps.length >= 2 && steps[steps.length - 1] === "0") {
    return ussdResponse("END", EXIT[lang], lang);
  }

  if (steps.length === 0) {
    return ussdResponse("CON", HELPLINES_MENU.root[lang], lang);
  }

  const choice = steps[0];

  if (choice === "0") {
    return ussdResponse("END", EXIT[lang], lang);
  }

  if (choice === "4") {
    if (steps.length === 1) {
      const smsBody = `${formatAllHelplinesSms(lang)}\n\n${formatResourceLinksBlock(lang)}`;
      await sendSMS(phoneNumber, smsBody);
    }
    const text =
      lang === "sw"
        ? "Orodha kamili ya simu za msaada imetumwa kwa SMS."
        : "Full helpline list sent to your phone via SMS.";
    return ussdResponse("CON", `${text}\n${exitHint}`, lang);
  }

  const category = CATEGORY_KEYS[choice];
  if (!category) {
    const invalid =
      lang === "sw"
        ? "Chaguo si sahihi."
        : "Invalid choice.";
    return ussdResponse("CON", `${invalid}\n\n${HELPLINES_MENU.root[lang]}`, lang);
  }

  const meta = HELPLINE_CATEGORIES[category];
  const lines = formatHelplineList(category, lang);

  if (steps.length === 1) {
    const smsBody = `HakiTrack - ${meta.title[lang]}:\n${lines}\n\n${formatResourceLinksBlock(lang)}`;
    await sendSMS(phoneNumber, smsBody);
  }

  const smsNote =
    lang === "sw" ? "Maelezo zaidi vimetumwa kwa SMS." : "Details sent via SMS.";

  return ussdResponse(
    "CON",
    `${meta.title[lang]}:\n${lines}\n${smsNote}\n${exitHint}`,
    lang,
  );
}
