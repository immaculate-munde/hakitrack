-- USSD identity registry (phone from SIM + self-declared name)
CREATE TABLE ussd_identities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ussd_identities_phone ON ussd_identities (phone_number);

-- Audit trail: who looked up which case via USSD
CREATE TABLE ussd_case_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES cases (id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  caller_name TEXT NOT NULL,
  verification_method TEXT NOT NULL,
  accessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ussd_case_access_case ON ussd_case_access (case_id, accessed_at DESC);
CREATE INDEX idx_ussd_case_access_phone ON ussd_case_access (phone_number);

ALTER TABLE case_subscribers
  ADD COLUMN IF NOT EXISTS caller_name TEXT,
  ADD COLUMN IF NOT EXISTS kyc_verified_at TIMESTAMPTZ;
