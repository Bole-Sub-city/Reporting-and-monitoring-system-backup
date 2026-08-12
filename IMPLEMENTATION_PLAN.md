# Implementation Plan

## Task #2: Wereda Dashboard Navigation Buttons ✓ (Already done per context)
- ✓ Delete profile button
- ✓ Add scroll behavior to announcements button

## Task #3: QonnaForm Submit Report Changes
**Location**: `frontend/src/components/reports/QonnaForm.jsx`
**Changes**:
1. Remove annual plan display at top of form
2. Reorder input fields for each category (6 categories × 2 fields = 12 inputs to reorder):
   - OLD ORDER: Houses (Dhaabbii) → Animals (Lakk.) → Land (Bakka ha)
   - NEW ORDER: Land (Bakka ha) → Houses (Dhaabbii) → Animals (Lakk.)

## Task #4: Qonna Work Analysis Ring Charts
**Location**: `frontend/src/pages/woredadashboard.jsx` - QonnaAnalysisSection
**Changes**:
Add 4 new ring charts:
1. Houses Built (Dhaabbii Ijaaraman) - sum of all *_actual from qonna reports
2. Ponds Built (qurxummii actual) 
3. Gaaguraa Built (kanniissa actual)
4. Land Prepared in ha (sum of all *_bakka_qophaawe fields)

## Task #5: Subcity Buusaa Gonofaa Plan Form ✓ (Schema ready, need frontend)
**Location**: `frontend/src/pages/subcitydashboard.jsx`
**Changes**:
1. Add to PLAN_FIELDS constant:
   ```js
   {key:"sukkaara", label:"Sukkaara", color:"#ea580c", bgColor:"bg-orange-50", borderColor:"border-orange-200", textColor:"text-orange-600"}
   {key:"zayitii", label:"Zayitii", color:"#65a30d", bgColor:"bg-lime-50", borderColor:"border-lime-200", textColor:"text-lime-600"}
   ```
2. Add to EMPTY_PLAN constant: `sukkaara:""`, `zayitii:""`

## Task #6: Buusaa Gonofaa Work Analysis (Complex - requires backend)
**Locations**: Both dashboards
**Scope**: Add new analysis section showing sukkaara & zayitii performance
**Status**: Requires backend API endpoint changes first

## Task #7: Subcity Dashboard - Show All 4 Sector Reports
**Location**: `frontend/src/pages/subcitydashboard.jsx`
**Current**: Only shows some reports
**Required**: Display all 4 sector types (Buusaa, CarraaHojii, Qonna, Revenue)

## Task #8-#10: Annual Plan Features (Complex - requires backend)
**Status**: Require API endpoint changes for cross-dashboard data fetching

## SQL Commands
**File**: `SQL_COMMANDS_UPDATE.sql` ✓ Created
**Status**: Ready to execute
**Contents**: DROP/CREATE for all 5 tables with 10 fields each

---

## Implementation Priority
1. ✓ Task #2 (Done)
2. **Task #3** - QonnaForm reorder (straightforward)
3. **Task #5** - Subcity form fields (straightforward)
4. Task #4 - Ring charts (moderate)
5. Task #7 - Show all reports (needs investigation)
6. Tasks #6, #8-10 - Backend required (defer or stub)
