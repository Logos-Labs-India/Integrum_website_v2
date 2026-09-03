/* ============================================================
   home.jsx — the router homepage (7 sections) + persona re-skin
   ============================================================ */
const { useState: useStateH, useEffect: useEffectH, useRef: useRefH } = React;

const PERSONAS = [
  { id:"cost", icon:"bolt", title:"Cut my energy bills", tag:"Show me my savings potential", lane:"contact", primary:true,
    hex:"var(--amber)", deep:"var(--amber-deep)", soft:"var(--amber-soft)",
    promise:"See where your energy cost can go, and what that's worth to your plant.", next:"Talk to an energy advisor" },
  { id:"re", icon:"leaf", title:"Increase my renewable share", tag:"Plan my transition to clean energy", lane:"cni",
    hex:"#1F8F63", deep:"#146B49", soft:"#DCEFE4",
    promise:"A fundable, audited path from conventional power to a high renewable share — no greenwashing.", next:"See the renewable transition solutions" },
  { id:"build", icon:"factory", title:"Build a renewable project", tag:"Develop and execute end-to-end", lane:"spark",
    hex:"#0A6FB0", deep:"#08517F", soft:"#DBEDF8",
    promise:"Land, connectivity, approvals, engineering and execution — made bankable and built to perform.", next:"See our development & project capabilities" },
  { id:"optimise", icon:"gauge", title:"Optimise my existing assets", tag:"Improve performance and lifetime returns", lane:"dashboard",
    hex:"#C2542F", deep:"#9C3F20", soft:"#FBE5DC",
    promise:"O&M, asset management, forecasting, scheduling and power markets — keeping lifetime ₹/kWh low.", next:"Open the operations & optimisation view" },
];

const SPARK = [
  { L:"S", title:"Scan", one:"Identify and validate the right opportunity.", line:"Understand load, tariff, regulations, sites and constraints.", dur:"Pre-project · 4–6 months",
    does:"We assess target states and the regulatory framework, identify consumers and their demand profile, evaluate sites, generation potential and risks, then acquire land and secure approvals to reserve the best sites.",
    get:"An investment-ready opportunity with validated economics and reduced development risk." },
  { L:"P", title:"Plan", one:"Structure and design the project for execution.", line:"Design the lowest-cost energy mix and commercial structure.", dur:"~2 months",
    does:"We tailor the solution to each customer's consumption profile and RE goals, execute the term sheet, finalise framework agreements with WTG/OEM suppliers, and plan transmission evacuation and the execution strategy.",
    get:"A fully approved, execution-ready project with optimized commercial and technical design." },
  { L:"A", title:"Acquire & Build", one:"Build and commission the asset efficiently.", line:"Secure land, approvals, connectivity and execute the project.", dur:"~6–12 months",
    does:"We acquire right of way, develop the transmission line and pooling substation, build site infrastructure, construct and install the plant, then test, commission and synchronise it to the grid.",
    get:"A renewable energy asset commissioned and connected to the grid." },
  { L:"R", title:"Run", one:"Operate and maintain the asset reliably.", line:"Operate, maintain, forecast and schedule.", dur:"Operational phase",
    does:"We run plant O&M, monitor asset performance, manage vendors and contracts, handle compliance and reporting, and continuously optimize generation — through a single window.",
    get:"Stable operations, maximum uptime and predictable energy generation." },
  { L:"K", title:"Keep Optimising", one:"Maximise asset value throughout its lifecycle.", line:"Use storage, markets, trading and portfolio optimisation to keep reducing lifetime energy cost.", dur:"~25 years · asset life",
    does:"We optimize contracts and sourcing, benchmark performance with analytics, drive cost-optimization initiatives, plan the asset lifecycle and support future expansion or exit.",
    get:"Maximized lifetime value, improved returns and sustained operational excellence." },
];

const OUTCOMES = [
  { metric:"₹84cr → ₹24cr", ml:"annual power spend, ~71% lower", h:"Graphite manufacturer cuts power spend by ₹60 crore", client:"Graphite · hybrid open access", img:"windField", esg:false, go:"case/graphite-india" },
  { metric:"0% → 100%", ml:"conventional to renewable, in 7 years", h:"Green-steel maker reaches 100% renewable", client:"Steel · no incentives", img:"steelPlant", esg:true, go:"case/khayati-steel" },
  { metric:"₹8 → ₹3.25", ml:"per unit, across 31+ hospital sites", h:"Hospital chain optimises cost across 31+ sites", client:"Healthcare · captive solar", img:"solarClose", esg:false, go:"case/cloud-nine" },
  { metric:"44% PLF", ml:"hybrid, vs 24% solar / 34% wind", h:"A wind–solar co-location model for medium-scale industry", client:"Automotive · hybrid co-location", img:"wind", esg:true, go:"case/honda" },
];

/* measured outcomes — context + intervention + outcome, in three buckets */
const PROOF = [
  { client:"Graphite manufacturer", sector:"Graphite & metals", go:"case/graphite-india", img:"windField",
    context:"₹84 Cr annual power cost against ~8 crore units a year, spread across all operating hours.",
    intervention:"Wind + solar + open access optimisation — 18.9 MW wind and 8.8 MW solar, sized on the hourly load profile.",
    outcome:"₹24 Cr annual power cost. ₹60 Cr annual saving.",
    buckets:[["Cost outcome","₹60 Cr EBITDA savings"],["Renewable outcome","80.7% replacement"],["Performance outcome","20% of RE depends on banking"]] },
  { client:"Midsize steel manufacturer", sector:"Steel", go:"case/khayati-steel", img:"steelPlant",
    context:"100% conventional power, 88–104 million units a year, with electricity a major share of production cost.",
    intervention:"A phased seven-year transition across exchange, group captive and a captive wind–solar hybrid.",
    outcome:"From 0% RE to 100% RE, reached without a single government incentive.",
    buckets:[["Cost outcome","Cost-competitive vs grid"],["Renewable outcome","From 0% RE to 100% RE"],["Performance outcome","One of the lowest electricity costs"]] },
  { client:"Multi-location hospital chain", sector:"Healthcare", go:"case/cloud-nine", img:"solarClose",
    context:"31+ sites across Karnataka and Maharashtra on high-cost grid power, with critical-care loads.",
    intervention:"Distributed captive solar — 5 MWp and 4.2 MWp DC — with open-access, metering and lifecycle management.",
    outcome:"Effective cost from ₹8 to ₹3.25 a unit. ~₹6 Cr estimated annual saving.",
    buckets:[["Cost outcome","~₹6 Cr saved / yr"],["Renewable outcome","85% overall replacement"],["Performance outcome","31+ sites monitored centrally"]] },
  { client:"Two-wheeler manufacturer", sector:"Automotive", go:"case/honda", img:"wind",
    context:"A medium-scale load where a conventional hybrid project is usually uneconomic.",
    intervention:"2.7 MW wind co-located with 1.5 MWp solar on one footprint, evacuating through a shared 33 kV line.",
    outcome:"~44% hybrid plant load factor, against 24% solar and 34% wind standalone.",
    buckets:[["Cost outcome","Transmission charges down ₹30 lakh p.a."],["Renewable outcome","Hybrid with optimised evacuation"],["Performance outcome","~44% PLF per MW"]] },
];

/* ---------- savings calculator (shared with C&I lane) ---------- */
const STATES = ["Karnataka","Maharashtra","Tamil Nadu","Gujarat","Rajasthan","Telangana","Madhya Pradesh","Andhra Pradesh"];
const INDUSTRIES = ["Steel & metals","Graphite & metals","Automotive","Chemicals","Healthcare","Cement","Commercial real estate"];

function SavingsCalculator({ compact = false, onCase }) {
  const [st, setSt] = useStateH("Karnataka");
  const [bill, setBill] = useStateH("");
  const [load, setLoad] = useStateH("");
  const [ind, setInd] = useStateH("Cement");
  const [res, setRes] = useStateH(null);

  const calc = () => {
    const b = parseFloat(bill) || 0;
    if (b <= 0) { setRes({ err: true }); return; }
    const annual = b * 12;
    const lo = annual * 0.42, hi = annual * 0.60;
    const toLakh = (x) => (x/1e5);
    setRes({
      lo: toLakh(lo), hi: toLakh(hi),
      payback: b > 4e6 ? "3.0–3.6" : b > 1.5e6 ? "3.4–4.2" : "4.0–4.8",
      tariff: ind === "Steel & metals" || ind === "Cement" ? "₹3.1–3.6" : "₹3.4–4.0",
    });
  };

  return (
    <div className="calc">
      <h3>Calculate Your Renewable Energy Savings in 30 Seconds.</h3>
      <p className="calc-sub">Same model we'd run in stage S of SPARK — order-of-magnitude, no email required.</p>
      <div className="calc-fields" style={compact ? null : { gridTemplateColumns: "1fr 1fr" }}>
        <div className="field">
          <label>State</label>
          <select value={st} onChange={e=>setSt(e.target.value)}>{STATES.map(s=><option key={s}>{s}</option>)}</select>
        </div>
        <div className="field">
          <label>Industry</label>
          <select value={ind} onChange={e=>setInd(e.target.value)}>{INDUSTRIES.map(s=><option key={s}>{s}</option>)}</select>
        </div>
        <div className="field">
          <label>Monthly bill (₹)</label>
          <input className="num" type="number" inputMode="numeric" placeholder="e.g. 2500000" value={bill} onChange={e=>setBill(e.target.value)}/>
        </div>
        <div className="field">
          <label>Sanctioned load (kVA)</label>
          <input className="num" type="number" inputMode="numeric" placeholder="e.g. 5000" value={load} onChange={e=>setLoad(e.target.value)}/>
        </div>
      </div>
      <button className="btn btn-primary" style={{ marginTop: 20, width: "100%" }} onClick={calc}>Calculate my savings</button>

      {res && !res.err && (
        <div className="calc-result slidein">
          <div className="k" style={{ fontSize:12, textTransform:"uppercase", letterSpacing:".06em" }}>Estimated annual savings</div>
          <div className="big num">₹{res.lo.toFixed(0)}–{res.hi.toFixed(0)} lakh</div>
          <div className="result-row">
            <div className="result-stat"><div className="k">Target tariff</div><div className="v num">{res.tariff}/unit</div></div>
            <div className="result-stat"><div className="k">Payback</div><div className="v num">~{res.payback} yrs</div></div>
          </div>
          <button className="link-arrow" style={{ marginTop:18 }} onClick={()=> onCase && onCase()}>
            Show me a comparable case study {I.arrow()}
          </button>
        </div>
      )}
      {res && res.err && <div className="calc-result slidein" style={{ color:"#C23A26" }}>Enter your monthly bill to see an estimate.</div>}
    </div>
  );
}

/* ---------- LIGHT SPLIT HERO (turbine video) ---------- */
function Hero({ nav }) {
  const heroStats = [ {v:"229",u:"+ MW",k:"commissioned"}, {v:"34",u:"+",k:"trusted partners"}, {v:"155",u:"+",k:"hybrid capacity"} ];
  return (
    <section className="hero-l has-photo">
      <VideoBG srcs={VID.site} starts={[8, 0, 0]} poster="assets/hero-poster.png" pos="center 45%"
        overlay="linear-gradient(90deg, rgba(1,44,70,.68) 0%, rgba(1,52,79,.46) 40%, rgba(1,52,79,.42) 62%, rgba(1,44,70,.46) 100%), linear-gradient(180deg, transparent 45%, rgba(1,44,70,.34) 100%)"/>
      <div className="shell hero-l-inner">
        <div className="hero-l-copy">
          <span className="chip-eyebrow"><span className="pulse-dot"></span> India's wind + solar hybrid operator</span>
          <h1>Your energy. Fully integrated. <span className="hl-plain">Fully optimized.</span></h1>
          <p className="hero-l-sub">Integrum designs, builds and manages the lowest-cost energy mix for businesses. Solar. Wind. Storage. Markets. Lifecycle management. One accountable partner from strategy and implementation to operations.</p>
          <div className="hero-l-cta">
            <button className="btn btn-solar btn-lg" onClick={()=>nav("cni")}>Cut my energy bill {I.arrow()}</button>
            <button className="btn btn-ghost-light btn-lg" onClick={()=>nav("contact")}>Talk to an advisor</button>
          </div>
        </div>
        <div className="hero-l-media">
          <div className="hero-stats-plain">
            <span className="hsc-k">Integrum today</span>
            <div className="hsp-grid">
              {heroStats.map((s,i)=>(
                <div className="hsp-item" key={i}>
                  <div className="hsp-v num">{s.v}<span className="u">{s.u}</span></div>
                  <div className="hsp-l">{s.k}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- WHAT WE DO ---------- */
function WhatWeDo({ nav }) {
  const cards = [
    { icon:"compass", title:"Design the right energy mix", go:"cni#sol-tech",
      body:"Wind, solar, hybrid, storage and grid power — configured around your load, location and economics." },
    { icon:"factory", title:"Structure & deliver the project", go:"spark/a",
      body:"Land, connectivity, approvals, commercial structuring, engineering and execution — made bankable and built to perform." },
    { icon:"battery", title:"Decarbonise on-site", go:"cni#sol-b",
      body:"Behind-the-meter solar, BESS and distributed-energy solutions that reduce grid dependence and peak costs." },
    { icon:"gauge", title:"Operate & continuously optimise", go:"spark/k",
      body:"O&M, asset management, forecasting, scheduling, storage and power markets — keeping lifetime ₹/kWh low." },
  ];
  return (
    <section className="section wwd-sec" id="what-we-do">
      <div className="shell">
        <Reveal className="sec-head">
          <span className="eyebrow">What we do</span>
          <h2>One energy strategy.<br/>Built around your business.</h2>
        </Reveal>
        <div className="wwd-grid wwd-grid-4">
          {cards.map((c,i)=>(
            <Reveal key={i} delay={i*80} className="wwd-card is-link" onClick={()=>nav(c.go)}>
              <span className="wwd-ico">{I[c.icon]({width:22,height:22})}</span>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <div className="wwd-foot wwd-foot-center">{I.link({width:16,height:16})} One accountable partner across the energy lifecycle.</div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- PERSONA ROUTER BAND (own light band under hero) ---------- */
function PersonaRouterBand({ nav }) {
  const go = (per) => {
    if (per.scroll) { const el=document.getElementById(per.scroll); if(el) window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-80,behavior:"smooth"}); }
    else nav(per.lane);
  };
  return (
    <section className="router-band" id="router">
      <div className="shell">
        <div className="router-head">
          <div className="rh-title">I'm here to…</div>
          <div className="rh-note">Pick your lane — one click takes you there</div>
        </div>
        <div className="prouter-grid">
          {PERSONAS.map(per=>(
            <button key={per.id}
              className={`prouter ${per.primary?"primary":""}`}
              style={{ "--p-color": per.hex }}
              onClick={()=>go(per)}>
              <div className="prouter-top">
                <span className="prouter-ico">{I[per.icon]()}</span>
                {per.primary && <span className="p-badge">Most popular</span>}
              </div>
              <div>
                <h3>{per.title}</h3>
                <div className="p-tag">{per.tag}</div>
              </div>
              <span className="p-foot">{per.next} {I.arrow()}</span>
              <span className="prouter-pop" role="tooltip">
                <span className="pp-line">{per.promise}</span>
                <span className="pp-next">{I.arrow({width:13,height:13})} {per.next}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- STAT BAR (raised, overlaps hero) ---------- */
function ProofBand() {
  const stats = [
    { n:"25", u:" Yr", s:"We run each plant's full lifecycle" },
    { n:"24×7", u:"", s:"Live remote monitoring with SLA" },
    { n:"70–80", u:"%", uBig:true, s:"Of replacement of power demand." },
    { n:"8–14", u:" months", s:"Feasibility to commissioning" },
  ];
  const logos = [
    { t:"Midsize steel manufacturer", ic:"segSteel" },
    { t:"Multi-location hospital chain", ic:"segHospital" },
    { t:"Graphite manufacturer", ic:"segGraphite" },
    { t:"Two-wheeler manufacturer", ic:"segScooter" },
    { t:"Chemical manufacturer", ic:"segFlask" },
    { t:"Leading water tanks & pipes manufacturer", ic:"segPipes" },
    { t:"Woven packaging manufacturer", ic:"segWoven" },
    { t:"Cement manufacturer", ic:"segCement" },
    { t:"Leading jewellery retailer", ic:"segDiamond" },
  ];
  return (
    <section className="statbar-sec">
      <div className="shell">
        <div className="statbar">
          {stats.map((s,i)=>(
            <div className="statbar-item" key={i}>
              <div className="sb-n num">{s.n}<span className={`u ${s.uBig?"u-big":""}`}>{s.u}</span></div>
              <div className="sb-s">{s.s}</div>
            </div>
          ))}
        </div>
        <div className="trust-marquee">
          <span className="tm-label">Trusted by segment leaders</span>
          <div className="tm-row">
            {logos.map((l,i)=>(<span className="tm-item" key={i}><span className="tm-ic">{I[l.ic]({width:20,height:20})}</span>{l.t}</span>))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- MARQUEE STRIP ---------- */
function MarqueeStrip() {
  const items = ["Wind + Solar Hybrid","Open Access","Group Captive","BESS Storage","RE 100","Energy-as-a-Service","24×7 O&M","Live Energy Intelligence"];
  const row = [...items, ...items];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {row.map((t,i)=>(<span className="marquee-item" key={i}>{t}<span className="marquee-dot">◆</span></span>))}
      </div>
    </div>
  );
}

/* ---------- hybrid generation mix (stacked bars + demand line) ---------- */
function HybridMixChart() {
  const W = 980, H = 470, PL = 74, PR = 26, PT = 52, PB = 96;
  // client data — time-of-day generation profile across 24 hours
  const wind  = [62,58,55,54,53,52,53,50,48,47,46,46,47,48,47,46,48,52,58,62,63,62,63,65];
  const solar = [0,0,0,0,0,0,2,18,40,55,62,64,62,58,52,42,22,6,0,0,0,0,0,0];
  const yMax = 130;
  const n = wind.length;
  const x = i => PL + (i/(n-1))*(W-PL-PR);
  const y = v => PT + (1-v/yMax)*(H-PT-PB);
  const base = y(0);
  const areaTo = arr => `M${x(0).toFixed(1)},${base.toFixed(1)} ` +
    arr.map((v,i)=>`L${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ") +
    ` L${x(n-1).toFixed(1)},${base.toFixed(1)} Z`;
  const stacked = wind.map((w,i)=> w + solar[i]);
  const bandSolar = `M${x(0).toFixed(1)},${y(wind[0]).toFixed(1)} ` +
    stacked.map((v,i)=>`L${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ") + " " +
    wind.slice().reverse().map((v,k)=>`L${x(n-1-k).toFixed(1)},${y(v).toFixed(1)}`).join(" ") + " Z";
  const totalLine = stacked.map((v,i)=>`${i?"L":"M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const ticks = [0,35,70,105,130];
  return (
    <div className="cc25">
      <div className="cc25-legend">
        <span className="leg"><span className="sw" style={{ background:"#E8722C" }}></span>Solar generation</span>
        <span className="leg"><span className="sw" style={{ background:"#1E6B34" }}></span>Wind generation</span>
        <span className="leg"><span className="sw" style={{ background:"#29A9E1" }}></span>Combined output</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="cc25-svg" role="img" aria-label="Time-of-day generation profile: solar delivers most of its output in seven hours while wind generates through the day">
        {ticks.map(t=>(
          <g key={t}>
            <line x1={PL} x2={W-PR} y1={y(t)} y2={y(t)} stroke="rgba(1,73,118,.10)" strokeWidth="1"/>
            <text x={PL-14} y={y(t)+10} textAnchor="end" className="cc25-ax">{t}</text>
          </g>
        ))}
        <path d={areaTo(wind)} fill="#1E6B34" opacity=".92"/>
        <path d={bandSolar} fill="#E8722C" opacity=".95"/>
        <path d={totalLine} fill="none" stroke="#29A9E1" strokeWidth="3.2" strokeLinejoin="round" strokeLinecap="round"/>
        {wind.map((_,i)=>(
          <text key={i} x={x(i)} y={H-PB+40} textAnchor="middle" className="cc25-ax">{i+1}</text>
        ))}
        <text x={PL-4} y={PT-16} className="cc25-note">TOD generation profile (indexed)</text>
        <text x={(W-PL-PR)/2+PL} y={H-14} textAnchor="middle" className="cc25-ax">Hour of day</text>
      </svg>
      <p className="cc25-cap">Solar delivers about 80% of its output in roughly seven hours around midday, while wind generates through the day and night. Combining them fills the gaps either source leaves alone. Indicative profile; your actual curve depends on site and resource data.</p>
    </div>
  );
}

/* ---------- 25-year cost curve (Total Cost vs Discom Cost) ---------- */
function CostCurve25() {
  const W = 980, H = 470, PL = 96, PR = 26, PT = 30, PB = 104;
  // client data — cost in ₹ crore across the 25-year asset life
  const discom = [200,200.5,201,201,200.5,200.5,201,202,204,207,210,213,215.5,218,221,224,227.5,230,233.5,236,239.5,243,246,249,251.5];
  const total  = [80,92,101,112,120,127,135,139,147,35,35.4,35.6,35.7,35.8,35.9,36,36,36.1,36.2,36.3,36.4,36.5,36.6,36.7,36.8];
  const yMin = 0, yMax = 300;
  const x = i => PL + (i/24) * (W-PL-PR);
  const y = v => PT + (1-(v-yMin)/(yMax-yMin)) * (H-PT-PB);
  const line = arr => arr.map((v,i)=>`${i?"L":"M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const areaBetween = `${line(discom)} L${x(24).toFixed(1)},${y(total[24]).toFixed(1)} ${total.slice().reverse().map((v,k)=>`L${x(24-k).toFixed(1)},${y(v).toFixed(1)}`).join(" ")} Z`;
  const ticks = [0,50,100,150,200,250,300];
  const xLabels = [1,3,5,7,9,11,13,15,17,19,21,23,25];
  return (
    <div className="cc25">
      <div className="cc25-legend">
        <span className="leg"><span className="sw" style={{ background:"#E8425F" }}></span>Discom cost</span>
        <span className="leg"><span className="sw" style={{ background:"#2E8FD4" }}></span>Total cost with Integrum</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="cc25-svg" role="img" aria-label="25-year cost of energy: discom cost versus total cost with Integrum">
        <defs>
          <linearGradient id="cc25fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFCE03" stopOpacity=".26"/>
            <stop offset="1" stopColor="#FFCE03" stopOpacity=".05"/>
          </linearGradient>
        </defs>
        {ticks.map(t=>(
          <g key={t}>
            <line x1={PL} x2={W-PR} y1={y(t)} y2={y(t)} stroke="rgba(1,73,118,.10)" strokeWidth="1"/>
            <text x={PL-16} y={y(t)+10} textAnchor="end" className="cc25-ax">{t}</text>
          </g>
        ))}
        {xLabels.map(l=>(
          <text key={l} x={x(l-1)} y={H-PB+40} textAnchor="middle" className="cc25-ax">{l}</text>
        ))}
        <path d={areaBetween} fill="url(#cc25fill)"/>
        <path d={line(discom)} fill="none" stroke="#E8425F" strokeWidth="2.6" strokeLinejoin="round"/>
        <path d={line(total)} fill="none" stroke="#2E8FD4" strokeWidth="3" strokeLinejoin="round"/>
        {discom.map((v,i)=>(<circle key={"d"+i} cx={x(i)} cy={y(v)} r="3.4" fill="#fff" stroke="#E8425F" strokeWidth="1.8"/>))}
        {total.map((v,i)=>(<circle key={"t"+i} cx={x(i)} cy={y(v)} r="3.4" fill="#fff" stroke="#2E8FD4" strokeWidth="1.8"/>))}
        <text x={PL-4} y={PT-8} className="cc25-note">Cost (₹ crore)</text>
        <text x={(W-PL-PR)/2+PL} y={H-14} textAnchor="middle" className="cc25-ax">Year</text>
      </svg>
      <p className="cc25-cap">The discom bill keeps climbing year on year. A hybrid plant carries build-phase cost early, then steps down sharply at commissioning and stays low for the asset's life. Indicative shape; your curve depends on state tariff and structure.</p>
    </div>
  );
}

/* ---------- seasonal generation: client's month-wise hybrid data ----------
   Source: "Generation Month wise.xlsx" (client-supplied). Values are kWh,
   plotted in thousands. No demand series was supplied, so none is drawn. */
const SEASON = [
  { m:"Jan", w:233, s:146 }, { m:"Feb", w:175, s:136 },
  { m:"Mar", w:186, s:141 }, { m:"Apr", w:110, s:132 },
  { m:"May", w:203, s:145 }, { m:"Jun", w:415, s:110 },
  { m:"Jul", w:457, s:107 }, { m:"Aug", w:295, s:130 },
  { m:"Sep", w:324, s:121 }, { m:"Oct", w:159, s:135 },
  { m:"Nov", w:142, s:134 }, { m:"Dec", w:240, s:143 },
];

function SeasonChart() {
  const W = 640, H = 300, PL = 46, PR = 12, PT = 24, PB = 46, MAX = 500;
  const iw = W - PL - PR, ih = H - PT - PB;
  const slot = iw / SEASON.length;
  const bw = slot * 0.30;                       // two separate bars per month
  const y = (v) => PT + ih - (v / MAX) * ih;
  return (
    <figure className="chart-img chart-svg">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Month-wise hybrid wind and solar generation shown as separate bars">
        {[0,125,250,375,500].map(g=>(
          <g key={g}>
            <line x1={PL} x2={W-PR} y1={y(g)} y2={y(g)} stroke="var(--hairline)" strokeWidth="1"/>
            <text x={PL-8} y={y(g)+4} className="sc-ax" textAnchor="end">{g}</text>
          </g>
        ))}
        {SEASON.map((p,i)=>{
          const cx = PL + i*slot + slot/2;
          return (
            <g key={p.m}>
              <rect x={cx-bw-2} y={y(p.s)} width={bw} height={PT+ih-y(p.s)} rx="2.5" fill="#F5B81C"/>
              <rect x={cx+2}    y={y(p.w)} width={bw} height={PT+ih-y(p.w)} rx="2.5" fill="#014976"/>
              <text x={cx} y={H-26} className="sc-ax" textAnchor="middle">{p.m}</text>
            </g>
          );
        })}
        <line x1={PL} x2={W-PR} y1={PT+ih} y2={PT+ih} stroke="var(--hairline-2)" strokeWidth="1.2"/>
        <text x={PL} y={H-6} className="sc-cap">Generation, thousand kWh per month</text>
      </svg>
      <div className="sc-legend">
        <span><i style={{ background:"#F5B81C" }}></i>Solar</span>
        <span><i style={{ background:"#014976" }}></i>Wind</span>
      </div>
      <figcaption>Actual month-wise generation from an operating hybrid plant. Wind more than doubles through the monsoon exactly as solar falls to its lowest, and solar holds steady through the dry months when wind drops away.</figcaption>
    </figure>
  );
}

/* ---------- SAVINGS STUDIO (chart) ---------- */
function CostStory({ nav }) {
  const [st,setSt] = useStateH("Karnataka");
  const [ind,setInd] = useStateH("Cement");
  const [bill,setBill] = useStateH("");
  const [load,setLoad] = useStateH("");
  const [cur,setCur] = useStateH("");
  const [res,setRes] = useStateH(null);
  const [err,setErr] = useStateH(false);

  const calc = () => {
    const b = parseFloat(bill) || 0;
    if (b <= 0) { setErr(true); setRes(null); return; }
    setErr(false);
    const annual = b * 12;
    const curTariff = parseFloat(cur) > 0 ? parseFloat(cur) : 8.5;
    const heavy = ind === "Steel & metals" || ind === "Cement";
    const target = heavy ? 3.3 : 3.7;
    const gridEnd = +Math.min(13, curTariff * 1.28).toFixed(1);
    const lo = annual * 0.42, hi = annual * 0.60;
    const units = annual / curTariff;                 // kWh / yr
    const co2 = Math.round(units * 0.00071);          // tCO2e / yr
    const fiveYr = ((lo + hi) / 2 * 5) / 1e7;          // ₹ crore
    const payback = b > 4e6 ? "3.0–3.6" : b > 1.5e6 ? "3.4–4.2" : "4.0–4.8";
    const heavyMix = heavy ? [55,35,10] : [40,50,10];
    const l = parseFloat(load) || 0;
    setRes({
      loL: lo/1e5, hiL: hi/1e5, target, curTariff, gridEnd, co2, fiveYr, payback,
      mix: heavyMix,
      ebitda: ((lo + hi) / 2) / 1e7,
      gridDep: heavy ? "70–80" : "60–75",
      peakKva: l > 0 ? Math.round(l * 0.7) : null,
      saveLabel: `₹${(lo/1e5).toFixed(0)}–${(hi/1e5).toFixed(0)}L saved / yr`,
      caseIdx: ind === "Steel & metals" ? 0 : 1,
    });
  };

  const fmt = (n) => Number(n).toLocaleString("en-IN");
  const chart = res
    ? { gridStart: res.curTariff, gridEnd: res.gridEnd, target: res.target, saveLabel: res.saveLabel }
    : { gridStart: 7.0, gridEnd: 9.8, target: 3.2, saveLabel: null };
  const kase = res ? OUTCOMES[res.caseIdx] : null;

  const pills = res ? [
    { ic:"compass", k:"Energy mix · wind / solar / storage", v:`${res.mix[0]} / ${res.mix[1]} / ${res.mix[2]}%`, c:"#0A6FB0" },
    { ic:"trendUp", k:"EBITDA impact",            v:`+₹${res.ebitda.toFixed(2)} cr / yr`, c:"var(--amber)" },
    { ic:"gauge",   k:"Grid dependency reduced",  v:`${res.gridDep}%`, c:"#014976" },
    { ic:"leaf",    k:"CO₂ replaced / yr",        v:`${fmt(res.co2)} t`, c:"var(--green)" },
    { ic:"bolt",    k:"Peak demand replaced",     v: res.peakKva ? `~${fmt(res.peakKva)} kVA` : "Add load to see", c:"var(--solar-deep)" },
  ] : [];

  return (
    <section className="section ss" id="savings">
      <div className="shell">
        <Reveal className="sec-head">
          <span className="eyebrow">The core story</span>
          <h2>Most plants pay <span className="amber-num num">₹7–9</span> a unit. We get them to <span className="amber-num num">₹3–4</span>.</h2>
          <p className="lead">The discom tariff keeps climbing while a hybrid plant steps your cost down at commissioning and holds it for 25 years — that gap is money that stays in your business.</p>
        </Reveal>

        <div className="ss-grid ss-grid-solo">
          <Reveal className="ss-viz chart-pair">
            <div className="chart-trio">
              <div className="chart-col">
                <div className="chart-col-head">
                  <span className="eyebrow">Cost over 25 years</span>
                  <h3>Your cost steps down. The discom's keeps climbing.</h3>
                </div>
                <figure className="chart-img">
                  <img src="assets/chart-cost-25yr-nofigures.png" alt="Total cost with Integrum versus discom cost across 25 years" loading="lazy"/>
                  <figcaption>The discom bill keeps climbing year on year. A hybrid plant carries build-phase cost early, then steps down sharply at commissioning and stays low for the asset's life.</figcaption>
                </figure>
              </div>
              <div className="chart-col">
                <div className="chart-col-head">
                  <span className="eyebrow">Generation through the year</span>
                  <h3>One source dips. The other picks it up.</h3>
                </div>
                <SeasonChart/>
              </div>
              <div className="chart-col">
                <div className="chart-col-head">
                  <span className="eyebrow">Generation through the day</span>
                  <h3>Solar peaks in 7 hours. Wind runs all day.</h3>
                </div>
                <figure className="chart-img">
                  <img src="assets/chart-tod-profile.png" alt="Time-of-day generation profile: solar delivers 80% of its power in seven hours while wind generates through the day" loading="lazy"/>
                  <figcaption>Solar generates about 80% of its power in roughly seven hours; wind generates through the day. Combining them fills the gaps either source leaves alone.</figcaption>
                </figure>
              </div>
            </div>
            {res ? (
              <div className="ss-pills">
                {pills.map((p,i)=>(
                  <div className="ss-pill" key={i}>
                    <span className="ss-pill-ic" style={{ color:p.c }}>{I[p.ic]({width:16,height:16})}</span>
                    <div><div className="ss-pill-v num">{p.v}</div><div className="ss-pill-k">{p.k}</div></div>
                  </div>
                ))}
              </div>
            ) : null}
            {kase && (
              <button className="ss-case" onClick={()=>nav(kase.go)}>
                <img src={IMG[kase.img]} alt={kase.client}/>
                <div className="ss-case-body">
                  <div className="ss-case-tag">Comparable case · {kase.client}</div>
                  <div className="ss-case-metric num">{kase.metric}</div>
                  <div className="ss-case-h">{kase.h}</div>
                </div>
                <span className="ss-case-arrow">{I.arrow()}</span>
              </button>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- SPARK (compact clickable stepper → full page) ---------- */
const SPARK_HEX = ["#014976","#0A6FB0","#12A594","#1F8F63","#E0951A"];
function SparkSection({ nav, note }) {
  return (
    <section className="section spark-sec" id="spark">
      <div className="shell">
        <Reveal className="sec-head spark-head">
          <span className="eyebrow">The framework · SPARK</span>
          <h2>Every megawatt begins with a <span className="spark-word">SPARK</span>.</h2>
          <p className="lead">One partner across the whole arc — from the first site scan to optimizing a live asset 25 years later. Pick a stage to see exactly what we do.</p>
        </Reveal>
        {note && <p className="spark-note">{note}</p>}
        <div className="spark-stepper">
          {SPARK.map((st,i)=>(
            <button key={i} className="spark-node" style={{ "--sc": SPARK_HEX[i] }} onClick={()=>nav("spark/"+st.L.toLowerCase())}>
              <span className="spark-node-badge">{st.L}</span>
              <span className="spark-node-title">{st.title}</span>
              <span className="spark-node-one">{st.one}</span>
              <span className="spark-node-dur">{st.dur}</span>
              <span className="spark-node-go">Explore {I.arrow({width:15,height:15})}</span>
            </button>
          ))}
        </div>
        <div className="spark-cta-row">
          <span className="spark-cta-note"><strong>One partner.</strong> From first analysis to year 25.</span>
          <button className="btn btn-primary" onClick={()=>nav("spark")}>Explore the full SPARK framework {I.arrow()}</button>
        </div>
      </div>
    </section>
  );
}

/* ---------- MEASURED OUTCOMES (context → intervention → outcome) ---------- */
function Outcomes({ nav }) {
  return (
    <section className="section proof-sec">
      <div className="shell">
        <Reveal className="sec-head">
          <span className="eyebrow">Proof, not promises</span>
          <h2>Measured outcomes from operating projects.</h2>
          <p className="lead">Every engagement below follows the same arc — the situation we found, what we changed, and what it delivered.</p>
        </Reveal>
        <div className="proof-list">
          {PROOF.map((p,i)=>(
            <Reveal key={i} delay={i*60}>
              <article className="proof-card">
                <div className="proof-media">
                  <img src={IMG[p.img]} alt={p.client} loading="lazy"/>
                  <span className="proof-sector">{p.sector}</span>
                </div>
                <div className="proof-body">
                  <h3>{p.client}</h3>
                  <div className="proof-steps">
                    <div className="proof-step">
                      <span className="ps-k">Context</span>
                      <p>{p.context}</p>
                    </div>
                    <div className="proof-step is-mid">
                      <span className="ps-k">Integrum solution</span>
                      <p>{p.intervention}</p>
                    </div>
                    <div className="proof-step is-out">
                      <span className="ps-k">Outcome</span>
                      <p>{p.outcome}</p>
                    </div>
                  </div>
                  <div className="proof-buckets">
                    {p.buckets.map((b,j)=>(
                      <div className="proof-bucket" key={j}>
                        <span className="pb-k">{b[0]}</span>
                        <span className="pb-v num">{b[1]}</span>
                      </div>
                    ))}
                  </div>
                  <button className="link-arrow" onClick={()=>nav(p.go)}>Read the full case {I.arrow()}</button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <p className="proof-note proof-note-tight">Results vary by state, load profile, regulatory framework and commercial structure.</p>
      </div>
    </section>
  );
}

/* ---------- WHY NOT EPC (shift cards) ---------- */
const EPC_ROWS = [
  ["Optimises project CAPEX",              "Optimises lifetime ₹/kWh"],
  ["Builds the asset",                     "Designs the complete energy strategy"],
  ["Scope largely ends at COD",            "Stays accountable through operations"],
  ["Customer coordinates multiple parties", "One accountable partner"],
  ["Static project design",                "Continuous optimisation"],
  ["Project performance focus",             "Customer energy-cost focus"],
];
function WhyIntegrum({ nav }) {
  const badges = ["ISO 9001:2015","ISO 14001:2015","Great Place to Work","Company of the Year 2024"];
  return (
    <section className="section why-sec">
      <div className="shell">
        <Reveal className="sec-head">
          <span className="eyebrow">Why not a projects-only contractor</span>
          <h2>A projects-only contractor delivers the plant. Integrum delivers the energy outcome.</h2>
        </Reveal>
        <Reveal>
          <div className="shift-legend">
            <span className="sl-a">A typical contractor</span>
            <span className="sl-arrow">{I.arrow({width:16,height:16})}</span>
            <span className="sl-b">Integrum</span>
          </div>
          <div className="shift-grid">
            {EPC_ROWS.map((r,i)=>(
              <div className="shift-card" key={i}>
                <span className="shift-num">0{i+1}</span>
                <span className="shift-from">{r[0]}</span>
                <span className="shift-to">{r[1]}</span>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal>
          <p className="epc-close">For the next 25 years, the important question is not only whether the plant is running. It is whether your energy cost is still optimised.</p>
          <div style={{ display:"flex", gap:14, flexWrap:"wrap", marginTop:22 }}>
            <button className="btn btn-primary btn-lg" onClick={()=>nav("spark")}>See how SPARK works {I.arrow()}</button>
            <button className="btn btn-ghost btn-lg" onClick={()=>nav("cni")}>Explore solutions</button>
          </div>
        </Reveal>
        <Reveal className="trust-row">
          {badges.map((b,i)=>(<span key={i} className="trust-badge"><span className="ti">{I.award()}</span>{b}</span>))}
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- ONE ASK (with the savings calculator) ---------- */
function OneAsk({ nav }) {
  return (
    <section className="ask has-photo" id="savings-calc">
      <PhotoBG src={IMG.windField} overlay="linear-gradient(100deg, rgba(1,58,94,.96) 30%, rgba(1,58,94,.78) 100%)" pos="center 42%"/>
      <div className="shell ask-inner">
        <div className="ask-copy">
          <Reveal>
            <span className="eyebrow">One ask</span>
            <h2 style={{ marginTop:16 }}>Tell us your plant's energy bill. We'll tell you what it could be.</h2>
            <div className="ask-actions">
              <button className="btn btn-nav-cta btn-lg" onClick={()=>nav("contact")}>Talk to an energy advisor {I.arrow()}</button>
              <button className="btn btn-ghost-light btn-lg" onClick={()=>nav("investors")}>Get the investor deck</button>
            </div>
            <div className="ask-contact">
              <div><div className="k">Call</div><div className="v num">+91 76187 02052</div></div>
              <div><div className="k">Email</div><div className="v">info@integrumenergy.in</div></div>
              <div><div className="k">Registered office</div><div className="v">736, 2nd Floor, 3rd Block, Koramangala, Bengaluru 560034</div></div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Home({ nav }) {
  return (
    <div className="page-fade">
      <Hero nav={nav}/>
      <ProofBand/>
      <PersonaRouterBand nav={nav}/>
      <WhatWeDo nav={nav}/>
      <MarqueeStrip/>
      <Outcomes nav={nav}/>
      <CostStory nav={nav}/>
      <WhyIntegrum nav={nav}/>
      <OneAsk nav={nav}/>
    </div>
  );
}

Object.assign(window, { Home, PersonaRouterBand, SavingsCalculator, SparkSection, PERSONAS, SPARK, PROOF, STATES, INDUSTRIES });
