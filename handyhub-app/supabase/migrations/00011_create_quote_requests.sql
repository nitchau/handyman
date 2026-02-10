-- ============================================================
-- Migration 00011: Create quote_requests table
-- ============================================================

-- 1. Status enum for quote requests
DO $$ BEGIN
  CREATE TYPE quote_request_status AS ENUM (
    'pending',
    'viewed',
    'responded',
    'closed'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 2. Quote requests table
CREATE TABLE IF NOT EXISTS quote_requests (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contractor_id   uuid NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
  description     text NOT NULL,
  timeline        text NOT NULL DEFAULT 'flexible',
  zip_code        text NOT NULL,
  sender_name     text,
  sender_email    text,
  sender_phone    text,
  status          quote_request_status NOT NULL DEFAULT 'pending',
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_quote_requests_contractor ON quote_requests(contractor_id);
CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON quote_requests(status);
CREATE INDEX IF NOT EXISTS idx_quote_requests_created ON quote_requests(created_at DESC);

-- 4. RLS — anonymous visitors can INSERT, contractors can read their own
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "quote_requests_public_insert" ON quote_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "quote_requests_contractor_read" ON quote_requests
  FOR SELECT USING (
    contractor_id IN (
      SELECT c.id FROM contractors c
      JOIN users_profile u ON c.user_id = u.id
      WHERE u.clerk_id = auth.uid()::text
    )
  );
