const supabase = require("../config/supabase");

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
      // Map frontend's "inisheetivii..." to database column "inisheetevii..."
      inisheetevii_buusaa_gonofaa: req.body.inisheetivii_buusaa_gonofaa,
      gumaata_midhaani: req.body.gumaata_midhaani,
      nyaata_barataa: req.body.nyaata_barataa,
      zayitii: req.body.zayitii,
      sukkaara: req.body.sukkaara,
      yaada_gudinaa: req.body.yaada_gudinaa,
    };

    const { error } = await supabase.from("buusaa_reports").insert([report]);

    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    res.status(201).json({
      message: "Report submitted successfully.",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
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
      gumaata_midhaani,
      nyaata_barataa,
      zayitii,
      sukkaara,
      yaada_gudinaa,
    } = req.body;

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
        // Map to the exact database column name
        inisheetevii_buusaa_gonofaa: inisheetivii_buusaa_gonofaa,
        gumaata_midhaani,
        nyaata_barataa,
        zayitii,
        sukkaara,
        yaada_gudinaa,
      },
    ]);

    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    res.status(201).json({
      message: "Report submitted successfully.",
    });
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
const getMyReports = async (req, res) => {
  try {
    const userId = req.user.id;

    const [buusaa, carraa, qonna, daldala, atk] = await Promise.all([
      supabase
        .from("buusaa_reports")
        .select("*")
        .eq("user_id", userId)
        .order("report_date", { ascending: false }),
      supabase
        .from("carraa_hojii_uumuu")
        .select("*")
        .eq("user_id", userId)
        .order("report_date", { ascending: false }),
      supabase
        .from("qonna")
        .select("*")
        .eq("user_id", userId)
        .order("report_date", { ascending: false }),
      supabase
        .from("Daldala")
        .select("*")
        .eq("user_id", userId)
        .order("report_date", { ascending: false }),
      supabase
        .from("ATK")
        .select("*")
        .eq("user_id", userId)
        .order("report_date", { ascending: false }),
    ]);

    const errors = [buusaa, carraa, qonna, daldala, atk]
      .map((r) => r.error)
      .filter(Boolean);
    if (errors.length) {
      return res.status(400).json({ message: errors[0].message });
    }

    const merged = [
      ...tagRows(buusaa.data || [], "buusaa"),
      ...tagRows(carraa.data || [], "carraaHojii"),
      ...tagRows(qonna.data || [], "qonna"),
      ...tagRows(daldala.data || [], "daldala"),
      ...tagRows(atk.data || [], "atk"),
    ].sort((a, b) => {
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

    const buildQuery = (table) => {
      let q = supabase.from(table).select("*");
      if (username) q = q.eq("username", username);
      if (report_type) q = q.eq("report_type", report_type);
      if (date_from) q = q.gte("report_date", date_from);
      if (date_to) q = q.lte("report_date", date_to);
      return q;
    };

    const sectorsToFetch =
      !sector || sector === "all"
        ? ["buusaa", "carraaHojii", "qonna", "daldala", "atk"]
        : [sector];

    const tableMap = {
      buusaa: "buusaa_reports",
      carraaHojii: "carraa_hojii_uumuu",
      qonna: "qonna",
      daldala: "Daldala",
      atk: "ATK",
    };

    const results = await Promise.all(
      sectorsToFetch.map((s) => buildQuery(tableMap[s])),
    );

    const errors = results.map((r) => r.error).filter(Boolean);
    if (errors.length) {
      return res.status(400).json({ message: errors[0].message });
    }

    const merged = sectorsToFetch
      .flatMap((s, i) => tagRows(results[i].data || [], s))
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
};
