const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { config, assertConfigured } = require("./config");
const { buildResumeKey, uploadResume, getResumeLink } = require("./lib/s3");
const { sendCareerApplicationEmail } = require("./lib/email");

assertConfigured();

const ALLOWED_MIME = new Set([
  "application/pdf",
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
]);
const ALLOWED_EXT = /\.(pdf|doc|docx)$/i;
const MAX_FILE_BYTES = 4 * 1024 * 1024; // 4 MB — matches the frontend's own limit

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_BYTES },
  fileFilter(req, file, cb) {
    if (!ALLOWED_EXT.test(file.originalname) || !ALLOWED_MIME.has(file.mimetype)) {
      return cb(new Error("Only PDF, DOC or DOCX files are accepted"));
    }
    cb(null, true);
  },
});

const app = express();
app.use(cors(config.allowedOrigins.length ? { origin: config.allowedOrigins } : {}));

app.post("/api/careers/apply", (req, res) => {
  upload.single("resume")(req, res, async (uploadErr) => {
    if (uploadErr) {
      const status = uploadErr.code === "LIMIT_FILE_SIZE" ? 413 : 400;
      const message = uploadErr.code === "LIMIT_FILE_SIZE" ? "File is larger than 4 MB" : uploadErr.message;
      return res.status(status).json({ ok: false, error: message });
    }

    const { name, email, phone, company, role, help } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ ok: false, error: "Name is required" });
    if (!email || !email.trim()) return res.status(400).json({ ok: false, error: "Email is required" });
    if (!req.file) return res.status(400).json({ ok: false, error: "Resume file is required" });

    try {
      const key = buildResumeKey(req.file.originalname);
      await uploadResume(req.file.buffer, key, req.file.mimetype);
      const resumeLink = await getResumeLink(key);
      console.log("resumeLink", resumeLink);
      await sendCareerApplicationEmail({
        name, email, phone, company, role, help,
        resumeName: req.file.originalname,
        resumeLink,
      });

      res.json({ ok: true, resumeKey: key, resumeLink });
    } catch (err) {
      console.error("careers/apply failed:", err);
      res.status(502).json({ ok: false, error: "Upload or notification failed. Please try again shortly." });
    }
  });
});

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.listen(config.port, () => console.log(`Careers API listening on http://localhost:${config.port}`));
