import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const RESUME_BUCKET = process.env.AWS_STORAGE_BUCKET_NAME;
export const RESUME_PREFIX = process.env.S3_RESUME_PREFIX || "careers-resumes";
