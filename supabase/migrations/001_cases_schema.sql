CREATE TYPE case_status AS ENUM (
  'REMANDED',
  'BAIL_SET',
  'BAIL_POSTED',
  'HEARING_SCHEDULED',
  'DISCHARGED',
  'TRANSFERRED'
);

CREATE TABLE cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_number TEXT UNIQUE NOT NULL,
  case_number_normalized TEXT GENERATED ALWAYS AS (
    upper(regexp_replace(case_number, '[^a-zA-Z0-9]', '', 'g'))
  ) STORED,
  defendant_name TEXT NOT NULL,
  court_station TEXT NOT NULL,
  current_status case_status NOT NULL DEFAULT 'REMANDED',
  bail_amount INTEGER,
  next_hearing_date TIMESTAMPTZ,
  holding_location TEXT,
  judge_name TEXT,
  notes TEXT,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_cases_normalized ON cases (case_number_normalized);
CREATE INDEX idx_cases_next_hearing ON cases (next_hearing_date);

CREATE TABLE case_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES cases (id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (case_id, phone_number)
);

CREATE TABLE sms_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES cases (id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  hearing_date DATE NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (case_id, phone_number, hearing_date)
);

CREATE TABLE case_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES cases (id) ON DELETE CASCADE,
  old_status case_status,
  new_status case_status NOT NULL,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  note TEXT
);

CREATE OR REPLACE FUNCTION update_cases_last_updated()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cases_last_updated
  BEFORE UPDATE ON cases
  FOR EACH ROW
  EXECUTE FUNCTION update_cases_last_updated();
