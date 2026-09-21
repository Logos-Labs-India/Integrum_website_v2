import { Router } from "express";
import { pool } from "../db/pool.js";
import { uploadResume } from "../s3/uploadResume.js";
import { validateLead } from "../validate.js";
import { notifyLead } from "../email/notifyLead.js";

export const leadsRouter = Router();

const COLUMNS = [
  "submitted_at", "form", "reason", "name", "company", "email", "phone",
  "role", "industry", "consumption", "location", "state", "notes", "help",
  "resume_name", "resume_size", "resume_bucket", "resume_key", "page", "route_to",
];

leadsRouter.post("/", async (req, res) => {
  const data = req.body || {};

  const errors = validateLead(data);
  if (errors) {
    return res.status(400).json({ ok: false, error: "Validation failed", fields: errors });
  }

  let resumeBucket = null;
  let resumeKey = null;
  let resumeAttachment = null;
  if (typeof data.resume_file === "string" && data.resume_file.startsWith("data:")) {
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
      // Never lose the rest of the submission over a resume hiccup.
      console.error("resume upload failed:", err);
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
    resume_size: data.resume_size ? Number(data.resume_size) : null,
    resume_bucket: resumeBucket,
    resume_key: resumeKey,
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
