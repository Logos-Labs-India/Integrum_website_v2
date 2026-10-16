// The content documents the CMS manages. A key must be listed here before
// the admin can save or publish it — adding a page to the CMS means adding
// its key here and its form schema in src/admin/schemas.js.
export const CONTENT_KEYS = [
  "figures", "investors", "home", "solutions", "platform", "spark", "company",
  "careers", "cases", "articles", "legal", "forms", "site",
];

export const isContentKey = (key) => CONTENT_KEYS.includes(key);

const MAX_BYTES = 1024 * 1024; // one document's JSON, not uploaded files

// Fields holding a link or file location. Their values end up in href/src
// attributes on the public site, so only http(s) URLs and site-relative
// paths are accepted — never javascript:, data: or the like.
const URL_FIELDS = new Set(["url", "src", "poster", "href", "image", "photo"]);
// …or the name of a built-in library image (e.g. "windField") — a bare word
// with no scheme, so it can never be a javascript:/data: link.
const SAFE_URL = /^(https?:\/\/[^\s"'<>]+|\/[^\s"'<>]*|[A-Za-z0-9_-]+)$/i;

function findBadUrl(value, path) {
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const bad = findBadUrl(value[i], `${path}[${i}]`);
      if (bad) return bad;
    }
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      const p = path ? `${path}.${k}` : k;
      if (URL_FIELDS.has(k) && typeof v === "string" && v !== "" && !SAFE_URL.test(v)) return p;
      const bad = findBadUrl(v, p);
      if (bad) return bad;
    }
  }
  return null;
}

// Returns an error message, or null when the document is acceptable.
export function validateContent(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) return "Content must be a JSON object";
  const size = Buffer.byteLength(JSON.stringify(data));
  if (size > MAX_BYTES) return `Content is too large (${size} bytes, limit ${MAX_BYTES})`;
  const bad = findBadUrl(data, "");
  if (bad) return `"${bad}" must be a web address (https://…) or a site path (/…)`;
  return null;
}
