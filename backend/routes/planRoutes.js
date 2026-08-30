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
  saveSubcityGenericPlan,
  fetchSubcityGenericPlan,
  getWeredaGenericPlan,
  saveSubcityGaliiPlan,
  fetchSubcityGaliiPlan,
  getWeredaGaliiPlan,
  getSubcityLivePlans,
} = require("../controllers/planController");

// All plan routes require authentication
router.post("/", authMiddleware, createPlan);
router.get("/me", authMiddleware, getMyPlan);
router.get("/summary", authMiddleware, getSummary);

// Subcity → per-wereda tables (proportional split — Buusaa Gonofaa)
router.post("/subcity", authMiddleware, saveSubcityPlan);

// Subcity's own annual plan table (Buusaa Gonofaa)
router.post("/subcity-plan", authMiddleware, saveSubcityOwnPlan);
router.get("/subcity-plan", authMiddleware, fetchSubcityOwnPlan);

// Wereda dashboard reads its own plan (read-only)
router.get("/wereda-plan", authMiddleware, getWeredaPlan);

// Subcity Qonna plan — save to subcity table + distribute to 4 wereda tables
router.post("/subcity-qonna-plan", authMiddleware, saveSubcityQonnaPlan);
router.get("/subcity-qonna-plan", authMiddleware, fetchSubcityQonnaPlan);

// Wereda reads its own Qonna plan (read-only)
router.get("/wereda-qonna-plan", authMiddleware, getWeredaQonnaPlan);

// Generic sector plans (carraa, daldala, atk) — direct per-woreda entry
router.post("/subcity-generic-plan", authMiddleware, saveSubcityGenericPlan);
router.get("/subcity-generic-plan", authMiddleware, fetchSubcityGenericPlan);
router.get("/wereda-generic-plan", authMiddleware, getWeredaGenericPlan);

// Galii Sassabu plan — direct per-woreda entry (separate from generic)
router.post("/subcity-galii-plan", authMiddleware, saveSubcityGaliiPlan);
router.get("/subcity-galii-plan", authMiddleware, fetchSubcityGaliiPlan);
router.get("/wereda-galii-plan", authMiddleware, getWeredaGaliiPlan);

// Dedicated wereda plan routes for each sector (avoids req.query mutation issue in Express 5)
router.get("/wereda-daldala-plan", authMiddleware, (req, res) => {
  req._sector = "daldala";
  getWeredaGenericPlan(req, res);
});
router.get("/wereda-atk-plan", authMiddleware, (req, res) => {
  req._sector = "atk";
  getWeredaGenericPlan(req, res);
});
// /wereda-revenue-plan now served by getWeredaGaliiPlan
router.get("/wereda-revenue-plan", authMiddleware, getWeredaGaliiPlan);
router.get("/wereda-carraa-plan", authMiddleware, (req, res) => {
  req._sector = "carraa";
  getWeredaGenericPlan(req, res);
});

// Subcity live plan data for any year (used by History tab)
router.get("/subcity-live-plans", authMiddleware, getSubcityLivePlans);

module.exports = router;
