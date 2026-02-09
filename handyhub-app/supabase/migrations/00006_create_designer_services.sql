-- Migration: Create designer_services table

-- 1. Create service_type enum
CREATE TYPE service_type AS ENUM (
  'mood_board',
  'room_design',
  'consultation',
  'shopping_list',
  'color_consultation',
  'space_planning',
  'full_room_redesign',
  'styling_session',
  'custom'
);

-- 2. Create price_type enum
CREATE TYPE price_type AS ENUM (
  'fixed',
  'hourly',
  'per_room',
  'custom_quote'
);

-- 3. Create designer_services table
CREATE TABLE designer_services (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  designer_id             UUID NOT NULL REFERENCES designer_profiles(id) ON DELETE CASCADE,
  service_type            service_type NOT NULL DEFAULT 'custom',
  title                   TEXT NOT NULL,
  description             TEXT NOT NULL,
  price                   DECIMAL(10, 2) NOT NULL,
  price_type              price_type NOT NULL DEFAULT 'fixed',
  estimated_delivery_days INTEGER NOT NULL DEFAULT 7,
  max_revisions           INTEGER NOT NULL DEFAULT 1,
  is_virtual              BOOLEAN NOT NULL DEFAULT TRUE,
  includes_shopping_list  BOOLEAN NOT NULL DEFAULT FALSE,
  includes_bom            BOOLEAN NOT NULL DEFAULT FALSE,
  is_active               BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order              INTEGER NOT NULL DEFAULT 0,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Indexes
CREATE INDEX idx_designer_services_designer_id ON designer_services (designer_id);
CREATE INDEX idx_designer_services_type ON designer_services (service_type);
CREATE INDEX idx_designer_services_active ON designer_services (is_active) WHERE is_active = TRUE;

-- 5. Reuse updated_at trigger
CREATE TRIGGER trg_designer_services_updated_at
  BEFORE UPDATE ON designer_services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 6. Enable RLS
ALTER TABLE designer_services ENABLE ROW LEVEL SECURITY;

-- Anyone can read active services
CREATE POLICY "Public read active services"
  ON designer_services
  FOR SELECT
  USING (is_active = TRUE);

-- Designer can read all their own services (including inactive)
CREATE POLICY "Designer can read own services"
  ON designer_services
  FOR SELECT
  USING (
    designer_id IN (
      SELECT dp.id FROM designer_profiles dp
      JOIN users_profile up ON dp.user_id = up.id
      WHERE up.clerk_id = auth.jwt() ->> 'sub'
    )
  );

-- Designer can insert their own services
CREATE POLICY "Designer can insert own services"
  ON designer_services
  FOR INSERT
  WITH CHECK (
    designer_id IN (
      SELECT dp.id FROM designer_profiles dp
      JOIN users_profile up ON dp.user_id = up.id
      WHERE up.clerk_id = auth.jwt() ->> 'sub'
    )
  );

-- Designer can update their own services
CREATE POLICY "Designer can update own services"
  ON designer_services
  FOR UPDATE
  USING (
    designer_id IN (
      SELECT dp.id FROM designer_profiles dp
      JOIN users_profile up ON dp.user_id = up.id
      WHERE up.clerk_id = auth.jwt() ->> 'sub'
    )
  );

-- Designer can delete their own services
CREATE POLICY "Designer can delete own services"
  ON designer_services
  FOR DELETE
  USING (
    designer_id IN (
      SELECT dp.id FROM designer_profiles dp
      JOIN users_profile up ON dp.user_id = up.id
      WHERE up.clerk_id = auth.jwt() ->> 'sub'
    )
  );
