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
 * Save the subcity's Qonna annual plan (qophii lafaa totals) and
 * distribute them to the 4 wereda qonna plan tables.
 *
 * @param {{ furdisa, annan, lukkuu, booyee, kannisaa, qurxummii }} qophi - qophii lafaa totals
 * @param {{ w1, w2, w3, w4 }} weights - population counts per woreda
 */
export const saveSubcityQonnaPlan = async (qophi, weights) => {
  const res = await api.post(
    "/plans/subcity-qonna-plan",
    { qophi, weights },
    authHeader(),
  );
  return res.data;
};

/** Fetch the current year's subcity Qonna annual plan from Supabase. */
export const fetchSubcityQonnaPlan = async () => {
  const res = await api.get("/plans/subcity-qonna-plan", authHeader());
  return res.data; // { plan: {...} | null }
};

/** Fetch the current year's Qonna plan for the logged-in wereda. */
export const fetchWeredaQonnaPlan = async () => {
  const res = await api.get("/plans/wereda-qonna-plan", authHeader());
  return res.data; // { plan: {...} | null }
};
