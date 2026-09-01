-- =============================================================================
-- Galii Sassabu — Full Schema
-- Run this entire file in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- =============================================================================

-- ── 1. Woreda daily report table ─────────────────────────────────────────────
-- Stores one row per woreda per day.
-- mana_qophessaa_total and idilee_total are the required totals.
-- The two JSONB columns hold optional per-source breakdowns entered by the woreda.
--   mana_qophessaa_detail: [{ "source": "Liizii", "amount": 5000 }, ...]
--   idilee_detail:         [{ "source": "VAT",    "amount": 3000 }, ...]

CREATE TABLE IF NOT EXISTS public.galii_sassabu_reports (
  id                      BIGSERIAL PRIMARY KEY,
  user_id                 UUID          NOT NULL,
  username                TEXT          NOT NULL,
  role                    TEXT,
  report_date             DATE          NOT NULL,
  report_type             TEXT          NOT NULL DEFAULT 'Daily Report (Gabaasa Guyyaa)',
  mana_qophessaa_total    NUMERIC(15,2) NOT NULL DEFAULT 0,
  idilee_total            NUMERIC(15,2) NOT NULL DEFAULT 0,
  mana_qophessaa_detail   JSONB,
  idilee_detail           JSONB,
  yaada_gudinaa           TEXT,
  created_at              TIMESTAMPTZ   DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_galii_sassabu_reports_user_date
  ON public.galii_sassabu_reports (user_id, report_date);

CREATE INDEX IF NOT EXISTS idx_galii_sassabu_reports_username_date
  ON public.galii_sassabu_reports (username, report_date);


-- ── 2. Subcity plan table ─────────────────────────────────────────────────────
-- Stores the subcity-level totals (sum of all 4 woredas). One row per year.

CREATE TABLE IF NOT EXISTS public.subcity_galii_sassabu_plan (
  id                        BIGSERIAL     PRIMARY KEY,
  year                      INTEGER       NOT NULL UNIQUE,
  mana_qophessaa_total      NUMERIC(15,2) NOT NULL DEFAULT 0,
  idilee_total              NUMERIC(15,2) NOT NULL DEFAULT 0,
  created_at                TIMESTAMPTZ   DEFAULT NOW(),
  updated_at                TIMESTAMPTZ   DEFAULT NOW()
);


-- ── 3. Per-woreda annual plan tables ─────────────────────────────────────────
-- One table per woreda. Subcity enters fixed targets directly for each woreda.
-- Woredas read these as read-only targets for their Work Analysis page.

CREATE TABLE IF NOT EXISTS public.annual_galii_sassabu_plan_wereda_1 (
  id                           BIGSERIAL     PRIMARY KEY,
  year                         INTEGER       NOT NULL UNIQUE,
  mana_qophessaa_total_target  NUMERIC(15,2) NOT NULL DEFAULT 0,
  idilee_total_target          NUMERIC(15,2) NOT NULL DEFAULT 0,
  created_at                   TIMESTAMPTZ   DEFAULT NOW(),
  updated_at                   TIMESTAMPTZ   DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.annual_galii_sassabu_plan_wereda_2 (
  id                           BIGSERIAL     PRIMARY KEY,
  year                         INTEGER       NOT NULL UNIQUE,
  mana_qophessaa_total_target  NUMERIC(15,2) NOT NULL DEFAULT 0,
  idilee_total_target          NUMERIC(15,2) NOT NULL DEFAULT 0,
  created_at                   TIMESTAMPTZ   DEFAULT NOW(),
  updated_at                   TIMESTAMPTZ   DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.annual_galii_sassabu_plan_wereda_3 (
  id                           BIGSERIAL     PRIMARY KEY,
  year                         INTEGER       NOT NULL UNIQUE,
  mana_qophessaa_total_target  NUMERIC(15,2) NOT NULL DEFAULT 0,
  idilee_total_target          NUMERIC(15,2) NOT NULL DEFAULT 0,
  created_at                   TIMESTAMPTZ   DEFAULT NOW(),
  updated_at                   TIMESTAMPTZ   DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.annual_galii_sassabu_plan_wereda_4 (
  id                           BIGSERIAL     PRIMARY KEY,
  year                         INTEGER       NOT NULL UNIQUE,
  mana_qophessaa_total_target  NUMERIC(15,2) NOT NULL DEFAULT 0,
  idilee_total_target          NUMERIC(15,2) NOT NULL DEFAULT 0,
  created_at                   TIMESTAMPTZ   DEFAULT NOW(),
  updated_at                   TIMESTAMPTZ   DEFAULT NOW()
);


-- ── 4. Row Level Security (match the pattern used by other sector tables) ────
-- Enable RLS but allow all authenticated users to read/write.
-- Adjust policies to match your existing setup if you use stricter RLS.

ALTER TABLE public.galii_sassabu_reports             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcity_galii_sassabu_plan        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.annual_galii_sassabu_plan_wereda_1 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.annual_galii_sassabu_plan_wereda_2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.annual_galii_sassabu_plan_wereda_3 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.annual_galii_sassabu_plan_wereda_4 ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users full access (same pattern as other tables)
CREATE POLICY IF NOT EXISTS "Allow authenticated full access"
  ON public.galii_sassabu_reports
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow authenticated full access"
  ON public.subcity_galii_sassabu_plan
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow authenticated full access"
  ON public.annual_galii_sassabu_plan_wereda_1
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow authenticated full access"
  ON public.annual_galii_sassabu_plan_wereda_2
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow authenticated full access"
  ON public.annual_galii_sassabu_plan_wereda_3
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow authenticated full access"
  ON public.annual_galii_sassabu_plan_wereda_4
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
