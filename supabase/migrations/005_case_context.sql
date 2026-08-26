-- Clerk-curated case context for families (Kenya Law has no live case API).
ALTER TABLE cases ADD COLUMN IF NOT EXISTS proceedings_summary TEXT;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS last_ruling_summary TEXT;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS sentence_outcome TEXT;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS petition_guidance TEXT;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS kenya_law_url TEXT;
