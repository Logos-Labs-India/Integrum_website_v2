/* ============================================================
   platform.jsx — Platform page: capabilities Integrum brings
   ============================================================ */
import { useState as useStateP } from "react";
import { I, Reveal, media } from "./dataviz";
import { Rich } from "./content/Rich";
import { SparkSection } from "./home";
import { CustomerEnquiry } from "./enquiry";

const PLAT_LAYERS = [
  { k:"DEVELOP",   d:"Land · Connectivity · Approvals · Resource assessment", ic:"compass" },
  { k:"DELIVER",   d:"Engineering · Procurement · Projects · Commissioning",       ic:"factory" },
  { k:"STRUCTURE", d:"CAPEX · Group Captive · IPP · EaaS",                    ic:"shield" },
  { k:"OPERATE",   d:"Wind O&M · Solar O&M · Asset management · SCADA",       ic:"gauge" },
  { k:"OPTIMISE",  d:"Trading · Scheduling · Forecasting · BESS · Power markets", ic:"trendUp" },
];

export const CONNECTED = [
  { h:"Development affects tariff / timelines", d:"Sub-optimal land or connectivity decisions increase lifecycle cost." },
  { h:"Technology affects generation profile",  d:"Solar alone cannot solve every load curve." },
  { h:"Commercial structure affects returns",   d:"CAPEX, captive and EaaS produce very different economics." },
  { h:"Operations affect lifetime ₹/kWh",       d:"A poorly operated plant destroys the original financial model." },
  { h:"Markets change over time",               d:"Storage, trading and procurement must keep adapting." },
];

export const PLAT_MODELS = [
  { k:"OWN", t:"CAPEX" },
  { k:"BUY POWER", t:"Group Captive / IPP" },
  { k:"SUBSCRIBE", t:"Energy-as-a-Service" },
];

export const LIFECYCLE = [
  { y:"Year 0", d:"Strategy" },
  { y:"Year 1", d:"Development + construction" },
  { y:"Years 2–25", d:"O&M + forecasting + scheduling + optimisation" },
];

export const BUSINESSES = [
  { k:"Renewable Infrastructure & Distributed Energy", d:"Development + projects · commercial + residential / behind-the-meter", ic:"factory" },
  { k:"Asset Management", d:"Performance, contracts and lifetime value of operating assets", ic:"shield" },
  { k:"Operations", d:"Solar + wind O&M", ic:"gauge" },
  { k:"Energy Markets", d:"Trading + scheduling + market procurement", ic:"trendUp" },
  { k:"Energy-as-a-Service", d:"Integrated long-term commercial solutions", ic:"shield" },
];

export const CROSS = [
  { k:"Large industrial hybrid", seg:"Steel manufacturer", d:"Development + projects + Group Captive + O&M", go:"case/khayati-steel" },
  { k:"Commercial portfolio", seg:"Healthcare portfolio", d:"Distributed solar + commercial structure + asset management + power markets + contract demand + BESS", go:"case/cloud-nine" },
  { k:"Multi-asset, multi-location", seg:"Graphite manufacturer", d:"Wind + solar, rooftop, hybrid with hydro, power trading", go:"case/graphite-india" },
];

/* ---- Energy Intelligence Platform (client-supplied copy) ---- */
export const EIP_DASH = [
  { k:"Generation Forecast & Monitor", ic:"bolt",
    d:"Forecast renewable energy generation using weather intelligence, historical plant performance, and AI-powered analytics. Monitor actual generation against forecasts to identify deviations, improve scheduling accuracy, and maximize plant performance." },
  { k:"Consumption Forecast & Monitor", ic:"gauge",
    d:"Predict future electricity demand based on historical consumption, production schedules, seasonal trends, and operational patterns. Better demand forecasting enables optimized procurement, reduced deviation charges, and improved energy planning." },
  { k:"Banking Ledger", ic:"doc",
    d:"Track energy banking balances across different utilities and regulatory jurisdictions with complete transparency. Monitor energy deposits, withdrawals, validity periods, and available banked units to maximize renewable energy utilization." },
  { k:"Surplus & Deficit Management", ic:"trendUp",
    d:"Identify energy surplus and deficit positions in advance using integrated demand and generation forecasts. Receive actionable recommendations to optimize power procurement, banking, storage, or market participation while minimizing energy costs." },
  { k:"Alerts & Reports", ic:"shield",
    d:"Receive intelligent alerts for plant performance, forecast deviations, equipment anomalies, contract obligations, and regulatory deadlines. Generate customizable reports covering energy performance, financial savings, operational KPIs, and sustainability metrics." },
];

export const EIP_BESS = [
  { k:"When to charge",
    d:"Identify the optimal charging window based on renewable surplus, low electricity tariffs, and market opportunities to maximize battery utilization while minimizing charging costs." },
  { k:"When to discharge",
    d:"Determine the ideal discharge schedule during peak demand, high market prices, or critical operational periods to maximize financial returns and improve energy reliability." },
];

export const EIP_CALC = [
  { k:"Electricity Bill Estimator",
    d:"Estimate your monthly electricity costs by comparing conventional grid power with renewable energy alternatives. Input your connected load, monthly consumption, tariff category, location, and operating profile to evaluate potential cost savings." },
  { k:"Overall Project Savings",
    d:"Estimate project investment, annual savings, payback period, internal rate of return, and lifetime financial benefits for all installations based on your consumption profile and available site area." },
];

export const JOURNEY_GENERIC = {
  landscape: [
    "Multiple energy sources & suppliers",
    "High grid dependence and energy costs",
    "Complex consumption patterns",
    "Fragmented energy data",
    "Regulatory & commercial complexity",
    "Limited visibility across the portfolio",
  ],
  platform: [
    { ic:"search",   t:"Assess energy demand & consumption" },
    { ic:"sun",      t:"Design the optimal Solar + Wind portfolio" },
    { ic:"doc",      t:"Structure Open Access & Captive solutions" },
    { ic:"battery",  t:"Integrate BESS / storage" },
    { ic:"trendUp",  t:"Source residual & market power" },
    { ic:"gauge",    t:"Forecast & Schedule energy flows" },
    { ic:"link",     t:"Settle & Reconcile energy transactions" },
    { ic:"bolt",     t:"Monitor generation, consumption & savings" },
    { ic:"factory",  t:"Operate & Maintain energy assets" },
    { ic:"compass",  t:"Optimise the portfolio continuously" },
  ],
  portfolio: [
    "Optimized blended cost of energy",
    "Higher renewable share",
    "Optimised generation & consumption",
    "Improved asset utilisation",
    "Greater visibility & control",
    "Reduced energy risk",
    "Continuous savings optimisation",
    "One accountable energy partner",
  ],
};

const JOURNEY = {
  before: ["Grid power at a high blended tariff","Low renewable share","Multiple suppliers","High tariff volatility"],
  design: ["18.9 MW wind","8.8 MWp solar","BESS","Captive structure","Market procurement for residual power, sale of surplus power","Integrated O&M + scheduling"],
  outcome:["Materially lower blended cost of energy","80.7% renewable share","Long-term visibility","Single accountable partner"],
};

/* ---------- page text (CMS-editable) ---------- */
export const PLAT_TEXT = {
  breadcrumb: "Platform",
  heroEyebrow: "Design · Develop · Execute · Operate · Optimise",
  heroTitle: "One energy platform.\nBuilt around the customer outcome.",
  heroSub: "From strategy and project development to execution, operations and power markets — Integrum brings the capabilities together under one accountable platform.",
  heroCta: "Bring us your energy challenge",
  heroCta2: "Customer login",
  quickBadge: "Quickest to deliver",
  quickText: "We carry the pre-project work — land acquisition, base-level approvals, government orders and existing PSS capacity — so your project starts from a proven position and completes faster.",
  heroShotTitle: "Daily generation vs consumption",
  heroShot: "/assets/plat-generation.png",
  heroShotNote: "Live view from the Energy Intelligence platform",
  enlarge: "Enlarge",
  sparkNote: "A renewable project is not an isolated asset. Land, connectivity, financing, generation, operations and market procurement all determine the final cost of energy. Integrum brings these decisions onto one platform.",
  jrnEyebrow: "A customer journey through the Integrum platform",
  jrnTitle: "From fragmented energy decisions\nto one optimised energy portfolio*.*",
  jrnSub: "Integrum brings sourcing, generation, consumption, operations and optimisation together on one integrated energy platform, managing the complete energy lifecycle for the customer.",
  jrnCol1: "Energy landscape",
  jrnCol2: "Integrum platform",
  jrnCol3: "Optimised energy portfolio",
  jrnFootBrand: "INTEGRUM",
  jrnFoot: "Integrum manages the energy lifecycle end-to-end, from understanding the requirement to continuously optimising the portfolio.",
  jrnNote: "Our solutions and outcomes are tailored to each customer based on their load profile, regulatory framework and commercial structure.",
  connEyebrow: "Why a platform",
  connTitle: "Energy decisions are connected.",
  connClose: "The most optimized energy outcome comes from optimising all five together.",
  agnEyebrow: "Technology agnostic",
  agnTitle: "We choose the mix based on your load and economics.",
  agnLead: "Not based on what we need to sell.",
  modelsTitle: "One platform. Multiple commercial models.",
  modelsNote: "The technology is optimised around the load. The commercial structure is optimised around the customer's capital and risk appetite.",
  lifeEyebrow: "Lifecycle accountability",
  lifeTitle: "Accountability doesn't stop at commissioning.",
  lifeClose: "Integrum stays involved for the period over which the customer's energy economics actually matter.",
  bizEyebrow: "Synergized businesses",
  bizTitle: "Five synergized businesses on one platform.",
  crossTitle: "Cross-platform capability in practice",
  eipEyebrow: "Energy Intelligence Platform",
  eipTitle: "Your energy. Visible. Intelligent. Always on.",
  eipP1: "The Integrum Energy Intelligence Platform transforms energy data into actionable business intelligence. Built for modern enterprises, it unifies renewable energy operations, power procurement, forecasting, battery intelligence, market participation, and regulatory compliance into a single digital ecosystem.",
  eipP2: "Whether you are managing captive assets, open access power, hybrid renewable portfolios, or battery storage, the platform enables smarter decisions that reduce energy costs, improve reliability, and maximize renewable energy utilization.",
  eipCta: "Request a platform demo",
  eipShotTitle: "Energy Intelligence · Generation vs consumption",
  eipShot: "/assets/plat-settlement.png",
  eipShotNote: "Live view from the Energy Intelligence platform · click the chart to view it full size",
  dashEyebrow: "Real-time dashboard",
  dashTitle: "One dashboard.\nComplete energy visibility.",
  dashLead: "Monitor your entire energy portfolio through a centralized dashboard that provides real-time visibility into renewable generation, energy consumption, grid dependency, financial savings, and operational performance. Designed for business leaders and energy managers, the dashboard delivers the insights required to optimize energy decisions every day.",
  bessEyebrow: "BESS intelligence",
  bessTitle: "Maximize the value of every stored unit of energy.",
  bessText: "Battery Energy Storage Systems become significantly more valuable when powered by intelligent decision-making. Integrum continuously analyzes electricity prices, renewable generation, demand forecasts, battery health, and operational constraints to determine the most profitable charging and discharging strategy.",
  oaEyebrow: "Open access tracker",
  oaTitle: "Simplify open access energy management.",
  oaP1: "Manage every aspect of your Open Access portfolio from a single platform. Track approvals, scheduling, banking, wheeling charges, transmission losses, settlement reports, invoices, and regulatory compliance across multiple states.",
  oaP2: "Gain complete visibility into your renewable energy transactions while ensuring seamless operational and financial management.",
  calcEyebrow: "Financial modelling",
  calcTitle: "Quantify the financial value of renewable energy.",
  calcLead: "Evaluate renewable energy opportunities using intelligent financial calculators designed specifically for commercial and industrial consumers. Generate realistic savings estimates based on your energy profile, consumption patterns, tariff structures, and investment preferences.",
  zoomCaption: "Energy Intelligence platform view",
};

export const AGNOSTIC = ["Wind","Solar","Hybrid","BESS","Grid","Power Markets"];
export const OA_TAGS = ["Approvals","Scheduling","Banking","Wheeling charges","Transmission losses","Settlements","Invoices","Compliance"];

const scrollToEnquiry = () => {
  const el = document.getElementById("energy-challenge");
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior:"smooth" });
};

const DASH_LEGEND = [
  ["#22C55E","Generation"], ["#86EFAC","Banking Loss (8%)"], ["#EF4444","Consumption"],
  ["#2DD4BF","Matched Settlement"], ["#3B82F6","Settlement with Banking"],
  ["#F59E0B","Lapsed Units"], ["#F87171","Grid Consumption"],
];

export function Platform({ nav }) {
  const [zoom, setZoom] = useStateP(false);
  return (
    <div className="page-fade plat-page">
      {/* hero */}
      <section className="plat-hero">
        <div className="plat-hero-glow" aria-hidden="true"></div>
        <div className="shell plat-hero-grid">
          <div>
            <div className="breadcrumb" style={{ color:"#9FC1DC" }}>
              <a onClick={()=>nav("home")} style={{ cursor:"pointer", color:"#BFD8EC" }}>Home</a> <span>/</span> <span>{PLAT_TEXT.breadcrumb}</span>
            </div>
            <span className="eyebrow" style={{ color:"var(--solar)", marginTop:18, display:"inline-flex" }}>{PLAT_TEXT.heroEyebrow}</span>
            <h1><Rich text={PLAT_TEXT.heroTitle}/></h1>
            <p className="plat-hero-sub">{PLAT_TEXT.heroSub}</p>
            <div className="plat-hero-cta">
              <button className="btn btn-solar btn-lg" onClick={()=>scrollToEnquiry()}>{PLAT_TEXT.heroCta} {I.arrow()}</button>
              <button className="btn btn-ghost-light btn-lg" onClick={()=>nav("dashboard")}>{PLAT_TEXT.heroCta2}</button>
            </div>
            <div className="plat-quickest">
              <span className="pq-badge">{I.bolt({width:16,height:16})} {PLAT_TEXT.quickBadge}</span>
              <p>{PLAT_TEXT.quickText}</p>
            </div>
          </div>
          <div className="plat-hero-shot">
            <div className="phs-win">
              <div className="phs-bar"><span></span><span></span><span></span><em>{PLAT_TEXT.heroShotTitle}</em></div>
              <button className="phs-img" onClick={()=>setZoom(media(PLAT_TEXT.heroShot))} title="Click to enlarge">
                <img src={media(PLAT_TEXT.heroShot)} alt={PLAT_TEXT.heroShotTitle} loading="eager"/>
                <span className="mk-zoom">{I.search({width:15,height:15})} {PLAT_TEXT.enlarge}</span>
              </button>
            </div>
            <span className="phs-note">{PLAT_TEXT.heroShotNote}</span>
          </div>
        </div>
      </section>

      {/* SPARK framework (replaces the platform flow diagram) */}
      <SparkSection nav={nav} note={PLAT_TEXT.sparkNote}/>
      {/* customer journey through the platform */}
      <section className="section jrn-sec">
        <div className="shell">
          <Reveal className="jrn-head">
            <span className="eyebrow">{PLAT_TEXT.jrnEyebrow}</span>
            <h2><Rich text={PLAT_TEXT.jrnTitle} hl="jrn-dot"/></h2>
            <p className="jrn-sub">{PLAT_TEXT.jrnSub}</p>
          </Reveal>
          <div className="jrn-row">
            <Reveal className="jrn-card is-landscape">
              <div className="jrn-card-top">
                <span className="jrn-ic">{I.trendUp({width:20,height:20})}</span>
                <div><span className="jrn-n">01</span><span className="jrn-t">{PLAT_TEXT.jrnCol1}</span></div>
              </div>
              <ul className="jrn-list">{JOURNEY_GENERIC.landscape.map((x,i)=>(<li key={i}>{x}</li>))}</ul>
            </Reveal>
            <span className="jrn-arrow" aria-hidden="true">{I.arrow({width:20,height:20})}</span>
            <Reveal delay={80} className="jrn-card is-platform">
              <div className="jrn-card-top">
                <span className="jrn-ic">{I.gauge({width:20,height:20})}</span>
                <div><span className="jrn-n">02</span><span className="jrn-t">{PLAT_TEXT.jrnCol2}</span></div>
              </div>
              <ul className="jrn-list jrn-list-ic">
                {JOURNEY_GENERIC.platform.map((x,i)=>(
                  <li key={i}><span className="jli">{I[x.ic]({width:15,height:15})}</span>{x.t}</li>
                ))}
              </ul>
            </Reveal>
            <span className="jrn-arrow" aria-hidden="true">{I.arrow({width:20,height:20})}</span>
            <Reveal delay={160} className="jrn-card is-portfolio">
              <div className="jrn-card-top">
                <span className="jrn-ic">{I.handshake({width:20,height:20})}</span>
                <div><span className="jrn-n">03</span><span className="jrn-t">{PLAT_TEXT.jrnCol3}</span></div>
              </div>
              <ul className="jrn-list">{JOURNEY_GENERIC.portfolio.map((x,i)=>(<li key={i}>{x}</li>))}</ul>
            </Reveal>
          </div>
          <Reveal className="jrn-foot">
            <span className="jrn-foot-mark">{I.award({width:22,height:22})}</span>
            <span className="jrn-foot-brand">{PLAT_TEXT.jrnFootBrand}</span>
            <p>{PLAT_TEXT.jrnFoot}</p>
          </Reveal>
          <p className="jrn-note">{PLAT_TEXT.jrnNote}</p>
        </div>
      </section>

      {/* energy decisions are connected */}
      <section className="section">
        <div className="shell">
          <Reveal className="sec-head">
            <span className="eyebrow">{PLAT_TEXT.connEyebrow}</span>
            <h2>{PLAT_TEXT.connTitle}</h2>
          </Reveal>
          <div className="conn-grid">
            {CONNECTED.map((c,i)=>(
              <Reveal key={i} delay={i*60} className="conn-card">
                <span className="conn-n">{String(i+1).padStart(2,"0")}</span>
                <h4>{c.h}</h4>
                <p>{c.d}</p>
              </Reveal>
            ))}
          </div>
          <Reveal><p className="conn-close">{PLAT_TEXT.connClose}</p></Reveal>
        </div>
      </section>

      {/* technology agnostic + commercial models */}
      <section className="section" style={{ background:"var(--surface-2)" }}>
        <div className="shell">
          <Reveal className="sec-head">
            <span className="eyebrow">{PLAT_TEXT.agnEyebrow}</span>
            <h2>{PLAT_TEXT.agnTitle}</h2>
            <p className="lead">{PLAT_TEXT.agnLead}</p>
          </Reveal>
          <div className="agnostic-row">
            {AGNOSTIC.map((t,i)=>(<span className="agn-chip" key={i}>{t}</span>))}
          </div>
          <Reveal>
            <h3 className="fam-title">{PLAT_TEXT.modelsTitle}</h3>
            <div className="comm-row">
              {PLAT_MODELS.map((m,i)=>(
                <div className="comm-card" key={i}>
                  <span className="comm-k">{m.k}</span>
                  <span className="comm-t">{m.t}</span>
                </div>
              ))}
            </div>
            <p className="plat-note">{PLAT_TEXT.modelsNote}</p>
          </Reveal>
        </div>
      </section>

      {/* lifecycle accountability */}
      <section className="section">
        <div className="shell">
          <Reveal className="sec-head">
            <span className="eyebrow">{PLAT_TEXT.lifeEyebrow}</span>
            <h2>{PLAT_TEXT.lifeTitle}</h2>
          </Reveal>
          <div className="life-row">
            {LIFECYCLE.map((l,i)=>(
              <Reveal key={i} delay={i*70} className="life-card">
                <span className="life-y">{l.y}</span>
                <span className="life-d">{l.d}</span>
              </Reveal>
            ))}
          </div>
          <Reveal><p className="conn-close">{PLAT_TEXT.lifeClose}</p></Reveal>
        </div>
      </section>

      {/* businesses + cross-platform examples */}
      <section className="section" style={{ background:"var(--surface-2)" }}>
        <div className="shell">
          <Reveal className="sec-head">
            <span className="eyebrow">{PLAT_TEXT.bizEyebrow}</span>
            <h2>{PLAT_TEXT.bizTitle}</h2>
          </Reveal>
          <div className="biz-grid">
            {BUSINESSES.map((b,i)=>(
              <Reveal key={i} delay={i*60} className="biz-card">
                <span className="biz-ico">{I[b.ic]({width:20,height:20})}</span>
                <h4>{b.k}</h4>
                <p>{b.d}</p>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <h3 className="fam-title">{PLAT_TEXT.crossTitle}</h3>
            <div className="cross-list">
              {CROSS.map((c,i)=>(
                <button className="cross-row" key={i} onClick={()=>nav(c.go)}>
                  <span className="cr-k">{c.k}</span>
                  <span className="cr-seg">{c.seg}</span>
                  <span className="cr-d">{c.d}</span>
                  <span className="cr-go">{I.arrow({width:16,height:16})}</span>
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---- Energy Intelligence Platform (product) ---- */}
      <section className="section eip-hero-light" id="energy-intelligence">
        <div className="shell eip-hero-grid">
          <Reveal>
            <span className="eyebrow">{PLAT_TEXT.eipEyebrow}</span>
            <h2 className="eip-h">{PLAT_TEXT.eipTitle}</h2>
            <p className="eip-p">{PLAT_TEXT.eipP1}</p>
            <p className="eip-p">{PLAT_TEXT.eipP2}</p>
            <button className="btn btn-nav-cta btn-lg" style={{ marginTop:26 }} onClick={()=>nav("contact")}>{PLAT_TEXT.eipCta} {I.arrow()}</button>
          </Reveal>
          <Reveal delay={110} className="eip-mock">
            <div className="mk-win">
              <div className="mk-bar"><span></span><span></span><span></span><em>{PLAT_TEXT.eipShotTitle}</em></div>
              <button className="mk-shot" onClick={()=>setZoom(media(PLAT_TEXT.eipShot))} title="Click to enlarge">
                <img src={media(PLAT_TEXT.eipShot)} alt={PLAT_TEXT.eipShotTitle} loading="lazy"/>
                <span className="mk-zoom">{I.search({width:15,height:15})} {PLAT_TEXT.enlarge}</span>
              </button>
            </div>
            <span className="eip-mock-note">{PLAT_TEXT.eipShotNote}</span>
          </Reveal>
        </div>
      </section>

      {/* real-time dashboard */}
      <section className="section">
        <div className="shell">
          <Reveal className="sec-head">
            <span className="eyebrow">{PLAT_TEXT.dashEyebrow}</span>
            <h2><Rich text={PLAT_TEXT.dashTitle}/></h2>
            <p className="lead">{PLAT_TEXT.dashLead}</p>
          </Reveal>
          <div className="eip-grid">
            {EIP_DASH.map((f,i)=>(
              <Reveal key={i} delay={i*60} className="eip-card">
                <span className="eip-ico">{I[f.ic]({width:20,height:20})}</span>
                <h4>{f.k}</h4>
                <p>{f.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* BESS intelligence + open access tracker */}
      <section className="section" style={{ background:"var(--surface-2)" }}>
        <div className="shell">
          <div className="eip-two">
            <Reveal className="eip-block">
              <span className="eyebrow">{PLAT_TEXT.bessEyebrow}</span>
              <h3>{PLAT_TEXT.bessTitle}</h3>
              <p>{PLAT_TEXT.bessText}</p>
              <div className="eip-sub">
                {EIP_BESS.map((b,i)=>(
                  <div className="eip-subitem" key={i}>
                    <h5>{b.k}</h5>
                    <p>{b.d}</p>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal className="eip-block" delay={80}>
              <span className="eyebrow">{PLAT_TEXT.oaEyebrow}</span>
              <h3>{PLAT_TEXT.oaTitle}</h3>
              <p>{PLAT_TEXT.oaP1}</p>
              <p>{PLAT_TEXT.oaP2}</p>
              <div className="eip-tags">
                {OA_TAGS.map((t,i)=>(<span key={i}>{t}</span>))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* savings calculators */}
      <section className="section">
        <div className="shell">
          <Reveal className="sec-head">
            <span className="eyebrow">{PLAT_TEXT.calcEyebrow}</span>
            <h2>{PLAT_TEXT.calcTitle}</h2>
            <p className="lead">{PLAT_TEXT.calcLead}</p>
          </Reveal>
          <div className="eip-calc-grid">
            {EIP_CALC.map((c,i)=>(
              <Reveal key={i} delay={i*70} className="eip-calc-card">
                <h4>{c.k}</h4>
                <p>{c.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {zoom && (
        <div className="shot-lb" onClick={()=>setZoom(false)}>
          <button className="shot-lb-x" onClick={()=>setZoom(false)} aria-label="Close">{I.x()}</button>
          <figure onClick={e=>e.stopPropagation()}>
            <img src={typeof zoom === "string" ? zoom : media(PLAT_TEXT.eipShot)} alt={PLAT_TEXT.zoomCaption}/>
            <figcaption>{PLAT_TEXT.zoomCaption}</figcaption>
          </figure>
        </div>
      )}

      {/* dedicated customer enquiry form (end of page) */}
      <section className="section" style={{ background:"var(--surface-2)" }}>
        <div className="shell">
          <CustomerEnquiry nav={nav}/>
        </div>
      </section>
    </div>
  );
}

