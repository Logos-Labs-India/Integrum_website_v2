#!/usr/bin/env node
/* ============================================================
   get-resume-link.js — regenerate a fresh presigned download
   link for a resume already in S3, for when the one in the
   original HR email has expired.

   Usage:
     npm run resend-link -- careers-resumes/2026/09/....pdf
   ============================================================ */
require("../src/config"); // loads .env
const { getResumeLink } = require("../src/lib/s3");

const key = process.argv[2];
if (!key) {
  console.error("Usage: npm run resend-link -- <s3-key>");
  process.exit(1);
}

getResumeLink(key)
  .then((url) => {
    console.log(url);
  })
  .catch((err) => {
    console.error("Failed to generate link:", err.message);
    process.exit(1);
  });
