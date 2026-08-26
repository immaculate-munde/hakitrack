import {
  defaultPetitionGuidance,
  truncateForSms,
} from "@/lib/case-context";
import { CaseRecord, STATUS_LABELS, type CaseStatus } from "@/lib/case-status";
import { kenyaLawSearchUrl } from "@/lib/kenya-law";
import { familyCaseUrl } from "@/lib/site-url";

export function formatCaseContextSms(
  caseRecord: Pick<
    CaseRecord,
    | "id"
    | "case_number"
    | "current_status"
    | "proceedings_summary"
    | "last_ruling_summary"
    | "sentence_outcome"
    | "petition_guidance"
    | "kenya_law_url"
  >,
  headline: string,
): string {
  const parts = [`HakiTrack: ${headline}`, `Case ${caseRecord.case_number}`];

  if (caseRecord.proceedings_summary) {
    parts.push(`Proceedings: ${truncateForSms(caseRecord.proceedings_summary)}`);
  }
  if (caseRecord.last_ruling_summary) {
    parts.push(`Ruling: ${truncateForSms(caseRecord.last_ruling_summary, 100)}`);
  }
  if (caseRecord.sentence_outcome) {
    parts.push(`Outcome: ${truncateForSms(caseRecord.sentence_outcome, 100)}`);
  }

  const petition =
    caseRecord.petition_guidance ??
    defaultPetitionGuidance(caseRecord.case_number);
  parts.push(`Next steps: ${truncateForSms(petition, 140)}`);
  parts.push(`Details: ${familyCaseUrl(caseRecord.id)}`);
  parts.push(
    `Kenya Law: ${caseRecord.kenya_law_url ?? kenyaLawSearchUrl(caseRecord.case_number)}`,
  );

  return parts.join("\n").slice(0, 900);
}

export function formatStatusChangeSms(
  caseRecord: Pick<
    CaseRecord,
    | "id"
    | "case_number"
    | "current_status"
    | "proceedings_summary"
    | "last_ruling_summary"
    | "sentence_outcome"
    | "petition_guidance"
    | "kenya_law_url"
  >,
  newStatus: CaseStatus,
): string {
  const statusLabel = STATUS_LABELS[newStatus];
  const hasContext =
    caseRecord.proceedings_summary ||
    caseRecord.last_ruling_summary ||
    caseRecord.sentence_outcome;

  if (hasContext) {
    return formatCaseContextSms(
      caseRecord,
      `Status updated to ${statusLabel}.`,
    );
  }

  return `HakiTrack: Case ${caseRecord.case_number} status updated to ${statusLabel}. View: ${familyCaseUrl(caseRecord.id)}`;
}
