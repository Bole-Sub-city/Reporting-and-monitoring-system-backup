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
      gumaata_jirataa: req.body.gumaata_jirataa,
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
      gumaata_jirataa,
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
        gumaata_jirataa,
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
      furdisa,
      annan,
      lukkuu,
      booyyee,
      qurxummii,
      kanniissa,
      yaada_gudinaa,
    } = req.body;

    const { error } = await supabase.from("qonna").insert([
      {
        user_id: req.user.id,
        username: req.user.username,
        role: req.user.role,
        report_date,
        report_type,
        furdisa,
        annan,
        lukkuu,
        booyyee,
        qurxummii,
        kanniissa,
        yaada_gudinaa,
      },
    ]);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

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
};
