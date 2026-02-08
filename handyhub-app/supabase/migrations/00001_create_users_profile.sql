-- Migration: Create users_profile table
-- Maps to TypeScript UserProfile interface in src/types/database.ts

-- 1. Create user_role enum
CREATE TYPE user_role AS ENUM (
  'diy_user',
  'homeowner',
  'contractor',
  'designer',
  'admin'
);

-- 2. Create users_profile table
CREATE TABLE users_profile (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id    TEXT NOT NULL UNIQUE,
  email       TEXT NOT NULL,
  first_name  TEXT NOT NULL,
  last_name   TEXT NOT NULL,
  avatar_url  TEXT,
  role        user_role NOT NULL DEFAULT 'homeowner',
  phone       TEXT,
  zip_code    TEXT,
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Index on clerk_id for fast auth lookups
CREATE INDEX idx_users_profile_clerk_id ON users_profile (clerk_id);

-- 4. Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_profile_updated_at
  BEFORE UPDATE ON users_profile
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 5. Enable RLS
ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON users_profile
  FOR SELECT
  USING (clerk_id = auth.jwt() ->> 'sub');

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users_profile
  FOR UPDATE
  USING (clerk_id = auth.jwt() ->> 'sub');

-- Service role can insert (used during signup webhook)
CREATE POLICY "Service role can insert profiles"
  ON users_profile
  FOR INSERT
  WITH CHECK (true);
