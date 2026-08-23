-- Family web access: phone registered by clerk or via USSD subscribe
ALTER TABLE cases ADD COLUMN IF NOT EXISTS family_contact_phone TEXT;

CREATE INDEX IF NOT EXISTS idx_cases_family_phone ON cases (family_contact_phone);
