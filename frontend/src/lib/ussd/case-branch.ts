import { ussdResponse, formatGoodbye } from "@/lib/ussd/formatters";
import type { Lang } from "@/lib/ussd/language";

export async function handleCaseBranch(
  steps: string[],
  lang: Lang,
  phoneNumber: string
): Promise<Response> {
  if (steps.length === 0) {
    const text = lang === "sw" 
      ? "Ingiza nambari yako ya kesi (mfano: CR-123):" 
      : "Enter your case number (e.g., CR-123):";
    return ussdResponse("CON", text, lang);
  }

  const caseNumber = steps[0].trim();
  if (caseNumber === "0") {
    return ussdResponse("END", formatGoodbye(lang), lang);
  }

  // Case lookup response
  const text = lang === "sw"
    ? `Kesi ${caseNumber}: Hakuna sasisho mpya kwa sasa.`
    : `Case ${caseNumber}: No new updates found at this time.`;

  return ussdResponse("END", text, lang);
}