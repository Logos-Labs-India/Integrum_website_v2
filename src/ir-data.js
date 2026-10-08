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
import { FIG } from "./figures";

/* "listed" shows every row. "preipo" locks rows marked from:"listing". */
export const IR_STAGE = "listed";

/* No demo content in this build, so the placeholder banner stays off. */
export const IR_DEMO = false;

/* ---------- top-level sections (drive the pill subnav + routes) ---------- */
export const IR_SECTIONS = [
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
      { key:"others",     label:"Others" },
    ] },

  { key:"announcements", label:"Announcements", kind:"docs",
    title:"Corporate announcements",
    blurb:"Disclosures filed with the stock exchanges, board meeting outcomes and general meeting notices.",
    groups:[
      { key:"filings",  label:"Stock exchange filings" },
      { key:"meetings", label:"Board & general meetings" },
      { key:"ballot",   label:"Postal ballot" },
      { key:"boardcomm", label:"Board and Committees" },
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
    blurb:"Offer documents, issue filings, the industry report and other offer-related documents.",
    groups:[
      { key:"offerdocs",   label:"Offer documents" },
      { key:"issue",       label:"Issue filings" },
      { key:"utilisation", label:"Others" },
    ] },

  { key:"esg", label:"ESG", kind:"docs",
    title:"ESG & sustainability",
    blurb:"Sustainability reporting, safety performance and the policies behind them.",
    groups:[
      { key:"esgreports", label:"Reports" },
      { key:"esgpolicy",  label:"Policies" },
      { key:"certs",      label:"Certifications" },
    ] },

  { key:"directors", label:"Board of Directors", kind:"directors",
    title:"Board of Directors",
    blurb:"Brief profiles of the Directors on the Board of the Company." },
];

/* ---------- hero figures ----------
   v = value · u = unit · k = label · d = qualifier line beneath.
   The tile strip is hidden entirely while this list is empty.        */
export const IR_KPIS = [
  { v:FIG.commissioned, u:" MW", k:"Commissioned capacity",        d:"Operating" },
  { v:FIG.ongoing,      u:" MW", k:"Ongoing projects",             d:"Under development" },
  { v:FIG.co2Total,     u:" t",  k:"CO₂ avoided",                  d:"Cumulative" },
  { v:FIG.states,       u:"",    k:"States with operating assets", d:"TN · KA · GJ · MH" },
];

/* ---------- hero highlight chips ----------
   Short headline claims, shown as pill badges next to the hero copy —
   distinct from IR_KPIS (which are number tiles). The chip strip is
   hidden entirely while this list is empty.                          */
export const IR_HIGHLIGHTS = [
  "Profitable (PAT+) from day one",
  "Crossed ₹500 Cr within 50 months of commencing business",
  "Customers include Fortune 500 companies",
  "Capital efficient — bootstrapped for the first 4 years",
];

/* ---------- documents ----------
   Empty. See the header of this file for the row format.             */
export const IR_DOCS = [
  { sec:"announcements", grp:"meetings", d:"2026-09-02", fy:"FY27",
    t:"Notice of Extra-Ordinary General Meeting — 2 September 2026",
    url:"/assets/IEIL-EGM-2-September-2026.pdf", size:"1.9 MB" },
  { sec:"announcements", grp:"meetings", d:"2026-08-14", fy:"FY26",
    t:"Notice of the 5th Annual General Meeting — FY 2025-26",
    url:"/assets/IEIL-5th-AGM-Notice-2025-26.pdf", size:"748 KB" },
  { sec:"governance", grp:"policies",
    t:"Code of Conduct for Prevention of Insider Trading",
    url:"/assets/policies/IEIL-Code-of-Conduct-Prevention-of-Insider-Trading.pdf", size:"461 KB" },
  { sec:"governance", grp:"policies",
    t:"Fair Disclosure Policy",
    url:"/assets/policies/IEIL-Fair-Disclosure-Policy.pdf", size:"168 KB" },
  { sec:"governance", grp:"policies",
    t:"Code of Conduct & Ethics for Directors & Senior Management",
    url:"/assets/policies/IEIL-Code-of-Conduct-Ethics-Directors-Senior-Management.pdf", size:"227 KB" },
  { sec:"governance", grp:"policies",
    t:"Succession Planning Policy",
    url:"/assets/policies/IEIL-Succession-Planning-Policy.pdf", size:"233 KB" },
  { sec:"governance", grp:"policies",
    t:"Policy on Board Diversity",
    url:"/assets/policies/IEIL-Policy-on-Board-Diversity.pdf", size:"254 KB" },
  { sec:"governance", grp:"policies",
    t:"Policy for Determining Material Subsidiaries",
    url:"/assets/policies/IEIL-Policy-Determining-Material-Subsidiaries.pdf", size:"175 KB" },
  { sec:"governance", grp:"policies",
    t:"Policy on Related Party Transactions",
    url:"/assets/policies/IEIL-Policy-Related-Party-Transactions.pdf", size:"264 KB" },
  { sec:"governance", grp:"policies",
    t:"Preservation and Archival Policy",
    url:"/assets/policies/IEIL-Preservation-and-Archival-Policy.pdf", size:"277 KB" },
  { sec:"governance", grp:"policies",
    t:"Policy for Determination of Materiality & Disclosure of Information",
    url:"/assets/policies/IEIL-Policy-Materiality-Disclosure-of-Information.pdf", size:"283 KB" },
  { sec:"governance", grp:"policies",
    t:"Nomination & Remuneration Policy",
    url:"/assets/policies/IEIL-Nomination-Remuneration-Policy.pdf", size:"264 KB" },
  { sec:"governance", grp:"policies",
    t:"Familiarisation Programmes",
    url:"/assets/policies/IEIL-Familiarisation-Programmes.pdf", size:"245 KB" },
  { sec:"governance", grp:"policies",
    t:"Vigil Mechanism and Whistle Blower Policy",
    url:"/assets/policies/IEIL-Vigil-Mechanism-Whistle-Blower-Policy.pdf", size:"216 KB" },
  { sec:"governance", grp:"policies",
    t:"Dividend Distribution Policy",
    url:"/assets/policies/IEIL-Dividend-Distribution-Policy.pdf", size:"297 KB" },
  { sec:"governance", grp:"policies",
    t:"Policies on Payments to Non-Executive Directors",
    url:"/assets/policies/IEIL-Policy-Payments-to-Non-Executive-Directors.pdf", size:"184 KB" },
  { sec:"governance", grp:"policies",
    t:"Prevention of Sexual Harassment (POSH) Policy",
    url:"/assets/policies/IEIL-POSH-Policy.pdf", size:"711 KB" },
  { sec:"governance", grp:"policies",
    t:"Policy on Materiality (Group Companies, Litigation & Creditors)",
    url:"/assets/policies/IEIL-Materiality-Policy.pdf", size:"173 KB" },
  { sec:"governance", grp:"policies",
    t:"Risk Management Policy",
    url:"/assets/policies/IEIL-Risk-Management-Policy.pdf", size:"449 KB" },
  { sec:"governance", grp:"policies",
    t:"Corporate Social Responsibility (CSR) Policy",
    url:"/assets/policies/IEIL-CSR-Policy.pdf", size:"403 KB" },
  { sec:"offer", grp:"offerdocs", d:"2026-09-24", fy:"FY27",
    t:"Draft Red Herring Prospectus",
    gated:"drhp", url:"/assets/offer/IEIL-Draft-Red-Herring-Prospectus.pdf", size:"11.6 MB" },
  { sec:"offer", grp:"offerdocs", d:"2026-09-24", fy:"FY27",
    t:"Draft Abridged Prospectus",
    gated:"drhp", url:"/assets/offer/IEIL-Draft-Abridged-Prospectus.pdf", size:"553 KB" },
  { sec:"offer", grp:"utilisation", fy:"FY27",
    t:"Industry Report — Indian C&I Renewable Energy Solutions Market (CRISIL Intelligence, Sept 2026)",
    url:"/assets/offer/IEIL-Industry-Report-CRISIL-RE-CI-Market-Assessment.pdf", size:"6.5 MB" },
  { sec:"financials", grp:"statements", fy:"FY26",
    t:"Financial statements & independent auditor's report — FY 2025-26",
    url:"/assets/financials/IEIL-FY2025-26-Financial-Statements-Auditors-Report.pdf", size:"11.7 MB" },
  { sec:"financials", grp:"statements", fy:"FY25",
    t:"Financial statements & independent auditor's report — FY 2024-25",
    url:"/assets/financials/IEIL-FY2024-25-Financial-Statements-Auditors-Report.pdf", size:"8.39 MB" },
  { sec:"financials", grp:"statements", fy:"FY24",
    t:"Financial statements & independent auditor's report — FY 2023-24",
    url:"/assets/financials/IEIL-FY2023-24-Financial-Statements-Auditors-Report.pdf", size:"5.8 MB" },
  { sec:"financials", grp:"statements", fy:"FY23",
    t:"Financial statements & independent auditor's report — FY 2022-23",
    url:"/assets/financials/IEIL-FY2022-23-Financial-Statements-Auditors-Report.pdf", size:"2.69 MB" },
  { sec:"financials", grp:"annual", fy:"FY26",
    t:"5th Annual Report — FY 2025-26",
    url:"/assets/financials/IEIL-5th-Annual-Report-FY2025-26.pdf", size:"24.4 MB" },
  { sec:"financials", grp:"statements", fy:"FY26",
    t:"Restated consolidated financial statements — FY 2025-26",
    url:"/assets/financials/IEIL-FY2025-26-Consolidated-Restated-Financial-Statements.pdf", size:"10.3 MB" },
  { sec:"financials", grp:"statements", fy:"FY26",
    t:"Financial statements of subsidiary — Integrum Energy Services Private Limited — FY 2025-26",
    url:"/assets/financials/IESPL-FY2025-26-Financial-Statements.pdf", size:"8.0 MB" },
  { sec:"financials", grp:"statements", fy:"FY26",
    t:"Financial statements of subsidiary — Integrum Green Assets Private Limited — FY 2025-26",
    url:"/assets/financials/IGAPL-FY2025-26-Financial-Statements.pdf", size:"9.0 MB" },
  { sec:"financials", grp:"statements", fy:"FY26",
    t:"Financial statements of subsidiary — Integrum Green Homes Private Limited — FY 2025-26",
    url:"/assets/financials/IGHPL-FY2025-26-Financial-Statements.pdf", size:"8.3 MB" },
  { sec:"financials", grp:"statements", fy:"FY25",
    t:"Financial statements of subsidiary — Integrum Energy Services Private Limited — FY 2024-25",
    url:"/assets/financials/IESPL-FY2024-25-Financial-Statements.pdf", size:"2.2 MB" },
  { sec:"financials", grp:"statements", fy:"FY25",
    t:"Financial statements of subsidiary — Integrum Green Assets Private Limited — FY 2024-25",
    url:"/assets/financials/IGAPL-FY2024-25-Financial-Statements.pdf", size:"2.6 MB" },
  { sec:"financials", grp:"statements", fy:"FY24",
    t:"Financial statements & independent auditor's report of subsidiary — Integrum Green Assets Private Limited — FY 2023-24",
    url:"/assets/financials/IGAPL-FY2023-24-Financial-Statements-Auditors-Report.pdf", size:"12.3 MB" },
  { sec:"financials", grp:"others", d:"2026-08-31", fy:"FY27",
    t:"Material creditors as on 31 August 2026",
    url:"/assets/financials/IEIL-Material-Creditors-31-August-2026.pdf", size:"27 KB" },
  { sec:"offer", grp:"utilisation", fy:"FY27",
    t:"Shareholding pattern",
    url:"/assets/offer/IEIL-Shareholding-Pattern.pdf", size:"27 KB" },
  { sec:"offer", grp:"utilisation", fy:"FY27",
    t:"DRHP advertisement notice",
    gated:"drhp", url:"/assets/offer/IEIL-DRHP-Advertisement-Notice.pdf", size:"3.9 MB" },
  { sec:"governance", grp:"compliance", fy:"FY25",
    t:"Annual return (Form MGT-7) — FY 2024-25",
    url:"/assets/governance/IEIL-Annual-Return-MGT-7-FY2024-25.pdf", size:"3.7 MB" },
  { sec:"governance", grp:"compliance", fy:"FY24",
    t:"Annual return (Form MGT-7) — FY 2023-24",
    url:"/assets/governance/IEIL-Annual-Return-MGT-7-FY2023-24.pdf", size:"2.9 MB" },
  { sec:"governance", grp:"compliance", fy:"FY23",
    t:"Annual return (Form MGT-7) — FY 2022-23",
    url:"/assets/governance/IEIL-Annual-Return-MGT-7-FY2022-23.pdf", size:"2.1 MB" },
  { sec:"announcements", grp:"boardcomm",
    t:"Terms and composition of committees",
    url:"/assets/governance/IEIL-Terms-and-Composition-of-Committees.pdf", size:"223 KB" },
  { sec:"announcements", grp:"boardcomm",
    t:"Terms and conditions for appointment of Independent Directors",
    url:"/assets/governance/IEIL-Terms-of-Appointment-Independent-Directors.pdf", size:"228 KB" },
  { sec:"financials", grp:"ratings",
    t:"Credit rating report — Integrum Energy Infrastructure Limited",
    url:"/assets/financials/IEIL-Credit-Rating-Report.pdf", size:"290 KB" },
];

/* ---------- board & committees ----------
   Add directors once appointments are confirmed:
     { n:"Full name", r:"Designation", t:"Executive|Independent|Nominee",
       b:"One or two lines of biography." }                           */
export const IR_BOARD = [
  { n:"Anand Lahoti", r:"Chairman, Managing Director & Chief Executive Officer", t:"Executive",
    b:"He has been associated with our Company since incorporation. He holds a bachelor's degree in commerce from St. Xavier's College, University of Calcutta and a master's degree in business administration from ICFAI University, Dehradun. He has approximately seven years of experience in the financial services sector and over 13 years of experience in the renewable energy sector. He was previously associated with First Global Securities Limited, Cipher-Plexus Capital Advisors Private Limited and Atria Brindavan Power Private Limited" },
  { n:"Puneet Goel", r:"Whole-time Director & Chief Operating Officer", t:"Executive",
    b:"He has been associated with our Company since November 2022. He holds a bachelor's degree in technology (mechanical engineering) from Banaras Hindu University, and a post graduate diploma in management from Indian Institute of Management, Lucknow. He has approximately 26 years of experience in the finance, operations, and renewable energy sector, including experience relating to renewable-energy project development, operations and hybrid-energy solutions. He was previously associated with Infosys Technologies Limited, Power Finance Corporation Limited, Crisil Limited, GE Capital International Services, KPMG Advisory Services Private Limited, Greenko Energies Private Limited, Arunachal Pradesh Power Corporation Private Limited, and Atria Brindavan Power Private Limited." },
  { n:"Shyamsundar Maheswari", r:"Non-Executive Director", t:"Non-Executive",
    b:"Shyamsundar Maheswari is one of the Promoters of our Company and is currently the Non-Executive Director on the Board of our Company. He has been associated with our Company since incorporation. He holds a bachelor's degree in science from University of Rajasthan. He has approximately over four decades of experience in the wholesale trading of infrastructure material. He was previously associated with Sri Gayatri Green Power Private Limited and is currently associated with National Trading Co." },
  { n:"Prabir Neogi", r:"Director (Independent, Non-Executive)", t:"Independent",
    b:"He has been associated with our Company since 2024. He holds a bachelor's degree in mechanical engineering from the University of Jadavpur and a diploma in finance and accounting management from American Management Association in association with All India Management Association. He has also completed correspondence education course on strategic management from JMA Management Center Inc. and Senior Executive Programme from London Business School. He has over 45 years of experience in the field of policy formulation, regulatory evolution, business strategy and corporate turn-around. He was previously associated with CESC Limited, Integrated Coal Mining Limited, Noida Power Company Limited, REPL Engineering Limited, Cable Corporation of India." },
  { n:"Usha Ramachandra", r:"Director (Independent, Non-Executive)", t:"Independent",
    b:"She has been associated with our Company since 2024. She holds a bachelor's degree (B.A.) in mathematics, statistics and economics from the Osmania University, Hyderabad, M.A., M.Phil and Ph.D degrees in economics from the University of Hyderabad. She has over two decades of experience in the energy sector. She was previously associated as dean of training programmes and director, centre for energy studies with Administrative Staff College of India, Hyderabad." },
  { n:"Anandkumar Raichand Lunia", r:"Director (Independent, Non-Executive)", t:"Independent",
    b:"He has been associated with our Company since 2026. He holds a bachelor's degree in engineering from Gujarat University and post graduate diploma in management from Indian Institute of Management, Lucknow. He has approximately 19 years of experience in venture capital including five years of experience in seed fund and 14 years of experience in the finance sector. He is currently a partner of India Quotient Advisers LLP and Rushmore Prime LLP and a designated partner of India Quotient Advisers LLP, India Quotient Management Consulting LLP and IQ Business Consulting LLP." },
];

/* Committee names, and one row per director: "C" chair, "M" member, "" none.
   IR_MATRIX rows must line up with the IR_COMMITTEES order.          */
export const IR_COMMITTEES = [];
export const IR_MATRIX = [];

/* ---------- statutory disclosures ----------
   The SEBI LODR Regulation 46 checklist. The particulars are the regulatory
   list itself, not sample data. Set a:"doc" and the row shows a View link
   once the document is uploaded; "pending" shows a dash; "na" shows
   "Not applicable" for rows answered by text rather than a file.     */
export const IR_DISCLOSURES = [
  { p:"Memorandum of Association", a:"doc", url:"/assets/governance/IEIL-Memorandum-of-Association.pdf" },
  { p:"Articles of Association",   a:"doc", url:"/assets/governance/IEIL-Articles-of-Association.pdf" },
];

/* ---------- capacity build-out (shown on the snapshot) ----------
   Empty until the figures are verified. Format:
     { l:"Operational capacity", v:000, max:000, c:"#3E6FD6", s:"MW" }
   The card is hidden entirely while this list is empty.              */
export const IR_OPS = [];

/* ---------- IR contact ---------- */
export const IR_CONTACT = {
  name:"Investor Relations",
  role:"Integrum Energy Infrastructure Ltd.",
  email:"IR@integrumenergy.in",
  phone:"+91-9187713438",
  addr:"Bengaluru, Karnataka, India · CIN U40106KA2021PLC144691",
};

/* ---------- per-route SEO ---------- */
export const IR_META = {
  snapshot:      ["Investor Relations | Integrum Energy", "Financial results, regulatory filings, governance documents and announcements from Integrum Energy Infrastructure Ltd."],
  financials:    ["Investors — Financials | Integrum Energy", "Quarterly results, annual financial statements, annual reports and credit ratings."],
  announcements: ["Investors — Corporate Announcements | Integrum Energy", "Stock exchange filings, board meeting outcomes and general meeting notices."],
  press:         ["Investors — Press Releases | Integrum Energy", "Earnings releases and corporate news from Integrum Energy."],
  presentations: ["Investors — Presentations & Transcripts | Integrum Energy", "Investor presentations, earnings-call audio and transcripts."],
  governance:    ["Investors — Governance | Integrum Energy", "Board and committee composition, policy framework, statutory disclosures and compliance reports."],
  offer:         ["Investors — Offer & IPO | Integrum Energy", "Offer documents, issue filings, the industry report and other offer-related documents."],
  esg:           ["Investors — ESG & Sustainability | Integrum Energy", "Sustainability reporting, safety performance and ESG policies."],
  directors:     ["Investors — Board of Directors | Integrum Energy", "Brief profiles of the Directors of Integrum Energy Infrastructure Ltd."],
};
