/**
 * Seed legal aid providers into Supabase.
 *
 * Usage:
 *   cd frontend && npm run seed:legal-aid
 *
 * Verify helpline numbers against each organization's official site before production.
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

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

type SeedProvider = {
  name: string;
  county: string;
  case_types: string[];
  phone_number: string;
  languages: string[];
  free: boolean;
  notes: string;
};

const providers: SeedProvider[] = [
  {
    name: "Kituo Cha Sheria",
    county: "Nairobi",
    case_types: ["land", "family", "general", "criminal"],
    phone_number: "0720253000",
    languages: ["en", "sw"],
    free: true,
    notes: "Legal aid NGO — verify current helpline before production",
  },
  {
    name: "Kituo Cha Sheria",
    county: "Mombasa",
    case_types: ["land", "family", "general", "criminal"],
    phone_number: "0720253000",
    languages: ["en", "sw"],
    free: true,
    notes: "Coastal outreach — verify current helpline",
  },
  {
    name: "Kituo Cha Sheria",
    county: "Kisumu",
    case_types: ["land", "family", "general", "criminal"],
    phone_number: "0720253000",
    languages: ["en", "sw"],
    free: true,
    notes: "Western Kenya outreach — verify current helpline",
  },
  {
    name: "FIDA Kenya",
    county: "Nairobi",
    case_types: ["family", "general"],
    phone_number: "0722653730",
    languages: ["en", "sw"],
    free: true,
    notes: "Women's rights and family law — verify current helpline",
  },
  {
    name: "FIDA Kenya",
    county: "Nakuru",
    case_types: ["family", "general"],
    phone_number: "0722653730",
    languages: ["en", "sw"],
    free: true,
    notes: "Rift Valley outreach — verify current helpline",
  },
  {
    name: "FIDA Kenya",
    county: "Kisumu",
    case_types: ["family", "general"],
    phone_number: "0722653730",
    languages: ["en", "sw"],
    free: true,
    notes: "Western Kenya outreach — verify current helpline",
  },
  {
    name: "FIDA Kenya",
    county: "Mombasa",
    case_types: ["family", "general"],
    phone_number: "0722653730",
    languages: ["en", "sw"],
    free: true,
    notes: "Coast outreach — verify current helpline",
  },
  {
    name: "Legal Resources Foundation",
    county: "Nairobi",
    case_types: ["criminal", "land", "general"],
    phone_number: "0203874629",
    languages: ["en", "sw"],
    free: true,
    notes: "Paralegal clinics — verify current contact",
  },
  {
    name: "Legal Resources Foundation",
    county: "Nakuru",
    case_types: ["criminal", "land", "general"],
    phone_number: "0203874629",
    languages: ["en", "sw"],
    free: true,
    notes: "Rift Valley clinics — verify current contact",
  },
  {
    name: "National Legal Aid Service",
    county: "All",
    case_types: ["family", "land", "criminal", "general"],
    phone_number: "0800720021",
    languages: ["en", "sw"],
    free: true,
    notes: "State legal aid body under Legal Aid Act 2016 — verify toll-free line",
  },
];

async function main() {
  console.log("Seeding legal aid providers...");

  for (const provider of providers) {
    const { error } = await supabase.from("legal_aid_providers").upsert(provider, {
      onConflict: "name,county",
    });

    if (error) {
      console.error(`Failed to seed ${provider.name} (${provider.county}):`, error.message);
      continue;
    }

    console.log(`Seeded ${provider.name} — ${provider.county}`);
  }

  console.log("Done.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
