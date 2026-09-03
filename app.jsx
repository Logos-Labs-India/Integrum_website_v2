/* ============================================================
   app.jsx — router shell, nav, footer, mount (loads last)
   LIGHT THEME · blue primary
   ============================================================ */
function LeadsAdmin() {
  const [tick, setTick] = useState(0);
  const [url, setUrl] = useState(window.activeEndpoint ? activeEndpoint() : "");
  const [test, setTest] = useState(null);      // null | "busy" | {ok,error}
  const rows = (window.readLeads ? readLeads() : []).slice().reverse();
  const cols = ["submitted_at","form","name","company","email","phone","industry","consumption","location","state","reason","role","resume_name","notes","help"];
  const inCode = !!window.LEADS_ENDPOINT;
  const isSet = !!(window.activeEndpoint && activeEndpoint());
  // "live" requires a delivery that actually succeeded — never just a saved string
  const live = isSet && !!(window.isVerified && isVerified());
  const unproven = isSet && !live;
  return (
    <div className="page-fade">
      <section className="page-hero"><div className="shell">
        <span className="eyebrow">Internal</span>
        <h1 style={{ fontSize:"clamp(28px,3.4vw,42px)", letterSpacing:"-.03em", marginTop:12 }}>Form submissions</h1>
        <p className="muted" style={{ marginTop:12, maxWidth:760 }}>
          {live
            ? "Submissions are being delivered to your endpoint. Every lead is also kept in this browser as a backup, so nothing is lost if delivery fails."
            : unproven
              ? "An endpoint URL is saved but no submission has reached it yet. Until a test succeeds, treat delivery as not working."
              : "No delivery endpoint is connected, so submissions are stored only in the visitor's own browser — which means you cannot see them. Connect an endpoint below before the site goes live."}
        </p>

        <div className={"lead-setup" + (live ? " is-live" : unproven ? " is-unproven" : "")}>
          <div className="ls-head">
            <span className={"ls-dot" + (live ? " on" : unproven ? " warn" : "")}></span>
            <strong>{live
              ? (inCode ? "Connected — delivery verified" : "Delivery verified — on this browser only")
              : unproven ? "Saved, but delivery not yet verified" : "Not connected"}</strong>
          </div>
          <p className="ls-p">
            Paste the web-app URL from your Google Apps Script deployment (steps are in
            <code> SETUP-leads-to-google-sheets.md</code>), then send a test row to prove it works.
          </p>
          <div className="ls-row">
            <input className="ls-input" value={url} onChange={e=>{ setUrl(e.target.value); setTest(null); }}
              placeholder="https://script.google.com/macros/s/AKfycb.../exec"/>
            <button className="btn btn-nav-cta" disabled={test==="busy" || !url.trim()} onClick={async()=>{
              setTest("busy");
              setTestEndpoint(url.trim());
              const r = await testEndpoint(url.trim());
              setTest(r); setTick(t=>t+1);
            }}>{test==="busy" ? "Testing…" : "Save & test"}</button>
            {url && <button className="btn btn-ghost" onClick={()=>{ setTestEndpoint(""); setUrl(""); setTest(null); setTick(t=>t+1); }}>Disconnect</button>}
          </div>
          {test && test !== "busy" && (
            <div className={"form-alert " + (test.ok ? "success" : "error")} style={{ marginTop:14, marginBottom:0 }}>
              {test.ok
                ? "Connected. A test row was sent — check your sheet, then delete that row."
                : "Couldn't reach that URL: " + test.error + ". Check the deployment is set to “Anyone” access."}
            </div>
          )}
          {!inCode && live && (
            <p className="ls-warn">Verified on this browser only. To deliver leads from <strong>every visitor</strong>, paste this into <code>leads.js</code>:<br/>
              <code className="ls-code">window.LEADS_ENDPOINT = "{activeEndpoint()}";</code></p>
          )}
        </div>
        <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginTop:20 }}>
          <button className="btn btn-nav-cta" onClick={()=>downloadLeadsCSV()}>{`Download CSV (${rows.length})`}</button>
          <button className="btn btn-ghost" disabled={!rows.length} onClick={()=>{
            if (window.confirm("Delete all " + rows.length + " stored submission(s) from this browser? Download the CSV first if you need a copy \u2014 this cannot be undone.")) {
              clearLeads(); setTick(t=>t+1);
            }
          }}>Clear stored leads</button>
        </div>
      </div></section>
      <section className="section" style={{ paddingTop:0 }}><div className="shell">
        {rows.length === 0
          ? <p className="muted">No submissions captured in this browser yet.</p>
          : <div className="co2-table-wrap"><table className="co2-table">
              <thead><tr>{cols.map(c=>(<th key={c}>{c.replace(/_/g," ")}</th>))}</tr></thead>
              <tbody>{rows.map((r,i)=>(<tr key={i}>{cols.map(c=>(<td key={c}>{r[c] || ""}</td>))}</tr>))}</tbody>
            </table></div>}
      </div></section>
    </div>
  );
}

const PAGES = {
  home: Home, cni: CnILane, investors: Investors, dashboard: Dashboard, case: CaseStudy, about: About, contact: Contact, spark: SparkPage, platform: Platform, careers: Careers,
  leads:      LeadsAdmin,
  terms:      (p)=><Legal kind="terms" {...p}/>,
  privacy:    (p)=><Legal kind="privacy" {...p}/>,
  disclaimer: (p)=><Legal kind="disclaimer" {...p}/>,
};
const PAGE_META = {
  home:      ["Integrum Energy | Wind + Solar Hybrid Power for Industry in India", "Wind + solar hybrid plants for India's industrial businesses — lower, predictable power costs and a credible path to 100% renewable (RE 100)."],
  cni:       ["Cut Your Industrial Power Bill — Wind + Solar Hybrid | Integrum Energy", "Hybrid wind + solar, open access, group captive, BESS and EaaS — engineered to take your industrial tariff toward ₹3 per unit."],
  case:      ["Case Studies — Renewable Power for Steel, Cement & More | Integrum Energy", "Real engagements across steel and cement: from 100% conventional to RE 100, and power cost cut from ₹7 to ₹3 per unit."],
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
const NAV_LINKS = [
  { label:"Solutions", page:"cni" },
  { label:"Platform", page:"platform" },
  { label:"Case studies", page:"case" },
  { label:"Investors", page:"investors" },
  { label:"Company", page:"about" },
  { label:"People", page:"careers" },
];
const SOCIALS = [
  { key:"linkedin",  label:"LinkedIn",  href:"https://www.linkedin.com/company/integrum-energy/" },
];

/* ---------- global search ---------- */
function buildSearchIndex() {
  const base = [
    { label:"Home", desc:"Overview & live generation", go:"home", kind:"Page" },
    { label:"Solutions", desc:"Cut your energy bill — hybrid, storage, EaaS", go:"cni", kind:"Page" },
    { label:"Platform", desc:"Energy Intelligence dashboard", go:"dashboard", kind:"Page" },
    { label:"Case studies", desc:"Proof across steel, cement & more sectors", go:"case", kind:"Page" },
    { label:"Investors", desc:"Snapshot, financials & governance", go:"investors", kind:"Page" },
    { label:"Company", desc:"Our story, impact & leadership", go:"about", kind:"Page" },
    { label:"Contact an advisor", desc:"Talk to a consultant", go:"contact", kind:"Page" },
  ];
  const cases = (window.CASES || []).map(c => ({ label:c.title, desc:c.chip, go:"case/"+c.id, kind:"Case study" }));
  return base.concat(cases);
}

function SearchModal({ onClose, nav }) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const index = useMemo(buildSearchIndex, []);
  const results = useMemo(()=>{
    const s = q.trim().toLowerCase();
    if (!s) return index;
    return index.filter(it => (it.label+" "+it.desc+" "+it.kind).toLowerCase().includes(s));
  }, [q, index]);
  useEffect(()=>{ inputRef.current && inputRef.current.focus(); }, []);
  useEffect(()=>{ setActive(0); }, [q]);
  useEffect(()=>{
    const onKey = (e)=>{
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowDown") { e.preventDefault(); setActive(a=>Math.min(a+1, results.length-1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActive(a=>Math.max(a-1, 0)); }
      else if (e.key === "Enter" && results[active]) { nav(results[active].go); onClose(); }
    };
    window.addEventListener("keydown", onKey);
    return ()=> window.removeEventListener("keydown", onKey);
  }, [results, active, onClose, nav]);
  const go = (it)=>{ nav(it.go); onClose(); };
  return (
    <div className="search-overlay" onMouseDown={onClose}>
      <div className="search-box" onMouseDown={e=>e.stopPropagation()}>
        <div className="search-head">
          <span style={{ color:"var(--ink-3)" }}>{I.search()}</span>
          <input ref={inputRef} value={q} onChange={e=>setQ(e.target.value)} placeholder="Search pages, case studies, sectors…" aria-label="Search"/>
          <button className="nav-icon" onClick={onClose} aria-label="Close search">{I.x()}</button>
        </div>
        <div className="search-results">
          {results.length === 0 ? (
            <div className="search-empty">No matches for "{q}". Try "case", "investors" or "savings".</div>
          ) : results.map((it,i)=>(
            <div key={it.go+i} className={`search-item ${i===active?"active":""}`} onMouseEnter={()=>setActive(i)} onClick={()=>go(it)}>
              <span style={{ color:"var(--accent-deep)", display:"grid", placeItems:"center", width:22 }}>{it.kind==="Case study" ? I.doc({width:18,height:18}) : I.compass({width:18,height:18})}</span>
              <div style={{ minWidth:0 }}>
                <div style={{ fontWeight:600, fontSize:15, color:"var(--ink)", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{it.label}</div>
                <div style={{ fontSize:13, color:"var(--ink-3)", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{it.desc}</div>
              </div>
              <span className="search-kind">{it.kind}</span>
            </div>
          ))}
        </div>
        <div className="search-foot">
          <span><kbd>↑</kbd><kbd>↓</kbd> to navigate</span>
          <span><kbd>↵</kbd> to open</span>
          <span><kbd>esc</kbd> to close</span>
        </div>
      </div>
    </div>
  );
}

function Nav({ page, nav, onSearch }) {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  useEffect(()=>{
    const onScroll = ()=> setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll); onScroll();
    return ()=> window.removeEventListener("scroll", onScroll);
  },[]);
  useEffect(()=> setMenu(false), [page]);
  return (
    <React.Fragment>
      <nav className={`nav ${scrolled?"scrolled":""}`}>
        <div className="shell nav-inner">
          <a className="nav-logo" onClick={()=>nav("home")} style={{ cursor:"pointer" }}>
            <img className="brand-logo" src="assets/logo-integrum.svg" alt="Integrum Energy"/>
            <img className="nav-gptw" src="assets/gptw.png" alt="Great Place to Work Certified" title="Great Place to Work® Certified"/>
          </a>
          <div className="nav-links">
            {NAV_LINKS.map(l=>(
              <a key={l.label} className={page===l.page?"active":""} onClick={()=>nav(l.page)} style={{ cursor:"pointer" }}>{l.label}</a>
            ))}
          </div>
          <div className="nav-right">
            <button className="nav-icon" onClick={onSearch} title="Search (⌘K)" aria-label="Search">{I.search()}</button>
            <a className="nav-textlink" onClick={()=>nav("dashboard")} style={{ cursor:"pointer" }}>Customer login</a>
            <button className="btn btn-nav-cta" onClick={()=>nav("contact")}>Talk to an advisor</button>
            <button className="nav-icon menu-btn" onClick={()=>setMenu(m=>!m)} aria-label="Menu">{I.menu()}</button>
          </div>
        </div>
      </nav>
      {menu && (
        <div className="mobile-menu">
          {NAV_LINKS.map(l=>(<a key={l.label} onClick={()=>nav(l.page)}>{l.label}</a>))}
          <a onClick={()=>nav("dashboard")}>Customer login</a>
          <button className="btn btn-nav-cta btn-lg" style={{ marginTop:18 }} onClick={()=>nav("contact")}>Talk to an advisor</button>
        </div>
      )}
    </React.Fragment>
  );
}

function Footer({ nav }) {
  const cols = [
    { h:"Solutions", links:[["Cut my energy bill","cni"],["Hybrid wind + solar","cni"],["Energy storage · BESS","cni"],["CAPEX · OPEX · EaaS","cni"]] },
    { h:"Platform", links:[["Energy Intelligence","dashboard"],["Customer login","dashboard"],["Savings calculator","cni"],["Open access tracker","dashboard"]] },
    { h:"Investors", links:[["Investor snapshot","investors"],["Financials & filings","investors"],["Governance","investors"],["ESG / BRSR","investors"]] },
    { h:"Company", links:[["Case studies","case"],["The SPARK difference","spark"],["People","careers"],["Contact","contact"]] },
  ];
  const badges = ["ISO 9001:2015","ISO 14001:2015","Great Place to Work","Company of the Year 2024"];
  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer-grid">
          <div>
            <div className="brand-chip" style={{ marginBottom:16 }}>
              <img src="assets/logo-integrum.svg" alt="Integrum Energy"/>
            </div>
            <p style={{ color:"#9FB3C7", fontSize:14, maxWidth:280, lineHeight:1.55 }}>Integrum Energy Infrastructure Ltd. — hybrid wind + solar plants and lifecycle energy management for India's industrial businesses.</p>
            <div className="footer-social">
              {SOCIALS.map(s=>(
                <a key={s.key} className="fsoc" href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} title={s.label}>{I[s.key]({width:18,height:18})}</a>
              ))}
            </div>
            <div className="footer-badges">
              {badges.map((b,i)=>(<span className="fbadge" key={i}>{I.award({width:14,height:14})}{b}</span>))}
            </div>
          </div>
          {cols.map((c,i)=>(
            <div className="footer-col" key={i}>
              <h5>{c.h}</h5>
              {c.links.map((l,j)=>(<a key={j} onClick={()=>nav(l[1])} style={{ cursor:"pointer" }}>{l[0]}</a>))}
            </div>
          ))}
        </div>
        <div className="footer-base">
          <span>© {new Date().getFullYear()} Integrum Energy Infrastructure Ltd. · CIN U40106KA2021PLC144691 · Bengaluru, India</span>
          <span style={{ display:"flex", gap:18, flexWrap:"wrap" }}>
            <a onClick={()=>nav("privacy")} style={{ cursor:"pointer" }}>Privacy Policy</a>
            <a onClick={()=>nav("terms")} style={{ cursor:"pointer" }}>Terms & Conditions</a>
            <a onClick={()=>nav("disclaimer")} style={{ cursor:"pointer" }}>Disclaimer</a>
          </span>
        </div>
      </div>
    </footer>
  );
}

function App() {
  const TWEAK_DEFAULTS = {
    accent: ["#014976", "#013A5E", "#D8E7F1"],   // [base, deep, soft] — brand blue
  };
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const parseHash = () => {
    const raw = (location.hash || "").replace("#", "");
    const [top, ...rest] = raw.split("/");
    return { top: top || "home", sub: rest.join("/") || null };
  };
  const [route, setRoute] = useState(parseHash);
  const page = route.top;

  // keep the light theme locked in
  useEffect(()=>{ document.documentElement.setAttribute("data-theme", "light"); }, []);
  // apply brand accent live
  useEffect(()=>{
    const r = document.documentElement, [b,d,s] = t.accent || [];
    if (b) { r.style.setProperty("--amber", b); r.style.setProperty("--amber-deep", d); r.style.setProperty("--amber-soft", s); }
  }, [t.accent]);

  const nav = (p) => {
    const [path, hash] = String(p).split("#");
    const [top, ...rest] = path.split("/");
    setRoute({ top: top || "home", sub: rest.join("/") || null });
    history.replaceState(null, "", "#"+path);
    if (hash) {
      window.scrollTo({ top:0, behavior:"auto" });
      const tries = [80, 320, 700];
      tries.forEach(ms => setTimeout(()=>{
        const el = document.getElementById(hash);
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 84, behavior:"smooth" });
      }, ms));
      return;
    }
    window.scrollTo({ top:0, behavior:"auto" });
  };
  useEffect(()=>{
    const onHash = ()=> setRoute(parseHash());
    window.addEventListener("hashchange", onHash);
    return ()=> window.removeEventListener("hashchange", onHash);
  },[]);
  // per-page SEO: keep <title> + meta description in sync with the route
  useEffect(()=>{
    const [title, desc] = PAGE_META[page] || PAGE_META.home;
    document.title = title;
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement("meta"); m.setAttribute("name","description"); document.head.appendChild(m); }
    m.setAttribute("content", desc);
    let ogt = document.querySelector('meta[property="og:title"]');
    if (ogt) ogt.setAttribute("content", title);
    let ogd = document.querySelector('meta[property="og:description"]');
    if (ogd) ogd.setAttribute("content", desc);
  },[page]);
  const Page = PAGES[page] || Home;
  const isDashApp = page === "dashboard";
  const [searchOpen, setSearchOpen] = useState(false);
  useEffect(()=>{
    const onKey = (e)=>{
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setSearchOpen(o=>!o); }
      else if (e.key === "/" && !/input|textarea/i.test((e.target.tagName||"")) ) { e.preventDefault(); setSearchOpen(true); }
    };
    window.addEventListener("keydown", onKey);
    return ()=> window.removeEventListener("keydown", onKey);
  },[]);

  const ACCENTS = [
    ["#014976","#013A5E","#D8E7F1"],  // brand deep blue
    ["#005B96","#00426E","#DCEBF7"],  // brighter blue
    ["#024D77","#013A5E","#D9E8F2"],  // navy blue
    ["#1D9E75","#137A57","#DDF1E9"],  // renewable green
  ];
  return (
    <React.Fragment>
      <Nav page={page} nav={nav} onSearch={()=>setSearchOpen(true)}/>
      <main key={page}><Page nav={nav} sub={route.sub}/></main>
      {!isDashApp && <Footer nav={nav}/>}
      {searchOpen && <SearchModal nav={nav} onClose={()=>setSearchOpen(false)}/>}
      <TweaksPanel>
        <TweakSection label="Brand accent" />
        <TweakColor label="Accent color" value={t.accent} options={ACCENTS} onChange={(v)=>setTweak("accent", v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
