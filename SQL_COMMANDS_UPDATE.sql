-- ═══════════════════════════════════════════════════════════════════════════════
-- UPDATED SQL COMMANDS FOR BUUSAA GONOFAA PLAN WITH SUKKAARA AND ZAYITII
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─── 1. Drop old subcity plan table ──────────────────────────────────────────  
DROP TABLE IF EXISTS subcity_buusaa_gonofaa_plan;

-- ─── 2. Create new subcity plan table with 10 fields (added sukkaara + zayitii) ──
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

-- ─── 3. Drop old woreda plan tables ──────────────────────────────────────────  
DROP TABLE IF EXISTS annual_plan_wereda_1;  
DROP TABLE IF EXISTS annual_plan_wereda_2;  
DROP TABLE IF EXISTS annual_plan_wereda_3;  
DROP TABLE IF EXISTS annual_plan_wereda_4;  

-- ─── 4. Recreate woreda plan tables with 10 target fields (added sukkaara + zayitii) ──
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
-- NOTES:
-- ═══════════════════════════════════════════════════════════════════════════════
-- 1. The subcity table now has 10 numeric fields (was 8) with sukkaara and zayitii added
-- 2. All 4 wereda tables now have 10 _target fields (was 8) with sukkaara and zayitii added
-- 3. Weight fields (weight_w1 through weight_w4) store percentages × 10 (e.g., 25.5% = 255)
-- 4. Backend API endpoints need to be updated to handle these new fields
-- 5. Frontend PLAN_FIELDS constants need to include sukkaara and zayitii entries
