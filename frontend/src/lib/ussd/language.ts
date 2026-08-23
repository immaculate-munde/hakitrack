export type Lang = "sw" | "en";

export type Branch = "case" | "rights" | "legalaid" | "root";

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
  const steps = parts.slice(1);

  switch (rootChoice) {
    case "1":
      return { branch: "case", steps, lang };
    case "2":
      return { branch: "rights", steps, lang };
    case "3":
      return { branch: "legalaid", steps, lang };
    case "0":
      return { branch: "root", steps: ["0"], lang };
    default:
      return { branch: "root", steps: [], lang };
  }
}

export function withLangFooter(message: string, lang: Lang, type: "CON" | "END"): string {
  if (type === "END") return message;
  const combined = `${message}\n${LANG_FOOTER[lang]}`;
  return combined.slice(0, 182);
}
