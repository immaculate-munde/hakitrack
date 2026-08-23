CREATE TABLE legal_aid_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  county TEXT NOT NULL,
  case_types TEXT[] NOT NULL,
  phone_number TEXT NOT NULL,
  languages TEXT[] DEFAULT ARRAY['en', 'sw'],
  free BOOLEAN DEFAULT TRUE,
  notes TEXT,
  active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_legal_aid_county ON legal_aid_providers (county);
CREATE INDEX idx_legal_aid_case_types ON legal_aid_providers USING GIN (case_types);
CREATE UNIQUE INDEX idx_legal_aid_name_county ON legal_aid_providers (name, county);
