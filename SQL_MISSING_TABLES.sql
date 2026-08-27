-- ═══════════════════════════════════════════════════════════════════════════
-- MISSING TABLES & COLUMNS — run this in Supabase SQL Editor
-- Safe to run multiple times (uses IF NOT EXISTS / ADD COLUMN IF NOT EXISTS)
--
-- NOTE: user_id columns use BIGINT to match the actual users.id type in the
--       live database (the schema file says UUID but the live DB uses BIGINT).
-- ═══════════════════════════════════════════════════════════════════════════

-- ── 1. Missing columns on the users table ───────────────────────────────────
--    profile_photo  : base64 data-URL stored directly in DB
--    is_active      : lets admin deactivate/reactivate accounts

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS profile_photo TEXT,
  ADD COLUMN IF NOT EXISTS is_active     BOOLEAN NOT NULL DEFAULT true;


-- ── 2. edit_requests ────────────────────────────────────────────────────────
--    Woreda users request permission to edit a locked report.
--    Admin approves or denies.

CREATE TABLE IF NOT EXISTS edit_requests (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id      BIGINT      REFERENCES users(id) ON DELETE SET NULL,
  username     TEXT,
  sector       TEXT        NOT NULL,
  report_date  DATE        NOT NULL,
  report_type  TEXT        DEFAULT '',
  status       TEXT        NOT NULL DEFAULT 'pending'
                           CHECK (status IN ('pending','approved','denied')),
  resolved_at  TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_edit_requests_user_id
  ON edit_requests (user_id);
CREATE INDEX IF NOT EXISTS idx_edit_requests_status
  ON edit_requests (status);


-- ── 3. plan_unlock_requests ──────────────────────────────────────────────────
--    Subcity users request admin approval to re-save a locked annual plan.
--    Requests auto-expire after 5 days (tracked by expires_at).

CREATE TABLE IF NOT EXISTS plan_unlock_requests (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id      BIGINT      REFERENCES users(id) ON DELETE SET NULL,
  username     TEXT,
  sector       TEXT        NOT NULL,
  plan_year    INTEGER     NOT NULL,
  reason       TEXT        DEFAULT '',
  status       TEXT        NOT NULL DEFAULT 'pending'
                           CHECK (status IN ('pending','approved','denied','expired','used')),
  expires_at   TIMESTAMPTZ,
  resolved_at  TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_plan_unlock_user_id
  ON plan_unlock_requests (user_id);
CREATE INDEX IF NOT EXISTS idx_plan_unlock_status
  ON plan_unlock_requests (status);


-- ── 4. annual_plan_archive ───────────────────────────────────────────────────
--    After July 8 each year the subcity triggers an archive.
--    One row per (source_table, plan_year); safe to re-run / overwrite.

CREATE TABLE IF NOT EXISTS annual_plan_archive (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  source_table TEXT        NOT NULL,
  plan_year    INTEGER     NOT NULL,
  data         JSONB,
  archived_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE (source_table, plan_year)
);

CREATE INDEX IF NOT EXISTS idx_annual_plan_archive_year
  ON annual_plan_archive (plan_year);
