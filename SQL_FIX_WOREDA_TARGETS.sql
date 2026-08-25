-- ═══════════════════════════════════════════════════════════════════════════════
-- FIX: Re-distribute subcity plan targets into woreda plan tables.
-- Run this in Supabase SQL Editor to fix fields that show 0 in Work Analysis.
-- Safe to re-run — uses INSERT ... ON CONFLICT DO UPDATE.
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 1: Find the actual column names in your woreda plan tables.
-- Run this first to confirm — look for the gumaata column name:
--   SELECT column_name FROM information_schema.columns
--   WHERE table_name = 'annual_plan_wereda_1'
--   ORDER BY ordinal_position;
-- ─────────────────────────────────────────────────────────────────────────────

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. BUUSAA GONOFAA — uses gumaata_jiraataa_target (double-a, matching real DB)
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO annual_plan_wereda_1 (
  year,
  hubannoo_uummuu_target, horannaa_misensaa_target,
  buusi_jiraataa_target, gumaata_jiraataa_target,
  buusi_daldalaa_target, inisheetivii_buusaa_gonofaa_target,
  gumaata_mootummaa_target, nyaata_barataa_target,
  sukkaara_target, zayitii_target
)
SELECT
  year,
  ROUND(hubannoo_uummuu      * weight_w1::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(horannaa_misensaa    * weight_w1::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(buusi_jiraataa       * weight_w1::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(gumaata_jiraataa     * weight_w1::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(buusi_daldalaa       * weight_w1::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(inisheetivii_buusaa_gonofaa * weight_w1::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(gumaata_mootummaa    * weight_w1::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(nyaata_barataa       * weight_w1::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(sukkaara             * weight_w1::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(zayitii              * weight_w1::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0))
FROM subcity_buusaa_gonofaa_plan
ON CONFLICT (year) DO UPDATE SET
  hubannoo_uummuu_target             = EXCLUDED.hubannoo_uummuu_target,
  horannaa_misensaa_target           = EXCLUDED.horannaa_misensaa_target,
  buusi_jiraataa_target              = EXCLUDED.buusi_jiraataa_target,
  gumaata_jiraataa_target            = EXCLUDED.gumaata_jiraataa_target,
  buusi_daldalaa_target              = EXCLUDED.buusi_daldalaa_target,
  inisheetivii_buusaa_gonofaa_target = EXCLUDED.inisheetivii_buusaa_gonofaa_target,
  gumaata_mootummaa_target           = EXCLUDED.gumaata_mootummaa_target,
  nyaata_barataa_target              = EXCLUDED.nyaata_barataa_target,
  sukkaara_target                    = EXCLUDED.sukkaara_target,
  zayitii_target                     = EXCLUDED.zayitii_target;

INSERT INTO annual_plan_wereda_2 (
  year,
  hubannoo_uummuu_target, horannaa_misensaa_target,
  buusi_jiraataa_target, gumaata_jiraataa_target,
  buusi_daldalaa_target, inisheetivii_buusaa_gonofaa_target,
  gumaata_mootummaa_target, nyaata_barataa_target,
  sukkaara_target, zayitii_target
)
SELECT
  year,
  ROUND(hubannoo_uummuu      * weight_w2::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(horannaa_misensaa    * weight_w2::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(buusi_jiraataa       * weight_w2::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(gumaata_jiraataa     * weight_w2::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(buusi_daldalaa       * weight_w2::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(inisheetivii_buusaa_gonofaa * weight_w2::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(gumaata_mootummaa    * weight_w2::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(nyaata_barataa       * weight_w2::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(sukkaara             * weight_w2::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(zayitii              * weight_w2::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0))
FROM subcity_buusaa_gonofaa_plan
ON CONFLICT (year) DO UPDATE SET
  hubannoo_uummuu_target             = EXCLUDED.hubannoo_uummuu_target,
  horannaa_misensaa_target           = EXCLUDED.horannaa_misensaa_target,
  buusi_jiraataa_target              = EXCLUDED.buusi_jiraataa_target,
  gumaata_jiraataa_target            = EXCLUDED.gumaata_jiraataa_target,
  buusi_daldalaa_target              = EXCLUDED.buusi_daldalaa_target,
  inisheetivii_buusaa_gonofaa_target = EXCLUDED.inisheetivii_buusaa_gonofaa_target,
  gumaata_mootummaa_target           = EXCLUDED.gumaata_mootummaa_target,
  nyaata_barataa_target              = EXCLUDED.nyaata_barataa_target,
  sukkaara_target                    = EXCLUDED.sukkaara_target,
  zayitii_target                     = EXCLUDED.zayitii_target;

INSERT INTO annual_plan_wereda_3 (
  year,
  hubannoo_uummuu_target, horannaa_misensaa_target,
  buusi_jiraataa_target, gumaata_jiraataa_target,
  buusi_daldalaa_target, inisheetivii_buusaa_gonofaa_target,
  gumaata_mootummaa_target, nyaata_barataa_target,
  sukkaara_target, zayitii_target
)
SELECT
  year,
  ROUND(hubannoo_uummuu      * weight_w3::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(horannaa_misensaa    * weight_w3::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(buusi_jiraataa       * weight_w3::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(gumaata_jiraataa     * weight_w3::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(buusi_daldalaa       * weight_w3::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(inisheetivii_buusaa_gonofaa * weight_w3::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(gumaata_mootummaa    * weight_w3::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(nyaata_barataa       * weight_w3::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(sukkaara             * weight_w3::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(zayitii              * weight_w3::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0))
FROM subcity_buusaa_gonofaa_plan
ON CONFLICT (year) DO UPDATE SET
  hubannoo_uummuu_target             = EXCLUDED.hubannoo_uummuu_target,
  horannaa_misensaa_target           = EXCLUDED.horannaa_misensaa_target,
  buusi_jiraataa_target              = EXCLUDED.buusi_jiraataa_target,
  gumaata_jiraataa_target            = EXCLUDED.gumaata_jiraataa_target,
  buusi_daldalaa_target              = EXCLUDED.buusi_daldalaa_target,
  inisheetivii_buusaa_gonofaa_target = EXCLUDED.inisheetivii_buusaa_gonofaa_target,
  gumaata_mootummaa_target           = EXCLUDED.gumaata_mootummaa_target,
  nyaata_barataa_target              = EXCLUDED.nyaata_barataa_target,
  sukkaara_target                    = EXCLUDED.sukkaara_target,
  zayitii_target                     = EXCLUDED.zayitii_target;

INSERT INTO annual_plan_wereda_4 (
  year,
  hubannoo_uummuu_target, horannaa_misensaa_target,
  buusi_jiraataa_target, gumaata_jiraataa_target,
  buusi_daldalaa_target, inisheetivii_buusaa_gonofaa_target,
  gumaata_mootummaa_target, nyaata_barataa_target,
  sukkaara_target, zayitii_target
)
SELECT
  year,
  ROUND(hubannoo_uummuu      * weight_w4::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(horannaa_misensaa    * weight_w4::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(buusi_jiraataa       * weight_w4::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(gumaata_jiraataa     * weight_w4::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(buusi_daldalaa       * weight_w4::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(inisheetivii_buusaa_gonofaa * weight_w4::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(gumaata_mootummaa    * weight_w4::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(nyaata_barataa       * weight_w4::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(sukkaara             * weight_w4::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(zayitii              * weight_w4::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0))
FROM subcity_buusaa_gonofaa_plan
ON CONFLICT (year) DO UPDATE SET
  hubannoo_uummuu_target             = EXCLUDED.hubannoo_uummuu_target,
  horannaa_misensaa_target           = EXCLUDED.horannaa_misensaa_target,
  buusi_jiraataa_target              = EXCLUDED.buusi_jiraataa_target,
  gumaata_jiraataa_target            = EXCLUDED.gumaata_jiraataa_target,
  buusi_daldalaa_target              = EXCLUDED.buusi_daldalaa_target,
  inisheetivii_buusaa_gonofaa_target = EXCLUDED.inisheetivii_buusaa_gonofaa_target,
  gumaata_mootummaa_target           = EXCLUDED.gumaata_mootummaa_target,
  nyaata_barataa_target              = EXCLUDED.nyaata_barataa_target,
  sukkaara_target                    = EXCLUDED.sukkaara_target,
  zayitii_target                     = EXCLUDED.zayitii_target;


-- ─────────────────────────────────────────────────────────────────────────────
-- 2. GALII SASSAABU
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO annual_galii_plan_wereda_1 (year, galii_idilee_target, galii_mana_qophessaa_target, waliigala_galii_target)
SELECT year,
  ROUND(galii_idilee         * weight_w1::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(galii_mana_qophessaa * weight_w1::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(waliigala_galii      * weight_w1::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0))
FROM subcity_galii_plan
ON CONFLICT (year) DO UPDATE SET
  galii_idilee_target         = EXCLUDED.galii_idilee_target,
  galii_mana_qophessaa_target = EXCLUDED.galii_mana_qophessaa_target,
  waliigala_galii_target      = EXCLUDED.waliigala_galii_target;

INSERT INTO annual_galii_plan_wereda_2 (year, galii_idilee_target, galii_mana_qophessaa_target, waliigala_galii_target)
SELECT year,
  ROUND(galii_idilee         * weight_w2::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(galii_mana_qophessaa * weight_w2::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(waliigala_galii      * weight_w2::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0))
FROM subcity_galii_plan
ON CONFLICT (year) DO UPDATE SET
  galii_idilee_target         = EXCLUDED.galii_idilee_target,
  galii_mana_qophessaa_target = EXCLUDED.galii_mana_qophessaa_target,
  waliigala_galii_target      = EXCLUDED.waliigala_galii_target;

INSERT INTO annual_galii_plan_wereda_3 (year, galii_idilee_target, galii_mana_qophessaa_target, waliigala_galii_target)
SELECT year,
  ROUND(galii_idilee         * weight_w3::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(galii_mana_qophessaa * weight_w3::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(waliigala_galii      * weight_w3::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0))
FROM subcity_galii_plan
ON CONFLICT (year) DO UPDATE SET
  galii_idilee_target         = EXCLUDED.galii_idilee_target,
  galii_mana_qophessaa_target = EXCLUDED.galii_mana_qophessaa_target,
  waliigala_galii_target      = EXCLUDED.waliigala_galii_target;

INSERT INTO annual_galii_plan_wereda_4 (year, galii_idilee_target, galii_mana_qophessaa_target, waliigala_galii_target)
SELECT year,
  ROUND(galii_idilee         * weight_w4::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(galii_mana_qophessaa * weight_w4::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(waliigala_galii      * weight_w4::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0))
FROM subcity_galii_plan
ON CONFLICT (year) DO UPDATE SET
  galii_idilee_target         = EXCLUDED.galii_idilee_target,
  galii_mana_qophessaa_target = EXCLUDED.galii_mana_qophessaa_target,
  waliigala_galii_target      = EXCLUDED.waliigala_galii_target;


-- ─────────────────────────────────────────────────────────────────────────────
-- 3. CARRAA HOJII UUMUU
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO annual_carraa_plan_wereda_1 (
  year,
  leenjii_target, carraa_hojii_dhaabbii_target, carraa_hojii_qacarrii_target,
  qusannaa_haawaasaa_target, qusanna_dirqii_target, kenna_liqii_target,
  deebii_liqii_bilchaate_target, deebii_liqii_bulee_target, industrii_godoo_target
)
SELECT year,
  ROUND(leenjii                * weight_w1::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(carraa_hojii_dhaabbii  * weight_w1::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(carraa_hojii_qacarrii  * weight_w1::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(qusannaa_haawaasaa     * weight_w1::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(qusanna_dirqii         * weight_w1::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(kenna_liqii            * weight_w1::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(deebii_liqii_bilchaate * weight_w1::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(deebii_liqii_bulee     * weight_w1::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(industrii_godoo        * weight_w1::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0))
FROM subcity_carraa_plan
ON CONFLICT (year) DO UPDATE SET
  leenjii_target                = EXCLUDED.leenjii_target,
  carraa_hojii_dhaabbii_target  = EXCLUDED.carraa_hojii_dhaabbii_target,
  carraa_hojii_qacarrii_target  = EXCLUDED.carraa_hojii_qacarrii_target,
  qusannaa_haawaasaa_target     = EXCLUDED.qusannaa_haawaasaa_target,
  qusanna_dirqii_target         = EXCLUDED.qusanna_dirqii_target,
  kenna_liqii_target            = EXCLUDED.kenna_liqii_target,
  deebii_liqii_bilchaate_target = EXCLUDED.deebii_liqii_bilchaate_target,
  deebii_liqii_bulee_target     = EXCLUDED.deebii_liqii_bulee_target,
  industrii_godoo_target        = EXCLUDED.industrii_godoo_target;

INSERT INTO annual_carraa_plan_wereda_2 (
  year,
  leenjii_target, carraa_hojii_dhaabbii_target, carraa_hojii_qacarrii_target,
  qusannaa_haawaasaa_target, qusanna_dirqii_target, kenna_liqii_target,
  deebii_liqii_bilchaate_target, deebii_liqii_bulee_target, industrii_godoo_target
)
SELECT year,
  ROUND(leenjii                * weight_w2::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(carraa_hojii_dhaabbii  * weight_w2::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(carraa_hojii_qacarrii  * weight_w2::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(qusannaa_haawaasaa     * weight_w2::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(qusanna_dirqii         * weight_w2::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(kenna_liqii            * weight_w2::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(deebii_liqii_bilchaate * weight_w2::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(deebii_liqii_bulee     * weight_w2::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(industrii_godoo        * weight_w2::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0))
FROM subcity_carraa_plan
ON CONFLICT (year) DO UPDATE SET
  leenjii_target                = EXCLUDED.leenjii_target,
  carraa_hojii_dhaabbii_target  = EXCLUDED.carraa_hojii_dhaabbii_target,
  carraa_hojii_qacarrii_target  = EXCLUDED.carraa_hojii_qacarrii_target,
  qusannaa_haawaasaa_target     = EXCLUDED.qusannaa_haawaasaa_target,
  qusanna_dirqii_target         = EXCLUDED.qusanna_dirqii_target,
  kenna_liqii_target            = EXCLUDED.kenna_liqii_target,
  deebii_liqii_bilchaate_target = EXCLUDED.deebii_liqii_bilchaate_target,
  deebii_liqii_bulee_target     = EXCLUDED.deebii_liqii_bulee_target,
  industrii_godoo_target        = EXCLUDED.industrii_godoo_target;

INSERT INTO annual_carraa_plan_wereda_3 (
  year,
  leenjii_target, carraa_hojii_dhaabbii_target, carraa_hojii_qacarrii_target,
  qusannaa_haawaasaa_target, qusanna_dirqii_target, kenna_liqii_target,
  deebii_liqii_bilchaate_target, deebii_liqii_bulee_target, industrii_godoo_target
)
SELECT year,
  ROUND(leenjii                * weight_w3::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(carraa_hojii_dhaabbii  * weight_w3::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(carraa_hojii_qacarrii  * weight_w3::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(qusannaa_haawaasaa     * weight_w3::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(qusanna_dirqii         * weight_w3::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(kenna_liqii            * weight_w3::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(deebii_liqii_bilchaate * weight_w3::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(deebii_liqii_bulee     * weight_w3::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(industrii_godoo        * weight_w3::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0))
FROM subcity_carraa_plan
ON CONFLICT (year) DO UPDATE SET
  leenjii_target                = EXCLUDED.leenjii_target,
  carraa_hojii_dhaabbii_target  = EXCLUDED.carraa_hojii_dhaabbii_target,
  carraa_hojii_qacarrii_target  = EXCLUDED.carraa_hojii_qacarrii_target,
  qusannaa_haawaasaa_target     = EXCLUDED.qusannaa_haawaasaa_target,
  qusanna_dirqii_target         = EXCLUDED.qusanna_dirqii_target,
  kenna_liqii_target            = EXCLUDED.kenna_liqii_target,
  deebii_liqii_bilchaate_target = EXCLUDED.deebii_liqii_bilchaate_target,
  deebii_liqii_bulee_target     = EXCLUDED.deebii_liqii_bulee_target,
  industrii_godoo_target        = EXCLUDED.industrii_godoo_target;

INSERT INTO annual_carraa_plan_wereda_4 (
  year,
  leenjii_target, carraa_hojii_dhaabbii_target, carraa_hojii_qacarrii_target,
  qusannaa_haawaasaa_target, qusanna_dirqii_target, kenna_liqii_target,
  deebii_liqii_bilchaate_target, deebii_liqii_bulee_target, industrii_godoo_target
)
SELECT year,
  ROUND(leenjii                * weight_w4::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(carraa_hojii_dhaabbii  * weight_w4::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(carraa_hojii_qacarrii  * weight_w4::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(qusannaa_haawaasaa     * weight_w4::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(qusanna_dirqii         * weight_w4::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(kenna_liqii            * weight_w4::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(deebii_liqii_bilchaate * weight_w4::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(deebii_liqii_bulee     * weight_w4::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0)),
  ROUND(industrii_godoo        * weight_w4::numeric / NULLIF(weight_w1+weight_w2+weight_w3+weight_w4,0))
FROM subcity_carraa_plan
ON CONFLICT (year) DO UPDATE SET
  leenjii_target                = EXCLUDED.leenjii_target,
  carraa_hojii_dhaabbii_target  = EXCLUDED.carraa_hojii_dhaabbii_target,
  carraa_hojii_qacarrii_target  = EXCLUDED.carraa_hojii_qacarrii_target,
  qusannaa_haawaasaa_target     = EXCLUDED.qusannaa_haawaasaa_target,
  qusanna_dirqii_target         = EXCLUDED.qusanna_dirqii_target,
  kenna_liqii_target            = EXCLUDED.kenna_liqii_target,
  deebii_liqii_bilchaate_target = EXCLUDED.deebii_liqii_bilchaate_target,
  deebii_liqii_bulee_target     = EXCLUDED.deebii_liqii_bulee_target,
  industrii_godoo_target        = EXCLUDED.industrii_godoo_target;
