const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
const { config } = require("../config");

const ses = new SESClient({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
});

function escapeHtml(s) {
  return String(s || "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

async function sendCareerApplicationEmail({ name, email, phone, company, role, help, resumeName, resumeLink }) {
  const rows = [
    ["Name", name],
    ["Email", email],
    ["Phone", phone],
    ["Company", company],
    ["Role applied for", role],
  ].filter(([, v]) => v);

  const textLines = rows.map(([k, v]) => `${k}: ${v}`);
  if (help) textLines.push("", "Message:", help);
  if (resumeLink) textLines.push("", `Resume (${resumeName || "attached"}): ${resumeLink}`);

  const htmlRows = rows.map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#555"><strong>${escapeHtml(k)}</strong></td><td style="padding:4px 0">${escapeHtml(v)}</td></tr>`).join("");
  const htmlBody = `
    <table style="font-family:sans-serif;font-size:14px">${htmlRows}</table>
    ${help ? `<p style="font-family:sans-serif;font-size:14px"><strong>Message:</strong><br/>${escapeHtml(help)}</p>` : ""}
    ${resumeLink ? `<p style="font-family:sans-serif;font-size:14px"><strong>Resume:</strong> <a href="${resumeLink}">${escapeHtml(resumeName || "Download")}</a> (link valid 7 days)</p>` : ""}
  `;

  await ses.send(new SendEmailCommand({
    Source: config.email.fromEmail,
    Destination: { ToAddresses: [config.email.hrEmail] },
    Message: {
      Subject: { Data: `New application: ${role || "Careers"} — ${name}` },
      Body: {
        Text: { Data: textLines.join("\n") },
        Html: { Data: htmlBody },
      },
    },
  }));
}

module.exports = { sendCareerApplicationEmail };
