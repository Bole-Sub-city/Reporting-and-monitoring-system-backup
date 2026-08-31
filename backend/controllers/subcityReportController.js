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
    "gumaata_midhaani_tarsiimoo",
    "gumaata_midhaani_sardamaa",
    "nyaata_barataa",
    "zayitii",
    "sukkaara",
    "daldala_b_group_a",
    "daldala_b_group_b",
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
    // Leenjii: int, dhi, dub
    "leenjii_int",
    "leenjii_dhi",
    "leenjii_dub",
    // Carraa Hojii Dhaabbii: int, dhi, dub
    "carraa_hojii_dhaabbii_int",
    "carraa_hojii_dhaabbii_dhi",
    "carraa_hojii_dhaabbii_dub",
    // Carraa Hojii Qacarrii: int, dhi, dub
    "carraa_hojii_qacarrii_int",
    "carraa_hojii_qacarrii_dhi",
    "carraa_hojii_qacarrii_dub",
    // Qusannaa Haawaasaa: int, qarshii
    "qusannaa_haawaasaa_int",
    "qusannaa_haawaasaa_qarshii",
    // Kenna Liqii: int, mise, qarshii
    "kenna_liqii_int",
    "kenna_liqii_mise",
    "kenna_liqii_qarshii",
    // Qusanna Dirqii: int, mise, qarshii
    "qusanna_dirqii_int",
    "qusanna_dirqii_mise",
    "qusanna_dirqii_qarshii",
    // Deebii Liqii Bilchaate: int, qarshii
    "deebii_liqii_bilchaate_int",
    "deebii_liqii_bilchaate_qarshii",
    // Deebii Liqii Bulee: int, qarshii
    "deebii_liqii_bulee_int",
    "deebii_liqii_bulee_qarshii",
    // Industrii Godoo: kilaastera, lafa, carraa_hojii
    "industrii_godoo_kilaastera",
    "industrii_godoo_lafa",
    "industrii_godoo_carraa_hojii",
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
  galii: ["baasii", "kg"], // revenue_entries: amount (Qarshii) + KG columns
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
    gumaata_midhaani_tarsiimoo: "gumaata_midhaani_tarsiimoo_target",
    gumaata_midhaani_sardamaa: "gumaata_midhaani_sardamaa_target",
    nyaata_barataa: "nyaata_barataa_target",
    sukkaara: "sukkaara_target",
    zayitii: "zayitii_target",
    daldala_b_group_a: "daldala_b_group_a_target",
    daldala_b_group_b: "daldala_b_group_b_target",
  },
  qonna: {
    // Land prepared (ha) per category
    furdisa_qophi_lafa: "furdisa_qophi_lafa_target",
    annan_qophi_lafa: "annan_qophi_lafa_target",
    lukkuu_qophi_lafa: "lukkuu_qophi_lafa_target",
    booyee_qophi_lafa: "booyee_qophi_lafa_target",
    kannisaa_qophi_lafa: "kannisaa_qophi_lafa_target",
    qurxummii_qophi_lafa: "qurxummii_qophi_lafa_target",
    // Sheds / ponds / hives built per category
    furdisa_lakk_sheedii: "furdisa_lakk_sheedii_target",
    annan_lakk_sheedii: "annan_lakk_sheedii_target",
    lukkuu_lakk_sheedii: "lukkuu_lakk_sheedii_target",
    booyee_lakk_sheedii: "booyee_lakk_sheedii_target",
    kannisaa_lakk_gaaguraa: "kannisaa_lakk_gaaguraa_target",
    qurxummii_lakk_pondii: "qurxummii_lakk_pondii_target",
    // Total animals per category (full _waliigalaa column names)
    furdisa_lakk_horii_waliigalaa: "furdisa_lakk_horii_waliigalaa_target",
    annan_lakk_saa_waliigalaa: "annan_lakk_saa_waliigalaa_target",
    lukkuu_lakk_lukkuu_waliigalaa: "lukkuu_lakk_lukkuu_waliigalaa_target",
    booyee_lakk_booyyee_waliigalaa: "booyee_lakk_booyyee_waliigalaa_target",
    kannisaa_lakk_kannisaa_waliigalaa:
      "kannisaa_lakk_kannisaa_waliigalaa_target",
    qurxummii_lakk_qurxummii_waliigalaa:
      "qurxummii_lakk_qurxummii_waliigalaa_target",
  },
  carraa: {
    leenjii_int: "leenjii_int_target",
    leenjii_dhi: "leenjii_dhi_target",
    leenjii_dub: "leenjii_dub_target",
    carraa_hojii_dhaabbii_int: "carraa_hojii_dhaabbii_int_target",
    carraa_hojii_dhaabbii_dhi: "carraa_hojii_dhaabbii_dhi_target",
    carraa_hojii_dhaabbii_dub: "carraa_hojii_dhaabbii_dub_target",
    carraa_hojii_qacarrii_int: "carraa_hojii_qacarrii_int_target",
    carraa_hojii_qacarrii_dhi: "carraa_hojii_qacarrii_dhi_target",
    carraa_hojii_qacarrii_dub: "carraa_hojii_qacarrii_dub_target",
    qusannaa_haawaasaa_int: "qusannaa_haawaasaa_int_target",
    qusannaa_haawaasaa_qarshii: "qusannaa_haawaasaa_qarshii_target",
    kenna_liqii_int: "kenna_liqii_int_target",
    kenna_liqii_mise: "kenna_liqii_mise_target",
    kenna_liqii_qarshii: "kenna_liqii_qarshii_target",
    qusanna_dirqii_int: "qusanna_dirqii_int_target",
    qusanna_dirqii_mise: "qusanna_dirqii_mise_target",
    qusanna_dirqii_qarshii: "qusanna_dirqii_qarshii_target",
    deebii_liqii_bilchaate_int: "deebii_liqii_bilchaate_int_target",
    deebii_liqii_bilchaate_qarshii: "deebii_liqii_bilchaate_qarshii_target",
    deebii_liqii_bulee_int: "deebii_liqii_bulee_int_target",
    deebii_liqii_bulee_qarshii: "deebii_liqii_bulee_qarshii_target",
    industrii_godoo_kilaastera: "industrii_godoo_kilaastera_target",
    industrii_godoo_lafa: "industrii_godoo_lafa_target",
    industrii_godoo_carraa_hojii: "industrii_godoo_carraa_hojii_target",
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
    // Mana Qophessaa sub-items: KG + Qarshii per source
    mq_liizii_kg: "mq_liizii_kg_target",
    mq_liizii_qarshii: "mq_liizii_qarshii_target",
    mq_kiraa_lafaa_kg: "mq_kiraa_lafaa_kg_target",
    mq_kiraa_lafaa_qarshii: "mq_kiraa_lafaa_qarshii_target",
    mq_kiraa_gare_liizii_kg: "mq_kiraa_gare_liizii_kg_target",
    mq_kiraa_gare_liizii_qarshii: "mq_kiraa_gare_liizii_qarshii_target",
    mq_baaxii_fi_gooroo_kg: "mq_baaxii_fi_gooroo_kg_target",
    mq_baaxii_fi_gooroo_qarshii: "mq_baaxii_fi_gooroo_qarshii_target",
    mq_kiraa_mana_daldalaa_kg: "mq_kiraa_mana_daldalaa_kg_target",
    mq_kiraa_mana_daldalaa_qarshii: "mq_kiraa_mana_daldalaa_qarshii_target",
    mq_kiraa_mana_jireenyaa_kg: "mq_kiraa_mana_jireenyaa_kg_target",
    mq_kiraa_mana_jireenyaa_qarshii: "mq_kiraa_mana_jireenyaa_qarshii_target",
    mq_other_kg: "mq_other_kg_target",
    mq_other_qarshii: "mq_other_qarshii_target",
    // Idilee (placeholder — Qarshii only)
    idilee_qarshii: "idilee_qarshii_target",
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
  const mapped = { w1: {}, w2: {}, w3: {}, w4: {} };

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
    mapped[wId]["gumaata_midhaani_tarsiimoo"] =
      raw["gumaata_midhaani_tarsiimoo"] || 0;
    mapped[wId]["gumaata_midhaani_sardamaa"] =
      raw["gumaata_midhaani_sardamaa"] || 0;
    mapped[wId]["nyaata_barataa"] = raw["nyaata_barataa"] || 0;
    mapped[wId]["zayitii"] = raw["zayitii"] || 0;
    mapped[wId]["sukkaara"] = raw["sukkaara"] || 0;
    mapped[wId]["daldala_b_group_a"] = raw["daldala_b_group_a"] || 0;
    mapped[wId]["daldala_b_group_b"] = raw["daldala_b_group_b"] || 0;
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
// revenue_entries has: madda_galii (source label), baasii (Qarshii), kg
// We aggregate KG and Qarshii per source label and map to mq_<key>_kg / mq_<key>_qarshii
const GALII_SOURCE_TO_KEY = {
  Liizii: "liizii",
  "Kiraa Lafaa": "kiraa_lafaa",
  "Kiraa gare Liizii": "kiraa_gare_liizii",
  "Baaxii fi Gooroo": "baaxii_fi_gooroo",
  "Kiraa Mana Daldalaa": "kiraa_mana_daldalaa",
  "Kiraa Mana Jireenyaa": "kiraa_mana_jireenyaa",
  Other: "other",
  Idilee: "_idilee",
};

function mapGaliiActuals(dbAggregated) {
  // dbAggregated is keyed by woreda but the rows are individual entries
  // We need to re-aggregate from raw rows — see getAllWoRedaReports for the approach.
  // For the actuals shape returned here, we return totals by sub-item key.
  // NOTE: aggregateByWoreda already sums baasii+kg per woreda from all rows.
  // Since we need per-source breakdown, we pass through raw baasii/kg sums here
  // and let the print table use madda_galii-based aggregation from the raw rows instead.
  // For the ring chart / comparison view we return high-level totals.
  const mapped = { w1: {}, w2: {}, w3: {}, w4: {} };
  for (const wId of ["w1", "w2", "w3", "w4"]) {
    const raw = dbAggregated[wId];
    // High-level totals for comparison/ring chart views
    mapped[wId]["mq_total_qarshii"] = raw["baasii"] || 0;
    mapped[wId]["idilee_qarshii"] = 0; // breakdown only available from raw rows
    // Also expose baasii total for any legacy code
    mapped[wId]["baasii"] = raw["baasii"] || 0;
    mapped[wId]["kg"] = raw["kg"] || 0;
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
      return res.status(400).json({
        message: `Unknown sector: "${sector}". Valid values: buusaa, qonna, galii, carraa, daldala, atk`,
      });
    }

    const validPeriods = ["daily", "weekly", "monthly", "quarterly", "annual"];
    if (!validPeriods.includes(period)) {
      return res.status(400).json({
        message: `Unknown period: "${period}". Valid values: daily, weekly, monthly, quarterly, annual`,
      });
    }

    const { from, to } = getDateRange(period);
    const reportTable = SECTOR_REPORT_TABLE_MAP[sector];
    const dbFields = SECTOR_REPORT_FIELDS[sector];

    // Fetch all rows for this sector from all 4 woredas in the date range
    // For galii we also select madda_galii to enable per-source breakdown
    const selectCols =
      sector === "galii"
        ? `username, madda_galii, ${dbFields.join(", ")}`
        : `username, ${dbFields.join(", ")}`;

    const { data, error } = await supabase
      .from(reportTable)
      .select(selectCols)
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
      // Per-source breakdown: group raw rows by username + madda_galii
      normalizedActuals = { w1: {}, w2: {}, w3: {}, w4: {} };
      // initialise all source keys to 0 for each woreda
      for (const wId of ["w1", "w2", "w3", "w4"]) {
        for (const [, sKey] of Object.entries(GALII_SOURCE_TO_KEY)) {
          if (sKey === "_idilee") {
            normalizedActuals[wId]["idilee_qarshii"] = 0;
          } else {
            normalizedActuals[wId][`mq_${sKey}_kg`] = 0;
            normalizedActuals[wId][`mq_${sKey}_qarshii`] = 0;
          }
        }
        normalizedActuals[wId]["mq_total_qarshii"] = 0;
        normalizedActuals[wId]["baasii"] = 0;
        normalizedActuals[wId]["kg"] = 0;
      }
      for (const row of rows) {
        const wId = USERNAME_TO_WOREDA_ID[row.username];
        if (!wId) continue;
        const src = row.madda_galii ?? "";
        const sKey = GALII_SOURCE_TO_KEY[src];
        const qarshii = Number(row.baasii || 0);
        const kg = Number(row.kg || 0);
        normalizedActuals[wId]["mq_total_qarshii"] += qarshii;
        normalizedActuals[wId]["baasii"] += qarshii;
        normalizedActuals[wId]["kg"] += kg;
        if (sKey === "_idilee") {
          normalizedActuals[wId]["idilee_qarshii"] += qarshii;
        } else if (sKey) {
          normalizedActuals[wId][`mq_${sKey}_qarshii`] += qarshii;
          normalizedActuals[wId][`mq_${sKey}_kg`] += kg;
        }
      }
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
      return res.status(400).json({
        message: `Unknown sector: "${sector}". Valid values: buusaa, qonna, galii, carraa, daldala, atk`,
      });
    }

    if (!woredaId || !WOREDA_ID_TO_USERNAME[woredaId]) {
      return res.status(400).json({
        message: `Unknown woredaId: "${woredaId}". Valid values: w1, w2, w3, w4`,
      });
    }

    const validPeriods = ["daily", "weekly", "monthly", "quarterly", "annual"];
    if (!validPeriods.includes(period)) {
      return res.status(400).json({
        message: `Unknown period: "${period}". Valid values: daily, weekly, monthly, quarterly, annual`,
      });
    }

    const { from, to } = getDateRange(period);
    const yearStart = `${new Date().getFullYear()}-01-01`;

    // Days elapsed since Jan 1 (inclusive)
    const now2 = new Date();
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysElapsed = Math.floor((now2 - new Date(yearStart)) / msPerDay) + 1;

    const username = WOREDA_ID_TO_USERNAME[woredaId];
    const reportTable = SECTOR_REPORT_TABLE_MAP[sector];
    const dbFields = SECTOR_REPORT_FIELDS[sector];
    // For galii we also need madda_galii to break down actuals per source
    const selectCols =
      sector === "galii"
        ? `username, madda_galii, ${dbFields.join(", ")}`
        : `username, ${dbFields.join(", ")}`;

    // Fetch period actuals (for ring chart display)
    const { data: reportData, error: reportError } = await supabase
      .from(reportTable)
      .select(selectCols)
      .eq("username", username)
      .gte("report_date", from)
      .lte("report_date", to);

    if (reportError)
      return res.status(500).json({ message: reportError.message });

    // Fetch YTD actuals (for carry-over remaining)
    const { data: ytdData, error: ytdError } = await supabase
      .from(reportTable)
      .select(selectCols)
      .eq("username", username)
      .gte("report_date", yearStart)
      .lte("report_date", to);

    if (ytdError) return res.status(500).json({ message: ytdError.message });

    // Aggregate helper
    const sumRows = (rows) => {
      const sums = {};
      for (const f of dbFields) sums[f] = 0;
      for (const row of rows || []) {
        for (const f of dbFields) {
          sums[f] = (sums[f] || 0) + Number(row[f] || 0);
        }
      }
      return sums;
    };

    const rawSums = sumRows(reportData);
    const rawYtd = sumRows(ytdData);

    // Normalize actuals to frontend field keys
    const normalizeQonna = (raw) => ({
      furdisa_qophi_lafa: raw["furdisa_bakka_qophaawe"] || 0,
      annan_qophi_lafa: raw["annan_bakka_qophaawe"] || 0,
      lukkuu_qophi_lafa: raw["lukkuu_bakka_qophaawe"] || 0,
      booyee_qophi_lafa: raw["boyyee_bakka_qophaawe"] || 0,
      kannisaa_qophi_lafa: raw["kannisaa_bakka_qophaawe"] || 0,
      qurxummii_qophi_lafa: raw["qurxummii_bakka_qophaawe"] || 0,
      furdisa_lakk_sheedii: raw["furdisa_sheedii_ijaaraman"] || 0,
      annan_lakk_sheedii: raw["annan_sheedii_ijaaraman"] || 0,
      lukkuu_lakk_sheedii: raw["lukkuu_sheedii_ijaaraman"] || 0,
      booyee_lakk_sheedii: raw["boyyee_sheedii_ijaaraman"] || 0,
      kannisaa_lakk_gaaguraa: raw["kannisaa_gaaguraa_ijaaraman"] || 0,
      qurxummii_lakk_pondii: raw["qurxummii_pondii_ijaaraman"] || 0,
      furdisa_lakk_horii_waliigalaa: raw["furdisa_lakk_horii"] || 0,
      annan_lakk_saa_waliigalaa: raw["annan_lakk_saaa"] || 0,
      lukkuu_lakk_lukkuu_waliigalaa: raw["lukkuu_lakk_lukkuu"] || 0,
      booyee_lakk_booyyee_waliigalaa: raw["boyyee_lakk_booyyee"] || 0,
      kannisaa_lakk_kannisaa_waliigalaa: raw["kannisaa_lakk_kannisaa"] || 0,
      qurxummii_lakk_qurxummii_waliigalaa: raw["qurxummii_lakk_qurxummii"] || 0,
    });

    const normalizeBuusaa = (raw) => ({
      hubannoo_uummuu: raw["hubannoo_uummuu"] || 0,
      horannaa_misensaa: raw["horannaa_misensaa"] || 0,
      buusi_jiraataa: raw["buusi_jirataa"] || 0,
      gumaata_jiraataa: raw["gumaata_jiraataa"] || 0,
      buusi_daldalaa:
        (raw["buusi_daldalaa"] || 0) + (raw["buusi_daldalaa_fi_gumaataa"] || 0),
      inisheetivii_buusaa_gonofaa: raw["inisheetevii_buusaa_gonofaa"] || 0,
      gumaata_mootummaa: raw["gumaata_midhaani"] || 0,
      gumaata_midhaani_tarsiimoo: raw["gumaata_midhaani_tarsiimoo"] || 0,
      gumaata_midhaani_sardamaa: raw["gumaata_midhaani_sardamaa"] || 0,
      nyaata_barataa: raw["nyaata_barataa"] || 0,
      sukkaara: raw["sukkaara"] || 0,
      zayitii: raw["zayitii"] || 0,
      daldala_b_group_a: raw["daldala_b_group_a"] || 0,
      daldala_b_group_b: raw["daldala_b_group_b"] || 0,
    });

    let actuals = {};
    let actualsYtd = {};

    if (sector === "buusaa") {
      actuals = normalizeBuusaa(rawSums);
      actualsYtd = normalizeBuusaa(rawYtd);
    } else if (sector === "qonna") {
      actuals = normalizeQonna(rawSums);
      actualsYtd = normalizeQonna(rawYtd);
    } else if (sector === "galii") {
      // For galii we need per-source breakdown keyed by mq_<source_key>_kg / mq_<source_key>_qarshii.
      // The sumRows helper sums baasii+kg across ALL rows regardless of madda_galii,
      // so we re-aggregate from the raw rows here using GALII_SOURCE_TO_KEY.
      const buildGaliiActuals = (rows) => {
        const result = {};
        // initialise all known source keys to 0
        for (const [, sKey] of Object.entries(GALII_SOURCE_TO_KEY)) {
          if (sKey === "_idilee") {
            result["idilee_qarshii"] = 0;
          } else {
            result[`mq_${sKey}_kg`] = 0;
            result[`mq_${sKey}_qarshii`] = 0;
          }
        }
        // also keep high-level totals for comparison/ring views
        result["mq_total_qarshii"] = 0;
        result["kg"] = 0;
        result["baasii"] = 0;

        for (const row of rows || []) {
          const src = row.madda_galii ?? "";
          const sKey = GALII_SOURCE_TO_KEY[src];
          const qarshii = Number(row.baasii || 0);
          const kg = Number(row.kg || 0);
          result["mq_total_qarshii"] =
            (result["mq_total_qarshii"] || 0) + qarshii;
          result["baasii"] = (result["baasii"] || 0) + qarshii;
          result["kg"] = (result["kg"] || 0) + kg;
          if (sKey === "_idilee") {
            result["idilee_qarshii"] =
              (result["idilee_qarshii"] || 0) + qarshii;
          } else if (sKey) {
            result[`mq_${sKey}_qarshii`] =
              (result[`mq_${sKey}_qarshii`] || 0) + qarshii;
            result[`mq_${sKey}_kg`] = (result[`mq_${sKey}_kg`] || 0) + kg;
          }
        }
        return result;
      };

      actuals = buildGaliiActuals(reportData);
      actualsYtd = buildGaliiActuals(ytdData);
    } else {
      // carraa, daldala, atk — DB keys match frontend keys
      actuals = { ...rawSums };
      actualsYtd = { ...rawYtd };
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
      actualsYtd,
      daysElapsed,
      targets,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/subcity/subcity-galii?period=
 *
 * Returns the subcity's own summed Galii Sassaabu (revenue) actuals for the
 * given period. Used by GaliiComparisonView to show the subcity column.
 * The subcity user's username is taken from the JWT (req.user.username).
 */
const getSubcityGalii = async (req, res) => {
  try {
    const { period = "monthly" } = req.query;

    const validPeriods = ["daily", "weekly", "monthly", "quarterly", "annual"];
    if (!validPeriods.includes(period)) {
      return res.status(400).json({ message: `Unknown period: "${period}"` });
    }

    const { from, to } = getDateRange(period);
    const subcityUsername = req.user?.username;

    if (!subcityUsername) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    // Fetch all revenue_entries rows for this subcity user in the date range
    const { data, error } = await supabase
      .from("revenue_entries")
      .select("baasii")
      .eq("username", subcityUsername)
      .gte("report_date", from)
      .lte("report_date", to);

    if (error) return res.status(500).json({ message: error.message });

    const total = (data || []).reduce(
      (sum, row) => sum + Number(row.baasii || 0),
      0,
    );
    const totalKg = (data || []).reduce(
      (sum, row) => sum + Number(row.kg || 0),
      0,
    );

    res.json({
      username: subcityUsername,
      period,
      from,
      to,
      actuals: {
        mq_total_qarshii: total,
        idilee_qarshii: 0,
        baasii: total,
        kg: totalKg,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * POST /api/subcity/daldala-a
 * Subcity submits a Daldala A report.
 * lakk_daldala_a: count entered by user — stored as count × 17400 (birr).
 */
const submitDaldalAReport = async (req, res) => {
  try {
    const {
      report_date,
      report_type,
      lakk_daldala_a, // count — stored multiplied × 17400
    } = req.body;

    if (!report_date) {
      return res.status(400).json({ message: "report_date is required." });
    }

    const { error } = await supabase.from("daldala_a_reports").insert([
      {
        user_id: req.user.id,
        username: req.user.username,
        role: req.user.role,
        report_date,
        report_type: report_type || "Daily Report",
        lakk_daldala_a: Number(lakk_daldala_a || 0) * 17400,
      },
    ]);

    if (error) return res.status(400).json({ message: error.message });
    res
      .status(201)
      .json({ message: "Daldala A report submitted successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/subcity/daldala-a?period=
 * Returns the subcity's own Daldala A actuals for the given period,
 * plus the plan target from subcity_buusaa_gonofaa_plan.daldala_a.
 */
const getSubcityDaldalA = async (req, res) => {
  try {
    const { period = "monthly" } = req.query;
    const username = req.user.username;

    const now = new Date();
    const to = now.toISOString().split("T")[0];
    const yearStart = `${now.getFullYear()}-01-01`;
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysElapsed = Math.floor((now - new Date(yearStart)) / msPerDay) + 1;

    let from;
    if (period === "daily") from = to;
    else if (period === "weekly") {
      const d = new Date(now);
      d.setDate(d.getDate() - d.getDay());
      from = d.toISOString().split("T")[0];
    } else if (period === "monthly")
      from = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
    else if (period === "quarterly") {
      const q = Math.floor(now.getMonth() / 3);
      from = `${now.getFullYear()}-${String(q * 3 + 1).padStart(2, "0")}-01`;
    } else from = yearStart;

    // Fetch period actuals
    const { data: periodData, error: periodErr } = await supabase
      .from("daldala_a_reports")
      .select("lakk_daldala_a")
      .eq("username", username)
      .gte("report_date", from)
      .lte("report_date", to);

    if (periodErr) return res.status(500).json({ message: periodErr.message });

    // Fetch YTD actuals
    const { data: ytdData, error: ytdErr } = await supabase
      .from("daldala_a_reports")
      .select("lakk_daldala_a")
      .eq("username", username)
      .gte("report_date", yearStart)
      .lte("report_date", to);

    if (ytdErr) return res.status(500).json({ message: ytdErr.message });

    const sumRows = (rows) =>
      (rows || []).reduce(
        (acc, r) => ({
          lakk_daldala_a: acc.lakk_daldala_a + Number(r.lakk_daldala_a || 0),
        }),
        { lakk_daldala_a: 0 },
      );

    const actuals = sumRows(periodData);
    const actualsYtd = sumRows(ytdData);

    // Fetch plan target from subcity_buusaa_gonofaa_plan.daldala_a
    const year = now.getFullYear();
    const { data: planData } = await supabase
      .from("subcity_buusaa_gonofaa_plan")
      .select("daldala_a")
      .eq("year", year)
      .maybeSingle();

    const target = Number(planData?.daldala_a || 0);

    res.json({
      period,
      from,
      to,
      daysElapsed,
      actuals,
      actualsYtd,
      target, // annual plan value (already stored multiplied)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllWoRedaReports,
  getWoRedaAnalysis,
  getSubcityGalii,
  submitDaldalAReport,
  getSubcityDaldalA,
};
