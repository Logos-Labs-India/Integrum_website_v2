/* ============================================================
   site.js — site-wide content: navigation, footer, page titles.
   CMS-editable as "Site-wide: menu, footer & SEO".
   ============================================================ */

/* Pages a menu or footer link can point to. */
export const SITE_PAGES = [
  ["home","Home"],["cni","Solutions"],["platform","Platform"],["case","Knowledge Hub"],["investors","Investors"],
  ["about","Company"],["careers","People"],["spark","SPARK framework"],["contact","Contact"],["dashboard","Customer login"],
  ["privacy","Privacy Policy"],["terms","Terms & Conditions"],["disclaimer","Disclaimer"],
];

export const SITE_TEXT = {
  logo: "/assets/logo-integrum.svg",
  navBadge: "/assets/gptw.png",
  navBadgeAlt: "Great Place to Work Certified",
  customerLogin: "Customer login",
  navCta: "Talk to an advisor",
  footerBlurb: "Integrum Energy Infrastructure Ltd. — hybrid wind + solar plants and lifecycle energy management for India's industrial businesses.",
  footerCopyright: "Integrum Energy Infrastructure Ltd. · CIN U40106KA2021PLC144691 · Bengaluru, India",
  privacyLink: "Privacy Policy",
  termsLink: "Terms & Conditions",
  disclaimerLink: "Disclaimer",
};

export const NAV_LINKS = [
  { label:"Solutions", page:"cni" },
  { label:"Platform", page:"platform" },
  { label:"Knowledge Hub", page:"case" },
  { label:"Investors", page:"investors" },
  { label:"Company", page:"about" },
  { label:"People", page:"careers" },
];

export const SOCIALS = [
  { key:"linkedin",  label:"LinkedIn",  href:"https://www.linkedin.com/company/integrum-energy/" },
];

export const FOOTER_COLS = [
  { h:"Solutions", links:[["Reduce your energy bill","cni"],["Hybrid wind + solar","cni"],["Energy storage · BESS","cni"],["CAPEX · OPEX · EaaS","cni"]] },
  { h:"Platform", links:[["Energy Intelligence","dashboard"],["Customer login","dashboard"],["Open access tracker","dashboard"]] },
  { h:"Investors", links:[["Investor snapshot","investors"],["Financials & filings","investors"],["Governance","investors"],["ESG / BRSR","investors"]] },
  { h:"Company", links:[["Knowledge Hub","case"],["The SPARK difference","spark"],["People","careers"],["Contact","contact"]] },
];

export const FOOTER_BADGES = ["ISO 9001:2015","Great Place to Work","Company of the Year 2024"];

/* per-route SEO: [browser-tab / Google title, meta description] */
export const PAGE_META = {
  home:      ["Integrum Energy | Wind + Solar Hybrid Power for Industry in India", "Wind + solar hybrid plants for India's industrial businesses — lower, predictable power costs and a credible path to 100% renewable (RE 100)."],
  cni:       ["Cut Your Industrial Power Bill — Wind + Solar Hybrid | Integrum Energy", "Hybrid wind + solar, open access, group captive, BESS and EaaS — engineered to take your industrial tariff toward ₹3 per unit."],
  case:      ["Knowledge Hub — Renewable Power for Steel, Cement & More | Integrum Energy", "Real engagements across steel and cement: from 100% conventional to RE 100, and power cost cut from ₹7 to ₹3 per unit."],
  about:     ["About Integrum Energy — Our Story, Impact & Leadership", "Integrum Energy harnesses renewable energy for India's industry, opening a ~70 GW hybrid market. Meet our team and our impact."],
  investors: ["Investors — Snapshot, Financials & Governance | Integrum Energy", "Investor snapshot, financials and governance for Integrum Energy Infrastructure Ltd."],
  dashboard: ["Energy Intelligence Platform | Integrum Energy", "Track live generation, savings and open-access power across your plants on the Integrum Energy Intelligence platform."],
  contact:   ["Contact Integrum Energy — Talk to an Energy Advisor", "Talk to an Integrum Energy consultant about cutting your power cost and reaching 100% renewable. Bengaluru, India."],
  spark:     ["The SPARK Framework — How Integrum Energy Partners | Integrum Energy", "SPARK is Integrum's full-lifecycle partnership: Scan, Plan, Acquire, Run and Keep optimising — from first site scan to a 25-year optimized asset."],
  platform:  ["The Integrum Energy Platform — Develop, Deliver, Structure, Operate, Optimise", "One energy platform built around the customer outcome — development, projects, commercial structuring, O&M and power markets under one accountable partner."],
  careers:   ["People at Integrum Energy — Build the Energy Transition", "Join Integrum Energy: engineering, development, commercial and operations roles opening India's ~70 GW wind + solar hybrid market. See current openings."],
  terms:     ["Terms & Conditions | Integrum Energy", "The terms governing use of the Integrum Energy website, estimates, customer platform and content."],
  privacy:   ["Privacy Policy | Integrum Energy", "How Integrum Energy collects, uses and protects your personal information, and the choices you have."],
  leads:     ["Form submissions | Integrum Energy", "Internal view of captured website enquiries."],
  disclaimer:["Disclaimer | Integrum Energy", "Important notes on the indicative nature of savings estimates, investor content and forward-looking statements."],
};
