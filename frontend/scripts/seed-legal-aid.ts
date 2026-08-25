/**
 * Seed legal aid providers into Supabase.
 *
 * Usage:
 *   cd frontend && npx tsx scripts/seed-legal-aid.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in frontend/.env.local
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
    case_types: ["land", "family", "human rights", "criminal", "general"],
    phone_number: "0800720529",
    languages: ["en", "sw"],
    free: true,
    notes: "Kenya's oldest legal aid NGO",
  },
  {
    name: "FIDA Kenya",
    county: "Nairobi",
    case_types: ["family", "GBV", "succession", "general"],
    phone_number: "0800720501",
    languages: ["en", "sw"],
    free: true,
    notes: "Women's rights & family law focus",
  },
  {
    name: "Legal Resources Foundation (LRF)",
    county: "Nairobi",
    case_types: ["criminal", "land", "general"],
    phone_number: "0722209848",
    languages: ["en", "sw"],
    free: true,
    notes: "Legal aid clinics + paralegals",
  },
  {
    name: "National Legal Aid Service (NLAS)",
    county: "All",
    case_types: ["family", "land", "criminal", "general", "all"],
    phone_number: "0800720640",
    languages: ["en", "sw"],
    free: true,
    notes: "Official state legal aid body under Legal Aid Act 2016",
  },
  {
    name: "Kituo Cha Sheria (Coast)",
    county: "Mombasa",
    case_types: ["land", "family", "human rights", "criminal"],
    phone_number: "0800720529",
    languages: ["en", "sw"],
    free: true,
    notes: "Mombasa branch",
  },
  {
    name: "FIDA Kenya (Coast)",
    county: "Mombasa",
    case_types: ["family", "GBV", "succession"],
    phone_number: "0800720501",
    languages: ["en", "sw"],
    free: true,
    notes: "Mombasa branch",
  },
  {
    name: "Kituo Cha Sheria (Western)",
    county: "Kisumu",
    case_types: ["land", "family", "human rights", "criminal"],
    phone_number: "0800720529",
    languages: ["en", "sw"],
    free: true,
    notes: "Kisumu branch",
  },
  {
    name: "FIDA Kenya (Western)",
    county: "Kisumu",
    case_types: ["family", "GBV", "succession"],
    phone_number: "0800720501",
    languages: ["en", "sw"],
    free: true,
    notes: "Kisumu branch",
  },
  {
    name: "Legal Resources Foundation (Rift)",
    county: "Nakuru",
    case_types: ["criminal", "land", "general"],
    phone_number: "0722209848",
    languages: ["en", "sw"],
    free: true,
    notes: "Nakuru branch",
  },
];

async function main() {
  console.log("Seeding legal aid providers...");

  for (const provider of providers) {
    const { data, error } = await supabase
      .from("legal_aid_providers")
      .upsert(provider, { onConflict: "name,county" })
      .select("*")
      .maybeSingle();

    if (error) {
      console.error(`Failed to seed ${provider.name}:`, error.message);
      continue;
    }

    console.log(`Seeded ${provider.name} (${provider.county})`);
  }

  console.log("Legal aid providers seed complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
