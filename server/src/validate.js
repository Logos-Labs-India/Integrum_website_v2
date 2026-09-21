// Server-side mirror of the pure validators in src/leads.js (the frontend's
// browser code can't be imported here directly — this is a separate Node
// project). Defense in depth: the client already validates, this just makes
// sure a submission that reaches the API directly can't write garbage rows.

const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

function isValidEmail(raw) {
  return EMAIL_RE.test(String(raw || "").trim().toLowerCase());
}

function isValidPhone(raw) {
  const v = String(raw || "").trim();
  if (!v) return false;
  const digits = v.replace(/[^\d]/g, "");
  if (/^\+/.test(v) && !/^\+91/.test(v)) {
    return digits.length >= 8 && digits.length <= 15;
  }
  let local = digits;
  if (local.length === 12 && local.indexOf("91") === 0) local = local.slice(2);
  else if (local.length === 11 && local.indexOf("0") === 0) local = local.slice(1);
  return local.length === 10 && /^[6-9]/.test(local);
}

function isValidName(raw) {
  const v = String(raw || "").trim();
  return v.length >= 2 && /[A-Za-z]/.test(v);
}

// Returns an object of field -> message for anything invalid, or null.
export function validateLead(data) {
  const errors = {};
  if (!isValidName(data.name)) errors.name = "Missing or invalid name";
  if (!isValidEmail(data.email)) errors.email = "Missing or invalid email";
  if (!isValidPhone(data.phone)) errors.phone = "Missing or invalid phone";
  return Object.keys(errors).length ? errors : null;
}
