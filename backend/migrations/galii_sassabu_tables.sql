-- ─────────────────────────────────────────────────────────────────────────────
-- Galii Sassabu (Galii Sassaabu) — New Sector Tables
--
-- This sector tracks revenue collection broken down by:
--   1. Mana Qophessaa (prepared facilities) — reports a total amount (qarshii)
--      and can optionally list sub-sources when submitting.
--   2. Idilee (ordinary/regular) — reports a total amount (qarshii).
--
-- Plan: subcity enters totals → distributed to each woreda plan table.
-- Report: woreda enters Mana Qophessaa Total + Idilee Total per day.
--         Sub-source breakdowns are stored as supplementary detail rows.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Woreda report table ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS galii_sassabu_reports (
  id              BIGSERIAL PRIMARY KEY,
  user_id         UUID        NOT NULL,
  username        TEXT        NOT NULL,
  role            TEXT,
  report_date     DATE        NOT NULL,
  report_type     TEXT        NOT NULL DEFAULT 'Daily Report (Gabaasa Guyyaa)',

  -- Totals (required for every submission)
  mana_qophessaa_total  NUMERIC(15,2) NOT NULL DEFAULT 0,
  idilee_total          NUMERIC(15,2) NOT NULL DEFAULT 0,

  -- Optional sub-source breakdown for Mana Qophessaa (stored as JSON array)
  -- Each element: { source: string, amount: number }
  mana_qophessaa_detail JSONB,

  -- Optional sub-source breakdown for Idilee (stored as JSON array)
  -- Each element: { source: string, amount: number }
  idilee_detail         JSONB,

  yaada_gudinaa   TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2. Subcity plan table ─────────────────────────────────────────────────────
-- Stores subcity-level totals. One row per year (upserted on year).

CREATE TABLE IF NOT EXISTS subcity_galii_sassabu_plan (
  id                        BIGSERIAL PRIMARY KEY,
  year                      INTEGER     NOT NULL UNIQUE,
  mana_qophessaa_total      NUMERIC(15,2) NOT NULL DEFAULT 0,
  idilee_total              NUMERIC(15,2) NOT NULL DEFAULT 0,
  created_at                TIMESTAMPTZ DEFAULT NOW(),
  updated_at                TIMESTAMPTZ DEFAULT NOW()
);

-- ── 3. Per-woreda plan tables ─────────────────────────────────────────────────
-- One table per woreda, matching the naming convention used by other sectors.
-- The subcity distributes targets here; woredas read them as read-only.

CREATE TABLE IF NOT EXISTS annual_galii_sassabu_plan_wereda_1 (
  id                        BIGSERIAL PRIMARY KEY,
  year                      INTEGER     NOT NULL UNIQUE,
  mana_qophessaa_total_target  NUMERIC(15,2) NOT NULL DEFAULT 0,
  idilee_total_target          NUMERIC(15,2) NOT NULL DEFAULT 0,
  created_at                TIMESTAMPTZ DEFAULT NOW(),
  updated_at                TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS annual_galii_sassabu_plan_wereda_2 (
  id                        BIGSERIAL PRIMARY KEY,
  year                      INTEGER     NOT NULL UNIQUE,
  mana_qophessaa_total_target  NUMERIC(15,2) NOT NULL DEFAULT 0,
  idilee_total_target          NUMERIC(15,2) NOT NULL DEFAULT 0,
  created_at                TIMESTAMPTZ DEFAULT NOW(),
  updated_at                TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS annual_galii_sassabu_plan_wereda_3 (
  id                        BIGSERIAL PRIMARY KEY,
  year                      INTEGER     NOT NULL UNIQUE,
  mana_qophessaa_total_target  NUMERIC(15,2) NOT NULL DEFAULT 0,
  idilee_total_target          NUMERIC(15,2) NOT NULL DEFAULT 0,
  created_at                TIMESTAMPTZ DEFAULT NOW(),
  updated_at                TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS annual_galii_sassabu_plan_wereda_4 (
  id                        BIGSERIAL PRIMARY KEY,
  year                      INTEGER     NOT NULL UNIQUE,
  mana_qophessaa_total_target  NUMERIC(15,2) NOT NULL DEFAULT 0,
  idilee_total_target          NUMERIC(15,2) NOT NULL DEFAULT 0,
  created_at                TIMESTAMPTZ DEFAULT NOW(),
  updated_at                TIMESTAMPTZ DEFAULT NOW()
);

-- ── 4. Indexes for performance ────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_galii_sassabu_reports_user_date
  ON galii_sassabu_reports (user_id, report_date);

CREATE INDEX IF NOT EXISTS idx_galii_sassabu_reports_username_date
  ON galii_sassabu_reports (username, report_date);
