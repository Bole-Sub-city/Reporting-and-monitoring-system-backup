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

export const submitDaldalReport = async (reportData) => {
  const token = localStorage.getItem("token");
  const response = await api.post("/reports/daldala", reportData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const submitAtkReport = async (reportData) => {
  const token = localStorage.getItem("token");
  const response = await api.post("/reports/atk", reportData, {
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

// Get Carraa Hojii reports for user
export const getCarraaHojiiReports = async (userId) => {
  const token = localStorage.getItem("token");
  const response = await api.get(`/reports/carraa-hojii/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Get Qonna reports for user
export const getQonnaReports = async (userId) => {
  const token = localStorage.getItem("token");
  const response = await api.get(`/reports/qonna/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

/**
 * Fetch all reports submitted by the currently logged-in woreda user
 * across every sector (buusaa, carraaHojii, qonna, daldala, atk).
 * Each row includes a _sector field added by the backend.
 *
 * @param {Object} filters
 * @param {string} [filters.report_type]
 * @param {string} [filters.date_from]  ISO date "YYYY-MM-DD"
 * @param {string} [filters.date_to]    ISO date "YYYY-MM-DD"
 */
export const fetchMyReports = async (filters = {}) => {
  const token = localStorage.getItem("token");
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== "" && v !== null && v !== undefined) params.append(k, v);
  });
  const response = await api.get(`/reports/my-reports?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

/**
 * Fetch all reports from all woreda users across every sector.
 * Used by the sub-city dashboard report history page.
 * Each row includes a _sector field added by the backend.
 *
 * @param {Object} filters
 * @param {string} [filters.username]
 * @param {string} [filters.sector]      e.g. "buusaa" | "carraaHojii" | "qonna" | "daldala" | "atk"
 * @param {string} [filters.report_type]
 * @param {string} [filters.date_from]   ISO date "YYYY-MM-DD"
 * @param {string} [filters.date_to]     ISO date "YYYY-MM-DD"
 */
export const fetchAllWoredaReports = async (filters = {}) => {
  const token = localStorage.getItem("token");
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== "" && v !== null && v !== undefined) params.append(k, v);
  });
  const response = await api.get(
    `/reports/all-woreda-reports?${params.toString()}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
};
