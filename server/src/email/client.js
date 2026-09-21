import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import nodemailer from "nodemailer";

const sesClient = new SESv2Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// nodemailer composes the MIME message (including attachments) and hands
// the raw bytes to SESv2's SendEmail as Content.Raw — the Content.Simple
// shape used for the plain-text-only version can't carry attachments.
export const mailer = nodemailer.createTransport({
  SES: { sesClient, SendEmailCommand },
});

export const NOTIFY_FROM = process.env.SES_FROM_EMAIL;

// Used only when a submission doesn't specify its own route_to (or specifies
// something that isn't a valid email) — see notifyLead.js.
export const FALLBACK_NOTIFY_TO = process.env.HR_EMAIL;
