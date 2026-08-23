import type { Lang } from "@/lib/ussd/language";

export const RIGHTS_MENU = {
  root: {
    sw: "Chagua hali yako:\n1. Nimekamatwa\n2. Nina kesi mahakamani\n3. Haki za jumla\n0. Toka",
    en: "Select your situation:\n1. I was arrested\n2. I have a court case\n3. General rights\n0. Exit",
  },
  arrested: {
    sw: "Ukikamatwa una haki ya:\n- Kupiga simu moja\n- Kunyamaza\n- Kuonana na wakili\n- Kufika mahakamani ndani ya masaa 24\n(Ibara ya 49, Katiba 2010)\n\nPiga *384*XYZ# tena kwa zaidi.",
    en: "If arrested you have the right to:\n- One phone call\n- Remain silent\n- See a lawyer\n- Appear in court within 24hrs\n(Article 49, Constitution 2010)\n\nDial *384*XYZ# again for more.",
  },
  courtCase: {
    sw: "Ukiwa na kesi una haki ya:\n- Wakili\n- Kesi ya haki na ya haraka\n- Dhamana isiyo na ubaguzi\n(Ibara ya 49(1)(h), Katiba 2010)\n\nPiga *384*XYZ# tena kwa zaidi.",
    en: "If you have a case you have the right to:\n- A lawyer\n- A fair, speedy trial\n- Reasonable bail\n(Article 49(1)(h), Constitution 2010)\n\nDial *384*XYZ# again for more.",
  },
  general: {
    sw: "Haki za msingi:\n- Usiwekwe kizuizini bila sababu ya kisheria\n- Usipigwe kelele au kutendewa vibaya\n- Upate msaada wa kisheria\n(Katiba ya Kenya 2010)\n\nPiga *384*XYZ# tena kwa zaidi.",
    en: "Basic rights:\n- No detention without legal cause\n- No torture or cruel treatment\n- Access to legal aid\n(Kenya Constitution 2010)\n\nDial *384*XYZ# again for more.",
  },
} as const satisfies Record<string, Record<Lang, string>>;

export type RightsContentKey = "arrested" | "courtCase" | "general";

export function getRightsContentKey(choice: string): RightsContentKey {
  switch (choice) {
    case "1":
      return "arrested";
    case "2":
      return "courtCase";
    case "3":
      return "general";
    default:
      return "general";
  }
}
