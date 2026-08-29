const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  login,
  loginWithActiveCheck,
  register,
  getUsers,
  getUsersWithStatus,
  deleteUser,
  updatePassword,
  requestEditAccess,
  getEditRequests,
  getMyEditRequests,
  resolveEditRequest,
  getMyProfile,
  updateProfilePhoto,
  changeOwnPassword,
  toggleUserStatus,
  requestPlanUnlock,
  getPlanUnlockRequests,
  getMyPlanUnlockRequests,
  resolvePlanUnlockRequest,
  archiveAnnualPlans,
  updateUserDetails,
  updateMyUsername,
  getArchivedPlans,
} = require("../controllers/authController");

// Public routes
router.post("/login", loginWithActiveCheck);
router.post("/register", register);

// ─── Profile (any authenticated user) ────────────────────────────────────────
router.get("/profile", authMiddleware, getMyProfile);
router.post("/profile/photo", authMiddleware, updateProfilePhoto);
router.patch("/profile/username", authMiddleware, updateMyUsername);
router.post("/change-password", authMiddleware, changeOwnPassword);

// ─── Admin-only user management ───────────────────────────────────────────────
router.get("/users", authMiddleware, getUsersWithStatus);
router.delete("/users/:id", authMiddleware, deleteUser);
router.patch("/users/:id/password", authMiddleware, updatePassword);
router.patch("/users/:id/status", authMiddleware, toggleUserStatus);
router.patch("/users/:id/details", authMiddleware, updateUserDetails);

// ─── Report edit permission requests ─────────────────────────────────────────
router.post("/edit-requests", authMiddleware, requestEditAccess);
router.get("/edit-requests", authMiddleware, getEditRequests);
router.get("/edit-requests/mine", authMiddleware, getMyEditRequests);
router.patch("/edit-requests/:id", authMiddleware, resolveEditRequest);

// ─── Annual plan unlock requests (subcity → admin) ────────────────────────────
router.post("/plan-unlock-requests", authMiddleware, requestPlanUnlock);
router.get("/plan-unlock-requests", authMiddleware, getPlanUnlockRequests);
router.get(
  "/plan-unlock-requests/mine",
  authMiddleware,
  getMyPlanUnlockRequests,
);
router.patch(
  "/plan-unlock-requests/:id",
  authMiddleware,
  resolvePlanUnlockRequest,
);

// ─── Annual plan archive (admin only) ─────────────────────────────────────────
router.post("/archive-annual-plans", authMiddleware, archiveAnnualPlans);
router.get("/archived-plans", authMiddleware, getArchivedPlans);

module.exports = router;
