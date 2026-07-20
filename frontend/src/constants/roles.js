export const ROLES = {
  ADMIN: "admin",
  SUB_CITY: "sub-city",
  WEREDA: "wereda",
};

export const ROLE_OPTIONS = [
  {
    id: ROLES.ADMIN,
    label: "Admin",
    description: "Manage users, templates, reports, and system-wide analytics.",
    icon: "shield",
  },
  {
    id: ROLES.SUB_CITY,
    label: "Sub-city",
    description: "track reports for your sub-city office.",
    icon: "building",
  },
  {
    id: ROLES.WEREDA,
    label: "Wereda",
    description: "Submit and track reports for your wereda office.",
    icon: "map",
  },
];

export const ROLE_DASHBOARD_PATHS = {
  [ROLES.ADMIN]: "/admin/dashboard",
  [ROLES.SUB_CITY]: "/sub-city/dashboard",
  [ROLES.WEREDA]: "/wereda/dashboard",
};
