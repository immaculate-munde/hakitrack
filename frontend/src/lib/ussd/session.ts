// frontend/src/lib/ussd/session.ts
import { handleCaseBranch } from "@/lib/ussd/case-branch";
import { formatGoodbye, formatWelcome, ussdResponse } from "@/lib/ussd/formatters";
import { handleLegalAidBranch } from "@/lib/ussd/legalaid-content";
import { handleRightsBranch } from "@/lib/ussd/rights-content";
import { Langar } from "next/font/google";

export type UssdInput = {
  sessionId: string;
  serviceCode: string;
  phoneNumber: string;
  text: string;
};

export type Branch = "case" | "rights" | "legalaid" | "root";

export function parseSession(text: string): { branch: Branch; steps: string[]; lang: "sw" | "en" } {
  let rawParts = (text ?? "").split("*").filter((p) => p.trim().length > 0);
  let lang: "sw" | "en" = "sw";

  if (rawParts.includes("9")) {
    lang = "en";
    rawParts = rawParts.filter((p) => p !== "9");
  }

  if (rawParts.length === 0) {
    return { branch: "root", steps: [], lang };
  }

  const rootChoice = rawParts[0];
  const steps = rawParts.slice(1);

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

export async function handleUssdSession(input: UssdInput): Promise<Response> {
  const { branch, steps, lang } = parseSession(input.text ?? "");

  switch (branch) {
    case "case":
      return handleCaseBranch(steps, lang, input.phoneNumber);
    case "rights":
      return handleRightsBranch(steps, lang);
    case "legalaid":
      return handleLegalAidBranch(steps, lang, input.phoneNumber);
    case "root":
    default:
      if (steps[0] === "0") {
        return ussdResponse("END", formatGoodbye(lang), lang);
      }
      return ussdResponse("CON", formatWelcome(lang),lang);
  }
}
