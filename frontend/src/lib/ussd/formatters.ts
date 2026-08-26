import {
  CaseRecord,
  CaseStatus,
  formatCurrency,
  formatDate,
  maskName,
} from "@/lib/case-status";
import type { Lang } from "@/lib/ussd/language";
import { withLangFooter } from "@/lib/ussd/language";
import { formatResourceLinksBlock } from "@/lib/ussd/resource-links";

export function ussdResponse(
  type: "CON" | "END",
  message: string,
  lang: Lang = "sw",
  options?: { showNav?: boolean },
): Response {
  const body =
    type === "CON"
      ? withLangFooter(message, lang, "CON", options?.showNav ?? true)
      : message.slice(0, 182);
  return new Response(`${type} ${body}`, {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

const STATUS_LABELS_I18N: Record<CaseStatus, Record<Lang, string>> = {
  REMANDED: { sw: "Amefungwa", en: "Remanded" },
  BAIL_SET: { sw: "Dhamana imewekwa", en: "Bail Set" },
  BAIL_POSTED: { sw: "Dhamana imelipwa", en: "Bail Posted" },
  HEARING_SCHEDULED: { sw: "Kesi imeratibiwa", en: "Hearing Scheduled" },
  DISCHARGED: { sw: "Ameachiliwa", en: "Discharged" },
  TRANSFERRED: { sw: "Amehamishwa", en: "Transferred" },
};

export const USSD_COPY = {
  welcome: {
    sw: "Karibu HakiTrack\n1. Angalia kesi\n2. Haki zako\n3. Msaada wa kisheria\n4. Simu za msaada\n0. Toka",
    en: "Welcome to HakiTrack\n1. Case status\n2. Know your rights\n3. Find legal aid\n4. Helplines\n0. Exit",
  },
  goodbye: {
    sw: "Asante kwa kutumia HakiTrack.",
    en: "Thank you for using HakiTrack.",
  },
  casePrompt: {
    sw: "Weka nambari ya kesi:\n(mf. CR2026089)",
    en: "Enter case number:\n(e.g. CR2026089)",
  },
  caseNotFound: {
    sw: "Kesi haijapatikana.\nThibitisha nambari.\n1. Jaribu tena",
    en: "Case not found.\nVerify number.\n1. Try again",
  },
  serviceUnavailable: {
    sw: "Huduma haipatikani.\nJaribu tena baadaye.",
    en: "Service unavailable.\nTry again later.",
  },
  subscribeSuccess: {
    sw: "Umesajiliwa! SMS ya uthibitisho imetumwa kwenye simu yako. Asante.",
    en: "Subscribed! A confirmation SMS was sent to your phone. Thank you.",
  },
  noHearing: {
    sw: "Hakuna kesi iliyoratibiwa bado.",
    en: "No hearing scheduled for this case yet.",
  },
  subscribeFailed: {
    sw: "Imeshindikana kuhifadhi. Jaribu tena.",
    en: "Could not save subscription. Try again.",
  },
  smsReminderPrompt: {
    sw: "1=SMS kumbukumbu\n(Kesi + mabadiliko ya hali)",
    en: "1=SMS alerts\n(hearing + status updates)",
  },
  caseLabels: {
    status: { sw: "Hali", en: "Status" },
    bail: { sw: "Dhamana", en: "Bail" },
    next: { sw: "Ifuatayo", en: "Next" },
    court: { sw: "Mahakama", en: "Court" },
    held: { sw: "Mahali", en: "Held" },
    case: { sw: "Kesi", en: "Case" },
  },
} as const;

export function formatCaseStatus(caseRecord: CaseRecord, lang: Lang): string {
  const labels = USSD_COPY.caseLabels;
  const lines = [
    `${labels.case[lang]} ${caseRecord.case_number}`,
    `${labels.status[lang]}: ${STATUS_LABELS_I18N[caseRecord.current_status][lang]}`,
  ];

  if (caseRecord.bail_amount !== null) {
    lines.push(`${labels.bail[lang]}: ${formatCurrency(caseRecord.bail_amount)}`);
  }

  if (caseRecord.next_hearing_date) {
    lines.push(
      `${labels.next[lang]}: ${formatDate(caseRecord.next_hearing_date)}`,
    );
  }

  lines.push(`${labels.court[lang]}: ${shortenCourt(caseRecord.court_station)}`);

  if (caseRecord.holding_location) {
    lines.push(`${labels.held[lang]}: ${shortenLocation(caseRecord.holding_location)}`);
  }

  lines.push("");
  lines.push(USSD_COPY.smsReminderPrompt[lang]);

  return lines.join("\n").slice(0, 160);
}

export function formatWelcome(lang: Lang): string {
  return USSD_COPY.welcome[lang];
}

export function formatGoodbye(lang: Lang): string {
  return USSD_COPY.goodbye[lang];
}

export function formatSubscribeConfirmSms(
  caseRecord: Pick<
    CaseRecord,
    "case_number" | "next_hearing_date" | "court_station" | "current_status"
  >,
  lang: Lang,
): string {
  const hearing = formatDate(caseRecord.next_hearing_date);
  const court = shortenCourt(caseRecord.court_station);
  const status = STATUS_LABELS_I18N[caseRecord.current_status][lang];

  if (lang === "sw") {
    return `HakiTrack - SMS Alerts:\nUmesajiliwa kwa kesi ${caseRecord.case_number}.\nHali: ${status}\nKesi: ${hearing}, ${court}\n\nUtapata:\n• Kumbukumbu siku kabla ya kesi\n• Taarifa wakati hali inabadilika\n\n${formatResourceLinksBlock("sw")}`;
  }

  return `HakiTrack - SMS Alerts:\nSubscribed to case ${caseRecord.case_number}.\nStatus: ${status}\nHearing: ${hearing}, ${court}\n\nYou will receive:\n• Reminder 1 day before hearing\n• Alerts when status changes\n\n${formatResourceLinksBlock("en")}`;
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
    formatCaseStatus(caseRecord, "sw"),
    formatCaseStatus(caseRecord, "en"),
  ].join("\n\n");
}
