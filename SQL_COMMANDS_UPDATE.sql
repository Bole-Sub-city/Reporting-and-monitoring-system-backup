-- ═══════════════════════════════════════════════════════════════════════════════
-- REPORTING & MONITORING SYSTEM — COMPLETE DATABASE SCHEMA
-- Merged: full schema (Kiro) + plan table updates (teammate)
-- Compatible with: Supabase (PostgreSQL 15+)
-- Auth: Custom JWT / bcrypt (NOT Supabase Auth)
-- Run in: Supabase Dashboard → SQL Editor
-- NOTE: No foreign key constraints on user_id — avoids UUID vs BIGINT mismatch.
--       user_id is stored as TEXT to be compatible with any users.id type.
-- ═══════════════════════════════════════════════════════════════════════════════


-- ──────────────────────────────────────────────────────────────
-- 1. USERS
-- Skip if already exists — do not alter the existing table.
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
    user_id                      TEXT,
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
    user_id                  TEXT,
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
    user_id                      TEXT,
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
    user_id                TEXT,
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
    user_id                       TEXT,
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
-- Linked by username (text) — no user_id needed.
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
-- DROP first to remove the old FK constraint from supabase_annual_plans.sql
-- user_id stored as TEXT — no FK constraint to avoid type mismatch.
-- UNIQUE (user_id, year) still enforces one plan per user per year.
-- ──────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS annual_plans;
CREATE TABLE annual_plans (
    id                        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id                   TEXT NOT NULL,
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


-- ──────────────────────────────────────────────────────────────
-- 11. SUBCITY CARRAA HOJII PLAN + 4 WEREDA TABLES
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subcity_carraa_plan (
    id                              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    year                            INTEGER NOT NULL UNIQUE,
    leenjii                         NUMERIC DEFAULT 0,
    carraa_hojii_dhaabbii           NUMERIC DEFAULT 0,
    carraa_hojii_qacarrii           NUMERIC DEFAULT 0,
    qusannaa                        NUMERIC DEFAULT 0,
    qusanna_dirqii                  NUMERIC DEFAULT 0,
    liqii                           NUMERIC DEFAULT 0,
    deebii_liqii_bilchaate          NUMERIC DEFAULT 0,
    deebii_liqii_bulee              NUMERIC DEFAULT 0,
    industrii_godoo                 NUMERIC DEFAULT 0,
    weight_w1                       INTEGER DEFAULT 0,
    weight_w2                       INTEGER DEFAULT 0,
    weight_w3                       INTEGER DEFAULT 0,
    weight_w4                       INTEGER DEFAULT 0,
    created_at                      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS annual_carraa_plan_wereda_1 (
    id                              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    year                            INTEGER NOT NULL UNIQUE,
    leenjii_target                  NUMERIC DEFAULT 0,
    carraa_hojii_dhaabbii_target    NUMERIC DEFAULT 0,
    carraa_hojii_qacarrii_target    NUMERIC DEFAULT 0,
    qusannaa_target                 NUMERIC DEFAULT 0,
    qusanna_dirqii_target           NUMERIC DEFAULT 0,
    liqii_target                    NUMERIC DEFAULT 0,
    deebii_liqii_bilchaate_target   NUMERIC DEFAULT 0,
    deebii_liqii_bulee_target       NUMERIC DEFAULT 0,
    industrii_godoo_target          NUMERIC DEFAULT 0,
    created_at                      TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS annual_carraa_plan_wereda_2 (LIKE annual_carraa_plan_wereda_1 INCLUDING ALL);
CREATE TABLE IF NOT EXISTS annual_carraa_plan_wereda_3 (LIKE annual_carraa_plan_wereda_1 INCLUDING ALL);
CREATE TABLE IF NOT EXISTS annual_carraa_plan_wereda_4 (LIKE annual_carraa_plan_wereda_1 INCLUDING ALL);

-- ──────────────────────────────────────────────────────────────
-- 12. SUBCITY DALDALA PLAN + 4 WEREDA TABLES
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subcity_daldala_plan (
    id                              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    year                            INTEGER NOT NULL UNIQUE,
    galmee_haraa                    NUMERIC DEFAULT 0,
    heyyema_haraa                   NUMERIC DEFAULT 0,
    harahessaa                      NUMERIC DEFAULT 0,
    galii_daldalarra_galuu          NUMERIC DEFAULT 0,
    toannoo_walii_gala              NUMERIC DEFAULT 0,
    tmd                             NUMERIC DEFAULT 0,
    intarshippii                    NUMERIC DEFAULT 0,
    ggg                             NUMERIC DEFAULT 0,
    gabayaa_sanbata                 NUMERIC DEFAULT 0,
    whg_kudraa                      NUMERIC DEFAULT 0,
    whg_mudraa                      NUMERIC DEFAULT 0,
    weight_w1                       INTEGER DEFAULT 0,
    weight_w2                       INTEGER DEFAULT 0,
    weight_w3                       INTEGER DEFAULT 0,
    weight_w4                       INTEGER DEFAULT 0,
    created_at                      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS annual_daldala_plan_wereda_1 (
    id                              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    year                            INTEGER NOT NULL UNIQUE,
    galmee_haraa_target             NUMERIC DEFAULT 0,
    heyyema_haraa_target            NUMERIC DEFAULT 0,
    harahessaa_target               NUMERIC DEFAULT 0,
    galii_daldalarra_galuu_target   NUMERIC DEFAULT 0,
    toannoo_walii_gala_target       NUMERIC DEFAULT 0,
    tmd_target                      NUMERIC DEFAULT 0,
    intarshippii_target             NUMERIC DEFAULT 0,
    ggg_target                      NUMERIC DEFAULT 0,
    gabayaa_sanbata_target          NUMERIC DEFAULT 0,
    whg_kudraa_target               NUMERIC DEFAULT 0,
    whg_mudraa_target               NUMERIC DEFAULT 0,
    created_at                      TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS annual_daldala_plan_wereda_2 (LIKE annual_daldala_plan_wereda_1 INCLUDING ALL);
CREATE TABLE IF NOT EXISTS annual_daldala_plan_wereda_3 (LIKE annual_daldala_plan_wereda_1 INCLUDING ALL);
CREATE TABLE IF NOT EXISTS annual_daldala_plan_wereda_4 (LIKE annual_daldala_plan_wereda_1 INCLUDING ALL);

-- ──────────────────────────────────────────────────────────────
-- 13. SUBCITY ATK PLAN + 4 WEREDA TABLES
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subcity_atk_plan (
    id                              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    year                            INTEGER NOT NULL UNIQUE,
    waliigaltee_pilaanii_kennuu     NUMERIC DEFAULT 0,
    heeyyama_ijaarsaa_kennamee      NUMERIC DEFAULT 0,
    toannoo_fi_hordoffii_gamoo      NUMERIC DEFAULT 0,
    galii_atk_galchuu               NUMERIC DEFAULT 0,
    weight_w1                       INTEGER DEFAULT 0,
    weight_w2                       INTEGER DEFAULT 0,
    weight_w3                       INTEGER DEFAULT 0,
    weight_w4                       INTEGER DEFAULT 0,
    created_at                      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS annual_atk_plan_wereda_1 (
    id                                      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    year                                    INTEGER NOT NULL UNIQUE,
    waliigaltee_pilaanii_kennuu_target      NUMERIC DEFAULT 0,
    heeyyama_ijaarsaa_kennamee_target       NUMERIC DEFAULT 0,
    toannoo_fi_hordoffii_gamoo_target       NUMERIC DEFAULT 0,
    galii_atk_galchuu_target                NUMERIC DEFAULT 0,
    created_at                              TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS annual_atk_plan_wereda_2 (LIKE annual_atk_plan_wereda_1 INCLUDING ALL);
CREATE TABLE IF NOT EXISTS annual_atk_plan_wereda_3 (LIKE annual_atk_plan_wereda_1 INCLUDING ALL);
CREATE TABLE IF NOT EXISTS annual_atk_plan_wereda_4 (LIKE annual_atk_plan_wereda_1 INCLUDING ALL);

-- ──────────────────────────────────────────────────────────────
-- 14. SUBCITY REVENUE PLAN + 4 WEREDA TABLES
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subcity_revenue_plan (
    id                              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    year                            INTEGER NOT NULL UNIQUE,
    mana_qophessaa                  NUMERIC DEFAULT 0,
    idilee                          NUMERIC DEFAULT 0,
    weight_w1                       INTEGER DEFAULT 0,
    weight_w2                       INTEGER DEFAULT 0,
    weight_w3                       INTEGER DEFAULT 0,
    weight_w4                       INTEGER DEFAULT 0,
    created_at                      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS annual_revenue_plan_wereda_1 (
    id                              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    year                            INTEGER NOT NULL UNIQUE,
    mana_qophessaa_target           NUMERIC DEFAULT 0,
    idilee_target                   NUMERIC DEFAULT 0,
    created_at                      TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS annual_revenue_plan_wereda_2 (LIKE annual_revenue_plan_wereda_1 INCLUDING ALL);
CREATE TABLE IF NOT EXISTS annual_revenue_plan_wereda_3 (LIKE annual_revenue_plan_wereda_1 INCLUDING ALL);
CREATE TABLE IF NOT EXISTS annual_revenue_plan_wereda_4 (LIKE annual_revenue_plan_wereda_1 INCLUDING ALL);


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
--   users                        ← skipped if already exists
--   buusaa_reports
--   carraa_hojii_uumuu
--   qonna
--   "Daldala"                    ← quoted, capital D
--   "ATK"                        ← quoted, all caps
--   revenue_entries
--   annual_plans                 ← user_id TEXT, UNIQUE(user_id, year)
--   subcity_qonna_plan
--   annual_qonna_plan_wereda_1..4
--   subcity_buusaa_gonofaa_plan   ← teammate's version (10 fields)
--   annual_plan_wereda_1..4       ← teammate's version (10 target fields)
--
-- user_id columns are TEXT (no FK constraint) to avoid UUID/BIGINT type
-- conflicts with the existing users table. The backend stores user_id as
-- a string from the JWT payload, which works with TEXT columns.
-- ═══════════════════════════════════════════════════════════════════════════════


-- ═══════════════════════════════════════════════════════════════════════════════
-- GENERIC SECTOR PLAN TABLES
-- Covers: Carraa Hojii (carraa), Daldala (daldala), ATK (atk), Revenue/Galii (galii)
-- Pattern: subcity_X_plan (totals + weights) + annual_X_plan_wereda_1..4 (targets)
-- ═══════════════════════════════════════════════════════════════════════════════


-- ──────────────────────────────────────────────────────────────
-- CARRAA HOJII UUMUU PLANS
-- ──────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS subcity_carraa_plan;
CREATE TABLE subcity_carraa_plan (
  id                        bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  year                      int NOT NULL UNIQUE,
  leenjii                   numeric DEFAULT 0,
  carraa_hojii_dhaabbii     numeric DEFAULT 0,
  carraa_hojii_qacarrii     numeric DEFAULT 0,
  qusannaa_haawaasaa        numeric DEFAULT 0,
  qusanna_dirqii            numeric DEFAULT 0,
  kenna_liqii               numeric DEFAULT 0,
  deebii_liqii_bilchaate    numeric DEFAULT 0,
  deebii_liqii_bulee        numeric DEFAULT 0,
  industrii_godoo           numeric DEFAULT 0,
  weight_w1                 int DEFAULT 0,
  weight_w2                 int DEFAULT 0,
  weight_w3                 int DEFAULT 0,
  weight_w4                 int DEFAULT 0,
  created_at                timestamptz DEFAULT now()
);

DROP TABLE IF EXISTS annual_carraa_plan_wereda_1;
CREATE TABLE annual_carraa_plan_wereda_1 (
  id                              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  year                            int NOT NULL UNIQUE,
  leenjii_target                  numeric DEFAULT 0,
  carraa_hojii_dhaabbii_target    numeric DEFAULT 0,
  carraa_hojii_qacarrii_target    numeric DEFAULT 0,
  qusannaa_haawaasaa_target       numeric DEFAULT 0,
  qusanna_dirqii_target           numeric DEFAULT 0,
  kenna_liqii_target              numeric DEFAULT 0,
  deebii_liqii_bilchaate_target   numeric DEFAULT 0,
  deebii_liqii_bulee_target       numeric DEFAULT 0,
  industrii_godoo_target          numeric DEFAULT 0,
  created_at                      timestamptz DEFAULT now()
);

DROP TABLE IF EXISTS annual_carraa_plan_wereda_2;
CREATE TABLE annual_carraa_plan_wereda_2 (
  id                              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  year                            int NOT NULL UNIQUE,
  leenjii_target                  numeric DEFAULT 0,
  carraa_hojii_dhaabbii_target    numeric DEFAULT 0,
  carraa_hojii_qacarrii_target    numeric DEFAULT 0,
  qusannaa_haawaasaa_target       numeric DEFAULT 0,
  qusanna_dirqii_target           numeric DEFAULT 0,
  kenna_liqii_target              numeric DEFAULT 0,
  deebii_liqii_bilchaate_target   numeric DEFAULT 0,
  deebii_liqii_bulee_target       numeric DEFAULT 0,
  industrii_godoo_target          numeric DEFAULT 0,
  created_at                      timestamptz DEFAULT now()
);

DROP TABLE IF EXISTS annual_carraa_plan_wereda_3;
CREATE TABLE annual_carraa_plan_wereda_3 (
  id                              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  year                            int NOT NULL UNIQUE,
  leenjii_target                  numeric DEFAULT 0,
  carraa_hojii_dhaabbii_target    numeric DEFAULT 0,
  carraa_hojii_qacarrii_target    numeric DEFAULT 0,
  qusannaa_haawaasaa_target       numeric DEFAULT 0,
  qusanna_dirqii_target           numeric DEFAULT 0,
  kenna_liqii_target              numeric DEFAULT 0,
  deebii_liqii_bilchaate_target   numeric DEFAULT 0,
  deebii_liqii_bulee_target       numeric DEFAULT 0,
  industrii_godoo_target          numeric DEFAULT 0,
  created_at                      timestamptz DEFAULT now()
);

DROP TABLE IF EXISTS annual_carraa_plan_wereda_4;
CREATE TABLE annual_carraa_plan_wereda_4 (
  id                              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  year                            int NOT NULL UNIQUE,
  leenjii_target                  numeric DEFAULT 0,
  carraa_hojii_dhaabbii_target    numeric DEFAULT 0,
  carraa_hojii_qacarrii_target    numeric DEFAULT 0,
  qusannaa_haawaasaa_target       numeric DEFAULT 0,
  qusanna_dirqii_target           numeric DEFAULT 0,
  kenna_liqii_target              numeric DEFAULT 0,
  deebii_liqii_bilchaate_target   numeric DEFAULT 0,
  deebii_liqii_bulee_target       numeric DEFAULT 0,
  industrii_godoo_target          numeric DEFAULT 0,
  created_at                      timestamptz DEFAULT now()
);


-- ──────────────────────────────────────────────────────────────
-- DALDALA (TRADE) PLANS
-- ──────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS subcity_daldala_plan;
CREATE TABLE subcity_daldala_plan (
  id                        bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  year                      int NOT NULL UNIQUE,
  galmee_haraa              numeric DEFAULT 0,
  heyyema_haraa             numeric DEFAULT 0,
  harahessaa                numeric DEFAULT 0,
  galii_daldalarra_galuu    numeric DEFAULT 0,
  toannoo_walii_gala        numeric DEFAULT 0,
  tmd                       numeric DEFAULT 0,
  intarshippii              numeric DEFAULT 0,
  ggg                       numeric DEFAULT 0,
  gabayaa_sanbata           numeric DEFAULT 0,
  whg_kudraa                numeric DEFAULT 0,
  whg_mudraa                numeric DEFAULT 0,
  weight_w1                 int DEFAULT 0,
  weight_w2                 int DEFAULT 0,
  weight_w3                 int DEFAULT 0,
  weight_w4                 int DEFAULT 0,
  created_at                timestamptz DEFAULT now()
);

DROP TABLE IF EXISTS annual_daldala_plan_wereda_1;
CREATE TABLE annual_daldala_plan_wereda_1 (
  id                              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  year                            int NOT NULL UNIQUE,
  galmee_haraa_target             numeric DEFAULT 0,
  heyyema_haraa_target            numeric DEFAULT 0,
  harahessaa_target               numeric DEFAULT 0,
  galii_daldalarra_galuu_target   numeric DEFAULT 0,
  toannoo_walii_gala_target       numeric DEFAULT 0,
  tmd_target                      numeric DEFAULT 0,
  intarshippii_target             numeric DEFAULT 0,
  ggg_target                      numeric DEFAULT 0,
  gabayaa_sanbata_target          numeric DEFAULT 0,
  whg_kudraa_target               numeric DEFAULT 0,
  whg_mudraa_target               numeric DEFAULT 0,
  created_at                      timestamptz DEFAULT now()
);

DROP TABLE IF EXISTS annual_daldala_plan_wereda_2;
CREATE TABLE annual_daldala_plan_wereda_2 (
  id                              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  year                            int NOT NULL UNIQUE,
  galmee_haraa_target             numeric DEFAULT 0,
  heyyema_haraa_target            numeric DEFAULT 0,
  harahessaa_target               numeric DEFAULT 0,
  galii_daldalarra_galuu_target   numeric DEFAULT 0,
  toannoo_walii_gala_target       numeric DEFAULT 0,
  tmd_target                      numeric DEFAULT 0,
  intarshippii_target             numeric DEFAULT 0,
  ggg_target                      numeric DEFAULT 0,
  gabayaa_sanbata_target          numeric DEFAULT 0,
  whg_kudraa_target               numeric DEFAULT 0,
  whg_mudraa_target               numeric DEFAULT 0,
  created_at                      timestamptz DEFAULT now()
);

DROP TABLE IF EXISTS annual_daldala_plan_wereda_3;
CREATE TABLE annual_daldala_plan_wereda_3 (
  id                              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  year                            int NOT NULL UNIQUE,
  galmee_haraa_target             numeric DEFAULT 0,
  heyyema_haraa_target            numeric DEFAULT 0,
  harahessaa_target               numeric DEFAULT 0,
  galii_daldalarra_galuu_target   numeric DEFAULT 0,
  toannoo_walii_gala_target       numeric DEFAULT 0,
  tmd_target                      numeric DEFAULT 0,
  intarshippii_target             numeric DEFAULT 0,
  ggg_target                      numeric DEFAULT 0,
  gabayaa_sanbata_target          numeric DEFAULT 0,
  whg_kudraa_target               numeric DEFAULT 0,
  whg_mudraa_target               numeric DEFAULT 0,
  created_at                      timestamptz DEFAULT now()
);

DROP TABLE IF EXISTS annual_daldala_plan_wereda_4;
CREATE TABLE annual_daldala_plan_wereda_4 (
  id                              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  year                            int NOT NULL UNIQUE,
  galmee_haraa_target             numeric DEFAULT 0,
  heyyema_haraa_target            numeric DEFAULT 0,
  harahessaa_target               numeric DEFAULT 0,
  galii_daldalarra_galuu_target   numeric DEFAULT 0,
  toannoo_walii_gala_target       numeric DEFAULT 0,
  tmd_target                      numeric DEFAULT 0,
  intarshippii_target             numeric DEFAULT 0,
  ggg_target                      numeric DEFAULT 0,
  gabayaa_sanbata_target          numeric DEFAULT 0,
  whg_kudraa_target               numeric DEFAULT 0,
  whg_mudraa_target               numeric DEFAULT 0,
  created_at                      timestamptz DEFAULT now()
);


-- ──────────────────────────────────────────────────────────────
-- ATK (CONSTRUCTION / BUILDING PERMITS) PLANS
-- ──────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS subcity_atk_plan;
CREATE TABLE subcity_atk_plan (
  id                              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  year                            int NOT NULL UNIQUE,
  waliigaltee_pilaanii_kennuu     numeric DEFAULT 0,
  heeyyama_ijaarsaa_kennamee      numeric DEFAULT 0,
  toannoo_fi_hordoffii_gamoo      numeric DEFAULT 0,
  galii_atk_galchuu               numeric DEFAULT 0,
  weight_w1                       int DEFAULT 0,
  weight_w2                       int DEFAULT 0,
  weight_w3                       int DEFAULT 0,
  weight_w4                       int DEFAULT 0,
  created_at                      timestamptz DEFAULT now()
);

DROP TABLE IF EXISTS annual_atk_plan_wereda_1;
CREATE TABLE annual_atk_plan_wereda_1 (
  id                                    bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  year                                  int NOT NULL UNIQUE,
  waliigaltee_pilaanii_kennuu_target    numeric DEFAULT 0,
  heeyyama_ijaarsaa_kennamee_target     numeric DEFAULT 0,
  toannoo_fi_hordoffii_gamoo_target     numeric DEFAULT 0,
  galii_atk_galchuu_target              numeric DEFAULT 0,
  created_at                            timestamptz DEFAULT now()
);

DROP TABLE IF EXISTS annual_atk_plan_wereda_2;
CREATE TABLE annual_atk_plan_wereda_2 (
  id                                    bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  year                                  int NOT NULL UNIQUE,
  waliigaltee_pilaanii_kennuu_target    numeric DEFAULT 0,
  heeyyama_ijaarsaa_kennamee_target     numeric DEFAULT 0,
  toannoo_fi_hordoffii_gamoo_target     numeric DEFAULT 0,
  galii_atk_galchuu_target              numeric DEFAULT 0,
  created_at                            timestamptz DEFAULT now()
);

DROP TABLE IF EXISTS annual_atk_plan_wereda_3;
CREATE TABLE annual_atk_plan_wereda_3 (
  id                                    bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  year                                  int NOT NULL UNIQUE,
  waliigaltee_pilaanii_kennuu_target    numeric DEFAULT 0,
  heeyyama_ijaarsaa_kennamee_target     numeric DEFAULT 0,
  toannoo_fi_hordoffii_gamoo_target     numeric DEFAULT 0,
  galii_atk_galchuu_target              numeric DEFAULT 0,
  created_at                            timestamptz DEFAULT now()
);

DROP TABLE IF EXISTS annual_atk_plan_wereda_4;
CREATE TABLE annual_atk_plan_wereda_4 (
  id                                    bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  year                                  int NOT NULL UNIQUE,
  waliigaltee_pilaanii_kennuu_target    numeric DEFAULT 0,
  heeyyama_ijaarsaa_kennamee_target     numeric DEFAULT 0,
  toannoo_fi_hordoffii_gamoo_target     numeric DEFAULT 0,
  galii_atk_galchuu_target              numeric DEFAULT 0,
  created_at                            timestamptz DEFAULT now()
);


-- ──────────────────────────────────────────────────────────────
-- GALII SASSAABU (REVENUE) PLANS
-- ──────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS subcity_galii_plan;
CREATE TABLE subcity_galii_plan (
  id                    bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  year                  int NOT NULL UNIQUE,
  galii_idilee          numeric DEFAULT 0,
  galii_mana_qophessaa  numeric DEFAULT 0,
  waliigala_galii       numeric DEFAULT 0,
  weight_w1             int DEFAULT 0,
  weight_w2             int DEFAULT 0,
  weight_w3             int DEFAULT 0,
  weight_w4             int DEFAULT 0,
  created_at            timestamptz DEFAULT now()
);

DROP TABLE IF EXISTS annual_galii_plan_wereda_1;
CREATE TABLE annual_galii_plan_wereda_1 (
  id                          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  year                        int NOT NULL UNIQUE,
  galii_idilee_target         numeric DEFAULT 0,
  galii_mana_qophessaa_target numeric DEFAULT 0,
  waliigala_galii_target      numeric DEFAULT 0,
  created_at                  timestamptz DEFAULT now()
);

DROP TABLE IF EXISTS annual_galii_plan_wereda_2;
CREATE TABLE annual_galii_plan_wereda_2 (
  id                          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  year                        int NOT NULL UNIQUE,
  galii_idilee_target         numeric DEFAULT 0,
  galii_mana_qophessaa_target numeric DEFAULT 0,
  waliigala_galii_target      numeric DEFAULT 0,
  created_at                  timestamptz DEFAULT now()
);

DROP TABLE IF EXISTS annual_galii_plan_wereda_3;
CREATE TABLE annual_galii_plan_wereda_3 (
  id                          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  year                        int NOT NULL UNIQUE,
  galii_idilee_target         numeric DEFAULT 0,
  galii_mana_qophessaa_target numeric DEFAULT 0,
  waliigala_galii_target      numeric DEFAULT 0,
  created_at                  timestamptz DEFAULT now()
);

DROP TABLE IF EXISTS annual_galii_plan_wereda_4;
CREATE TABLE annual_galii_plan_wereda_4 (
  id                          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  year                        int NOT NULL UNIQUE,
  galii_idilee_target         numeric DEFAULT 0,
  galii_mana_qophessaa_target numeric DEFAULT 0,
  waliigala_galii_target      numeric DEFAULT 0,
  created_at                  timestamptz DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- END: Generic sector plan tables (total added: 20 tables across 4 sectors)
-- ═══════════════════════════════════════════════════════════════════════════════
