const supabase = require("../config/supabase");

/**
 * POST /api/announcements
 * Sub-city only: create a new announcement.
 */
const createAnnouncement = async (req, res) => {
  try {
    const { title, body } = req.body;
    if (!title || !body) {
      return res.status(400).json({ message: "title and body are required." });
    }

    const created_by = req.user.username || req.user.name || "sub-city";

    const { data, error } = await supabase
      .from("announcements")
      .insert([{ title, body, created_by }])
      .select()
      .single();

    if (error) return res.status(500).json({ message: error.message });

    res.status(201).json({ announcement: data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/announcements
 * All authenticated users: fetch all announcements newest-first.
 */
const getAnnouncements = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ message: error.message });

    res.json({ announcements: data || [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/announcements/unread-count
 * Woreda users: returns { count } of announcements newer than their last_seen_id.
 */
const getUnreadCount = async (req, res) => {
  try {
    const username = req.user.username;

    // Get this user's last seen id
    const { data: readRow } = await supabase
      .from("announcement_reads")
      .select("last_seen_id")
      .eq("username", username)
      .maybeSingle();

    const lastSeenId = readRow?.last_seen_id ?? 0;

    // Count announcements newer than last_seen_id
    const { count, error } = await supabase
      .from("announcements")
      .select("*", { count: "exact", head: true })
      .gt("id", lastSeenId);

    if (error) return res.status(500).json({ message: error.message });

    res.json({ count: count ?? 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * POST /api/announcements/mark-read
 * Woreda users: mark all current announcements as read.
 * Body: { lastId } — the id of the newest announcement they've seen.
 */
const markRead = async (req, res) => {
  try {
    const username = req.user.username;
    const { lastId } = req.body;

    if (!lastId) return res.status(400).json({ message: "lastId required." });

    const { error } = await supabase
      .from("announcement_reads")
      .upsert([{ username, last_seen_id: lastId }], { onConflict: "username" });

    if (error) return res.status(500).json({ message: error.message });

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * DELETE /api/announcements/:id
 * Sub-city only: delete an announcement by id.
 */
const deleteAnnouncement = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid id." });

    const { error } = await supabase
      .from("announcements")
      .delete()
      .eq("id", id);

    if (error) return res.status(500).json({ message: error.message });

    res.json({ message: "Announcement deleted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createAnnouncement,
  getAnnouncements,
  getUnreadCount,
  markRead,
  deleteAnnouncement,
};
