const express = require("express");

const router = express.Router();

const {
  createReport,
  submitCarraaHojiiReport,
  submitQonnaReport,
  getCarraaHojiiReports,
  getQonnaReports,
  getUserReports,
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

// Existing routes
router.get("/:user_id", authMiddleware, getUserReports);

module.exports = router;
