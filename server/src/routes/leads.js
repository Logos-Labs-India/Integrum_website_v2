import { Router } from "express";
import rateLimit from "express-rate-limit";
import { pool } from "../db/pool.js";
import { uploadResume, DATA_URL_RE } from "../s3/uploadResume.js";
import { validateLead } from "../validate.js";
import { notifyLead } from "../email/notifyLead.js";
import { config } from "../config.js";

export const leadsRouter = Router();

const COLUMNS = [
  "submitted_at", "form", "reason", "name", "company", "email", "phone",
  "role", "industry", "consumption", "location", "state", "notes", "help",
  "resume_name", "resume_size", "resume_bucket", "resume_key", "resume_upload_failed",
  "page", "route_to",
];

// A public, unauthenticated endpoint that writes to Postgres, uploads to S3
// and sends email on every hit — throttle it so it can't be used to run up
// the SES sending quota, S3 storage bill, or the database.
const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: "Too many submissions from this address — please try again later." },
});

leadsRouter.post("/", submitLimiter, async (req, res) => {
  const data = req.body || {};

  const errors = validateLead(data);
  if (errors) {
    return res.status(400).json({ ok: false, error: "Validation failed", fields: errors });
  }

  let resumeBucket = null;
  let resumeKey = null;
  let resumeUploadFailed = false;
  let resumeAttachment = null;
  if (typeof data.resume_file === "string" && DATA_URL_RE.test(data.resume_file)) {
    try {
      const uploaded = await uploadResume({ dataUrl: data.resume_file, filename: data.resume_name });
      resumeBucket = uploaded.bucket;
      resumeKey = uploaded.key;
      resumeAttachment = {
        filename: data.resume_name || "resume",
        contentType: uploaded.contentType,
        buffer: uploaded.buffer,
      };
    } catch (err) {
      // Never lose the rest of the submission over a resume hiccup — but do
      // record that it happened, so a bare row can't be misread as "no
      // resume was ever attached" when one was, and just didn't make it.
      console.error("resume upload failed:", err);
      resumeUploadFailed = true;
    }
  }

  const row = {
    submitted_at: data.submitted_at || new Date().toISOString(),
    form: data.form || "",
    reason: data.reason ?? null,
    name: data.name,
    company: data.company ?? null,
    email: data.email,
    phone: data.phone,
    role: data.role ?? null,
    industry: data.industry ?? null,
    consumption: data.consumption ?? null,
    location: data.location ?? null,
    state: data.state ?? null,
    notes: data.notes ?? null,
    help: data.help ?? null,
    resume_name: data.resume_name ?? null,
    resume_size: data.resume_size != null && data.resume_size !== "" ? Number(data.resume_size) : null,
    resume_bucket: resumeBucket,
    resume_key: resumeKey,
    resume_upload_failed: resumeUploadFailed,
    page: data.page ?? null,
    route_to: data.route_to ?? null,
  };

  const placeholders = COLUMNS.map((_, i) => `$${i + 1}`).join(", ");
  const values = COLUMNS.map((c) => row[c]);

  try {
    await pool.query(
      `INSERT INTO leads (${COLUMNS.join(", ")}) VALUES (${placeholders})`,
      values
    );
  } catch (err) {
    console.error("lead insert failed:", err);
    return res.status(500).json({ ok: false, error: "Could not save submission" });
  }

  // Notification is best-effort — notifyLead() never throws, so a mail
  // failure never turns a successfully saved submission into an error.
  await notifyLead(row, resumeAttachment);
  return res.json({ ok: true });
});

// Minimal admin view onto real submissions — the frontend's own `/leads`
// screen only ever showed what one specific browser had submitted itself,
// never what actually reached the database. Gated by a shared secret rather
// than full user auth, since this is an internal tool, not a customer-facing
// feature; disabled entirely (404) when ADMIN_API_KEY isn't configured.
const LIST_COLUMNS = [
  "id", "submitted_at", "form", "reason", "name", "company", "email", "phone",
  "role", "industry", "consumption", "location", "state", "notes", "help",
  "resume_name", "resume_bucket", "resume_key", "resume_upload_failed",
  "page", "route_to", "created_at",
];

leadsRouter.get("/", async (req, res) => {
  if (!config.adminApiKey) return res.status(404).json({ ok: false, error: "Not found" });
  if (req.header("x-admin-key") !== config.adminApiKey) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }

  const limit = Math.min(Math.max(Number(req.query.limit) || 100, 1), 500);
  const offset = Math.max(Number(req.query.offset) || 0, 0);

  try {
    const result = await pool.query(
      `SELECT ${LIST_COLUMNS.join(", ")} FROM leads ORDER BY id DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return res.json({ ok: true, leads: result.rows, limit, offset });
  } catch (err) {
    console.error("lead list failed:", err);
    return res.status(500).json({ ok: false, error: "Could not load submissions" });
  }
});
