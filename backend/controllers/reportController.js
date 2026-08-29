const supabase = require("../config/supabase");

// ─── Lock / duplicate-check helper ───────────────────────────────────────────
// Returns null if submission is allowed, or an error object { status, message }
// if it must be blocked.
// When an approved edit token exists:
//   1. The old report record for that date is DELETED so the new submission
//      replaces it cleanly (no duplicates).
//   2. The edit_request row itself is DELETED so the wereda can request again
//      in the future if needed.
async function checkSubmitLock(userId, sector, reportDate) {
  const table = {
    buusaa: "buusaa_reports",
    carraa: "carraa_hojii_uumuu",
    qonna: "qonna",
    daldala: "Daldala",
    atk: "ATK",
  }[sector];

  if (!table) return null; // unknown sector — let it through

  // 1. Check if a report already exists for this user + date
  const { data: existing } = await supabase
    .from(table)
    .select("id")
    .eq("user_id", userId)
    .eq("report_date", reportDate)
    .maybeSingle();

  if (!existing) return null; // no prior report — allow

  // 2. Report exists — check for an approved edit token
  const { data: token } = await supabase
    .from("edit_requests")
    .select("id")
    .eq("user_id", userId)
    .eq("sector", sector)
    .eq("report_date", reportDate)
    .eq("status", "approved")
    .maybeSingle();

  if (!token) {
    return {
      status: 409,
      message: `You have already submitted a report for this date. Request edit access from the admin to resubmit.`,
    };
  }

  // 3. Delete the old report record so the new INSERT replaces it cleanly
  await supabase
    .from(table)
    .delete()
    .eq("user_id", userId)
    .eq("report_date", reportDate);

  // 4. Delete the edit_request token so the wereda can request again later
  await supabase.from("edit_requests").delete().eq("id", token.id);

  return null; // allow the new submission
}

// Existing generic report creation — FIXED mapping
const createReport = async (req, res) => {
  try {
    const report = {
      user_id: req.user.id,
      username: req.user.username,
      role: req.user.role,
      report_date: req.body.report_date,
      report_type: req.body.report_type,
      hubannoo_uummuu: req.body.hubannoo_uummuu,
      horannaa_misensaa: req.body.horannaa_misensaa,
      buusi_jirataa: req.body.buusi_jirataa,
      gumaata_jiraataa: req.body.gumaata_jiraataa,
      buusi_daldalaa: req.body.buusi_daldalaa,
      buusi_daldalaa_fi_gumaataa: req.body.buusi_daldalaa_fi_gumaataa,
      inisheetevii_buusaa_gonofaa: req.body.inisheetivii_buusaa_gonofaa,
      gumaata_midhaani_tarsiimoo: req.body.gumaata_midhaani_tarsiimoo ?? 0,
      gumaata_midhaani_sardamaa: req.body.gumaata_midhaani_sardamaa ?? 0,
      nyaata_barataa: req.body.nyaata_barataa,
      zayitii: req.body.zayitii,
      sukkaara: req.body.sukkaara,
      daldala_b_group_a: req.body.daldala_b_group_a ?? 0,
      daldala_b_group_b: req.body.daldala_b_group_b ?? 0,
      yaada_gudinaa: req.body.yaada_gudinaa,
    };

    const lock = await checkSubmitLock(
      req.user.id,
      "buusaa",
      report.report_date,
    );
    if (lock) return res.status(lock.status).json({ message: lock.message });

    const { error } = await supabase.from("buusaa_reports").insert([report]);
    if (error) return res.status(400).json({ message: error.message });
    res.status(201).json({ message: "Report submitted successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Buusaa Gonofaa report — FIXED mapping
const submitBuusaaReport = async (req, res) => {
  try {
    const {
      report_date,
      report_type,
      hubannoo_uummuu,
      horannaa_misensaa,
      buusi_jirataa,
      gumaata_jiraataa,
      buusi_daldalaa,
      buusi_daldalaa_fi_gumaataa,
      inisheetivii_buusaa_gonofaa, // ← frontend sends this
      gumaata_midhaani_tarsiimoo,
      gumaata_midhaani_sardamaa,
      nyaata_barataa,
      zayitii,
      sukkaara,
      daldala_b_group_a, // already multiplied by 4200 on frontend
      daldala_b_group_b, // already multiplied by 8700 on frontend
      yaada_gudinaa,
    } = req.body;

    const lock = await checkSubmitLock(req.user.id, "buusaa", report_date);
    if (lock) return res.status(lock.status).json({ message: lock.message });

    const { error } = await supabase.from("buusaa_reports").insert([
      {
        user_id: req.user.id,
        username: req.user.username,
        role: req.user.role,
        report_date,
        report_type,
        hubannoo_uummuu,
        horannaa_misensaa,
        buusi_jirataa,
        gumaata_jiraataa,
        buusi_daldalaa,
        buusi_daldalaa_fi_gumaataa,
        inisheetevii_buusaa_gonofaa: inisheetivii_buusaa_gonofaa,
        gumaata_midhaani_tarsiimoo: gumaata_midhaani_tarsiimoo ?? 0,
        gumaata_midhaani_sardamaa: gumaata_midhaani_sardamaa ?? 0,
        nyaata_barataa,
        zayitii,
        sukkaara,
        daldala_b_group_a: daldala_b_group_a ?? 0,
        daldala_b_group_b: daldala_b_group_b ?? 0,
        yaada_gudinaa,
      },
    ]);

    if (error) return res.status(400).json({ message: error.message });
    res.status(201).json({ message: "Report submitted successfully." });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Get reports for one user
const getUserReports = async (req, res) => {
  try {
    const { user_id } = req.params;

    const { data, error } = await supabase
      .from("buusaa_reports")
      .select("*")
      .eq("user_id", user_id)
      .order("report_date", { ascending: false });

    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Carraa Hojii Uummuu report
const submitCarraaHojiiReport = async (req, res) => {
  try {
    const {
      report_date,
      report_type,
      leenjii,
      carraa_hojii_dhaabbii,
      carraa_hojii_qacarrii,
      qusannaa_haawaasaa,
      qusanna_dirqii,
      kenna_liqii,
      deebii_liqii_bilchaate,
      deebii_liqii_bulee,
      industrii_godoo,
      yaada_gudinaa,
    } = req.body;

    const lock = await checkSubmitLock(req.user.id, "carraa", report_date);
    if (lock) return res.status(lock.status).json({ message: lock.message });

    const { error } = await supabase.from("carraa_hojii_uumuu").insert([
      {
        user_id: req.user.id,
        username: req.user.username,
        role: req.user.role,
        report_date,
        report_type,
        leenjii,
        carraa_hojii_dhaabbii,
        carraa_hojii_qacarrii,
        qusannaa_haawaasaa,
        qusanna_dirqii,
        kenna_liqii,
        deebii_liqii_bilchaate,
        deebii_liqii_bulee,
        industrii_godoo,
        yaada_gudinaa,
      },
    ]);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res
      .status(201)
      .json({ message: "Carraa Hojii Uumuu report submitted successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Qonna report
const submitQonnaReport = async (req, res) => {
  try {
    const {
      report_date,
      report_type,
      furdisa_bakka_qophaawe,
      furdisa_sheedii_ijaaraman,
      furdisa_lakk_horii,
      annan_bakka_qophaawe,
      annan_sheedii_ijaaraman,
      annan_lakk_saaa,
      lukkuu_bakka_qophaawe,
      lukkuu_sheedii_ijaaraman,
      lukkuu_lakk_lukkuu,
      boyyee_bakka_qophaawe,
      boyyee_sheedii_ijaaraman,
      boyyee_lakk_booyyee,
      kannisaa_bakka_qophaawe,
      kannisaa_gaaguraa_ijaaraman,
      kannisaa_lakk_kannisaa,
      qurxummii_bakka_qophaawe,
      qurxummii_pondii_ijaaraman,
      qurxummii_lakk_qurxummii,
      yaada_gudinaa,
    } = req.body;

    const lock = await checkSubmitLock(req.user.id, "qonna", report_date);
    if (lock) return res.status(lock.status).json({ message: lock.message });

    const { error } = await supabase.from("qonna").insert([
      {
        user_id: req.user.id,
        username: req.user.username,
        role: req.user.role,
        report_date,
        report_type,
        furdisa_bakka_qophaawe,
        furdisa_sheedii_ijaaraman,
        furdisa_lakk_horii,
        annan_bakka_qophaawe,
        annan_sheedii_ijaaraman,
        annan_lakk_saaa,
        lukkuu_bakka_qophaawe,
        lukkuu_sheedii_ijaaraman,
        lukkuu_lakk_lukkuu,
        boyyee_bakka_qophaawe,
        boyyee_sheedii_ijaaraman,
        boyyee_lakk_booyyee,
        kannisaa_bakka_qophaawe,
        kannisaa_gaaguraa_ijaaraman,
        kannisaa_lakk_kannisaa,
        qurxummii_bakka_qophaawe,
        qurxummii_pondii_ijaaraman,
        qurxummii_lakk_qurxummii,
        yaada_gudinaa,
      },
    ]);

    if (error) return res.status(400).json({ message: error.message });

    res.status(201).json({ message: "Qonna report submitted successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Carraa Hojii reports for user
const getCarraaHojiiReports = async (req, res) => {
  try {
    const { user_id } = req.params;

    const { data, error } = await supabase
      .from("carraa_hojii_uumuu")
      .select("*")
      .eq("user_id", user_id)
      .order("report_date", { ascending: false });

    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Get Qonna reports for user
const getQonnaReports = async (req, res) => {
  try {
    const { user_id } = req.params;

    const { data, error } = await supabase
      .from("qonna")
      .select("*")
      .eq("user_id", user_id)
      .order("report_date", { ascending: false });

    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ─── Daldala report ──────────────────────────────────────────────────────────
const submitDaldalReport = async (req, res) => {
  try {
    const {
      report_date,
      report_type,
      galmee_haraa,
      heyyema_haraa,
      harahessaa,
      galii_daldalarra_galuu,
      toannoo_walii_gala,
      tmd,
      intarshippii,
      ggg,
      gabayaa_sanbata,
      whg_kudraa,
      whg_mudraa,
      yaada_gudinaa,
    } = req.body;

    const lock = await checkSubmitLock(req.user.id, "daldala", report_date);
    if (lock) return res.status(lock.status).json({ message: lock.message });

    const { error } = await supabase.from("Daldala").insert([
      {
        user_id: req.user.id,
        username: req.user.username,
        role: req.user.role,
        report_date,
        report_type,
        galmee_haraa,
        heyyema_haraa,
        harahessaa,
        galii_daldalarra_galuu,
        toannoo_walii_gala,
        tmd,
        intarshippii,
        ggg,
        gabayaa_sanbata,
        whg_kudraa,
        whg_mudraa,
        yaada_gudinaa,
      },
    ]);

    if (error) return res.status(400).json({ message: error.message });

    res.status(201).json({ message: "Daldala report submitted successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── ATK report ───────────────────────────────────────────────────────────────
const submitAtkReport = async (req, res) => {
  try {
    const {
      report_date,
      report_type,
      waliigaltee_pilaanii_kennuu,
      heeyyama_ijaarsaa_kennamee,
      toannoo_fi_hordoffii_gamoo,
      galii_atk_galchuu,
      yaada_gudinaa,
    } = req.body;

    const lock = await checkSubmitLock(req.user.id, "atk", report_date);
    if (lock) return res.status(lock.status).json({ message: lock.message });

    const { error } = await supabase.from("ATK").insert([
      {
        user_id: req.user.id,
        username: req.user.username,
        role: req.user.role,
        report_date,
        report_type,
        waliigaltee_pilaanii_kennuu,
        heeyyama_ijaarsaa_kennamee,
        toannoo_fi_hordoffii_gamoo,
        galii_atk_galchuu,
        yaada_gudinaa,
      },
    ]);

    if (error) return res.status(400).json({ message: error.message });

    res.status(201).json({ message: "ATK report submitted successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Revenue report ──────────────────────────────────────────────────────────
const submitRevenueReport = async (req, res) => {
  try {
    const { entries, total, report_date } = req.body;

    const user = req.user;
    const username = user?.username || "anonymous";

    const rows = entries.map((entry) => ({
      username,
      gosa_galii: entry.category,
      madda_galii: entry.source,
      baasii: entry.amount,
      guyyaa: entry.date,
      report_date,
    }));

    const { error } = await supabase.from("revenue_entries").insert(rows);

    if (error) {
      console.error("Supabase insert error:", error);
      return res
        .status(500)
        .json({ message: error.message || "Failed to submit revenue report." });
    }

    res.status(201).json({
      success: true,
      message: "Revenue report submitted successfully.",
    });
  } catch (error) {
    console.error("Revenue submit error:", error);
    res
      .status(500)
      .json({ message: error.message || "Internal server error." });
  }
};

// ─── Get ALL reports (for subcity/admin monitoring) ──────────────────────────
const getAllReports = async (req, res) => {
  try {
    const { username, report_type, date_from, date_to } = req.query;

    let query = supabase
      .from("buusaa_reports")
      .select("*")
      .order("report_date", { ascending: false });

    if (username) query = query.eq("username", username);
    if (report_type) query = query.eq("report_type", report_type);
    if (date_from) query = query.gte("report_date", date_from);
    if (date_to) query = query.lte("report_date", date_to);

    const { data, error } = await query;
    if (error) return res.status(400).json({ message: error.message });

    res.json(data || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Helper to attach a sector label to each row so the frontend can display it
function tagRows(rows, sector) {
  return rows.map((r) => ({ ...r, _sector: sector }));
}

// GET /api/reports/my-reports
// Returns all reports submitted by the currently logged-in woreda user
// across every sector table, merged and sorted newest-first.
// Supports optional query filters: sector, report_type, date_from, date_to
const getMyReports = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sector, report_type, date_from, date_to } = req.query;

    const TABLE_MAP = {
      buusaa: "buusaa_reports",
      carraaHojii: "carraa_hojii_uumuu",
      qonna: "qonna",
      daldala: "Daldala",
      atk: "ATK",
      galii: "revenue_entries",
    };

    const sectorsToFetch =
      sector && sector !== "all" && TABLE_MAP[sector]
        ? [sector]
        : Object.keys(TABLE_MAP);

    const buildQuery = (table, sectorId) => {
      let q = supabase
        .from(table)
        .select("*")
        .order(table === "revenue_entries" ? "guyyaa" : "report_date", {
          ascending: false,
        });
      // revenue_entries uses user_id indirectly via username — filter by username
      if (table === "revenue_entries") {
        q = q.eq("username", req.user.username);
        if (date_from) q = q.gte("guyyaa", date_from);
        if (date_to) q = q.lte("guyyaa", date_to);
      } else {
        q = q.eq("user_id", userId);
        if (report_type) q = q.eq("report_type", report_type);
        if (date_from) q = q.gte("report_date", date_from);
        if (date_to) q = q.lte("report_date", date_to);
      }
      return q;
    };

    const results = await Promise.all(
      sectorsToFetch.map((s) => buildQuery(TABLE_MAP[s], s)),
    );

    const errors = results.map((r) => r.error).filter(Boolean);
    if (errors.length) {
      return res.status(400).json({ message: errors[0].message });
    }

    // Normalize revenue_entries rows to match the standard report shape
    const normalizeGalii = (row) => ({
      ...row,
      report_date: row.guyyaa ?? null,
      report_type: "Daily Report (Gabaasa Guyyaa)",
    });

    const merged = sectorsToFetch
      .flatMap((s, i) => {
        const rows = results[i].data || [];
        const normalized = s === "galii" ? rows.map(normalizeGalii) : rows;
        return tagRows(normalized, s);
      })
      .sort((a, b) => {
        const da = a.report_date || a.created_at || "";
        const db = b.report_date || b.created_at || "";
        return db.localeCompare(da);
      });

    res.json(merged);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/reports/all-woreda-reports
// Returns all reports submitted by any woreda user, all sectors combined.
// Supports optional query filters: username, sector, report_type, date_from, date_to
const getAllWoredaReports = async (req, res) => {
  try {
    const { username, sector, report_type, date_from, date_to } = req.query;

    const buildQuery = (table, sectorId) => {
      let q = supabase.from(table).select("*");
      if (table === "revenue_entries") {
        if (username) q = q.eq("username", username);
        if (date_from) q = q.gte("guyyaa", date_from);
        if (date_to) q = q.lte("guyyaa", date_to);
      } else {
        if (username) q = q.eq("username", username);
        if (report_type) q = q.eq("report_type", report_type);
        if (date_from) q = q.gte("report_date", date_from);
        if (date_to) q = q.lte("report_date", date_to);
      }
      return q;
    };

    const sectorsToFetch =
      !sector || sector === "all"
        ? ["buusaa", "carraaHojii", "qonna", "galii", "daldala", "atk"]
        : [sector];

    const tableMap = {
      buusaa: "buusaa_reports",
      carraaHojii: "carraa_hojii_uumuu",
      qonna: "qonna",
      galii: "revenue_entries",
      daldala: "Daldala",
      atk: "ATK",
    };

    const results = await Promise.all(
      sectorsToFetch.map((s) => buildQuery(tableMap[s], s)),
    );

    const errors = results.map((r) => r.error).filter(Boolean);
    if (errors.length) {
      return res.status(400).json({ message: errors[0].message });
    }

    const normalizeGalii = (row) => ({
      ...row,
      report_date: row.guyyaa ?? null,
      report_type: "Daily Report (Gabaasa Guyyaa)",
    });

    const merged = sectorsToFetch
      .flatMap((s, i) => {
        const rows = results[i].data || [];
        const normalized = s === "galii" ? rows.map(normalizeGalii) : rows;
        return tagRows(normalized, s);
      })
      .sort((a, b) => {
        const da = a.report_date || a.created_at || "";
        const db = b.report_date || b.created_at || "";
        return db.localeCompare(da);
      });

    res.json(merged);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── GET /reports/lock-status?date=YYYY-MM-DD ────────────────────────────────
// Returns which sectors are already submitted for the given date by this user
const getLockStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const date = req.query.date || new Date().toISOString().split("T")[0];

    const SECTOR_TABLES = {
      buusaa: "buusaa_reports",
      carraa: "carraa_hojii_uumuu",
      qonna: "qonna",
      daldala: "Daldala",
      atk: "ATK",
    };

    const results = {};
    for (const [sector, table] of Object.entries(SECTOR_TABLES)) {
      const { data } = await supabase
        .from(table)
        .select("id")
        .eq("user_id", userId)
        .eq("report_date", date)
        .maybeSingle();
      results[sector] = !!data;
    }

    res.json({ locked: results, date });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createReport,
  submitBuusaaReport,
  getUserReports,
  submitCarraaHojiiReport,
  submitQonnaReport,
  getCarraaHojiiReports,
  getQonnaReports,
  submitRevenueReport,
  submitDaldalReport,
  submitAtkReport,
  getAllReports,
  getMyReports,
  getAllWoredaReports,
  getLockStatus,
};
