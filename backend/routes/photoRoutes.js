const express = require("express");
const router = express.Router();
const {
  submitPhoto,
  getMyPhotos,
  getAllPhotos,
  getLatestPerWoreda,
  deletePhoto,
} = require("../controllers/photoController");
const authMiddleware = require("../middleware/authMiddleware");

// All routes require authentication
// GET /api/photos/my          — woreda: own photo history (with optional date filters)
// GET /api/photos/latest      — subcity/admin: most recent photo per woreda
// GET /api/photos             — subcity/admin: all photos (with optional woreda_id + date filters)
// POST /api/photos            — woreda: submit a new photo + description
// DELETE /api/photos/:id      — woreda (own) or admin: delete a photo

router.get("/my",     authMiddleware, getMyPhotos);
router.get("/latest", authMiddleware, getLatestPerWoreda);
router.get("/",       authMiddleware, getAllPhotos);
router.post("/",      authMiddleware, submitPhoto);
router.delete("/:id", authMiddleware, deletePhoto);

module.exports = router;
