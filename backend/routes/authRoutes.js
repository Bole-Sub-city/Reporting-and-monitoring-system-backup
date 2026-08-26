const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  login,
  register,
  getUsers,
  deleteUser,
  updatePassword,
  requestEditAccess,
  getEditRequests,
  getMyEditRequests,
  resolveEditRequest,
} = require("../controllers/authController");

router.post("/login", login);
router.post("/register", register);

// Admin-only user management
router.get("/users", authMiddleware, getUsers);
router.delete("/users/:id", authMiddleware, deleteUser);
router.patch("/users/:id/password", authMiddleware, updatePassword);

// Edit permission requests
router.post("/edit-requests", authMiddleware, requestEditAccess); // wereda submits
router.get("/edit-requests", authMiddleware, getEditRequests); // admin views all
router.get("/edit-requests/mine", authMiddleware, getMyEditRequests); // wereda views own
router.patch("/edit-requests/:id", authMiddleware, resolveEditRequest); // admin approves/denies

module.exports = router;
