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
        "hubannoo_uummuu, horannaa_misensaa, buusi_jirataa, buusi_daldalaa, report_date",
      )
      .eq("user_id", user_id)
      .gte("report_date", from)
      .lte("report_date", to);

    const { data, error } = await query;

    if (error) return res.status(400).json({ message: error.message });

    // Sum up each field
    const summary = {
      hubannoo_uummuu: 0,
      horannaa_misensaa: 0,
      buusi_jirataa: 0,
      buusi_daldalaa: 0,
    };

    (data || []).forEach((row) => {
      summary.hubannoo_uummuu += Number(row.hubannoo_uummuu || 0);
      summary.horannaa_misensaa += Number(row.horannaa_misensaa || 0);
      summary.buusi_jirataa += Number(row.buusi_jirataa || 0);
      summary.buusi_daldalaa += Number(row.buusi_daldalaa || 0);
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
 * Receives { plan: { hubannoo_uummuu, horannaa_misensaa, buusi_jirataa, buusi_daldalaa },
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
        buusi_jirataa_target: share(wId, plan.buusi_jirataa),
        buusi_daldalaa_target: share(wId, plan.buusi_daldalaa),
      };

      // Upsert: overwrite existing row for the same year so subcity can
      // update the plan freely. conflict_target = year column.
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
    const year = new Date().getFullYear();

    const { data, error } = await supabase
      .from(tableName)
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
 * POST /api/plans/subcity-plan
 * Saves the subcity's own annual plan totals + weights into the
 * "subcity_annual_plan" table. Upserts on year so the form can be
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

    const { error } = await supabase.from("subcity_annual_plan").upsert(
      [
        {
          year,
          hubannoo_uummuu: Number(plan.hubannoo_uummuu || 0),
          horannaa_misensaa: Number(plan.horannaa_misensaa || 0),
          buusi_jirataa: Number(plan.buusi_jirataa || 0),
          buusi_daldalaa: Number(plan.buusi_daldalaa || 0),
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
      .from("subcity_annual_plan")
      .select("*")
      .eq("year", year)
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
};
