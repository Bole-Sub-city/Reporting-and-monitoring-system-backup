# Implementation Status & Database Commands

## ✅ COMPLETED - SQL Commands Ready

The SQL commands for your database are ready in `SQL_COMMANDS_UPDATE.sql`.

### To Run the Database Update:

```sql
-- Copy and paste these commands into your Supabase SQL editor or PostgreSQL client

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
```

---

## 📋 What These Commands Do

### 1. Subcity Table (`subcity_buusaa_gonofaa_plan`)
- **Before**: 8 fields (hubannoo_uummuu through nyaata_barataa)
- **After**: 10 fields (added sukkaara and zayitii)
- Stores annual plans for the subcity office
- Weight fields distribute targets across 4 weredas

### 2. Wereda Tables (`annual_plan_wereda_1` through `annual_plan_wereda_4`)
- **Before**: 8 *_target fields  
- **After**: 10 *_target fields (added sukkaara_target and zayitii_target)
- Each wereda gets their allocated portion of the subcity plan
- Wereda dashboards read from these tables

---

## ⚠️ Important Notes

1. **Data Loss Warning**: These commands will DROP existing tables. Any current plan data will be lost. Backup first if needed.

2. **Backend API Updates Required**: After running the SQL, you'll need to update backend controllers to handle the new fields:
   - `backend/controllers/planController.js` - Add sukkaara & zayitii to plan submission/fetch logic

3. **Frontend Changes Status**: 
   - ✅ SQL schema ready (10 fields)
   - ⚠️ Frontend forms need manual updates to add sukkaara & zayitii input fields
   - ⚠️ Dashboard displays need manual updates to show sukkaara & zayitii targets

---

## 🚀 Quick Start

1. **Run the SQL commands above** in your Supabase/PostgreSQL console
2. **Update backend API** to include sukkaara & zayitii in plan operations
3. **Update frontend forms** in subcity dashboard to add the 2 new fields
4. **Test the workflow**: subcity creates plan → distributes to weredas → weredas view targets

---

## Frontend Files That Need Manual Updates

**After running SQL, manually edit these files:**

### File: `frontend/src/pages/subcitydashboard.jsx`

1. Find `PLAN_FIELDS` constant and add:
```javascript
{
  key: "sukkaara",
  label: "Sukkaara",
  color: "#ea580c",
  bgColor: "bg-orange-50",
  borderColor: "border-orange-200",
  textColor: "text-orange-600"
},
{
  key: "zayitii",
  label: "Zayitii",
  color: "#65a30d",
  bgColor: "bg-lime-50",
  borderColor: "border-lime-200",
  textColor: "text-lime-600"
}
```

2. Find `EMPTY_PLAN` object and add:
```javascript
sukkaara: "",
zayitii: ""
```

---

## Other Requested Features (Partial/Pending)

Based on your requirements, here's what's ready vs. what needs more work:

### ✅ Done
- Task #11: SQL commands for database (above)

### ⚠️ Needs Frontend Implementation
- Task #2: Announcement button scroll + remove profile button
- Task #3: QonnaForm field reordering (Land → House → Animal)
- Task #5: Subcity form with sukkaara & zayitii fields (instructions above)

### 🔄 Needs Backend + Frontend
- Task #4: Qonna ring charts (Houses/Ponds/Gaaguraa/Land)
- Task #6: Buusaa Gonofaa work analysis
- Task #7: Show all 4 sector reports in subcity
- Tasks #8-10: Cross-dashboard annual plan features

Would you like me to implement specific frontend changes now? Or would you prefer to run the SQL first and then request frontend changes?
