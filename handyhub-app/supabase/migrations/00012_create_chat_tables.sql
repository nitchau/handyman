-- ============================================================
-- 00012 · Chat persistence tables
-- ============================================================

-- Trigram extension for fast ilike search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ── chat_sessions ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS chat_sessions (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id    text        NOT NULL,
  title       text,
  message_count int       NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_sessions_clerk_id
  ON chat_sessions (clerk_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_created_at
  ON chat_sessions (created_at DESC);

-- Reuse the existing update_updated_at() trigger function
CREATE TRIGGER trg_chat_sessions_updated_at
  BEFORE UPDATE ON chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own chat sessions"
  ON chat_sessions FOR SELECT
  USING (clerk_id = auth.jwt() ->> 'sub');

CREATE POLICY "Service role manages chat sessions"
  ON chat_sessions FOR ALL
  USING (auth.role() = 'service_role');

-- ── chat_messages ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS chat_messages (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  uuid        NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role        text        NOT NULL CHECK (role IN ('user', 'model')),
  content     text        NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id
  ON chat_messages (session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at
  ON chat_messages (created_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_content_trgm
  ON chat_messages USING gin (content gin_trgm_ops);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own chat messages"
  ON chat_messages FOR SELECT
  USING (
    session_id IN (
      SELECT cs.id FROM chat_sessions cs
      WHERE cs.clerk_id = auth.jwt() ->> 'sub'
    )
  );

CREATE POLICY "Service role manages chat messages"
  ON chat_messages FOR ALL
  USING (auth.role() = 'service_role');

-- ── chat_rate_limits ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS chat_rate_limits (
  clerk_id      text  PRIMARY KEY,
  message_count int   NOT NULL DEFAULT 0,
  window_date   date  NOT NULL DEFAULT CURRENT_DATE,
  updated_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE chat_rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages chat rate limits"
  ON chat_rate_limits FOR ALL
  USING (auth.role() = 'service_role');

-- ── Helper functions ────────────────────────────────────────

-- Atomic rate-limit increment; resets if the day has changed.
CREATE OR REPLACE FUNCTION increment_chat_rate_limit(p_clerk_id text)
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count int;
BEGIN
  INSERT INTO chat_rate_limits (clerk_id, message_count, window_date, updated_at)
  VALUES (p_clerk_id, 1, CURRENT_DATE, now())
  ON CONFLICT (clerk_id) DO UPDATE
    SET message_count = CASE
          WHEN chat_rate_limits.window_date < CURRENT_DATE THEN 1
          ELSE chat_rate_limits.message_count + 1
        END,
        window_date = CURRENT_DATE,
        updated_at  = now()
  RETURNING message_count INTO v_count;

  RETURN v_count;
END;
$$;

-- Recount messages for a given session.
CREATE OR REPLACE FUNCTION update_chat_session_count(p_session_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE chat_sessions
  SET message_count = (
    SELECT count(*) FROM chat_messages WHERE session_id = p_session_id
  )
  WHERE id = p_session_id;
END;
$$;
