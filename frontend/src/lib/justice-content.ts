import { HELPLINES } from "@/lib/helplines";
import { RESOURCE_LINKS } from "@/lib/ussd/resource-links";

export type GuideSection = {
  id: string;
  title: string;
  summary: string;
  points: string[];
  articleRef?: string;
};

export const RESOURCE_LINK_ITEMS = [
  {
    name: "Kenya Law",
    href: RESOURCE_LINKS.kenyaLaw,
    description: "Constitution, statutes, and Kenyan legal resources.",
  },
  {
    name: "Kituo Cha Sheria",
    href: RESOURCE_LINKS.kituo,
    description: "Legal aid, human rights support, and community clinics.",
  },
  {
    name: "NCAJ — Bail & Bond",
    href: RESOURCE_LINKS.ncajBail,
    description: "National Council on the Administration of Justice bail guidance.",
  },
] as const;

export const TOLL_FREE_PROVIDERS = HELPLINES.filter((line) =>
  ["nlas", "kituo", "fida"].includes(line.id),
).map((line) => ({
  name: line.name.en,
  phone: line.phone,
}));

export const RIGHTS_SECTIONS: GuideSection[] = [
  {
    id: "arrested",
    title: "If you are arrested",
    summary:
      "Article 49 of the Constitution protects anyone taken into police custody.",
    articleRef: "Constitution of Kenya, Article 49",
    points: [
      "You must be told why you are being arrested.",
      "You have the right to remain silent — only answer questions about your identity.",
      "You may contact a lawyer and inform your family.",
      "You must be brought before a court within 24 hours of arrest.",
      "You have the right to reasonable bail or bond.",
    ],
  },
  {
    id: "court",
    title: "If you are in court",
    summary:
      "Article 50 guarantees a fair hearing for anyone facing criminal charges.",
    articleRef: "Constitution of Kenya, Article 50",
    points: [
      "You have the right to a lawyer of your choice.",
      "Your trial must not be unreasonably delayed.",
      "You must be informed of the charges against you in a language you understand.",
      "You cannot be forced to confess or plead guilty.",
      "You have the right to appeal if convicted.",
    ],
  },
  {
    id: "bail",
    title: "Bail and bond",
    summary:
      "Bail should be accessible and fair — not used to punish people before trial.",
    articleRef: "Constitution of Kenya, Article 49(1)(h)",
    points: [
      "Bail must be reasonable and not set at an impossible amount.",
      "Bail decisions must not discriminate by gender, religion, or social status.",
      "You may apply to the court to review or reduce bail.",
      "Follow all court conditions once bail is granted.",
      "Contact a lawyer or legal aid provider if bail is denied or too high.",
    ],
  },
  {
    id: "general",
    title: "General constitutional rights",
    summary:
      "The Bill of Rights applies to every person in Kenya, including detainees and their families.",
    points: [
      "Right to human dignity (Article 28).",
      "Equality before the law — no discrimination (Article 27).",
      "Freedom and security of the person — no torture or cruel treatment (Article 29).",
      "Access to justice and courts (Article 48).",
      "Every person may seek legal redress when their rights are violated.",
    ],
  },
];

export const LEGAL_AID_SECTIONS: GuideSection[] = [
  {
    id: "about",
    title: "What is legal aid?",
    summary:
      "Legal aid provides free or low-cost legal advice and representation to people who cannot afford a private lawyer.",
    points: [
      "NLAS (0800720640) is Kenya's official state legal aid service under the Legal Aid Act 2016.",
      "NGOs such as Kituo Cha Sheria and FIDA Kenya offer clinics and helplines nationwide.",
      "Services include advice, court representation, and referrals.",
      "Most helplines are toll-free from any mobile network.",
    ],
  },
  {
    id: "qualify",
    title: "Who qualifies?",
    summary:
      "Legal aid is intended for people who cannot pay for private legal services.",
    points: [
      "You cannot afford to hire a lawyer on your own.",
      "Your matter involves family, land, criminal, or human rights issues.",
      "You are vulnerable — including children, detainees, and GBV survivors.",
      "Apply through NLAS, Kituo Cha Sheria, or a local legal aid clinic.",
    ],
  },
  {
    id: "find-help",
    title: "Find help near you",
    summary:
      "Dial HakiTrack USSD option 3 to search providers by county and case type, or call these toll-free numbers.",
    points: [
      "Nairobi, Mombasa, Kisumu, and Nakuru providers are listed in our USSD directory.",
      "For other counties, USSD sends a full provider list by SMS.",
      "Family matters — FIDA Kenya (0800720501).",
      "General and criminal matters — Kituo Cha Sheria (0800720529) or NLAS (0800720640).",
    ],
  },
];

export const SMS_ALERT_SECTIONS: GuideSection[] = [
  {
    id: "overview",
    title: "What are SMS alerts?",
    summary:
      "HakiTrack sends text messages so families stay informed without needing a smartphone or internet.",
    points: [
      "Hearing reminders are sent one day before a scheduled court date.",
      "Status alerts are sent when a clerk updates bail, remand, or hearing information.",
      "Alerts use plain language in English or Swahili.",
      "No data connection required — works on any basic phone.",
    ],
  },
  {
    id: "subscribe-ussd",
    title: "Subscribe via USSD",
    summary: "Use any phone to opt in after checking a case.",
    points: [
      "Dial the HakiTrack USSD code and choose option 1 (Case status).",
      "Enter the case number (e.g. CR2026089).",
      "Review the status, then press 1 to subscribe to SMS reminders.",
      "A confirmation SMS is sent immediately with case details.",
    ],
  },
  {
    id: "subscribe-web",
    title: "Subscribe via the web",
    summary: "Families with internet access can also receive alerts through the dashboard.",
    points: [
      "Sign in at the family portal with your name, email, and phone number.",
      "Look up a case linked to your phone number.",
      "You are automatically subscribed when you view an authorised case.",
      "Alerts are sent to the phone number on your account.",
    ],
  },
  {
    id: "privacy",
    title: "Your information",
    summary: "We only send alerts to numbers linked to a case.",
    points: [
      "Case numbers must match records in the court registry.",
      "Phone numbers are stored securely and used only for case notifications.",
      "You can stop alerts by contacting the court clerk or HakiTrack support.",
    ],
  },
];
