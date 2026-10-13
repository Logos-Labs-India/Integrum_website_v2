/* ============================================================
   admin/schemas.js — the form for each CMS content document.

   Field types:
     text · textarea · date · select · checkbox
     file      upload to S3 (or paste a URL); `sizeTo` names a sibling field
               that receives the uploaded file's size label
     list      repeatable items — `item` is a field (often a group)
     group     a fixed set of named sub-fields

   The page's LAYOUT (sections, tabs, styling) stays in code; these forms
   only edit the content that fills it. A new page needs a schema here and
   its key in content/cms.js and server/src/cms/keys.js.
   ============================================================ */
import { IR_SECTIONS } from "../ir-data";
import { inferSchema } from "./auto";
import { SITE_PAGES } from "../site";
import { FIG } from "../figures";

const DOC_SECTIONS = IR_SECTIONS.filter((s) => s.kind === "docs");
const sectionLabel = (key) => DOC_SECTIONS.find((s) => s.key === key)?.label || key || "—";
const docGroups = (secKey) =>
  (DOC_SECTIONS.find((s) => s.key === secKey)?.groups || []).filter((g) => !g.kind || g.kind === "docs");
const groupLabel = (secKey, grpKey) => docGroups(secKey).find((g) => g.key === grpKey)?.label || grpKey || "—";

const FY_HELP = "The financial year the document relates to, e.g. FY26. Drives the year filter.";

export const SCHEMAS = {
  figures: {
    title: "Company figures",
    description: "Headline numbers shown on the Home, Company and Investors pages. Change a figure here and it updates everywhere it appears.",
    root: {
      type: "group",
      fields: [
        { name: "commissioned", label: "Commissioned capacity (MW)", type: "text", help: "e.g. 264+ — shown as MW operating." },
        { name: "ongoing",      label: "Ongoing projects (MW)",      type: "text", help: "e.g. 351+ — MW under development." },
        { name: "hybrid",       label: "Hybrid capacity (MW)",       type: "text" },
        { name: "greenUnitsMn", label: "Green units generated (million kWh)", type: "text", help: "Cumulative, e.g. 725.81" },
        { name: "co2Total",     label: "CO₂ avoided — cumulative (tonnes)",   type: "text", help: "Indian number format, e.g. 5,11,698" },
        { name: "co2LatestFY",  label: "CO₂ avoided — latest financial year (tonnes)", type: "text" },
        { name: "partners",     label: "Customers served",           type: "text" },
        { name: "states",       label: "States with a presence",     type: "text" },
      ],
    },
  },

  investors: {
    title: "Investor relations",
    description: "Documents, videos, board profiles and contact details on the Investors pages.",
    root: {
      type: "group",
      fields: [
        {
          name: "docs", label: "Documents", type: "list",
          help: "Every downloadable file on the Investors pages. Pick the section and tab it appears under.",
          addLabel: "Add document",
          filters: [{ name: "sec", label: "Section", options: DOC_SECTIONS.map((s) => ({ value: s.key, label: s.label })) }],
          summary: (d) => ({
            title: d.t || "Untitled document",
            meta: `${sectionLabel(d.sec)} › ${groupLabel(d.sec, d.grp)}${d.fy ? " · " + d.fy : ""}${d.gated ? " · disclaimer" : ""}`,
          }),
          newItem: () => ({ sec: DOC_SECTIONS[0].key, grp: docGroups(DOC_SECTIONS[0].key)[0]?.key || "", t: "", url: "" }),
          item: {
            type: "group",
            fields: [
              { name: "t", label: "Title", type: "text", required: true },
              { name: "sec", label: "Section", type: "select", required: true,
                options: () => DOC_SECTIONS.map((s) => ({ value: s.key, label: s.label })),
                // Changing section resets the tab to that section's first one.
                onChange: (item, value) => ({ ...item, sec: value, grp: docGroups(value)[0]?.key || "" }) },
              { name: "grp", label: "Tab", type: "select", required: true,
                options: (item) => docGroups(item.sec).map((g) => ({ value: g.key, label: g.label })) },
              { name: "url", label: "File", type: "file", accept: "application/pdf", sizeTo: "size", required: true },
              { name: "size", label: "Size shown", type: "text", help: "Filled in automatically when you upload.", half: true },
              { name: "d", label: "Filing date", type: "date", half: true },
              { name: "fy", label: "Financial year", type: "text", help: FY_HELP, half: true, placeholder: "FY26" },
              { name: "q", label: "Quarter", type: "select", half: true, allowEmpty: true,
                options: () => ["Q1", "Q2", "Q3", "Q4"].map((q) => ({ value: q, label: q })) },
              { name: "gated", label: "Show the DRHP legal disclaimer before download", type: "checkbox",
                trueValue: "drhp", help: "For the DRHP, the abridged prospectus and the DRHP advertisement." },
            ],
          },
        },
        {
          name: "videos", label: "Statutory audio-visual videos", type: "list",
          help: "Shown on the Investors snapshot, one tab per video. MP4 works in every browser.",
          addLabel: "Add video",
          summary: (v) => ({ title: v.label || "Untitled video", meta: v.src ? v.src.split("/").pop() : "No file yet" }),
          newItem: () => ({ label: "", src: "", poster: "" }),
          item: {
            type: "group",
            fields: [
              { name: "label", label: "Tab label", type: "text", required: true, placeholder: "English" },
              { name: "src", label: "Video file", type: "file", accept: "video/mp4,video/webm", required: true },
              { name: "poster", label: "Cover image (shown before play)", type: "file", accept: "image/jpeg,image/png,image/webp" },
            ],
          },
        },
        {
          name: "highlights", label: "Highlight chips", type: "list",
          help: "Short claims shown as pills beside the Investors heading.",
          addLabel: "Add highlight",
          summary: (h) => ({ title: h || "Empty" }),
          newItem: () => "",
          item: { type: "text", label: "Highlight" },
        },
        {
          name: "board", label: "Board of Directors", type: "list",
          addLabel: "Add director",
          summary: (p) => ({ title: p.n || "Unnamed", meta: [p.r, p.t].filter(Boolean).join(" · ") }),
          newItem: () => ({ n: "", r: "", t: "Independent", b: "" }),
          item: {
            type: "group",
            fields: [
              { name: "n", label: "Full name", type: "text", required: true },
              { name: "r", label: "Designation", type: "text", required: true },
              { name: "t", label: "Category", type: "select",
                options: () => ["Executive", "Non-Executive", "Independent", "Nominee"].map((v) => ({ value: v, label: v })) },
              { name: "b", label: "Profile", type: "textarea", rows: 6 },
            ],
          },
        },
        {
          name: "disclosures", label: "Statutory disclosures", type: "list",
          help: "The Governance › Statutory disclosures table.",
          addLabel: "Add disclosure",
          summary: (r) => ({ title: r.p || "Untitled", meta: { doc: "Document", pending: "Pending", na: "Not applicable", listing: "On listing" }[r.a] || "" }),
          newItem: () => ({ p: "", a: "pending", url: "" }),
          item: {
            type: "group",
            fields: [
              { name: "p", label: "Particulars", type: "text", required: true },
              { name: "a", label: "Status", type: "select",
                options: () => [
                  { value: "doc", label: "Document — shows a View link" },
                  { value: "pending", label: "Pending — shows a dash" },
                  { value: "na", label: "Not applicable" },
                  { value: "listing", label: "Available on listing" },
                ] },
              { name: "url", label: "File", type: "file", accept: "application/pdf", showIf: (r) => r.a === "doc" || r.a === "listing" },
            ],
          },
        },
        {
          name: "contact", label: "Investor contact", type: "group",
          fields: [
            { name: "name", label: "Name / team", type: "text" },
            { name: "role", label: "Organisation", type: "text" },
            { name: "email", label: "Email", type: "text" },
            { name: "phone", label: "Phone", type: "text" },
            { name: "addr", label: "Address line", type: "text" },
          ],
        },
      ],
    },
  },
};

/* ---------- auto pages: sections + label hints ---------- */
const HL = "Wrap a phrase in *asterisks* to show it in the accent colour. Press Enter for a line break.";
const IMG_HELP = "Upload an image, or keep one of the site's built-in pictures.";

SCHEMAS.home = {
  title: "Home page",
  description: "Hero, stats, client segments, lanes, services, outcomes, charts, SPARK stages and contact block.",
  sections: {
    text: { label: "Headings & text", help: "Every heading, paragraph and button label on the home page, top to bottom.", hints: {
      heroEyebrow: { label: "Hero — small label" }, heroTitle: { label: "Hero — heading", help: HL }, heroSub: { label: "Hero — paragraph" },
      heroCta: { label: "Hero — main button" }, heroCta2: { label: "Hero — second button" }, heroPoster: { label: "Hero — still image shown before the video", type: "file", image: true, accept: "image/jpeg,image/png,image/webp", help: IMG_HELP },
      heroStatsLabel: { label: "Hero figures — label" }, heroStat1: { label: "Hero figure 1 caption (number comes from Company figures)" },
      heroStat2: { label: "Hero figure 2 caption" }, heroStat3: { label: "Hero figure 3 caption" },
      segmentsLabel: { label: "Client segments — label" },
      routerTitle: { label: "Lanes — heading" }, routerNote: { label: "Lanes — note" }, routerBadge: { label: "Lanes — badge on the first card" },
      wwdEyebrow: { label: "What we do — small label" }, wwdTitle: { label: "What we do — heading", help: HL }, wwdFoot: { label: "What we do — footer line" },
      proofEyebrow: { label: "Outcomes — small label" }, proofTitle: { label: "Outcomes — heading" }, proofLead: { label: "Outcomes — paragraph" },
      proofContext: { label: "Outcomes — 'Context' label" }, proofSolution: { label: "Outcomes — 'Solution' label" }, proofOutcome: { label: "Outcomes — 'Outcome' label" },
      proofLink: { label: "Outcomes — link text" }, proofNote: { label: "Outcomes — footnote" },
      costEyebrow: { label: "Cost story — small label" }, costTitle: { label: "Cost story — heading", help: HL }, costLead: { label: "Cost story — paragraph" },
      chart1Eyebrow: { label: "Chart 1 — small label" }, chart1Title: { label: "Chart 1 — heading" }, chart1Image: { label: "Chart 1 — image", type: "file", image: true, accept: "image/jpeg,image/png,image/webp,image/svg+xml" }, chart1Caption: { label: "Chart 1 — caption" },
      chart2Eyebrow: { label: "Chart 2 (month-wise) — small label" }, chart2Title: { label: "Chart 2 — heading" }, chart2Caption: { label: "Chart 2 — caption" },
      chart3Eyebrow: { label: "Chart 3 — small label" }, chart3Title: { label: "Chart 3 — heading" }, chart3Image: { label: "Chart 3 — image", type: "file", image: true, accept: "image/jpeg,image/png,image/webp,image/svg+xml" }, chart3Caption: { label: "Chart 3 — caption" },
      sparkEyebrow: { label: "SPARK — small label" }, sparkTitle: { label: "SPARK — heading", help: HL }, sparkLead: { label: "SPARK — paragraph" },
      sparkStageLink: { label: "SPARK — link on each stage" }, sparkCtaStrong: { label: "SPARK — bold start of the closing line" }, sparkCtaNote: { label: "SPARK — rest of the closing line" }, sparkCta: { label: "SPARK — button" },
      epcEyebrow: { label: "Why Integrum — small label" }, epcTitle: { label: "Why Integrum — heading" }, epcFrom: { label: "Why Integrum — left column title" }, epcTo: { label: "Why Integrum — right column title" },
      epcClose: { label: "Why Integrum — closing statement" }, epcCta: { label: "Why Integrum — main button" }, epcCta2: { label: "Why Integrum — second button" },
      askEyebrow: { label: "Contact block — small label" }, askTitle: { label: "Contact block — heading" }, askCta: { label: "Contact block — main button" }, askCta2: { label: "Contact block — second button" },
      askImage: { label: "Contact block — background image", type: "file", image: true, accept: "image/jpeg,image/png,image/webp", help: IMG_HELP },
      callLabel: { label: "Contact — phone label" }, phone: { label: "Contact — phone number" }, emailLabel: { label: "Contact — email label" }, email: { label: "Contact — email address" },
      officeLabel: { label: "Contact — office label" }, office: { label: "Contact — office address" },
    } },
    stats: { label: "Stat bar (under the hero)", hints: { n: { label: "Figure" }, u: { label: "Unit" }, s: { label: "Caption" } } },
    segments: { label: "Client segments ('Trusted by')", hints: { t: { label: "Segment" } } },
    personas: { label: "Lanes ('I'm here to…' cards)", hints: { title: { label: "Card title" }, tag: { label: "Subtitle" }, promise: { label: "Hover text" }, next: { label: "Link text" } } },
    whatWeDo: { label: "What we do — cards", hints: { title: { label: "Card title" }, body: { label: "Card text" }, go: { label: "Opens page", help: "Site path, e.g. cni or spark/a" } } },
    marquee: { label: "Scrolling ribbon words", hints: { v: { label: "Word or phrase" } } },
    proof: { label: "Measured outcomes — case cards", hints: { client: { label: "Client" }, sector: { label: "Sector tag" }, img: { label: "Image" }, go: { label: "'Read the full case' opens", help: "e.g. case/graphite-india" }, buckets: { label: "Outcome highlights", cols: ["Label", "Value"] } } },
    season: { label: "Chart 2 — month-wise generation (thousand kWh)", hints: { m: { label: "Month" }, w: { label: "Wind" }, s: { label: "Solar" } } },
    spark: { label: "SPARK stages (home stepper)", hints: { spark: { fixed: true }, title: { label: "Stage" }, one: { label: "One-line summary" }, line: { label: "Detail line" }, dur: { label: "Duration" }, does: { label: "What we do" }, get: { label: "What you get" } } },
    epc: { label: "Why Integrum — contractor vs Integrum rows", hints: { epc: { cols: ["A typical contractor", "Integrum"] } } },
    badges: { label: "Trust badges", hints: { v: { label: "Badge" } } },
  },
};

/* ---------- shared option lists for the page forms ---------- */
const PAGE_OPTIONS = () => SITE_PAGES.map(([value, label]) => ({ value, label }));
const FIG_OPTIONS = () => Object.keys(FIG).map((k) => {
  const named = SCHEMAS.figures.root.fields.find((f) => f.name === k)?.label || k;
  return { value: k, label: `${named} — now ${FIG[k]}` };
});
const IMG_FIELD = (label, help = IMG_HELP) => ({ label, help, type: "file", image: true, accept: "image/jpeg,image/png,image/webp,image/svg+xml" });
const TEXT_SECTION = (help) => ({ label: "Headings & text", help: help || "Every heading, paragraph and button label on this page, top to bottom." });
const FIG_HINTS = {
  fig: { label: "Number from Company figures", type: "select", allowEmpty: true, options: FIG_OPTIONS, help: "Keeps this tile in step with Company figures. Leave empty to type a fixed value below." },
  v: { label: "…or a fixed value (used only when no figure is chosen)" },
  u: { label: "Unit after the number" }, k: { label: "Caption" }, note: { label: "Small note" },
};

/* Article bodies are a list of mixed blocks — each type shows only its fields. */
const BLOCK_TYPES = [
  { value: "p", label: "Paragraph" }, { value: "h", label: "Sub-heading" }, { value: "eq", label: "Highlighted line / equation" },
  { value: "pull", label: "Pull quote" }, { value: "ul", label: "Bullet list" }, { value: "qh", label: "Numbered question heading" },
  { value: "shift", label: "From → To comparison" }, { value: "table", label: "Table" },
  { value: "assum", label: "Collapsible assumptions" }, { value: "next", label: "'Read next part' box" },
];
const is = (...types) => (b) => types.includes(b.t);
const ARTICLE_BLOCKS = {
  type: "list", addLabel: "Add block",
  summary: (b) => ({
    title: (BLOCK_TYPES.find((x) => x.value === b.t)?.label || "Block"),
    meta: String(Array.isArray(b.v) ? b.v.join(" · ") : b.v || b.from || b.h || (b.head || []).join(" | ") || "").slice(0, 110),
  }),
  newItem: () => ({ t: "p", v: "" }),
  item: {
    type: "group",
    fields: [
      { name: "t", label: "Block type", type: "select", options: () => BLOCK_TYPES,
        onChange: (b, t) => ({ t, v: ["ul", "assum"].includes(t) ? [] : "" }) },
      { name: "n", label: "Number", type: "text", showIf: is("qh"), half: true },
      { name: "h", label: "Heading (shown on the collapsed box)", type: "text", showIf: is("assum") },
      { name: "v", label: "Text", type: "textarea", rows: 4, showIf: is("p", "h", "eq", "pull", "qh", "next") },
      { name: "v", label: "Points", type: "list", addLabel: "Add point", showIf: is("ul", "assum"),
        summary: (x) => ({ title: x || "Empty" }), newItem: () => "", item: { type: "textarea", label: "Point", rows: 2 } },
      { name: "from", label: "From (the old question)", type: "textarea", rows: 2, showIf: is("shift") },
      { name: "to", label: "To (the new question)", type: "textarea", rows: 2, showIf: is("shift") },
      { name: "head", label: "Table header cells", type: "list", addLabel: "Add column", showIf: is("table"),
        summary: (x) => ({ title: x || "Empty" }), newItem: () => "", item: { type: "text", label: "Header" } },
      { name: "rows", label: "Table rows", type: "list", addLabel: "Add row", showIf: is("table"),
        summary: (r) => ({ title: (r || []).join(" | ") || "Empty row" }), newItem: () => [],
        item: { type: "list", label: "Cells", addLabel: "Add cell", summary: (x) => ({ title: x || "Empty" }), newItem: () => "", item: { type: "text", label: "Cell" } } },
      { name: "note", label: "Note under the table", type: "text", showIf: is("table") },
      { name: "to", label: "Links to article (page address)", type: "text", showIf: is("next"), help: "e.g. bess-2-…  — the next article's page address." },
    ],
  },
};

/* ---------- Investors: the page labels and section/tab names ---------- */
SCHEMAS.investors.root.fields.push(
  {
    name: "text", label: "Page labels", type: "group",
    help: "Headings, empty-state messages and sidebar text on the Investors pages.",
    fields: Object.entries({
      eyebrow: "Small label above every heading", avTitle: "Videos — heading", avLead: "Videos — intro",
      whereTitle: "Map — heading", whereSub: "Map — subtitle", whereFoot: "Map — footnote", underDevelopment: "Map — 'under development' label", projectsLabel: "Map — 'projects' label",
      libraryTitle: "Document library — heading", libraryLead: "Document library — intro", documentOne: "'document' (singular)", documentMany: "'documents' (plural)",
      emptyNote: "Empty tab message", listingLock: "'Available on listing' label", boardEmpty: "Empty board message", committeeTitle: "Committee table heading",
      disclosuresEmpty: "Empty disclosures message", railTitle: "Updates box — heading", railText: "Updates box — text", railPlaceholder: "Updates box — email placeholder",
      railSubscribe: "Updates box — subscribe button", railDeck: "Updates box — deck button", contactTitle: "Contact card — heading",
    }).map(([name, label]) => ({ name, label, type: "text" })),
  },
  {
    name: "sections", label: "Sections & tabs", type: "list", fixed: true,
    help: "Titles, intros and tab names of each Investors section. Sections and tabs can be renamed here; adding new ones needs a developer.",
    summary: (s) => ({ title: s.label || "Section", meta: s.title }),
    item: {
      type: "group",
      fields: [
        { name: "label", label: "Menu label", type: "text" },
        { name: "title", label: "Page heading", type: "text" },
        { name: "blurb", label: "Intro", type: "textarea", rows: 2 },
        { name: "groups", label: "Tabs", type: "list", fixed: true, showIf: (s) => Array.isArray(s.groups),
          summary: (g) => ({ title: g.label || "Tab" }),
          item: { type: "group", fields: [
            { name: "label", label: "Tab name", type: "text" },
            { name: "note", label: "Note shown under the tab", type: "textarea", rows: 2 },
          ] } },
      ],
    },
  },
);

/* ---------- Solutions ---------- */
SCHEMAS.solutions = {
  title: "Solutions page",
  description: "Hero, technologies, solution families A–E, commercial models, technology cards, outcomes, risks and FAQ.",
  sections: {
    text: TEXT_SECTION(),
    chips: { label: "Hero — chips", hints: { v: { label: "Chip text" } } },
    techTeaser: { label: "Hero — 'Our technologies' card", hints: { k: { label: "Technology" }, d: { label: "Description" }, flag: { label: "Mark as flagship", type: "checkbox" } } },
    solve: { label: "'What are you trying to solve?' buttons", hints: { k: { label: "Label" }, d: { label: "Text" }, go: { label: "Jumps to section", help: "sol-a … sol-e" } } },
    families: { label: "Principal solution families", hints: { n: { label: "Number" }, t: { label: "Title" }, s: { label: "Subtitle" }, go: { label: "Jumps to section", help: "sol-a … sol-e" } } },
    solFamilies: { label: "Solution families A–E (full sections)", hints: { solFamilies: { fixed: true },
      eyebrow: { label: "Small label" }, h: { label: "Heading" }, copy: { label: "Paragraph" }, listK: { label: "Left list — title" }, list: { label: "Left list" },
      outK: { label: "Right list — title" }, out: { label: "Right list" }, quote: { label: "Show the right list as one big quote", type: "checkbox" }, cta: { label: "Button" }, img: IMG_FIELD("Image"), tag: { hidden: true } } },
    commercial: { label: "Commercial models — summary cards", hints: { k: { label: "Small label" }, t: { label: "Title" }, d: { label: "Text" } } },
    models: { label: "Commercial models — detail cards", hints: { k: { label: "Model" }, title: { label: "Heading" }, desc: { label: "Description" }, meta: { label: "Key facts", cols: ["Label", "Value"] }, cta: { label: "Closing line" } } },
    tech: { label: "Technology cards", hints: { k: { label: "Technology" }, flagship: { label: "Mark as flagship", type: "checkbox" }, tagline: { label: "Heading" }, body: { label: "Text" }, tags: { label: "Tags" } } },
    impact: { label: "Outcome cards", hints: { n: { label: "Big word" }, u: { label: "Word after it" }, k: { label: "Label" }, s: { label: "Text" } } },
    risks: { label: "Risk cards", hints: { k: { label: "Risk" }, head: { label: "Heading" }, body: { label: "Text" } } },
    faqs: { label: "FAQ", hints: { q: { label: "Question" }, a: { label: "Answer" } } },
  },
};

/* ---------- Platform ---------- */
SCHEMAS.platform = {
  title: "Platform page",
  description: "Hero, customer journey, platform reasons, commercial models, lifecycle, businesses, Energy Intelligence product sections.",
  sections: {
    text: TEXT_SECTION("Every heading, paragraph, button and screenshot on the Platform page. The SPARK stages come from the Home page form."),
    journey: { label: "Customer journey — three columns", hints: { landscape: { label: "01 · Energy landscape" }, platform: { label: "02 · Integrum platform" }, portfolio: { label: "03 · Optimised energy portfolio" }, t: { label: "Step" } } },
    connected: { label: "'Energy decisions are connected' cards", hints: { h: { label: "Heading" }, d: { label: "Text" } } },
    agnostic: { label: "Technology-agnostic chips", hints: { v: { label: "Chip" } } },
    models: { label: "Commercial model chips", hints: { k: { label: "Small label" }, t: { label: "Model" } } },
    lifecycle: { label: "Lifecycle cards", hints: { y: { label: "Period" }, d: { label: "Text" } } },
    businesses: { label: "Synergized businesses", hints: { k: { label: "Business" }, d: { label: "Text" } } },
    cross: { label: "Cross-platform examples", hints: { k: { label: "Title" }, seg: { label: "Segment" }, d: { label: "Text" }, go: { label: "Opens case", help: "e.g. case/cloud-nine" } } },
    dash: { label: "Real-time dashboard features", hints: { k: { label: "Feature" }, d: { label: "Text" } } },
    bess: { label: "BESS intelligence points", hints: { k: { label: "Heading" }, d: { label: "Text" } } },
    oaTags: { label: "Open access tracker tags", hints: { v: { label: "Tag" } } },
    calc: { label: "Financial calculators", hints: { k: { label: "Calculator" }, d: { label: "Text" } } },
  },
};
SCHEMAS.platform.sections.text.hints = { heroShot: IMG_FIELD("Hero screenshot"), eipShot: IMG_FIELD("Energy Intelligence screenshot"), heroTitle: { help: HL }, jrnTitle: { help: HL }, dashTitle: { help: HL } };

/* ---------- SPARK ---------- */
SCHEMAS.spark = {
  title: "SPARK page",
  description: "The SPARK framework page: hero, the five stages in full, and the closing call to action.",
  sections: {
    text: { ...TEXT_SECTION(), hints: { heroTitle: { help: HL } } },
    stages: { label: "The five stages", help: "Each stage's name, timing, image, objective, activities and outcome. The five stages and their letters are fixed — they make up the page addresses.",
      hints: { stages: { fixed: true }, name: { label: "Stage name" }, phase: { label: "Timing" }, img: IMG_FIELD("Stage image"), tagline: { label: "Tagline" },
        objective: { label: "Objective" }, activities: { label: "What we do" }, optimizer: { label: "The Integrum optimizer" }, outcome: { label: "Key outcome" } } },
  },
};

/* ---------- Company ---------- */
SCHEMAS.company = {
  title: "Company page",
  description: "Purpose, values, pillars, evolution, scale, leadership, governance, impact, timeline, awards and certifications.",
  sections: {
    text: { ...TEXT_SECTION(), hints: { heroPoster: IMG_FIELD("Hero — still image before the video"),
      vmvEyebrow: { label: "Purpose, vision & mission — small label" }, vmvTitle: { label: "Purpose, vision & mission — heading", help: HL },
      kmpTitle: { label: "Leadership — key management heading" }, smpTitle: { label: "Leadership — senior management heading" },
      priTitle: { label: "PRI strip — heading" }, priText: { label: "PRI strip — text" }, tlEyebrow: { label: "Timeline — small label" }, tlTitle: { label: "Timeline — heading" }, tlLead: { label: "Timeline — intro" } } },
    vmv: { label: "Purpose, vision & mission cards", hints: { k: { label: "Title" }, d: { label: "Text" }, core: { label: "Highlight this card", type: "checkbox" } } },
    values: { label: "Our values", hints: { k: { label: "Value" }, d: { label: "Text" } } },
    pillars: { label: "Strategic pillars", hints: { k: { label: "Pillar" }, d: { label: "Text" } } },
    complexity: { label: "'Why we exist' chips", hints: { v: { label: "Chip" } } },
    evolution: { label: "Our evolution steps", hints: { k: { label: "Step" }, d: { label: "Text" } } },
    today: { label: "Integrum today — figures", help: "The first one is shown large.", hints: FIG_HINTS },
    different: { label: "How we're different", hints: { k: { label: "Title" }, d: { label: "Text" } } },
    story: { label: "Our story — highlight figures", hints: { v: { label: "Figure" }, k: { label: "Text" } } },
    leaders: { label: "Key management personnel", hints: { photo: IMG_FIELD("Photo (square works best)"), name: { label: "Name" }, role: { label: "Designation" }, bio: { label: "Profile" }, creds: { label: "Qualifications line" } } },
    senior: { label: "Senior management personnel", hints: { photo: IMG_FIELD("Photo (square works best)"), name: { label: "Name" }, role: { label: "Designation" }, bio: { label: "Profile" }, creds: { label: "Qualifications line" } } },
    governance: { label: "Governance chips", hints: { v: { label: "Chip" } } },
    principles: { label: "Operating principles", hints: { k: { label: "Principle" }, d: { label: "Text" } } },
    impact: { label: "Our impact — figures", hints: FIG_HINTS },
    timeline: { label: "Company timeline", hints: { y: { label: "Year" }, k: { label: "Milestone" }, d: { label: "Detail (shown on hover)" } } },
    awards: { label: "Awards list", hints: { y: { label: "Year" }, t: { label: "Award" }, o: { label: "Organiser" } } },
    awardFeatures: { label: "Award stories (with photo)", hints: { img: IMG_FIELD("Photo"), y: { label: "Year" }, t: { label: "Award" }, o: { label: "Organiser" }, paras: { label: "Paragraphs", item: { type: "textarea", rows: 3 } } } },
    certs: { label: "Certifications", hints: { img: IMG_FIELD("Certificate image"), t: { label: "Name" }, p: { label: "Details" } } },
  },
};

/* ---------- People / careers ---------- */
SCHEMAS.careers = {
  title: "People & careers",
  description: "People page text, team, culture, photos, growth, awards — and every open role with its full job description.",
  sections: {
    text: { ...TEXT_SECTION(), hints: { heroPoster: IMG_FIELD("Hero — still image before the video") } },
    disciplines: { label: "Team discipline chips", hints: { v: { label: "Discipline" } } },
    values: { label: "Why work with us — cards", hints: { h: { label: "Title" }, p: { label: "Text" } } },
    culture: { label: "Culture cards", hints: { h: { label: "Title" }, p: { label: "Text" } } },
    photos: { label: "Life at Integrum — photos", hints: { src: IMG_FIELD("Photo"), t: { label: "Caption title" }, s: { label: "Caption text" },
      wide: { label: "Wide tile", type: "checkbox" }, tall: { label: "Tall tile", type: "checkbox" }, pos: { label: "Focus point (optional)", help: "e.g. 50% 20% — moves the crop up or down." } } },
    growth: { label: "Learning & growth cards", hints: { h: { label: "Title" }, p: { label: "Text" } } },
    awards: { label: "Awards & certifications badges", hints: { v: { label: "Badge" } } },
    roles: { label: "Open roles", help: "Add a role to list it; remove it to close it. Filters on the page are built from each role's team.", hints: {
      role: { label: "Job title" }, team: { label: "Team (used for the filter)" }, loc: { label: "Location" }, exp: { label: "Experience" }, type: { label: "Employment type" },
      reports: { label: "Reports to" }, blurb: { label: "Short summary (on the card)" }, purpose: { label: "Role purpose" },
      groups: { label: "Responsibilities (grouped)" }, h: { label: "Group title" }, items: { label: "Points" },
      quals: { label: "Qualifications & experience" }, skills: { label: "Key skills" }, preferred: { label: "Preferred" },
      profile: { label: "Ideal candidate" }, jdPending: { label: "Full JD not ready yet — show 'to follow' note", type: "checkbox" },
    } },
  },
};

/* ---------- Case studies & contact ---------- */
SCHEMAS.cases = {
  title: "Case studies & contact page",
  description: "Knowledge Hub case studies (cards, groups, industries, full case pages) and the Contact page text.",
  sections: {
    text: { ...TEXT_SECTION("Labels on the case-study pages, then the Contact page (headings, phone, emails, office address, buttons)."), hints: { heroPoster: IMG_FIELD("Hero — still image before the video") } },
    headlines: { label: "Headline cards (top of the Knowledge Hub)", hints: {
      id: { label: "Opens case (page address)", help: "The case's page address, e.g. graphite-india" }, hl: { label: "Headline metric" }, seg: { label: "Segment" }, sol: { label: "Solution" }, res: { label: "Result" },
      group: { label: "Outcome group", help: "Must match an outcome group's title exactly to appear under it." } } },
    groups: { label: "Outcome groups", hints: { k: { label: "Group title" }, d: { label: "Text" } } },
    segments: { label: "Industry tabs", hints: { name: { label: "Industry" }, blurb: { label: "Text" }, stats: { label: "Figures", cols: ["Figure", "Label"] },
      cases: { label: "Cases shown (page addresses)", item: { label: "Case page address" } } } },
    cases: { label: "Case studies (full pages)", help: "Each case's page lives at /case/<page address>.", hints: {
      id: { label: "Page address", help: "Lower-case words joined by hyphens, e.g. cement-plant-karnataka. Changing it changes the link." },
      sector: { label: "Sector" }, chip: { label: "Tag line" }, cardMetric: { label: "Card metric" }, title: { label: "Title" }, summary: { label: "Summary" }, img: IMG_FIELD("Hero image"),
      meta: { label: "Key facts", cols: ["Label", "Value"] }, metrics: { label: "Outcomes at a glance" }, green: { label: "Show in green", type: "checkbox" },
      body: { label: "Body sections" }, "body.h": { label: "Section heading" }, lead: { label: "Lead-in sentence" }, p: { label: "Paragraph" }, list: { label: "Bullet points" },
      chart: { label: "Show the steel power-mix chart here", type: "checkbox" }, sample: { label: "Illustrative sample (shows a notice)", type: "checkbox" }, techs: { label: "Technology chips" },
    } },
  },
};

/* ---------- Articles ---------- */
SCHEMAS.articles = {
  title: "Knowledge Hub articles",
  description: "Insight articles: listing text, and each article's title, summary and full body.",
  sections: {
    text: TEXT_SECTION("Labels used on the article listing and article pages."),
    articles: { label: "Articles", help: "Each article lives at /case/article/<page address>.", hints: {
      id: { label: "Page address", help: "Lower-case words joined by hyphens. Changing it changes the link." },
      series: { label: "Series" }, part: { label: "Part" }, kicker: { label: "Topic label" }, title: { label: "Title" }, standfirst: { label: "Summary" },
      read: { label: "Reading time" }, tags: { label: "Tags" }, blocks: { label: "Article body", schema: ARTICLE_BLOCKS },
    } },
  },
};

/* ---------- Legal ---------- */
const LEGAL_HINTS = {
  title: { label: "Page title" }, updated: { label: "'Last updated' line" }, intro: { label: "Intro" },
  sections: { label: "Sections" }, h: { label: "Heading" }, sub: { label: "Sub-heading" }, p: { label: "Paragraphs", item: { type: "textarea", rows: 3 } },
  dl: { label: "Definitions", cols: ["Term", "Meaning"], colHints: [{}, { type: "textarea", rows: 3 }] }, ul: { label: "Bullet points" },
  pAfter: { label: "Paragraphs after the bullets", item: { type: "textarea", rows: 3 } }, ulAfter: { label: "Second bullet list" }, mail: { label: "Show the contact email here", type: "checkbox" },
};
SCHEMAS.legal = {
  title: "Legal pages",
  description: "Terms of Use, Privacy Policy and Disclaimer.",
  sections: {
    text: TEXT_SECTION("Labels shared by the three legal pages."),
    terms: { label: "Terms of Use", hints: LEGAL_HINTS },
    privacy: { label: "Privacy Policy", hints: LEGAL_HINTS },
    disclaimer: { label: "Disclaimer", hints: LEGAL_HINTS },
  },
};

/* ---------- Forms ---------- */
SCHEMAS.forms = {
  title: "Forms & sign-in page",
  description: "The customer enquiry form (labels and dropdown choices) and the customer sign-in page's side panel.",
  sections: {
    enquiry: { label: "Enquiry form — text" },
    industries: { label: "Enquiry form — industry choices", hints: { v: { label: "Industry" } } },
    states: { label: "Enquiry form — state choices", hints: { v: { label: "State" } } },
    consumption: { label: "Enquiry form — consumption choices", hints: { v: { label: "Band" } } },
    login: { label: "Sign-in page — side panel", hints: { img: IMG_FIELD("Background image"), image: IMG_FIELD("Background image") } },
    loginStats: { label: "Sign-in page — figures", hints: { v: { label: "Figure" }, k: { label: "Caption" } } },
  },
};

/* ---------- Site-wide ---------- */
SCHEMAS.site = {
  title: "Site-wide: menu, footer & SEO",
  description: "The top menu, footer columns and badges, social links, logos, and each page's Google title and description.",
  sections: {
    text: { label: "Logos & shared labels", hints: { logo: IMG_FIELD("Logo"), navBadge: IMG_FIELD("Badge beside the logo (e.g. Great Place to Work)") } },
    nav: { label: "Top menu", hints: { label: { label: "Menu text" }, page: { label: "Opens", type: "select", options: PAGE_OPTIONS } } },
    footer: { label: "Footer columns", hints: { h: { label: "Column heading" }, links: { label: "Links", cols: ["Link text", "Opens"], colHints: [{}, { type: "select", options: PAGE_OPTIONS }] } } },
    badges: { label: "Footer badges", hints: { v: { label: "Badge" } } },
    socials: { label: "Social links", hints: { label: { label: "Name" }, href: { label: "Profile URL" },
      key: { label: "Icon", type: "select", options: () => ["linkedin", "twitter", "x", "youtube", "instagram", "facebook"].map((v) => ({ value: v, label: v })) } } },
    meta: { label: "Search engine titles & descriptions", help: "What Google and browser tabs show for each page: first the title, then the description.",
      hints: Object.fromEntries(SITE_PAGES.concat([["leads", "Form submissions (internal)"]]).map(([k, l]) => [k, { label: l, fixed: true, item: { type: "textarea", rows: 2 } }])) },
  },
};

// Checks required fields so an incomplete row can't be published. Returns a
// list of human-readable problems (empty when the document is complete).
export function findProblems(schema, value, path = "") {
  const out = [];
  if (schema.type === "group") {
    for (const f of schema.fields) {
      const v = value?.[f.name];
      if (f.showIf && !f.showIf(value || {})) continue;
      if (f.type === "group" || f.type === "list") out.push(...findProblems(f, v, f.label));
      else if (f.required && (v == null || String(v).trim() === "")) out.push(`${path ? path + " — " : ""}${f.label} is empty`);
    }
  } else if (schema.type === "list") {
    (value || []).forEach((item, i) => {
      const where = `${schema.label} #${i + 1}${schema.summary ? ` (${schema.summary(item).title})` : ""}`;
      if (schema.item.type === "group") out.push(...findProblems(schema.item, item, where));
      else if (schema.item.required !== false && String(item ?? "").trim() === "") out.push(`${where} is empty`);
    });
  }
  return out;
}

/* Auto pages (`sections` instead of `root`): the form is inferred from the
   page's built-in content, one block per section, in the order listed. */
export function resolveSchema(key, defaults) {
  const s = SCHEMAS[key];
  if (!s) return null;
  if (s.root) return s;
  const data = defaults?.[key] || {};
  const fields = Object.entries(s.sections)
    .filter(([slot]) => slot in data)
    .map(([slot, sec]) => inferSchema(data[slot], { name: slot, label: sec.label, help: sec.help, hints: sec.hints || {} }));
  return { ...s, root: { type: "group", fields } };
}
