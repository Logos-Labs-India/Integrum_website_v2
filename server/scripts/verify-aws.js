#!/usr/bin/env node
/* ============================================================
   verify-aws.js — one-shot sanity check for a fresh deployment:
   confirms the configured credentials can write to the S3 bucket
   and reports the SES sending status, without needing to submit a
   real application through the website first.

   Usage: npm run verify-aws
   ============================================================ */
const { config, assertConfigured } = require("../src/config");
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { SESClient, GetIdentityVerificationAttributesCommand, GetSendQuotaCommand } = require("@aws-sdk/client-ses");

async function main() {
  assertConfigured();
  const s3 = new S3Client({
    region: config.aws.region,
    credentials: { accessKeyId: config.aws.accessKeyId, secretAccessKey: config.aws.secretAccessKey },
  });
  const testKey = `${config.s3ResumePrefix}_verify-aws-${Date.now()}.txt`;

  console.log(`Bucket: ${config.aws.bucket}  Region: ${config.aws.region}`);
  try {
    await s3.send(new PutObjectCommand({ Bucket: config.aws.bucket, Key: testKey, Body: "verify-aws check", ContentType: "text/plain" }));
    console.log("✔ S3 write OK:", testKey);
    await s3.send(new DeleteObjectCommand({ Bucket: config.aws.bucket, Key: testKey }));
    console.log("✔ S3 delete OK (test object cleaned up)");
  } catch (err) {
    console.error("✘ S3 check failed:", err.message);
  }

  const ses = new SESClient({
    region: config.aws.region,
    credentials: { accessKeyId: config.aws.accessKeyId, secretAccessKey: config.aws.secretAccessKey },
  });
  try {
    const quota = await ses.send(new GetSendQuotaCommand({}));
    console.log(`SES send quota: ${quota.Max24HourSend}/24h, rate ${quota.MaxSendRate}/s (sandbox if 200/1)`);
    const identities = [config.email.fromEmail, config.email.hrEmail].filter((v, i, a) => a.indexOf(v) === i);
    const attrs = await ses.send(new GetIdentityVerificationAttributesCommand({ Identities: identities }));
    identities.forEach((id) => {
      const status = attrs.VerificationAttributes[id] ? attrs.VerificationAttributes[id].VerificationStatus : "NotFound";
      console.log(`  ${status === "Success" ? "✔" : "✘"} SES identity ${id}: ${status}`);
    });
    if (quota.Max24HourSend <= 200) {
      console.log(
        "  Note: this AWS account's SES is in sandbox mode — both the FROM and TO addresses must be verified " +
          "identities, and you can only send to verified addresses. Request production access in the SES console " +
          "to email HR addresses that haven't been individually verified."
      );
    }
  } catch (err) {
    console.error("✘ SES check failed:", err.message);
  }
}

main();
