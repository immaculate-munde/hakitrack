/** Kenya Law deep links — no official public case-tracking API exists. */
const KENYA_LAW_BASE = "https://kenyalaw.org";

export function kenyaLawSearchUrl(caseNumber: string): string {
  const query = caseNumber.replace(/-/g, " ").trim();
  return `${KENYA_LAW_BASE}/?s=${encodeURIComponent(query)}`;
}

export function kenyaLawCauseListUrl(): string {
  return `${KENYA_LAW_BASE}/cause-list`;
}

export const KENYA_LAW_ABOUT = {
  title: "Kenya Law",
  description:
    "The National Council for Law Reporting (Kenya Law) is the official source of Law Reports and Consolidated Laws of Kenya — including judgments, legislation, and cause lists.",
  href: KENYA_LAW_BASE,
} as const;
