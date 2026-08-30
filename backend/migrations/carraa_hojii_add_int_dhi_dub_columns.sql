-- ============================================================
-- Migration: Carraa Hojii Uumuu — add correct sub-columns
-- Based on the official CHUO Excel template.
-- Run this in your Supabase SQL Editor.
-- ============================================================

-- ─── 1. Report table: carraa_hojii_uumuu ───────────────────────────────────
ALTER TABLE carraa_hojii_uumuu
  -- Leenjii: int, dhi, dub
  ADD COLUMN IF NOT EXISTS leenjii_int                    INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS leenjii_dhi                    INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS leenjii_dub                    INTEGER DEFAULT 0,
  -- Carraa Hojii Dhaabbii: int, dhi, dub
  ADD COLUMN IF NOT EXISTS carraa_hojii_dhaabbii_int      INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS carraa_hojii_dhaabbii_dhi      INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS carraa_hojii_dhaabbii_dub      INTEGER DEFAULT 0,
  -- Carraa Hojii Qacarrii: int, dhi, dub
  ADD COLUMN IF NOT EXISTS carraa_hojii_qacarrii_int      INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS carraa_hojii_qacarrii_dhi      INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS carraa_hojii_qacarrii_dub      INTEGER DEFAULT 0,
  -- Qusannaa Haawaasaa: int, qarshii
  ADD COLUMN IF NOT EXISTS qusannaa_haawaasaa_int         INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS qusannaa_haawaasaa_qarshii     NUMERIC DEFAULT 0,
  -- Kenna Liqii: int, mise, qarshii
  ADD COLUMN IF NOT EXISTS kenna_liqii_int                INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS kenna_liqii_mise               INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS kenna_liqii_qarshii            NUMERIC DEFAULT 0,
  -- Qusanna Dirqii: int, mise, qarshii
  ADD COLUMN IF NOT EXISTS qusanna_dirqii_int             INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS qusanna_dirqii_mise            INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS qusanna_dirqii_qarshii         NUMERIC DEFAULT 0,
  -- Deebii Liqii Bilchaate: int, qarshii
  ADD COLUMN IF NOT EXISTS deebii_liqii_bilchaate_int     INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS deebii_liqii_bilchaate_qarshii NUMERIC DEFAULT 0,
  -- Deebii Liqii Bulee: int, qarshii
  ADD COLUMN IF NOT EXISTS deebii_liqii_bulee_int         INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS deebii_liqii_bulee_qarshii     NUMERIC DEFAULT 0,
  -- Industrii Godoo: kilaastera, lafa (hek), carraa_hojii
  ADD COLUMN IF NOT EXISTS industrii_godoo_kilaastera     INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS industrii_godoo_lafa           NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS industrii_godoo_carraa_hojii   INTEGER DEFAULT 0;

-- ─── 2. Woreda plan tables: annual_carraa_plan_wereda_1 through _4 ──────────
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'annual_carraa_plan_wereda_1',
    'annual_carraa_plan_wereda_2',
    'annual_carraa_plan_wereda_3',
    'annual_carraa_plan_wereda_4'
  ]
  LOOP
    EXECUTE format('ALTER TABLE %I
      ADD COLUMN IF NOT EXISTS leenjii_int_target                    INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS leenjii_dhi_target                    INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS leenjii_dub_target                    INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS carraa_hojii_dhaabbii_int_target      INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS carraa_hojii_dhaabbii_dhi_target      INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS carraa_hojii_dhaabbii_dub_target      INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS carraa_hojii_qacarrii_int_target      INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS carraa_hojii_qacarrii_dhi_target      INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS carraa_hojii_qacarrii_dub_target      INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS qusannaa_haawaasaa_int_target         INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS qusannaa_haawaasaa_qarshii_target     NUMERIC DEFAULT 0,
      ADD COLUMN IF NOT EXISTS kenna_liqii_int_target                INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS kenna_liqii_mise_target               INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS kenna_liqii_qarshii_target            NUMERIC DEFAULT 0,
      ADD COLUMN IF NOT EXISTS qusanna_dirqii_int_target             INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS qusanna_dirqii_mise_target            INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS qusanna_dirqii_qarshii_target         NUMERIC DEFAULT 0,
      ADD COLUMN IF NOT EXISTS deebii_liqii_bilchaate_int_target     INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS deebii_liqii_bilchaate_qarshii_target NUMERIC DEFAULT 0,
      ADD COLUMN IF NOT EXISTS deebii_liqii_bulee_int_target         INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS deebii_liqii_bulee_qarshii_target     NUMERIC DEFAULT 0,
      ADD COLUMN IF NOT EXISTS industrii_godoo_kilaastera_target     INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS industrii_godoo_lafa_target           NUMERIC DEFAULT 0,
      ADD COLUMN IF NOT EXISTS industrii_godoo_carraa_hojii_target   INTEGER DEFAULT 0', tbl);
  END LOOP;
END $$;

-- ─── 3. Subcity totals table: subcity_carraa_plan ──────────────────────────
ALTER TABLE subcity_carraa_plan
  ADD COLUMN IF NOT EXISTS leenjii_int                    INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS leenjii_dhi                    INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS leenjii_dub                    INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS carraa_hojii_dhaabbii_int      INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS carraa_hojii_dhaabbii_dhi      INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS carraa_hojii_dhaabbii_dub      INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS carraa_hojii_qacarrii_int      INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS carraa_hojii_qacarrii_dhi      INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS carraa_hojii_qacarrii_dub      INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS qusannaa_haawaasaa_int         INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS qusannaa_haawaasaa_qarshii     NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS kenna_liqii_int                INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS kenna_liqii_mise               INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS kenna_liqii_qarshii            NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS qusanna_dirqii_int             INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS qusanna_dirqii_mise            INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS qusanna_dirqii_qarshii         NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS deebii_liqii_bilchaate_int     INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS deebii_liqii_bilchaate_qarshii NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS deebii_liqii_bulee_int         INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS deebii_liqii_bulee_qarshii     NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS industrii_godoo_kilaastera     INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS industrii_godoo_lafa           NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS industrii_godoo_carraa_hojii   INTEGER DEFAULT 0;

-- ============================================================
-- Done. Old columns (leenjii, carraa_hojii_dhaabbii, etc.)
-- are kept for backward compatibility with existing data.
-- ============================================================
