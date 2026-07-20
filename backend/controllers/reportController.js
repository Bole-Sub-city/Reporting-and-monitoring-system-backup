const supabase = require("../config/supabase");

// Existing generic report creation
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
      buusi_daldalaa: req.body.buusi_daldalaa,
      buusi_daldalaa_fi_gumaataa: req.body.buusi_daldalaa_fi_gumaataa,
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

// Buusaa Gonofaa report
const submitBuusaaReport = async (req, res) => {
  try {
    const {
      user_id,
      report_date,
      report_type,
      hubannoo_uummuu,
      horannaa_misensaa,
      buusi_jirataa,
      buusi_daldalaa,
      buusi_daldalaa_fi_gumaataa,
      gumaata_midhaani,
      nyaata_barataa,
      zayitii,
      sukkaara,
      yaada_gudinaa,
    } = req.body;

    const { error } = await supabase.from("buusaa_reports").insert([
      {
        user_id,
        report_date,
        report_type,
        hubannoo_uummuu,
        horannaa_misensaa,
        buusi_jirataa,
        buusi_daldalaa,
        buusi_daldalaa_fi_gumaataa,
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

module.exports = {
  createReport,
  submitBuusaaReport,
  getUserReports,
};
