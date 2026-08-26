import type { Lang } from "@/lib/ussd/language";

export const RESOURCE_LINKS = {
  kenyaLaw: "https://kenyalaw.org",
  kituo: "https://kituochasheria.or.ke",
  ncajBail: "https://www.ncaj.go.ke/campaigns/bail-and-bond-administration/",
} as const;

export function formatResourceLinksBlock(lang: Lang): string {
  if (lang === "sw") {
    return `Soma zaidi:\nKenya Law: ${RESOURCE_LINKS.kenyaLaw}\nKituo cha Sheria: ${RESOURCE_LINKS.kituo}\nNCAJ Dhamana: ${RESOURCE_LINKS.ncajBail}`;
  }
  return `Learn more:\nKenya Law: ${RESOURCE_LINKS.kenyaLaw}\nKituo cha Sheria: ${RESOURCE_LINKS.kituo}\nNCAJ Bail: ${RESOURCE_LINKS.ncajBail}`;
}
