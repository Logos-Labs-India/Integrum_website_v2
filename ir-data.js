/* ============================================================
   ir-data.js — single source of truth for the Investor Relations
   section. Plain JS (no JSX) so it loads before investors.jsx.

   This file contains NO sample, demo or placeholder content. Every
   list below is empty and every section renders its empty state until
   real, verified, board-approved material is added here.

   ── TO ADD A DOCUMENT ────────────────────────────────────────
   Drop the PDF in  assets/ir/  then add one row to IR_DOCS:

     { sec:"financials", grp:"results",
       t:"Audited financial results — Q4 & FY26",
       fy:"FY26", q:"Q4", d:"2026-05-21",
       size:"2.1 MB", url:"assets/ir/results-q4-fy26.pdf" },

     sec    section key from IR_SECTIONS below
     grp    group (tab) key within that section
     t      title shown in the list
     fy     financial year the document RELATES TO — drives the year filter
     q      quarter it relates to, where applicable — drives the quarter filter
     d      filing date, YYYY-MM-DD
     size   file size as you want it displayed
     url    path to the file
     from   optional. "listing" marks a row that only applies once listed;
            it renders locked while IR_STAGE is "preipo".

   No JSX editing is required to add, remove or reorder documents.
   ============================================================ */

/* "listed" shows every row. "preipo" locks rows marked from:"listing". */
const IR_STAGE = "listed";

/* No demo content in this build, so the placeholder banner stays off. */
window.IR_DEMO = false;

/* ---------- top-level sections (drive the pill subnav + routes) ---------- */
const IR_SECTIONS = [
  { key:"snapshot", label:"Snapshot", kind:"snapshot",
    title:"Investor relations",
    blurb:"Financial results, regulatory filings, governance documents and company announcements." },

  { key:"financials", label:"Financials", kind:"docs",
    title:"Financials",
    blurb:"Quarterly results, annual financial statements, annual reports and credit ratings.",
    groups:[
      { key:"results",    label:"Quarterly results" },
      { key:"statements", label:"Annual statements", note:"Audited standalone and consolidated financial statements, with the auditors' reports filed alongside them." },
      { key:"annual",     label:"Annual reports",    note:"The annual report, the AGM notice and the annual return for each financial year." },
      { key:"ratings",    label:"Credit ratings" },
    ] },

  { key:"announcements", label:"Announcements", kind:"docs",
    title:"Corporate announcements",
    blurb:"Disclosures filed with the stock exchanges, board meeting outcomes and general meeting notices.",
    groups:[
      { key:"filings",  label:"Stock exchange filings" },
      { key:"meetings", label:"Board & general meetings" },
      { key:"ballot",   label:"Postal ballot" },
    ] },

  { key:"press", label:"Press releases", kind:"docs",
    title:"Press releases",
    blurb:"Quarterly earnings releases and company announcements issued to the media.",
    groups:[
      { key:"prresults", label:"Earnings releases" },
      { key:"prcorp",    label:"Corporate news" },
    ] },

  { key:"presentations", label:"Presentations", kind:"docs",
    title:"Presentations & transcripts",
    blurb:"Investor presentations, earnings-call audio and transcripts.",
    groups:[
      { key:"decks", label:"Investor presentations" },
      { key:"calls", label:"Earnings calls & transcripts" },
    ] },

  { key:"governance", label:"Governance", kind:"docs",
    title:"Governance",
    blurb:"Board and committee composition, the policy framework, statutory disclosures and compliance reports.",
    groups:[
      { key:"board",       label:"Board & committees", kind:"board" },
      { key:"policies",    label:"Policies & code" },
      { key:"disclosures", label:"Statutory disclosures", kind:"disclosures" },
      { key:"compliance",  label:"Compliance reports" },
    ] },

  { key:"offer", label:"Offer & IPO", kind:"docs",
    title:"Offer & IPO",
    blurb:"Offer documents, issue filings and the utilisation of issue proceeds.",
    groups:[
      { key:"offerdocs",   label:"Offer documents" },
      { key:"issue",       label:"Issue filings" },
      { key:"utilisation", label:"Use of proceeds" },
    ] },

  { key:"esg", label:"ESG", kind:"docs",
    title:"ESG & sustainability",
    blurb:"Sustainability reporting, safety performance and the policies behind them.",
    groups:[
      { key:"esgreports", label:"Reports" },
      { key:"esgpolicy",  label:"Policies" },
      { key:"certs",      label:"Certifications" },
    ] },
];

/* ---------- hero figures ----------
   v = value · u = unit · k = label · d = qualifier line beneath.
   The tile strip is hidden entirely while this list is empty.        */
const IR_KPIS = [
  { v:"264.89", u:" MW", k:"Commissioned capacity", d:"Operating" },
  { v:"351.58", u:" MW", k:"Ongoing projects",       d:"Under development" },
  { v:"5,10,949", u:" t", k:"CO₂ avoided",           d:"Cumulative" },
  { v:"4",       u:"",    k:"States with operating assets", d:"TN · KA · GJ · MH" },
];

/* ---------- documents ----------
   Empty. See the header of this file for the row format.             */
const IR_DOCS = [
  { sec:"announcements", grp:"meetings", d:"2026-09-02", fy:"FY27",
    t:"Notice of Extra-Ordinary General Meeting — 2 September 2026",
    url:"assets/IEIL-EGM-2-September-2026.pdf", size:"1.9 MB" },
  { sec:"announcements", grp:"meetings", d:"2026-08-14", fy:"FY26",
    t:"Notice of the 5th Annual General Meeting — FY 2025-26",
    url:"assets/IEIL-5th-AGM-Notice-2025-26.pdf", size:"748 KB" },
];

/* ---------- board & committees ----------
   Add directors once appointments are confirmed:
     { n:"Full name", r:"Designation", t:"Executive|Independent|Nominee",
       b:"One or two lines of biography." }                           */
const IR_BOARD = [];

/* Committee names, and one row per director: "C" chair, "M" member, "" none.
   IR_MATRIX rows must line up with the IR_COMMITTEES order.          */
const IR_COMMITTEES = [];
const IR_MATRIX = [];

/* ---------- statutory disclosures ----------
   The SEBI LODR Regulation 46 checklist. The particulars are the regulatory
   list itself, not sample data. Set a:"doc" and the row shows a View link
   once the document is uploaded; "pending" shows a dash; "na" shows
   "Not applicable" for rows answered by text rather than a file.     */
const IR_DISCLOSURES = [
  { p:"Terms and conditions of appointment of independent directors", a:"pending" },
  { p:"Details of familiarisation programmes imparted to independent directors", a:"pending" },
  { p:"Email address for grievance redressal — compliance@integrumenergy.in", a:"na" },
  { p:"Contact details of the official responsible for investor grievances", a:"pending" },
  { p:"Contact details of the Registrar & Transfer Agent", a:"pending" },
  { p:"Memorandum and Articles of Association", a:"pending" },
  { p:"Composition of the board and its committees", a:"pending" },
  { p:"Policy on determination of materiality of events or information", a:"pending" },
  { p:"Policy on dealing with related party transactions", a:"pending" },
  { p:"Dividend distribution policy", a:"pending" },
  { p:"Annual return under Section 92 of the Companies Act, 2013", a:"pending" },
  { p:"Employee stock option scheme and amendments", a:"pending" },
  { p:"Secretarial compliance report under Regulation 24A", a:"pending" },
  { p:"Statement of deviation or variation in use of issue proceeds (Reg. 32)", a:"pending" },
  { p:"Shareholding pattern under Regulation 31", a:"pending" },
  { p:"Credit ratings obtained for all outstanding instruments", a:"pending" },
  { p:"Schedule of analyst or institutional investor meetings", a:"pending" },
];

/* ---------- capacity build-out (shown on the snapshot) ----------
   Empty until the figures are verified. Format:
     { l:"Operational capacity", v:000, max:000, c:"#3E6FD6", s:"MW" }
   The card is hidden entirely while this list is empty.              */
const IR_OPS = [];

/* ---------- IR contact ---------- */
const IR_CONTACT = {
  name:"Investor Relations",
  role:"Integrum Energy Infrastructure Ltd.",
  email:"compliance@integrumenergy.in",
  phone:"+91 76187 02052",
  addr:"Bengaluru, Karnataka, India · CIN U40106KA2021PLC144691",
};

/* ---------- per-route SEO ---------- */
const IR_META = {
  snapshot:      ["Investor Relations | Integrum Energy", "Financial results, regulatory filings, governance documents and announcements from Integrum Energy Infrastructure Ltd."],
  financials:    ["Investors — Financials | Integrum Energy", "Quarterly results, annual financial statements, annual reports and credit ratings."],
  announcements: ["Investors — Corporate Announcements | Integrum Energy", "Stock exchange filings, board meeting outcomes and general meeting notices."],
  press:         ["Investors — Press Releases | Integrum Energy", "Earnings releases and corporate news from Integrum Energy."],
  presentations: ["Investors — Presentations & Transcripts | Integrum Energy", "Investor presentations, earnings-call audio and transcripts."],
  governance:    ["Investors — Governance | Integrum Energy", "Board and committee composition, policy framework, statutory disclosures and compliance reports."],
  offer:         ["Investors — Offer & IPO | Integrum Energy", "Offer documents, issue filings and utilisation of issue proceeds."],
  esg:           ["Investors — ESG & Sustainability | Integrum Energy", "Sustainability reporting, safety performance and ESG policies."],
};

Object.assign(window, {
  IR_STAGE, IR_SECTIONS, IR_KPIS, IR_DOCS, IR_BOARD, IR_COMMITTEES,
  IR_MATRIX, IR_DISCLOSURES, IR_OPS, IR_CONTACT, IR_META,
});
