import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3, RESUME_BUCKET, RESUME_PREFIX } from "./client.js";

export const DATA_URL_RE = /^data:([^;]+);base64,(.+)$/s;

// Matches the client-side `accept=".pdf,.doc,.docx"` on the file input
// (src/casestudy.jsx) — that attribute is trivially bypassed by posting
// directly to the API, so it's enforced again here.
const ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

// Matches the client-side 4 MB cap (src/casestudy.jsx) — also client-side
// only until enforced here.
const MAX_BYTES = 4 * 1024 * 1024;

function sanitizeFilename(name) {
  const base = String(name || "resume").split(/[\\/]/).pop();
  return base.replace(/[^A-Za-z0-9._-]/g, "_").slice(0, 150) || "resume";
}

// Uploads a `data:<mime>;base64,<data>` string to S3 as a private object.
// Returns { bucket, key, buffer, contentType } — bucket/key are the pointer
// to store (not a public URL, since resumes are personal data); buffer/
// contentType are handed back too so the caller can also attach the same
// decoded file to the notification email without re-decoding it. Throws on
// a malformed data URL, a disallowed file type, or a file over MAX_BYTES —
// caller decides whether that should block the rest of the submission.
export async function uploadResume({ dataUrl, filename }) {
  const match = DATA_URL_RE.exec(dataUrl);
  if (!match) throw new Error("resume_file is not a base64 data URL");
  const [, contentType, base64] = match;

  if (!ALLOWED_TYPES.has(contentType)) {
    throw new Error(`resume_file content type not allowed: ${contentType}`);
  }

  const buffer = Buffer.from(base64, "base64");
  if (buffer.length > MAX_BYTES) {
    throw new Error(`resume_file exceeds ${MAX_BYTES} bytes (got ${buffer.length})`);
  }

  const key = `${RESUME_PREFIX}/${Date.now()}-${sanitizeFilename(filename)}`;

  await s3.send(new PutObjectCommand({
    Bucket: RESUME_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  }));

  return { bucket: RESUME_BUCKET, key, buffer, contentType };
}
