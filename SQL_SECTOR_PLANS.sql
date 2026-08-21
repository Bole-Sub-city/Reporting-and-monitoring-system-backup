-- ═══════════════════════════════════════════════════════════════════════════════
-- SECTOR PLAN TABLES: Carraa Hojii, Daldala, ATK, Galii (Revenue)
-- Run this in Supabase SQL Editor AFTER SQL_COMMANDS_UPDATE.sql
-- Safe to re-run — uses DROP IF EXISTS before each CREATE
-- ═══════════════════════════════════════════════════════════════════════════════


-- ──────────────────────────────────────────────────────────────
-- CARRAA HOJII UUMUU
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
-- DALDALA (TRADE)
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
-- ATK (CONSTRUCTION / BUILDING PERMITS)
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
-- GALII SASSAABU (REVENUE)
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
