import { Router } from "express";
import { randomBytes } from "node:crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3, RESUME_BUCKET } from "../s3/client.js";
import { config } from "../config.js";
import { requireAdmin } from "../auth/session.js";

export const adminUploadsRouter = Router();
adminUploadsRouter.use(requireAdmin());

const MB = 1024 * 1024;
// What the admin may upload, and how large. Videos go straight from the
// browser to S3 via a presigned URL, so their size never touches this server.
const ALLOWED = {
  "application/pdf": { ext: "pdf", max: 60 * MB },
  "image/jpeg":      { ext: "jpg", max: 10 * MB },
  "image/png":       { ext: "png", max: 10 * MB },
  "image/webp":      { ext: "webp", max: 10 * MB },
  "image/svg+xml":   { ext: "svg", max: 2 * MB },
  "video/mp4":       { ext: "mp4", max: 400 * MB },
  "video/webm":      { ext: "webm", max: 400 * MB },
};

function slug(name) {
  const base = String(name || "file").split(/[\\/]/).pop().replace(/\.[^.]+$/, "");
  return base.normalize("NFKD").replace(/[^A-Za-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "file";
}

// Step 1 of an upload: the admin asks for a signed PUT URL, then uploads the
// file to it directly. The returned publicUrl is what gets saved in content.
adminUploadsRouter.post("/", async (req, res, next) => {
  const { filename, contentType, size } = req.body || {};
  const rule = ALLOWED[contentType];
  if (!rule) {
    return res.status(400).json({ ok: false, error: "Only PDF, JPG, PNG, WebP, SVG, MP4 and WebM files can be uploaded" });
  }
  const bytes = Number(size);
  if (!Number.isFinite(bytes) || bytes <= 0) return res.status(400).json({ ok: false, error: "File size is missing" });
  if (bytes > rule.max) {
    return res.status(400).json({ ok: false, error: `That file is too large — the limit for this type is ${Math.round(rule.max / MB)} MB` });
  }

  const now = new Date();
  const key = [
    config.cmsUploadPrefix,
    `${now.getUTCFullYear()}`,
    String(now.getUTCMonth() + 1).padStart(2, "0"),
    `${slug(filename)}-${randomBytes(4).toString("hex")}.${rule.ext}`,
  ].join("/");

  try {
    const uploadUrl = await getSignedUrl(
      s3,
      // ContentType and ContentLength are part of the signature, so the
      // browser can only upload exactly the file it described.
      new PutObjectCommand({ Bucket: RESUME_BUCKET, Key: key, ContentType: contentType, ContentLength: bytes }),
      { expiresIn: 15 * 60 }
    );
    return res.json({
      ok: true,
      uploadUrl,
      publicUrl: `${config.cmsPublicBaseUrl}/${key}`,
      sizeLabel: bytes >= MB ? `${(bytes / MB).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`,
    });
  } catch (err) {
    return next(err);
  }
});
