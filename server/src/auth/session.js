import { randomBytes, createHash } from "node:crypto";
import { pool } from "../db/pool.js";
import { config } from "../config.js";

export const SESSION_COOKIE = "ie_admin";
const SESSION_HOURS = 12;

const sha256 = (s) => createHash("sha256").update(s).digest("hex");

function readCookie(req, name) {
  const header = req.headers.cookie || "";
  for (const part of header.split(";")) {
    const i = part.indexOf("=");
    if (i > -1 && part.slice(0, i).trim() === name) return decodeURIComponent(part.slice(i + 1).trim());
  }
  return null;
}

// In production the admin (site origin) and the API are different origins,
// so the cookie has to be SameSite=None; Secure to be sent cross-site.
// Locally everything is http://localhost:*, which counts as same-site.
function cookieAttrs(maxAgeSeconds) {
  const attrs = [`Path=/api`, `HttpOnly`, `Max-Age=${maxAgeSeconds}`];
  attrs.push(config.isProd ? "SameSite=None; Secure" : "SameSite=Lax");
  return attrs.join("; ");
}

export async function createSession(res, userId) {
  const token = randomBytes(32).toString("base64url");
  const expires = new Date(Date.now() + SESSION_HOURS * 3600 * 1000);
  await pool.query(
    "INSERT INTO admin_sessions (token_hash, user_id, expires_at) VALUES ($1, $2, $3)",
    [sha256(token), userId, expires]
  );
  res.setHeader("Set-Cookie", `${SESSION_COOKIE}=${token}; ${cookieAttrs(SESSION_HOURS * 3600)}`);
}

export async function destroySession(req, res) {
  const token = readCookie(req, SESSION_COOKIE);
  if (token) await pool.query("DELETE FROM admin_sessions WHERE token_hash = $1", [sha256(token)]);
  res.setHeader("Set-Cookie", `${SESSION_COOKIE}=; ${cookieAttrs(0)}`);
}

export async function destroyOtherSessions(userId, req) {
  const token = readCookie(req, SESSION_COOKIE);
  await pool.query(
    "DELETE FROM admin_sessions WHERE user_id = $1 AND token_hash <> $2",
    [userId, token ? sha256(token) : ""]
  );
}

// Attaches req.admin = { id, email, name, role, must_change_password } or
// responds 401. Also requires the X-Requested-With header on every admin
// call: a custom header forces a CORS preflight, which ALLOWED_ORIGINS
// rejects for any other site — that's the CSRF guard for the cookie.
export function requireAdmin({ allowPasswordChangePending = false } = {}) {
  return async (req, res, next) => {
    if (req.header("x-requested-with") !== "integrum-admin") {
      return res.status(403).json({ ok: false, error: "Forbidden" });
    }
    const token = readCookie(req, SESSION_COOKIE);
    if (!token) return res.status(401).json({ ok: false, error: "Not signed in" });
    try {
      const { rows } = await pool.query(
        `SELECT u.id, u.email, u.name, u.role, u.must_change_password
           FROM admin_sessions s JOIN admin_users u ON u.id = s.user_id
          WHERE s.token_hash = $1 AND s.expires_at > now() AND NOT u.disabled`,
        [sha256(token)]
      );
      if (!rows.length) return res.status(401).json({ ok: false, error: "Session expired — please sign in again" });
      req.admin = rows[0];
      if (req.admin.must_change_password && !allowPasswordChangePending) {
        return res.status(403).json({ ok: false, error: "Password change required", code: "password_change_required" });
      }
      return next();
    } catch (err) {
      return next(err);
    }
  };
}

export function requirePublisher(req, res, next) {
  if (req.admin?.role !== "publisher") {
    return res.status(403).json({ ok: false, error: "Only a publisher can do this" });
  }
  return next();
}

export async function purgeExpiredSessions() {
  await pool.query("DELETE FROM admin_sessions WHERE expires_at < now()");
}
