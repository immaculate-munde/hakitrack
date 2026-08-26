import type { Lang } from "@/lib/ussd/language";

export type HelplineCategory = "legal" | "family" | "emergency";

export type Helpline = {
  id: string;
  name: Record<Lang, string>;
  phone: string;
  category: HelplineCategory;
  notes: Record<Lang, string>;
};

export const HELPLINES: Helpline[] = [
  {
    id: "nlas",
    name: { sw: "NLAS (Msaada wa Kisheria)", en: "NLAS (State Legal Aid)" },
    phone: "0800720640",
    category: "legal",
    notes: {
      sw: "Huduma rasmi ya serikali — ushauri na uwakilishi",
      en: "Official government legal aid service",
    },
  },
  {
    id: "kituo",
    name: { sw: "Kituo Cha Sheria", en: "Kituo Cha Sheria" },
    phone: "0800720529",
    category: "legal",
    notes: {
      sw: "Msaada wa kisheria kwa jamii dhaifu",
      en: "Legal aid for vulnerable communities",
    },
  },
  {
    id: "lrf",
    name: { sw: "Legal Resources Foundation", en: "Legal Resources Foundation" },
    phone: "0722209848",
    category: "legal",
    notes: {
      sw: "Kliniki za kisheria na paralegals",
      en: "Legal aid clinics and paralegals",
    },
  },
  {
    id: "fida",
    name: { sw: "FIDA Kenya", en: "FIDA Kenya" },
    phone: "0800720501",
    category: "family",
    notes: {
      sw: "Haki za wanawake, familia, na GBV",
      en: "Women's rights, family law, and GBV",
    },
  },
  {
    id: "childline",
    name: { sw: "Child Helpline Kenya", en: "Child Helpline Kenya" },
    phone: "116",
    category: "family",
    notes: {
      sw: "Msaada kwa watoto walio hatarini",
      en: "Support for children at risk",
    },
  },
  {
    id: "police",
    name: { sw: "Polisi / Dharura", en: "Police / Emergency" },
    phone: "999",
    category: "emergency",
    notes: {
      sw: "Ripoti dharura au uhalifu unaotokea",
      en: "Report emergencies or active crime",
    },
  },
  {
    id: "ambulance",
    name: { sw: "Ambulensi", en: "Ambulance" },
    phone: "112",
    category: "emergency",
    notes: {
      sw: "Msaada wa matibabu ya dharura",
      en: "Emergency medical assistance",
    },
  },
];

export const HELPLINE_CATEGORIES: Record<
  HelplineCategory,
  { title: Record<Lang, string>; description: Record<Lang, string> }
> = {
  legal: {
    title: { sw: "Msaada wa kisheria", en: "Legal aid" },
    description: {
      sw: "Simu za bure za ushauri na uwakilishi wa kisheria",
      en: "Toll-free legal advice and representation",
    },
  },
  family: {
    title: { sw: "Wanawake na familia", en: "Women & family" },
    description: {
      sw: "Msaada wa familia, wanawake, na watoto",
      en: "Family, women's rights, and child support",
    },
  },
  emergency: {
    title: { sw: "Dharura", en: "Emergency" },
    description: {
      sw: "Simu za dharura za polisi na matibabu",
      en: "Police and medical emergency numbers",
    },
  },
};

export function helplinesByCategory(category: HelplineCategory): Helpline[] {
  return HELPLINES.filter((line) => line.category === category);
}

export function formatHelplineList(category: HelplineCategory, lang: Lang): string {
  return helplinesByCategory(category)
    .map((line) => `${line.name[lang]}: ${line.phone}`)
    .join("\n");
}

export function formatAllHelplinesSms(lang: Lang): string {
  const sections = (["legal", "family", "emergency"] as HelplineCategory[]).map(
    (category) => {
      const header = HELPLINE_CATEGORIES[category].title[lang];
      const lines = formatHelplineList(category, lang);
      return `${header}:\n${lines}`;
    },
  );
  return `HakiTrack - Simu za Msaada:\n\n${sections.join("\n\n")}`;
}
