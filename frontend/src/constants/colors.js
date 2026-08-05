/**
 * Professional color system for government/civic dashboards
 * Use these constants for all dashboards, reports, and admin UI
 */

export const COLORS = {
  // ── Primary brand (deep steel blue) ──
  brand: {
    950: "#0d1f35", // Deepest sidebar dark
    900: "#122840", // Sidebar base
    800: "#1a3a5c", // Primary action, header gradient start
    700: "#1e4976", // Header gradient end
    600: "#2563a8", // Active nav, links, highlights
    100: "#dce8f4", // Light tint
    50: "#eef4fb",  // Lightest tint
  },

  // ── Surface / canvas ──
  surface: "#f4f6f9",   // Page background
  card: "#ffffff",      // Card background
  border: "#e2e8f0",    // Card borders
  borderLight: "#f1f5f9", // Table row borders

  // ── Text ──
  text: {
    primary: "#1e293b",
    secondary: "#64748b",
    muted: "#94a3b8",
    white: "#ffffff",
    light: "#f8fafc",
  },

  // ── Status / semantic (muted, professional) ──
  success: {
    bg: "#f0faf4",
    text: "#166534",
    border: "#bbf7d0",
    main: "#16a34a",
  },
  error: {
    bg: "#fef2f2",
    text: "#991b1b",
    border: "#fecaca",
    main: "#dc2626",
  },
  warning: {
    bg: "#fefce8",
    text: "#854d0e",
    border: "#fef08a",
    main: "#ca8a04",
  },
  info: {
    bg: "#eff6ff",
    text: "#1e40af",
    border: "#bfdbfe",
    main: "#3b82f6",
  },

  // ── Category/chart palette (muted, professional) ──
  categories: {
    teal: "#0f766e",      // Hubannoo Uummuu
    blue: "#1e40af",      // Horannaa Misensaa
    slate: "#475569",     // Buusii Jirataa
    steel: "#64748b",     // Buusii Daldalaa
  },
};

// Gradient presets for consistent header/sidebar styling
export const GRADIENTS = {
  sidebar: "linear-gradient(180deg, #122840 0%, #0d1f35 100%)",
  header: "linear-gradient(90deg, #1a3a5c 0%, #1e4976 100%)",
  headerReverse: "linear-gradient(90deg, #1e4976 0%, #1a3a5c 100%)",
};

// Focus ring styling for inputs (consistent with design system)
export const FOCUS_RING = {
  brand: "focus:ring-2 focus:ring-brand-600 focus:ring-opacity-20 focus:border-brand-600",
  error: "focus:ring-2 focus:ring-red-500 focus:ring-opacity-20 focus:border-red-500",
};
