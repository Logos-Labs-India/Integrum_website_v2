// Reads and validates every env var the server depends on, once, at boot —
// so a missing value fails loudly at startup instead of surfacing as a
// silent, hard-to-diagnose failure the first time a request touches that
// code path in production (e.g. a résumé upload throwing because
// AWS_STORAGE_BUCKET_NAME was never set).
const REQUIRED = [
  "DATABASE_URL",
  "AWS_REGION",
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "AWS_STORAGE_BUCKET_NAME",
  "SES_FROM_EMAIL",
];

export function loadConfig() {
  const missing = REQUIRED.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(
      `Missing required environment variable(s): ${missing.join(", ")}. ` +
      `Copy server/.env.example to server/.env and fill these in before starting the server.`
    );
  }
  if (!process.env.HR_EMAIL) {
    console.warn(
      "Warning: HR_EMAIL not set — careers-application notifications will fall back to " +
      "the hardcoded Careers@integrumenergy.in, which may not be a verified SES recipient."
    );
  }
  if (!process.env.ADMIN_API_KEY) {
    console.warn("Warning: ADMIN_API_KEY not set — GET /api/leads (the admin leads viewer) is disabled.");
  }

  return {
    port: process.env.PORT || 4000,
    databaseUrl: process.env.DATABASE_URL,
    pgSslInsecure: String(process.env.PGSSL_INSECURE || "").toLowerCase() === "true",
    awsRegion: process.env.AWS_REGION,
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    resumeBucket: process.env.AWS_STORAGE_BUCKET_NAME,
    resumePrefix: process.env.S3_RESUME_PREFIX || "careers-resumes",
    sesFromEmail: process.env.SES_FROM_EMAIL,
    hrEmail: process.env.HR_EMAIL || "",
    generalNotifyEmail: process.env.GENERAL_NOTIFY_EMAIL || "",
    allowedOrigins: (process.env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean),
    adminApiKey: process.env.ADMIN_API_KEY || "",
    isProd: process.env.NODE_ENV === "production",
  };
}

export const config = loadConfig();
