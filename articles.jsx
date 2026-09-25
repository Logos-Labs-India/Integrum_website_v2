/* ============================================================
   articles.jsx — Knowledge Hub articles & insights
   Content supplied by the client (BESS series, Parts 1–3).
   Rendered by casestudy.jsx: listing on the Knowledge Hub index,
   full read at #case/article/<id>.
   ============================================================ */
const ARTICLES = [
  {
    id: "bess-1-standalone-solar-tod",
    series: "BESS series",
    part: "Part 1",
    kicker: "Storage economics",
    title: "Does standalone solar still make sense in the new ToD era?",
    standfirst: "Solar remains one of the lowest-cost renewable sources, but its generation is concentrated in daylight hours. Under an evolving Time-of-Day framework, the question shifts from what power costs to when it is worth replacing.",
    read: "5 min read",
    tags: ["BESS", "Time-of-Day", "Maharashtra", "Open Access"],
    blocks: [
      { t:"p", v:"For the last several years, the C&I renewable-energy conversation in Maharashtra was relatively straightforward:" },
      { t:"eq", v:"Install Solar → Replace Grid Power → Reduce Energy Cost" },
      { t:"p", v:"That equation is becoming more nuanced." },
      { t:"p", v:"With the evolving Time-of-Day (ToD) tariff framework, the value of electricity increasingly depends not only on how much power a consumer uses, but also on when it is consumed. Solar remains one of the lowest-cost renewable sources, but its generation is concentrated during daylight hours." },
      { t:"shift", from:"Is solar cheaper than grid power?", to:"Does the solar generation profile replace the hours in which grid power has the highest value?" },
      { t:"p", v:"For industrial consumers with strong daytime demand, standalone Solar can continue to deliver compelling economics. However, where a meaningful share of consumption occurs in non-solar or higher-value ToD periods, Solar alone can leave a large part of grid consumption untouched." },
      { t:"p", v:"BESS can bridge this mismatch by storing renewable energy and shifting it to periods where it creates greater value. But storage also introduces battery cost, round-trip losses, degradation and financing cost. The commercial question is therefore not whether BESS works technically; it is whether the value created by shifting energy exceeds the cost of storing it." },
      { t:"h", v:"Illustrative comparison: Solar vs Solar + 4-hour BESS" },
      { t:"table",
        note:"Customer consumption uniform on an RTC basis.",
        head:["Parameter","Solar CAPEX","Solar Group Captive","Solar + BESS CAPEX","Solar + BESS Group Captive"],
        rows:[
          ["Configuration","4.7 MWp Solar","4.7 MWp Solar","8 MWp Solar + 11.5 MWh BESS","8 MWp Solar + 11.5 MWh BESS"],
          ["RE / grid replacement","35.1%","35.1%","56.4%","56.4%"],
          ["Total landed RE cost","₹4.67/kWh","₹5.68/kWh","₹6.29/kWh","₹7.26/kWh"],
          ["Balance grid consumption","64.9%","64.9%","43.6%","43.6%"],
          ["Weighted average saving (on total consumption)","₹1.45/kWh","₹1.10/kWh","₹1.80/kWh","₹1.25/kWh"],
        ] },
      { t:"pull", v:"Solar + BESS improves renewable replacement from 35.1% to 56.4% in the illustrative case — but the battery must earn back its additional cost through better ToD utilisation." },
      { t:"h", v:"The commercial answer depends on three variables" },
      { t:"ul", v:[
        "Customer load profile and the share of consumption falling in solar, peak and non-solar hours",
        "The effective ToD differential and avoided grid / DG cost",
        "Battery cost, cycling, round-trip efficiency and expected utilisation",
      ] },
      { t:"pull", v:"Our view is simple: do not start by asking how much battery to install. Start by identifying which hours of grid consumption are actually worth replacing." },
      { t:"assum", h:"Illustrative scenario — key assumptions", v:[
        "Location: Maharashtra; analysis based on an indicative industrial consumption profile.",
        "Business models compared: CAPEX and Group Captive.",
        "Standalone Solar configuration: 4.7 MWp. Solar + BESS configuration: 8 MWp Solar + 11.5 MWh BESS.",
        "BESS cost assumption: approximately ₹5.50/kWh of energy delivered through storage.",
        "Transmission charge assumption: ₹1.02/kWh.",
        "Applicable losses, Electricity Duty, ToD tariffs and banking treatment are as used in the underlying Maharashtra model.",
        "Indicative lapse / unutilised renewable energy: approximately 4.5% for Solar and 4.6% for Solar + BESS.",
        "All values are illustrative; actual outcomes vary with customer load profile, site conditions, tariff, financing, contract terms and regulatory treatment.",
      ] },
      { t:"next", v:"In Part 2, we look at why adding Wind can materially change this equation — and why optimising the Wind-Solar mix can sometimes reduce the storage requirement itself.", to:"bess-2-wind-before-more-bess" },
    ],
  },
  {
    id: "bess-2-wind-before-more-bess",
    series: "BESS series",
    part: "Part 2",
    kicker: "Portfolio design",
    title: "Before adding more BESS, should we add wind?",
    standfirst: "Storage is not generation, and it is costly. There is another way to close the gap between renewable generation and industrial consumption: improve the generation profile itself.",
    read: "5 min read",
    tags: ["BESS", "Wind-Solar Hybrid", "Portfolio design", "Group Captive"],
    blocks: [
      { t:"p", v:"If Solar + BESS can increase renewable-energy utilisation, the obvious question is: why not simply keep increasing battery capacity until most grid consumption is replaced?" },
      { t:"pull", v:"Because storage is not generation — and it is costly." },
      { t:"p", v:"Every additional unit of energy routed through a battery carries battery capex, round-trip efficiency loss, degradation, augmentation / replacement requirements, financing cost and utilisation risk." },
      { t:"p", v:"There is another way to reduce the mismatch between renewable generation and industrial consumption: improve the generation profile itself." },
      { t:"p", v:"Solar and Wind can be naturally complementary. Solar generation is concentrated during daylight hours, while Wind can generate across daytime, evening and night periods and has a different seasonal profile. A well-designed Wind-Solar portfolio can therefore align more closely with the consumer's load curve before storage is added." },
      { t:"h", v:"Illustrative comparison: Wind vs Wind + Solar + BESS" },
      { t:"table",
        head:["Parameter","Wind CAPEX","Wind Group Captive","Wind + Solar + BESS CAPEX","Wind + Solar + BESS Group Captive"],
        rows:[
          ["Configuration","4.25 MW Wind","4.25 MW Wind","3.15 MW Wind + 5.3 MWp Solar + 15 MWh BESS","3.15 MW Wind + 5.3 MWp Solar + 15 MWh BESS"],
          ["RE / grid replacement","61.1%","61.1%","81.4%","81.4%"],
          ["Total landed RE cost","₹4.83/kWh","₹6.18/kWh","₹5.91/kWh","₹7.32/kWh"],
          ["Balance grid consumption","38.9%","38.9%","18.6%","18.6%"],
          ["Weighted average saving (on total consumption)","₹2.97/kWh","₹2.15/kWh","₹2.89/kWh","₹1.75/kWh"],
        ] },
      { t:"pull", v:"The hybrid configuration increases renewable replacement to 81.4% — but maximum renewable replacement is not the same as maximum savings." },
      { t:"p", v:"In the illustrative CAPEX case, standalone Wind produces slightly higher weighted average savings (₹2.97/kWh) than Wind + Solar + BESS (₹2.89/kWh), even though the hybrid configuration reduces grid dependence much further. This is exactly why storage should be optimised rather than maximised." },
      { t:"h", v:"What a balanced wind + solar portfolio does" },
      { t:"ul", v:[
        "Increases renewable replacement",
        "Reduces excess midday solar",
        "Provides renewable energy during non-solar hours",
        "Reduces BESS cycling requirements",
        "Can reduce the storage capacity required to achieve the same customer outcome",
      ] },
      { t:"eq", v:"Optimise Generation → Optimise Consumption → Identify the Residual ToD Gap → Size BESS" },
      { t:"p", v:"BESS should therefore be the final optimisation layer — not the starting point. The objective is to achieve the required renewable-energy replacement and savings with the minimum technically and commercially viable storage requirement." },
      { t:"shift", from:"Solar versus BESS", to:"What combination of Wind + Solar + Storage produces the lowest landed cost for the customer's actual load profile?" },
      { t:"assum", h:"Illustrative scenario — key assumptions", v:[
        "Same indicative Maharashtra industrial load profile used in Part 1.",
        "Standalone Wind configuration: 4.25 MW. Hybrid configuration: 3.15 MW Wind + 5.3 MWp Solar + 15 MWh BESS.",
        "BESS cost assumption: approximately ₹5.50/kWh of energy delivered through storage.",
        "Transmission charge assumption: ₹1.02/kWh.",
        "Applicable losses, Electricity Duty, ToD tariffs and banking treatment are as used in the underlying Maharashtra model.",
        "Indicative lapse / unutilised renewable energy: approximately 5.1% for Wind and 5.0% for Wind + Solar + BESS.",
        "All values are illustrative and should be recalculated using the customer's actual interval load data and final project / regulatory assumptions.",
      ] },
      { t:"next", v:"In Part 3, we address the harder issue: even where BESS makes technical and commercial sense, is Maharashtra's Open Access framework ready to account for it consistently?", to:"bess-3-open-access-framework" },
    ],
  },
  {
    id: "bess-3-open-access-framework",
    series: "BESS series",
    part: "Part 3",
    kicker: "Regulatory framework",
    title: "BESS makes technical sense. Is the open access framework ready?",
    standfirst: "Maharashtra has clearly placed energy storage at the centre of its renewable-energy transition. The policy direction is clear. The harder question is how storage will be implemented, metered, scheduled and commercially settled.",
    read: "8 min read",
    tags: ["BESS", "MERC", "Open Access", "Energy accounting", "Policy"],
    blocks: [
      { t:"p", v:"Maharashtra has clearly placed energy storage at the centre of its renewable-energy transition. The policy direction is clear. The more difficult question for C&I Open Access projects is how storage will be implemented, metered, scheduled and commercially settled." },
      { t:"p", v:"For developers and industrial consumers, the implementation discussion can be grouped into four fundamental questions." },

      { t:"qh", n:"1", v:"How should stored renewable energy be metered, accounted for and commercially settled under Open Access?" },
      { t:"p", v:"Open Access settlement has traditionally been structured around generation → network → consumption. BESS introduces an additional stage:" },
      { t:"eq", v:"generation → storage → discharge → consumption" },
      { t:"p", v:"This creates a connected set of questions around charging energy, round-trip losses, banking, Time-of-Day (ToD) settlement, scheduling and the treatment of energy after discharge. The same issue extends to the applicability of Transmission Charges, Wheeling Charges, Cross Subsidy Surcharge, Additional Surcharge, network losses and other system charges." },
      { t:"p", v:"Where renewable energy used to charge a BESS has already been subjected to the applicable Open Access framework, clarity is required on how the same energy should be treated when it is subsequently discharged. The framework should avoid unintended double charging, while ensuring that legitimate network usage is appropriately recovered." },
      { t:"p", v:"This becomes particularly important under Captive and Group Captive structures where BESS may sit under a different commercial structure to the underlying RE asset. When renewable electricity is first charged into a battery and later consumed by captive users, a clear methodology is required for recognising such energy — and the corresponding storage losses — for captive-consumption purposes." },
      { t:"p", v:"Further, for a BESS installed at the consumer end, clarity is required on contract demand implications, as additional power will be required during the charging process, which will require an increase in contract demand. The technical feasibility of the transformer and the distribution line supplying electricity to the consumer also becomes important here." },
      { t:"pull", v:"A standardised energy-accounting framework is essential to ensure predictable project economics and uniform implementation across stakeholders." },

      { t:"qh", n:"2", v:"Should BESS be tied to an individual generating project, or should deployment be flexible?" },
      { t:"p", v:"Battery Energy Storage Systems can be deployed at the renewable generation site, a common Pooling Substation (PSS) or at the consumer premises. Each configuration offers different technical, operational and commercial advantages." },
      { t:"p", v:"Project-level storage may simplify energy accounting, while centralised storage at a Pooling Substation can potentially improve utilisation across multiple renewable assets. Behind-the-Meter storage at the consumer end may provide additional value through ToD optimisation, peak-demand management, DG avoidance and improved energy resilience." },
      { t:"p", v:"This also raises the question of whether every renewable project should require its own dedicated battery, or whether a common BESS may be shared across multiple Wind and Solar projects or multiple consumers connected through common infrastructure." },
      { t:"p", v:"A more flexible framework could improve battery utilisation, optimise capital investment and reduce overall system cost, while continuing to meet the underlying objective of improving renewable-energy utilisation and grid reliability." },
      { t:"p", v:"Operational flexibility is equally important. A commercially efficient BESS should ideally be capable of responding dynamically to renewable surplus, customer demand, ToD tariffs, grid conditions and, where permitted, evolving market opportunities." },

      { t:"qh", n:"3", v:"Can a uniform storage requirement work across solar, wind and hybrid projects — and how should existing assets be treated?" },
      { t:"p", v:"Solar, Wind and Wind-Solar Hybrid projects have fundamentally different generation profiles. Solar generation follows a relatively predictable daytime pattern, providing regular charging opportunities during the day and potential discharge during evening peak periods." },
      { t:"p", v:"Wind generation, by contrast, is intermittent and may occur throughout both day and night. This can result in different battery utilisation, charging and discharging cycles, and therefore materially different commercial outcomes compared with Solar projects." },
      { t:"p", v:"The implementation framework should therefore consider whether a common storage requirement can achieve the intended policy objective equally across all renewable technologies, or whether the treatment should reflect the operating characteristics of the underlying generation source and the actual utilisation of storage." },
      { t:"p", v:"A related issue is the treatment of existing renewable assets. Many industrial consumers and developers already operate Wind and Solar projects under Open Access and Captive structures. Allowing existing renewable infrastructure to be integrated with future BESS investments could improve battery utilisation, reduce incremental capital cost and accelerate storage deployment, while maintaining the intent of the policy." },

      { t:"qh", n:"4", v:"Can BESS move beyond compliance and become a strategic energy-optimisation asset?" },
      { t:"p", v:"The long-term value of BESS extends well beyond meeting a mandatory storage requirement." },
      { t:"p", v:"A well-designed BESS can support Time-of-Day optimisation, peak-demand management, improved renewable-energy utilisation, DG reduction, greater energy resilience and, subject to the applicable framework, participation in evolving electricity markets." },
      { t:"p", v:"For this value to be realised, the regulatory and operational framework needs to enable the battery to capture multiple legitimate value streams rather than restricting it to a single compliance function." },
      { t:"p", v:"Clear rules on metering architecture, Special Energy Meters, scheduling, forecasting, DSM, state-of-charge treatment, renewable versus grid charging and coordination with the SLDC / distribution licensee will therefore be important." },
      { t:"p", v:"These are not merely technical implementation details. They directly affect battery sizing, utilisation, energy accounting, landed power cost and project bankability." },

      { t:"pull", v:"Technology enables BESS. Commercial optimisation determines its value. Regulatory clarity determines how effectively it can scale." },
      { t:"h", v:"The next step: a consistent implementation framework" },
      { t:"eq", v:"Metering & Energy Accounting → Open Access & Captive Treatment → Deployment & Sharing → Scheduling & Commercial Optimisation" },
      { t:"p", v:"Once these rules are clear, BESS can move from being viewed primarily as a policy or compliance requirement to becoming a genuine commercial optimisation asset for Maharashtra's C&I consumers." },
    ],
  },
];

const articleById = (id) => ARTICLES.find(a => a.id === id);

/* ---------- one rendered block ---------- */
function ArtBlock({ b, nav }) {
  if (b.t === "p")  return <p className="art-p">{b.v}</p>;
  if (b.t === "h")  return <h3 className="art-h">{b.v}</h3>;
  if (b.t === "eq") return <div className="art-eq">{b.v}</div>;
  if (b.t === "pull") return <blockquote className="art-pull">{b.v}</blockquote>;
  if (b.t === "ul") return <ul className="art-ul">{b.v.map((x,i)=>(<li key={i}>{I.check({width:15,height:15})}<span>{x}</span></li>))}</ul>;
  if (b.t === "qh") return (
    <div className="art-qh"><span className="art-qn">{b.n}</span><h3>{b.v}</h3></div>
  );
  if (b.t === "shift") return (
    <div className="art-shift">
      <div className="as-row is-from"><span className="as-k">From</span><p>“{b.from}”</p></div>
      <span className="as-arrow">{I.arrow({width:18,height:18})}</span>
      <div className="as-row is-to"><span className="as-k">To</span><p>“{b.to}”</p></div>
    </div>
  );
  if (b.t === "table") return (
    <div className="art-table-wrap">
      <table className="art-table">
        <thead><tr>{b.head.map((h,i)=>(<th key={i} className={i?"ta-c":""}>{h}</th>))}</tr></thead>
        <tbody>
          {b.rows.map((r,i)=>(
            <tr key={i}>{r.map((cell,j)=>(<td key={j} className={j?"ta-c num":"art-td-k"}>{cell}</td>))}</tr>
          ))}
        </tbody>
      </table>
      {b.note && <p className="art-table-note">{b.note}</p>}
    </div>
  );
  if (b.t === "assum") return (
    <details className="art-assum">
      <summary>{b.h}</summary>
      <ul>{b.v.map((x,i)=>(<li key={i}>{x}</li>))}</ul>
    </details>
  );
  if (b.t === "next") {
    const nx = articleById(b.to);
    return (
      <div className="art-next">
        <p>{b.v}</p>
        {nx && <button className="btn btn-nav-cta" onClick={()=>nav("case/article/"+nx.id)}>Read {nx.part} {I.arrow()}</button>}
      </div>
    );
  }
  return null;
}

/* ---------- full article ---------- */
function ArticleDetail({ nav, a }) {
  const idx = ARTICLES.findIndex(x => x.id === a.id);
  const others = ARTICLES.filter(x => x.id !== a.id);
  return (
    <div className="page-fade lane-accent" style={{ "--p-color":"var(--amber)" }}>
      <section className="art-hero">
        <div className="shell">
          <div className="breadcrumb" style={{ color:"#7E97B0" }}>
            <a onClick={()=>nav("home")} style={{cursor:"pointer",color:"#9FB7CF"}}>Home</a> {I.arrow({width:13,height:13})}
            <a onClick={()=>nav("case")} style={{cursor:"pointer",color:"#9FB7CF"}}>Knowledge Hub</a> {I.arrow({width:13,height:13})}
            <span>{a.part}</span>
          </div>
          <div className="art-hero-body">
            <div className="art-series">
              <span className="art-series-k">{a.series}</span>
              <span className="art-series-p">{a.part} of {ARTICLES.length}</span>
            </div>
            <h1>{a.title}</h1>
            <p className="art-standfirst">{a.standfirst}</p>
            <div className="art-meta">
              <span>{a.kicker}</span><i></i><span>{a.read}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section art-body-sec">
        <div className="shell art-layout">
          <article className="art-body">
            {a.blocks.map((b,i)=>(<ArtBlock key={i} b={b} nav={nav}/>))}
            <div className="art-tags">{a.tags.map((t,i)=>(<span key={i}>{"#" + t.replace(/\s+/g,"")}</span>))}</div>
          </article>
          <aside className="art-side">
            <div className="art-side-card">
              <span className="asc-k">{a.series}</span>
              {ARTICLES.map((x,i)=>(
                <button key={x.id} className={"asc-item"+(x.id===a.id?" is-active":"")} onClick={()=>nav("case/article/"+x.id)}>
                  <span className="asc-p">{x.part}</span>
                  <span className="asc-t">{x.title}</span>
                </button>
              ))}
            </div>
            <div className="art-side-cta">
              <h4>Sizing storage for your own load?</h4>
              <p>We model these configurations against your actual interval data before recommending any battery.</p>
              <button className="btn btn-nav-cta" onClick={()=>nav("contact")}>Talk to an advisor {I.arrow()}</button>
            </div>
          </aside>
        </div>
      </section>

      <section className="section" style={{ background:"var(--surface-2)", paddingTop:"clamp(26px,3vw,44px)" }}>
        <div className="shell">
          <h3 className="ir-h3">Continue reading</h3>
          <div className="art-grid" style={{ marginTop:18 }}>
            {others.map((x,i)=>(<ArticleCard key={x.id} a={x} nav={nav} delay={i*60}/>))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------- listing card ---------- */
function ArticleCard({ a, nav, delay = 0 }) {
  return (
    <Reveal delay={delay}>
      <button className="art-card" onClick={()=>nav("case/article/"+a.id)}>
        <div className="art-card-top">
          <span className="art-card-part">{a.part}</span>
          <span className="art-card-series">{a.series}</span>
        </div>
        <h4>{a.title}</h4>
        <p>{a.standfirst}</p>
        <div className="art-card-foot">
          <span className="art-card-read">{a.read}</span>
          <span className="art-card-go">Read {I.arrow({width:15,height:15})}</span>
        </div>
      </button>
    </Reveal>
  );
}

/* ---------- listing section for the Knowledge Hub index ---------- */
function ArticlesSection({ nav }) {
  return (
    <section className="section" id="insights">
      <div className="shell">
        <Reveal className="sec-head">
          <span className="eyebrow">Insights &amp; analysis</span>
          <h2>What we are working through.</h2>
          <p className="lead">Commercial and regulatory analysis from live projects — written for the people who have to sign off on the numbers.</p>
        </Reveal>
        <div className="art-grid">
          {ARTICLES.map((a,i)=>(<ArticleCard key={a.id} a={a} nav={nav} delay={i*70}/>))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { ARTICLES, articleById, ArticlesSection, ArticleDetail, ArticleCard });
