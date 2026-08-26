/**
 * Seed demo cases into Supabase.
 *
 * Usage:
 *   cd frontend && npm run seed
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in frontend/.env.local
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

const DEMO_FAMILY = {
  name: "Jane Kamau",
  email: "family@demo.hakitrack.test",
  phone: "254711111111",
  caseNumber: "CR-2026-089",
};

config({ path: resolve(process.cwd(), ".env.local") });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

type SeedCase = {
  case_number: string;
  defendant_name: string;
  court_station: string;
  current_status: string;
  bail_amount: number | null;
  next_hearing_date: string | null;
  holding_location: string | null;
  judge_name: string | null;
  notes: string;
  family_contact_phone?: string | null;
  proceedings_summary?: string | null;
  last_ruling_summary?: string | null;
  sentence_outcome?: string | null;
  petition_guidance?: string | null;
  kenya_law_url?: string | null;
};

const demoCases: SeedCase[] = [
  {
    case_number: "CR-2026-089",
    defendant_name: "John Kamau",
    court_station: "Milimani Law Courts",
    current_status: "BAIL_SET",
    bail_amount: 50000,
    next_hearing_date: "2026-09-15T09:00:00.000Z",
    holding_location: "Industrial Area Remand",
    judge_name: "Hon. Justice W. Odunga",
    notes: "Primary USSD demo case",
    family_contact_phone: "254711111111",
    proceedings_summary:
      "Accused charged with obtaining money by false pretences. Pleaded not guilty on first mention. Prosecution asked for time to prepare witness statements.",
    last_ruling_summary:
      "Bail set at KES 50,000 with one surety of like amount. Accused to report to OCS Industrial Area every Monday.",
    petition_guidance:
      "If bail is denied at the next mention, apply for review through a lawyer. Appeal against conviction must be filed within 14 days of sentencing under the Criminal Procedure Code.",
  },
  {
    case_number: "CR-2026-012",
    defendant_name: "Mary Wanjiku",
    court_station: "Makadara Law Courts",
    current_status: "REMANDED",
    bail_amount: null,
    next_hearing_date: "2026-08-25T10:30:00.000Z",
    holding_location: "Langata Women's Prison",
    judge_name: "Hon. Justice A. Mabeya",
    notes: "Remand demo case",
  },
  {
    case_number: "HCC-2026-044",
    defendant_name: "Peter Ochieng",
    court_station: "Milimani Law Courts",
    current_status: "HEARING_SCHEDULED",
    bail_amount: null,
    next_hearing_date: "2026-09-02T11:00:00.000Z",
    holding_location: null,
    judge_name: "Hon. Justice J. Chirwa",
    notes: "Civil case variant",
  },
  {
    case_number: "CR-2026-101",
    defendant_name: "David Mutua",
    court_station: "Kibera Law Courts",
    current_status: "BAIL_POSTED",
    bail_amount: 30000,
    next_hearing_date: "2026-08-28T08:30:00.000Z",
    holding_location: null,
    judge_name: "Hon. Justice R. Omollo",
    notes: "Post-bail state",
  },
  {
    case_number: "CR-2026-055",
    defendant_name: "Grace Akinyi",
    court_station: "Mombasa Law Courts",
    current_status: "DISCHARGED",
    bail_amount: null,
    next_hearing_date: null,
    holding_location: null,
    judge_name: "Hon. Justice F. Mwangi",
    notes: "Closed case demo",
  },
  {
    case_number: "CR-2026-078",
    defendant_name: "James Otieno",
    court_station: "Kisumu Law Courts",
    current_status: "TRANSFERRED",
    bail_amount: 20000,
    next_hearing_date: "2026-09-10T14:00:00.000Z",
    holding_location: "Kisumu Remand",
    judge_name: "Hon. Justice L. Onyango",
    notes: "Transfer demo case",
  },
  {
    case_number: "CR-2026-033",
    defendant_name: "Anne Njeri",
    court_station: "Kiambu Law Courts",
    current_status: "HEARING_SCHEDULED",
    bail_amount: 15000,
    next_hearing_date: "2026-09-08T09:00:00.000Z",
    holding_location: "Kiambu GK Prison",
    judge_name: "Hon. Justice P. Waweru",
    notes: "Kiambu county demo",
  },
  {
    case_number: "CR-2026-044",
    defendant_name: "Samuel Kiprop",
    court_station: "Kajiado Law Courts",
    current_status: "REMANDED",
    bail_amount: 25000,
    next_hearing_date: "2026-09-12T10:00:00.000Z",
    holding_location: "Kajiado Remand",
    judge_name: "Hon. Justice M. Tanui",
    notes: "Kajiado county demo",
  },
];

async function main() {
  console.log("Seeding HakiTrack demo cases...");

  for (const demoCase of demoCases) {
    const { data, error } = await supabase
      .from("cases")
      .upsert(demoCase, { onConflict: "case_number" })
      .select("*")
      .single();

    if (error) {
      console.error(`Failed to seed ${demoCase.case_number}:`, error.message);
      continue;
    }

    await supabase.from("case_audit_log").insert({
      case_id: data.id,
      old_status: null,
      new_status: data.current_status,
      note: "Seeded demo case",
    });

    console.log(`Seeded ${data.case_number}`);
  }

  const { data: demoCase } = await supabase
    .from("cases")
    .select("id")
    .eq("case_number", DEMO_FAMILY.caseNumber)
    .maybeSingle();

  const { data: familyMember, error: familyError } = await supabase
    .from("family_members")
    .upsert(
      {
        full_name: DEMO_FAMILY.name,
        email: DEMO_FAMILY.email,
        phone_number: DEMO_FAMILY.phone,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "email" },
    )
    .select("email")
    .single();

  if (familyError) {
    console.warn(
      "Could not seed demo family member (run migration 004):",
      familyError.message,
    );
  } else {
    console.log(`Seeded family member ${familyMember.email}`);
  }

  if (demoCase) {
    const { error: subError } = await supabase.from("case_subscribers").upsert(
      {
        case_id: demoCase.id,
        phone_number: DEMO_FAMILY.phone,
      },
      { onConflict: "case_id,phone_number" },
    );

    if (subError) {
      console.warn("Could not link demo phone to case:", subError.message);
    } else {
      console.log(
        `Linked ${DEMO_FAMILY.phone} to ${DEMO_FAMILY.caseNumber} for SMS`,
      );
    }
  }

  console.log("Done.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
