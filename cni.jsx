/* ============================================================
   cni.jsx — C&I buyer landing (deepest lane)
   ============================================================ */
const INDUSTRY_DATA = {
  "Metals & mining": { tariff:"Lower ₹/kWh", saving:"Higher RE penetration", re:"Tariff visibility",
    challenge:"Arc furnaces and crushers run continuous, high-load shifts — energy is often your single largest controllable cost.",
    cases:[{to:"khayati-steel",h:"From 0% RE to 100% RE",m:"Green steel · 7-year transition"},{to:"graphite-india",h:"₹84 cr to ₹24 cr a year on power",m:"Graphite · 80.7% renewable"}],
    reg:"Open access cleared in all three operating states. Cross-subsidy surcharge offset within payback." },
  "Cement": { tariff:"Lower ₹/kWh", saving:"Higher RE penetration", re:"Tariff visibility",
    challenge:"Grinding and kiln loads are power-hungry and tariff-sensitive; every ₹1/unit moves EBITDA materially.",
    cases:[{to:"graphite-india",h:"₹84 cr to ₹24 cr a year on power",m:"Heavy industry · 80.7% renewable"},{to:"inox-gfl",h:"70 MWp solar added to 50 MW wind",m:"Hybridisation · ₹7.62 cr/yr saved"}],
    reg:"Group-captive structure qualifies for open access; banking ledger smooths monsoon dips." },
  "Healthcare": { tariff:"Lower ₹/kWh", saving:"Higher RE penetration", re:"Multi-site visibility",
    challenge:"Multi-site operators need lower cost and uninterrupted power for critical care, with centralised visibility across every facility.",
    cases:[{to:"cloud-nine",h:"₹8 to ₹3.25 a unit across 31+ sites",m:"Healthcare · captive solar"},{to:"gil-portfolio",h:"Renewable variability turned into advantage",m:"Predictive portfolio · 80–85%"}],
    reg:"Captive solar plus open access; ABT metering and meter-name transfer managed end-to-end." },
  "Automotive": { tariff:"Lower ₹/kWh", saving:"Higher RE penetration", re:"Scope-2 reduction",
    challenge:"OEM supply-chain mandates now push Scope-2 reduction down to tier-1 and tier-2 component makers.",
    cases:[{to:"honda",h:"Wind–solar co-location at 44% PLF",m:"Two-wheeler maker · hybrid co-location"},{to:"khayati-steel",h:"From 0% RE to 100% RE",m:"Heavy industry · 7-year transition"}],
    reg:"Open access plus rooftop; RE attributes documented for OEM scope-3 disclosures." },
  "Chemicals": { tariff:"Lower ₹/kWh", saving:"Higher RE penetration", re:"Continuous-load cover",
    challenge:"Process heat and continuous load make energy both a cost and a reliability question.",
    cases:[{to:"inox-gfl",h:"70 MWp solar added to 50 MW wind",m:"Chemicals · ₹7.62 cr/yr saved"},{to:"graphite-india",h:"₹84 cr to ₹24 cr a year on power",m:"Continuous load · 80.7% renewable"}],
    reg:"Open access across operating states; deficit auto-purchase keeps continuous loads covered." },
  "Commercial real estate": { tariff:"Lower ₹/kWh", saving:"Higher RE penetration", re:"Predictable costs",
    challenge:"Multi-tenant campuses want a green-power story and predictable common-area energy costs.",
    cases:[{to:"cloud-nine",h:"₹8 to ₹3.25 a unit across 31+ sites",m:"Multi-site · captive solar"},{to:"honda",h:"Wind–solar co-location at 44% PLF",m:"Land-efficient hybrid"}],
    reg:"Third-party open access enables tenant-level green tariffs where state policy permits." },
};
const IND_TABS = Object.keys(INDUSTRY_DATA);

const MODELS = [
  { k:"CAPEX", title:"Build a renewable asset that delivers long-term value",
    desc:"The CAPEX model is designed for businesses that want to maximize long-term returns through complete asset ownership. Integrum delivers the project on a turnkey basis—from feasibility studies and engineering to procurement, construction, commissioning, and lifetime O&M support—ensuring seamless execution at every stage. By owning the asset, businesses can benefit from accelerated depreciation, GST credits, and attractive project IRRs while building a long-term energy asset that continuously reduces operating costs.",
    cta:"Ready to maximize the return on your renewable investment? Talk to our experts to evaluate the ideal CAPEX solution for your business.",
    meta:[["Ownership","Client"],["Upfront capital","Highest"],["Savings captured","100%"]] },
  { k:"OPEX / Group Captive", title:"Transition to renewable energy without significant capital investment",
    desc:"The Group Captive / OPEX model enables businesses to reduce electricity costs without the burden of owning or financing the renewable energy asset. Integrum develops, owns, operates, and maintains the power plant, while you benefit from competitively priced clean energy through a long-term Power Purchase Agreement (PPA). With minimal upfront investment, immediate tariff savings, and generation risk managed by Integrum, this model allows you to preserve capital while advancing your sustainability goals.",
    cta:"Discover how much your business can save with Group Captive power. Request a customized savings assessment today.",
    meta:[["Ownership","Integrum / SPV"],["Upfront capital","None"],["You pay","₹/unit PPA"]] },
  { k:"EaaS", title:"Renewable energy, fully managed",
    desc:"Energy-as-a-Service combines the financial advantages of asset ownership with the convenience of a fully managed renewable energy solution. While the renewable asset is established in the customer's books, Integrum manages project financing, engineering, execution, operations, and long-term performance. With minimal to zero upfront investment, businesses gain access to GST and depreciation benefits, predictable energy costs, and a hassle-free renewable energy experience—without the complexities of day-to-day asset management.",
    cta:"Looking for a zero-hassle renewable energy solution? Schedule a consultation to explore how EaaS can accelerate your sustainability journey.",
    meta:[["Ownership","Client (in books)"],["Upfront capital","Min. to zero"],["You pay","Managed service"]] },
];

const TECH = [
  { k:"Solar", ic:"bolt", flagship:false, tagline:"Harness the power of the sun to reduce energy costs",
    body:"Solar energy remains one of the most reliable and cost-effective pathways to achieving energy independence. Integrum designs, engineers, and delivers utility-scale and captive solar solutions tailored to your energy consumption patterns, site conditions, and financial objectives. Our portfolio includes rooftop, ground-mounted and open-access solar projects across diverse industries — every project backed by comprehensive feasibility studies, advanced energy simulations, and optimized system design. We partner with globally recognized module manufacturers, inverter suppliers, and Balance of System providers so every installation meets the highest standards of efficiency, reliability, and durability.",
    tags:["Rooftop","Ground-mount","Open access"] },
  { k:"Wind", ic:"wind", flagship:false, tagline:"Capture high-performance wind energy with confidence",
    body:"Wind energy delivers exceptional long-term value when the right site, technology, and execution strategy come together. Integrum develops utility-scale and captive wind projects by combining detailed wind resource assessments, advanced micrositing studies, and proven engineering practices to maximize generation throughout the asset lifecycle. Our team evaluates every location using historical wind data, terrain analysis, grid availability, and evacuation infrastructure before selecting the optimal turbine configuration — then provides end-to-end ownership from land identification and regulatory approvals through engineering, procurement, construction and lifetime operations and maintenance.",
    tags:["Resource assessment","Micrositing","Turbine selection","Projects + O&M"] },
  { k:"Hybrid", ic:"compass", flagship:true, tagline:"The best of wind and solar. Engineered for maximum performance.",
    body:"Hybrid renewable energy combines the complementary strengths of wind and solar to deliver higher plant utilization, improved generation stability, and superior project economics. While solar generates during daylight hours, wind resources often peak during evenings, nights, and seasonal variations, creating a balanced energy profile that significantly improves overall energy availability. As Integrum's flagship offering, hybrid EPC solutions are designed to maximize Capacity Utilization Factor (CUF), optimize transmission infrastructure, and reduce the levelized cost of energy. Our proprietary energy simulations evaluate multiple combinations of wind, solar, storage, and consumption patterns to develop the most efficient configuration for every customer.",
    tags:["Higher CUF","Balanced profile","Optimized land","Lower LCOE"] },
  { k:"Energy Storage — BESS", ic:"shield", flagship:false, tagline:"Store clean energy. Use it when it matters most.",
    body:"Battery Energy Storage Systems unlock greater flexibility, reliability, and value from renewable energy assets. By storing excess renewable generation and dispatching it during periods of peak demand, BESS enables businesses to optimize energy costs while improving grid stability and operational resilience. Integrum offers scalable battery storage using advanced lithium-ion technologies, engineered around customer load profiles, tariff structures and operational requirements to maximize return on investment — supporting peak shaving, demand management, renewable energy firming, backup power and energy arbitrage.",
    tags:["Peak shaving","Demand management","RE firming","Backup + arbitrage"] },
];

const RISKS = [
  { k:"Price risk", ic:"trendUp", head:"Predictable costs. Protected project economics.",
    body:"We minimize price volatility through a predominantly fixed-price execution model. Strategic agreements with leading OEMs lock in pricing for key equipment, significantly reducing exposure to market fluctuations. While certain commodity-linked components, such as metal surcharges, may vary, these are addressed through predefined commercial arrangements. Our disciplined sourcing and mark-to-market approach ensure transparency, cost certainty, and long-term value." },
  { k:"Regulatory risk", ic:"shield", head:"Navigating regulatory complexity with confidence.",
    body:"Renewable energy regulations continue to evolve across states and market mechanisms. Integrum combines deep regulatory expertise with continuous industry engagement to anticipate changes before they impact your business. We develop scenario-based analyses and simulate multiple regulatory outcomes against each client's consumption profile, enabling informed decisions and resilient project structures." },
  { k:"Execution risk", ic:"factory", head:"One partner. Complete ownership. Zero execution hassles.",
    body:"From contract signing to final commissioning, Integrum manages the entire project lifecycle with complete ownership and accountability. Our teams coordinate engineering, procurement, construction, statutory approvals and commissioning for seamless execution. Execution-related risks remain with us, so you stay focused on your core business while we deliver on time and to the highest quality standards." },
  { k:"Generation risk", ic:"gauge", head:"Optimized generation. Reliable returns.",
    body:"Project performance begins with selecting the right site. Our in-house assessment framework leverages proven wind and solar resource analysis, extensive R&D and rigorous feasibility studies to identify high-performing locations. Coupled with flexible models such as Energy-as-a-Service, we consistently deliver generation that outperforms market benchmarks — maximizing yield and long-term returns." },
];

const FAQS = [
  { q:"CAPEX vs OPEX vs EaaS — which fits my plant?", a:"If you have capital and want to own the asset and 100% of the savings, CAPEX wins on lifetime economics. If you'd rather keep capital free and just pay a lower tariff, OPEX / Group Captive (the IPP model) needs zero ownership. EaaS suits teams who want a guaranteed energy outcome with none of the operational overhead. We model all three for you in stage S, then you choose." },
  { q:"How long does a project take end-to-end?", a:"For a typical C&I hybrid plant, expect 8–14 months from feasibility sign-off to commissioning, depending on land, open-access approvals and grid connectivity. The cement-plant case study went from ₹7 to ₹3 a unit within 14 months of kickoff." },
  { q:"What's the O&M model?", a:"24×7 remote monitoring via the Energy Intelligence Platform, predictive maintenance, and contractual generation guarantees backed by SLAs. This is stage R of SPARK — and the reason our plants keep performing years after handover." },
  { q:"Can we expand later with BESS?", a:"Yes. The platform is BESS-ready: once storage is added, stage K (Keep optimizing) handles charge/discharge scheduling automatically — charging on surplus, discharging at peak tariff or during outages, and banking the rest." },
];

const SOLVE = [
  { k:"Cost", d:"Reduce my energy cost", go:"sol-a" },
  { k:"RE transition", d:"Increase my renewable share", go:"sol-b" },
  { k:"Build", d:"Develop and execute a project", go:"sol-a" },
  { k:"Optimise", d:"Improve existing asset performance", go:"sol-d" },
];

const FAMILIES = [
  { n:"01", t:"Lowest-Cost Renewable Power", s:"Wind | Solar | Wind–Solar Hybrid | BESS | Open Access / Group Captive", go:"sol-a" },
  { n:"02", t:"Behind-the-Meter Energy", s:"On-site Solar | BESS | Demand Management", go:"sol-b" },
  { n:"03", t:"Energy-as-a-Service", s:"Integrated outcome without asset ownership", go:"sol-c" },
  { n:"04", t:"Operate & Optimise", s:"O&M | Asset Management | Performance", go:"sol-d" },
  { n:"05", t:"Power Markets", s:"Trading | Scheduling | Procurement | BESS optimisation", go:"sol-e" },
];

const COMMERCIAL = [
  { k:"OWN", t:"CAPEX", d:"You own the asset and capture the full lifetime economics." },
  { k:"BUY POWER", t:"Group Captive / IPP", d:"You buy power under a long-term structure, with no asset on your books." },
  { k:"SUBSCRIBE", t:"Energy-as-a-Service", d:"You buy the energy outcome, fully managed, with minimal capital." },
];

const SOL_FAMILIES = [
  { id:"sol-a", tag:"A", eyebrow:"01 · Lowest-Cost Renewable Power", h:"Renewable power designed around your load",
    copy:"We model your load, state regulations, renewable resources and tariff structure to identify the lowest-cost energy mix — not simply the cheapest project.",
    listK:"Combine", list:["Wind","Solar","Wind–Solar Hybrid","BESS","Open Access / Group Captive"],
    outK:"Outcomes", out:["Lower ₹/kWh","Higher renewable penetration","Long-term tariff visibility"],
    cta:"Explore Renewable Power", img:"windField" },
  { id:"sol-b", tag:"B", eyebrow:"02 · Behind-the-Meter Energy", h:"Generate and manage more energy at your site",
    copy:"Reduce grid purchases, manage peak demand and increase energy resilience using generation and storage located at or near your facility.",
    listK:"Includes", list:["Rooftop / on-site solar","Ground-mounted captive solar","BESS","Peak-demand management","Demand optimisation"],
    outK:"Outcomes", out:["Lower grid purchases","Managed peak demand","Greater energy resilience"],
    cta:"Explore Behind-the-Meter", img:"solarClose" },
  { id:"sol-c", tag:"C", eyebrow:"03 · Energy-as-a-Service", h:"Get the energy outcome without owning the complexity",
    copy:"The solution may combine solar, wind, storage, grid and market procurement depending on your requirements. EaaS is a commercial proposition, not just another technology.",
    listK:"What you get", list:["Minimal customer capital","Integrated generation + storage","Long-term performance responsibility","Single commercial relationship"],
    outK:"The key message", out:["Don't buy the equipment. Buy the outcome."], quote:true,
    cta:"Explore Energy-as-a-Service", img:"commercialSolar" },
  { id:"sol-d", tag:"D", eyebrow:"04 · Operate & Optimise", h:"Make operating assets perform better",
    copy:"Once an asset is commissioned, the objective changes from building MW to maximising generation, availability and lifetime returns.",
    listK:"Includes", list:["Solar O&M","Wind O&M","Asset management","SCADA / performance monitoring","Forecasting & scheduling","Generation optimisation"],
    outK:"Outcomes", out:["Higher generation and availability","Better lifetime returns","Lower lifetime ₹/kWh"],
    cta:"Optimise my assets", img:"wind" },
  { id:"sol-e", tag:"E", eyebrow:"05 · Power Markets & Energy Optimisation", h:"Optimise what you generate — and what you buy",
    copy:"Renewable generation is only one part of the power bill. We optimise the remaining procurement and market exposure as well.",
    listK:"Includes", list:["Power trading","Market procurement","Scheduling","Forecasting","Demand optimisation","Storage dispatch","Portfolio management"],
    outK:"Outcomes", out:["Optimised residual procurement","Managed market exposure","Value from surplus generation"],
    cta:"Explore Power Markets", img:"storage" },
];

function CnILane({ nav }) {
  const [tab, setTab] = useState(0);
  const d = INDUSTRY_DATA[IND_TABS[tab]];
  const [open, setOpen] = useState(0);

  return (
    <div className="page-fade sol-page lane-accent" style={{ "--p-color":"var(--amber)" }}>
      {/* hero */}
      <section className="page-hero">
        <div className="shell">
          <div className="breadcrumb"><a onClick={()=>nav("home")} style={{cursor:"pointer"}}>Home</a> {I.arrow({width:13,height:13})} <span style={{color:"var(--ink-2)"}}>Solutions</span></div>
          <div className="lane-hero" style={{ marginTop:18 }}>
            <div>
              <span className="eyebrow">Solutions</span>
              <h1>Energy solutions built around your load, not our products.</h1>
              <p className="lead">Wind, solar, storage and power markets combined to reduce cost, increase renewable share and improve long-term energy performance.</p>
              <div className="tagstack">
                <span className="chip">Open access in 3 states</span>
                <span className="chip">CAPEX · OPEX · EaaS</span>
                <span className="chip">BESS-ready</span>
              </div>
              <button className="btn btn-primary btn-lg" style={{ marginTop:22 }} onClick={()=>{ const el=document.getElementById("find-solution"); if(el) window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-80,behavior:"smooth"}); }}>Find my solution {I.arrow()}</button>
            </div>
            <Reveal delay={100}>
              <div className="tech-teaser">
                <span className="tt-k">Our technologies</span>
                <div className="tt-list">
                  {[
                    { k:"Solar", d:"Rooftop, ground-mounted and open-access solar, engineered around your consumption." },
                    { k:"Wind", d:"Utility-scale and captive wind, sited on real resource data and evacuation capacity." },
                    { k:"Wind–Solar Hybrid", d:"Our flagship. Complementary generation for higher CUF and a lower cost of energy.", flag:true },
                  ].map((t,i)=>(
                    <div className={"tt-item"+(t.flag?" is-flag":"")} key={i}>
                      <div className="tt-top"><span className="tt-name">{t.k}</span>{t.flag && <span className="tt-flag">Flagship</span>}</div>
                      <p>{t.d}</p>
                    </div>
                  ))}
                </div>
                <button className="btn btn-nav-cta" style={{ width:"100%", marginTop:16 }} onClick={()=>{ const el=document.getElementById("sol-tech"); if(el) window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-80,behavior:"smooth"}); }}>See the technology {I.arrow()}</button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* what are you trying to solve + solution families */}
      <section className="section" id="find-solution" style={{ paddingBottom:"clamp(20px,2.4vw,32px)" }}>
        <div className="shell">
          <Reveal className="sec-head">
            <span className="eyebrow">Find my solution</span>
            <h2>What are you trying to solve?</h2>
          </Reveal>
          <div className="solve-row">
            {SOLVE.map((s,i)=>(
              <button key={i} className="solve-chip" onClick={()=>{ const el=document.getElementById(s.go); if(el) window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-80,behavior:"smooth"}); }}>
                <span className="sv-k">{s.k}</span>
                <span className="sv-d">{s.d}</span>
                <span className="sv-go">{I.arrow({width:15,height:15})}</span>
              </button>
            ))}
          </div>
          <Reveal>
            <h3 className="fam-title">Principal solution families</h3>
            <div className="fam-grid">
              {FAMILIES.map((f,i)=>(
                <button key={i} className="fam-card" onClick={()=>{ const el=document.getElementById(f.go); if(el) window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-80,behavior:"smooth"}); }}>
                  <span className="fam-n">{f.n}</span>
                  <span className="fam-t">{f.t}</span>
                  <span className="fam-s">{f.s}</span>
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* solution families A–E */}
      {SOL_FAMILIES.map((f,i)=>(
        <section key={f.id} id={f.id} className={`sol-fam ${i%2?"is-alt":""}`}>
          <div className="shell sol-fam-inner">
            <div className="sol-fam-copy">
              <span className="eyebrow">{f.eyebrow}</span>
              <h2>{f.h}</h2>
              <p className="lead">{f.copy}</p>
              <div className="sol-fam-cols">
                <div>
                  <h5 className="sol-k">{f.listK}</h5>
                  <ul className="sol-list">{f.list.map((x,j)=>(<li key={j}>{I.check({width:15,height:15})}<span>{x}</span></li>))}</ul>
                </div>
                <div>
                  <h5 className="sol-k">{f.outK}</h5>
                  {f.quote
                    ? <p className="sol-quote">{f.out[0]}</p>
                    : <ul className="sol-list is-out">{f.out.map((x,j)=>(<li key={j}>{I.trendUp({width:15,height:15})}<span>{x}</span></li>))}</ul>}
                </div>
              </div>
              <button className="btn btn-primary" style={{ marginTop:22 }} onClick={()=>nav("contact")}>{f.cta} {I.arrow()}</button>
            </div>
            <div className="sol-fam-media">
              <img src={IMG[f.img] || IMG.windField} alt={f.h} loading="lazy"/>
            </div>
          </div>
        </section>
      ))}

      {/* commercial models */}
      <section className="section" style={{ background:"var(--surface-2)" }}>
        <div className="shell">
          <Reveal className="sec-head">
            <span className="eyebrow">Commercial models</span>
            <h2>Choose how you want to consume the energy.</h2>
            <p className="lead">The energy solution stays the same. The commercial structure adapts to your capital and risk appetite.</p>
          </Reveal>
          <div className="comm-row">
            {COMMERCIAL.map((c,i)=>(
              <Reveal key={i} delay={i*70} className="comm-card">
                <span className="comm-k">{c.k}</span>
                <span className="comm-t">{c.t}</span>
                <p className="comm-d">{c.d}</p>
              </Reveal>
            ))}
          </div>
          <div className="model-grid">
            {MODELS.map((m,i)=>(
              <Reveal key={i} delay={i*80}>
                <div className="model-card" style={{ "--p-color":"var(--amber)" }}>
                  <span className="mc-k">{m.k}</span>
                  <h4>{m.title}</h4>
                  <p className="mc-desc">{m.desc}</p>
                  <div className="mc-meta">
                    {m.meta.map((row,j)=>(<div key={j}><span>{row[0]}</span><span>{row[1]}</span></div>))}
                  </div>
                  <div className="mc-cta">{m.cta}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* technology */}
      <section className="section" id="sol-tech">
        <div className="shell">
          <Reveal className="sec-head">
            <span className="eyebrow">The technology</span>
            <h2>Solar, wind, hybrid and storage — engineered together.</h2>
            <p className="lead">We're technology-agnostic on components and rigorous on design. Hybrid is our flagship, because complementary wind and solar simply deliver more.</p>
            <button className="link-arrow" style={{ marginTop:14 }} onClick={()=>{ const el=document.getElementById("sol-a"); if(el) window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-80,behavior:"smooth"}); }}>See how this sits inside 01 · Lowest-Cost Renewable Power {I.arrow()}</button>
          </Reveal>
          <div className="tech-grid">
            {TECH.map((t,i)=>(
              <Reveal key={i} delay={i*70}>
                <div className={`tech-card ${t.flagship?"is-flagship":""}`}>
                  <div className="tech-top">
                    <span className="tech-ico">{I[t.ic]({width:22,height:22})}</span>
                    <div className="tech-kwrap">
                      <span className="tech-k">{t.k}</span>
                      {t.flagship && <span className="tech-flag">Flagship</span>}
                    </div>
                  </div>
                  <h4>{t.tagline}</h4>
                  <p>{t.body}</p>
                  <div className="tech-tags">{t.tags.map((tg,j)=>(<span key={j}>{tg}</span>))}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* impact numbers + SPARK ribbon (links to the dedicated SPARK page) */}
      <section className="section sol-outcomes-sec">
        <div className="shell">
          <Reveal className="sec-head">
            <span className="eyebrow">What buyers actually get</span>
            <h2>The outcomes that land on your balance sheet.</h2>
            <p className="lead">What a solution is designed to deliver. Actual figures are modelled against your own load, state and structure in stage S.</p>
          </Reveal>
          <div className="impact-grid">
            {[
              { n:"Lower", u:" ₹/kWh", k:"Cost outcome", s:"A blended cost of energy below your current grid tariff, with long-term visibility." },
              { n:"Higher", u:" RE share", k:"Renewable outcome", s:"A larger share of consumption met by renewable generation." },
              { n:"Lower", u:" complexity", k:"Operating outcome", s:"One accountable partner instead of several suppliers." },
              { n:"25-yr", u:"", k:"Lifecycle outcome", s:"Accountability that continues well past commissioning." },
            ].map((c,i)=>(
              <Reveal key={i} delay={i*60} className="impact-card">
                <div className="impact-n num">{c.n}<span className="u">{c.u}</span></div>
                <div className="impact-k">{c.k}</div>
                <div className="impact-s">{c.s}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* risk management */}
      <section className="section" style={{ background:"var(--surface-2)" }}>
        <div className="shell">
          <Reveal className="sec-head">
            <span className="eyebrow">Risk management</span>
            <h2>The risks we take off your desk.</h2>
            <p className="lead">Price, regulation, execution and generation — each one engineered out of your project, and onto our accountability.</p>
          </Reveal>
          <div className="risk-grid">
            {RISKS.map((r,i)=>(
              <Reveal key={i} delay={i*70}>
                <div className="risk-card">
                  <span className="risk-ico">{I[r.ic]({width:20,height:20})}</span>
                  <span className="risk-k">{r.k}</span>
                  <h4>{r.head}</h4>
                  <p>{r.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" style={{ background:"var(--surface-2)", paddingTop:0 }}>
        <div className="shell" style={{ maxWidth:1120 }}>
          <Reveal className="sec-head"><span className="eyebrow">Straight answers</span><h2>The questions plant heads actually ask.</h2></Reveal>
          <div className="faq">
            {FAQS.map((f,i)=>(
              <div className={`faq-item ${open===i?"open":""}`} key={i}>
                <button className="faq-q" onClick={()=>setOpen(open===i?-1:i)}>
                  {f.q}<span className="fq-ico">{I.plus()}</span>
                </button>
                <div className="faq-a" style={{ maxHeight: open===i? 320 : 0 }}>
                  <div className="faq-a-inner">{f.a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* sticky CTA */}
      <div className="sticky-cta">
        <div className="shell sticky-cta-inner">
          <div className="sc-text"><b>Bring us your energy challenge.</b></div>
          <button className="btn btn-nav-cta" onClick={()=>nav("platform#energy-challenge")}>Talk to an energy advisor {I.arrow()}</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { CnILane, INDUSTRY_DATA });
