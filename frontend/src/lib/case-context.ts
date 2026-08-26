import { getCaseType } from "@/lib/case-status";

/** Default petition / next-steps guidance when clerk has not entered custom text. */
export function defaultPetitionGuidance(caseNumber: string): string {
  const type = getCaseType(caseNumber);

  if (type === "Criminal" || caseNumber.toUpperCase().startsWith("CR")) {
    return [
      "If convicted, you may appeal to the High Court within 14 days of sentencing.",
      "File a notice of appeal at the trial court registry and request a record of proceedings.",
      "Apply for bail pending appeal where applicable.",
      "Consult NLAS (0800720640) or Kituo Cha Sheria (0800720529) for legal aid.",
    ].join(" ");
  }

  return [
    "Review the court orders from the last hearing before taking next steps.",
    "File applications or appeals within the timelines stated in the court order.",
    "Contact a lawyer or legal aid provider if you need help preparing a petition.",
  ].join(" ");
}

export function truncateForSms(text: string, max = 120): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length <= max) return cleaned;
  return `${cleaned.slice(0, max - 1)}…`;
}
