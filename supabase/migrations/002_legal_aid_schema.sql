create table if not exists legal_aid_providers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  county text not null,
  case_types text[] not null default {},
  phone_number text not null,
  languages text[] default array['en','sw'],
  free boolean default true,
  notes text,
  active boolean default true
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
create index if not exists idx_legal_aid_county on legal_aid_providers(county);
create index if not exists idx_legal_aid_case_types on legal_aid_providers using gin (case_types);
create unique index if not exists idx_legal_aid_name_county on legal_aid_providers (name, county);