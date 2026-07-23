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
    authHeader()
  );
  return res.data; // { summary: {...}, period, from, to }
};
