import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import nodemailer from "nodemailer";
import { config } from "../config.js";

const sesClient = new SESv2Client({
  region: config.awsRegion,
  credentials: {
    accessKeyId: config.awsAccessKeyId,
    secretAccessKey: config.awsSecretAccessKey,
  },
});

// nodemailer composes the MIME message (including attachments) and hands
// the raw bytes to SESv2's SendEmail as Content.Raw — the Content.Simple
// shape used for the plain-text-only version can't carry attachments.
export const mailer = nodemailer.createTransport({
  SES: { sesClient, SendEmailCommand },
});

export const NOTIFY_FROM = config.sesFromEmail;
