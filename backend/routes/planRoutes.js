const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createPlan,
  getMyPlan,
  getSummary,
  saveSubcityPlan,
  getWeredaPlan,
  saveSubcityOwnPlan,
  fetchSubcityOwnPlan,
  saveSubcityQonnaPlan,
  fetchSubcityQonnaPlan,
  getWeredaQonnaPlan,
} = require("../controllers/planController");

// All plan routes require authentication
router.post("/", authMiddleware, createPlan);
router.get("/me", authMiddleware, getMyPlan);
router.get("/summary", authMiddleware, getSummary);

// Subcity → per-wereda tables (proportional split)
router.post("/subcity", authMiddleware, saveSubcityPlan);

// Subcity's own annual plan table
router.post("/subcity-plan", authMiddleware, saveSubcityOwnPlan);
router.get("/subcity-plan", authMiddleware, fetchSubcityOwnPlan);

// Wereda dashboard reads its own plan (read-only)
router.get("/wereda-plan", authMiddleware, getWeredaPlan);

// Subcity Qonna plan — save to subcity table + distribute to 4 wereda tables
router.post("/subcity-qonna-plan", authMiddleware, saveSubcityQonnaPlan);
router.get("/subcity-qonna-plan", authMiddleware, fetchSubcityQonnaPlan);

// Wereda reads its own Qonna plan (read-only)
router.get("/wereda-qonna-plan", authMiddleware, getWeredaQonnaPlan);

module.exports = router;
