import { S3Client } from "@aws-sdk/client-s3";
import { config } from "../config.js";

export const s3 = new S3Client({
  region: config.awsRegion,
  credentials: {
    accessKeyId: config.awsAccessKeyId,
    secretAccessKey: config.awsSecretAccessKey,
  },
});

export const RESUME_BUCKET = config.resumeBucket;
export const RESUME_PREFIX = config.resumePrefix;
