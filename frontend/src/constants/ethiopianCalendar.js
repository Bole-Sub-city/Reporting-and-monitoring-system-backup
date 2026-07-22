/**
 * Ethiopian Calendar Constants & Utilities (Frontend only)
 *
 * Actual dates stored in the DB are Gregorian.
 * These helpers are for display labels and period classification only.
 *
 * Ethiopian reporting year starts with Hamle (≈ July 8 Gregorian).
 */

// ── Ethiopian months in Afaan Oromo ──────────────────────────────────────────
// greg.month is 0-indexed (0 = January)
// start/end are inclusive Gregorian day-of-month for the primary Gregorian month
export const ETH_MONTHS = [
  { index: 1,  name: "Hamle",    greg: { month: 6,  start: 8  } },  // Jul 8 – Aug 6
  { index: 2,  name: "Nehase",   greg: { month: 7,  start: 7  } },  // Aug 7 – Sep 5
  { index: 3,  name: "Meskerem", greg: { month: 8,  start: 11 } },  // Sep 11 – Oct 10
  { index: 4,  name: "Tikimt",   greg: { month: 9,  start: 11 } },  // Oct 11 – Nov 9
  { index: 5,  name: "Hidar",    greg: { month: 10, start: 10 } },  // Nov 10 – Dec 9
  { index: 6,  name: "Tahsas",   greg: { month: 11, start: 10 } },  // Dec 10 – Jan 8
  { index: 7,  name: "Tir",      greg: { month: 0,  start: 9  } },  // Jan 9 – Feb 7
  { index: 8,  name: "Yekatit",  greg: { month: 1,  start: 8  } },  // Feb 8 – Mar 9
  { index: 9,  name: "Megabit",  greg: { month: 2,  start: 10 } },  // Mar 10 – Apr 8
  { index: 10, name: "Miazia",   greg: { month: 3,  start: 9  } },  // Apr 9 – May 8
  { index: 11, name: "Ginbot",   greg: { month: 4,  start: 9  } },  // May 9 – Jun 7
  { index: 12, name: "Sene",     greg: { month: 5,  start: 8  } },  // Jun 8 – Jul 7
];

// ── Ethiopian quarters (Kurmaana) in Afaan Oromo ─────────────────────────────
// Follows the official Ethiopian reporting calendar strictly.
export const ETH_QUARTERS = [
  {
    number: 1,
    label: "Kurmaana 1ffaa",
    shortLabel: "K1",
    months: ["Hamle", "Nehase", "Meskerem"],
    monthIndices: [1, 2, 3],
  },
  {
    number: 2,
    label: "Kurmaana 2ffaa",
    shortLabel: "K2",
    months: ["Tikimt", "Hidar", "Tahsas"],
    monthIndices: [4, 5, 6],
  },
  {
    number: 3,
    label: "Kurmaana 3ffaa",
    shortLabel: "K3",
    months: ["Tir", "Yekatit", "Megabit"],
    monthIndices: [7, 8, 9],
  },
  {
    number: 4,
    label: "Kurmaana 4ffaa",
    shortLabel: "K4",
    months: ["Miazia", "Ginbot", "Sene"],
    monthIndices: [10, 11, 12],
  },
];

/**
 * Given a Gregorian Date or ISO string, return the matching ETH_MONTHS entry.
 * Returns null for unmatched dates (e.g. early July before Hamle, Pagume).
 */
export function getEthMonthFromGregorian(dateInput) {
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput + "T00:00:00");
  if (isNaN(d.getTime())) return null;

  const m = d.getMonth(); // 0-indexed
  const day = d.getDate();

  // Tahsas spans Dec 10 – Jan 8
  if (m === 11 && day >= 10) return ETH_MONTHS.find((x) => x.name === "Tahsas");
  if (m === 0  && day <= 8)  return ETH_MONTHS.find((x) => x.name === "Tahsas");

  // Tir spans Jan 9 – Feb 7
  if (m === 0  && day >= 9)  return ETH_MONTHS.find((x) => x.name === "Tir");
  if (m === 1  && day <= 7)  return ETH_MONTHS.find((x) => x.name === "Tir");

  // Yekatit spans Feb 8 – Mar 9
  if (m === 1  && day >= 8)  return ETH_MONTHS.find((x) => x.name === "Yekatit");
  if (m === 2  && day <= 9)  return ETH_MONTHS.find((x) => x.name === "Yekatit");

  // Megabit spans Mar 10 – Apr 8
  if (m === 2  && day >= 10) return ETH_MONTHS.find((x) => x.name === "Megabit");
  if (m === 3  && day <= 8)  return ETH_MONTHS.find((x) => x.name === "Megabit");

  // Miazia spans Apr 9 – May 8
  if (m === 3  && day >= 9)  return ETH_MONTHS.find((x) => x.name === "Miazia");
  if (m === 4  && day <= 8)  return ETH_MONTHS.find((x) => x.name === "Miazia");

  // Ginbot spans May 9 – Jun 7
  if (m === 4  && day >= 9)  return ETH_MONTHS.find((x) => x.name === "Ginbot");
  if (m === 5  && day <= 7)  return ETH_MONTHS.find((x) => x.name === "Ginbot");

  // Sene spans Jun 8 – Jul 7
  if (m === 5  && day >= 8)  return ETH_MONTHS.find((x) => x.name === "Sene");
  if (m === 6  && day <= 7)  return ETH_MONTHS.find((x) => x.name === "Sene");

  // Hamle spans Jul 8 – Aug 6
  if (m === 6  && day >= 8)  return ETH_MONTHS.find((x) => x.name === "Hamle");
  if (m === 7  && day <= 6)  return ETH_MONTHS.find((x) => x.name === "Hamle");

  // Nehase spans Aug 7 – Sep 10
  if (m === 7  && day >= 7)  return ETH_MONTHS.find((x) => x.name === "Nehase");
  if (m === 8  && day <= 10) return ETH_MONTHS.find((x) => x.name === "Nehase");

  // Meskerem spans Sep 11 – Oct 10
  if (m === 8  && day >= 11) return ETH_MONTHS.find((x) => x.name === "Meskerem");
  if (m === 9  && day <= 10) return ETH_MONTHS.find((x) => x.name === "Meskerem");

  // Tikimt spans Oct 11 – Nov 9
  if (m === 9  && day >= 11) return ETH_MONTHS.find((x) => x.name === "Tikimt");
  if (m === 10 && day <= 9)  return ETH_MONTHS.find((x) => x.name === "Tikimt");

  // Hidar spans Nov 10 – Dec 9
  if (m === 10 && day >= 10) return ETH_MONTHS.find((x) => x.name === "Hidar");
  if (m === 11 && day <= 9)  return ETH_MONTHS.find((x) => x.name === "Hidar");

  return null;
}

/**
 * Given a Gregorian Date or ISO string, return the ETH_QUARTERS entry.
 */
export function getEthQuarterFromGregorian(dateInput) {
  const ethMonth = getEthMonthFromGregorian(dateInput);
  if (!ethMonth) return null;
  return ETH_QUARTERS.find((q) => q.monthIndices.includes(ethMonth.index)) ?? null;
}

/**
 * Compute the Gregorian ISO date range (start, end) for a given Ethiopian month
 * in a given Gregorian year. Used to build date filter query params.
 *
 * @param {string} monthName  e.g. "Hamle"
 * @param {number} gregYear   e.g. 2024
 * @returns {{ start: string, end: string } | null}
 */
export function getGregorianRangeForEthMonth(monthName, gregYear) {
  const RANGES = {
    Hamle:    { start: `${gregYear}-07-08`,     end: `${gregYear}-08-06` },
    Nehase:   { start: `${gregYear}-08-07`,     end: `${gregYear}-09-10` },
    Meskerem: { start: `${gregYear}-09-11`,     end: `${gregYear}-10-10` },
    Tikimt:   { start: `${gregYear}-10-11`,     end: `${gregYear}-11-09` },
    Hidar:    { start: `${gregYear}-11-10`,     end: `${gregYear}-12-09` },
    Tahsas:   { start: `${gregYear}-12-10`,     end: `${gregYear + 1}-01-08` },
    Tir:      { start: `${gregYear}-01-09`,     end: `${gregYear}-02-07` },
    Yekatit:  { start: `${gregYear}-02-08`,     end: `${gregYear}-03-09` },
    Megabit:  { start: `${gregYear}-03-10`,     end: `${gregYear}-04-08` },
    Miazia:   { start: `${gregYear}-04-09`,     end: `${gregYear}-05-08` },
    Ginbot:   { start: `${gregYear}-05-09`,     end: `${gregYear}-06-07` },
    Sene:     { start: `${gregYear}-06-08`,     end: `${gregYear}-07-07` },
  };
  return RANGES[monthName] ?? null;
}

/**
 * Compute the Gregorian ISO date range for a full Ethiopian quarter.
 *
 * @param {number} quarterNumber  1–4
 * @param {number} gregYear       e.g. 2024
 * @returns {{ start: string, end: string } | null}
 */
export function getGregorianRangeForEthQuarter(quarterNumber, gregYear) {
  const q = ETH_QUARTERS.find((x) => x.number === quarterNumber);
  if (!q) return null;

  const ranges = q.months
    .map((mn) => getGregorianRangeForEthMonth(mn, gregYear))
    .filter(Boolean);

  const starts = ranges.map((r) => r.start).sort();
  const ends   = ranges.map((r) => r.end).sort();

  return { start: starts[0], end: ends[ends.length - 1] };
}
