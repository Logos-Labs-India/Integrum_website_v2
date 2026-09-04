/* ============================================================
   investors.jsx — investor landing (/investors)
   ============================================================ */
function Investors({ nav }) {
  const [sub, setSub] = useState("Snapshot");
  const subnav = ["Snapshot","Financials","Filings","Governance","Shareholding","ESG","Press"];
  const keys = [
    { v:"₹312", u:" cr", k:"Revenue, latest FY", d:"+34% YoY" },
    { v:"229", u:" MW", k:"Commissioned capacity", d:"33 projects" },
    { v:"~5", u:"%", k:"Recurring revenue today", d:"O&M + EaaS" },
    { v:"₹180", u:" cr", k:"Capex programme", d:"Hybrid + BESS" },
  ];
  const downloads = [
    { t:"Annual Report FY25", m:"PDF · 8.4 MB" }, { t:"Q4 results & investor deck", m:"PDF · 3.1 MB" },
    { t:"Credit rating rationale", m:"PDF · 0.6 MB" }, { t:"IPO offer document", m:"PDF · 12 MB" },
    { t:"MGT-7 annual return", m:"PDF · 1.2 MB" }, { t:"BRSR FY25", m:"PDF · 2.0 MB" },
  ];
  const evo = [
    { label:"Projects", v:95, color:"#3E6FD6" },
    { label:"O&M recurring", v:4, color:"#18A0B8" },
    { label:"EaaS", v:1, color:"#1D9E75" },
  ];
  const target = [];

  return (
    <div className="page-fade lane-accent" style={{ "--p-color":"#3E6FD6", "--accent":"#3E6FD6", "--accent-deep":"#2C53A8", "--accent-soft":"#E3EAFA" }}>
      <section className="page-hero">
        <div className="shell">
          <div className="breadcrumb"><a onClick={()=>nav("home")} style={{cursor:"pointer"}}>Home</a> {I.arrow({width:13,height:13})} <span style={{color:"var(--ink-2)"}}>Investors</span> <span className="t3">· /investors</span></div>
          <div style={{ maxWidth:760, marginTop:18 }}>
            <span className="eyebrow">Investor relations</span>
            <h1 style={{ fontSize:"clamp(38px,5.2vw,62px)", letterSpacing:"-.035em", marginTop:16, lineHeight:1.0 }}>A scalable platform for India's energy transition.</h1>
            <p className="lead" style={{ fontSize:18.5, maxWidth:640 }}>229 MW of commissioned hybrid capacity across 33 projects, and an operating model that combines project delivery with recurring O&M and Energy-as-a-Service.</p>
          </div>
          <div className="inv-keys">
            {keys.map((x,i)=>(
              <Reveal key={i} delay={i*70}><div className="inv-key">
                <div className="v num">{x.v}<span className="u">{x.u}</span></div>
                <div className="k">{x.k}</div>
                <div className="d num">{x.d}</div>
              </div></Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop:8 }}>
        <div className="shell">
          <div className="ir-subnav" style={{ marginBottom:6 }}>
            {subnav.map(s=>(<a key={s} className={s===sub?"active":""} onClick={()=>setSub(s)} style={{cursor:"pointer"}}>{s}</a>))}
          </div>

          {sub==="Snapshot" && (
            <div className="page-fade">
              <div className="snapshot">
                {/* business model evolution */}
                <Reveal className="snap-card">
                  <h4>Business model</h4>
                  <div className="sc-sub">Project delivery alongside recurring O&M and Energy-as-a-Service.</div>
                  <div style={{ marginTop:24 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:"var(--ink-3)", marginBottom:6 }}><span>Latest FY</span><span className="num">95% projects</span></div>
                    <div className="evo-bar">{evo.map((s,i)=>(<div key={i} className="seg" style={{ width:s.v+"%", background:s.color }}></div>))}</div>
                  </div>
                  <div className="evo-legend">
                    {evo.map((s,i)=>(<span key={i} className="d"><span className="sw" style={{ background:s.color }}></span>{s.label}</span>))}
                  </div>
                </Reveal>

                {/* revenue mix (moved up to balance row) */}
                <Reveal delay={100} className="snap-card">
                  <h4>Revenue mix · latest FY</h4>
                  <div className="sc-sub">Project delivery still dominant. Recurring lines growing off a small base.</div>
                  <div style={{ display:"flex", gap:28, alignItems:"center", marginTop:18, flexWrap:"wrap" }}>
                    <Donut size={150} segments={evo} center="95%"/>
                    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                      {evo.map((s,i)=>(<div key={i} style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <span style={{ width:12, height:12, borderRadius:3, background:s.color }}></span>
                        <span style={{ fontSize:14.5 }}>{s.label}</span>
                        <span className="num" style={{ marginLeft:"auto", fontWeight:600, fontFamily:"var(--font-display)" }}>{s.v}%</span>
                      </div>))}
                    </div>
                  </div>
                </Reveal>
              </div>

              {/* full-width dark geographic footprint (featured project + glowing map) */}
              <Reveal className="geo-band">
                <div className="geo-grid">
                  <div className="geo-feature">
                    <div className="photo-frame" style={{ height:188 }}><img src={IMG.solarAerial} alt="Hybrid plant aerial" loading="lazy"/></div>
                    <span className="geo-chip">Featured project · Karnataka</span>
                    <h3>Pavagada-belt hybrid cluster</h3>
                    <p>14 wind + solar hybrid plants across Karnataka — our densest cluster, anchoring open-access supply to cement, steel and chemicals offtakers.</p>
                    <a className="geo-watch">Watch to know more {I.arrow()}</a>
                  </div>
                  <div className="geo-map">
                    <div className="geo-map-head">
                      <div>
                        <h4>33 projects across 3 states</h4>
                        <div className="geo-sub">Hover a cluster to see project density · 229 MW commissioned</div>
                      </div>
                      <span className="geo-legend">
                        <span><i style={{ background:"#5FE0B5" }}></i>Maharashtra</span>
                        <span><i style={{ background:"#F0C000" }}></i>Karnataka</span>
                        <span><i style={{ background:"#4AA8E8" }}></i>Tamil Nadu</span>
                      </span>
                    </div>
                    <ProjectsMapDark height={400}/>
                  </div>
                </div>
              </Reveal>

              <div className="snapshot" style={{ marginTop:22 }}>
                {/* projects by state */}
                <Reveal className="snap-card">
                  <h4>Projects by state</h4>
                  <div className="sc-sub">Where the 33 hybrid plants sit today.</div>
                  <div style={{ marginTop:20, display:"flex", flexDirection:"column", gap:16 }}>
                    {[
                      { l:"Karnataka", v:14, c:"#5FE0B5" },
                      { l:"Maharashtra", v:12, c:"#F0C000" },
                      { l:"Tamil Nadu", v:7, c:"#4AA8E8" },
                    ].map((r,i)=>(
                      <div key={i}>
                        <div style={{ display:"flex", justifyContent:"space-between", fontSize:14, marginBottom:7 }}><span>{r.l}</span><span className="num" style={{ fontWeight:600 }}>{r.v} projects</span></div>
                        <div style={{ height:10, borderRadius:999, background:"var(--hairline)", overflow:"hidden" }}>
                          <div style={{ height:"100%", width:(r.v/14*100)+"%", background:r.c, borderRadius:999 }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Reveal>

                {/* pipeline */}
                <Reveal delay={100} className="snap-card">
                  <h4>Capacity today</h4>
                  <div className="sc-sub">Commissioned and under-construction capacity.</div>
                  <div style={{ marginTop:20, display:"flex", flexDirection:"column", gap:16 }}>
                    {[
                      { l:"Operational", v:229, max:320, c:"#3E6FD6", s:"MW" },
                      { l:"Under construction", v:64, max:320, c:"#18A0B8", s:"MW" },
                    ].map((r,i)=>(
                      <div key={i}>
                        <div style={{ display:"flex", justifyContent:"space-between", fontSize:14, marginBottom:7 }}><span>{r.l}</span><span className="num" style={{ fontWeight:600 }}>{r.v} {r.s}</span></div>
                        <div style={{ height:12, borderRadius:999, background:"var(--hairline)", overflow:"hidden" }}>
                          <div style={{ height:"100%", width:(r.v/r.max*100)+"%", background:r.c, borderRadius:999 }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Reveal>
              </div>

              {/* downloads + sidebar */}
              <div className="inv-bottom">
                <div>
                  <h3 style={{ fontSize:24 }}>Filings & downloads</h3>
                  <div className="dl-grid dl-grid-2">
                    {downloads.map((d,i)=>(
                      <a key={i} className="dl-card">
                        <span className="dl-ico">{I.doc()}</span>
                        <span><span className="dt">{d.t}</span><span className="dm num">{d.m}</span></span>
                        <span className="dl-arrow">{I.download()}</span>
                      </a>
                    ))}
                  </div>
                </div>
                <Reveal delay={80}>
                  <div className="ir-sidebar">
                    <h4>Stay on the list.</h4>
                    <p style={{ color:"#9FB7CF", fontSize:14.5, marginTop:8, position:"relative" }}>Results, filings and the latest deck — straight to your inbox.</p>
                    <input className="ir-input" placeholder="you@fund.com"/>
                    <button className="btn btn-primary" style={{ width:"100%", marginTop:14 }}>Subscribe to IR updates</button>
                    <button className="btn btn-ghost" style={{ width:"100%", marginTop:10, color:"#fff", borderColor:"rgba(255,255,255,.28)" }}>Download latest investor deck {I.download({width:16,height:16})}</button>
                  </div>
                </Reveal>
              </div>
            </div>
          )}

          {sub!=="Snapshot" && (
            <div className="page-fade" style={{ marginTop:8 }}>
              <h3 style={{ fontSize:24, marginBottom:6 }}>{sub}</h3>
              <p className="muted" style={{ maxWidth:620 }}>Clean download cards for every {sub.toLowerCase()} document — annual reports, quarterly results, ratings and statutory filings.</p>
              <div className="dl-grid">
                {downloads.slice(0,6).map((d,i)=>(
                  <a key={i} className="dl-card"><span className="dl-ico">{I.doc()}</span><span><span className="dt">{sub} document {i+1}</span><span className="dm num">{d.m}</span></span><span className="dl-arrow">{I.download()}</span></a>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { Investors });
