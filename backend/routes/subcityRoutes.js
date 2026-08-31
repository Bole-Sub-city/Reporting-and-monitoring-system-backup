const express = require("express");
const router = express.Router();

const {
  getAllWoRedaReports,
  getWoRedaAnalysis,
  getSubcityGalii,
  submitDaldalAReport,
  getSubcityDaldalA,
} = require("../controllers/subcityReportController");

const authMiddleware = require("../middleware/authMiddleware");

// GET /api/subcity/woreda-reports?sector=&period=
router.get("/woreda-reports", authMiddleware, getAllWoRedaReports);

// GET /api/subcity/woreda-analysis?sector=&woredaId=&period=
router.get("/woreda-analysis", authMiddleware, getWoRedaAnalysis);

// GET /api/subcity/subcity-galii?period=
router.get("/subcity-galii", authMiddleware, getSubcityGalii);

// POST /api/subcity/daldala-a — subcity submits a Daldala A report
router.post("/daldala-a", authMiddleware, submitDaldalAReport);

// GET /api/subcity/daldala-a?period= — subcity fetches own Daldala A actuals + plan target
router.get("/daldala-a", authMiddleware, getSubcityDaldalA);

module.exports = router;
