import { NAV_HINT } from "@/lib/ussd/navigation";

export type Lang = "sw" | "en";

export type Branch = "case" | "rights" | "legalaid" | "helplines" | "root";

export const LANG_FOOTER: Record<Lang, string> = {
  sw: "(Kiingereza: *9)",
  en: "(Kiswahili: *9)",
};

export function parseLanguage(text: string): { text: string; lang: Lang } {
  const parts = text.split("*");
  const lang: Lang = parts.includes("9") ? "en" : "sw";
  const filtered = parts.filter((part) => part !== "9");
  return { text: filtered.join("*"), lang };
}

export function parseSession(text: string): {
  branch: Branch;
  steps: string[];
  lang: Lang;
} {
  const { text: cleanText, lang } = parseLanguage(text);

  if (!cleanText) {
    return { branch: "root", steps: [], lang };
  }

  const parts = cleanText.split("*");
  const rootChoice = parts[0];
  const steps = parts.slice(1).filter((part) => part.length > 0);

  switch (rootChoice) {
    case "1":
      return { branch: "case", steps, lang };
    case "2":
      return { branch: "rights", steps, lang };
    case "3":
      return { branch: "legalaid", steps, lang };
    case "4":
      return { branch: "helplines", steps, lang };
    case "0":
      return { branch: "root", steps: ["0"], lang };
    default:
      return { branch: "root", steps: [], lang };
  }
}

export function withLangFooter(
  message: string,
  lang: Lang,
  type: "CON" | "END",
  showNav = true,
): string {
  if (type === "END") return message.slice(0, 182);
  const parts = [message];
  if (showNav) {
    parts.push(NAV_HINT[lang]);
  }
  parts.push(LANG_FOOTER[lang]);
  return parts.join("\n").slice(0, 182);
}
