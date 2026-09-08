const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { config } = require("../config");

const s3 = new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
});

const RESUME_LINK_EXPIRY_SECONDS = 7 * 24 * 60 * 60; // 7 days — the max for SigV4 presigned URLs

function buildResumeKey(originalFilename) {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const safeName = (originalFilename || "resume")
    .replace(/[^A-Za-z0-9._-]/g, "_")
    .slice(-120); // keep it bounded, preserve the extension at the end
  return `${config.s3ResumePrefix}/${yyyy}/${mm}/${now.getTime()}-${safeName}`;
}

async function uploadResume(buffer, key, contentType) {
  await s3.send(new PutObjectCommand({
    Bucket: config.aws.bucket,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  }));
  return key;
}

async function getResumeLink(key, expiresInSeconds = RESUME_LINK_EXPIRY_SECONDS) {
  const command = new GetObjectCommand({ Bucket: config.aws.bucket, Key: key });
  return getSignedUrl(s3, command, { expiresIn: expiresInSeconds });
}

module.exports = { s3, buildResumeKey, uploadResume, getResumeLink };
