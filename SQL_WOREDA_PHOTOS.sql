-- ═══════════════════════════════════════════════════════════════════════════════
-- WOREDA PHOTOS TABLE
-- Run this in: Supabase Dashboard → SQL Editor
-- Safe to re-run (uses IF NOT EXISTS)
-- ═══════════════════════════════════════════════════════════════════════════════

-- Each row is one photo submission by a woreda user.
-- photo_data : base64 data-URL (same approach as profile_photo on users table)
-- woreda_id  : "w1" | "w2" | "w3" | "w4"  — identifies which woreda submitted it
-- submitted_by: username of the uploader

CREATE TABLE IF NOT EXISTS woreda_photos (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id       BIGINT      REFERENCES users(id) ON DELETE SET NULL,
  submitted_by  TEXT        NOT NULL,
  woreda_id     TEXT        NOT NULL CHECK (woreda_id IN ('w1', 'w2', 'w3', 'w4')),
  woreda_name   TEXT        NOT NULL,
  description   TEXT        NOT NULL DEFAULT '',
  photo_data    TEXT        NOT NULL,   -- base64 data:image/... URL
  submitted_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_woreda_photos_user_id
  ON woreda_photos (user_id);

CREATE INDEX IF NOT EXISTS idx_woreda_photos_woreda_id
  ON woreda_photos (woreda_id);

CREATE INDEX IF NOT EXISTS idx_woreda_photos_submitted_at
  ON woreda_photos (submitted_at DESC);
