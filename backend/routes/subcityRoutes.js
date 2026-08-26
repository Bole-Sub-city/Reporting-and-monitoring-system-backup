const express = require("express");
const router = express.Router();

const {
  getAllWoRedaReports,
  getWoRedaAnalysis,
  getSubcityGalii,
} = require("../controllers/subcityReportController");

const authMiddleware = require("../middleware/authMiddleware");

// GET /api/subcity/woreda-reports?sector=&period=
// Returns all 4 woredas' summed actual report values (used by Comparison & Rank views)
router.get("/woreda-reports", authMiddleware, getAllWoRedaReports);

// GET /api/subcity/woreda-analysis?sector=&woredaId=&period=
// Returns one woreda's actuals + plan targets (used by ring charts)
router.get("/woreda-analysis", authMiddleware, getWoRedaAnalysis);

// GET /api/subcity/subcity-galii?period=
// Returns the subcity's own Galii Sassaabu (revenue) actuals for the period
router.get("/subcity-galii", authMiddleware, getSubcityGalii);

module.exports = router;
