const express = require("express");
const router = express.Router();
const {
  createAnnouncement,
  getAnnouncements,
  getUnreadCount,
  markRead,
  deleteAnnouncement,
} = require("../controllers/announcementController");
const authMiddleware = require("../middleware/authMiddleware");

// All routes require auth
router.get("/", authMiddleware, getAnnouncements);
router.post("/", authMiddleware, createAnnouncement);
router.get("/unread-count", authMiddleware, getUnreadCount);
router.post("/mark-read", authMiddleware, markRead);
router.delete("/:id", authMiddleware, deleteAnnouncement);

module.exports = router;
