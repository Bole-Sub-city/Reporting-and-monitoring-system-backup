const supabase = require("../config/supabase");

// ─── Woreda ID map (username → woreda id + name) ─────────────────────────────
// Must match the frontend USERNAME_TO_WOREDA_ID map in woredadashboard.jsx
const USERNAME_TO_WOREDA = {
  "Aanaa Gooroo":           { id: "w1", name: "Aanaa Gooroo" },
  "Aanaa Dhadacha Araaraa": { id: "w2", name: "Aanaa Dhadacha Araaraa" },
  "Aanaa Dhakaa Adii":      { id: "w3", name: "Aanaa Dhakaa Adii" },
  "Aanaa Andoodee":         { id: "w4", name: "Aanaa Andoodee" },
};

// Fallback: derive woreda from role = "wereda" if username not in map
function resolveWoreda(user) {
  if (USERNAME_TO_WOREDA[user.username]) return USERNAME_TO_WOREDA[user.username];
  // Unknown woreda username — return null so controller can reject
  return null;
}

// ─── POST /api/photos  ────────────────────────────────────────────────────────
// Woreda submits a photo with a description.
// Body: { photo: "data:image/...", description: "..." }
const submitPhoto = async (req, res) => {
  try {
    const { photo, description } = req.body;

    if (!photo) {
      return res.status(400).json({ message: "photo is required." });
    }
    if (!description || description.trim() === "") {
      return res.status(400).json({ message: "description is required." });
    }
    if (!photo.startsWith("data:image/")) {
      return res.status(400).json({ message: "Invalid image format." });
    }
    // Limit to ~5 MB base64
    if (photo.length > 7_000_000) {
      return res.status(400).json({ message: "Image too large. Maximum size is 5 MB." });
    }

    const woreda = resolveWoreda(req.user);
    if (!woreda) {
      return res.status(403).json({
        message: "Your account is not mapped to a known woreda. Contact admin.",
      });
    }

    const { error } = await supabase.from("woreda_photos").insert([
      {
        user_id:      req.user.id,
        submitted_by: req.user.username,
        woreda_id:    woreda.id,
        woreda_name:  woreda.name,
        description:  description.trim(),
        photo_data:   photo,
      },
    ]);

    if (error) return res.status(400).json({ message: error.message });

    res.status(201).json({ message: "Photo submitted successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── GET /api/photos/my  ─────────────────────────────────────────────────────
// Woreda user: fetch their own submitted photos (history).
// Query params: date_from, date_to (optional ISO date strings)
const getMyPhotos = async (req, res) => {
  try {
    const { date_from, date_to } = req.query;

    let query = supabase
      .from("woreda_photos")
      .select("id, submitted_by, woreda_id, woreda_name, description, submitted_at, photo_data")
      .eq("user_id", req.user.id)
      .order("submitted_at", { ascending: false });

    if (date_from) {
      query = query.gte("submitted_at", `${date_from}T00:00:00.000Z`);
    }
    if (date_to) {
      query = query.lte("submitted_at", `${date_to}T23:59:59.999Z`);
    }

    const { data, error } = await query;
    if (error) return res.status(400).json({ message: error.message });

    res.json({ photos: data || [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── GET /api/photos  ────────────────────────────────────────────────────────
// Subcity/Admin: fetch all submitted photos.
// Query params: woreda_id (optional), date_from, date_to (optional)
const getAllPhotos = async (req, res) => {
  try {
    const { woreda_id, date_from, date_to } = req.query;

    let query = supabase
      .from("woreda_photos")
      .select("id, submitted_by, woreda_id, woreda_name, description, submitted_at, photo_data")
      .order("submitted_at", { ascending: false });

    if (woreda_id && woreda_id !== "all") {
      query = query.eq("woreda_id", woreda_id);
    }
    if (date_from) {
      query = query.gte("submitted_at", `${date_from}T00:00:00.000Z`);
    }
    if (date_to) {
      query = query.lte("submitted_at", `${date_to}T23:59:59.999Z`);
    }

    const { data, error } = await query;
    if (error) return res.status(400).json({ message: error.message });

    res.json({ photos: data || [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── GET /api/photos/latest ──────────────────────────────────────────────────
// Subcity: get the most recent photo per woreda (for the gallery view).
const getLatestPerWoreda = async (req, res) => {
  try {
    // Fetch most recent photo for each woreda
    const WOREDA_IDS = ["w1", "w2", "w3", "w4"];
    const results = await Promise.all(
      WOREDA_IDS.map((wid) =>
        supabase
          .from("woreda_photos")
          .select("id, submitted_by, woreda_id, woreda_name, description, submitted_at, photo_data")
          .eq("woreda_id", wid)
          .order("submitted_at", { ascending: false })
          .limit(1)
          .maybeSingle()
      )
    );

    const latest = {};
    results.forEach(({ data }) => {
      if (data) latest[data.woreda_id] = data;
    });

    res.json({ latest });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── DELETE /api/photos/:id  ─────────────────────────────────────────────────
// Woreda: delete their own photo. Admin: delete any photo.
const deletePhoto = async (req, res) => {
  try {
    const id = Number(req.params.id);

    // Fetch photo first to enforce ownership for non-admin
    const { data: existing, error: fetchErr } = await supabase
      .from("woreda_photos")
      .select("id, user_id")
      .eq("id", id)
      .maybeSingle();

    if (fetchErr) return res.status(400).json({ message: fetchErr.message });
    if (!existing) return res.status(404).json({ message: "Photo not found." });

    if (req.user.role !== "admin" && existing.user_id !== req.user.id) {
      return res.status(403).json({ message: "You can only delete your own photos." });
    }

    const { error } = await supabase
      .from("woreda_photos")
      .delete()
      .eq("id", id);

    if (error) return res.status(400).json({ message: error.message });

    res.json({ message: "Photo deleted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  submitPhoto,
  getMyPhotos,
  getAllPhotos,
  getLatestPerWoreda,
  deletePhoto,
};
