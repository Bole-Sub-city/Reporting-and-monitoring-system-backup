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

/**
 * Submit a Galii Sassaabu (revenue) report from the sub-city dashboard.
 * Reuses the same /reports/revenue endpoint — the backend stores the
 * username from the JWT, so subcity entries are tagged with the subcity username.
 */
export const submitSubcityRevenueReport = async (reportData) => {
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

/**
 * Submit a Galii Sassabu report from the woreda dashboard.
 * Sends mana_qophessaa_total, idilee_total, optional detail arrays.
 */
export const submitGaliiSassabuReport = async (reportData) => {
  const token = localStorage.getItem("token");
  const response = await api.post("/reports/galii-sassabu", reportData, {
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
 * @param {string} [filters.sector]      e.g. "buusaa" | "carraaHojii" | "qonna" | "daldala" | "atk"
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

// ─── Lock status ─────────────────────────────────────────────────────────────
/** Returns { locked: { buusaa, carraa, qonna, daldala, atk }, date } */
export const fetchLockStatus = async (date) => {
  const token = localStorage.getItem("token");
  const d = date || new Date().toISOString().split("T")[0];
  const response = await api.get(`/reports/lock-status?date=${d}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// ─── Edit permission requests ─────────────────────────────────────────────────
/** Wereda requests edit access for a locked report */
export const requestEditAccess = async (sector, report_date, report_type) => {
  const token = localStorage.getItem("token");
  const response = await api.post(
    "/auth/edit-requests",
    { sector, report_date, report_type },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
};

/** Wereda fetches their own edit requests */
export const fetchMyEditRequests = async () => {
  const token = localStorage.getItem("token");
  const response = await api.get("/auth/edit-requests/mine", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// ─── Fiscal-year helpers ───────────────────────────────────────────────────────

/**
 * Return the Gregorian date range for an Oromo/Ethiopian fiscal year.
 * The fiscal year starts on July 8 and ends on July 7 of the following year.
 *
 * fiscalYear = the year in which the period STARTS (e.g. 2024 → Jul 8 2024 – Jul 7 2025)
 *
 * @param {number} fiscalYear
 * @returns {{ from: string, to: string }}  ISO "YYYY-MM-DD" strings
 */
export function fiscalYearRange(fiscalYear) {
  const y = Number(fiscalYear);
  return {
    from: `${y}-07-08`,
    to: `${y + 1}-07-07`,
  };
}

/**
 * Derive the current fiscal year number.
 * If today is on or after July 8, the fiscal year started this calendar year.
 * Otherwise it started last calendar year.
 *
 * @returns {number}
 */
export function currentFiscalYear() {
  const now = new Date();
  const m = now.getMonth() + 1; // 1-based
  const d = now.getDate();
  // On or after July 8 → fiscal year started this year
  if (m > 7 || (m === 7 && d >= 8)) return now.getFullYear();
  return now.getFullYear() - 1;
}

/**
 * Fetch all woreda reports for a specific fiscal year.
 * Delegates to fetchAllWoredaReports with the correct Gregorian date range.
 *
 * @param {number}  fiscalYear  - e.g. 2024
 * @param {Object}  [filters]   - additional filters (username, sector, etc.)
 */
export const fetchAllWoredaReportsByFiscalYear = async (
  fiscalYear,
  filters = {},
) => {
  const { from, to } = fiscalYearRange(fiscalYear);
  return fetchAllWoredaReports({ ...filters, date_from: from, date_to: to });
};
