-- ═══════════════════════════════════════════════════════════════════════════════
-- ANNOUNCEMENTS TABLE
-- Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS announcements (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title      TEXT NOT NULL,
  body       TEXT NOT NULL,
  created_by TEXT NOT NULL,           -- username of the sub-city user who posted
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_announcements_created_at
  ON announcements (created_at DESC);

-- ─── Unread tracking per woreda ───────────────────────────────────────────────
-- Stores the id of the last announcement each woreda user has "seen".
-- When latest announcement id > last_seen_id → unread badge shows.
CREATE TABLE IF NOT EXISTS announcement_reads (
  username            TEXT PRIMARY KEY,
  last_seen_id        BIGINT NOT NULL DEFAULT 0
);
