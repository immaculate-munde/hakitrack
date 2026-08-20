import {
  CaseRecord,
  STATUS_LABELS,
  formatCurrency,
  formatDate,
  maskName,
} from "@/lib/case-status";

export function ussdResponse(type: "CON" | "END", message: string): Response {
  return new Response(`${type} ${message}`, {
    headers: { "Content-Type": "text/plain" },
  });
}

export function formatCaseStatus(caseRecord: CaseRecord): string {
  const lines = [
    `Case ${caseRecord.case_number}`,
    `Status: ${STATUS_LABELS[caseRecord.current_status]}`,
  ];

  if (caseRecord.bail_amount !== null) {
    lines.push(`Bail: ${formatCurrency(caseRecord.bail_amount)}`);
  }

  if (caseRecord.next_hearing_date) {
    lines.push(`Next: ${formatDate(caseRecord.next_hearing_date)}`);
  }

  lines.push(`Court: ${shortenCourt(caseRecord.court_station)}`);

  if (caseRecord.holding_location) {
    lines.push(`Held: ${shortenLocation(caseRecord.holding_location)}`);
  }

  lines.push("");
  lines.push("1=SMS reminder  0=Exit");

  return lines.join("\n").slice(0, 182);
}

export function formatCaseNotFound(): string {
  return "Case not found.\nVerify case number.\n\n1=Try again  0=Exit";
}

export function formatSubscribeSuccess(): string {
  return "END You will receive an SMS reminder before the next hearing. Asante.";
}

export function formatGoodbye(): string {
  return "END Asante kwa kutumia HakiTrack.";
}

export function formatRetryPrompt(): string {
  return "CON Enter case number:\n(e.g. CR2026089)";
}

export function formatWelcome(): string {
  return "CON Karibu HakiTrack.\nEnter case number:\n(e.g. CR2026089)";
}

function shortenCourt(name: string): string {
  return name.replace(" Law Courts", "").replace(" Courts", "").slice(0, 24);
}

function shortenLocation(name: string): string {
  return name.replace(" Remand", "").slice(0, 28);
}

export function previewUssdText(caseRecord: CaseRecord): string {
  return [
    `Defendant: ${maskName(caseRecord.defendant_name)}`,
    formatCaseStatus(caseRecord),
  ].join("\n");
}
