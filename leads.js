/* ============================================================
   leads.js — form submission + lead capture
   ------------------------------------------------------------
   ONE PLACE TO CONFIGURE. Paste your endpoint URL below and every
   form on the site starts delivering to it. Until then, submissions
   are stored in the browser and can be exported as CSV (#leads).

   Attachments: CV uploads are base64-encoded into `resume_file`. Formspree and
   Google Apps Script both accept this; the local backup stores a placeholder
   instead of the blob so the browser quota isn't exhausted.

   Supported endpoints (no code changes needed, just the URL):
     · Formspree      https://formspree.io/f/xxxxxxx
     · Google Sheets  Apps Script web-app URL (see SETUP note below)
     · Any webhook    that accepts a JSON POST
   ============================================================ */
window.LEADS_ENDPOINT = "https://script.google.com/macros/s/AKfycbxtIpOauUYpgZKRt3RRyJlNCogWsV9ALqC03zK-9SAtUwSHM1NJJL7EbyYk0M5P-fQqTw/exec";   // Integrum website leads → Google Sheet

// Lets you trial an endpoint from the #leads screen before committing it to
// this file. Only affects the browser it was set in — production still needs
// the URL above.
function activeEndpoint() {
  try { return localStorage.getItem("integrum_leads_endpoint") || window.LEADS_ENDPOINT || ""; }
  catch (e) { return window.LEADS_ENDPOINT || ""; }
}
function setTestEndpoint(url) {
  try {
    if (url) localStorage.setItem("integrum_leads_endpoint", url);
    else localStorage.removeItem("integrum_leads_endpoint");
    // any change invalidates a previous proof of delivery
    localStorage.removeItem("integrum_leads_verified");
    return true;
  } catch (e) { return false; }
}

// A URL is only "verified" once a POST to it has actually succeeded. Set by
// postLead on the first delivered submission (or by the setup screen's test),
// so the admin panel can never claim a connection that has never worked.
function markVerified(url) {
  try { localStorage.setItem("integrum_leads_verified", url); } catch (e) {}
}
function isVerified() {
  try {
    const u = activeEndpoint();
    return !!u && localStorage.getItem("integrum_leads_verified") === u;
  } catch (e) { return false; }
}

/* ---------- validation ---------- */
// Deliberately strict but not hostile: catches typos, not exotic-but-valid addresses.
const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
const FREE_DOMAINS = ["gmail.com","yahoo.com","yahoo.in","hotmail.com","outlook.com","rediffmail.com","icloud.com","aol.com","proton.me","protonmail.com"];
const DISPOSABLE = ["mailinator.com","tempmail.com","10minutemail.com","guerrillamail.com","yopmail.com","trashmail.com","sharklasers.com"];

function validateEmail(raw, { requireWork = false } = {}) {
  const v = (raw || "").trim().toLowerCase();
  if (!v) return "Please enter your email";
  if (!EMAIL_RE.test(v)) return "Enter a valid email address";
  const domain = v.split("@")[1] || "";
  if (DISPOSABLE.indexOf(domain) !== -1) return "Please use a permanent email address";
  if (requireWork && FREE_DOMAINS.indexOf(domain) !== -1) return "Please use your work email address";
  return null;
}

// Indian mobile numbers: 10 digits starting 6-9, optional +91 / 0 prefix.
// Also accepts a general international form so overseas enquiries aren't blocked.
function validatePhone(raw) {
  const v = (raw || "").trim();
  if (!v) return "Please enter your phone number";
  const digits = v.replace(/[^\d]/g, "");
  if (/^\+/.test(v) && !/^\+91/.test(v)) {
    return digits.length >= 8 && digits.length <= 15 ? null : "Enter a valid phone number";
  }
  let local = digits;
  if (local.length === 12 && local.indexOf("91") === 0) local = local.slice(2);
  else if (local.length === 11 && local.indexOf("0") === 0) local = local.slice(1);
  if (local.length !== 10) return "Enter a 10-digit mobile number";
  if (!/^[6-9]/.test(local)) return "Indian mobile numbers start with 6, 7, 8 or 9";
  return null;
}

function validateName(raw) {
  const v = (raw || "").trim();
  if (!v) return "Please enter your name";
  if (v.length < 2) return "Please enter your full name";
  if (!/[A-Za-z]/.test(v)) return "Please enter a valid name";
  return null;
}

/* ---------- local store (fallback + audit trail) ---------- */
const LS_KEY = "integrum_leads_v1";

function readLeads() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); }
  catch (e) { return []; }
}
function storeLead(lead) {
  try {
    const all = readLeads();
    all.push(lead);
    localStorage.setItem(LS_KEY, JSON.stringify(all));
  } catch (e) { /* storage full or blocked — the POST is the source of truth */ }
}

function clearLeads() {
  try { localStorage.removeItem(LS_KEY); return true; }
  catch (e) { return false; }
}

function leadsToCSV() {
  const rows = readLeads();
  if (!rows.length) return "";
  const cols = Array.from(rows.reduce((s, r) => { Object.keys(r).forEach(k => s.add(k)); return s; }, new Set()));
  const esc = (v) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };
  return [cols.join(",")].concat(rows.map(r => cols.map(c => esc(r[c])).join(","))).join("\n");
}

function downloadLeadsCSV() {
  const csv = leadsToCSV();
  if (!csv) { alert("No submissions stored in this browser yet."); return; }
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "integrum-leads-" + new Date().toISOString().slice(0, 10) + ".csv";
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

/* ---------- submission ---------- */
// Always resolves. Returns { ok, stored, delivered, error }.
async function submitLead(formName, data) {
  const lead = Object.assign({
    form: formName,
    submitted_at: new Date().toISOString(),
    page: location.hash || "#home",
  }, data);

  // Keep the local backup lightweight: an attached file can be megabytes of
  // base64 and would blow the localStorage quota. It still goes in the POST.
  const forStorage = Object.assign({}, lead);
  if (forStorage.resume_file) forStorage.resume_file = "[attached — delivered to endpoint]";
  storeLead(forStorage);

  const url = activeEndpoint();
  if (!url) return { ok: true, stored: true, delivered: false };
  return postLead(url, lead);
}

// Google Apps Script does not answer the CORS preflight that an
// "application/json" content-type triggers, so posts to it must go as
// text/plain (a "simple request"). The script still JSON.parses the body.
async function postLead(url, lead) {
  const isAppsScript = /script\.google\.com/.test(url);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": isAppsScript ? "text/plain;charset=utf-8" : "application/json" },
      body: JSON.stringify(lead),
      redirect: "follow",
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    markVerified(url);
    return { ok: true, stored: true, delivered: true };
  } catch (err) {
    // Never lose the lead: it stays in localStorage for CSV export.
    return { ok: true, stored: true, delivered: false, error: String(err) };
  }
}

// Sends a throwaway row so the connection can be proven before go-live.
async function testEndpoint(url) {
  if (!url) return { ok: false, error: "Enter an endpoint URL first" };
  const res = await postLead(url, {
    form: "Connection test",
    submitted_at: new Date().toISOString(),
    name: "Connection test",
    company: "Integrum website",
    email: "info@integrumenergy.in",
    notes: "Delete this row — sent by the setup screen to verify delivery.",
  });
  return res.delivered
    ? { ok: true }
    : { ok: false, error: res.error || "No response from that URL" };
}

Object.assign(window, {
  submitLead, validateEmail, validatePhone, validateName,
  readLeads, clearLeads, downloadLeadsCSV, leadsToCSV,
  activeEndpoint, setTestEndpoint, testEndpoint, isVerified,
});
