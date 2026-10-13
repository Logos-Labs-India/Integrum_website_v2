import { Router } from "express";
import rateLimit from "express-rate-limit";
import { pool } from "../db/pool.js";
import { verifyPassword, hashPassword, checkPasswordStrength } from "../auth/password.js";
import { createSession, destroySession, destroyOtherSessions, requireAdmin } from "../auth/session.js";

export const adminAuthRouter = Router();

// Slows down password guessing: 10 attempts per 15 minutes per IP.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: "Too many sign-in attempts — please wait 15 minutes and try again." },
});

const publicUser = (u) => ({
  id: u.id, email: u.email, name: u.name, role: u.role,
  mustChangePassword: u.must_change_password,
});

adminAuthRouter.post("/login", loginLimiter, async (req, res, next) => {
  if (req.header("x-requested-with") !== "integrum-admin") {
    return res.status(403).json({ ok: false, error: "Forbidden" });
  }
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");
  if (!email || !password) return res.status(400).json({ ok: false, error: "Email and password are required" });

  try {
    const { rows } = await pool.query(
      "SELECT id, email, name, role, password_hash, must_change_password, disabled FROM admin_users WHERE email = $1",
      [email]
    );
    const user = rows[0];
    // Same message whether the email or the password is wrong, so the form
    // can't be used to discover which addresses have accounts.
    const ok = user && !user.disabled && await verifyPassword(password, user.password_hash);
    if (!ok) return res.status(401).json({ ok: false, error: "Incorrect email or password" });

    await pool.query("UPDATE admin_users SET last_login_at = now() WHERE id = $1", [user.id]);
    await createSession(res, user.id);
    return res.json({ ok: true, user: publicUser(user) });
  } catch (err) {
    return next(err);
  }
});

adminAuthRouter.post("/logout", async (req, res, next) => {
  try {
    await destroySession(req, res);
    return res.json({ ok: true });
  } catch (err) {
    return next(err);
  }
});

adminAuthRouter.get("/me", requireAdmin({ allowPasswordChangePending: true }), (req, res) => {
  res.json({ ok: true, user: publicUser(req.admin) });
});

adminAuthRouter.post("/password", loginLimiter, requireAdmin({ allowPasswordChangePending: true }), async (req, res, next) => {
  const current = String(req.body?.currentPassword || "");
  const next_ = String(req.body?.newPassword || "");
  const weak = checkPasswordStrength(next_);
  if (weak) return res.status(400).json({ ok: false, error: weak });
  if (current === next_) return res.status(400).json({ ok: false, error: "The new password must be different" });

  try {
    const { rows } = await pool.query("SELECT password_hash FROM admin_users WHERE id = $1", [req.admin.id]);
    if (!rows.length || !await verifyPassword(current, rows[0].password_hash)) {
      return res.status(401).json({ ok: false, error: "Current password is incorrect" });
    }
    await pool.query(
      "UPDATE admin_users SET password_hash = $1, must_change_password = false WHERE id = $2",
      [await hashPassword(next_), req.admin.id]
    );
    // Sign out every other device that was using the old password.
    await destroyOtherSessions(req.admin.id, req);
    return res.json({ ok: true, user: publicUser({ ...req.admin, must_change_password: false }) });
  } catch (err) {
    return next(err);
  }
});
