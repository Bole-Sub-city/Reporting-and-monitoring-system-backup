# Tasks

## Task 1: Work Analysis Landing Page — Sector Cards Grid ✅

Replace the empty-state placeholder in `renderContent` (when `activeNav === "analysis"` and `activeAnalysisSector` is null) with a `grid grid-cols-2` of clickable sector cards, one per entry in the `SECTORS` constant. Clicking a card calls `setActiveAnalysisSector(s.id)`.

**File**: `frontend/src/pages/subcitydashboard.jsx`

**Change**: In the `renderContent` function, find the `if (activeNav === "analysis")` branch. Replace the inner block that renders when `!activeAnalysisSector` with the sector card grid below. Do NOT touch the `return <WorkAnalysisPage sector={activeAnalysisSector} />` line.

**Before** (the empty-state block to replace):
```jsx
if (!activeAnalysisSector)
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1e293b] mb-1">
        Work Analysis
      </h1>
      <p className="text-[#64748b] text-sm mb-6">
        Select a sector from the sidebar.
      </p>
      <div className="bg-white rounded-xl border border-[#e2e8f0] px-6 py-14 flex flex-col items-center text-center shadow-sm">
        <div className="w-14 h-14 rounded-full bg-[#eef4fb] flex items-center justify-center mb-4 text-[#1a3a5c]">
          <AnalysisIcon />
        </div>
        <p className="text-[#94a3b8] text-sm">
          Choose a sector from the sidebar to view analysis.
        </p>
      </div>
    </div>
  );
```

**After** (sector card grid matching the Annual Plan landing page pattern):
```jsx
if (!activeAnalysisSector)
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1e293b] mb-1">
        Work Analysis
      </h1>
      <p className="text-[#64748b] text-sm mb-6">
        Select a sector to view analysis.
      </p>
      <div className="grid grid-cols-2 gap-4">
        {SECTORS.map((s) => (
          <button
            key={s.id}
            onClick={() => {
              setActiveAnalysisSector(s.id);
              setAnalysisOpen(true);
            }}
            className="bg-white rounded-xl border border-[#e2e8f0] px-5 py-6 text-left hover:border-[#1a3a5c]/40 hover:shadow-sm transition-all"
          >
            <p className="font-semibold text-[#1e293b]">{s.label}</p>
            <p className="text-xs text-[#94a3b8] mt-1">Active</p>
          </button>
        ))}
      </div>
    </div>
  );
```

**Acceptance criteria**:
- [ ] When `activeNav === "analysis"` and `activeAnalysisSector` is null, 6 sector cards are shown in a 2-column grid.
- [ ] Clicking "Buusaa Gonofaa" sets `activeAnalysisSector` to `"buusaa"` and shows `GenericSubcityAnalysisPage`.
- [ ] Clicking any of the other 5 sector cards similarly navigates to that sector's analysis page.
- [ ] The existing sidebar Work Analysis sector nav links still work as before.
- [ ] No new state, no new components, no backend changes.

**References**: Requirements §13, Design §WorkAnalysisLandingPage
