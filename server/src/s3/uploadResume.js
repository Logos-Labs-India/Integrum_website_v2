import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3, RESUME_BUCKET, RESUME_PREFIX } from "./client.js";

const DATA_URL_RE = /^data:([^;]+);base64,(.+)$/s;

function sanitizeFilename(name) {
  const base = String(name || "resume").split(/[\\/]/).pop();
  return base.replace(/[^A-Za-z0-9._-]/g, "_").slice(0, 150) || "resume";
}

// Uploads a `data:<mime>;base64,<data>` string to S3 as a private object.
// Returns { bucket, key, buffer, contentType } — bucket/key are the pointer
// to store (not a public URL, since resumes are personal data); buffer/
// contentType are handed back too so the caller can also attach the same
// decoded file to the notification email without re-decoding it. Throws on
// failure; caller decides whether that should block the rest of the submission.
export async function uploadResume({ dataUrl, filename }) {
  const match = DATA_URL_RE.exec(dataUrl);
  if (!match) throw new Error("resume_file is not a base64 data URL");
  const [, contentType, base64] = match;

  const buffer = Buffer.from(base64, "base64");
  const key = `${RESUME_PREFIX}/${Date.now()}-${sanitizeFilename(filename)}`;

  await s3.send(new PutObjectCommand({
    Bucket: RESUME_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  }));

  return { bucket: RESUME_BUCKET, key, buffer, contentType };
}
