-- Migration: Create design_idea_likes and design_idea_saves tables

-- ── design_idea_likes ─────────────────────────────────────────────────

CREATE TABLE design_idea_likes (
  user_id        UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
  design_idea_id UUID NOT NULL REFERENCES design_ideas(id) ON DELETE CASCADE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT pk_design_idea_likes PRIMARY KEY (user_id, design_idea_id)
);

CREATE INDEX idx_design_idea_likes_design ON design_idea_likes (design_idea_id);
CREATE INDEX idx_design_idea_likes_user ON design_idea_likes (user_id);

ALTER TABLE design_idea_likes ENABLE ROW LEVEL SECURITY;

-- Anyone can see like counts (read all)
CREATE POLICY "Public read likes"
  ON design_idea_likes
  FOR SELECT
  USING (true);

-- Users can insert their own likes
CREATE POLICY "Users can like"
  ON design_idea_likes
  FOR INSERT
  WITH CHECK (
    user_id IN (
      SELECT id FROM users_profile WHERE clerk_id = auth.jwt() ->> 'sub'
    )
  );

-- Users can remove their own likes
CREATE POLICY "Users can unlike"
  ON design_idea_likes
  FOR DELETE
  USING (
    user_id IN (
      SELECT id FROM users_profile WHERE clerk_id = auth.jwt() ->> 'sub'
    )
  );

-- ── design_idea_saves ─────────────────────────────────────────────────

CREATE TABLE design_idea_saves (
  user_id         UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
  design_idea_id  UUID NOT NULL REFERENCES design_ideas(id) ON DELETE CASCADE,
  collection_name TEXT NOT NULL DEFAULT 'Saved',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT pk_design_idea_saves PRIMARY KEY (user_id, design_idea_id)
);

CREATE INDEX idx_design_idea_saves_design ON design_idea_saves (design_idea_id);
CREATE INDEX idx_design_idea_saves_user ON design_idea_saves (user_id);
CREATE INDEX idx_design_idea_saves_collection ON design_idea_saves (user_id, collection_name);

ALTER TABLE design_idea_saves ENABLE ROW LEVEL SECURITY;

-- Users can read their own saves
CREATE POLICY "Users can read own saves"
  ON design_idea_saves
  FOR SELECT
  USING (
    user_id IN (
      SELECT id FROM users_profile WHERE clerk_id = auth.jwt() ->> 'sub'
    )
  );

-- Users can insert their own saves
CREATE POLICY "Users can save"
  ON design_idea_saves
  FOR INSERT
  WITH CHECK (
    user_id IN (
      SELECT id FROM users_profile WHERE clerk_id = auth.jwt() ->> 'sub'
    )
  );

-- Users can update their own saves (e.g. move to a different collection)
CREATE POLICY "Users can update own saves"
  ON design_idea_saves
  FOR UPDATE
  USING (
    user_id IN (
      SELECT id FROM users_profile WHERE clerk_id = auth.jwt() ->> 'sub'
    )
  );

-- Users can remove their own saves
CREATE POLICY "Users can unsave"
  ON design_idea_saves
  FOR DELETE
  USING (
    user_id IN (
      SELECT id FROM users_profile WHERE clerk_id = auth.jwt() ->> 'sub'
    )
  );
