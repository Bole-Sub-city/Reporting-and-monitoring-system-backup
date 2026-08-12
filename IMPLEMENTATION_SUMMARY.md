# Implementation Summary: Dashboard Updates

## Overview
This document outlines all requested changes across wereda dashboard, subcity dashboard, forms, and SQL schema.

---

## 1. WEREDA DASHBOARD CHANGES (woredadashboard.jsx)

### 1.1 Announcement Button Navigation
**Location**: Sidebar navigation
**Change**: When announcement button is clicked, scroll to announcement section
**Implementation**: Add onClick handler with smooth scroll behavior

### 1.2 Delete Profile Button  
**Location**: Next to announcement button in sidebar
**Change**: Remove the profile button entirely
**Implementation**: Delete ProfileIcon button element from sidebar

### 1.3 Qonna Submit Report Form Updates
**Location**: QonnaSubmitForm component
**Changes**:
- Remove annual plan card display from top of form
- Reorder input fields for each category: Land (ha) → Houses → Animals

**Current Order**: Houses → Animals → Land
**New Order**: Land (Bakka Qophaawe ha) → Houses (Dhaabbii Ijaaraman) → Animals (Lakk. Qurxummii Actual)

---

## 2. QONNA WORK ANALYSIS RING CHART

### 2.1 Add New Metrics
**Location**: QonnaAnalysisSection - Ring charts display
**Add 4 New Ring Charts**:
1. **Houses Built** (Mana Ijaaraman) - Sum of all `_mana` fields
2. **Ponds Built** (Dhaabbii/Pondii Ijaaraman) - qurxummii_mana field
3. **Gaaguraa Built** - kannisaa_mana field  
4. **Land Prepared (ha)** - Sum of all `_bakka_qophaawe` fields

**Implementation**: Create QONNA_HOUSE_FIELDS constant and add to ring chart grid

---

## 3. SUBCITY BUUSAA GONOFAA PLAN FORM

### 3.1 Add Two New Fields
**Location**: subcitydashboard.jsx - BuusaaPlanPage
**Add to PLAN_FIELDS**:
```javascript
{
  key: "sukkaara",
  label: "Sukkaara",
  color: "#ea580c"
},
{
  key: "zayitii",
  label: "Zayitii",
  color: "#65a30d"
}
```

**Add to EMPTY_PLAN**:
```javascript
sukkaara: "",
zayitii: ""
```

---

## 4. BUUSAA GONOFAA WORK ANALYSIS

### 4.1 Subcity Dashboard - Work Analysis Page
**Location**: WorkAnalysisPage in subcitydashboard.jsx
**Change**: Implement actual work analysis (currently shows "Coming Soon")
**Features**:
- Fetch subcity buusaa gonofaa plan
- Fetch aggregated actual reports from all 4 woredas
- Display percentage completion for each of 10 categories
- Show ring charts comparing plan vs actual

### 4.2 Wereda Dashboard - Buusaa Gonofaa Analysis
**Location**: Add new BuusaaAnalysisSection in woredadashboard.jsx
**Features**:
- Fetch wereda-specific buusaa gonofaa plan
- Fetch actual report submissions
- Display completion percentage
- Period selector (daily/weekly/monthly/annual/custom)

---

## 5. SUBCITY DASHBOARD - WOREDA REPORTS

### 5.1 Show 4 Sector Reports Per Woreda
**Location**: ReportsPage in subcitydashboard.jsx
**Current**: Shows placeholder "No data yet"
**Change**: Display tabs for 4 sectors (Buusaa Gonofaa, Qonna, Carraa Hojii, Galii Sassaabu)
**Implementation**:
- Add sector selector tabs
- Fetch sector-specific reports for selected wereda
- Display report data in table format

---

## 6. CARRAA HOJII FORM - ADD ANNUAL PLAN

### 6.1 Display Read-Only Annual Plan
**Location**: CarraaHojiiForm.jsx component
**Change**: Add annual plan display section before form fields
**Data Source**: Fetch from wereda dashboard annual plan (fetchWeredaPlan)
**Fields to Display**: All 9 Carraa Hojii targets from annual plan

---

## 7. GALII SASSAABU ANNUAL PLAN

### 7.1 Create New Annual Plan for Revenue
**Location**: subcitydashboard.jsx
**Create**: GaliiSassaabuPlanPage component
**Fields**:
- Mana Qophesaa (target)
- Idile (target)  
- Woreda allocation percentages

### 7.2 Backend Requirements
**New API Endpoints Needed**:
- `POST /api/plans/subcity-galii-plan` - Save revenue plan
- `GET /api/plans/subcity-galii-plan` - Fetch subcity revenue plan
- `GET /api/plans/wereda-galii-plan` - Fetch wereda-specific revenue plan

### 7.3 Database Tables Needed
```sql
CREATE TABLE subcity_galii_sassaabu_plan (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  year int NOT NULL UNIQUE,
  mana_qophesaa numeric DEFAULT 0,
  idile numeric DEFAULT 0,
  weight_w1 int DEFAULT 0,
  weight_w2 int DEFAULT 0,
  weight_w3 int DEFAULT 0,
  weight_w4 int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 4 wereda tables for galii_sassaabu_plan_wereda_1 through 4
```

---

## 8. WEREDA DASHBOARD - DISPLAY PLANS

### 8.1 Display Qonna Annual Plan
**Location**: Add to sidebar navigation in woredadashboard.jsx
**Component**: QonnaAnnualPlanSection (already exists, needs to be accessible)
**Route**: Add to main navigation as separate section

### 8.2 Display Galii Sassaabu Annual Plan  
**Location**: woredadashboard.jsx
**Component**: Create GaliiSassaabuAnnualPlanSection
**Features**:
- Fetch wereda galii sassaabu plan
- Display Mana Qophesaa and Idile targets
- Read-only view with lock icon

---

## 9. SQL DATABASE CHANGES

### 9.1 Buusaa Gonofaa Tables
**See**: SQL_COMMANDS_UPDATE.sql
**Changes**:
- Add `sukkaara` and `zayitii` fields to subcity_buusaa_gonofaa_plan
- Add `sukkaara_target` and `zayitii_target` to all 4 wereda tables

### 9.2 New Tables for Galii Sassaabu
**Create**:
- subcity_galii_sassaabu_plan (1 table)
- galii_sassaabu_plan_wereda_1 through galii_sassaabu_plan_wereda_4 (4 tables)

---

## 10. BACKEND API UPDATES REQUIRED

### 10.1 Buusaa Gonofaa Endpoints
**Update**: `/api/plans/subcity-plan` and `/api/plans/wereda-plan`
- Handle sukkaara and zayitii fields
- Update field validation

### 10.2 New Galii Sassaabu Endpoints
**Create**:
- POST `/api/plans/subcity-galii-plan`
- GET `/api/plans/subcity-galii-plan`
- GET `/api/plans/wereda-galii-plan`

### 10.3 Work Analysis Endpoints
**Update**:
- Ensure `/api/plans/summary` returns house and land data for Qonna
- Create buusaa gonofaa summary aggregation endpoint

---

## PRIORITY ORDER FOR IMPLEMENTATION

### Phase 1 - Database & Backend (MUST BE DONE FIRST)
1. Run SQL_COMMANDS_UPDATE.sql to update tables
2. Update backend controllers to handle sukkaara/zayitii
3. Create galii sassaabu plan endpoints and tables

### Phase 2 - Simple UI Fixes
1. Delete profile button from wereda dashboard
2. Add announcement button scroll behavior
3. Reorder QonnaForm fields (land→house→animal)

### Phase 3 - Plan Forms
1. Add sukkaara/zayitii to subcity buusaa gonofaa form
2. Create galii sassaabu plan form in subcity
3. Add annual plan display to CarraaHojii form

### Phase 4 - Work Analysis
1. Add house/pond/land metrics to Qonna ring charts
2. Implement buusaa gonofaa work analysis in wereda dashboard
3. Implement work analysis in subcity dashboard

### Phase 5 - Display & Navigation
1. Add Qonna and Galii plan sections to wereda dashboard
2. Implement 4-sector reports in subcity woreda reports
3. Polish and test all changes

---

## NOTES

- All changes maintain existing color schemes and styling patterns
- New fields follow existing naming conventions
- Woreda allocation uses same percentage system (w2 = 25% effective)
- All new components follow existing component structure
- Backend changes must be deployed before frontend changes

