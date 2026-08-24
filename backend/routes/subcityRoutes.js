const express = require("express");
const router = express.Router();

const {
  getAllWoRedaReports,
  getWoRedaAnalysis,
} = require("../controllers/subcityReportController");

const authMiddleware = require("../middleware/authMiddleware");

// GET /api/subcity/woreda-reports?sector=&period=
// Returns all 4 woredas' summed actual report values (used by Comparison & Rank views)
router.get("/woreda-reports", authMiddleware, getAllWoRedaReports);

// GET /api/subcity/woreda-analysis?sector=&woredaId=&period=
// Returns one woreda's actuals + plan targets (used by ring charts)
router.get("/woreda-analysis", authMiddleware, getWoRedaAnalysis);

module.exports = router;
