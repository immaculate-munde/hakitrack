export const CASE_STATUSES = [
  "REMANDED",
  "BAIL_SET",
  "BAIL_POSTED",
  "HEARING_SCHEDULED",
  "DISCHARGED",
  "TRANSFERRED",
] as const;

export type CaseStatus = (typeof CASE_STATUSES)[number];

export const STATUS_LABELS: Record<CaseStatus, string> = {
  REMANDED: "Remanded",
  BAIL_SET: "Bail Set",
  BAIL_POSTED: "Bail Posted",
  HEARING_SCHEDULED: "Hearing Scheduled",
  DISCHARGED: "Discharged",
  TRANSFERRED: "Transferred",
};

export type CaseRecord = {
  id: string;
  case_number: string;
  case_number_normalized: string;
  defendant_name: string;
  court_station: string;
  current_status: CaseStatus;
  bail_amount: number | null;
  next_hearing_date: string | null;
  holding_location: string | null;
  judge_name: string | null;
  notes: string | null;
  family_contact_phone: string | null;
  proceedings_summary: string | null;
  last_ruling_summary: string | null;
  sentence_outcome: string | null;
  petition_guidance: string | null;
  kenya_law_url: string | null;
  last_updated: string;
};

export type AuditLogRecord = {
  id: string;
  case_id: string;
  old_status: CaseStatus | null;
  new_status: CaseStatus;
  changed_at: string;
  note: string | null;
};

export function normalizeCaseNumber(input: string): string {
  return input.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}

/** Minimum length for a real case reference (avoids treating menu key "1" as a case). */
export function isValidCaseNumberInput(input: string): boolean {
  return normalizeCaseNumber(input).length >= 4;
}

export function normalizePhone(phone: string): string {
  let formatted = String(phone).replace(/\D/g, "");
  if (formatted.startsWith("0")) {
    formatted = "254" + formatted.substring(1);
  }
  if (!formatted.startsWith("254") && formatted.length === 9) {
    formatted = "254" + formatted;
  }
  return "+" + formatted;
}

export function normalizePhoneForDb(phone: string): string {
  return normalizePhone(phone).replace("+", "");
}

export function maskName(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => (part.length <= 1 ? part : `${part[0]}${"*".repeat(Math.min(part.length - 1, 3))}`))
    .join(" ");
}

export function formatCurrency(amount: number | null): string {
  if (amount === null) return "N/A";
  return `KES ${amount.toLocaleString("en-KE")}`;
}

export function formatDate(date: string | null): string {
  if (!date) return "Not scheduled";
  return new Date(date).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(date: string | null): string {
  if (!date) return "Not scheduled";
  return new Date(date).toLocaleString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function daysUntil(date: string | null): number | null {
  if (!date) return null;
  const target = new Date(date);
  const now = new Date();
  target.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function getCaseType(caseNumber: string): string {
  const prefix = caseNumber.split("-")[0]?.toUpperCase() ?? "CASE";
  const labels: Record<string, string> = {
    CR: "Criminal",
    HCC: "High Court Civil",
    HCCR: "Criminal Appeal",
  };
  return labels[prefix] ?? prefix;
}
