// frontend/src/lib/ussd/session.ts
import { handleCaseBranch } from "@/lib/ussd/case-branch";
import { formatGoodbye, formatWelcome, ussdResponse } from "@/lib/ussd/formatters";
import { handleHelplinesBranch } from "@/lib/ussd/helplines-content";
import { handleLegalAidBranch } from "@/lib/ussd/legalaid-content";
import { applyNavigation } from "@/lib/ussd/navigation";
import { handleRightsBranch } from "@/lib/ussd/rights-content";
import { parseSession, type Branch } from "@/lib/ussd/language";

export type UssdInput = {
  sessionId: string;
  serviceCode: string;
  phoneNumber: string;
  text: string;
};

export type { Branch };

export { parseSession };

export async function handleUssdSession(input: UssdInput): Promise<Response> {
  const parsed = parseSession(input.text ?? "");
  const nav = applyNavigation(parsed.branch, parsed.steps);

  if (nav.type === "main_menu") {
    return ussdResponse("CON", formatWelcome(parsed.lang), parsed.lang, {
      showNav: false,
    });
  }

  const branch = nav.branch;
  const steps = nav.steps;
  const lang = parsed.lang;

  switch (branch) {
    case "case":
      return handleCaseBranch(steps, lang, input.phoneNumber);
    case "rights":
      return handleRightsBranch(steps, lang, input.phoneNumber);
    case "legalaid":
      return handleLegalAidBranch(steps, lang, input.phoneNumber);
    case "helplines":
      return handleHelplinesBranch(steps, lang, input.phoneNumber);
    case "root":
    default:
      if (steps[0] === "0") {
        return ussdResponse("END", formatGoodbye(lang), lang);
      }
      return ussdResponse("CON", formatWelcome(lang), lang, { showNav: false });
  }
}
