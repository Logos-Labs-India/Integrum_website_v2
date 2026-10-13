/* ============================================================
   content/cms.js — CMS content loading.

   Page content lives in plain data modules (figures.js, ir-data.js, …).
   Those modules are the DEFAULTS, built into the bundle. On load we fetch
   whatever the admin has published (GET /api/content) and write it INTO
   those same exported objects/arrays, in place, before any page code is
   imported. Pages keep importing FIG / IR_DOCS exactly as before and simply
   render the published values — no page needs to know about the CMS.

   Order matters: figures are applied before ir-data.js is imported, because
   ir-data computes IR_KPIS from FIG when it first runs.

   If the API is slow or down the site renders the built-in defaults, so a
   CMS outage can never blank the site.
   ============================================================ */
import { API_BASE_URL } from "../apiBase";

const isPlainObject = (v) => !!v && typeof v === "object" && !Array.isArray(v);

/* Each content document: how to load its module, which exports it edits,
   and what type each one must be. A key must also be listed in
   server/src/cms/keys.js and have a form in src/admin/schemas.js. */
export const CONTENT_DEFS = [
  {
    key: "figures",
    load: () => import("../figures"),
    // The whole document is the FIG object itself.
    slots: (m) => ({ "": m.FIG }),
  },
  {
    key: "investors",
    load: () => import("../ir-data"),
    slots: (m) => ({
      highlights: m.IR_HIGHLIGHTS,
      docs: m.IR_DOCS,
      board: m.IR_BOARD,
      disclosures: m.IR_DISCLOSURES,
      videos: m.IR_AV,
      contact: m.IR_CONTACT,
      text: m.IR_TEXT,
      sections: m.IR_SECTIONS,
    }),
  },
  {
    key: "home",
    load: () => import("../home"),
    slots: (m) => ({
      text: m.HOME_TEXT, stats: m.HOME_STATS, segments: m.SEGMENTS, personas: m.PERSONAS,
      whatWeDo: m.WHAT_WE_DO, marquee: m.MARQUEE, proof: m.PROOF, season: m.SEASON,
      spark: m.SPARK, epc: m.EPC_ROWS, badges: m.TRUST_BADGES,
    }),
  },
  {
    key: "solutions",
    load: () => import("../cni"),
    slots: (m) => ({
      text: m.SOL_TEXT, chips: m.SOL_CHIPS, techTeaser: m.TECH_TEASER, solve: m.SOLVE, families: m.FAMILIES,
      solFamilies: m.SOL_FAMILIES, commercial: m.COMMERCIAL, models: m.MODELS, tech: m.TECH,
      impact: m.SOL_IMPACT, risks: m.RISKS, faqs: m.FAQS,
    }),
  },
  {
    key: "platform",
    load: () => import("../platform"),
    slots: (m) => ({
      text: m.PLAT_TEXT, journey: m.JOURNEY_GENERIC, connected: m.CONNECTED, agnostic: m.AGNOSTIC,
      models: m.PLAT_MODELS, lifecycle: m.LIFECYCLE, businesses: m.BUSINESSES, cross: m.CROSS,
      dash: m.EIP_DASH, bess: m.EIP_BESS, oaTags: m.OA_TAGS, calc: m.EIP_CALC,
    }),
  },
  {
    key: "spark",
    load: () => import("../spark"),
    slots: (m) => ({ text: m.SPARK_TEXT, stages: m.SPARK_FULL }),
  },
  {
    key: "company",
    load: () => import("../about"),
    slots: (m) => ({
      text: m.ABOUT_TEXT, vmv: m.VMV, values: m.VALUES, pillars: m.PILLARS, complexity: m.COMPLEXITY,
      evolution: m.EVOLUTION, today: m.TODAY, different: m.DIFFERENT, story: m.STORY_HIGHLIGHTS,
      leaders: m.LEADERS, senior: m.SENIOR, governance: m.GOVERNANCE, principles: m.PRINCIPLES,
      impact: m.ABOUT_STATS, timeline: m.TIMELINE, awards: m.AWARDS, awardFeatures: m.AWARD_FEATURES, certs: m.CERTS,
    }),
  },
  {
    key: "careers",
    load: async () => ({ ...(await import("../careers")), ...(await import("../jobs")) }),
    slots: (m) => ({
      text: m.CAREERS_TEXT, disciplines: m.TEAM_DISCIPLINES, values: m.CAREER_VALUES, culture: m.CAREER_CULTURE,
      photos: m.LIFE_PHOTOS, growth: m.CAREER_GROWTH, awards: m.CAREER_AWARDS, roles: m.CAREER_ROLES,
    }),
  },
  {
    key: "cases",
    load: () => import("../casestudy"),
    slots: (m) => ({
      text: m.CASE_TEXT, headlines: m.CASE_HEADLINES, groups: m.OUTCOME_GROUPS, segments: m.CASE_SEGMENTS, cases: m.CASES,
    }),
  },
  {
    key: "articles",
    load: () => import("../articles"),
    slots: (m) => ({ text: m.ARTICLES_TEXT, articles: m.ARTICLES }),
  },
  {
    key: "legal",
    load: () => import("../legal"),
    slots: (m) => ({ text: m.LEGAL_TEXT, terms: m.LEGAL_CONTENT.terms, privacy: m.LEGAL_CONTENT.privacy, disclaimer: m.LEGAL_CONTENT.disclaimer }),
  },
  {
    key: "forms",
    load: async () => ({ ...(await import("../enquiry")), ...(await import("../dashboard")) }),
    slots: (m) => ({
      enquiry: m.ENQ_TEXT, industries: m.ENQ_INDUSTRIES, states: m.ENQ_STATES, consumption: m.ENQ_CONSUMPTION,
      login: m.LOGIN_TEXT, loginStats: m.LOGIN_STATS,
    }),
  },
  {
    key: "site",
    load: () => import("../site"),
    slots: (m) => ({
      text: m.SITE_TEXT, nav: m.NAV_LINKS, footer: m.FOOTER_COLS, badges: m.FOOTER_BADGES, socials: m.SOCIALS, meta: m.PAGE_META,
    }),
  },
];

// Replace a live export's contents without replacing the object itself,
// so every module holding a reference to it sees the new values.
function overwrite(target, value) {
  if (Array.isArray(target)) {
    if (!Array.isArray(value)) return false;
    target.splice(0, target.length, ...value);
    return true;
  }
  if (isPlainObject(target)) {
    if (!isPlainObject(value)) return false;
    for (const k of Object.keys(target)) delete target[k];
    Object.assign(target, value);
    return true;
  }
  return false;
}

function snapshotOf(slots) {
  if ("" in slots) return structuredClone(slots[""]);
  return Object.fromEntries(Object.entries(slots).map(([k, v]) => [k, structuredClone(v)]));
}

function applyDoc(slots, data, key) {
  if (!isPlainObject(data)) return;
  if ("" in slots) {
    // Merge over the defaults so a figure missing from older published
    // content keeps its built-in value instead of disappearing.
    overwrite(slots[""], { ...slots[""], ...data });
    return;
  }
  for (const [name, target] of Object.entries(slots)) {
    if (!(name in data)) continue;
    if (!overwrite(target, data[name])) console.warn(`[cms] ignored "${key}.${name}": wrong type`);
  }
}

async function fetchJSON(url, { timeout, preview }) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeout);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      ...(preview ? { credentials: "include", headers: { "X-Requested-With": "integrum-admin" } } : {}),
    });
    if (!res.ok) return null;
    const body = await res.json();
    return isPlainObject(body?.content) ? body.content : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/* Built-in defaults, captured before anything published is applied.
   The admin uses these as the starting point for a page that has never
   been published. */
const defaults = {};

/* Loads published content (or, with preview, the signed-in admin's drafts)
   and applies it. Resolves to { preview: boolean } once done. */
export async function loadContent({ preview = false, timeout = 2500 } = {}) {
  const content =
    (preview && await fetchJSON(`${API_BASE_URL}/api/admin/content/preview`, { timeout: 8000, preview: true })) ||
    await fetchJSON(`${API_BASE_URL}/api/content`, { timeout, preview: false }) ||
    {};

  for (const def of CONTENT_DEFS) {
    const mod = await def.load();
    const slots = def.slots(mod);
    if (!(def.key in defaults)) defaults[def.key] = snapshotOf(slots);
    if (content[def.key]) applyDoc(slots, content[def.key], def.key);
  }
  return { preview: preview && Object.keys(content).length > 0 };
}

/* The built-in content for every key, without loading anything published. */
export async function loadDefaults() {
  for (const def of CONTENT_DEFS) {
    if (def.key in defaults) continue;
    const mod = await def.load();
    defaults[def.key] = snapshotOf(def.slots(mod));
  }
  return structuredClone(defaults);
}
