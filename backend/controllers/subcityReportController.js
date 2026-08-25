const supabase = require("../config/supabase");

// ─── Constants ────────────────────────────────────────────────────────────────

const WOREDA_USERNAMES = [
  "Aanaa Gooroo",
  "Aanaa Dhadacha Araaraa",
  "Aanaa Dhakaa Adii",
  "Aanaa Andoodee",
];

const USERNAME_TO_WOREDA_ID = {
  "Aanaa Gooroo": "w1",
  "Aanaa Dhadacha Araaraa": "w2",
  "Aanaa Dhakaa Adii": "w3",
  "Aanaa Andoodee": "w4",
};

const WOREDA_ID_TO_USERNAME = {
  w1: "Aanaa Gooroo",
  w2: "Aanaa Dhadacha Araaraa",
  w3: "Aanaa Dhakaa Adii",
  w4: "Aanaa Andoodee",
};

// Report tables per sector
const SECTOR_REPORT_TABLE_MAP = {
  buusaa: "buusaa_reports",
  qonna: "qonna",
  carraa: "carraa_hojii_uumuu",
  daldala: "Daldala", // capital D — matches Supabase
  atk: "ATK", // all caps — matches Supabase
  galii: "revenue_entries",
};

// Report fields to aggregate per sector
// Keys must match the actual DB column names
const SECTOR_REPORT_FIELDS = {
  buusaa: [
    "hubannoo_uummuu",
    "horannaa_misensaa",
    "buusi_jirataa",
    "gumaata_jiraataa",
    "buusi_daldalaa",
    "buusi_daldalaa_fi_gumaataa",
    "inisheetevii_buusaa_gonofaa",
    "gumaata_midhaani",
    "nyaata_barataa",
    "zayitii",
    "sukkaara",
  ],
  qonna: [
    "furdisa_bakka_qophaawe",
    "furdisa_sheedii_ijaaraman",
    "furdisa_lakk_horii",
    "annan_bakka_qophaawe",
    "annan_sheedii_ijaaraman",
    "annan_lakk_saaa",
    "lukkuu_bakka_qophaawe",
    "lukkuu_sheedii_ijaaraman",
    "lukkuu_lakk_lukkuu",
    "boyyee_bakka_qophaawe",
    "boyyee_sheedii_ijaaraman",
    "boyyee_lakk_booyyee",
    "kannisaa_bakka_qophaawe",
    "kannisaa_gaaguraa_ijaaraman",
    "kannisaa_lakk_kannisaa",
    "qurxummii_bakka_qophaawe",
    "qurxummii_pondii_ijaaraman",
    "qurxummii_lakk_qurxummii",
  ],
  carraa: [
    "leenjii",
    "carraa_hojii_dhaabbii",
    "carraa_hojii_qacarrii",
    "qusannaa_haawaasaa",
    "qusanna_dirqii",
    "kenna_liqii",
    "deebii_liqii_bilchaate",
    "deebii_liqii_bulee",
    "industrii_godoo",
  ],
  daldala: [
    "galmee_haraa",
    "heyyema_haraa",
    "harahessaa",
    "galii_daldalarra_galuu",
    "toannoo_walii_gala",
    "tmd",
    "intarshippii",
    "ggg",
    "gabayaa_sanbata",
    "whg_kudraa",
    "whg_mudraa",
  ],
  atk: [
    "waliigaltee_pilaanii_kennuu",
    "heeyyama_ijaarsaa_kennamee",
    "toannoo_fi_hordoffii_gamoo",
    "galii_atk_galchuu",
  ],
  galii: ["baasii"], // revenue_entries: single amount column
};

// Map frontend field keys (from SECTOR_CFG) to DB column names for buusaa
// The frontend uses inisheetivii_ (double i) but DB stores inisheetevii_ (one i).
// Also DB has gumaata_midhaani but frontend key is gumaata_mootummaa.
const BUUSAA_DB_TO_FRONTEND_KEY = {
  hubannoo_uummuu: "hubannoo_uummuu",
  horannaa_misensaa: "horannaa_misensaa",
  buusi_jirataa: "buusi_jiraataa", // DB: buusi_jirataa → FE key: buusi_jiraataa
  gumaata_jiraataa: "gumaata_jiraataa",
  buusi_daldalaa: "buusi_daldalaa",
  buusi_daldalaa_fi_gumaataa: "buusi_daldalaa", // combined into same FE key
  inisheetevii_buusaa_gonofaa: "inisheetivii_buusaa_gonofaa",
  gumaata_midhaani: "gumaata_mootummaa",
  nyaata_barataa: "nyaata_barataa",
  zayitii: "zayitii",
  sukkaara: "sukkaara",
};

// Plan tables per sector per woreda
const SECTOR_PLAN_TABLE_MAP = {
  buusaa: {
    w1: "annual_plan_wereda_1",
    w2: "annual_plan_wereda_2",
    w3: "annual_plan_wereda_3",
    w4: "annual_plan_wereda_4",
  },
  qonna: {
    w1: "annual_qonna_plan_wereda_1",
    w2: "annual_qonna_plan_wereda_2",
    w3: "annual_qonna_plan_wereda_3",
    w4: "annual_qonna_plan_wereda_4",
  },
  carraa: {
    w1: "annual_carraa_plan_wereda_1",
    w2: "annual_carraa_plan_wereda_2",
    w3: "annual_carraa_plan_wereda_3",
    w4: "annual_carraa_plan_wereda_4",
  },
  daldala: {
    w1: "annual_daldala_plan_wereda_1",
    w2: "annual_daldala_plan_wereda_2",
    w3: "annual_daldala_plan_wereda_3",
    w4: "annual_daldala_plan_wereda_4",
  },
  atk: {
    w1: "annual_atk_plan_wereda_1",
    w2: "annual_atk_plan_wereda_2",
    w3: "annual_atk_plan_wereda_3",
    w4: "annual_atk_plan_wereda_4",
  },
  galii: {
    w1: "annual_galii_plan_wereda_1",
    w2: "annual_galii_plan_wereda_2",
    w3: "annual_galii_plan_wereda_3",
    w4: "annual_galii_plan_wereda_4",
  },
};

// Map plan target column suffixes per sector
// These map frontend field keys → plan table column names
const SECTOR_PLAN_FIELDS = {
  buusaa: {
    hubannoo_uummuu: "hubannoo_uummuu_target",
    horannaa_misensaa: "horannaa_misensaa_target",
    buusi_jiraataa: "buusi_jiraataa_target",
    gumaata_jiraataa: "gumaata_jiraataa_target",
    buusi_daldalaa: "buusi_daldalaa_target",
    inisheetivii_buusaa_gonofaa: "inisheetivii_buusaa_gonofaa_target",
    gumaata_mootummaa: "gumaata_mootummaa_target",
    nyaata_barataa: "nyaata_barataa_target",
    sukkaara: "sukkaara_target",
    zayitii: "zayitii_target",
  },
  qonna: {
    // Land prepared (ha) per category
    furdisa_qophi_lafa:   "furdisa_qophi_lafa_target",
    annan_qophi_lafa:     "annan_qophi_lafa_target",
    lukkuu_qophi_lafa:    "lukkuu_qophi_lafa_target",
    booyee_qophi_lafa:    "booyee_qophi_lafa_target",
    kannisaa_qophi_lafa:  "kannisaa_qophi_lafa_target",
    qurxummii_qophi_lafa: "qurxummii_qophi_lafa_target",
    // Sheds / ponds / hives built per category
    furdisa_lakk_sheedii:   "furdisa_lakk_sheedii_target",
    annan_lakk_sheedii:     "annan_lakk_sheedii_target",
    lukkuu_lakk_sheedii:    "lukkuu_lakk_sheedii_target",
    booyee_lakk_sheedii:    "booyee_lakk_sheedii_target",
    kannisaa_lakk_gaaguraa: "kannisaa_lakk_gaaguraa_target",
    qurxummii_lakk_pondii:  "qurxummii_lakk_pondii_target",
    // Total animals per category (full _waliigalaa column names)
    furdisa_lakk_horii_waliigalaa:       "furdisa_lakk_horii_waliigalaa_target",
    annan_lakk_saa_waliigalaa:           "annan_lakk_saa_waliigalaa_target",
    lukkuu_lakk_lukkuu_waliigalaa:       "lukkuu_lakk_lukkuu_waliigalaa_target",
    booyee_lakk_booyyee_waliigalaa:      "booyee_lakk_booyyee_waliigalaa_target",
    kannisaa_lakk_kannisaa_waliigalaa:   "kannisaa_lakk_kannisaa_waliigalaa_target",
    qurxummii_lakk_qurxummii_waliigalaa: "qurxummii_lakk_qurxummii_waliigalaa_target",
  },
  carraa: {
    leenjii: "leenjii_target",
    carraa_hojii_dhaabbii: "carraa_hojii_dhaabbii_target",
    carraa_hojii_qacarrii: "carraa_hojii_qacarrii_target",
    qusannaa_haawaasaa: "qusannaa_haawaasaa_target",
    qusanna_dirqii: "qusanna_dirqii_target",
    kenna_liqii: "kenna_liqii_target",
    deebii_liqii_bilchaate: "deebii_liqii_bilchaate_target",
    deebii_liqii_bulee: "deebii_liqii_bulee_target",
    industrii_godoo: "industrii_godoo_target",
  },
  daldala: {
    galmee_haraa: "galmee_haraa_target",
    heyyema_haraa: "heyyema_haraa_target",
    harahessaa: "harahessaa_target",
    galii_daldalarra_galuu: "galii_daldalarra_galuu_target",
    toannoo_walii_gala: "toannoo_walii_gala_target",
    tmd: "tmd_target",
    intarshippii: "intarshippii_target",
    ggg: "ggg_target",
    gabayaa_sanbata: "gabayaa_sanbata_target",
    whg_kudraa: "whg_kudraa_target",
    whg_mudraa: "whg_mudraa_target",
  },
  atk: {
    waliigaltee_pilaanii_kennuu: "waliigaltee_pilaanii_kennuu_target",
    heeyyama_ijaarsaa_kennamee: "heeyyama_ijaarsaa_kennamee_target",
    toannoo_fi_hordoffii_gamoo: "toannoo_fi_hordoffii_gamoo_target",
    galii_atk_galchuu: "galii_atk_galchuu_target",
  },
  galii: {
    galii_idilee: "galii_idilee_target",
    galii_mana_qophessaa: "galii_mana_qophessaa_target",
  },
};

// ─── Helper: compute date range from period ───────────────────────────────────
function getDateRange(period) {
  const now = new Date();
  const to = now.toISOString().split("T")[0];
  let from;

  if (period === "daily") {
    from = to;
  } else if (period === "weekly") {
    const d = new Date(now);
    d.setDate(d.getDate() - d.getDay()); // Sunday start
    from = d.toISOString().split("T")[0];
  } else if (period === "monthly") {
    from = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  } else if (period === "quarterly") {
    const q = Math.floor(now.getMonth() / 3);
    from = `${now.getFullYear()}-${String(q * 3 + 1).padStart(2, "0")}-01`;
  } else {
    // annual (default)
    from = `${now.getFullYear()}-01-01`;
  }

  return { from, to };
}

// ─── Helper: aggregate rows by woreda ────────────────────────────────────────
// Returns { w1: { field1: sum, field2: sum, ... }, w2: {...}, ... }
// Always includes all 4 woredas, zeroing out absent ones.
function aggregateByWoreda(rows, dbFields, usernameToId) {
  const result = {
    w1: {},
    w2: {},
    w3: {},
    w4: {},
  };

  // Initialize all fields to 0 for each woreda
  for (const wId of ["w1", "w2", "w3", "w4"]) {
    for (const f of dbFields) {
      result[wId][f] = 0;
    }
  }

  for (const row of rows) {
    const wId = usernameToId[row.username];
    if (!wId) continue; // unknown username — skip
    for (const f of dbFields) {
      result[wId][f] = (result[wId][f] || 0) + Number(row[f] || 0);
    }
  }

  return result;
}

// ─── Helper: map buusaa DB fields to frontend field keys ─────────────────────
function mapBuusaaActuals(dbAggregated) {
  const mapped = {
    w1: {},
    w2: {},
    w3: {},
    w4: {},
  };

  for (const wId of ["w1", "w2", "w3", "w4"]) {
    const raw = dbAggregated[wId];

    // combine buusi_daldalaa + buusi_daldalaa_fi_gumaataa
    mapped[wId]["buusi_daldalaa"] =
      (raw["buusi_daldalaa"] || 0) + (raw["buusi_daldalaa_fi_gumaataa"] || 0);

    // rename to frontend keys
    mapped[wId]["hubannoo_uummuu"] = raw["hubannoo_uummuu"] || 0;
    mapped[wId]["horannaa_misensaa"] = raw["horannaa_misensaa"] || 0;
    mapped[wId]["buusi_jiraataa"] = raw["buusi_jirataa"] || 0;
    mapped[wId]["gumaata_jiraataa"] = raw["gumaata_jiraataa"] || 0;
    mapped[wId]["inisheetivii_buusaa_gonofaa"] =
      raw["inisheetevii_buusaa_gonofaa"] || 0;
    mapped[wId]["gumaata_mootummaa"] = raw["gumaata_midhaani"] || 0;
    mapped[wId]["nyaata_barataa"] = raw["nyaata_barataa"] || 0;
    mapped[wId]["zayitii"] = raw["zayitii"] || 0;
    mapped[wId]["sukkaara"] = raw["sukkaara"] || 0;
  }

  return mapped;
}

// ─── Helper: map qonna DB fields to frontend category keys ───────────────────
function mapQonnaActuals(dbAggregated) {
  const mapped = {
    w1: {},
    w2: {},
    w3: {},
    w4: {},
  };

  for (const wId of ["w1", "w2", "w3", "w4"]) {
    const raw = dbAggregated[wId];
    // Map to category totals that match QONNA_CATEGORIES keys
    mapped[wId]["furdisa"] = raw["furdisa_lakk_horii"] || 0;
    mapped[wId]["annan"] = raw["annan_lakk_saaa"] || 0;
    mapped[wId]["lukkuu"] = raw["lukkuu_lakk_lukkuu"] || 0;
    mapped[wId]["booyee"] = raw["boyyee_lakk_booyyee"] || 0;
    mapped[wId]["kannisaa"] = raw["kannisaa_lakk_kannisaa"] || 0;
    mapped[wId]["qurxummii"] = raw["qurxummii_lakk_qurxummii"] || 0;
  }

  return mapped;
}

// ─── Helper: map galii DB fields to frontend field keys ──────────────────────
function mapGaliiActuals(dbAggregated) {
  const mapped = {
    w1: {},
    w2: {},
    w3: {},
    w4: {},
  };

  for (const wId of ["w1", "w2", "w3", "w4"]) {
    const raw = dbAggregated[wId];
    // revenue_entries only has baasii; map it to both galii fields
    // (we'll split evenly as a simple heuristic — both fields show total)
    mapped[wId]["galii_idilee"] = raw["baasii"] || 0;
    mapped[wId]["galii_mana_qophessaa"] = raw["baasii"] || 0;
  }

  return mapped;
}

/**
 * GET /api/subcity/woreda-reports?sector=&period=
 *
 * Returns all 4 woredas' summed actual report values for the given sector
 * and period. Used by ComparisonView and RankView.
 */
const getAllWoRedaReports = async (req, res) => {
  try {
    const { sector, period = "monthly" } = req.query;

    if (!sector || !SECTOR_REPORT_TABLE_MAP[sector]) {
      return res
        .status(400)
        .json({ message: `Unknown sector: "${sector}". Valid values: buusaa, qonna, galii, carraa, daldala, atk` });
    }

    const validPeriods = ["daily", "weekly", "monthly", "quarterly", "annual"];
    if (!validPeriods.includes(period)) {
      return res
        .status(400)
        .json({ message: `Unknown period: "${period}". Valid values: daily, weekly, monthly, quarterly, annual` });
    }

    const { from, to } = getDateRange(period);
    const reportTable = SECTOR_REPORT_TABLE_MAP[sector];
    const dbFields = SECTOR_REPORT_FIELDS[sector];

    // Fetch all rows for this sector from all 4 woredas in the date range
    const { data, error } = await supabase
      .from(reportTable)
      .select(`username, ${dbFields.join(", ")}`)
      .in("username", WOREDA_USERNAMES)
      .gte("report_date", from)
      .lte("report_date", to);

    if (error) return res.status(500).json({ message: error.message });

    const rows = data || [];
    let aggregated = aggregateByWoreda(rows, dbFields, USERNAME_TO_WOREDA_ID);

    // Apply sector-specific field mapping to normalize to frontend keys
    let normalizedActuals;
    if (sector === "buusaa") {
      normalizedActuals = mapBuusaaActuals(aggregated);
    } else if (sector === "qonna") {
      normalizedActuals = mapQonnaActuals(aggregated);
    } else if (sector === "galii") {
      normalizedActuals = mapGaliiActuals(aggregated);
    } else {
      // carraa, daldala, atk — DB keys match frontend keys
      normalizedActuals = aggregated;
    }

    // Build the response array
    const woredas = WOREDA_USERNAMES.map((username) => {
      const wId = USERNAME_TO_WOREDA_ID[username];
      return {
        woredaId: wId,
        name: username,
        actuals: normalizedActuals[wId] || {},
      };
    });

    res.json({ woredas, sector, period, from, to });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/subcity/woreda-analysis?sector=&woredaId=&period=
 *
 * Returns one woreda's summed actuals + plan targets for the given sector
 * and period. Used by WorkAnalysisRingSection (ring charts).
 */
const getWoRedaAnalysis = async (req, res) => {
  try {
    const { sector, woredaId, period = "monthly" } = req.query;

    if (!sector || !SECTOR_REPORT_TABLE_MAP[sector]) {
      return res
        .status(400)
        .json({ message: `Unknown sector: "${sector}". Valid values: buusaa, qonna, galii, carraa, daldala, atk` });
    }

    if (!woredaId || !WOREDA_ID_TO_USERNAME[woredaId]) {
      return res
        .status(400)
        .json({ message: `Unknown woredaId: "${woredaId}". Valid values: w1, w2, w3, w4` });
    }

    const validPeriods = ["daily", "weekly", "monthly", "quarterly", "annual"];
    if (!validPeriods.includes(period)) {
      return res
        .status(400)
        .json({ message: `Unknown period: "${period}". Valid values: daily, weekly, monthly, quarterly, annual` });
    }

    const { from, to } = getDateRange(period);
    const username = WOREDA_ID_TO_USERNAME[woredaId];
    const reportTable = SECTOR_REPORT_TABLE_MAP[sector];
    const dbFields = SECTOR_REPORT_FIELDS[sector];

    // Fetch report rows for this woreda in the date range
    const { data: reportData, error: reportError } = await supabase
      .from(reportTable)
      .select(`username, ${dbFields.join(", ")}`)
      .eq("username", username)
      .gte("report_date", from)
      .lte("report_date", to);

    if (reportError) return res.status(500).json({ message: reportError.message });

    // Aggregate rows into a single object
    const rows = reportData || [];
    const rawSums = {};
    for (const f of dbFields) rawSums[f] = 0;
    for (const row of rows) {
      for (const f of dbFields) {
        rawSums[f] = (rawSums[f] || 0) + Number(row[f] || 0);
      }
    }

    // Normalize actuals to frontend field keys
    let actuals = {};
    if (sector === "buusaa") {
      actuals = {
        hubannoo_uummuu: rawSums["hubannoo_uummuu"] || 0,
        horannaa_misensaa: rawSums["horannaa_misensaa"] || 0,
        buusi_jiraataa: rawSums["buusi_jirataa"] || 0,
        gumaata_jiraataa: rawSums["gumaata_jiraataa"] || 0,
        buusi_daldalaa:
          (rawSums["buusi_daldalaa"] || 0) +
          (rawSums["buusi_daldalaa_fi_gumaataa"] || 0),
        inisheetivii_buusaa_gonofaa:
          rawSums["inisheetevii_buusaa_gonofaa"] || 0,
        gumaata_mootummaa: rawSums["gumaata_midhaani"] || 0,
        nyaata_barataa: rawSums["nyaata_barataa"] || 0,
        sukkaara: rawSums["sukkaara"] || 0,
        zayitii: rawSums["zayitii"] || 0,
      };
    } else if (sector === "qonna") {
      actuals = {
        // Land prepared (ha)
        furdisa_qophi_lafa:   rawSums["furdisa_bakka_qophaawe"] || 0,
        annan_qophi_lafa:     rawSums["annan_bakka_qophaawe"] || 0,
        lukkuu_qophi_lafa:    rawSums["lukkuu_bakka_qophaawe"] || 0,
        booyee_qophi_lafa:    rawSums["boyyee_bakka_qophaawe"] || 0,
        kannisaa_qophi_lafa:  rawSums["kannisaa_bakka_qophaawe"] || 0,
        qurxummii_qophi_lafa: rawSums["qurxummii_bakka_qophaawe"] || 0,
        // Sheds / ponds / hives built
        furdisa_lakk_sheedii:   rawSums["furdisa_sheedii_ijaaraman"] || 0,
        annan_lakk_sheedii:     rawSums["annan_sheedii_ijaaraman"] || 0,
        lukkuu_lakk_sheedii:    rawSums["lukkuu_sheedii_ijaaraman"] || 0,
        booyee_lakk_sheedii:    rawSums["boyyee_sheedii_ijaaraman"] || 0,
        kannisaa_lakk_gaaguraa: rawSums["kannisaa_gaaguraa_ijaaraman"] || 0,
        qurxummii_lakk_pondii:  rawSums["qurxummii_pondii_ijaaraman"] || 0,
        // Total animals (using full _waliigalaa key names to match SECTOR_PLAN_FIELDS)
        furdisa_lakk_horii_waliigalaa:       rawSums["furdisa_lakk_horii"] || 0,
        annan_lakk_saa_waliigalaa:           rawSums["annan_lakk_saaa"] || 0,
        lukkuu_lakk_lukkuu_waliigalaa:       rawSums["lukkuu_lakk_lukkuu"] || 0,
        booyee_lakk_booyyee_waliigalaa:      rawSums["boyyee_lakk_booyyee"] || 0,
        kannisaa_lakk_kannisaa_waliigalaa:   rawSums["kannisaa_lakk_kannisaa"] || 0,
        qurxummii_lakk_qurxummii_waliigalaa: rawSums["qurxummii_lakk_qurxummii"] || 0,
      };
    } else if (sector === "galii") {
      actuals = {
        galii_idilee: rawSums["baasii"] || 0,
        galii_mana_qophessaa: rawSums["baasii"] || 0,
      };
    } else {
      // carraa, daldala, atk — DB keys match frontend keys
      actuals = { ...rawSums };
    }

    // Fetch plan targets from the appropriate woreda plan table
    const planTable = SECTOR_PLAN_TABLE_MAP[sector][woredaId];
    const year = new Date().getFullYear();

    const { data: planData, error: planError } = await supabase
      .from(planTable)
      .select("*")
      .eq("year", year)
      .maybeSingle();

    if (planError && planError.code !== "PGRST116") {
      return res.status(500).json({ message: planError.message });
    }

    const planRow = planData || {};

    // Build targets object keyed by frontend field keys
    const planFieldMap = SECTOR_PLAN_FIELDS[sector];
    const targets = {};
    for (const [feKey, planCol] of Object.entries(planFieldMap)) {
      targets[feKey] = Number(planRow[planCol] || 0);
    }

    res.json({
      woredaId,
      name: username,
      sector,
      period,
      from,
      to,
      actuals,
      targets,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllWoRedaReports,
  getWoRedaAnalysis,
};
