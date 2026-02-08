-- Migration: Create design_ideas table
-- Core content table for the Design Gallery

-- 1. Create room_type enum
CREATE TYPE room_type AS ENUM (
  'bathroom',
  'kitchen',
  'living_room',
  'bedroom',
  'dining_room',
  'home_office',
  'laundry',
  'mudroom',
  'nursery',
  'outdoor',
  'entryway',
  'garage',
  'other'
);

-- 2. Create design_style enum
CREATE TYPE design_style AS ENUM (
  'modern',
  'traditional',
  'farmhouse',
  'mid_century',
  'scandinavian',
  'industrial',
  'bohemian',
  'coastal',
  'minimalist',
  'transitional',
  'contemporary',
  'rustic',
  'art_deco',
  'eclectic',
  'other'
);

-- 3. Create budget_tier enum
CREATE TYPE budget_tier AS ENUM (
  'budget_under_1000',
  'mid_1000_5000',
  'premium_5000_15000',
  'luxury_15000_plus'
);

-- 4. Create difficulty_level enum
CREATE TYPE difficulty_level AS ENUM (
  'beginner',
  'intermediate',
  'advanced'
);

-- 5. Create design_ideas table
CREATE TABLE design_ideas (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  designer_id       UUID NOT NULL REFERENCES designer_profiles(id) ON DELETE CASCADE,
  title             TEXT NOT NULL,
  description       TEXT NOT NULL,
  room_type         room_type NOT NULL,
  style             design_style NOT NULL,
  budget_tier       budget_tier NOT NULL,
  estimated_cost    DECIMAL(10, 2),
  difficulty_level  difficulty_level NOT NULL DEFAULT 'beginner',
  is_diy_friendly   BOOLEAN NOT NULL DEFAULT FALSE,
  media_urls        TEXT[] NOT NULL DEFAULT '{}',
  primary_photo_url TEXT NOT NULL,
  before_photo_url  TEXT,
  tags              TEXT[] NOT NULL DEFAULT '{}',
  product_tags      JSONB NOT NULL DEFAULT '[]'::jsonb,
  linked_bom_id     UUID,
  view_count        INTEGER NOT NULL DEFAULT 0,
  like_count        INTEGER NOT NULL DEFAULT 0,
  save_count        INTEGER NOT NULL DEFAULT 0,
  share_count       INTEGER NOT NULL DEFAULT 0,
  is_published      BOOLEAN NOT NULL DEFAULT FALSE,
  is_featured       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Indexes
CREATE INDEX idx_design_ideas_designer_id ON design_ideas (designer_id);
CREATE INDEX idx_design_ideas_room_type ON design_ideas (room_type);
CREATE INDEX idx_design_ideas_style ON design_ideas (style);
CREATE INDEX idx_design_ideas_budget_tier ON design_ideas (budget_tier);
CREATE INDEX idx_design_ideas_difficulty ON design_ideas (difficulty_level);
CREATE INDEX idx_design_ideas_published ON design_ideas (is_published) WHERE is_published = TRUE;
CREATE INDEX idx_design_ideas_featured ON design_ideas (is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_design_ideas_tags ON design_ideas USING gin (tags);
CREATE INDEX idx_design_ideas_created_at ON design_ideas (created_at DESC);

-- 7. Reuse updated_at trigger (function created in migration 00001)
CREATE TRIGGER trg_design_ideas_updated_at
  BEFORE UPDATE ON design_ideas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 8. Constraint: media_urls must have at least 1 entry
ALTER TABLE design_ideas ADD CONSTRAINT chk_design_ideas_media_urls
  CHECK (array_length(media_urls, 1) >= 1);

-- 9. Enable RLS
ALTER TABLE design_ideas ENABLE ROW LEVEL SECURITY;

-- Anyone can read published design ideas
CREATE POLICY "Public read published ideas"
  ON design_ideas
  FOR SELECT
  USING (is_published = TRUE);

-- Designer can read their own drafts
CREATE POLICY "Designer can read own ideas"
  ON design_ideas
  FOR SELECT
  USING (
    designer_id IN (
      SELECT dp.id FROM designer_profiles dp
      JOIN users_profile up ON dp.user_id = up.id
      WHERE up.clerk_id = auth.jwt() ->> 'sub'
    )
  );

-- Designer can insert their own ideas
CREATE POLICY "Designer can insert own ideas"
  ON design_ideas
  FOR INSERT
  WITH CHECK (
    designer_id IN (
      SELECT dp.id FROM designer_profiles dp
      JOIN users_profile up ON dp.user_id = up.id
      WHERE up.clerk_id = auth.jwt() ->> 'sub'
    )
  );

-- Designer can update their own ideas
CREATE POLICY "Designer can update own ideas"
  ON design_ideas
  FOR UPDATE
  USING (
    designer_id IN (
      SELECT dp.id FROM designer_profiles dp
      JOIN users_profile up ON dp.user_id = up.id
      WHERE up.clerk_id = auth.jwt() ->> 'sub'
    )
  );

-- Designer can delete their own ideas
CREATE POLICY "Designer can delete own ideas"
  ON design_ideas
  FOR DELETE
  USING (
    designer_id IN (
      SELECT dp.id FROM designer_profiles dp
      JOIN users_profile up ON dp.user_id = up.id
      WHERE up.clerk_id = auth.jwt() ->> 'sub'
    )
  );
