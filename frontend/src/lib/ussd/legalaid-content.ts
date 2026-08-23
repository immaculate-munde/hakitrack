import type { Lang } from "@/lib/ussd/language";

export const COUNTY_OPTIONS = [
  { key: "1", county: "Nairobi", label: { sw: "Nairobi", en: "Nairobi" } },
  { key: "2", county: "Mombasa", label: { sw: "Mombasa", en: "Mombasa" } },
  { key: "3", county: "Kisumu", label: { sw: "Kisumu", en: "Kisumu" } },
  { key: "4", county: "Nakuru", label: { sw: "Nakuru", en: "Nakuru" } },
] as const;

export const CASE_TYPE_OPTIONS = [
  { key: "1", value: "family", label: { sw: "Familia", en: "Family" } },
  { key: "2", value: "land", label: { sw: "Ardhi", en: "Land" } },
  { key: "3", value: "criminal", label: { sw: "Uhalifu", en: "Criminal" } },
  { key: "4", value: "general", label: { sw: "Nyingine", en: "Other" } },
] as const;

export const LEGAL_AID_COPY = {
  countyMenu: {
    sw: "Chagua kaunti:\n1. Nairobi  2. Mombasa\n3. Kisumu  4. Nakuru\n0. Nyingine (SMS)",
    en: "Select county:\n1. Nairobi  2. Mombasa\n3. Kisumu  4. Nakuru\n0. Other (SMS)",
  },
  caseTypeMenu: {
    sw: "Aina ya kesi:\n1. Familia  2. Ardhi\n3. Uhalifu  4. Nyingine",
    en: "Case type:\n1. Family  2. Land\n3. Criminal  4. Other",
  },
  smsSent: {
    sw: "Orodha ya msaada wa kisheria imetumwa kwa SMS. Asante.",
    en: "Legal aid directory sent by SMS. Thank you.",
  },
  noProviders: {
    sw: "Hakuna mtoa huduma aliyepatikana. Tutatuma orodha kwa SMS.",
    en: "No providers found. We will send a directory by SMS.",
  },
  providersHeader: {
    sw: "Msaada karibu nawe:",
    en: "Help near you:",
  },
  callFree: {
    sw: "Piga simu kwa msaada.",
    en: "Call for assistance.",
  },
} as const satisfies Record<string, Record<Lang, string>>;

export function getCountyByKey(key: string): string | null {
  return COUNTY_OPTIONS.find((option) => option.key === key)?.county ?? null;
}

export function getCaseTypeByKey(key: string): string | null {
  return CASE_TYPE_OPTIONS.find((option) => option.key === key)?.value ?? null;
}

export type LegalAidProvider = {
  id: string;
  name: string;
  county: string;
  case_types: string[];
  phone_number: string;
  languages: string[];
  free: boolean;
  notes: string | null;
};
