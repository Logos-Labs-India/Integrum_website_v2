// Creates a CMS admin account (or resets an existing one's password) and
// prints a one-time password. The user must change it at first sign-in.
//
//   npm run create-admin -- --email someone@example.com --name "Full Name" --role publisher
//   npm run create-admin -- --email someone@example.com --reset
//
// Talks to DATABASE_URL directly rather than through src/config.js, so it
// works without the email/S3 settings the web server itself requires.
import "dotenv/config";
import pg from "pg";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { hashPassword, generateTempPassword } from "../src/auth/password.js";

function arg(name) {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1) return undefined;
  const v = process.argv[i + 1];
  return v && !v.startsWith("--") ? v : true;
}

const email = String(arg("email") || "").trim().toLowerCase();
const name = arg("name");
const role = arg("role") || "editor";
const reset = arg("reset") === true;

if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error("Usage: npm run create-admin -- --email you@example.com --name \"Full Name\" [--role editor|publisher] [--reset]");
  process.exit(1);
}
if (!["editor", "publisher"].includes(role)) {
  console.error('--role must be "editor" or "publisher"');
  process.exit(1);
}
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set (see server/.env).");
  process.exit(1);
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: String(process.env.PGSSL_INSECURE || "").toLowerCase() === "true" ? { rejectUnauthorized: false } : undefined,
});

try {
  const schema = readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), "../src/db/schema.sql"), "utf8");
  await pool.query(schema);

  const temp = generateTempPassword();
  const hash = await hashPassword(temp);
  const existing = await pool.query("SELECT id FROM admin_users WHERE email = $1", [email]);

  if (existing.rows.length) {
    if (!reset) {
      console.error(`${email} already has an account. Add --reset to issue a new one-time password.`);
      process.exit(1);
    }
    await pool.query(
      "UPDATE admin_users SET password_hash = $1, must_change_password = true, disabled = false WHERE email = $2",
      [hash, email]
    );
    await pool.query("DELETE FROM admin_sessions WHERE user_id = $1", [existing.rows[0].id]);
    console.log(`Password reset for ${email}.`);
  } else {
    if (!name || name === true) {
      console.error("--name is required when creating an account.");
      process.exit(1);
    }
    await pool.query(
      "INSERT INTO admin_users (email, name, role, password_hash) VALUES ($1, $2, $3, $4)",
      [email, name, role, hash]
    );
    console.log(`Created ${role} account for ${name} <${email}>.`);
  }
  console.log(`One-time password: ${temp}`);
  console.log("Share it privately. They'll be asked to choose a new password when they first sign in.");
} finally {
  await pool.end();
}
