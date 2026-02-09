-- Migration: Create designer_orders table

-- 1. Create designer_order_status enum
CREATE TYPE designer_order_status AS ENUM (
  'requested',
  'accepted',
  'in_progress',
  'revision_requested',
  'delivered',
  'completed',
  'disputed',
  'cancelled',
  'refunded'
);

-- 2. Create designer_orders table
CREATE TABLE designer_orders (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id               UUID NOT NULL REFERENCES designer_services(id) ON DELETE CASCADE,
  designer_id              UUID NOT NULL REFERENCES designer_profiles(id) ON DELETE CASCADE,
  client_id                UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
  status                   designer_order_status NOT NULL DEFAULT 'requested',
  price_agreed             DECIMAL(10, 2) NOT NULL,
  platform_fee             DECIMAL(10, 2) NOT NULL DEFAULT 0,
  designer_payout          DECIMAL(10, 2) NOT NULL,
  client_notes             TEXT NOT NULL DEFAULT '',
  client_photos            TEXT[] NOT NULL DEFAULT '{}',
  room_dimensions          JSONB,
  deliverables             TEXT[],
  revision_count           INTEGER NOT NULL DEFAULT 0,
  max_revisions            INTEGER NOT NULL DEFAULT 1,
  rating                   INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text              TEXT,
  linked_bom_id            UUID REFERENCES bom_projects(id) ON DELETE SET NULL,
  linked_project_id        UUID REFERENCES projects(id) ON DELETE SET NULL,
  stripe_payment_intent_id TEXT,
  completed_at             TIMESTAMPTZ,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Indexes
CREATE INDEX idx_designer_orders_service ON designer_orders (service_id);
CREATE INDEX idx_designer_orders_designer ON designer_orders (designer_id);
CREATE INDEX idx_designer_orders_client ON designer_orders (client_id);
CREATE INDEX idx_designer_orders_status ON designer_orders (status);
CREATE INDEX idx_designer_orders_created ON designer_orders (created_at DESC);

-- 4. Reuse updated_at trigger
CREATE TRIGGER trg_designer_orders_updated_at
  BEFORE UPDATE ON designer_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 5. Enable RLS
ALTER TABLE designer_orders ENABLE ROW LEVEL SECURITY;

-- Designers can read their own orders
CREATE POLICY "Designer can read own orders"
  ON designer_orders
  FOR SELECT
  USING (
    designer_id IN (
      SELECT dp.id FROM designer_profiles dp
      JOIN users_profile up ON dp.user_id = up.id
      WHERE up.clerk_id = auth.jwt() ->> 'sub'
    )
  );

-- Clients can read their own orders
CREATE POLICY "Client can read own orders"
  ON designer_orders
  FOR SELECT
  USING (
    client_id IN (
      SELECT id FROM users_profile WHERE clerk_id = auth.jwt() ->> 'sub'
    )
  );

-- Clients can create orders (place an order for a service)
CREATE POLICY "Client can create orders"
  ON designer_orders
  FOR INSERT
  WITH CHECK (
    client_id IN (
      SELECT id FROM users_profile WHERE clerk_id = auth.jwt() ->> 'sub'
    )
  );

-- Designers can update their own orders (accept, deliver, etc.)
CREATE POLICY "Designer can update own orders"
  ON designer_orders
  FOR UPDATE
  USING (
    designer_id IN (
      SELECT dp.id FROM designer_profiles dp
      JOIN users_profile up ON dp.user_id = up.id
      WHERE up.clerk_id = auth.jwt() ->> 'sub'
    )
  );

-- Clients can update their own orders (add review, request revision, cancel)
CREATE POLICY "Client can update own orders"
  ON designer_orders
  FOR UPDATE
  USING (
    client_id IN (
      SELECT id FROM users_profile WHERE clerk_id = auth.jwt() ->> 'sub'
    )
  );
