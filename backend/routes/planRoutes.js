const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createPlan,
  getMyPlan,
  getSummary,
  saveSubcityPlan,
  getWeredaPlan,
} = require("../controllers/planController");

// All plan routes require authentication
router.post("/", authMiddleware, createPlan);
router.get("/me", authMiddleware, getMyPlan);
router.get("/summary", authMiddleware, getSummary);

// Subcity → per-wereda tables
router.post("/subcity", authMiddleware, saveSubcityPlan);

// Wereda dashboard reads its own plan (read-only)
router.get("/wereda-plan", authMiddleware, getWeredaPlan);

module.exports = router;
