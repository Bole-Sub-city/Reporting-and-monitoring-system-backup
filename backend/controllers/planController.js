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
        "hubannoo_uummuu, horannaa_misensaa, buusi_jirataa, buusi_daldalaa, report_date"
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

module.exports = { createPlan, getMyPlan, getSummary };
