const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const supabase = require("../config/supabase");

// REGISTER
const register = async (req, res) => {
  try {
    const { username, password, phone, role } = req.body;

    if (!username || !password || !phone || !role) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .maybeSingle();

    if (existingUser) {
      return res.status(400).json({
        message: "Username already exists.",
      });
    }

    const { data: existingPhone } = await supabase
      .from("users")
      .select("*")
      .eq("phone", phone)
      .maybeSingle();

    if (existingPhone) {
      return res.status(400).json({
        message: "Phone number already registered.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { error } = await supabase.from("users").insert([
      {
        username,
        password_hash: hashedPassword,
        phone,
        role,
      },
    ]);

    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }

    res.status(201).json({
      message: "Registration successful.",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required.",
      });
    }

    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .maybeSingle();

    if (!user) {
      return res.status(401).json({
        message: "Invalid username or password.",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid username or password.",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      },
    );

    res.json({
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// GET ALL USERS (admin only — never returns password_hash)
const getUsers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, username, phone, role, created_at")
      .order("created_at", { ascending: true });

    if (error) return res.status(400).json({ message: error.message });

    res.json({ users: data || [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE USER (admin only — cannot delete yourself)
const deleteUser = async (req, res) => {
  try {
    const targetId = Number(req.params.id);

    if (targetId === req.user.id) {
      return res
        .status(400)
        .json({ message: "You cannot delete your own account." });
    }

    const { error } = await supabase.from("users").delete().eq("id", targetId);

    if (error) return res.status(400).json({ message: error.message });

    res.json({ message: "User deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE PASSWORD (admin only)
const updatePassword = async (req, res) => {
  try {
    const targetId = Number(req.params.id);
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { error } = await supabase
      .from("users")
      .update({ password_hash: hashedPassword })
      .eq("id", targetId);

    if (error) return res.status(400).json({ message: error.message });

    res.json({ message: "Password updated successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// REQUEST EDIT ACCESS (wereda — one request per sector+date)
// Blocks only if there is already a "pending" or "approved" request.
// "used" and "denied" records are cleaned up so the wereda can request again.
const requestEditAccess = async (req, res) => {
  try {
    const { sector, report_date, report_type } = req.body;
    if (!sector || !report_date) {
      return res
        .status(400)
        .json({ message: "sector and report_date are required." });
    }

    // Check for any existing request for this user+sector+date
    const { data: existing } = await supabase
      .from("edit_requests")
      .select("id, status")
      .eq("user_id", req.user.id)
      .eq("sector", sector)
      .eq("report_date", report_date)
      .maybeSingle();

    if (existing) {
      if (existing.status === "approved") {
        return res.status(400).json({
          message: "You already have an approved edit token for this report.",
        });
      }
      if (existing.status === "pending") {
        return res.status(400).json({
          message: "You already have a pending request for this report.",
        });
      }
      // "denied" or "used" — delete the stale record so a fresh one can be inserted
      await supabase.from("edit_requests").delete().eq("id", existing.id);
    }

    const { error } = await supabase.from("edit_requests").insert([
      {
        user_id: req.user.id,
        username: req.user.username,
        sector,
        report_date,
        report_type: report_type || "",
        status: "pending",
      },
    ]);

    if (error) return res.status(400).json({ message: error.message });
    res
      .status(201)
      .json({ message: "Edit request submitted. Waiting for admin approval." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET EDIT REQUESTS (admin — all pending/recent requests)
const getEditRequests = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("edit_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) return res.status(400).json({ message: error.message });
    res.json({ requests: data || [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET MY EDIT REQUESTS (wereda — their own requests)
const getMyEditRequests = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("edit_requests")
      .select("*")
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false });

    if (error) return res.status(400).json({ message: error.message });
    res.json({ requests: data || [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// APPROVE OR DENY EDIT REQUEST (admin)
const resolveEditRequest = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { action } = req.body; // "approved" | "denied"

    if (!["approved", "denied"].includes(action)) {
      return res
        .status(400)
        .json({ message: "action must be 'approved' or 'denied'." });
    }

    const { error } = await supabase
      .from("edit_requests")
      .update({ status: action, resolved_at: new Date().toISOString() })
      .eq("id", id);

    if (error) return res.status(400).json({ message: error.message });
    res.json({ message: `Request ${action}.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  register,
  login,
  getUsers,
  deleteUser,
  updatePassword,
  requestEditAccess,
  getEditRequests,
  getMyEditRequests,
  resolveEditRequest,
};
