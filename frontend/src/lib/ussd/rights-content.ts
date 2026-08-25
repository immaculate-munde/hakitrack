// frontend/src/lib/ussd/rights-content.ts
import { ussdResponse, formatGoodbye } from "@/lib/ussd/formatters";
import type { Lang } from "@/lib/ussd/language";
export const RIGHTS_MENU = {
  root: {
    sw: "Jua Haki Zako:\n1. Ukikamatwa na polisi\n2. Kesi kortini\n3. Haki za jumla\n0. Rudi / Ondoka",
    en: "Know Your Rights:\n1. If arrested by police\n2. In court\n3. General rights\n0. Back / Exit",
  },
  arrested: {
    sw: "Ukikamatwa una haki ya:\n-Kujua sababu ya kukamatwa \n- Kunyamaza (Ibara 49(1)(b))\n- Kuwasiliana na wakili (Ibara 49(1)(c))\n- Mahakamani masaa 24 (Ibara 49(1)(f))\n- Dhamana nafuu (Ibara 49(1)(h))",
    en: "If arrested you have the right to:\nKnow the reason for the arrest \n- Remain silent (Art 49(1)(b))\n- Communicate with lawyer (Art 49(1)(c))\n- Court within 24hrs (Art 49(1)(f))\n- Reasonable bail (Art 49(1)(h))",
  },
  courtCase: {
    sw: "Ukiwa na kesi mahakamani:\n- Haki ya wakili (Ibara 50(2)(g))\n- Kesi bila kuchelewa (Ibara 50(2)(e))\n- Dhamana isiyo na ubaguzi (Ibara 49(1)(h))",
    en: "If you have a court case:\n- Right to choose lawyer (Art 50(2)(g))\n- Trial without delay (Art 50(2)(e))\n- Right to reasonable bail (Art 49(1)(h))",
  },
  general: {
    sw: "Haki za Kikatiba (Sura ya 4):\n- Haki ya kuishi na utu (Ibara 26 & 28)\n- Usawa mbele ya sheria (Ibara 27)\n- Uhuru na usalama (Ibara 29)",
    en: "Constitutional Rights (Ch. 4):\n- Right to life & dignity (Art 26 & 28)\n- Equality before law (Art 27)\n- Freedom & security (Art 29)",
  },
} as const;

export const SYSTEM_MESSAGES = {
  exit: {
    en: "Thank you for using HakiTrack.",
    sw: "Asante kwa kutumia HakiTrack.",
  },
  invalidChoice: {
    en: "Invalid choice. Please try again.",
    sw: "Chaguo si sahihi. Tafadhali jaribu tena.",
  },
};

export function handleRightsBranch(steps: string[], lang: "sw" | "en"): Response {
  if (steps.length === 0) {
    return ussdResponse("CON", RIGHTS_MENU.root[lang], lang);
  }

  const choice = steps[0];

  if (choice === "0") {
    return ussdResponse("END", SYSTEM_MESSAGES.exit[lang], lang);
  }

  const keyMap: Record<string, keyof typeof RIGHTS_MENU> = {
    "1": "arrested",
    "2": "courtCase",
    "3": "general",
  };

  const key = keyMap[choice];
  if (!key) {
    return ussdResponse("END", SYSTEM_MESSAGES.invalidChoice[lang], lang);
  }

  return ussdResponse("END", RIGHTS_MENU[key][lang], lang);
}