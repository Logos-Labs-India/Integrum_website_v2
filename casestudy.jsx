/* ============================================================
   casestudy.jsx — Case studies (index + detail) + Contact page
   Content sourced from integrumenergy.in/case-studies (paraphrased,
   no proprietary numbers invented beyond what the client states).
   ============================================================ */
const CASES = [
  {
    id:"khayati-steel",
    sector:"Renewable power",
    chip:"Green steel · 7-year transition",
    cardMetric:"0% → 100% RE",
    title:"From 0% renewable energy to 100% renewable energy.",
    summary:"Over seven years, a green-steel manufacturer moved from 0% renewable to 100% renewable — a phased, incentive-free sourcing strategy that stayed commercially competitive throughout.",
    img:"steelPlant",
    meta:[["Industry","Green steel"],["Engagement","7-year advisory + delivery"],["Consumption","88–104 million units/yr"],["Incentives relied on","None"]],
    metrics:[
      { v:"95%", k:"Renewable energy sourcing reached", green:true },
      { v:"100% → 5%", k:"Conventional power, across the journey" },
      { v:"None", k:"Government incentives relied on" },
    ],
    body:[
      { h:"The challenge", lead:"For a green-steel manufacturer where electricity is a major share of production cost, the goal was not simply to install renewable assets but to build a phased transition roadmap. The strategy had to:", list:[
        "Transition from conventional electricity to renewable energy without impacting manufacturing operations",
        "Build a commercially sustainable portfolio independent of government incentives",
        "Adapt to evolving market conditions and renewable energy regulations",
        "Maintain long-term cost competitiveness while supporting sustainability objectives",
      ] },
      { h:"What we did", p:"Integrum worked with the customer over several years as a strategic energy-transition partner rather than a one-time project developer. Instead of a single project, we progressively diversified the sourcing portfolio through multiple commercial structures — Power Exchange, Group Captive (thin equity and equity) and Captive Hybrid — refining the mix as market conditions evolved." },
      { h:"How the power mix shifted", chart:true, p:"The transition ran in phases: heavier reliance on exchange and grid power at the start, a progressive increase in group-captive renewable energy through the middle years, and the integration of a captive hybrid plant that completed the move to 95% renewable." },
      { h:"An early co-located hybrid", p:"One of the earliest co-located wind-solar hybrid implementations for an industrial client under the CAPEX model — at a fairly large scale — the hybrid delivered significant transmission-charge savings, reduced banking dependency through the complementary wind-solar profile, and optimised the open-access requirement, saving capital cost while making best use of available open-access capacity." },
      { h:"Business value delivered", lead:"The result is a resilient, future-ready energy ecosystem:", list:[
        "Transition from 0% renewable electricity to 100% renewable energy",
        "A sourcing strategy that stayed commercially competitive without government incentives",
        "Significant savings in transmission charges through the hybrid configuration",
        "Reduced banking dependency and optimised open-access capital cost",
        "A diversified, resilient portfolio across multiple procurement structures",
      ] },
    ],
  },
  {
    id:"graphite-india",
    sector:"Renewable power",
    chip:"Graphite manufacturer · hybrid open access",
    cardMetric:"₹84cr → ₹24cr",
    title:"Accelerating renewable adoption through an integrated hybrid strategy.",
    summary:"A leading graphite manufacturer combined wind and solar open access to reach 80.7% renewable energy and cut annual electricity spend by roughly ₹60 crore — around 71% lower.",
    img:"windField",
    meta:[["Industry","Graphite manufacturing"],["Consumption","~8 crore units/yr"],["Contracted demand","19,603 kVA"],["Renewable share","80.7%"]],
    metrics:[
      { v:"80.7%", k:"Renewable energy replacement", green:true },
      { v:"₹60 cr", k:"Annual electricity savings" },
      { v:"71%", k:"Reduction in electricity cost" },
    ],
    body:[
      { h:"The challenge", p:"The client operates an energy-intensive facility consuming roughly 8 crore units a year against a contracted demand of 19,603 kVA, with consumption spread across all operating hours. It needed a strategy to cut power cost and maximise renewable replacement without affecting operational continuity — and to minimise the regulatory and banking risks that come with open-access renewable energy." },
      { h:"What we did", lead:"Rather than a standalone project, Integrum analysed the monthly and hourly consumption profile and designed an integrated hybrid sourcing strategy:", list:[
        "18.9 MW wind open access (9 × 2.1 MW) — 66.38% of energy replacement",
        "8.8 MW solar open access — 14.35%, meeting daytime demand",
        "Grid power for the remaining 19.3% of consumption",
      ] },
      { h:"Business value delivered", lead:"The diversified strategy balanced cost optimisation with supply reliability:", list:[
        "Monthly electricity bill cut from ₹7 crore to ₹2 crore",
        "Annual spend lowered from ₹84 crore to ₹24 crore — ~₹60 crore saved",
        "Electricity cost reduced by approximately 71%",
        "~80.7% renewable replacement with complementary wind + solar",
      ] },
      { h:"A policy-resilient model", lead:"The design was built to last:", list:[
        "Banking dependence limited to ~20%, reducing regulatory exposure",
        "A strategy designed to hold up even under stricter banking rules",
        "Headroom for projected annual load growth of ~15%",
      ] },
    ],
  },
  {
    id:"gil-portfolio",
    sector:"Energy management",
    chip:"Graphite manufacturer · portfolio management",
    cardMetric:"80–85% RE",
    title:"Turning renewable variability into commercial advantage.",
    summary:"For a leading graphite manufacturer, Integrum actively managed a captive wind-solar portfolio — forecasting seasonal swings, monetising monsoon surplus and sourcing deficit power — to hold renewable replacement at 80–85%.",
    img:"solarAerial",
    meta:[["Industry","Graphite manufacturing"],["Portfolio","Captive wind + solar"],["SPARK phase","Run & Maintain · Keep Optimising"],["Renewable share","80–85%"]],
    metrics:[
      { v:"80–85%", k:"Renewable energy replacement", green:true },
      { v:"Surplus", k:"Monsoon generation monetised via PPAs" },
      { v:"Predictive", k:"Forecast-led portfolio management" },
    ],
    body:[
      { h:"The challenge", lead:"Renewable generation — wind especially — is inherently variable, producing surplus in the monsoon and deficits at other times. The customer needed to:", list:[
        "Manage significant seasonal variability in generation",
        "Balance renewable generation with changing plant consumption",
        "Monetise surplus while ensuring reliable power in low-generation periods",
        "Maximise lifecycle value from existing renewable assets",
      ] },
      { h:"What we did", lead:"Through its Energy Intelligence Platform, Integrum ran a predictive, intelligence-led approach across the Run & Maintain and Keep Optimising phases of SPARK — forecasting generation, consumption and seasonal availability, and enabling:", list:[
        "Consumption modulation — aligning higher loads with high-generation periods",
        "Strategic sale of surplus renewable energy in monsoon months via PPAs",
        "Deficit power procurement from external suppliers when generation is low",
        "O&M planning, scheduling, settlements and commercial reconciliation",
        "Regulatory monitoring, insurance advisory and asset-risk management",
      ] },
      { h:"Business value delivered", lead:"Renewable variability became a commercially optimised portfolio:", list:[
        "~80–85% renewable energy replacement across manufacturing operations",
        "Surplus generation converted into an additional revenue stream via PPAs",
        "Lower sourcing costs through optimised deficit procurement",
        "Improved plant uptime through continuous, predictive operations",
      ] },
    ],
  },
  {
    id:"honda",
    sector:"Renewable power",
    chip:"Two-wheeler manufacturer · hybrid co-location",
    cardMetric:"44% PLF",
    title:"Redefining hybrid renewable energy for medium-scale industry.",
    summary:"Integrum co-located 2.7 MW wind and 1.5 MWp solar on one land footprint with a shared 33 kV line — making hybrid renewable energy viable for a medium-scale consumer, at a ~44% plant load factor.",
    img:"wind",
    meta:[["Industry","Two-wheeler manufacturing"],["Configuration","2.7 MW wind + 1.5 MWp solar"],["Evacuation","Shared 33 kV line"],["Hybrid PLF","~44% per MW"]],
    metrics:[
      { v:"~44%", k:"Hybrid PLF vs 24% solar / 34% wind", green:true },
      { v:"₹0.84", k:"Transmission cost /unit (vs ₹1.49 solar)" },
      { v:"₹30 L", k:"Transmission charges saved per annum", green:true },
    ],
    body:[
      { h:"The challenge", p:"Hybrid projects have traditionally suited large consumers, where higher evacuation capacity justifies the extra infrastructure. For a medium-scale customer requiring roughly a single wind turbine, a conventional hybrid is often uneconomic — separate wind and solar infrastructure raises capital cost and lowers efficiency. The client needed hybrid's benefits at a modest demand, while optimising land and infrastructure costs." },
      { h:"What we did", p:"Rather than developing separate wind and solar projects, Integrum designed an integrated wind-solar co-location: 2.7 MW wind with 1.5 MWp solar installed beneath the turbines, sharing the same land footprint and evacuating through a common 33 kV line and single metering system — one of India's early co-location models." },
      { h:"Superior generation", lead:"The complementary profiles delivered a hybrid plant load factor of ~44% per MW of evacuation capacity, against:", list:[
        "24% for standalone solar",
        "34% for standalone wind",
        "A materially higher energy yield per evacuation MW than standalone solar",
      ] },
      { h:"Lower transmission cost", lead:"Shared infrastructure cut transmission charges to ~₹0.84 per unit, versus:", list:[
        "₹1.49 per unit for standalone solar",
        "₹1.09 per unit for standalone wind",
        "Over 25 years, the saving can offset more than 80% of the wind turbine capital cost",
      ] },
      { h:"A future-ready model", p:"As markets shift toward Time-of-Day adjustments, the balanced wind-solar profile spreads generation across the day and seasons, reducing banking dependence — and establishes a replicable pathway for medium-scale industrial consumers to adopt hybrid renewable energy with stronger economics." },
    ],
  },
  {
    id:"inox-gfl",
    sector:"Renewable power",
    chip:"Chemical manufacturer · hybridisation",
    cardMetric:"70 MWp added",
    title:"Optimising renewable energy by maximising existing infrastructure.",
    summary:"Integrum integrated 70 MWp of solar with a chemical manufacturer's operating 50 MW wind project — one of Gujarat's first large-scale hybridisations — adding generation with no new transmission and saving ~₹7.62 crore a year.",
    img:"windSingle",
    meta:[["Industry","Chemical manufacturing"],["Existing asset","50 MW wind"],["Added","70 MWp DC solar (50 MWp AC)"],["Approval","Gujarat Hybrid Policy · Case A"]],
    metrics:[
      { v:"₹7.62 cr", k:"Annual transmission cost savings" },
      { v:"~95%", k:"Available renewable generation utilised", green:true },
      { v:"Zero", k:"New transmission infrastructure needed" },
    ],
    body:[
      { h:"The challenge", lead:"A leading chemical manufacturer wanted to increase renewable generation while keeping reliable power throughout the day. Expanding conventionally would demand costly new evacuation and transmission. The project had to:", list:[
        "Ensure reliable renewable generation across morning, day and night cycles",
        "Avoid substantial new transmission and infrastructure costs",
        "Maximise the value of existing renewable infrastructure",
      ] },
      { h:"What we did", p:"Instead of a new standalone project, Integrum integrated 70 MWp DC (50 MWp AC) of solar with the operational 50 MW wind project — reusing the existing pooling substation, EHV transmission lines and 50 MW evacuation capacity. Despite a first-of-its-kind regulatory framework, we navigated approval under the Case A hybridisation mechanism of Gujarat's Hybrid Policy." },
      { h:"Business value delivered", lead:"Focusing on optimisation rather than expansion:", list:[
        "Eliminated the need for new transmission infrastructure",
        "~₹7.62 crore in estimated annual transmission savings",
        "A lower cost per unit of renewable energy delivered",
        "Reliable blended generation across morning, day and night",
        "~95% of available renewable generation utilised",
      ] },
      { h:"A benchmark project", p:"One of the first large-scale hybridisations in Gujarat and among the first in India, the project set a benchmark for future hybrid developments and demonstrated Integrum's ability to execute technically complex projects while managing evolving regulation." },
    ],
  },
  {
    id:"cloud-nine",
    sector:"Renewable power",
    chip:"Multi-location hospital chain · captive solar",
    cardMetric:"₹8 → ₹3.25",
    title:"Optimising energy costs through distributed captive solar.",
    summary:"Across 31+ hospital sites in Karnataka and Maharashtra, Integrum deployed captive rooftop solar with lifecycle management — cutting effective cost from ₹8 to ₹3.25/unit and delivering over ₹6 crore in annual savings.",
    img:"solarClose",
    meta:[["Industry","Healthcare (multi-site)"],["Footprint","Karnataka + Maharashtra"],["Capacity","5 MWp + 4.2 MWp DC"],["Sites monitored","31+"]],
    metrics:[
      { v:"₹8 → ₹3.25", k:"Effective cost /unit (Karnataka)" },
      { v:"~₹6 cr", k:"Estimated annual savings", green:true },
      { v:"85%", k:"Overall grid replacement" },
    ],
    body:[
      { h:"The challenge", lead:"A leading multi-location hospital chain wanted to cut rising electricity costs and raise renewable adoption across facilities in Karnataka and Maharashtra, where tariffs varied significantly. It needed to:", list:[
        "Reduce dependence on high-cost grid electricity across many sites",
        "Improve renewable penetration while ensuring uninterrupted power for critical care",
        "Manage geographically distributed assets with centralised visibility",
        "Handle open-access requirements — ABT meter replacement and meter name transfer in Maharashtra",
      ] },
      { h:"What we did", p:"Rather than isolated installations, Integrum designed a portfolio-wide captive solar solution — 5 MWp DC (3.835 MW AC) across Karnataka hospitals and 4.2 MWp DC (3.08 MW AC) across Maharashtra — delivered through the SPARK methodology, from assessment and solar development to open-access optimisation, metering integration, scheduling, settlement, dashboarding, regulatory advisory and ongoing asset management. We also handled ABT meter replacement, meter name transfer to the captive entity, and contract-demand optimisation." },
      { h:"Commercial value", lead:"The portfolio approach paid back fast:", list:[
        "Effective cost cut from ~₹8 to ₹3.25/unit in Karnataka; ~₹15 to ₹4.50/unit in Maharashtra",
        "Estimated annual savings of ~₹3.36 crore (Karnataka) and ~₹2.70 crore (Maharashtra)",
        "~₹30 lakh/yr additional benefit from contract-demand optimisation in Karnataka",
        "Payback of ~3–3.5 years (Karnataka) and ~1.9 years (Maharashtra)",
      ] },
      { h:"Operational & strategic value", lead:"Beyond cost, the engagement built a scalable platform:", list:[
        "85% overall grid replacement across the portfolio (several Karnataka sites near 100%)",
        "Centralised monitoring across 31+ operational sites via integrated dashboarding",
        "ABT metering, meter-ownership transfer and open-access compliance managed end-to-end",
        "BESS under discussion for Maharashtra — potentially lifting replacement from ~56% to ~89%",
      ] },
    ],
  },
];

/* power-mix transition chart for the green-steel case (FY17→FY23, to 95% RE) */
function SteelTransitionChart() {
  const segs = [
    { k:"Conventional (grid + exchange)", c:"#7E8DA0" },
    { k:"Group Captive",                 c:"#3E92DD" },
    { k:"Captive Hybrid",                c:"#1D9E75" },
  ];
  // each row sums to 100; conventional declines to 5%, RE structures grow to 95%
  const years = [
    { fy:"FY17", v:[100,  0,  0] },
    { fy:"FY18", v:[ 92,  8,  0] },
    { fy:"FY19", v:[ 70, 30,  0] },
    { fy:"FY20", v:[ 50, 45,  5] },
    { fy:"FY21", v:[ 32, 55, 13] },
    { fy:"FY22", v:[ 15, 55, 30] },
    { fy:"FY23", v:[  5, 45, 50] },
  ];
  return (
    <div className="chart-card" style={{ marginTop:22 }}>
      <div className="chart-legend" style={{ marginBottom:22 }}>
        {segs.map((s,i)=>(
          <span className="leg" key={i} style={{ display:"inline-flex", alignItems:"center", gap:8, fontSize:13, color:"var(--ink-2)" }}>
            <span style={{ width:12, height:12, borderRadius:3, background:s.c, display:"inline-block" }}></span>{s.k}
          </span>
        ))}
      </div>
      <div style={{ display:"flex", alignItems:"flex-end", gap:"clamp(8px,2vw,20px)", height:240 }}>
        {years.map((y,yi)=>(
          <div key={yi} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:10, height:"100%" }}>
            <div style={{ flex:1, width:"100%", maxWidth:54, margin:"0 auto", display:"flex", flexDirection:"column", borderRadius:"7px 7px 0 0", overflow:"hidden", boxShadow:"var(--sh-1)" }}>
              {segs.map((s,si)=> y.v[si] > 0 ? (
                <div key={si} title={`${s.k}: ${y.v[si]}%`} style={{ height:y.v[si]+"%", background:s.c }}></div>
              ) : null)}
            </div>
            <span className="num" style={{ fontSize:12.5, color:"var(--ink-3)", fontWeight:600 }}>{y.fy}</span>
          </div>
        ))}
      </div>
      <p className="muted" style={{ fontSize:13, marginTop:16 }}>Illustrative of the phased FY17–FY23 transition described above — share of consumption met by each sourcing structure, from 100% conventional to 95% renewable.</p>
    </div>
  );
}

function CaseStudy({ nav, sub }) {
  const sel = sub ? CASES.findIndex(c=>c.id===sub) : -1;
  if (sel < 0) return <CaseIndex nav={nav}/>;
  return <CaseDetail nav={nav} c={CASES[sel]} idx={sel}/>;
}

/* ---------- segmented index (industry tabs → case cards) ---------- */
const CASE_SEGMENTS = [
  { name:"Steel",
    blurb:"Continuous, high-load operations make power a steel producer's largest controllable cost — and its hardest emissions line to abate. Our work proves a fully renewable, fully fundable path.",
    stats:[["95%","Renewable share reached"],["7 yr","Phased transition"],["None","Government incentives used"]],
    cases:["khayati-steel"] },
  { name:"Graphite & metals",
    blurb:"Energy-intensive, round-the-clock loads reward a diversified renewable portfolio. We combine wind and solar open access — then actively manage seasonal surplus and deficit for maximum value.",
    stats:[["80.7%","Renewable replacement"],["₹60 cr","Annual savings"],["80–85%","Managed portfolio replacement"]],
    cases:["graphite-india","gil-portfolio"] },
  { name:"Automotive",
    blurb:"Medium-scale demand and OEM sustainability mandates need clever engineering. Our wind-solar co-location model brings hybrid economics within reach of smaller industrial consumers.",
    stats:[["~44%","Hybrid plant load factor"],["₹0.84","Transmission cost /unit"],["₹30 L","Transmission saved p.a."]],
    cases:["honda"] },
  { name:"Chemicals",
    blurb:"Process loads run day and night, and adding capacity conventionally is costly. We hybridise existing assets and reuse infrastructure to add renewable generation without new transmission.",
    stats:[["70 MWp","Solar added to 50 MW wind"],["₹7.62 cr","Annual transmission savings"],["~95%","Renewable generation utilised"]],
    cases:["inox-gfl"] },
  { name:"Healthcare",
    blurb:"Multi-site operators need lower cost and uninterrupted power for critical care. Distributed captive solar plus lifecycle management delivers both, with centralised visibility across every site.",
    stats:[["₹8 → ₹3.25","Effective cost /unit (Karnataka)"],["~₹6 cr","Estimated annual savings"],["31+","Sites centrally monitored"]],
    cases:["cloud-nine"] },
];
const caseById = (id) => CASES.find(c=>c.id===id);

const CASE_HEADLINES = [
  { id:"graphite-india", hl:"₹60 Cr/year saved", seg:"Large graphite manufacturer", sol:"Wind + solar + open access", res:"₹84 Cr → ₹24 Cr annual energy cost", group:"Cost reduction" },
  { id:"khayati-steel", hl:"0% RE to 100% RE", seg:"Steel manufacturer", sol:"Hybrid renewable portfolio", res:"One of the lowest electricity costs in the segment", group:"Renewable penetration" },
  { id:"cloud-nine", hl:"₹3.25/unit", seg:"Healthcare portfolio", sol:"Multi-site energy optimisation", res:"Reduced from ₹8/unit", group:"Distributed / commercial energy" },
  { id:"honda", hl:"44.4% PLF", seg:"Hybrid generation portfolio", sol:"Wind + solar co-location", res:"How Integrum combined wind + solar to improve the generation profile", group:"Hybrid performance" },
  { id:"inox-gfl", hl:"70 MWp added", seg:"Chemical manufacturer", sol:"Hybridisation of an operating wind asset", res:"More generation with no new transmission", group:"Hybrid performance" },
  { id:"gil-portfolio", hl:"Portfolio managed", seg:"Graphite manufacturer", sol:"Predictive portfolio management", res:"Renewable variability turned into commercial advantage", group:"Distributed / commercial energy" },
];

const OUTCOME_GROUPS = [
  { k:"Cost reduction", d:"Lowering the delivered cost of energy against a high grid tariff." },
  { k:"Renewable penetration", d:"Moving a large share of consumption onto renewable generation." },
  { k:"Hybrid performance", d:"Improving the generation profile and transmission efficiency." },
  { k:"Distributed / commercial energy", d:"Multi-site cost, contract demand and operations management." },
];

function CaseIndex({ nav }) {
  const [tab, setTab] = useState(0);
  const seg = CASE_SEGMENTS[tab];
  return (
    <div className="page-fade lane-accent" style={{ "--p-color":"var(--amber)" }}>
      <section className="page-hero has-photo" style={{ background:"var(--navy)", color:"#EAF1F8", paddingBottom:"clamp(36px,4vw,56px)" }}>
        <VideoBG srcs={VID.site} starts={[8, 0, 0]} poster="assets/hero-poster.png" overlay="linear-gradient(120deg, rgba(8,23,42,.94) 38%, rgba(8,23,42,.62) 100%)" pos="center 50%"/>
        <div className="shell">
          <div className="breadcrumb" style={{ color:"#7E97B0" }}><a onClick={()=>nav("home")} style={{cursor:"pointer",color:"#9FB7CF"}}>Home</a> {I.arrow({width:13,height:13})} <span>Case studies</span></div>
          <div style={{ maxWidth:760, marginTop:20 }}>
            <span className="eyebrow eyebrow-light">Proof, not promises</span>
            <h1 style={{ color:"#fff", fontSize:"clamp(36px,5vw,58px)", letterSpacing:"-.035em", marginTop:16, lineHeight:1.03 }}>Outcomes we have delivered.</h1>
            <p style={{ color:"#9FB7CF", fontSize:19, marginTop:18, maxWidth:640, lineHeight:1.6 }}>Measured results from operating customer solutions. Each engagement below follows the same arc — problem, Integrum intervention, measurable outcome.</p>
          </div>
        </div>
      </section>

      {/* headline cards */}
      <section className="section" style={{ paddingTop:"clamp(40px,5vw,72px)", paddingBottom:"clamp(20px,2.4vw,32px)" }}>
        <div className="shell">
          <div className="outcome-grid">
            {CASE_HEADLINES.map((h,i)=>{
              const kase = CASES.find(x=>x.id===h.id) || {};
              return (
                <Reveal key={h.id} delay={i*60}>
                  <div className="outcome" onClick={()=>nav("case/"+h.id)} style={{ cursor:"pointer" }}>
                    <div className="outcome-photo">
                      <img src={IMG[kase.img] || IMG.windField} alt={h.seg} loading="lazy"/>
                      <span className="outcome-chip">{h.group}</span>
                    </div>
                    <div className="outcome-body">
                      <div className="o-metric num">{h.hl}</div>
                      <div className="o-metric-label">{h.seg} · {h.sol}</div>
                      <h3>{h.res}</h3>
                      <div className="o-foot"><span className="link-arrow">View case study {I.arrow({width:15,height:15})}</span></div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
          <p className="proof-note">Results vary by state, load profile, regulatory framework and commercial structure.</p>
        </div>
      </section>

      {/* grouped by outcome */}
      <section className="section" style={{ background:"var(--surface-2)", paddingTop:"clamp(36px,4vw,60px)" }}>
        <div className="shell">
          <Reveal className="sec-head">
            <span className="eyebrow">By outcome</span>
            <h2>Grouped by what the engagement delivered.</h2>
          </Reveal>
          <div className="og-grid">
            {OUTCOME_GROUPS.map((g,i)=>{
              const items = CASE_HEADLINES.filter(h=>h.group===g.k);
              return (
                <Reveal key={i} delay={i*60} className="og-card">
                  <h4>{g.k}</h4>
                  <p className="og-d">{g.d}</p>
                  <div className="og-list">
                    {items.map(it=>(
                      <button className="og-item" key={it.id} onClick={()=>nav("case/"+it.id)}>
                        <span className="ogi-m num">{it.hl}</span>
                        <span className="ogi-s">{it.seg}</span>
                        {I.arrow({width:14,height:14})}
                      </button>
                    ))}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop:"clamp(40px,5vw,72px)" }}>
        <div className="shell">
          <Reveal className="sec-head">
            <span className="eyebrow">By industry</span>
            <h2>Find the case study closest to you.</h2>
          </Reveal>
          <div className="itabs">
            {CASE_SEGMENTS.map((s,i)=>(<button key={s.name} className={`itab ${i===tab?"active":""}`} onClick={()=>setTab(i)}>{s.name}</button>))}
          </div>
          <div className="industry-panel" key={tab}>
            <div className="ip-main slidein">
              <h3 style={{ fontSize:24 }}>{seg.name}</h3>
              <p className="muted" style={{ marginTop:12, fontSize:16, lineHeight:1.6 }}>{seg.blurb}</p>
              <div className="ip-stat-row">
                {seg.stats.map((st,i)=>(
                  <div className="ip-stat" key={i}><div className={`v num ${i===0?"amber":""}`}>{st[0]}</div><div className="k">{st[1]}</div></div>
                ))}
              </div>
              <div className="ip-reg"><span style={{color:"var(--green)",marginTop:1}}>{I.check()}</span><span><b>{seg.cases.length} case stud{seg.cases.length>1?"ies":"y"}</b> in {seg.name.toLowerCase()} — open any one for the full engagement, model and outcome.</span></div>
            </div>
            <div className="ip-side slidein">
              {seg.cases.map(id=>{
                const c = caseById(id);
                return (
                  <div className="ip-case" key={id} onClick={()=>nav("case/"+id)} style={{cursor:"pointer"}}>
                    <span className="o-client" style={{fontSize:12.5,color:"var(--ink-3)"}}>Case study · {c.chip}</span>
                    <h4 style={{ fontSize:19, marginTop:6, letterSpacing:"-.01em" }}>{c.title}</h4>
                    <div className="muted" style={{ fontSize:14, marginTop:8, lineHeight:1.55 }}>{c.summary}</div>
                    <div style={{marginTop:14}}><span className="link-arrow" style={{fontSize:14}}>Read the case {I.arrow()}</span></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------- detail ---------- */
function CaseDetail({ nav, c, idx }) {
  const next = CASES[(idx + 1) % CASES.length];
  const onBack = () => nav("case");
  return (
    <div className="page-fade">
      <section className="page-hero has-photo" style={{ background:"var(--navy)", color:"#EAF1F8", paddingBottom:"clamp(40px,5vw,64px)" }}>
        <PhotoBG src={IMG[c.img]} overlay="linear-gradient(120deg, rgba(8,23,42,.93) 42%, rgba(8,23,42,.66) 100%)" pos="center"/>
        <div className="shell">
          <div className="breadcrumb" style={{ color:"#7E97B0" }}>
            <a onClick={()=>nav("home")} style={{cursor:"pointer",color:"#9FB7CF"}}>Home</a> {I.arrow({width:13,height:13})}
            <a onClick={onBack} style={{cursor:"pointer",color:"#9FB7CF"}}>Case studies</a> {I.arrow({width:13,height:13})}
            <span>{c.meta[0][1]}</span>
          </div>
          <div style={{ maxWidth:820, marginTop:20 }}>
            <span className="chip" style={{ background:"rgba(255,255,255,.06)", color:"#EAF1F8", borderColor:"rgba(255,255,255,.18)" }}>{c.chip}</span>
            {c.sample && <span className="chip" style={{ background:"rgba(236,180,40,.14)", color:"#F2C14E", borderColor:"rgba(236,180,40,.35)", marginLeft:8 }}>Illustrative sample</span>}
            <h1 style={{ color:"#fff", fontSize:"clamp(34px,4.6vw,56px)", letterSpacing:"-.035em", marginTop:18, lineHeight:1.04 }}>{c.title}</h1>
            <p style={{ color:"#9FB7CF", fontSize:19, marginTop:18, maxWidth:640, lineHeight:1.6 }}>{c.summary}</p>
            <div className="case-meta">
              {c.meta.map((m,i)=>(
                <div className="cm" key={i}><div className="k" style={{ color:"#7E97B0" }}>{m[0]}</div><div className="v" style={{ color:"#fff" }}>{m[1]}</div></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="case-body">
          <div className="case-section" style={{ borderTop:"none", paddingTop:8 }}>
            <h3>Outcomes at a glance</h3>
            <div className="case-impact">
              {c.metrics.map((m,i)=>(
                <div className="ci-card" key={i}><div className={`v num ${m.green?"green":""}`}>{m.v}</div><div className="k">{m.k}</div></div>
              ))}
            </div>
          </div>

          {c.body.map((b,i)=>(
            <div className="case-section" key={i}>
              <h3>{b.h}</h3>
              {b.p && <p>{b.p}</p>}
              {b.techs && (
                <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginTop:18 }}>
                  {c.techs.map((t,j)=>(
                    <span className="chip" key={j} style={{ background:"var(--accent-soft)", borderColor:"color-mix(in srgb, var(--accent) 40%, transparent)", color:"var(--accent-deep)", fontWeight:600 }}>{t}</span>
                  ))}
                </div>
              )}
              {b.chart && <SteelTransitionChart/>}
              {b.lead && <p>{b.lead}</p>}
              {b.list && (
                <ul className="case-list">
                  {b.list.map((it,j)=>(
                    <li key={j}><span className="cl-ic">{I.check({width:16,height:16})}</span><span>{it}</span></li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {c.sample && (
            <div className="case-section" style={{ paddingTop:18 }}>
              <p className="muted" style={{ fontSize:13.5, fontStyle:"italic", lineHeight:1.6 }}>Illustrative sample — a representative scenario for this sector, not a specific named client engagement. Figures are indicative of the outcomes our approach targets.</p>
            </div>
          )}

          <div className="case-section" style={{ display:"flex", gap:16, flexWrap:"wrap", alignItems:"center", justifyContent:"space-between" }}>
            <div>
              <h3 style={{ fontSize:30 }}>Want a number like this for your plant?</h3>
              <p style={{ marginTop:8 }}>Bring last month's bill — we'll model your path to a lower, predictable tariff.</p>
            </div>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
              <button className="btn btn-ghost" onClick={onBack}>All case studies</button>
              <button className="btn btn-nav-cta" onClick={()=>nav("cni")}>Talk to an energy advisor {I.arrow()}</button>
            </div>
          </div>

          <div className="case-section case-next" onClick={()=>nav("case/"+next.id)}>
            <div>
              <div className="t3" style={{ fontSize:12.5, textTransform:"uppercase", letterSpacing:".08em" }}>Next case study</div>
              <h3 style={{ marginTop:8, fontSize:24 }}>{next.title}</h3>
            </div>
            <span className="link-arrow">Read {I.arrow()}</span>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------- Contact (partner + advisor lane) ---------- */
function Contact({ nav, sub }) {
  const reasons = ["I'm a C&I buyer","Investor / analyst","OEM / supplier","Talent / careers","Media / press","ESG / sustainability","Other"];
  const preset = (sub||"").toLowerCase();
  const initial = preset.indexOf("career") !== -1 || preset.indexOf("talent") !== -1 ? "Talent / careers"
    : preset.indexOf("investor") !== -1 ? "Investor / analyst"
    : preset.indexOf("supplier") !== -1 || preset.indexOf("oem") !== -1 ? "OEM / supplier"
    : preset.indexOf("media") !== -1 ? "Media / press"
    : reasons[0];
  const [reason, setReason] = useState(initial);
  const [role, setRole] = useState((window.CAREER_ROLES && preset.indexOf("career") !== -1) ? "" : "");
  const [resume, setResume] = useState(null);      // { name, size, data } once read
  const [resumeErr, setResumeErr] = useState(null);
  const [sent, setSent] = useState(false);
  const [f, setF] = useState({ name:"", company:"", email:"", phone:"", help:"" });
  const [err, setErr] = useState({});
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => { setF(p=>({ ...p, [k]: e.target.value })); if (err[k]) setErr(p=>({ ...p, [k]:null })); };
  const submit = async () => {
    const e = {};
    const nameErr = validateName(f.name); if (nameErr) e.name = nameErr;
    const careers = reason === "Talent / careers";
    if (!careers && !f.company.trim()) e.company = "Please enter your company";
    const mailErr = validateEmail(f.email, { requireWork: !careers }); if (mailErr) e.email = mailErr;
    const phoneErr = validatePhone(f.phone); if (phoneErr) e.phone = phoneErr;
    if (reason === "Talent / careers" && !role) e.role = "Select the role you're applying for";
    setErr(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    await submitLead("Contact · " + reason, Object.assign({}, f, {
      reason, role,
      route_to: reason === "Talent / careers" ? "HR@integrumenergy.in" : "info@integrumenergy.in",
      resume_name: resume ? resume.name : "",
      resume_size: resume ? resume.size : "",
      resume_file: resume ? resume.data : "",
    }));
    setBusy(false);
    setSent(true);
  };
  const openRoles = (window.CAREER_ROLES || []).map(r=>r.role);
  return (
    <div className="page-fade lane-accent" style={{ "--p-color":"#014976", "--accent":"#014976", "--accent-deep":"#013A5E", "--accent-soft":"#D8E7F1" }}>
      <section className="page-hero">
        <div className="shell">
          <div className="breadcrumb"><a onClick={()=>nav("home")} style={{cursor:"pointer"}}>Home</a> {I.arrow({width:13,height:13})} <span style={{ color:"var(--ink-2)" }}>Contact</span></div>
          <div className="lane-hero contact-grid">
            <div>
              <span className="eyebrow">Start a conversation</span>
              <h1 style={{ fontSize:"clamp(34px,4.6vw,56px)", letterSpacing:"-.035em", marginTop:16, lineHeight:1.03 }}>Tell us who you are. We'll route you to the right desk.</h1>
              <p className="lead">Whether you want a savings estimate, the investor deck, a supply conversation or a role — one form, no runaround.</p>
              <div style={{ marginTop:28, display:"flex", flexDirection:"column", gap:14 }}>
                <div><div className="t3" style={{ fontSize:12, textTransform:"uppercase", letterSpacing:".08em" }}>Call</div><div className="num" style={{ fontSize:18, fontWeight:600, marginTop:3 }}>+91 76187 02052</div></div>
                <div><div className="t3" style={{ fontSize:12, textTransform:"uppercase", letterSpacing:".08em" }}>Email</div><div style={{ fontSize:18, fontWeight:600, marginTop:3 }}>{reason==="Talent / careers" ? "HR@integrumenergy.in" : "info@integrumenergy.in"}</div></div>
                <div><div className="t3" style={{ fontSize:12, textTransform:"uppercase", letterSpacing:".08em" }}>Registered office</div><div style={{ fontSize:16, marginTop:3, lineHeight:1.5 }}>736, 2nd Floor, 3rd Block,<br/>Koramangala, Bengaluru 560034</div></div>
              </div>
            </div>
            <div className="card" style={{ padding:30 }}>
              {sent ? (
                <div className="slidein" style={{ textAlign:"center", padding:"40px 0" }}>
                  <div style={{ width:56, height:56, borderRadius:"50%", background:"var(--green-soft)", color:"var(--green)", display:"grid", placeItems:"center", margin:"0 auto 18px" }}>{I.check({width:26,height:26})}</div>
                  <h3 style={{ fontSize:22 }}>Routed to the right desk.</h3>
                  <p className="muted" style={{ marginTop:8 }}>We'll be in touch within one business day.</p>
                  <button className="btn btn-ghost" style={{ marginTop:20 }} onClick={()=>nav("home")}>Back to home</button>
                </div>
              ) : (
                <div>
                  <h3 style={{ fontSize:22 }}>Who are you?</h3>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:16 }}>
                    {reasons.map(r=>(<button key={r} className={`itab ${reason===r?"active":""}`} onClick={()=>setReason(r)} style={ reason===r?{ background:"var(--p-color)", borderColor:"var(--p-color)" }:null }>{r}</button>))}
                  </div>
                  <div className="contact-fields">
                    <div className="field-l"><label style={labelStyle}>Name <span className="req">*</span></label>
                      <input value={f.name} onChange={set("name")} className={err.name?"invalid":""} style={inputStyle} placeholder="Your full name"/>
                      {err.name && <em className="field-err">{err.name}</em>}</div>
                    <div className="field-l"><label style={labelStyle}>Company {reason==="Talent / careers" ? <em className="opt">(optional)</em> : <span className="req">*</span>}</label>
                      <input value={f.company} onChange={set("company")} className={err.company?"invalid":""} style={inputStyle} placeholder="Company name"/>
                      {err.company && <em className="field-err">{err.company}</em>}</div>
                    <div className="field-l"><label style={labelStyle}>{reason==="Talent / careers" ? "Email" : "Work email"} <span className="req">*</span></label>
                      <input type="email" value={f.email} onChange={set("email")} className={err.email?"invalid":""} style={inputStyle} placeholder="name@company.com"/>
                      {err.email && <em className="field-err">{err.email}</em>}</div>
                    <div className="field-l"><label style={labelStyle}>Phone <span className="req">*</span></label>
                      <input value={f.phone} onChange={set("phone")} className={`num ${err.phone?"invalid":""}`} style={inputStyle} placeholder="+91 00000 00000"/>
                      {err.phone && <em className="field-err">{err.phone}</em>}</div>
                  </div>
                  {reason==="Talent / careers" && (
                    <div className="slidein" style={{ marginTop:14, display:"grid", gap:14 }}>
                      <div className="field-l">
                        <label style={labelStyle}>Role you're applying for <span className="req">*</span></label>
                        <select value={role} onChange={e=>{ setRole(e.target.value); if(err.role) setErr(p=>({ ...p, role:null })); }} className={err.role?"invalid":""} style={inputStyle}>
                          <option value="">Select a role</option>
                          {openRoles.map(r=>(<option key={r} value={r}>{r}</option>))}
                          <option value="General application">General application</option>
                        </select>
                        {err.role && <em className="field-err">{err.role}</em>}
                      </div>
                      <div className="field-l">
                        <label style={{ fontSize:13, fontWeight:600, color:"var(--ink-2)" }}>Upload your resume</label>
                        <label className="resume-drop">
                          <input type="file" accept=".pdf,.doc,.docx" onChange={async (ev)=>{
                            const file = ev.target.files && ev.target.files[0];
                            setResumeErr(null);
                            if (!file) { setResume(null); return; }
                            if (file.size > 4 * 1024 * 1024) { setResume(null); setResumeErr("File is larger than 4 MB — please email it to HR@integrumenergy.in"); return; }
                            try {
                              const data = await new Promise((res, rej) => {
                                const r = new FileReader();
                                r.onload = () => res(r.result);
                                r.onerror = () => rej(new Error("read failed"));
                                r.readAsDataURL(file);
                              });
                              setResume({ name:file.name, size:file.size, type:file.type, data });
                            } catch (e2) {
                              setResume(null);
                              setResumeErr("Couldn't read that file — please try again or email it to HR@integrumenergy.in");
                            }
                          }}/>
                          <span className="rd-ic">{I.doc({width:18,height:18})}</span>
                          <span className="rd-t">{resume ? resume.name + " · " + Math.round(resume.size/1024) + " KB" : "Choose a PDF or Word file (max 4 MB)"}</span>
                        </label>
                        {resumeErr && <em className="field-err">{resumeErr}</em>}
                      </div>
                    </div>
                  )}
                  <div className="field-l" style={{ marginTop:14 }}><label style={labelStyle}>How can we help? <em className="opt">(optional)</em></label><textarea rows="3" value={f.help} onChange={set("help")} style={{ ...inputStyle, resize:"vertical" }}></textarea></div>
                  {Object.keys(err).filter(k=>err[k]).length > 0 && <div className="form-alert error" style={{ marginTop:14, marginBottom:0 }}>Please complete the required fields above.</div>}
                  <button className="btn btn-primary" style={{ width:"100%", marginTop:18, background:"var(--p-color)", color:"#fff", boxShadow:"none" }} onClick={submit}>{reason==="Investor / analyst" ? "Request the investor deck" : reason==="I'm a C&I buyer" ? "Book a 60-min energy consult" : reason==="Talent / careers" ? "Submit my application" : "Send message"} {I.arrow()}</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
const labelStyle = { fontSize:13, fontWeight:600, color:"var(--ink-2)" };
const inputStyle = { width:"100%", padding:"12px 14px", borderRadius:11, border:"1px solid var(--hairline-2)", background:"var(--surface)", color:"var(--ink)", fontFamily:"var(--font-sans)", fontSize:15, outline:"none", marginTop:7 };

Object.assign(window, { CaseStudy, Contact, CASES });
