-- ═══════════════════════════════════════════════════════════════════════════════
-- REPORTING & MONITORING SYSTEM — COMPLETE DATABASE SCHEMA

-- Compatible with: Supabase (PostgreSQL 15+)
-- Auth: Custom JWT / bcrypt (NOT Supabase Auth)
-- Run in: Supabase Dashboard → SQL Editor
-- Safe to run on a fresh database. Plan tables use DROP+CREATE (teammate's version).
-- ═══════════════════════════════════════════════════════════════════════════════


-- ──────────────────────────────────────────────────────────────
-- 1. USERS
-- Must be created first — all report tables reference users.id
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username      TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    phone         TEXT NOT NULL UNIQUE,
    role          TEXT NOT NULL CHECK (role IN ('admin', 'sub-city', 'wereda')),
    created_at    TIMESTAMPTZ DEFAULT now()
);


-- ──────────────────────────────────────────────────────────────
-- 2. BUUSAA REPORTS
-- Note: DB column is inisheetevii_... (with 'evii')
--       Frontend sends   inisheetivii_... (with 'ivii')
--       Controller maps the two spellings at the app layer.
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS buusaa_reports (
    id                           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id                      UUID REFERENCES users(id) ON DELETE SET NULL,
    username                     TEXT,
    role                         TEXT,
    report_date                  DATE NOT NULL,
    report_type                  TEXT,
    hubannoo_uummuu              NUMERIC DEFAULT 0,
    horannaa_misensaa            NUMERIC DEFAULT 0,
    buusi_jirataa                NUMERIC DEFAULT 0,
    gumaata_jirataa              NUMERIC DEFAULT 0,
    buusi_daldalaa               NUMERIC DEFAULT 0,
    buusi_daldalaa_fi_gumaataa   NUMERIC DEFAULT 0,
    inisheetevii_buusaa_gonofaa  NUMERIC DEFAULT 0,
    gumaata_midhaani             NUMERIC DEFAULT 0,
    nyaata_barataa               NUMERIC DEFAULT 0,
    zayitii                      NUMERIC DEFAULT 0,
    sukkaara                     NUMERIC DEFAULT 0,
    yaada_gudinaa                TEXT,
    created_at                   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_buusaa_reports_user_id
    ON buusaa_reports (user_id);
CREATE INDEX IF NOT EXISTS idx_buusaa_reports_report_date
    ON buusaa_reports (report_date DESC);


-- ──────────────────────────────────────────────────────────────
-- 3. CARRAA HOJII UUMUU (Employment Creation)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS carraa_hojii_uumuu (
    id                       BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id                  UUID REFERENCES users(id) ON DELETE SET NULL,
    username                 TEXT,
    role                     TEXT,
    report_date              DATE NOT NULL,
    report_type              TEXT,
    leenjii                  NUMERIC DEFAULT 0,
    carraa_hojii_dhaabbii    NUMERIC DEFAULT 0,
    carraa_hojii_qacarrii    NUMERIC DEFAULT 0,
    qusannaa_haawaasaa       NUMERIC DEFAULT 0,
    qusanna_dirqii           NUMERIC DEFAULT 0,
    kenna_liqii              NUMERIC DEFAULT 0,
    deebii_liqii_bilchaate   NUMERIC DEFAULT 0,
    deebii_liqii_bulee       NUMERIC DEFAULT 0,
    industrii_godoo          NUMERIC DEFAULT 0,
    yaada_gudinaa            TEXT,
    created_at               TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_carraa_hojii_user_id
    ON carraa_hojii_uumuu (user_id);
CREATE INDEX IF NOT EXISTS idx_carraa_hojii_report_date
    ON carraa_hojii_uumuu (report_date DESC);


-- ──────────────────────────────────────────────────────────────
-- 4. QONNA (Agriculture / Livestock)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS qonna (
    id                           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id                      UUID REFERENCES users(id) ON DELETE SET NULL,
    username                     TEXT,
    role                         TEXT,
    report_date                  DATE NOT NULL,
    report_type                  TEXT,
    furdisa_bakka_qophaawe       NUMERIC DEFAULT 0,
    furdisa_sheedii_ijaaraman    NUMERIC DEFAULT 0,
    furdisa_lakk_horii           NUMERIC DEFAULT 0,
    annan_bakka_qophaawe         NUMERIC DEFAULT 0,
    annan_sheedii_ijaaraman      NUMERIC DEFAULT 0,
    annan_lakk_saaa              NUMERIC DEFAULT 0,
    lukkuu_bakka_qophaawe        NUMERIC DEFAULT 0,
    lukkuu_sheedii_ijaaraman     NUMERIC DEFAULT 0,
    lukkuu_lakk_lukkuu           NUMERIC DEFAULT 0,
    boyyee_bakka_qophaawe        NUMERIC DEFAULT 0,
    boyyee_sheedii_ijaaraman     NUMERIC DEFAULT 0,
    boyyee_lakk_booyyee          NUMERIC DEFAULT 0,
    kannisaa_bakka_qophaawe      NUMERIC DEFAULT 0,
    kannisaa_gaaguraa_ijaaraman  NUMERIC DEFAULT 0,
    kannisaa_lakk_kannisaa       NUMERIC DEFAULT 0,
    qurxummii_bakka_qophaawe     NUMERIC DEFAULT 0,
    qurxummii_pondii_ijaaraman   NUMERIC DEFAULT 0,
    qurxummii_lakk_qurxummii     NUMERIC DEFAULT 0,
    yaada_gudinaa                TEXT,
    created_at                   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_qonna_user_id
    ON qonna (user_id);
CREATE INDEX IF NOT EXISTS idx_qonna_report_date
    ON qonna (report_date DESC);


-- ──────────────────────────────────────────────────────────────
-- 5. DALDALA (Trade)
-- Table name is exactly "Daldala" (capital D) — matches the controller.
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Daldala" (
    id                     BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id                UUID REFERENCES users(id) ON DELETE SET NULL,
    username               TEXT,
    role                   TEXT,
    report_date            DATE NOT NULL,
    report_type            TEXT,
    galmee_haraa           NUMERIC DEFAULT 0,
    heyyema_haraa          NUMERIC DEFAULT 0,
    harahessaa             NUMERIC DEFAULT 0,
    galii_daldalarra_galuu NUMERIC DEFAULT 0,
    toannoo_walii_gala     NUMERIC DEFAULT 0,
    tmd                    NUMERIC DEFAULT 0,
    intarshippii           NUMERIC DEFAULT 0,
    ggg                    NUMERIC DEFAULT 0,
    gabayaa_sanbata        NUMERIC DEFAULT 0,
    whg_kudraa             NUMERIC DEFAULT 0,
    whg_mudraa             NUMERIC DEFAULT 0,
    yaada_gudinaa          TEXT,
    created_at             TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_daldala_user_id
    ON "Daldala" (user_id);
CREATE INDEX IF NOT EXISTS idx_daldala_report_date
    ON "Daldala" (report_date DESC);


-- ──────────────────────────────────────────────────────────────
-- 6. ATK (Construction / Building Permits)
-- Table name is exactly "ATK" (all caps) — matches the controller.
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "ATK" (
    id                            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id                       UUID REFERENCES users(id) ON DELETE SET NULL,
    username                      TEXT,
    role                          TEXT,
    report_date                   DATE NOT NULL,
    report_type                   TEXT,
    waliigaltee_pilaanii_kennuu   NUMERIC DEFAULT 0,
    heeyyama_ijaarsaa_kennamee    NUMERIC DEFAULT 0,
    toannoo_fi_hordoffii_gamoo    NUMERIC DEFAULT 0,
    galii_atk_galchuu             NUMERIC DEFAULT 0,
    yaada_gudinaa                 TEXT,
    created_at                    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_atk_user_id
    ON "ATK" (user_id);
CREATE INDEX IF NOT EXISTS idx_atk_report_date
    ON "ATK" (report_date DESC);


-- ──────────────────────────────────────────────────────────────
-- 7. REVENUE ENTRIES
-- Linked by username (text), not by user_id UUID.
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS revenue_entries (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username    TEXT,
    gosa_galii  TEXT,
    madda_galii TEXT,
    baasii      NUMERIC DEFAULT 0,
    guyyaa      DATE,
    report_date DATE,
    created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_revenue_entries_username
    ON revenue_entries (username);
CREATE INDEX IF NOT EXISTS idx_revenue_entries_report_date
    ON revenue_entries (report_date DESC);


-- ──────────────────────────────────────────────────────────────
-- 8. ANNUAL PLANS (per wereda user, locked after first creation)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS annual_plans (
    id                        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id                   UUID REFERENCES users(id) ON DELETE SET NULL,
    year                      INTEGER NOT NULL,
    hubannoo_uummuu_target    NUMERIC DEFAULT 0,
    horannaa_misensaa_target  NUMERIC DEFAULT 0,
    buusi_jirataa_target      NUMERIC DEFAULT 0,
    buusi_daldalaa_target     NUMERIC DEFAULT 0,
    created_at                TIMESTAMPTZ DEFAULT now(),
    UNIQUE (user_id, year)
);


-- ──────────────────────────────────────────────────────────────
-- 9. SUBCITY QONNA PLAN (subcity level, upsert on year)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subcity_qonna_plan (
    id                                   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    year                                 INTEGER NOT NULL UNIQUE,
    furdisa_qophi_lafa                   NUMERIC DEFAULT 0,
    furdisa_lakk_sheedii                 NUMERIC DEFAULT 0,
    furdisa_lakk_horii_waliigalaa        NUMERIC DEFAULT 0,
    annan_qophi_lafa                     NUMERIC DEFAULT 0,
    annan_lakk_sheedii                   NUMERIC DEFAULT 0,
    annan_lakk_saa_waliigalaa            NUMERIC DEFAULT 0,
    lukkuu_qophi_lafa                    NUMERIC DEFAULT 0,
    lukkuu_lakk_sheedii                  NUMERIC DEFAULT 0,
    lukkuu_lakk_lukkuu_waliigalaa        NUMERIC DEFAULT 0,
    booyee_qophi_lafa                    NUMERIC DEFAULT 0,
    booyee_lakk_sheedii                  NUMERIC DEFAULT 0,
    booyee_lakk_booyyee_waliigalaa       NUMERIC DEFAULT 0,
    kannisaa_qophi_lafa                  NUMERIC DEFAULT 0,
    kannisaa_lakk_gaaguraa               NUMERIC DEFAULT 0,
    kannisaa_lakk_kannisaa_waliigalaa    NUMERIC DEFAULT 0,
    qurxummii_qophi_lafa                 NUMERIC DEFAULT 0,
    qurxummii_lakk_pondii                NUMERIC DEFAULT 0,
    qurxummii_lakk_qurxummii_waliigalaa  NUMERIC DEFAULT 0,
    created_at                           TIMESTAMPTZ DEFAULT now()
);


-- ──────────────────────────────────────────────────────────────
-- 10. PER-WEREDA QONNA PLAN TABLES (4 tables, upsert on year)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS annual_qonna_plan_wereda_1 (
    id                                          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    year                                        INTEGER NOT NULL UNIQUE,
    furdisa_qophi_lafa_target                   NUMERIC DEFAULT 0,
    furdisa_lakk_sheedii_target                 NUMERIC DEFAULT 0,
    furdisa_lakk_horii_waliigalaa_target        NUMERIC DEFAULT 0,
    annan_qophi_lafa_target                     NUMERIC DEFAULT 0,
    annan_lakk_sheedii_target                   NUMERIC DEFAULT 0,
    annan_lakk_saa_waliigalaa_target            NUMERIC DEFAULT 0,
    lukkuu_qophi_lafa_target                    NUMERIC DEFAULT 0,
    lukkuu_lakk_sheedii_target                  NUMERIC DEFAULT 0,
    lukkuu_lakk_lukkuu_waliigalaa_target        NUMERIC DEFAULT 0,
    booyee_qophi_lafa_target                    NUMERIC DEFAULT 0,
    booyee_lakk_sheedii_target                  NUMERIC DEFAULT 0,
    booyee_lakk_booyyee_waliigalaa_target       NUMERIC DEFAULT 0,
    kannisaa_qophi_lafa_target                  NUMERIC DEFAULT 0,
    kannisaa_lakk_gaaguraa_target               NUMERIC DEFAULT 0,
    kannisaa_lakk_kannisaa_waliigalaa_target    NUMERIC DEFAULT 0,
    qurxummii_qophi_lafa_target                 NUMERIC DEFAULT 0,
    qurxummii_lakk_pondii_target                NUMERIC DEFAULT 0,
    qurxummii_lakk_qurxummii_waliigalaa_target  NUMERIC DEFAULT 0,
    created_at                                  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS annual_qonna_plan_wereda_2 (
    id                                          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    year                                        INTEGER NOT NULL UNIQUE,
    furdisa_qophi_lafa_target                   NUMERIC DEFAULT 0,
    furdisa_lakk_sheedii_target                 NUMERIC DEFAULT 0,
    furdisa_lakk_horii_waliigalaa_target        NUMERIC DEFAULT 0,
    annan_qophi_lafa_target                     NUMERIC DEFAULT 0,
    annan_lakk_sheedii_target                   NUMERIC DEFAULT 0,
    annan_lakk_saa_waliigalaa_target            NUMERIC DEFAULT 0,
    lukkuu_qophi_lafa_target                    NUMERIC DEFAULT 0,
    lukkuu_lakk_sheedii_target                  NUMERIC DEFAULT 0,
    lukkuu_lakk_lukkuu_waliigalaa_target        NUMERIC DEFAULT 0,
    booyee_qophi_lafa_target                    NUMERIC DEFAULT 0,
    booyee_lakk_sheedii_target                  NUMERIC DEFAULT 0,
    booyee_lakk_booyyee_waliigalaa_target       NUMERIC DEFAULT 0,
    kannisaa_qophi_lafa_target                  NUMERIC DEFAULT 0,
    kannisaa_lakk_gaaguraa_target               NUMERIC DEFAULT 0,
    kannisaa_lakk_kannisaa_waliigalaa_target    NUMERIC DEFAULT 0,
    qurxummii_qophi_lafa_target                 NUMERIC DEFAULT 0,
    qurxummii_lakk_pondii_target                NUMERIC DEFAULT 0,
    qurxummii_lakk_qurxummii_waliigalaa_target  NUMERIC DEFAULT 0,
    created_at                                  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS annual_qonna_plan_wereda_3 (
    id                                          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    year                                        INTEGER NOT NULL UNIQUE,
    furdisa_qophi_lafa_target                   NUMERIC DEFAULT 0,
    furdisa_lakk_sheedii_target                 NUMERIC DEFAULT 0,
    furdisa_lakk_horii_waliigalaa_target        NUMERIC DEFAULT 0,
    annan_qophi_lafa_target                     NUMERIC DEFAULT 0,
    annan_lakk_sheedii_target                   NUMERIC DEFAULT 0,
    annan_lakk_saa_waliigalaa_target            NUMERIC DEFAULT 0,
    lukkuu_qophi_lafa_target                    NUMERIC DEFAULT 0,
    lukkuu_lakk_sheedii_target                  NUMERIC DEFAULT 0,
    lukkuu_lakk_lukkuu_waliigalaa_target        NUMERIC DEFAULT 0,
    booyee_qophi_lafa_target                    NUMERIC DEFAULT 0,
    booyee_lakk_sheedii_target                  NUMERIC DEFAULT 0,
    booyee_lakk_booyyee_waliigalaa_target       NUMERIC DEFAULT 0,
    kannisaa_qophi_lafa_target                  NUMERIC DEFAULT 0,
    kannisaa_lakk_gaaguraa_target               NUMERIC DEFAULT 0,
    kannisaa_lakk_kannisaa_waliigalaa_target    NUMERIC DEFAULT 0,
    qurxummii_qophi_lafa_target                 NUMERIC DEFAULT 0,
    qurxummii_lakk_pondii_target                NUMERIC DEFAULT 0,
    qurxummii_lakk_qurxummii_waliigalaa_target  NUMERIC DEFAULT 0,
    created_at                                  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS annual_qonna_plan_wereda_4 (
    id                                          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    year                                        INTEGER NOT NULL UNIQUE,
    furdisa_qophi_lafa_target                   NUMERIC DEFAULT 0,
    furdisa_lakk_sheedii_target                 NUMERIC DEFAULT 0,
    furdisa_lakk_horii_waliigalaa_target        NUMERIC DEFAULT 0,
    annan_qophi_lafa_target                     NUMERIC DEFAULT 0,
    annan_lakk_sheedii_target                   NUMERIC DEFAULT 0,
    annan_lakk_saa_waliigalaa_target            NUMERIC DEFAULT 0,
    lukkuu_qophi_lafa_target                    NUMERIC DEFAULT 0,
    lukkuu_lakk_sheedii_target                  NUMERIC DEFAULT 0,
    lukkuu_lakk_lukkuu_waliigalaa_target        NUMERIC DEFAULT 0,
    booyee_qophi_lafa_target                    NUMERIC DEFAULT 0,
    booyee_lakk_sheedii_target                  NUMERIC DEFAULT 0,
    booyee_lakk_booyyee_waliigalaa_target       NUMERIC DEFAULT 0,
    kannisaa_qophi_lafa_target                  NUMERIC DEFAULT 0,
    kannisaa_lakk_gaaguraa_target               NUMERIC DEFAULT 0,
    kannisaa_lakk_kannisaa_waliigalaa_target    NUMERIC DEFAULT 0,
    qurxummii_qophi_lafa_target                 NUMERIC DEFAULT 0,
    qurxummii_lakk_pondii_target                NUMERIC DEFAULT 0,
    qurxummii_lakk_qurxummii_waliigalaa_target  NUMERIC DEFAULT 0,
    created_at                                  TIMESTAMPTZ DEFAULT now()
);


-- ═══════════════════════════════════════════════════════════════════════════════
-- UPDATED SQL COMMANDS FOR BUUSAA GONOFAA PLAN WITH SUKKAARA AND ZAYITII
-- (original teammate file — kept exactly as written)
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─── Drop old subcity plan table ─────────────────────────────────────────────
DROP TABLE IF EXISTS subcity_buusaa_gonofaa_plan;

-- ─── Create new subcity plan table with 10 fields (added sukkaara + zayitii) ─
CREATE TABLE subcity_buusaa_gonofaa_plan (
  id                              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  year                            int NOT NULL UNIQUE,
  hubannoo_uummuu                 numeric DEFAULT 0,
  horannaa_misensaa               numeric DEFAULT 0,
  buusi_jiraataa                  numeric DEFAULT 0,
  gumaata_jirataa                 numeric DEFAULT 0,
  buusi_daldalaa                  numeric DEFAULT 0,
  inisheetivii_buusaa_gonofaa     numeric DEFAULT 0,
  gumaata_mootummaa               numeric DEFAULT 0,
  nyaata_barataa                  numeric DEFAULT 0,
  sukkaara                        numeric DEFAULT 0,
  zayitii                         numeric DEFAULT 0,
  weight_w1                       int DEFAULT 0,
  weight_w2                       int DEFAULT 0,
  weight_w3                       int DEFAULT 0,
  weight_w4                       int DEFAULT 0,
  created_at                      timestamptz DEFAULT now()
);

-- ─── Drop old woreda plan tables ─────────────────────────────────────────────
DROP TABLE IF EXISTS annual_plan_wereda_1;
DROP TABLE IF EXISTS annual_plan_wereda_2;
DROP TABLE IF EXISTS annual_plan_wereda_3;
DROP TABLE IF EXISTS annual_plan_wereda_4;

-- ─── Recreate woreda plan tables with 10 target fields ───────────────────────
CREATE TABLE annual_plan_wereda_1 (
  id                                    bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  year                                  int NOT NULL UNIQUE,
  hubannoo_uummuu_target                numeric DEFAULT 0,
  horannaa_misensaa_target              numeric DEFAULT 0,
  buusi_jiraataa_target                 numeric DEFAULT 0,
  gumaata_jirataa_target                numeric DEFAULT 0,
  buusi_daldalaa_target                 numeric DEFAULT 0,
  inisheetivii_buusaa_gonofaa_target    numeric DEFAULT 0,
  gumaata_mootummaa_target              numeric DEFAULT 0,
  nyaata_barataa_target                 numeric DEFAULT 0,
  sukkaara_target                       numeric DEFAULT 0,
  zayitii_target                        numeric DEFAULT 0,
  created_at                            timestamptz DEFAULT now()
);

CREATE TABLE annual_plan_wereda_2 (
  id                                    bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  year                                  int NOT NULL UNIQUE,
  hubannoo_uummuu_target                numeric DEFAULT 0,
  horannaa_misensaa_target              numeric DEFAULT 0,
  buusi_jiraataa_target                 numeric DEFAULT 0,
  gumaata_jirataa_target                numeric DEFAULT 0,
  buusi_daldalaa_target                 numeric DEFAULT 0,
  inisheetivii_buusaa_gonofaa_target    numeric DEFAULT 0,
  gumaata_mootummaa_target              numeric DEFAULT 0,
  nyaata_barataa_target                 numeric DEFAULT 0,
  sukkaara_target                       numeric DEFAULT 0,
  zayitii_target                        numeric DEFAULT 0,
  created_at                            timestamptz DEFAULT now()
);

CREATE TABLE annual_plan_wereda_3 (
  id                                    bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  year                                  int NOT NULL UNIQUE,
  hubannoo_uummuu_target                numeric DEFAULT 0,
  horannaa_misensaa_target              numeric DEFAULT 0,
  buusi_jiraataa_target                 numeric DEFAULT 0,
  gumaata_jirataa_target                numeric DEFAULT 0,
  buusi_daldalaa_target                 numeric DEFAULT 0,
  inisheetivii_buusaa_gonofaa_target    numeric DEFAULT 0,
  gumaata_mootummaa_target              numeric DEFAULT 0,
  nyaata_barataa_target                 numeric DEFAULT 0,
  sukkaara_target                       numeric DEFAULT 0,
  zayitii_target                        numeric DEFAULT 0,
  created_at                            timestamptz DEFAULT now()
);

CREATE TABLE annual_plan_wereda_4 (
  id                                    bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  year                                  int NOT NULL UNIQUE,
  hubannoo_uummuu_target                numeric DEFAULT 0,
  horannaa_misensaa_target              numeric DEFAULT 0,
  buusi_jiraataa_target                 numeric DEFAULT 0,
  gumaata_jirataa_target                numeric DEFAULT 0,
  buusi_daldalaa_target                 numeric DEFAULT 0,
  inisheetivii_buusaa_gonofaa_target    numeric DEFAULT 0,
  gumaata_mootummaa_target              numeric DEFAULT 0,
  nyaata_barataa_target                 numeric DEFAULT 0,
  sukkaara_target                       numeric DEFAULT 0,
  zayitii_target                        numeric DEFAULT 0,
  created_at                            timestamptz DEFAULT now()
);


-- ═══════════════════════════════════════════════════════════════════════════════
-- NOTES
-- ═══════════════════════════════════════════════════════════════════════════════
-- Tables created by this script (19 total):
--   users
--   buusaa_reports
--   carraa_hojii_uumuu
--   qonna
--   "Daldala"            ← quoted, capital D, must match controller exactly
--   "ATK"                ← quoted, all caps, must match controller exactly
--   revenue_entries
--   annual_plans         ← locked per user+year (UNIQUE constraint)
--   subcity_qonna_plan
--   annual_qonna_plan_wereda_1..4
--   subcity_buusaa_gonofaa_plan   ← teammate's updated version (10 fields)
--   annual_plan_wereda_1..4       ← teammate's updated version (10 target fields)
--
-- Important:
--   • "Daldala" and "ATK" must always be quoted in SQL — Supabase JS handles
--     this automatically when you pass those strings to .from()
--   • inisheetevii_buusaa_gonofaa (in buusaa_reports) uses "evii" spelling;
--     the frontend sends "ivii" — the controller maps them at the app layer
--   • Wereda usernames must be registered exactly as:
--       "Aanaa Gooroo", "Aanaa Dhadacha Araaraa", "Aanaa Dhakaa Adii", "Aanaa Andoodee"
--   • weight_w1..w4 store percentages × 10 (e.g. 25.5% = 255)
-- ═══════════════════════════════════════════════════════════════════════════════
