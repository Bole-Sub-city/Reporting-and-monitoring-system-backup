import api from "./api";

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

/** Submit a new annual plan (locked after first submission) */
export const submitAnnualPlan = async (planData) => {
  const res = await api.post("/plans", planData, authHeader());
  return res.data;
};

/** Fetch the current year's plan for the logged-in user */
export const fetchMyPlan = async () => {
  const res = await api.get("/plans/me", authHeader());
  return res.data; // { plan: {...} | null }
};

/** Fetch actual work sums for a given period */
export const fetchSummary = async (period = "annual") => {
  const res = await api.get(`/plans/summary?period=${period}`, authHeader());
  return res.data; // { summary: {...}, period, from, to }
};

/** Fetch actual work sums for a custom Gregorian date range */
export const fetchSummaryByDateRange = async (dateFrom, dateTo) => {
  const res = await api.get(
    `/plans/summary?period=custom&date_from=${dateFrom}&date_to=${dateTo}`,
    authHeader(),
  );
  return res.data; // { summary: {...}, period, from, to }
};

/**
 * Called by the subcity dashboard "Save Plan" button.
 * Sends the subcity totals + woreda weights so the backend can
 * compute each wereda's share and save it to the correct table.
 *
 * @param {{ hubannoo_uummuu, horannaa_misensaa, buusi_jirataa, buusi_daldalaa }} plan
 * @param {{ w1, w2, w3, w4 }} weights
 */
export const saveSubcityPlan = async (plan, weights) => {
  const res = await api.post("/plans/subcity", { plan, weights }, authHeader());
  return res.data;
};

/**
 * Called by the wereda dashboard to read its own plan (read-only).
 * The backend identifies the correct table from the logged-in username.
 */
export const fetchWeredaPlan = async () => {
  const res = await api.get("/plans/wereda-plan", authHeader());
  return res.data; // { plan: {...} | null }
};

/**
 * Save the subcity's own annual plan totals + weights to Supabase.
 * Upserts on year — the form can be resubmitted any time.
 */
export const saveSubcityOwnPlan = async (plan, weights) => {
  const res = await api.post(
    "/plans/subcity-plan",
    { plan, weights },
    authHeader(),
  );
  return res.data;
};

/** Fetch the current year's subcity annual plan from Supabase. */
export const fetchSubcityOwnPlan = async () => {
  const res = await api.get("/plans/subcity-plan", authHeader());
  return res.data; // { plan: {...} | null }
};

/**
 * Save the subcity's Qonna annual plan and distribute to the 4 wereda tables.
 * @param {Object} planData  - flat object with all column names as keys
 * @param {Object} weights   - { w1, w2, w3, w4 } woreda weights
 */
export const saveSubcityQonnaPlan = async (planData, weights) => {
  const res = await api.post(
    "/plans/subcity-qonna-plan",
    { planData, weights },
    authHeader(),
  );
  return res.data;
};

/** Fetch the current year's subcity Qonna annual plan from Supabase. */
export const fetchSubcityQonnaPlan = async () => {
  const res = await api.get("/plans/subcity-qonna-plan", authHeader());
  return res.data; // { plan: {...} | null }
};

/** Fetch the current year's Daldala plan for the logged-in wereda. */
export const fetchWeredaDaldalaPlan = async () => {
  const res = await api.get("/plans/wereda-daldala-plan", authHeader());
  return res.data;
};

/** Fetch the current year's ATK plan for the logged-in wereda. */
export const fetchWeredaAtkPlan = async () => {
  const res = await api.get("/plans/wereda-atk-plan", authHeader());
  return res.data;
};

/** Fetch the current year's Revenue (Galii) plan for the logged-in wereda. */
export const fetchWeredaRevenuePlan = async () => {
  const res = await api.get("/plans/wereda-revenue-plan", authHeader());
  return res.data;
};

/** Fetch the current year's CarraaHojii plan for the logged-in wereda. */
export const fetchWeredaCarraaHojiiPlan = async () => {
  const res = await api.get("/plans/wereda-carraa-plan", authHeader());
  return res.data;
};

/** Fetch the current year's Qonna plan for the logged-in wereda. */
export const fetchWeredaQonnaPlan = async () => {
  const res = await api.get("/plans/wereda-qonna-plan", authHeader());
  return res.data; // { plan: {...} | null }
};

/**
 * Save a generic subcity plan (galii, carraa, daldala, atk) and distribute
 * to the 4 wereda tables.
 * @param {string} sector  - one of "galii" | "carraa" | "daldala" | "atk"
 * @param {Object} totals  - field totals keyed by field name
 * @param {Object} weights - { w1, w2, w3, w4 } woreda weights
 */
export const saveSubcityGenericPlan = async (sector, totals, weights) => {
  const res = await api.post(
    "/plans/subcity-generic-plan",
    { sector, totals, weights },
    authHeader(),
  );
  return res.data;
};

/** Fetch a generic subcity plan by sector. */
export const fetchSubcityGenericPlan = async (sector) => {
  const res = await api.get(
    `/plans/subcity-generic-plan?sector=${sector}`,
    authHeader(),
  );
  return res.data; // { plan: {...} | null }
};

// ─── Subcity Work Analysis API Functions ─────────────────────────────────────

/**
 * GET /api/subcity/woreda-reports?sector=&period=
 * Returns all 4 woredas' summed actual report values for the selected sector
 * and period. Used by ComparisonView and RankView.
 *
 * @param {string} sector  - "buusaa" | "qonna" | "galii" | "carraa" | "daldala" | "atk"
 * @param {string} period  - "daily" | "weekly" | "monthly" | "annual"
 * @returns {{ woredas: [{woredaId, name, actuals}], sector, period, from, to }}
 */
export const fetchWoRedaReports = async (sector, period) => {
  const res = await api.get(
    `/subcity/woreda-reports?sector=${encodeURIComponent(sector)}&period=${encodeURIComponent(period)}`,
    authHeader(),
  );
  return res.data;
};

/**
 * GET /api/subcity/woreda-analysis?sector=&woredaId=&period=
 * Returns one woreda's summed actuals + plan targets for ring charts.
 *
 * @param {string} sector   - "buusaa" | "qonna" | "galii" | "carraa" | "daldala" | "atk"
 * @param {string} woredaId - "w1" | "w2" | "w3" | "w4"
 * @param {string} period   - "daily" | "weekly" | "monthly" | "annual"
 * @returns {{ woredaId, name, sector, period, from, to, actuals, targets }}
 */
export const fetchWoRedaAnalysis = async (sector, woredaId, period) => {
  const res = await api.get(
    `/subcity/woreda-analysis?sector=${encodeURIComponent(sector)}&woredaId=${encodeURIComponent(woredaId)}&period=${encodeURIComponent(period)}`,
    authHeader(),
  );
  return res.data;
};

/**
 * GET /api/subcity/subcity-galii?period=
 * Returns the subcity's own Galii Sassaabu actuals for the period.
 * Used by GaliiComparisonView to show the Subcity column.
 *
 * @param {string} period - "daily"|"weekly"|"monthly"|"quarterly"|"annual"
 * @returns {{ username, period, from, to, actuals: { galii_idilee, galii_mana_qophessaa } }}
 */
export const fetchSubcityGalii = async (period = "monthly") => {
  const res = await api.get(
    `/subcity/subcity-galii?period=${encodeURIComponent(period)}`,
    authHeader(),
  );
  return res.data;
};

// ─── Announcements API ────────────────────────────────────────────────────────

/**
 * POST /api/announcements
 * Sub-city only: create a new announcement.
 * @param {{ title: string, body: string }} payload
 */
export const createAnnouncement = async (payload) => {
  const res = await api.post("/announcements", payload, authHeader());
  return res.data; // { announcement: {...} }
};

/**
 * GET /api/announcements
 * All authenticated users: fetch all announcements, newest first.
 * @returns {{ announcements: Array }}
 */
export const fetchAnnouncements = async () => {
  const res = await api.get("/announcements", authHeader());
  return res.data; // { announcements: [...] }
};

/**
 * GET /api/announcements/unread-count
 * Woreda users: returns { count } of announcements newer than last_seen_id.
 * @returns {{ count: number }}
 */
export const fetchUnreadCount = async () => {
  const res = await api.get("/announcements/unread-count", authHeader());
  return res.data; // { count: number }
};

/**
 * POST /api/announcements/mark-read
 * Woreda users: mark all current announcements as read up to lastId.
 * @param {number} lastId - the id of the newest announcement seen
 */
export const markAnnouncementsRead = async (lastId) => {
  const res = await api.post("/announcements/mark-read", { lastId }, authHeader());
  return res.data; // { ok: true }
};
