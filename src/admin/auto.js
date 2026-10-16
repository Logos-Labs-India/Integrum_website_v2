/* ============================================================
   admin/auto.js — builds a form schema from the SHAPE of a page's content.

   Page data uses short keys (t, h, k, v, ic, img…), so labels come from a
   shared dictionary, and each page can override any field through `hints`:

     hints = { fieldName: { label, type, help, hidden, options, rows } }

   Hints apply at every depth, matched by field name; a hint keyed
   "parent.child" applies only under that parent.
   ============================================================ */
import { I } from "../dataviz";

// What the short keys mean across the site's data files.
const LABELS = {
  t: "Title", title: "Title", h: "Heading", heading: "Heading", name: "Name", n: "Name",
  k: "Label", label: "Label", v: "Value", value: "Value", u: "Unit", unit: "Unit",
  d: "Detail", desc: "Description", description: "Description", p: "Text", body: "Text", text: "Text",
  b: "Text", sub: "Subtitle", tag: "Tagline", note: "Note", one: "One-line summary", line: "Line",
  lead: "Intro paragraph", eyebrow: "Small label above the heading", cap: "Caption", caption: "Caption",
  q: "Question", a: "Answer", y: "Year", year: "Year", r: "Role", role: "Role", o: "Organisation", org: "Organisation",
  ic: "Icon", icon: "Icon", img: "Image", image: "Image", photo: "Photo", src: "File", poster: "Cover image", url: "Link / file",
  go: "Links to (site page)", href: "Link", cta: "Button text", metric: "Headline metric", ml: "Metric label",
  client: "Client", sector: "Sector", seg: "Segment", sol: "Solution", res: "Result", group: "Group",
  context: "Context", intervention: "Integrum solution", outcome: "Outcome", buckets: "Outcome highlights",
  does: "What we do", get: "What you get", dur: "Duration", promise: "Promise", next: "Next-step text",
  list: "Bullet points", items: "Items", points: "Points", stats: "Figures", s: "Text", m: "Month",
  bio: "Profile", email: "Email", phone: "Phone", addr: "Address", loc: "Location", location: "Location",
  type: "Type", dept: "Department", exp: "Experience", summary: "Summary", tags: "Tags", date: "Date",
};

// Technical keys an editor never needs: colours, ids, coordinates, routing
// internals. They stay in the data untouched; they just aren't shown.
const HIDDEN = new Set(["id", "hex", "deep", "soft", "color", "glow", "off", "lng", "lat", "primary", "uBig", "esg", "L", "lane", "scroll", "key", "kind"]);

const IMAGE_KEYS = new Set(["img", "image", "photo", "poster", "logo", "bg", "thumb"]);
const FILE_KEYS = new Set(["src", "url", "file", "pdf", "doc", "video"]);
const ICON_KEYS = new Set(["ic", "icon"]);
const LOOKS_LIKE_FILE = /^(\/assets\/|https?:\/\/).+\.(pdf|png|jpe?g|webp|svg|mp4|webm)(\?.*)?$/i;
const LOOKS_LIKE_IMAGE = /\.(png|jpe?g|webp|svg)(\?.*)?$/i;

// camelCase text keys read as "<where> — <what>": heroEyebrow → "Hero — small label".
const PART_WORDS = {
  Eyebrow: "small label", Title: "heading", Lead: "intro", Sub: "subtitle", Text: "text", Note: "note",
  Cta: "button", Cta2: "second button", Close: "closing line", Label: "label", Link: "link", Foot: "footer line",
  P1: "paragraph 1", P2: "paragraph 2", Image: "image", Poster: "image before the video", Caption: "caption",
};
function humanize(k) {
  if (LABELS[k]) return LABELS[k];
  const m = String(k).match(/^([a-z][a-z0-9]*?)((?:[A-Z][a-z]*\d*)+)$/);
  if (m) {
    const parts = m[2].match(/[A-Z][a-z]*\d*/g) || [];
    const last = parts[parts.length - 1];
    if (PART_WORDS[last]) {
      const where = [m[1], ...parts.slice(0, -1)].join(" ").replace(/^./, (c) => c.toUpperCase());
      return `${where} — ${PART_WORDS[last]}`;
    }
  }
  return String(k).replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_-]+/g, " ").replace(/^./, (c) => c.toUpperCase());
}

export const ICON_OPTIONS = Object.keys(I).sort().map((k) => ({ value: k, label: k }));

const hintFor = (hints, name, parent) => (hints && (hints[`${parent}.${name}`] || hints[name])) || {};

function scalarField(name, sample, hint) {
  const base = { name, label: hint.label || humanize(name), help: hint.help, placeholder: hint.placeholder };
  if (hint.type) return { ...base, ...hint, label: base.label };
  if (ICON_KEYS.has(name)) return { ...base, type: "select", allowEmpty: true, options: () => ICON_OPTIONS };
  if (typeof sample === "number") return { ...base, type: "number" };
  if (typeof sample === "boolean") return { ...base, type: "checkbox" };
  const s = typeof sample === "string" ? sample : "";
  if (IMAGE_KEYS.has(name) || (LOOKS_LIKE_FILE.test(s) && LOOKS_LIKE_IMAGE.test(s))) {
    return { ...base, type: "file", accept: "image/jpeg,image/png,image/webp,image/svg+xml", image: true };
  }
  if (FILE_KEYS.has(name) || LOOKS_LIKE_FILE.test(s)) {
    return { ...base, type: "file", accept: /\.(mp4|webm)/i.test(s) ? "video/mp4,video/webm" : "application/pdf,image/jpeg,image/png,image/webp,video/mp4" };
  }
  return { ...base, type: s.length > 90 || s.includes("\n") ? "textarea" : "text", rows: hint.rows };
}

const firstString = (o) => {
  if (typeof o === "string") return o;
  if (Array.isArray(o)) return o.find((x) => typeof x === "string") || "";
  if (!o || typeof o !== "object") return o == null ? "" : String(o);
  for (const k of ["t", "title", "h", "heading", "name", "n", "k", "label", "q", "p", "metric", "client", "role", "text", "v"]) {
    if (typeof o[k] === "string" && o[k]) return o[k];
  }
  return Object.values(o).find((v) => typeof v === "string" && v) || "";
};

// A blank item shaped like the existing ones: text emptied, hidden
// technical values (colours etc.) copied so a new card still renders.
function blankLike(sample) {
  if (Array.isArray(sample)) return sample.map((x) => (typeof x === "string" ? "" : blankLike(x)));
  if (sample && typeof sample === "object") {
    return Object.fromEntries(Object.entries(sample).map(([k, v]) => [
      k, HIDDEN.has(k) ? structuredClone(v) : typeof v === "string" ? "" : typeof v === "number" ? 0 : typeof v === "boolean" ? false : Array.isArray(v) ? [] : blankLike(v),
    ]));
  }
  return typeof sample === "number" ? 0 : "";
}

export function inferSchema(value, { name = "", label, help, hints = {}, parent = "" } = {}) {
  const hint = hintFor(hints, name, parent);
  const lbl = label || hint.label || humanize(name);
  // A hand-written schema for this field wins outright (e.g. article blocks).
  if (hint.schema) return { ...hint.schema, name, label: lbl, help: hint.help ?? hint.schema.help ?? help };

  if (Array.isArray(value)) {
    const sample = value.find((x) => x != null);
    let item;
    if (Array.isArray(sample)) {
      // A fixed-length row such as ["Before", "After"] — edited as columns.
      const cols = hint.cols || sample.map((_, i) => `Column ${i + 1}`);
      const colHints = hint.colHints || [];
      item = { type: "tuple", fields: sample.map((x, i) => scalarField(String(i), x, { label: cols[i], ...(colHints[i] || {}) })) };
    } else if (sample && typeof sample === "object") {
      item = inferSchema(sample, { hints, parent: name, name: "", label: hint.itemLabel || "Item" });
      // Union of keys across all items, so a field only some cards use still shows.
      const seen = new Set(item.fields.map((f) => f.name));
      for (const it of value) {
        for (const k of Object.keys(it || {})) {
          if (seen.has(k) || HIDDEN.has(k) || hintFor(hints, k, name).hidden) continue;
          seen.add(k);
          item.fields.push(...inferSchema({ [k]: it[k] }, { hints, parent: name }).fields);
        }
      }
    } else {
      item = scalarField("v", sample ?? "", { ...hintFor(hints, "v", name), label: hint.itemLabel || "Text", ...(hint.item || {}) });
    }
    return {
      type: "list", name, label: lbl, help: hint.help ?? help, addLabel: hint.addLabel || "Add", fixed: !!hint.fixed,
      summary: (x) => ({ title: String(firstString(x) || "Untitled").slice(0, 120) }),
      newItem: () => (sample === undefined ? "" : blankLike(sample)),
      item,
    };
  }

  if (value && typeof value === "object") {
    const fields = [];
    for (const [k, v] of Object.entries(value)) {
      const h = hintFor(hints, k, name);
      if (HIDDEN.has(k) && !h.type && !h.label) continue;
      if (h.hidden) continue;
      if (v && typeof v === "object") fields.push(inferSchema(v, { name: k, hints, parent: name }));
      else fields.push(scalarField(k, v, h));
    }
    return { type: "group", name, label: lbl, help: hint.help ?? help, fields };
  }

  return scalarField(name, value, hint);
}
