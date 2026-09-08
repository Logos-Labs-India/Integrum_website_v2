const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const config = {
  aws: {
    region: process.env.AWS_REGION || "ap-south-1",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    bucket: process.env.AWS_STORAGE_BUCKET_NAME || "",
  },
  s3ResumePrefix: process.env.S3_RESUME_PREFIX || "careers-resumes",
  email: {
    fromEmail: process.env.SES_FROM_EMAIL || "",
    hrEmail: process.env.HR_EMAIL || "",
  },
  allowedOrigins: (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  port: Number(process.env.PORT || 4000),
};

function assertConfigured() {
  const missing = [];
  if (!config.aws.accessKeyId) missing.push("AWS_ACCESS_KEY_ID");
  if (!config.aws.secretAccessKey) missing.push("AWS_SECRET_ACCESS_KEY");
  if (!config.aws.bucket) missing.push("AWS_STORAGE_BUCKET_NAME");
  if (!config.email.fromEmail) missing.push("SES_FROM_EMAIL");
  if (!config.email.hrEmail) missing.push("HR_EMAIL");
  if (missing.length) {
    throw new Error("Missing required environment variables: " + missing.join(", ") + " (see .env.example)");
  }
}

module.exports = { config, assertConfigured };
