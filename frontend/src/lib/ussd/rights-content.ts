// frontend/src/lib/ussd/rights-content.ts
import { sendSMS } from "@/lib/sms";
import { ussdResponse } from "@/lib/ussd/formatters";
import type { Lang } from "@/lib/ussd/language";
import {
  formatResourceLinksBlock,
  RESOURCE_LINKS,
} from "@/lib/ussd/resource-links";

export { RESOURCE_LINKS as RIGHTS_LINKS };

type RightsTopic = "arrested" | "courtCase" | "general";

export const RIGHTS_MENU = {
  root: {
    sw: "Jua Haki Zako:\n1. Ukikamatwa\n2. Kesi mahakamani\n3. Dhamana na haki\n4. Haki za jumla",
    en: "Know Your Rights:\n1. If arrested\n2. In court\n3. Bail & bond\n4. General rights",
  },
  arrested: {
    sw: "Ukikamatwa (Ibara 49):\n- Sababu ya kukamatwa\n- Kunyamaza\n- Mawasiliano na familia/wakili\n- Mahakamani ndani ya masaa 24\n- Dhamana nafuu\nSMS yenye viungo imetumwa.",
    en: "If arrested (Art 49):\n- Reason for arrest\n- Remain silent\n- Contact family/lawyer\n- Court within 24 hours\n- Reasonable bail\nLinks sent via SMS.",
  },
  courtCase: {
    sw: "Kesi mahakamani (Ibara 50):\n- Chagua wakili wako\n- Kesi bila kuchelewa\n- Kujua mashtaka\n- Haki ya kukata rufaa\n- Usiwekwe chini ya duress\nSMS yenye viungo imetumwa.",
    en: "In court (Art 50):\n- Choose your lawyer\n- Trial without delay\n- Know the charges\n- Right to appeal\n- No forced confession\nLinks sent via SMS.",
  },
  bail: {
    sw: "Dhamana na bond:\n- Haki ya dhamana nafuu (Ibara 49)\n- Hakuna ubaguzi wa dhamana\n- Ombi la dhamana lweza kuwasilishwa\n- Fuata masharti ya mahakama\nSMS yenye viungo imetumwa.",
    en: "Bail & bond:\n- Right to reasonable bail (Art 49)\n- No discriminatory bail\n- You may apply for bail\n- Follow court conditions\nLinks sent via SMS.",
  },
  general: {
    sw: "Haki za Kikatiba:\n- Utu na heshima (Ibara 28)\n- Usawa mbele ya sheria (Ibara 27)\n- Usalama wa mtu (Ibara 29)\n- Haki ya kupata haki (Ibara 48)\nSMS yenye viungo imetumwa.",
    en: "Constitutional rights:\n- Dignity (Art 28)\n- Equality before law (Art 27)\n- Personal security (Art 29)\n- Access to justice (Art 48)\nLinks sent via SMS.",
  },
} as const;

export const SYSTEM_MESSAGES = {
  invalidChoice: {
    en: "Invalid choice. Please try again.",
    sw: "Chaguo si sahihi. Tafadhali jaribu tena.",
  },
};

const SMS_BODY: Record<RightsTopic | "bail", Record<Lang, string>> = {
  arrested: {
    sw: `HakiTrack - Ukikamatwa:\n• Jua sababu ya kukamatwa\n• Kunyamaza - hujibu maswali ya uchunguzi pekee\n• Omba wakili na waambie familia\n• Lazima upelekwe mahakamani ndani ya masaa 24\n• Una haki ya dhamana nafuu\n\n${formatResourceLinksBlock("sw")}`,
    en: `HakiTrack - If arrested:\n• Know why you are arrested\n• Remain silent - only answer identification\n• Ask for a lawyer; tell family\n• Must appear in court within 24 hours\n• Right to reasonable bail\n\n${formatResourceLinksBlock("en")}`,
  },
  courtCase: {
    sw: `HakiTrack - Kesi mahakamani:\n• Una haki ya wakili wa kuchagua\n• Kesi ifanyike bila kuchelewa\n• Lazima ufahamishwe mashtaka\n• Usilazimishwe kukiri uhalifu\n• Una haki ya rufaa\n\n${formatResourceLinksBlock("sw")}`,
    en: `HakiTrack - In court:\n• Right to a lawyer of your choice\n• Trial without unreasonable delay\n• Must be informed of charges\n• No forced confession\n• Right to appeal\n\n${formatResourceLinksBlock("en")}`,
  },
  bail: {
    sw: `HakiTrack - Dhamana na bond:\n• Dhamana haiwezi kuwa ya kiwango kisichofikiika\n• Hakuna ubaguzi wa jinsia/dhehebu/kijamii\n• Unaweza kuomba kupunguzwa kwa dhamana\n• Fuata masharti ya mahakama\n• Wasiliana na wakili au msaada wa kisheria\n\nSoma zaidi:\nNCAJ Dhamana: ${RESOURCE_LINKS.ncajBail}\nKituo cha Sheria: ${RESOURCE_LINKS.kituo}\nKenya Law: ${RESOURCE_LINKS.kenyaLaw}`,
    en: `HakiTrack - Bail & bond:\n• Bail must be reasonable, not excessive\n• No discrimination in setting bail\n• You may apply to reduce bail\n• Follow all court conditions\n• Contact a lawyer or legal aid\n\nLearn more:\nNCAJ Bail: ${RESOURCE_LINKS.ncajBail}\nKituo cha Sheria: ${RESOURCE_LINKS.kituo}\nKenya Law: ${RESOURCE_LINKS.kenyaLaw}`,
  },
  general: {
    sw: `HakiTrack - Haki za jumla:\n• Haki ya utu (Ibara 28)\n• Usawa mbele ya sheria (Ibara 27)\n• Usalama wa mtu (Ibara 29)\n• Haki ya kupata haki (Ibara 48)\n• Haki ya kufurahia haki na uhuru wa kimsingi\n\n${formatResourceLinksBlock("sw")}`,
    en: `HakiTrack - General rights:\n• Right to dignity (Art 28)\n• Equality before the law (Art 27)\n• Personal security (Art 29)\n• Access to justice (Art 48)\n• Bill of Rights applies to all\n\n${formatResourceLinksBlock("en")}`,
  },
};

export async function handleRightsBranch(
  steps: string[],
  lang: Lang,
  phoneNumber: string,
): Promise<Response> {
  if (steps.length === 0) {
    return ussdResponse("CON", RIGHTS_MENU.root[lang], lang);
  }

  const choice = steps[0];

  const keyMap: Record<string, keyof typeof RIGHTS_MENU> = {
    "1": "arrested",
    "2": "courtCase",
    "3": "bail",
    "4": "general",
  };

  const key = keyMap[choice];
  if (!key || key === "root") {
    return ussdResponse(
      "CON",
      `${SYSTEM_MESSAGES.invalidChoice[lang]}\n\n${RIGHTS_MENU.root[lang]}`,
      lang,
    );
  }

  if (steps.length === 1) {
    const smsKey = key as RightsTopic | "bail";
    await sendSMS(phoneNumber, SMS_BODY[smsKey][lang]);
  }

  return ussdResponse("CON", RIGHTS_MENU[key][lang], lang);
}
