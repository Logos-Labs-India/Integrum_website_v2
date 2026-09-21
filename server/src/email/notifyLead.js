import { mailer, NOTIFY_FROM, NOTIFY_TO } from "./client.js";

// Fields shown in the main details table, in display order. Internal/
// technical fields (resume_bucket, resume_key, page, route_to) are handled
// separately below rather than dumped into this list.
const FIELDS = [
  ["name", "Name"], ["email", "Email"], ["phone", "Phone"], ["company", "Company"],
  ["reason", "Enquiry type"], ["role", "Role applied for"],
  ["industry", "Industry"], ["consumption", "Annual consumption"],
  ["location", "Location"], ["state", "State"],
  ["notes", "Notes"], ["help", "Message"],
];

function formatSubmittedAt(iso) {
  try {
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata",
    }).format(new Date(iso)) + " IST";
  } catch (e) {
    return iso || "";
  }
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatText(row, resumeName) {
  const lines = [
    `New website enquiry — ${row.form || "Form"}`,
    `Submitted: ${formatSubmittedAt(row.submitted_at)}`,
    "",
  ];
  FIELDS.forEach(([key, label]) => {
    if (row[key]) lines.push(`${label}: ${row[key]}`);
  });
  if (resumeName) lines.push(`Résumé: ${resumeName} (attached)`);
  lines.push("", "— This is an automated notification from the Integrum Energy website.");
  return lines.join("\n");
}

function formatHtml(row, resumeName) {
  const rows = FIELDS
    .filter(([key]) => row[key])
    .map(([key, label]) => `
      <tr>
        <td style="padding:9px 16px;border-bottom:1px solid #E6EBF0;color:#6C7E90;font:13px/1.4 -apple-system,Segoe UI,Roboto,sans-serif;white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td>
        <td style="padding:9px 16px;border-bottom:1px solid #E6EBF0;color:#0B2036;font:14px/1.5 -apple-system,Segoe UI,Roboto,sans-serif;">${escapeHtml(row[key]).replace(/\n/g, "<br/>")}</td>
      </tr>`)
    .join("");

  const resumeRow = resumeName ? `
      <tr>
        <td style="padding:9px 16px;border-bottom:1px solid #E6EBF0;color:#6C7E90;font:13px/1.4 -apple-system,Segoe UI,Roboto,sans-serif;white-space:nowrap;vertical-align:top;">Résumé</td>
        <td style="padding:9px 16px;border-bottom:1px solid #E6EBF0;color:#0B2036;font:14px/1.5 -apple-system,Segoe UI,Roboto,sans-serif;">📎 ${escapeHtml(resumeName)} (attached to this email)</td>
      </tr>` : "";

  return `
<div style="background:#F5F7F9;padding:32px 16px;font-family:-apple-system,Segoe UI,Roboto,sans-serif;">
  <table role="presentation" width="100%" style="max-width:560px;margin:0 auto;background:#FFFFFF;border-radius:10px;overflow:hidden;border:1px solid #E6EBF0;">
    <tr>
      <td style="background:#014976;padding:22px 24px;">
        <div style="color:#FFFFFF;font-size:18px;font-weight:700;letter-spacing:-.01em;">Integrum Energy</div>
        <div style="color:#D8E7F1;font-size:13px;margin-top:2px;">New website enquiry</div>
      </td>
    </tr>
    <tr>
      <td style="padding:20px 24px 4px;">
        <div style="font-size:15px;color:#0B2036;">
          <strong>${escapeHtml(row.form || "Website form")}</strong> — ${formatSubmittedAt(row.submitted_at)}
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding:12px 8px 20px;">
        <table role="presentation" width="100%" style="border-collapse:collapse;">
          ${rows}${resumeRow}
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:16px 24px;background:#F5F7F9;border-top:1px solid #E6EBF0;">
        <div style="font-size:12px;color:#6C7E90;">This is an automated notification from the Integrum Energy website. Reply to this email to respond directly to the sender.</div>
      </td>
    </tr>
  </table>
</div>`;
}

// Sends an HTML (with plain-text fallback) notification with the submitted
// form details, with the résumé (if any) attached directly to the email.
// Never throws to the caller — a failed email must not affect whether the
// lead itself was saved (same "never lose the lead" rule as the rest of
// the API).
//
// `attachment`, when given, is { filename, contentType, buffer }.
export async function notifyLead(row, attachment) {
  if (!NOTIFY_FROM || !NOTIFY_TO) {
    console.warn("notifyLead: SES_FROM_EMAIL/HR_EMAIL not configured — skipping email");
    return;
  }
  const resumeName = attachment ? attachment.filename : null;
  try {
    await mailer.sendMail({
      from: `Integrum Energy Website <${NOTIFY_FROM}>`,
      to: NOTIFY_TO,
      replyTo: row.email || undefined,
      subject: `New enquiry — ${row.name || "Website visitor"} (${row.form || "Form"})`,
      text: formatText(row, resumeName),
      html: formatHtml(row, resumeName),
      attachments: attachment ? [{
        filename: attachment.filename,
        content: attachment.buffer,
        contentType: attachment.contentType,
      }] : [],
    });
  } catch (err) {
    console.error("notifyLead: failed to send email:", err);
  }
}
