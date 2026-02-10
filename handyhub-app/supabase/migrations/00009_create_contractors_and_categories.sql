-- ============================================================
-- Migration 00009: Create contractors & categories tables
-- ============================================================

-- 1. Verification tier enum (matches TypeScript VerificationTier)
DO $$ BEGIN
  CREATE TYPE verification_tier AS ENUM (
    'new',
    'id_verified',
    'background_checked',
    'fully_verified'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 2. Categories table
CREATE TABLE IF NOT EXISTS categories (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  slug        text NOT NULL UNIQUE,
  icon_name   text NOT NULL DEFAULT 'Wrench',
  description text NOT NULL DEFAULT '',
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Seed 12 categories from CATEGORIES constant
INSERT INTO categories (name, slug, icon_name) VALUES
  ('Plumbing',          'plumbing',          'Wrench'),
  ('Electrical',        'electrical',        'Zap'),
  ('Painting',          'painting',          'Paintbrush'),
  ('Carpentry',         'carpentry',         'Hammer'),
  ('Roofing',           'roofing',           'Home'),
  ('Landscaping',       'landscaping',       'TreePine'),
  ('HVAC',              'hvac',              'Thermometer'),
  ('Flooring',          'flooring',          'Grid3x3'),
  ('Kitchen Remodel',   'kitchen-remodel',   'ChefHat'),
  ('Bathroom Remodel',  'bathroom-remodel',  'Bath'),
  ('General Handyman',  'general-handyman',  'HardHat'),
  ('Cleaning',          'cleaning',          'Sparkles')
ON CONFLICT (slug) DO NOTHING;

-- 3. Contractors table
CREATE TABLE IF NOT EXISTS contractors (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               uuid NOT NULL UNIQUE REFERENCES users_profile(id) ON DELETE CASCADE,
  business_name         text NOT NULL DEFAULT '',
  bio                   text,
  years_experience      int NOT NULL DEFAULT 0,
  hourly_rate           numeric(8,2),
  service_radius_miles  int NOT NULL DEFAULT 25,
  verification_tier     verification_tier NOT NULL DEFAULT 'new',
  license_number        text,
  insurance_verified    boolean NOT NULL DEFAULT false,
  rating_avg            numeric(3,2) NOT NULL DEFAULT 0,
  review_count          int NOT NULL DEFAULT 0,
  latitude              double precision,
  longitude             double precision,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

-- 4. Contractor skills junction table
CREATE TABLE IF NOT EXISTS contractor_skills (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contractor_id   uuid NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
  category_id     uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (contractor_id, category_id)
);

-- 5. Indexes
CREATE INDEX IF NOT EXISTS idx_contractors_user_id ON contractors(user_id);
CREATE INDEX IF NOT EXISTS idx_contractors_rating ON contractors(rating_avg DESC);
CREATE INDEX IF NOT EXISTS idx_contractors_verification ON contractors(verification_tier);
CREATE INDEX IF NOT EXISTS idx_contractor_skills_contractor ON contractor_skills(contractor_id);
CREATE INDEX IF NOT EXISTS idx_contractor_skills_category ON contractor_skills(category_id);

-- 6. Auto-update trigger for contractors.updated_at
CREATE OR REPLACE FUNCTION update_contractors_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_contractors_updated_at ON contractors;
CREATE TRIGGER trg_contractors_updated_at
  BEFORE UPDATE ON contractors
  FOR EACH ROW EXECUTE FUNCTION update_contractors_updated_at();

-- 7. RLS Policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractor_skills ENABLE ROW LEVEL SECURITY;

-- Categories: public read
CREATE POLICY "categories_public_read" ON categories
  FOR SELECT USING (true);

-- Contractors: public read
CREATE POLICY "contractors_public_read" ON contractors
  FOR SELECT USING (true);

-- Contractors: owner can update own row
CREATE POLICY "contractors_owner_update" ON contractors
  FOR UPDATE USING (
    user_id IN (
      SELECT id FROM users_profile WHERE clerk_id = auth.uid()::text
    )
  );

-- Contractors: authenticated insert
CREATE POLICY "contractors_auth_insert" ON contractors
  FOR INSERT WITH CHECK (true);

-- Contractor skills: public read
CREATE POLICY "contractor_skills_public_read" ON contractor_skills
  FOR SELECT USING (true);

-- Contractor skills: authenticated insert/delete
CREATE POLICY "contractor_skills_auth_insert" ON contractor_skills
  FOR INSERT WITH CHECK (true);

CREATE POLICY "contractor_skills_auth_delete" ON contractor_skills
  FOR DELETE USING (true);
