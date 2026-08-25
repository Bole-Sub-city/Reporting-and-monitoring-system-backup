# Requirements Document

## Introduction

This document specifies requirements for enhancing the Subcity Dashboard's Work Analysis page (`GenericSubcityAnalysisPage`). The enhancement adds three capabilities: (1) Comparison and Rank buttons that give the subcity manager a cross-woreda view of actual submitted work, (2) per-woreda ring charts showing actual vs. target per field for the selected woreda and sector, and (3) full Supabase database backing for all data — replacing any stub data. The feature builds on the existing React + Node.js + Supabase stack with no new npm dependencies and no new database tables.

---

## Glossary

- **Dashboard**: The Subcity Dashboard application rendered by `subcitydashboard.jsx`.
- **GenericSubcityAnalysisPage**: The React component implementing the Work Analysis page; the primary component being enhanced.
- **WorkAnalysisLandingPage**: The sector card grid rendered inside `renderContent` when `activeNav === "analysis"` and no sector has been selected yet. Not a separate component — it is JSX inlined in the `renderContent` function, mirroring the Annual Plan landing page pattern.
- **ComparisonView**: A new React component that renders a table of actual submitted report data per woreda per field for a selected sector and period.
- **RankView**: A new React component that ranks the four woredas by completion percentage and allows drill-down per woreda.
- **WorkAnalysisRingSection**: A new React component that renders a grid of ring charts for the currently selected woreda and sector.
- **RingChart**: An SVG ring chart component showing percentage completion for a single field. Extracted from `woredadashboard.jsx` into `frontend/src/components/ui/RingChart.jsx`.
- **Woreda**: One of the four administrative subdivisions monitored by the subcity: Aanaa Gooroo (w1), Aanaa Dhadacha Araaraa (w2), Aanaa Dhakaa Adii (w3), Aanaa Andoodee (w4).
- **Sector**: One of six work sectors — buusaa (Buusaa Gonofaa), qonna (Qonna), galii (Galii Sassaabu), carraa (Carraa Hojii Uumuu), daldala (Daldala), atk (ATK).
- **Period**: Time granularity for data aggregation — daily, weekly, monthly, or annual.
- **Completion Percentage**: `min(100, round1dp(sum(actuals) / sum(targets) × 100))`. Returns 0 when total target is 0.
- **Rank**: A 1-based integer position in the sorted list of woredas by completion percentage, descending. Ties are broken by woreda ID lexicographic order.
- **subcityReportController**: A new Node.js controller file (`backend/controllers/subcityReportController.js`) containing the two new API endpoint handlers.
- **authMiddleware**: The existing JWT-validation middleware in `backend/middleware/authMiddleware.js`.
- **SECTOR_CFG**: The existing frontend configuration object mapping sector IDs to field definitions, colors, and labels.
- **partitionTarget**: An existing pure function that divides an annual target by the number of periods in a year (365 / 52 / 12 / 1) to get the period-level target.
- **aggregateByWoreda**: A new pure function that sums report rows by woreda identifier.
- **computeCompletionPct**: A new pure function that computes the bounded completion percentage.
- **getDateRange**: A new pure function that returns the ISO date range `{ from, to }` for a given period.

---

## Requirements

### Requirement 1: Comparison and Rank View Toggle

**User Story:** As a subcity manager, I want Comparison and Rank buttons on the Work Analysis page, so that I can switch between cross-woreda views without leaving the page.

#### Acceptance Criteria

1. THE `GenericSubcityAnalysisPage` SHALL maintain an `activeView` state with exactly three possible values: `"woreda"`, `"comparison"`, and `"rank"`.
2. WHEN the user clicks the "Comparison" button, THE `GenericSubcityAnalysisPage` SHALL set `activeView` to `"comparison"` and render `ComparisonView` in place of the plan table area.
3. WHEN the user clicks the "Rank" button, THE `GenericSubcityAnalysisPage` SHALL set `activeView` to `"rank"` and render `RankView` in place of the plan table area.
4. WHEN the user selects a woreda tab, THE `GenericSubcityAnalysisPage` SHALL set `activeView` to `"woreda"` and render the existing plan table and `WorkAnalysisRingSection`.
5. WHILE `activeView` is `"comparison"` or `"rank"`, THE `GenericSubcityAnalysisPage` SHALL NOT render both `ComparisonView` and `RankView` simultaneously.
6. THE `GenericSubcityAnalysisPage` SHALL render the Comparison and Rank button row directly below the existing woreda tab row, without modifying the tab row itself.

---

### Requirement 2: Comparison View — Cross-Woreda Actuals Table

**User Story:** As a subcity manager, I want to see the actual submitted report values for all four woredas side by side for a selected sector and period, so that I can compare woreda performance on real data.

#### Acceptance Criteria

1. THE `ComparisonView` SHALL render a period selector with the options: Daily, Weekly, Monthly, and Annual. The default selection SHALL be `"monthly"`.
2. WHEN the period selector value changes, THE `ComparisonView` SHALL fetch updated data from `GET /api/subcity/woreda-reports` using the new period value.
3. THE `ComparisonView` SHALL render a table where rows correspond to sector fields defined in `SECTOR_CFG[sector].fields` and columns correspond to the four woredas.
4. FOR ALL sector field rows in the comparison table, each cell SHALL display the sum of that field's submitted report values for the corresponding woreda within the selected date range.
5. THE `ComparisonView` SHALL display exactly the fields defined in `SECTOR_CFG[sector].fields` — no additional fields and no omissions — regardless of which columns are present in the database row.
6. WHILE data is loading, THE `ComparisonView` SHALL render a loading spinner and SHALL NOT render the data table.
7. IF the `GET /api/subcity/woreda-reports` request fails, THEN THE `ComparisonView` SHALL display an inline error banner and SHALL keep any previously loaded data hidden.

---

### Requirement 3: Rank View — Woreda Completion Ranking

**User Story:** As a subcity manager, I want to see the four woredas ranked by their overall completion percentage for a selected sector and period, so that I can identify the best- and worst-performing woredas at a glance.

#### Acceptance Criteria

1. THE `RankView` SHALL render a period selector with the options: Daily, Weekly, Monthly, and Annual. The default selection SHALL be `"monthly"`.
2. WHEN the period changes in the `RankView` period selector, THE `RankView` SHALL re-fetch data and recompute rankings for all four woredas using the new period.
3. THE `RankView` SHALL sort and display all four woredas in descending order of `completionPct`, where `completionPct = min(100, round1dp(sum(actuals[f]) / sum(targets[f]) × 100))` over all fields `f` in `SECTOR_CFG[sector].fields`.
4. IF two or more woredas share the same `completionPct`, THEN THE `RankView` SHALL break ties by woreda ID in ascending lexicographic order, ensuring rank values form a permutation of `[1, 2, 3, 4]` with no duplicates.
5. WHEN the user clicks a woreda row in the `RankView`, THE `RankView` SHALL expand a detail panel for that woreda showing plan target vs. submitted actual for each field in `SECTOR_CFG[sector].fields`.
6. WHEN the user clicks an already-expanded woreda row, THE `RankView` SHALL collapse the detail panel.
7. THE expanded detail panel SHALL include its own period filter (Daily / Weekly / Monthly / Annual).
8. WHEN the period changes in the detail panel period filter, THE `RankView` SHALL re-fetch actuals for that woreda only and update the detail panel.
9. WHILE data is loading, THE `RankView` SHALL render a loading spinner and SHALL NOT render the ranked list.
10. IF the data fetch fails, THEN THE `RankView` SHALL display an inline error banner.

---

### Requirement 4: Ring Charts — Per-Woreda Actual vs. Target

**User Story:** As a subcity manager, I want to see ring charts for the selected woreda and sector showing actual performance against the period-adjusted plan target per field, so that I can assess individual woreda progress field by field.

#### Acceptance Criteria

1. THE `WorkAnalysisRingSection` SHALL be rendered below the existing plan table when `activeView` is `"woreda"`.
2. WHEN the active woreda tab or the period changes, THE `WorkAnalysisRingSection` SHALL fetch updated data from `GET /api/subcity/woreda-analysis` for the newly selected `(sector, woredaId, period)` combination.
3. THE `WorkAnalysisRingSection` SHALL render one `RingChart` per field defined in `SECTOR_CFG[sector].fields`, displaying `actual` (fetched from the database) and `target` (equal to `partitionTarget(planTarget, period)`).
4. THE `WorkAnalysisRingSection` SHALL render a period selector with the options: Daily, Weekly, Monthly, and Annual. The default selection SHALL be `"monthly"`.
5. THE `WorkAnalysisRingSection` SHALL lay out ring charts in a responsive grid: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`.
6. IF no plan has been saved for the selected woreda and sector, THEN THE `WorkAnalysisRingSection` SHALL render ring charts with `target = 0` and SHALL NOT throw an error or display `NaN` or `Infinity`.
7. IF no reports have been submitted for the selected woreda and sector within the date range, THEN THE `WorkAnalysisRingSection` SHALL render ring charts with `actual = 0`.
8. IF the `GET /api/subcity/woreda-analysis` request fails, THEN THE `WorkAnalysisRingSection` SHALL display an inline error banner and SHALL leave the existing plan table visible.
9. WHILE data is loading, THE `WorkAnalysisRingSection` SHALL render a loading spinner in place of the ring chart grid.

---

### Requirement 5: RingChart Shared Component

**User Story:** As a developer, I want a single canonical `RingChart` component shared between the woreda dashboard and the subcity dashboard, so that the SVG ring chart behavior and appearance are consistent across both dashboards.

#### Acceptance Criteria

1. THE system SHALL provide `frontend/src/components/ui/RingChart.jsx` as the canonical `RingChart` implementation accepting props: `actual`, `target`, `color`, `label`, and `description`.
2. THE `RingChart` SHALL compute percentage as `min(round((actual / target) × 100), 100)` when `target > 0`, and SHALL return `0` when `target = 0`.
3. THE `woredadashboard.jsx` SHALL import `RingChart` from `frontend/src/components/ui/RingChart.jsx` instead of defining it inline.
4. THE `subcitydashboard.jsx` (via `WorkAnalysisRingSection`) SHALL import `RingChart` from `frontend/src/components/ui/RingChart.jsx`.
5. THE `RingChart` SVG arc SHALL transition with a `0.7s ease` animation when the percentage value changes.

---

### Requirement 6: Backend — `GET /api/subcity/woreda-reports` Endpoint

**User Story:** As a frontend component, I want an authenticated endpoint that returns all four woredas' summed actual report values for a given sector and period, so that the Comparison and Rank views can be populated from live database data.

#### Acceptance Criteria

1. THE `subcityReportController` SHALL expose `getAllWoRedaReports(req, res)` mounted at `GET /api/subcity/woreda-reports` with `authMiddleware` applied.
2. WHEN a request is received with valid `sector` and `period` query parameters, THE `getAllWoRedaReports` handler SHALL return a JSON response of shape `WoRedaReportsResponse` containing `woredas`, `sector`, `period`, `from`, and `to` fields.
3. THE handler SHALL determine the date range by calling `getDateRange(period)`, which returns `{ from, to }` where `to` is today and `from` is the start of the requested period.
4. THE handler SHALL query the report table corresponding to `SECTOR_REPORT_TABLE_MAP[sector]` and filter by `username IN (woreda_usernames)` and `report_date BETWEEN from AND to`.
5. THE handler SHALL aggregate the query results using `aggregateByWoreda(rows, fields, usernameToId)`, ensuring every woreda identifier (`w1`–`w4`) appears in the response even if it has no rows.
6. IF an unknown `sector` value is provided, THEN THE handler SHALL return HTTP 400 with a descriptive error message and SHALL NOT issue any database query.
7. IF an unknown `period` value is provided, THEN THE handler SHALL return HTTP 400 with a descriptive error message and SHALL NOT issue any database query.
8. IF the request does not carry a valid JWT, THEN THE `authMiddleware` SHALL reject the request with HTTP 401 before the handler is invoked.
9. IF a Supabase error occurs during the query, THEN THE handler SHALL return HTTP 500 with a descriptive error message.

---

### Requirement 7: Backend — `GET /api/subcity/woreda-analysis` Endpoint

**User Story:** As a frontend component, I want an authenticated endpoint that returns a single woreda's summed actuals and plan targets for a given sector and period, so that the `WorkAnalysisRingSection` can render accurate ring charts.

#### Acceptance Criteria

1. THE `subcityReportController` SHALL expose `getWoRedaAnalysis(req, res)` mounted at `GET /api/subcity/woreda-analysis` with `authMiddleware` applied.
2. WHEN a request is received with valid `sector`, `woredaId`, and `period` query parameters, THE `getWoRedaAnalysis` handler SHALL return a JSON response of shape `WoRedaAnalysisResponse` containing `woredaId`, `name`, `sector`, `period`, `from`, `to`, `actuals`, and `targets` fields.
3. THE handler SHALL resolve the woreda's database username from `woredaId` using the inverse of `USERNAME_TO_WEREDA_ID`.
4. THE handler SHALL fetch report sums from `SECTOR_REPORT_TABLE_MAP[sector]` filtered by the resolved `username` and `report_date BETWEEN from AND to`.
5. THE handler SHALL fetch plan targets from `SECTOR_PLAN_TABLE_MAP[sector][woredaId]` for the current year.
6. THE `actuals` and `targets` objects in the response SHALL use matching field keys so that each field can be paired by key in the frontend.
7. IF an unknown `sector` or `woredaId` value is provided, THEN THE handler SHALL return HTTP 400 with a descriptive error message and SHALL NOT issue any database query.
8. IF the request does not carry a valid JWT, THEN THE `authMiddleware` SHALL reject the request with HTTP 401.
9. IF no plan row exists for the woreda, THEN THE handler SHALL return `targets` with all fields set to `0` and SHALL NOT return an error response.
10. IF a Supabase error occurs during the query, THEN THE handler SHALL return HTTP 500 with a descriptive error message.

---

### Requirement 8: Backend — Route Registration and Authentication

**User Story:** As a system administrator, I want the new subcity endpoints to be registered consistently with the rest of the API and protected by authentication, so that access control is enforced and routing is maintainable.

#### Acceptance Criteria

1. THE system SHALL provide `backend/routes/subcityRoutes.js` that registers `GET /woreda-reports` and `GET /woreda-analysis` routes, each with `authMiddleware` applied.
2. THE `backend/server.js` SHALL mount `subcityRoutes` under the prefix `/api/subcity`.
3. THE new routes SHALL use the existing `authMiddleware` from `backend/middleware/authMiddleware.js` without modification.
4. THE `subcityReportController` SHALL be placed at `backend/controllers/subcityReportController.js` as a new file, separate from the existing `planController.js` and `reportController.js`.

---

### Requirement 9: Frontend API Client Functions

**User Story:** As a frontend developer, I want typed API client functions for the two new endpoints, so that components can call them without duplicating URL construction or authentication headers.

#### Acceptance Criteria

1. THE system SHALL provide `fetchWoRedaReports(sector, period)` as an async function that calls `GET /api/subcity/woreda-reports?sector=&period=` with the authenticated `authHeader()` and returns `WoRedaReportsResponse`.
2. THE system SHALL provide `fetchWoRedaAnalysis(sector, woredaId, period)` as an async function that calls `GET /api/subcity/woreda-analysis?sector=&woredaId=&period=` with the authenticated `authHeader()` and returns `WoRedaAnalysisResponse`.
3. BOTH functions SHALL be added to `frontend/src/api/planApi.js` or a new `frontend/src/api/subcityApi.js` file — not inlined inside component files.
4. IF the API response status is not 2xx, THEN both functions SHALL throw an error containing the server-provided error message.

---

### Requirement 10: Pure Helper Functions

**User Story:** As a developer, I want well-defined pure functions for date range calculation, woreda aggregation, and completion percentage computation, so that the logic is testable in isolation and reused consistently.

#### Acceptance Criteria

1. THE `getDateRange(period)` function SHALL accept one of `"daily"`, `"weekly"`, `"monthly"`, or `"annual"` and SHALL return `{ from: string, to: string }` as ISO date strings where `from <= to` always holds.
2. FOR the `"annual"` period, THE `getDateRange` function SHALL set `from` to January 1 of the current Gregorian year.
3. FOR the `"monthly"` period, THE `getDateRange` function SHALL set `from` to the 1st of the current Gregorian month.
4. FOR the `"weekly"` period, THE `getDateRange` function SHALL set `from` to the most recent Sunday.
5. FOR the `"daily"` period, THE `getDateRange` function SHALL set `from` equal to `to` (today only).
6. THE `aggregateByWoreda(rows, fields, usernameToId)` function SHALL return an object containing exactly one entry per woreda ID (`w1`–`w4`), each with one numeric sum entry per field in `fields`.
7. WHEN `rows` contains no entries for a woreda, THE `aggregateByWoreda` function SHALL include that woreda in the result with all fields set to `0`.
8. THE `computeCompletionPct(actuals, targets, fields)` function SHALL return a number in the closed interval `[0, 100]` rounded to one decimal place.
9. WHEN `sum(targets[f])` for all `f` in `fields` equals `0`, THE `computeCompletionPct` function SHALL return `0` without throwing an error or returning `NaN` or `Infinity`.
10. THE `computeCompletionPct` function SHALL cap the result at `100` even when `sum(actuals)` exceeds `sum(targets)`.

---

### Requirement 11: Error Handling and Graceful Degradation

**User Story:** As a subcity manager, I want the dashboard to handle missing plans, missing reports, and network errors gracefully, so that a partial data absence does not break the entire page.

#### Acceptance Criteria

1. IF no annual plan has been saved for a woreda+sector combination, THEN THE system SHALL treat all target values as `0` for that combination, render completion as `0%`, and SHALL NOT display an unhandled error.
2. IF no reports have been submitted for a woreda+sector+period combination, THEN THE system SHALL treat all actual values as `0` for that combination and display `0` values in the comparison table and ring charts.
3. IF a network or server error occurs on any of the new API calls, THEN THE affected view component SHALL display an inline error banner styled consistently with the existing red alert style.
4. WHEN an error occurs in `WorkAnalysisRingSection`, THE existing plan table in the woreda tab view SHALL remain visible and unaffected.
5. IF the `galii` sector is selected, THEN THE backend SHALL aggregate the `baasii` column from `revenue_entries` as the single actual value and SHALL map it to the single "Galii Waliigalaa" field in the response.

---

### Requirement 12: Performance and Data Freshness

**User Story:** As a subcity manager, I want the dashboard to load efficiently without unnecessary re-fetches, so that the page remains responsive even with multiple woredas and sectors.

#### Acceptance Criteria

1. THE `WorkAnalysisRingSection` SHALL issue a new fetch request only when `sector`, `woredaId`, or `period` changes — not on every render.
2. THE `ComparisonView` and `RankView` SHALL each issue a single `GET /api/subcity/woreda-reports` request that returns all four woredas' data in one round-trip rather than four separate requests.
3. THE `RankView` SHALL reuse plan target data already available in the parent component for the initial ranking computation, avoiding a redundant plan fetch.
4. THE backend `GET /api/subcity/woreda-reports` handler SHALL query only one report table per request, filtered by `username IN (woreda_usernames)` and `report_date BETWEEN from AND to`, leveraging existing indexes on `username` and `report_date`.

---

### Requirement 13: Work Analysis Landing Page — Sector Cards Grid

**User Story:** As a subcity manager, I want to see clickable sector cards when I navigate to Work Analysis without a sector selected, so that I can quickly choose a sector to analyze without having to use the sidebar.

#### Acceptance Criteria

1. WHEN `activeNav === "analysis"` AND `activeAnalysisSector` is falsy, THE `renderContent` function SHALL render a grid of exactly 6 sector cards — one for each entry in the `SECTORS` constant (Buusaa Gonofaa, Qonna, Galii Sassaabu, Carraa Hojii Uumuu, Daldala, ATK) — in a `grid grid-cols-2` layout.
2. WHEN the user clicks any sector card in the Work Analysis landing grid, THE dashboard SHALL call `setActiveAnalysisSector(s.id)` for that card's sector ID, immediately replacing the landing grid with `GenericSubcityAnalysisPage` for that sector.
3. THE Work Analysis landing page SHALL NOT render the blank empty-state placeholder (the centered `AnalysisIcon` with "Choose a sector from the sidebar" message) when the sector card grid is shown.
4. EACH sector card SHALL display the sector's display label (e.g., "Buusaa Gonofaa") as the card title and a subtitle of "Active", consistent with the visual style of the Annual Plan landing page sector cards.
5. THE sector card grid layout and styling SHALL match the Annual Plan landing page sector cards: `bg-white rounded-xl border border-[#e2e8f0] px-5 py-6` with `hover:border-[#1a3a5c]/40 hover:shadow-sm transition-all`.
6. THE existing sidebar sector nav links for Work Analysis SHALL continue to function as a second way to select a sector, with both the sidebar links and the landing page cards calling `setActiveAnalysisSector(s.id)`.
7. THIS change SHALL require no new React components, no new state variables, no new API endpoints, and no backend modifications — it is a pure frontend change replacing the existing empty-state JSX in `renderContent`.
