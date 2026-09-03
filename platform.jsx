/* ============================================================
   platform.jsx — Platform page: capabilities Integrum brings
   ============================================================ */
const { useState: useStateP } = React;

const PLAT_LAYERS = [
  { k:"DEVELOP",   d:"Land · Connectivity · Approvals · Resource assessment", ic:"compass" },
  { k:"DELIVER",   d:"Engineering · Procurement · Projects · Commissioning",       ic:"factory" },
  { k:"STRUCTURE", d:"CAPEX · Group Captive · IPP · EaaS",                    ic:"shield" },
  { k:"OPERATE",   d:"Wind O&M · Solar O&M · Asset management · SCADA",       ic:"gauge" },
  { k:"OPTIMISE",  d:"Trading · Scheduling · Forecasting · BESS · Power markets", ic:"trendUp" },
];

const CONNECTED = [
  { h:"Development affects tariff / timelines", d:"Bad land or connectivity decisions increase lifecycle cost." },
  { h:"Technology affects generation profile",  d:"Solar alone cannot solve every load curve." },
  { h:"Commercial structure affects returns",   d:"CAPEX, captive and EaaS produce very different economics." },
  { h:"Operations affect lifetime ₹/kWh",       d:"A poorly operated plant destroys the original financial model." },
  { h:"Markets change over time",               d:"Storage, trading and procurement must keep adapting." },
];

const PLAT_MODELS = [
  { k:"OWN", t:"CAPEX" },
  { k:"BUY POWER", t:"Group Captive / IPP" },
  { k:"SUBSCRIBE", t:"Energy-as-a-Service" },
];

const LIFECYCLE = [
  { y:"Year 0", d:"Strategy" },
  { y:"Year 1", d:"Development + construction" },
  { y:"Years 2–25", d:"O&M + forecasting + scheduling + optimisation" },
];

const BUSINESSES = [
  { k:"Renewable Infrastructure", d:"Development + projects", ic:"factory" },
  { k:"Distributed Energy", d:"Commercial + residential / VNM / behind-the-meter", ic:"bolt" },
  { k:"Operations", d:"Solar + wind O&M", ic:"gauge" },
  { k:"Energy Markets", d:"Trading + scheduling + market procurement", ic:"trendUp" },
  { k:"Energy-as-a-Service", d:"Integrated long-term commercial solutions", ic:"shield" },
];

const CROSS = [
  { k:"Large industrial hybrid", seg:"Steel manufacturer", d:"Development + projects + Group Captive + O&M", go:"case/khayati-steel" },
  { k:"Commercial portfolio", seg:"Healthcare portfolio", d:"Distributed solar + commercial structure + asset management + power markets + contract demand + BESS", go:"case/cloud-nine" },
  { k:"Multi-asset, multi-location", seg:"Graphite manufacturer", d:"Wind + solar, rooftop, hybrid with hydro, power trading", go:"case/graphite-india" },
];

/* ---- Energy Intelligence Platform (client-supplied copy) ---- */
const EIP_DASH = [
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

const EIP_BESS = [
  { k:"When to charge",
    d:"Identify the optimal charging window based on renewable surplus, low electricity tariffs, and market opportunities to maximize battery utilization while minimizing charging costs." },
  { k:"When to discharge",
    d:"Determine the ideal discharge schedule during peak demand, high market prices, or critical operational periods to maximize financial returns and improve energy reliability." },
];

const EIP_CALC = [
  { k:"Electricity Bill Estimator",
    d:"Estimate your monthly electricity costs by comparing conventional grid power with renewable energy alternatives. Input your connected load, monthly consumption, tariff category, location, and operating profile to evaluate potential cost savings." },
  { k:"Overall Project Savings",
    d:"Estimate project investment, annual savings, payback period, internal rate of return, and lifetime financial benefits for all installations based on your consumption profile and available site area." },
];

const JOURNEY_GENERIC = {
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
    "Lower blended cost of energy",
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

const scrollToEnquiry = () => {
  const el = document.getElementById("energy-challenge");
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior:"smooth" });
};

const DASH_LEGEND = [
  ["#22C55E","Generation"], ["#86EFAC","Banking Loss (8%)"], ["#EF4444","Consumption"],
  ["#2DD4BF","Matched Settlement"], ["#3B82F6","Settlement with Banking"],
  ["#F59E0B","Lapsed Units"], ["#F87171","Grid Consumption"],
];

function Platform({ nav }) {
  const [zoom, setZoom] = useStateP(false);
  return (
    <div className="page-fade plat-page">
      {/* hero */}
      <section className="plat-hero">
        <div className="plat-hero-glow" aria-hidden="true"></div>
        <div className="shell">
          <div className="breadcrumb" style={{ color:"#9FC1DC" }}>
            <a onClick={()=>nav("home")} style={{ cursor:"pointer", color:"#BFD8EC" }}>Home</a> <span>/</span> <span>Platform</span>
          </div>
          <span className="eyebrow" style={{ color:"var(--solar)", marginTop:18, display:"inline-flex" }}>Design · Develop · Execute · Operate · Optimise</span>
          <h1>One energy platform.<br/>Built around the customer outcome.</h1>
          <p className="plat-hero-sub">From strategy and project development to execution, operations and power markets — Integrum brings the capabilities together under one accountable platform.</p>
          <div style={{ display:"flex", gap:14, flexWrap:"wrap", marginTop:28 }}>
            <button className="btn btn-solar btn-lg" onClick={()=>scrollToEnquiry()}>Bring us your energy challenge {I.arrow()}</button>
            <button className="btn btn-ghost-light btn-lg" onClick={()=>nav("dashboard")}>Customer login</button>
          </div>
        </div>
      </section>

      {/* SPARK framework (replaces the platform flow diagram) */}
      <SparkSection nav={nav} note="A renewable project is not an isolated asset. Land, connectivity, financing, generation, operations and market procurement all determine the final cost of energy. Integrum brings these decisions onto one platform."/>
      {/* customer journey through the platform */}
      <section className="section jrn-sec">
        <div className="shell">
          <Reveal className="jrn-head">
            <span className="eyebrow">A customer journey through the Integrum platform</span>
            <h2>From fragmented energy decisions<br/>to one optimised energy portfolio<span className="jrn-dot">.</span></h2>
            <p className="jrn-sub">Integrum brings sourcing, generation, consumption, operations and optimisation together on one integrated energy platform, managing the complete energy lifecycle for the customer.</p>
          </Reveal>
          <div className="jrn-row">
            <Reveal className="jrn-card is-landscape">
              <div className="jrn-card-top">
                <span className="jrn-ic">{I.trendUp({width:20,height:20})}</span>
                <div><span className="jrn-n">01</span><span className="jrn-t">Energy landscape</span></div>
              </div>
              <ul className="jrn-list">{JOURNEY_GENERIC.landscape.map((x,i)=>(<li key={i}>{x}</li>))}</ul>
            </Reveal>
            <span className="jrn-arrow" aria-hidden="true">{I.arrow({width:20,height:20})}</span>
            <Reveal delay={80} className="jrn-card is-platform">
              <div className="jrn-card-top">
                <span className="jrn-ic">{I.gauge({width:20,height:20})}</span>
                <div><span className="jrn-n">02</span><span className="jrn-t">Integrum platform</span></div>
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
                <div><span className="jrn-n">03</span><span className="jrn-t">Optimised energy portfolio</span></div>
              </div>
              <ul className="jrn-list">{JOURNEY_GENERIC.portfolio.map((x,i)=>(<li key={i}>{x}</li>))}</ul>
            </Reveal>
          </div>
          <Reveal className="jrn-foot">
            <span className="jrn-foot-mark">{I.award({width:22,height:22})}</span>
            <span className="jrn-foot-brand">INTEGRUM</span>
            <p>Integrum manages the energy lifecycle end-to-end, from understanding the requirement to continuously optimising the portfolio.</p>
          </Reveal>
          <p className="jrn-note">Our solutions and outcomes are tailored to each customer based on their load profile, regulatory framework and commercial structure.</p>
        </div>
      </section>

      {/* energy decisions are connected */}
      <section className="section">
        <div className="shell">
          <Reveal className="sec-head">
            <span className="eyebrow">Why a platform</span>
            <h2>Energy decisions are connected.</h2>
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
          <Reveal><p className="conn-close">The lowest-cost energy outcome comes from optimising all five together.</p></Reveal>
        </div>
      </section>

      {/* technology agnostic + commercial models */}
      <section className="section" style={{ background:"var(--surface-2)" }}>
        <div className="shell">
          <Reveal className="sec-head">
            <span className="eyebrow">Technology agnostic</span>
            <h2>We choose the mix based on your load and economics.</h2>
            <p className="lead">Not based on what we need to sell.</p>
          </Reveal>
          <div className="agnostic-row">
            {["Wind","Solar","Hybrid","BESS","Grid","Power Markets"].map((t,i)=>(<span className="agn-chip" key={i}>{t}</span>))}
          </div>
          <Reveal>
            <h3 className="fam-title">One platform. Multiple commercial models.</h3>
            <div className="comm-row">
              {PLAT_MODELS.map((m,i)=>(
                <div className="comm-card" key={i}>
                  <span className="comm-k">{m.k}</span>
                  <span className="comm-t">{m.t}</span>
                </div>
              ))}
            </div>
            <p className="plat-note">The technology is optimised around the load. The commercial structure is optimised around the customer's capital and risk appetite.</p>
          </Reveal>
        </div>
      </section>

      {/* lifecycle accountability */}
      <section className="section">
        <div className="shell">
          <Reveal className="sec-head">
            <span className="eyebrow">Lifecycle accountability</span>
            <h2>Accountability doesn't stop at commissioning.</h2>
          </Reveal>
          <div className="life-row">
            {LIFECYCLE.map((l,i)=>(
              <Reveal key={i} delay={i*70} className="life-card">
                <span className="life-y">{l.y}</span>
                <span className="life-d">{l.d}</span>
              </Reveal>
            ))}
          </div>
          <Reveal><p className="conn-close">Integrum stays involved for the period over which the customer's energy economics actually matter.</p></Reveal>
        </div>
      </section>

      {/* emerging businesses + cross-platform examples */}
      <section className="section" style={{ background:"var(--surface-2)" }}>
        <div className="shell">
          <Reveal className="sec-head">
            <span className="eyebrow">Emerging businesses</span>
            <h2>Five businesses on one platform.</h2>
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
            <h3 className="fam-title">Cross-platform capability in practice</h3>
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
            <span className="eyebrow">Energy Intelligence Platform</span>
            <h2 className="eip-h">Your energy. Visible. Intelligent. Always on.</h2>
            <p className="eip-p">The Integrum Energy Intelligence Platform transforms energy data into actionable business intelligence. Built for modern enterprises, it unifies renewable energy operations, power procurement, forecasting, battery intelligence, market participation, and regulatory compliance into a single digital ecosystem.</p>
            <p className="eip-p">Whether you are managing captive assets, open access power, hybrid renewable portfolios, or battery storage, the platform enables smarter decisions that reduce energy costs, improve reliability, and maximize renewable energy utilization.</p>
            <button className="btn btn-nav-cta btn-lg" style={{ marginTop:26 }} onClick={()=>scrollToEnquiry()}>Request a platform demo {I.arrow()}</button>
          </Reveal>
          <Reveal delay={110} className="eip-mock">
            <div className="mk-win">
              <div className="mk-bar"><span></span><span></span><span></span><em>Energy Intelligence · Generation vs consumption</em></div>
              <button className="mk-shot" onClick={()=>setZoom(true)} title="Click to enlarge">
                <img src="assets/dash-gen-vs-consumption-plot.png" alt="Energy Intelligence dashboard: monthly generation versus consumption with banking settlement" loading="lazy"/>
                <span className="mk-zoom">{I.search({width:15,height:15})} Enlarge</span>
              </button>
              <div className="mk-leg">
                {DASH_LEGEND.map((l,i)=>(<span key={i}><i style={{ background:l[0] }}></i>{l[1]}</span>))}
              </div>
            </div>
            <span className="eip-mock-note">Live view from the Energy Intelligence platform · click the chart to view it full size</span>
          </Reveal>
        </div>
      </section>

      {/* real-time dashboard */}
      <section className="section">
        <div className="shell">
          <Reveal className="sec-head">
            <span className="eyebrow">Real-time dashboard</span>
            <h2>One dashboard.<br/>Complete energy visibility.</h2>
            <p className="lead">Monitor your entire energy portfolio through a centralized dashboard that provides real-time visibility into renewable generation, energy consumption, grid dependency, financial savings, and operational performance. Designed for business leaders and energy managers, the dashboard delivers the insights required to optimize energy decisions every day.</p>
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
              <span className="eyebrow">BESS intelligence</span>
              <h3>Maximize the value of every stored unit of energy.</h3>
              <p>Battery Energy Storage Systems become significantly more valuable when powered by intelligent decision-making. Integrum continuously analyzes electricity prices, renewable generation, demand forecasts, battery health, and operational constraints to determine the most profitable charging and discharging strategy.</p>
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
              <span className="eyebrow">Open access tracker</span>
              <h3>Simplify open access energy management.</h3>
              <p>Manage every aspect of your Open Access portfolio from a single platform. Track approvals, scheduling, banking, wheeling charges, transmission losses, settlement reports, invoices, and regulatory compliance across multiple states.</p>
              <p>Gain complete visibility into your renewable energy transactions while ensuring seamless operational and financial management.</p>
              <div className="eip-tags">
                {["Approvals","Scheduling","Banking","Wheeling charges","Transmission losses","Settlements","Invoices","Compliance"].map((t,i)=>(<span key={i}>{t}</span>))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* savings calculators */}
      <section className="section">
        <div className="shell">
          <Reveal className="sec-head">
            <span className="eyebrow">Savings calculators</span>
            <h2>Quantify the financial value of renewable energy.</h2>
            <p className="lead">Evaluate renewable energy opportunities using intelligent financial calculators designed specifically for commercial and industrial consumers. Generate realistic savings estimates based on your energy profile, consumption patterns, tariff structures, and investment preferences.</p>
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
            <img src="assets/dash-gen-vs-consumption.png" alt="Energy Intelligence dashboard, full view"/>
            <figcaption>Energy Intelligence · generation vs consumption with banking settlement</figcaption>
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

Object.assign(window, { Platform });
