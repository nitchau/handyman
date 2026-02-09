-- Migration: Create design_idea_products table
-- Products tagged in a design idea (replaces JSONB product_tags)

-- 1. Create product_category enum
CREATE TYPE product_category AS ENUM (
  'flooring',
  'paint',
  'tile',
  'fixtures',
  'lighting',
  'hardware',
  'furniture',
  'decor',
  'appliances',
  'cabinetry',
  'countertops',
  'other'
);

-- 2. Create design_idea_products table
CREATE TABLE design_idea_products (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_idea_id    UUID NOT NULL REFERENCES design_ideas(id) ON DELETE CASCADE,
  product_name      TEXT NOT NULL,
  product_brand     TEXT,
  product_category  product_category NOT NULL DEFAULT 'other',
  estimated_price   DECIMAL(10, 2) NOT NULL,
  retailer_name     TEXT,
  product_url       TEXT,
  product_image_url TEXT,
  quantity_needed   TEXT,
  notes             TEXT,
  position_x        DECIMAL(5, 2),
  position_y        DECIMAL(5, 2),
  sort_order        INTEGER NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Indexes
CREATE INDEX idx_design_idea_products_design_id ON design_idea_products (design_idea_id);
CREATE INDEX idx_design_idea_products_category ON design_idea_products (product_category);

-- 4. Enable RLS
ALTER TABLE design_idea_products ENABLE ROW LEVEL SECURITY;

-- Anyone can read products for published design ideas
CREATE POLICY "Public read products for published ideas"
  ON design_idea_products
  FOR SELECT
  USING (
    design_idea_id IN (
      SELECT id FROM design_ideas WHERE is_published = TRUE
    )
  );

-- Designer can read products for their own ideas (including drafts)
CREATE POLICY "Designer can read own idea products"
  ON design_idea_products
  FOR SELECT
  USING (
    design_idea_id IN (
      SELECT di.id FROM design_ideas di
      JOIN designer_profiles dp ON di.designer_id = dp.id
      JOIN users_profile up ON dp.user_id = up.id
      WHERE up.clerk_id = auth.jwt() ->> 'sub'
    )
  );

-- Designer can insert products for their own ideas
CREATE POLICY "Designer can insert own idea products"
  ON design_idea_products
  FOR INSERT
  WITH CHECK (
    design_idea_id IN (
      SELECT di.id FROM design_ideas di
      JOIN designer_profiles dp ON di.designer_id = dp.id
      JOIN users_profile up ON dp.user_id = up.id
      WHERE up.clerk_id = auth.jwt() ->> 'sub'
    )
  );

-- Designer can update products for their own ideas
CREATE POLICY "Designer can update own idea products"
  ON design_idea_products
  FOR UPDATE
  USING (
    design_idea_id IN (
      SELECT di.id FROM design_ideas di
      JOIN designer_profiles dp ON di.designer_id = dp.id
      JOIN users_profile up ON dp.user_id = up.id
      WHERE up.clerk_id = auth.jwt() ->> 'sub'
    )
  );

-- Designer can delete products for their own ideas
CREATE POLICY "Designer can delete own idea products"
  ON design_idea_products
  FOR DELETE
  USING (
    design_idea_id IN (
      SELECT di.id FROM design_ideas di
      JOIN designer_profiles dp ON di.designer_id = dp.id
      JOIN users_profile up ON dp.user_id = up.id
      WHERE up.clerk_id = auth.jwt() ->> 'sub'
    )
  );
