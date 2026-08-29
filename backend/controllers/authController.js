const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const supabase = require("../config/supabase");
const path = require("path");
const fs = require("fs");

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

// UPDATE OWN USERNAME (any authenticated user — self-service)
const updateMyUsername = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username || !username.trim()) {
      return res.status(400).json({ message: "Username is required." });
    }
    const trimmed = username.trim();
    if (trimmed.length < 3) {
      return res.status(400).json({ message: "Username must be at least 3 characters." });
    }

    // Make sure the username isn't already taken by someone else
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("username", trimmed)
      .neq("id", req.user.id)
      .maybeSingle();

    if (existing) {
      return res.status(400).json({ message: "Username already taken." });
    }

    const { error } = await supabase
      .from("users")
      .update({ username: trimmed })
      .eq("id", req.user.id);

    if (error) return res.status(400).json({ message: error.message });
    res.json({ message: "Username updated successfully.", username: trimmed });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET MY PROFILE (any authenticated user)
const getMyProfile = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, username, phone, role, profile_photo, is_active, created_at")
      .eq("id", req.user.id)
      .maybeSingle();

    if (error) return res.status(400).json({ message: error.message });
    if (!data) return res.status(404).json({ message: "User not found." });

    res.json({ user: data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE PROFILE PHOTO (any authenticated user — base64 stored in DB)
const updateProfilePhoto = async (req, res) => {
  try {
    const { photo } = req.body; // base64 data URL string

    if (!photo) {
      return res.status(400).json({ message: "photo is required." });
    }

    // Validate it's a data URL (data:image/...)
    if (!photo.startsWith("data:image/")) {
      return res.status(400).json({ message: "Invalid image format." });
    }

    // Limit size to ~2MB (base64 is ~1.33x raw size)
    if (photo.length > 2_800_000) {
      return res
        .status(400)
        .json({ message: "Image too large. Maximum size is 2 MB." });
    }

    const { error } = await supabase
      .from("users")
      .update({ profile_photo: photo })
      .eq("id", req.user.id);

    if (error) return res.status(400).json({ message: error.message });

    res.json({ message: "Profile photo updated.", photo });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CHANGE OWN PASSWORD (any authenticated user — requires old password verification)
const changeOwnPassword = async (req, res) => {
  try {
    const { old_password, new_password } = req.body;

    if (!old_password || !new_password) {
      return res
        .status(400)
        .json({ message: "old_password and new_password are required." });
    }

    if (new_password.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters." });
    }

    // Fetch current password hash
    const { data: user, error: fetchErr } = await supabase
      .from("users")
      .select("password_hash")
      .eq("id", req.user.id)
      .maybeSingle();

    if (fetchErr || !user) {
      return res.status(404).json({ message: "User not found." });
    }

    const match = await bcrypt.compare(old_password, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: "Old password is incorrect." });
    }

    const hashedNew = await bcrypt.hash(new_password, 10);

    const { error } = await supabase
      .from("users")
      .update({ password_hash: hashedNew })
      .eq("id", req.user.id);

    if (error) return res.status(400).json({ message: error.message });

    res.json({ message: "Password changed successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// TOGGLE USER ACTIVE/INACTIVE STATUS (admin only — cannot deactivate self)
const toggleUserStatus = async (req, res) => {
  try {
    const targetId = Number(req.params.id);
    const { is_active } = req.body; // boolean

    if (targetId === req.user.id) {
      return res
        .status(400)
        .json({ message: "You cannot change your own active status." });
    }

    if (typeof is_active !== "boolean") {
      return res.status(400).json({ message: "is_active must be a boolean." });
    }

    const { error } = await supabase
      .from("users")
      .update({ is_active })
      .eq("id", targetId);

    if (error) return res.status(400).json({ message: error.message });

    res.json({
      message: `User ${is_active ? "activated" : "deactivated"} successfully.`,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Annual Plan Unlock Requests (subcity → admin) ───────────────────────────

// REQUEST ANNUAL PLAN UNLOCK (subcity user)
const requestPlanUnlock = async (req, res) => {
  try {
    const { sector, plan_year, reason } = req.body;
    if (!sector || !plan_year) {
      return res
        .status(400)
        .json({ message: "sector and plan_year are required." });
    }

    const now = new Date();
    // Request expires 5 days from submission
    const expiresAt = new Date(
      now.getTime() + 5 * 24 * 60 * 60 * 1000,
    ).toISOString();

    // Check for existing request for this user+sector+year
    const { data: existing } = await supabase
      .from("plan_unlock_requests")
      .select("id, status, expires_at")
      .eq("user_id", req.user.id)
      .eq("sector", sector)
      .eq("plan_year", plan_year)
      .maybeSingle();

    if (existing) {
      if (existing.status === "approved") {
        return res.status(400).json({
          message: "You already have an approved unlock for this plan.",
        });
      }
      if (existing.status === "pending") {
        // Check if it has expired
        const isExpired =
          existing.expires_at && new Date(existing.expires_at) < now;
        if (isExpired) {
          // Mark expired and allow re-submission below
          await supabase
            .from("plan_unlock_requests")
            .update({ status: "expired" })
            .eq("id", existing.id);
        } else {
          return res.status(400).json({
            message: "You already have a pending request for this plan.",
          });
        }
      }
      // "denied", "expired", "used" — delete so we can resubmit fresh
      if (["denied", "expired"].includes(existing.status)) {
        await supabase
          .from("plan_unlock_requests")
          .delete()
          .eq("id", existing.id);
      }
    }

    const { error } = await supabase.from("plan_unlock_requests").insert([
      {
        user_id: req.user.id,
        username: req.user.username,
        sector,
        plan_year: Number(plan_year),
        reason: reason || "",
        status: "pending",
        expires_at: expiresAt,
      },
    ]);

    if (error) return res.status(400).json({ message: error.message });

    res.status(201).json({
      message:
        "Plan unlock request submitted. It will expire in 5 days if not acted upon.",
      expires_at: expiresAt,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Helper: auto-expire any pending rows whose expires_at has passed
async function autoExpirePlanRequests(rows) {
  const now = new Date();
  const toExpire = (rows || []).filter(
    (r) =>
      r.status === "pending" && r.expires_at && new Date(r.expires_at) < now,
  );
  if (toExpire.length > 0) {
    const ids = toExpire.map((r) => r.id);
    await supabase
      .from("plan_unlock_requests")
      .update({ status: "expired" })
      .in("id", ids);
    // Update the in-memory rows too so the response is fresh
    rows.forEach((r) => {
      if (ids.includes(r.id)) r.status = "expired";
    });
  }
  return rows;
}

// GET ALL PLAN UNLOCK REQUESTS (admin)
const getPlanUnlockRequests = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("plan_unlock_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) return res.status(400).json({ message: error.message });
    const fresh = await autoExpirePlanRequests(data || []);
    res.json({ requests: fresh });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET MY PLAN UNLOCK REQUESTS (subcity)
const getMyPlanUnlockRequests = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("plan_unlock_requests")
      .select("*")
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false });

    if (error) return res.status(400).json({ message: error.message });
    const fresh = await autoExpirePlanRequests(data || []);
    res.json({ requests: fresh });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// RESOLVE PLAN UNLOCK REQUEST (admin — approve or deny)
const resolvePlanUnlockRequest = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { action } = req.body; // "approved" | "denied"

    if (!["approved", "denied"].includes(action)) {
      return res
        .status(400)
        .json({ message: "action must be 'approved' or 'denied'." });
    }

    // Cannot resolve an expired request
    const { data: existing } = await supabase
      .from("plan_unlock_requests")
      .select("status, expires_at")
      .eq("id", id)
      .maybeSingle();

    if (existing && existing.status === "pending" && existing.expires_at) {
      if (new Date(existing.expires_at) < new Date()) {
        await supabase
          .from("plan_unlock_requests")
          .update({ status: "expired" })
          .eq("id", id);
        return res.status(400).json({ message: "This request has expired." });
      }
    }

    const { error } = await supabase
      .from("plan_unlock_requests")
      .update({ status: action, resolved_at: new Date().toISOString() })
      .eq("id", id);

    if (error) return res.status(400).json({ message: error.message });
    res.json({ message: `Plan unlock request ${action}.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Annual Plan Archive (run once after July 8) ─────────────────────────────

// ARCHIVE ALL ANNUAL PLANS (admin only — saves current year plans as archived records)
const archiveAnnualPlans = async (req, res) => {
  try {
    const year = new Date().getFullYear();
    const errors = [];

    // List of all subcity plan tables to archive
    const SUBCITY_PLAN_TABLES = [
      "subcity_buusaa_gonofaa_plan",
      "subcity_qonna_plan",
      "subcity_carraa_plan",
      "subcity_daldala_plan",
      "subcity_atk_plan",
      "subcity_galii_plan",
    ];

    // List of all wereda plan tables to archive (4 per sector)
    const WEREDA_PLAN_TABLES = [
      "annual_plan_wereda_1",
      "annual_plan_wereda_2",
      "annual_plan_wereda_3",
      "annual_plan_wereda_4",
      "annual_qonna_plan_wereda_1",
      "annual_qonna_plan_wereda_2",
      "annual_qonna_plan_wereda_3",
      "annual_qonna_plan_wereda_4",
      "annual_carraa_plan_wereda_1",
      "annual_carraa_plan_wereda_2",
      "annual_carraa_plan_wereda_3",
      "annual_carraa_plan_wereda_4",
      "annual_daldala_plan_wereda_1",
      "annual_daldala_plan_wereda_2",
      "annual_daldala_plan_wereda_3",
      "annual_daldala_plan_wereda_4",
      "annual_atk_plan_wereda_1",
      "annual_atk_plan_wereda_2",
      "annual_atk_plan_wereda_3",
      "annual_atk_plan_wereda_4",
      "annual_galii_plan_wereda_1",
      "annual_galii_plan_wereda_2",
      "annual_galii_plan_wereda_3",
      "annual_galii_plan_wereda_4",
    ];

    const allTables = [...SUBCITY_PLAN_TABLES, ...WEREDA_PLAN_TABLES];

    for (const tableName of allTables) {
      // Fetch current year's row
      const { data, error: fetchErr } = await supabase
        .from(tableName)
        .select("*")
        .eq("year", year)
        .maybeSingle();

      if (fetchErr) {
        errors.push(`${tableName} fetch: ${fetchErr.message}`);
        continue;
      }

      if (data) {
        // Archive the row with a label
        const { error: archErr } = await supabase
          .from("annual_plan_archive")
          .upsert(
            [
              {
                source_table: tableName,
                plan_year: year,
                data: data,
                archived_at: new Date().toISOString(),
              },
            ],
            { onConflict: "source_table,plan_year" },
          );

        if (archErr) {
          errors.push(`${tableName} archive: ${archErr.message}`);
        }

        // Reset the current row to all zeros (keep the row, just zero the values)
        const zeroRow = {};
        Object.keys(data).forEach((k) => {
          if (k === "id" || k === "year") return;
          if (typeof data[k] === "number") zeroRow[k] = 0;
        });

        if (Object.keys(zeroRow).length > 0) {
          const { error: resetErr } = await supabase
            .from(tableName)
            .update(zeroRow)
            .eq("year", year);
          if (resetErr) {
            errors.push(`${tableName} reset: ${resetErr.message}`);
          }
        }
      }
    }

    if (errors.length) {
      return res
        .status(207)
        .json({ message: "Archive completed with some errors.", errors });
    }

    res.json({ message: `Annual plans for ${year} archived successfully.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Fetch Archived Annual Plans ──────────────────────────────────────────────
/**
 * GET /api/auth/archived-plans?year=
 * Returns all rows from annual_plan_archive, optionally filtered by plan_year.
 * Available to both sub-city and admin roles.
 */
const getArchivedPlans = async (req, res) => {
  try {
    const { year } = req.query;
    let query = supabase
      .from("annual_plan_archive")
      .select("id, source_table, plan_year, data, archived_at")
      .order("plan_year", { ascending: false })
      .order("source_table", { ascending: true });

    if (year) {
      query = query.eq("plan_year", Number(year));
    }

    const { data, error } = await query;
    if (error) return res.status(500).json({ message: error.message });

    // Return available years for the year-filter dropdown
    const { data: yearRows, error: yearErr } = await supabase
      .from("annual_plan_archive")
      .select("plan_year")
      .order("plan_year", { ascending: false });

    const availableYears = yearErr
      ? []
      : [...new Set((yearRows || []).map((r) => r.plan_year))];

    res.json({ archives: data || [], availableYears });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE USER PROFILE (for admin to update user details)
const updateUserDetails = async (req, res) => {
  try {
    const targetId = Number(req.params.id);
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "phone is required." });
    }

    const { error } = await supabase
      .from("users")
      .update({ phone })
      .eq("id", targetId);

    if (error) return res.status(400).json({ message: error.message });
    res.json({ message: "User details updated." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login with is_active check
const loginWithActiveCheck = async (req, res) => {
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

    // Check if user is banned/inactive
    if (user.is_active === false) {
      return res.status(403).json({
        message:
          "Your account has been deactivated. Please contact the administrator.",
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
        profile_photo: user.profile_photo || null,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// GET ALL USERS with is_active field
const getUsersWithStatus = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, username, phone, role, is_active, profile_photo, created_at")
      .order("created_at", { ascending: true });

    if (error) return res.status(400).json({ message: error.message });

    res.json({ users: data || [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  register,
  login,
  loginWithActiveCheck,
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
};
