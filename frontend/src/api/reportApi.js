import api from "./api";

export const submitCarraaHojiiReport = async (reportData) => {
  const token = localStorage.getItem("token");
  const response = await api.post("/reports/carraa-hojii", reportData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const submitQonnaReport = async (reportData) => {
  const token = localStorage.getItem("token");
  const response = await api.post("/reports/qonna", reportData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const submitRevenueReport = async (reportData) => {
  const token = localStorage.getItem("token");
  const response = await api.post("/reports/revenue", reportData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const submitBuusaaReport = async (reportData) => {
  const token = localStorage.getItem("token");

  const response = await api.post("/reports", reportData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

/**
 * Fetch filtered report history for the current user.
 *
 * @param {Object} filters
 * @param {string} [filters.report_type]   - e.g. "Daily Report — Gabaasa Guyyaa"
 * @param {string} [filters.date_from]     - ISO date string "YYYY-MM-DD"
 * @param {string} [filters.date_to]       - ISO date string "YYYY-MM-DD"
 * @param {string} [filters.quick]         - "today" | "yesterday" | "this_week" |
 *                                           "last_week" | "this_month" | "last_month" |
 *                                           "this_quarter" | "this_year"
 */
export const fetchReportHistory = async (filters = {}) => {
  const token = localStorage.getItem("token");

  // Build query string from non-empty filter values
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, val]) => {
    if (val !== "" && val !== null && val !== undefined) {
      params.append(key, val);
    }
  });

  const response = await api.get(`/reports/history?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};
