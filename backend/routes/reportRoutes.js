const express = require("express");
const router = express.Router();

const {
  createReport,
  submitCarraaHojiiReport,
  submitQonnaReport,
  getCarraaHojiiReports,
  getQonnaReports,
  getUserReports,
  submitRevenueReport,
  submitDaldalReport,
  submitAtkReport,
} = require("../controllers/reportController");

const authMiddleware = require("../middleware/authMiddleware");

// General reports
router.post("/", authMiddleware, createReport);

// Carraa Hojii Uummuu routes
router.post("/carraa-hojii", authMiddleware, submitCarraaHojiiReport);
router.get("/carraa-hojii/:user_id", authMiddleware, getCarraaHojiiReports);

// Qonna routes
router.post("/qonna", authMiddleware, submitQonnaReport);
router.get("/qonna/:user_id", authMiddleware, getQonnaReports);

// ─── Revenue route ─────────────────────────────────────────────────────
router.post("/revenue", authMiddleware, submitRevenueReport);

// ─── Daldala route ─────────────────────────────────────────────────────
router.post("/daldala", authMiddleware, submitDaldalReport);

// ─── ATK route ─────────────────────────────────────────────────────────
router.post("/atk", authMiddleware, submitAtkReport);

// Existing routes
router.get("/:user_id", authMiddleware, getUserReports);

module.exports = router;
