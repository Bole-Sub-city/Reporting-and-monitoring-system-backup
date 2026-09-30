
-- ──────────────────────────────────────────────────────────────
-- Fix subcity_carraa_plan: rename qusannaa → qusannaa_haawaasaa
--                          rename liqii    → kenna_liqii
-- ──────────────────────────────────────────────────────────────
DO $$
BEGIN
  -- Rename qusannaa → qusannaa_haawaasaa if the old column exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subcity_carraa_plan' AND column_name = 'qusannaa'
  ) THEN
    ALTER TABLE subcity_carraa_plan RENAME COLUMN qusannaa TO qusannaa_haawaasaa;
  END IF;

  -- Rename liqii → kenna_liqii if the old column exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subcity_carraa_plan' AND column_name = 'liqii'
  ) THEN
    ALTER TABLE subcity_carraa_plan RENAME COLUMN liqii TO kenna_liqii;
  END IF;
END $$;


-- ──────────────────────────────────────────────────────────────
-- Fix annual_carraa_plan_wereda_1: rename qusannaa_target → qusannaa_haawaasaa_target
--                                  rename liqii_target    → kenna_liqii_target
-- ──────────────────────────────────────────────────────────────
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'annual_carraa_plan_wereda_1' AND column_name = 'qusannaa_target'
  ) THEN
    ALTER TABLE annual_carraa_plan_wereda_1 RENAME COLUMN qusannaa_target TO qusannaa_haawaasaa_target;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'annual_carraa_plan_wereda_1' AND column_name = 'liqii_target'
  ) THEN
    ALTER TABLE annual_carraa_plan_wereda_1 RENAME COLUMN liqii_target TO kenna_liqii_target;
  END IF;
END $$;


-- ──────────────────────────────────────────────────────────────
-- Fix annual_carraa_plan_wereda_2
-- ──────────────────────────────────────────────────────────────
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'annual_carraa_plan_wereda_2' AND column_name = 'qusannaa_target'
  ) THEN
    ALTER TABLE annual_carraa_plan_wereda_2 RENAME COLUMN qusannaa_target TO qusannaa_haawaasaa_target;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'annual_carraa_plan_wereda_2' AND column_name = 'liqii_target'
  ) THEN
    ALTER TABLE annual_carraa_plan_wereda_2 RENAME COLUMN liqii_target TO kenna_liqii_target;
  END IF;
END $$;


-- ──────────────────────────────────────────────────────────────
-- Fix annual_carraa_plan_wereda_3
-- ──────────────────────────────────────────────────────────────
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'annual_carraa_plan_wereda_3' AND column_name = 'qusannaa_target'
  ) THEN
    ALTER TABLE annual_carraa_plan_wereda_3 RENAME COLUMN qusannaa_target TO qusannaa_haawaasaa_target;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'annual_carraa_plan_wereda_3' AND column_name = 'liqii_target'
  ) THEN
    ALTER TABLE annual_carraa_plan_wereda_3 RENAME COLUMN liqii_target TO kenna_liqii_target;
  END IF;
END $$;


-- ──────────────────────────────────────────────────────────────
-- Fix annual_carraa_plan_wereda_4
-- ──────────────────────────────────────────────────────────────
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'annual_carraa_plan_wereda_4' AND column_name = 'qusannaa_target'
  ) THEN
    ALTER TABLE annual_carraa_plan_wereda_4 RENAME COLUMN qusannaa_target TO qusannaa_haawaasaa_target;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'annual_carraa_plan_wereda_4' AND column_name = 'liqii_target'
  ) THEN
    ALTER TABLE annual_carraa_plan_wereda_4 RENAME COLUMN liqii_target TO kenna_liqii_target;
  END IF;
END $$;
