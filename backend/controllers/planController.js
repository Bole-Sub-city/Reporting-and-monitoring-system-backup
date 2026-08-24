const supabase = require("../config/supabase");

/**
 * POST /api/plans
 * Create a new annual plan for the logged-in woreda user.
 * One plan per user per year — locked after creation.
 */
const createPlan = async (req, res) => {
  try {
    const user_id = req.user.id;
    const year = new Date().getFullYear();

    // Check if a plan already exists for this user+year
    const { data: existing, error: fetchErr } = await supabase
      .from("annual_plans")
      .select("id")
      .eq("user_id", user_id)
      .eq("year", year)
      .single();

    if (fetchErr && fetchErr.code !== "PGRST116") {
      // PGRST116 = "no rows returned" — that's fine
      return res.status(400).json({ message: fetchErr.message });
    }

    if (existing) {
      return res
        .status(409)
        .json({ message: "Annual plan already submitted and locked." });
    }

    const {
      hubannoo_uummuu_target,
      horannaa_misensaa_target,
      buusi_jirataa_target,
      buusi_daldalaa_target,
    } = req.body;

    const { error } = await supabase.from("annual_plans").insert([
      {
        user_id,
        year,
        hubannoo_uummuu_target: Number(hubannoo_uummuu_target || 0),
        horannaa_misensaa_target: Number(horannaa_misensaa_target || 0),
        buusi_jirataa_target: Number(buusi_jirataa_target || 0),
        buusi_daldalaa_target: Number(buusi_daldalaa_target || 0),
      },
    ]);

    if (error) return res.status(400).json({ message: error.message });

    res.status(201).json({ message: "Annual plan saved successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/plans/me
 * Get the current year's plan for the logged-in user.
 */
const getMyPlan = async (req, res) => {
  try {
    const user_id = req.user.id;
    const year = new Date().getFullYear();

    const { data, error } = await supabase
      .from("annual_plans")
      .select("*")
      .eq("user_id", user_id)
      .eq("year", year)
      .single();

    if (error && error.code === "PGRST116") {
      return res.status(200).json({ plan: null });
    }
    if (error) return res.status(400).json({ message: error.message });

    res.json({ plan: data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/plans/summary
 * Get actual sums from buusaa_reports for the logged-in user,
 * filtered by period: daily | weekly | monthly | quarterly | annual
 */
const getSummary = async (req, res) => {
  try {
    const user_id = req.user.id;
    const period = req.query.period || "annual"; // daily|weekly|monthly|quarterly|annual

    const now = new Date();
    let from = null;
    let to = now.toISOString().split("T")[0];

    if (period === "daily") {
      from = to; // today only
    } else if (period === "weekly") {
      const d = new Date(now);
      d.setDate(d.getDate() - d.getDay()); // start of week (Sunday)
      from = d.toISOString().split("T")[0];
    } else if (period === "monthly") {
      from = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
    } else if (period === "quarterly") {
      const q = Math.floor(now.getMonth() / 3);
      from = `${now.getFullYear()}-${String(q * 3 + 1).padStart(2, "0")}-01`;
    } else {
      // annual
      from = `${now.getFullYear()}-01-01`;
    }

    let query = supabase
      .from("buusaa_reports")
      .select(
        "hubannoo_uummuu, horannaa_misensaa, buusi_jirataa, gumaata_jiraataa, buusi_daldalaa, buusi_daldalaa_fi_gumaataa, inisheetevii_buusaa_gonofaa, gumaata_midhaani, nyaata_barataa, zayitii, sukkaara, report_date",
      )
      .eq("user_id", user_id)
      .gte("report_date", from)
      .lte("report_date", to);

    const { data, error } = await query;

    if (error) return res.status(400).json({ message: error.message });

    // Sum up each field — keys must exactly match PLAN_FIELDS keys in frontend
    const summary = {
      hubannoo_uummuu: 0,
      horannaa_misensaa: 0,
      buusi_jiraataa: 0,
      gumaata_jiraataa: 0,
      buusi_daldalaa: 0,
      inisheetivii_buusaa_gonofaa: 0,
      gumaata_mootummaa: 0,
      nyaata_barataa: 0,
      sukkaara: 0,
      zayitii: 0,
    };

    (data || []).forEach((row) => {
      summary.hubannoo_uummuu += Number(row.hubannoo_uummuu || 0);
      summary.horannaa_misensaa += Number(row.horannaa_misensaa || 0);
      // report col is buusi_jirataa; PLAN_FIELDS key is buusi_jiraataa
      summary.buusi_jiraataa += Number(row.buusi_jirataa || 0);
      summary.gumaata_jiraataa += Number(row.gumaata_jiraataa || 0);
      // combine both daldalaa fields under the single PLAN_FIELDS key
      summary.buusi_daldalaa +=
        Number(row.buusi_daldalaa || 0) +
        Number(row.buusi_daldalaa_fi_gumaataa || 0);
      // DB stores as inisheetevii_ (one i); frontend key is inisheetivii_
      summary.inisheetivii_buusaa_gonofaa += Number(
        row.inisheetevii_buusaa_gonofaa || 0,
      );
      // DB stores as gumaata_midhaani; PLAN_FIELDS key is gumaata_mootummaa
      summary.gumaata_mootummaa += Number(row.gumaata_midhaani || 0);
      summary.nyaata_barataa += Number(row.nyaata_barataa || 0);
      summary.sukkaara += Number(row.sukkaara || 0);
      summary.zayitii += Number(row.zayitii || 0);
    });

    res.json({ summary, period, from, to });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Maps frontend woreda IDs (w1–w4) to their Supabase table names
const WEREDA_TABLE_MAP = {
  w1: "annual_plan_wereda_1",
  w2: "annual_plan_wereda_2",
  w3: "annual_plan_wereda_3",
  w4: "annual_plan_wereda_4",
};

// Maps wereda usernames to their frontend IDs so the wereda dashboard
// knows which table to read from
const USERNAME_TO_WEREDA_ID = {
  "Aanaa Gooroo": "w1",
  "Aanaa Dhadacha Araaraa": "w2",
  "Aanaa Dhakaa Adii": "w3",
  "Aanaa Andoodee": "w4",
};

/**
 * POST /api/plans/subcity
 * Called by the subcity dashboard "Save Plan" button.
 * Receives { plan: { hubannoo_uummuu, horannaa_misensaa, buusi_jiraataa,
 *                    gumaata_jiraataa, buusi_daldalaa, inisheetiviiBuusaaGonofaa,
 *                    gumaata_mootummaa, nyaata_barataa },
 *            weights: { w1, w2, w3, w4 } }
 * Computes each wereda's proportional share and upserts a row into the
 * corresponding annual_plan_wereda_N table.
 */
const saveSubcityPlan = async (req, res) => {
  try {
    const { plan, weights } = req.body;

    if (!plan || !weights) {
      return res
        .status(400)
        .json({ message: "plan and weights are required." });
    }

    const year = new Date().getFullYear();

    const totalWeight = ["w1", "w2", "w3", "w4"].reduce(
      (s, id) => s + Number(weights[id] || 0),
      0,
    );

    const share = (woredaId, categoryTotal) => {
      const w = Number(weights[woredaId] || 0);
      if (totalWeight === 0 || w === 0)
        return Math.round(Number(categoryTotal || 0) / 4);
      return Math.round((w / totalWeight) * Number(categoryTotal || 0));
    };

    const errors = [];

    for (const wId of ["w1", "w2", "w3", "w4"]) {
      const tableName = WEREDA_TABLE_MAP[wId];
      const row = {
        year,
        hubannoo_uummuu_target: share(wId, plan.hubannoo_uummuu),
        horannaa_misensaa_target: share(wId, plan.horannaa_misensaa),
        buusi_jiraataa_target: share(wId, plan.buusi_jiraataa),
        gumaata_jiraataa_target: share(wId, plan.gumaata_jiraataa),
        buusi_daldalaa_target: share(wId, plan.buusi_daldalaa),
        inisheetivii_buusaa_gonofaa_target: share(
          wId,
          plan.inisheetivii_buusaa_gonofaa ?? plan.inisheetiviiBuusaaGonofaa,
        ),
        gumaata_mootummaa_target: share(wId, plan.gumaata_mootummaa),
        nyaata_barataa_target: share(wId, plan.nyaata_barataa),
        sukkaara_target: share(wId, plan.sukkaara),
        zayitii_target: share(wId, plan.zayitii),
      };

      const { error } = await supabase
        .from(tableName)
        .upsert([row], { onConflict: "year" });

      if (error) errors.push(`${tableName}: ${error.message}`);
    }

    if (errors.length) {
      return res.status(400).json({ message: errors.join(" | ") });
    }

    res.status(200).json({ message: "Plan saved to all 4 wereda tables." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/plans/wereda-plan
 * Called by the wereda dashboard to fetch its own plan (read-only).
 * Identifies the correct table from the logged-in user's username.
 */
const getWeredaPlan = async (req, res) => {
  try {
    const username = req.user.username;
    const wId = USERNAME_TO_WEREDA_ID[username];

    if (!wId) {
      return res
        .status(403)
        .json({ message: "Not a recognised wereda account." });
    }

    const tableName = WEREDA_TABLE_MAP[wId];

    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .order("year", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) return res.status(400).json({ message: error.message });

    res.json({ plan: data || null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * POST /api/plans/subcity-plan
 * Saves the subcity's own annual plan totals + weights into the
 * "subcity_buusaa_gonofaa_plan" table. Upserts on year so the form can be
 * re-submitted freely (not locked).
 */
const saveSubcityOwnPlan = async (req, res) => {
  try {
    const { plan, weights } = req.body;

    if (!plan || !weights) {
      return res
        .status(400)
        .json({ message: "plan and weights are required." });
    }

    const year = new Date().getFullYear();

    const { error } = await supabase.from("subcity_buusaa_gonofaa_plan").upsert(
      [
        {
          year,
          hubannoo_uummuu: Number(plan.hubannoo_uummuu || 0),
          horannaa_misensaa: Number(plan.horannaa_misensaa || 0),
          buusi_jiraataa: Number(plan.buusi_jiraataa || 0),
          gumaata_jirataa: Number(plan.gumaata_jiraataa || plan.gumaata_jirataa || 0),
          buusi_daldalaa: Number(plan.buusi_daldalaa || 0),
          inisheetivii_buusaa_gonofaa: Number(
            plan.inisheetivii_buusaa_gonofaa ??
              plan.inisheetiviiBuusaaGonofaa ??
              0,
          ),
          gumaata_mootummaa: Number(plan.gumaata_mootummaa || 0),
          nyaata_barataa: Number(plan.nyaata_barataa || 0),
          sukkaara: Number(plan.sukkaara || 0),
          zayitii: Number(plan.zayitii || 0),
          weight_w1: Number(weights.w1 || 0),
          weight_w2: Number(weights.w2 || 0),
          weight_w3: Number(weights.w3 || 0),
          weight_w4: Number(weights.w4 || 0),
        },
      ],
      { onConflict: "year" },
    );

    if (error) return res.status(400).json({ message: error.message });

    res.status(200).json({ message: "Subcity plan saved." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/plans/subcity-plan
 * Returns the current year's subcity annual plan row.
 */
const fetchSubcityOwnPlan = async (req, res) => {
  try {
    const year = new Date().getFullYear();

    const { data, error } = await supabase
      .from("subcity_buusaa_gonofaa_plan")
      .select("*")
      .eq("year", year)
      .maybeSingle();

    if (error) return res.status(400).json({ message: error.message });

    res.json({ plan: data || null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Woreda qonna plan tables — one per woreda
const WEREDA_QONNA_TABLE_MAP = {
  w1: "annual_qonna_plan_wereda_1",
  w2: "annual_qonna_plan_wereda_2",
  w3: "annual_qonna_plan_wereda_3",
  w4: "annual_qonna_plan_wereda_4",
};

// The 3 fields per category that get distributed to each wereda
// (subcity-only fields hektaara_* and lakkPer_* are NOT distributed)
const QONNA_DISTRIBUTED_FIELDS = [
  "furdisa_qophi_lafa",
  "furdisa_lakk_sheedii",
  "furdisa_lakk_horii_waliigalaa",
  "annan_qophi_lafa",
  "annan_lakk_sheedii",
  "annan_lakk_saa_waliigalaa",
  "lukkuu_qophi_lafa",
  "lukkuu_lakk_sheedii",
  "lukkuu_lakk_lukkuu_waliigalaa",
  "booyee_qophi_lafa",
  "booyee_lakk_sheedii",
  "booyee_lakk_booyyee_waliigalaa",
  "kannisaa_qophi_lafa",
  "kannisaa_lakk_gaaguraa",
  "kannisaa_lakk_kannisaa_waliigalaa",
  "qurxummii_qophi_lafa",
  "qurxummii_lakk_pondii",
  "qurxummii_lakk_qurxummii_waliigalaa",
];

/**
 * POST /api/plans/subcity-qonna-plan
 * Saves the subcity Qonna plan to subcity_qonna_plan (all fields)
 * and distributes the 3 displayable fields per category to each wereda table.
 */
const saveSubcityQonnaPlan = async (req, res) => {
  try {
    const { planData, weights } = req.body;

    if (!planData || !weights) {
      return res
        .status(400)
        .json({ message: "planData and weights are required." });
    }

    const year = new Date().getFullYear();

    // 1. Save full plan to subcity table (all fields including subcity-only ones)
    const { error: subcityErr } = await supabase
      .from("subcity_qonna_plan")
      .upsert([{ year, ...planData }], { onConflict: "year" });

    if (subcityErr)
      return res.status(400).json({ message: subcityErr.message });

    // 2. Distribute the 3 per-category fields to each wereda table
    const totalWeight = ["w1", "w2", "w3", "w4"].reduce(
      (s, id) => s + Number(weights[id] || 0),
      0,
    );

    const share = (woredaId, val) => {
      const w = Number(weights[woredaId] || 0);
      if (totalWeight === 0 || w === 0) return Math.round(Number(val || 0) / 4);
      return Math.round((w / totalWeight) * Number(val || 0));
    };

    const errors = [];
    for (const wId of ["w1", "w2", "w3", "w4"]) {
      const row = { year };
      QONNA_DISTRIBUTED_FIELDS.forEach((field) => {
        row[`${field}_target`] = share(wId, planData[field] || 0);
      });

      const { error } = await supabase
        .from(WEREDA_QONNA_TABLE_MAP[wId])
        .upsert([row], { onConflict: "year" });

      if (error)
        errors.push(`${WEREDA_QONNA_TABLE_MAP[wId]}: ${error.message}`);
    }

    if (errors.length)
      return res.status(400).json({ message: errors.join(" | ") });

    res.status(200).json({
      message: "Qonna plan saved to subcity and all 4 wereda tables.",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/plans/subcity-qonna-plan
 * Returns the current year's subcity Qonna plan.
 */
const fetchSubcityQonnaPlan = async (req, res) => {
  try {
    const year = new Date().getFullYear();
    const { data, error } = await supabase
      .from("subcity_qonna_plan")
      .select("*")
      .eq("year", year)
      .maybeSingle();

    if (error) return res.status(400).json({ message: error.message });
    res.json({ plan: data || null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/plans/wereda-qonna-plan
 * Returns the current year's Qonna plan for the logged-in wereda (read-only).
 */
const getWeredaQonnaPlan = async (req, res) => {
  try {
    const username = req.user.username;
    const wId = USERNAME_TO_WEREDA_ID[username];

    if (!wId)
      return res
        .status(403)
        .json({ message: "Not a recognised wereda account." });

    const { data, error } = await supabase
      .from(WEREDA_QONNA_TABLE_MAP[wId])
      .select("*")
      .order("year", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) return res.status(400).json({ message: error.message });
    res.json({ plan: data || null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Generic sector plan tables ──────────────────────────────────────────────
// Covers: carraa (Carraa Hojii), daldala (Daldala), atk (ATK), galii (Revenue)

const GENERIC_SECTOR_SUBCITY_TABLE = {
  carraa: "subcity_carraa_plan",
  daldala: "subcity_daldala_plan",
  atk: "subcity_atk_plan",
  galii: "subcity_galii_plan",
};

const GENERIC_SECTOR_WEREDA_TABLE = {
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

// Explicit field lists per sector — only these keys are written to the DB.
// This prevents cross-sector field pollution when form sends extra keys.
const GENERIC_SECTOR_FIELDS = {
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
  galii: ["galii_idilee", "galii_mana_qophessaa", "waliigala_galii"],
};

/**
 * POST /api/plans/subcity-generic-plan
 * Save any sector's subcity plan + distribute to 4 wereda tables.
 * Body: { sector, totals: { field: value, ... }, weights: { w1, w2, w3, w4 } }
 */
const saveSubcityGenericPlan = async (req, res) => {
  try {
    const { sector, totals, weights } = req.body;
    if (!sector || !GENERIC_SECTOR_SUBCITY_TABLE[sector]) {
      return res.status(400).json({ message: `Unknown sector: ${sector}` });
    }
    if (!totals || !weights) {
      return res
        .status(400)
        .json({ message: "totals and weights are required." });
    }

    const year = new Date().getFullYear();
    const allowedFields = GENERIC_SECTOR_FIELDS[sector];

    // 1. Save to subcity table — only allowed fields for this sector
    const subcityRow = { year };
    allowedFields.forEach((f) => {
      subcityRow[f] = Number(totals[f] || 0);
    });
    subcityRow.weight_w1 = Number(weights.w1 || 0);
    subcityRow.weight_w2 = Number(weights.w2 || 0);
    subcityRow.weight_w3 = Number(weights.w3 || 0);
    subcityRow.weight_w4 = Number(weights.w4 || 0);

    const { error: subcityErr } = await supabase
      .from(GENERIC_SECTOR_SUBCITY_TABLE[sector])
      .upsert([subcityRow], { onConflict: "year" });

    if (subcityErr)
      return res.status(400).json({ message: subcityErr.message });

    // 2. Distribute to 4 wereda tables — only allowed fields, suffixed _target
    const totalWeight = ["w1", "w2", "w3", "w4"].reduce(
      (s, id) => s + Number(weights[id] || 0),
      0,
    );
    const share = (wId, val) => {
      const w = Number(weights[wId] || 0);
      if (totalWeight === 0 || w === 0) return Math.round(Number(val || 0) / 4);
      return Math.round((w / totalWeight) * Number(val || 0));
    };

    const errors = [];
    for (const wId of ["w1", "w2", "w3", "w4"]) {
      const wRow = { year };
      allowedFields.forEach((field) => {
        wRow[`${field}_target`] = share(wId, totals[field] || 0);
      });
      const { error } = await supabase
        .from(GENERIC_SECTOR_WEREDA_TABLE[sector][wId])
        .upsert([wRow], { onConflict: "year" });
      if (error)
        errors.push(
          `${GENERIC_SECTOR_WEREDA_TABLE[sector][wId]}: ${error.message}`,
        );
    }

    if (errors.length)
      return res.status(400).json({ message: errors.join(" | ") });

    res.status(200).json({ message: `${sector} plan saved.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/plans/subcity-generic-plan?sector=carraa|daldala|atk|galii
 * Returns the current year's subcity plan for the given sector.
 */
const fetchSubcityGenericPlan = async (req, res) => {
  try {
    const sector = req._sector || req.query.sector;
    if (!sector || !GENERIC_SECTOR_SUBCITY_TABLE[sector]) {
      return res.status(400).json({ message: `Unknown sector: ${sector}` });
    }
    const { data, error } = await supabase
      .from(GENERIC_SECTOR_SUBCITY_TABLE[sector])
      .select("*")
      .order("year", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) return res.status(400).json({ message: error.message });
    res.json({ plan: data || null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/plans/wereda-generic-plan?sector=carraa|daldala|atk|galii
 * Returns the current year's plan for the logged-in wereda (read-only).
 */
const getWeredaGenericPlan = async (req, res) => {
  try {
    // Support both req._sector (set by dedicated routes) and req.query.sector
    const sector = req._sector || req.query.sector;
    if (!sector || !GENERIC_SECTOR_WEREDA_TABLE[sector]) {
      return res.status(400).json({ message: `Unknown sector: ${sector}` });
    }
    const username = req.user.username;
    const wId = USERNAME_TO_WEREDA_ID[username];
    if (!wId)
      return res
        .status(403)
        .json({ message: "Not a recognised wereda account." });

    const { data, error } = await supabase
      .from(GENERIC_SECTOR_WEREDA_TABLE[sector][wId])
      .select("*")
      .order("year", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) return res.status(400).json({ message: error.message });
    res.json({ plan: data || null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createPlan,
  getMyPlan,
  getSummary,
  saveSubcityPlan,
  getWeredaPlan,
  saveSubcityOwnPlan,
  fetchSubcityOwnPlan,
  saveSubcityQonnaPlan,
  fetchSubcityQonnaPlan,
  getWeredaQonnaPlan,
  saveSubcityGenericPlan,
  fetchSubcityGenericPlan,
  getWeredaGenericPlan,
};
