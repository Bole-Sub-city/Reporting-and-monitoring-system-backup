const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  login,
  register,
  getUsers,
  deleteUser,
  updatePassword,
} = require("../controllers/authController");

router.post("/login", login);
router.post("/register", register);

// Admin-only user management
router.get("/users", authMiddleware, getUsers);
router.delete("/users/:id", authMiddleware, deleteUser);
router.patch("/users/:id/password", authMiddleware, updatePassword);

module.exports = router;
