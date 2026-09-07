/* ============================================================
   spark.jsx — full SPARK framework page (5 stages, deep-linked)
   ============================================================ */
const { useState: useStateH, useEffect } = React;

const SPARK_FULL = [
  { id:"s", L:"S", hex:"#014976", soft:"#DCEAF4", name:"Scan & Develop", phase:"Pre-project · 4–6 months",
    img:"https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=72",
    tagline:"Find the right opportunity — and prove it's real.",
    objective:"Identify the right opportunity and validate project viability before a rupee is committed.",
    activities:[
      "Assess target states and their regulatory framework",
      "Identify potential consumers and their demand profile",
      "Assess sites, generation potential and development risks",
      "Land acquisition and site reservation",
      "Secure project go-ahead and block identified sites",
      "Obtain government, transmission and statutory approvals",
    ],
    optimizer:[
      "Access to identified sites with proven wind & solar resources",
      "Data-driven feasibility assessment",
      "Early identification of regulatory and development risks",
      "Faster decision-making through market intelligence",
    ],
    outcome:"An investment-ready opportunity with validated economics and reduced development risk." },
  { id:"p", L:"P", hex:"#0A6FB0", soft:"#D8EAF7", name:"Plan & Design", phase:"~2 months",
    img:"https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1200&q=72",
    tagline:"Structure the deal and engineer it to be bankable.",
    objective:"Structure the project and prepare it for execution — commercially and technically.",
    activities:[
      "Tailor the solution to each customer's consumption profile & RE goals",
      "Execute the Term Sheet (TS) with the consumer",
      "Finalize framework agreements with WTG / OEM suppliers",
      "Develop the project execution strategy",
      "Plan transmission evacuation and infrastructure requirements",
    ],
    optimizer:[
      "Optimized project configuration",
      "Strong supplier ecosystem and framework agreements",
      "Regulatory expertise ensuring faster approvals",
      "Bankable and execution-ready project structure",
    ],
    outcome:"A fully approved, execution-ready project with optimized commercial and technical design." },
  { id:"a", L:"A", hex:"#12A594", soft:"#D4F0EB", name:"Acquire & Build", phase:"~6–12 months",
    img:"https://images.unsplash.com/photo-1611365892117-00ac5ef43c90?auto=format&fit=crop&w=1200&q=72",
    tagline:"Asset creation — build and commission, efficiently.",
    objective:"Build and commission the project efficiently, with governance that keeps timelines honest.",
    activities:[
      "Right of Way (RoW) acquisition",
      "Transmission line and Pooling Substation (PSS) development",
      "Site infrastructure development",
      "Plant construction and installation",
      "Testing, commissioning and grid synchronization",
    ],
    optimizer:[
      "Site infrastructure already planned and aligned",
      "Transmission infrastructure developed in parallel",
      "Well-drafted contracts and project governance",
      "Strong project management ensuring timely delivery",
    ],
    outcome:"A renewable energy asset successfully commissioned and connected to the grid." },
  { id:"r", L:"R", hex:"#1F8F63", soft:"#DBEFE4", name:"Run & Maintain", phase:"Operational phase",
    img:"https://images.unsplash.com/photo-1545209463-e2825498edbf?auto=format&fit=crop&w=1200&q=72",
    tagline:"Keep it running — reliably, and against guarantees.",
    objective:"Ensure reliable and efficient plant performance across the operational life.",
    activities:[
      "Plant Operations & Maintenance (O&M)",
      "Asset performance monitoring",
      "Vendor and contract management",
      "Compliance and reporting",
      "Generation optimization",
    ],
    optimizer:[
      "Balanced O&M agreements",
      "Analytics-driven performance management",
      "Single-window operational support",
      "Enhanced plant availability and reliability",
    ],
    outcome:"Stable operations, maximum uptime and predictable energy generation." },
  { id:"k", L:"K", hex:"#E0951A", soft:"#FBEBCB", name:"Keep Optimising", phase:"~25 years · asset life",
    img:"https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?auto=format&fit=crop&w=1200&q=72",
    tagline:"Katalyze performance — Kore asset intelligence.",
    objective:"Maximize asset value throughout its lifecycle, and stay ready for what's next.",
    activities:[
      "Contract management and sourcing optimization",
      "Performance benchmarking and analytics",
      "Cost-optimization initiatives",
      "Lifecycle planning and asset enhancement",
      "Exit planning and strategic support",
    ],
    optimizer:[
      "Flexibility for future expansion or exit",
      "Continued support beyond commissioning",
      "Long-term commercial and operational optimization",
      "Improved returns through continuous performance enhancement",
    ],
    outcome:"Maximized lifetime value, improved returns and sustained operational excellence." },
];

function SparkPage({ nav, sub }) {
  const [active, setActive] = useStateH(sub || "s");
  const scrollToStage = (id, smooth=true) => {
    const el = document.getElementById("spark-sec-"+id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 84;
    window.scrollTo({ top:y, behavior: smooth ? "smooth" : "auto" });
  };
  // deep-link: scroll to the requested stage on mount / when sub changes
  useEffect(()=>{
    if (!sub) return;
    setActive(sub);
    const t = setTimeout(()=> scrollToStage(sub, false), 120);
    return ()=> clearTimeout(t);
  }, [sub]);
  // scroll-spy: highlight the pill for the section in view
  useEffect(()=>{
    const onScroll = ()=>{
      let cur = SPARK_FULL[0].id;
      for (const st of SPARK_FULL) {
        const el = document.getElementById("spark-sec-"+st.id);
        if (el && el.getBoundingClientRect().top <= 140) cur = st.id;
      }
      setActive(cur);
    };
    window.addEventListener("scroll", onScroll, { passive:true }); onScroll();
    return ()=> window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="page-fade spark-page">
      {/* hero */}
      <section className="spark-hero">
        <div className="spark-hero-glow" aria-hidden="true"></div>
        <div className="shell">
          <span className="eyebrow" style={{ color:"#F5B81C", marginTop:18, display:"inline-flex" }}>The SPARK framework</span>
          <h1>Every megawatt begins with a <span className="sp-word">SPARK</span>.</h1>
          <p className="spark-hero-sub">Most contractors build and walk away. SPARK is how Integrum stays accountable across the entire arc — Scan, Plan, Acquire, Run and Keep optimising — so performance risk never gets split across vendors who blame each other.</p>
          <div className="spark-journey">
            {SPARK_FULL.map((st,i)=>(
              <React.Fragment key={st.id}>
                <button className="sj-stage" style={{ "--sc":st.hex }} onClick={()=>{ setActive(st.id); scrollToStage(st.id); }}>
                  <span className="sj-top"><span className="sj-badge">{st.L}</span><span className="sj-step">0{i+1}</span></span>
                  <span className="sj-name">{st.name}</span>
                  <span className="sj-phase">{st.phase}</span>
                </button>
                {i<4 && <span className="sj-link" aria-hidden="true">{I.arrow({width:18,height:18})}</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* sticky stage nav */}
      <div className="spark-subnav">
        <div className="shell spark-subnav-inner">
          {SPARK_FULL.map(st=>(
            <button key={st.id} className={`spark-pill ${active===st.id?"is-active":""}`} style={{ "--sc":st.hex }}
              onClick={()=>{ setActive(st.id); scrollToStage(st.id); }}>
              <span className="spark-pill-l">{st.L}</span>{st.name}
            </button>
          ))}
        </div>
      </div>

      {/* stage sections */}
      {SPARK_FULL.map((st,i)=>(
        <section key={st.id} id={"spark-sec-"+st.id} className={`spark-detail ${i%2?"is-flip":""}`} style={{ "--sc":st.hex, "--sc-soft":st.soft }}>
          <div className="shell">
            <span className="spark-wm" aria-hidden="true">{st.L}</span>
            <div className="spark-detail-head">
              <span className="spark-detail-badge">{st.L}</span>
              <div>
                <div className="spark-detail-step">Stage {i+1} of 5 · {st.phase}</div>
                <h2>{st.name}</h2>
                <p className="spark-detail-tag">{st.tagline}</p>
              </div>
            </div>
            <div className="spark-detail-top">
              <div className="spark-detail-media">
                <div className="spark-media-img" style={{ backgroundImage:`linear-gradient(155deg, color-mix(in srgb,${st.hex} 26%, transparent), transparent 55%), url(${st.img})` }}></div>
                <span className="spark-media-tag" style={{ "--sc":st.hex }}><span className="smt-l">{st.L}</span>{st.name}</span>
              </div>
              <p className="spark-detail-obj"><span className="sdo-k">Objective</span> {st.objective}</p>
            </div>
            <div className="spark-detail-cols">
              <div className="spark-col">
                <h4>{I.compass({width:17,height:17})} What we do</h4>
                <ul className="spark-list">
                  {st.activities.map((a,j)=>(<li key={j}>{I.check({width:15,height:15})}<span>{a}</span></li>))}
                </ul>
              </div>
              <div className="spark-col spark-col-opt">
                <h4>{I.bolt({width:17,height:17})} The Integrum optimizer</h4>
                <ul className="spark-list">
                  {st.optimizer.map((a,j)=>(<li key={j}>{I.check({width:15,height:15})}<span>{a}</span></li>))}
                </ul>
              </div>
            </div>
            <div className="spark-outcome">
              <span className="spark-outcome-ico">{I.check({width:20,height:20})}</span>
              <span className="spark-outcome-k">Key outcome</span>
              <span className="spark-outcome-v">{st.outcome}</span>
            </div>
          </div>
        </section>
      ))}

      {/* closing CTA */}
      <section className="section spark-close">
        <div className="shell" style={{ textAlign:"center", maxWidth:720 }}>
          <h2>Ready to put SPARK to work on your load?</h2>
          <p className="lead" style={{ marginInline:"auto" }}>Start with a Scan — we'll map your states, sites and regulatory fit, and come back with an investment-ready view.</p>
          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap", marginTop:26 }}>
            <button className="btn btn-nav-cta btn-lg" onClick={()=>nav("contact")}>Talk to an advisor {I.arrow()}</button>
            <button className="btn btn-ghost btn-lg" onClick={()=>nav("cni")}>See the solutions</button>
          </div>
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { SparkPage, SPARK_FULL });
