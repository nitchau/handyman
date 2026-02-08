-- Migration: Create designer_profiles table
-- 1:1 with users_profile where role = 'designer'

-- 1. Create designer_tier enum
CREATE TYPE designer_tier AS ENUM (
  'community_creator',
  'verified_designer',
  'featured_designer'
);

-- 2. Create designer_profiles table
CREATE TABLE designer_profiles (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                   UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
  display_name              TEXT NOT NULL,
  bio                       TEXT,
  avatar_url                TEXT,
  cover_photo_url           TEXT,
  designer_tier             designer_tier NOT NULL DEFAULT 'community_creator',
  specialties               TEXT[] NOT NULL DEFAULT '{}',
  room_types                TEXT[] NOT NULL DEFAULT '{}',
  style_tags                TEXT[] NOT NULL DEFAULT '{}',
  portfolio_url             TEXT,
  instagram_handle          TEXT,
  tiktok_handle             TEXT,
  pinterest_handle          TEXT,
  credentials               TEXT[] NOT NULL DEFAULT '{}',
  credential_verified       BOOLEAN NOT NULL DEFAULT FALSE,
  years_experience          INTEGER NOT NULL DEFAULT 0,
  location_city             TEXT,
  location_state            TEXT,
  accepts_remote_clients    BOOLEAN NOT NULL DEFAULT TRUE,
  rating_avg                NUMERIC(3, 2) NOT NULL DEFAULT 0.00,
  review_count              INTEGER NOT NULL DEFAULT 0,
  total_ideas_posted        INTEGER NOT NULL DEFAULT 0,
  total_likes               INTEGER NOT NULL DEFAULT 0,
  response_time_hours       INTEGER,
  is_accepting_clients      BOOLEAN NOT NULL DEFAULT TRUE,
  stripe_connect_account_id TEXT,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Unique constraint on user_id (1:1 relationship)
ALTER TABLE designer_profiles ADD CONSTRAINT uq_designer_profiles_user_id UNIQUE (user_id);

-- 4. Indexes
CREATE INDEX idx_designer_profiles_user_id ON designer_profiles (user_id);
CREATE INDEX idx_designer_profiles_tier ON designer_profiles (designer_tier);
CREATE INDEX idx_designer_profiles_state ON designer_profiles (location_state);

-- 5. Reuse updated_at trigger (function created in migration 00001)
CREATE TRIGGER trg_designer_profiles_updated_at
  BEFORE UPDATE ON designer_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 6. Enable RLS
ALTER TABLE designer_profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can read designer profiles (public gallery)
CREATE POLICY "Public read access"
  ON designer_profiles
  FOR SELECT
  USING (true);

-- Owner can update their own profile
CREATE POLICY "Owner can update own profile"
  ON designer_profiles
  FOR UPDATE
  USING (
    user_id IN (
      SELECT id FROM users_profile WHERE clerk_id = auth.jwt() ->> 'sub'
    )
  );

-- Owner can insert their own profile
CREATE POLICY "Owner can insert own profile"
  ON designer_profiles
  FOR INSERT
  WITH CHECK (
    user_id IN (
      SELECT id FROM users_profile WHERE clerk_id = auth.jwt() ->> 'sub'
    )
  );
