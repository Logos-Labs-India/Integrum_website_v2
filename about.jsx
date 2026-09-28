/* ============================================================
   about.jsx — Company / About Integrum Energy
   Flow per client brief · VMV content from the VMV policy doc
   ============================================================ */

/* company figures: FIG is defined globally in figures.js */

const ABOUT_STATS = [
  { ic:"bolt",    v:FIG.greenUnitsMn, u:"mn",    k:"Green units generated to date (kWh)" },
  { ic:"shield",  v:FIG.co2Total,     u:"",      k:"Tonnes of CO₂ avoided to date" },
  { ic:"trendUp", v:FIG.co2LatestFY,  u:"",      k:"Tonnes of CO₂ avoided in FY25–26" },
  { ic:"factory", v:FIG.commissioned, u:" MW",   k:"Commissioned capacity" },
];

const STORY_HIGHLIGHTS = [
  { v:"~170 GW", k:"C&I hybrid power requirement — about 50% of India's total consumption" },
  { v:"~2%", k:"Of that met today by wind + solar PPAs combined" },
  { v:"~6 GW", k:"Addressable under credit-rating-driven IPP models" },
  { v:"~70 GW", k:"Hybrid market we're opening up — over 10× larger" },
];

/* why we exist — the complexity industrial customers have to manage */
const COMPLEXITY = ["Grid power","Open access","Solar","Wind","Storage","Captive structures","Regulations","O&M","Forecasting","Trading"];

/* our evolution */
const EVOLUTION = [
  { k:"Consulting", d:"Hybrid & captive energy solutions" },
  { k:"Renewable Projects", d:"Engineering, procurement & construction" },
  { k:"Sites & Project Development", d:"Land, connectivity, approvals" },
  { k:"Operations & Asset Management", d:"Wind and solar O&M, SCADA" },
  { k:"Energy-as-a-Service", d:"Integrated commercial solutions" },
  { k:"Power Markets & Storage", d:"Trading, scheduling, BESS dispatch" },
];

/* company-level numbers — AWAITING CLIENT CONFIRMATION */
/* Figures below are from the client's Supportings sheet.
   NOT YET SUPPLIED (kept out of the page rather than inferred):
     · Revenue (₹ Cr)
     · MW under management
     · Years of operation
     · Revenue and years-of-operation figures remain unconfirmed.
       Footprint (FIG.states = 4): Gujarat, Karnataka, Maharashtra are
       operating; Tamil Nadu is under development and is shown on the
       map (PROJECT_REGIONS) with a "development" status rather than
       a project count. */
const TODAY = [
  { v:FIG.commissioned,  u:" MW", k:"Commissioned capacity",  note:"Operating" },
  { v:FIG.hybrid,        u:"+ MW", k:"Hybrid capacity",        note:"85 MW hybrid + 70 MW hybridisation" },
  { v:FIG.partners,      u:"+",   k:"Trusted partners",       note:"Customers served" },
  { v:FIG.greenUnitsMn,  u:" mn", k:"Green units generated",  note:"kWh to date" },
];

const DIFFERENT = [
  { ic:"trendUp", k:"Outcome-led", d:"We optimise customer energy economics, not individual technologies." },
  { ic:"compass", k:"Technology-agnostic", d:"Wind, solar, storage and markets are selected around the customer load." },
  { ic:"gauge", k:"Lifecycle accountable", d:"Our role continues beyond project commissioning." },
  { ic:"shield", k:"Commercially flexible", d:"CAPEX, captive, IPP and EaaS structures depending on customer requirements." },
];

const VALUES = [
  { k:"Anticipation, Speed & Agility", d:"We act with speed and agility to anticipate change, adapt quickly and stay future ready." },
  { k:"Integrity & Accountability", d:"We act with honesty, fairness, and ownership in everything we do — by building trust with investors, partners, businesses and communities through transparency, clarity of actions and consistent delivery." },
  { k:"Innovation & Excellence", d:"We continuously strive to innovate in technology, design, and operations to deliver world-class renewable energy solutions with excellence, reliability and value creation for customers." },
  { k:"Customer Partnership", d:"We treat every customer partnership as a long-term energy partnership — co-creating integrated solutions that deliver sustained value across the lifecycle." },
  { k:"Collaboration & Growth", d:"We work as one team across functions, fostering a shared culture of learning and mutual respect that nurtures personal and organizational growth." },
  { k:"Financial Prudence & Sustainability", d:"We create enduring value through disciplined capital management, operational and cost efficiency and unwavering commitment to environment and society." },
];

const PILLARS = [
  { k:"Project Excellence, Execution & Delivery", d:"Deliver renewable energy projects with engineering precision, quality, and as per agreed timeliness — reinforcing client trust and long-term bankability." },
  { k:"Hybrid Portfolio Expansion", d:"Develop and operate a portfolio of hybrid renewable assets — optimised for resource-rich states and industrial clusters." },
  { k:"Innovation, Digital Intelligence & Energy Platforms", d:"Drive continuous innovations and leverage data, analytics, and AI-driven tools for differentiated customer solutions run through an integrated energy platform." },
  { k:"Financial Discipline & Value Creation", d:"Drive shareholder value through prudent capital allocation, strategic partnerships, cost optimization and consistent execution." },
  { k:"Sustainability & Stakeholder Impact", d:"Embed ESG principles across all operations to build long term stakeholder value." },
  { k:"People & Culture Excellence", d:"Build a high performance culture rooted in learning, ownership and shared values — positioning Integrum as an employer of choice." },
];

const GOVERNANCE = ["Independent Board oversight","Audit and governance framework","Financial controls","HSE systems","Quality systems","Risk management"];

const PRINCIPLES = [
  { k:"Commercial before technical", d:"Every project begins with customer economics." },
  { k:"Own the outcome", d:"Accountability doesn't end at project handover." },
  { k:"Challenge assumptions", d:"Technology and commercial structures are continuously reassessed." },
  { k:"Build for the long term", d:"Decisions are evaluated over the asset lifecycle, not just project CAPEX." },
];

/* company timeline — client-supplied (Company Timeline.xlsx) */
const TIMELINE = [
  { y:"2021", k:"Incorporation of our company", d:"Certificate of incorporation dated February 26, 2021." },
  { y:"2021", k:"Operations commenced in Karnataka", d:"Consultancy and balance of plant (BOP) assignments, expanding to end-to-end turnkey execution, then Gujarat with our first wind projects of 10 MW cumulatively." },
  { y:"2022", k:"First project commissioned", d:"A 9 MW / 13.5 MWp solar installation executed on a BOP basis, hybridising an existing wind power plant in Karnataka." },
  { y:"2023", k:"Expanded to Maharashtra", d:"Secured our first order in the state." },
  { y:"2024", k:"Single largest order to date", d:"A 70 MWp solar project in the state of Gujarat." },
  { y:"2025", k:"Crossed 100 MW commissioned", d:"Cumulative commissioned capacity passed 100 MW." },
  { y:"2025", k:"First central PSU contract", d:"A 50 MW wind power project." },
  { y:"2025", k:"IPP model operations began", d:"Through our subsidiary Integrum Green Assets Private Limited, supplying power under our first long-term power purchase agreement, executed for a tenure of 25 years." },
  { y:"2026", k:"Energy-as-a-Service launched", d:"Operations commenced under the EaaS model through our subsidiary Integrum Energy Services Private Limited." },
  { y:"2026", k:"Green Homes incorporated", d:"Integrum Green Homes Private Limited and its subsidiary Integrum (KN1) Green Homes Private Limited, to undertake our first pilot project under the virtual net metering (VNM) model." },
  { y:"2026", k:"Order book crossed ₹1,000 crore", d:"" },
  { y:"2026", k:"Extended operations to Tamil Nadu", d:"" },
];

/* Key Management Personnel */
const LEADERS = [
  { photo:"assets/anand-lahoti.png", hex:"#014976", name:"Anand Lahoti", role:"Managing Director & Chief Executive Officer",
    bio:"With strong business acumen, Anand was, in his earlier avatar, the first in India to champion the equity investment-driven group captive model in 2016. He is highly skilled in investment banking, solution structuring, and project and asset management. He started his career as an investment banker with a boutique investment bank, where he worked for nearly 5 years. He currently has approximately 19 years of experience in the RE sector.",
    creds:"MBA, IBS Hyderabad · B.Com, St. Xavier's College, Kolkata" },
  { photo:"assets/ph-puneet-goel.png", hex:"#1C6FB5", name:"Puneet Goel", role:"Whole Time Director & Chief Operating Officer",
    bio:"With deep expertise and a strong track record of building new businesses, Puneet has been instrumental in scaling up two eminent power trading companies in the country. He brings deep knowledge of the energy industry, with 27 years of experience in consulting, financing, product development, and organisation scaling, alongside strong power trading and solutions skills and relationships across the industry.",
    creds:"Engineer, IIT (BHU) · MBA, IIM Lucknow" },
  { photo:"assets/ph-pramod-gupta.png", hex:"#12A594", name:"Pramod Gupta", role:"President, Business Strategy & Chief Financial Officer",
    bio:"A professional CEO and former CFO with over 30 years of experience across finance, strategy, operations, and business transformation in the manufacturing, BFSI (insurance), EdTech, and consulting sectors. With deep expertise in capital raising, private placements, IPO preparedness, governance, and investor relations, he has led fundraising exceeding INR 2.5 billion and successfully taken organisations through IPOs, working closely with private equity investors, boards, and regulators.",
    creds:"Chartered Accountant · Six Sigma Black Belt · IICA-certified Independent Director · PG Digital Business, MIT Sloan & Columbia Business School · MDP, IIM Calcutta" },
];

/* Senior Management Personnel */
const SENIOR = [
  { photo:"assets/ph-ranganatha-hr.png", hex:"#E0951A", name:"Ranganatha HR", role:"President, Projects",
    bio:"Ranganatha brings over 14 years of experience across India's leading power and renewable energy organisations, including Tata Power, Reliance Energy, Conergy, Bosch, and Atria Power, with deep expertise in engineering execution, project development, and operational optimisation across solar, wind, and hybrid renewable platforms. At Atria Power he led the solar vertical and successfully hybridised existing wind assets, improving asset utilisation and long-term returns. His career reflects strong capabilities in end-to-end project delivery, project coordination, technology selection, and scaling renewable energy infrastructure under complex operating environments.",
    creds:"Mechanical Engineer" },
  { photo:"assets/kg-vijayvargiya.png", hex:"#1D9E75", name:"K G Vijayvargiya", role:"President, Sales",
    bio:"A seasoned business leader with 25+ years of techno-commercial experience and a proven track record of executive leadership in the energy sector, with a strong understanding of the renewable energy landscape across technical, financial and regulatory aspects. He leads marketing, sales and business development at Integrum, helping corporates switch to renewable power through wind, solar and hybrid projects, with rich experience across more than 1 GW of renewable projects. He previously worked with German and American MNCs including Krones, C. Illies, Milacron and Bergmann, overseeing business development, execution and after-sales, and is well networked across renewables, oil & gas, cement, metal, auto, food & beverage, textile, plastic, paper and packaging.",
    creds:"MBA International Business, ICFAI University · BE Mechanical, University of Rajasthan" },
  { photo:"assets/sivaranjan-kumar.png", hex:"#0A6FB0", name:"T. Sivaranjan Kumar", role:"Vice President, Finance & Accounts",
    bio:"An Associate Member of the Institute of Chartered Accountants of India with over 17 years of post-qualification experience in finance and accounts, corporate finance, treasury, financial reporting, budgeting, internal controls, corporate governance and regulatory compliance. With extensive experience across infrastructure, projects, real estate, engineering and education sectors, he brings strong expertise in financial planning and management, working capital optimisation, financial due diligence, process improvement, profitability analysis and cost optimisation. In his current role he focuses on strengthening financial controls and governance, driving efficient financial processes, supporting strategic decision-making and enabling sustainable business growth.",
    creds:"Chartered Accountant since 2009 · B.Com, Nagarjuna University · All India Best Performance in Mathematics, CA PE-I" },
  { photo:"assets/rachana-chawla.png", hex:"#C2542F", name:"Rachana Chawla", role:"Vice President, Human Resources",
    bio:"An HR professional with over 20 years of experience in HR management, having previously worked with Wipro Infotech, Reliance Retail and Tata Motors, alongside development-sector organisations including SOS Children's Villages of India, Railway Children India, Evidence Action, Smile Foundation and Selco Foundation. She has been heading human resources for the last five years and has served on the Internal Complaints Committee for PoSH at several organisations. Her expertise lies in culture building, streamlining HR processes, strong employee relations and enabling high-performance teams.",
    creds:"B.Com · Master's in Management Studies, University of Mumbai" },
  { photo:"assets/ph-dinesh-manrai.png", hex:"#1F8F63", name:"Dinesh Manrai", role:"Business Head, Green Homes",
    bio:"A seasoned techno-commercial leader with over 24 years of experience across business development, technical sales, product management, operations & projects. He brings extensive experience in serving diverse industrial sectors, including automobile and their ancillaries, steel, foundry, heavy fabrication, petroleum, petrochemicals, chemicals, fertilisers and power, with strong expertise in customer solutions and technical sales. Over the course of his career, he has held leadership roles in sales, operations & product management. He joined Integrum in August 2026, bringing strong business understanding, industry knowledge, customer relationships and techno-commercial expertise to support Integrum's growth in the renewable energy sector.",
    creds:"" },
];

const initials = (n) => n.split(/\s+/).filter(w=>w.length>1).slice(0,2).map(w=>w[0]).join("");

function About({ nav }) {
  return (
    <div className="page-fade about-page lane-accent" style={{ "--p-color":"var(--amber)" }}>
      {/* ---- hero ---- */}
      <section className="page-hero has-photo" style={{ background:"var(--navy)", color:"#EAF1F8", paddingBottom:"clamp(40px,5vw,68px)" }}>
        <VideoBG srcs={VID.site} starts={[0, 8, 0]} poster="assets/hero-poster.png"
          overlay="linear-gradient(120deg, rgba(8,23,42,.82) 40%, rgba(8,23,42,.48) 100%)" pos="center 50%"/>
        <div className="shell">
          <div className="breadcrumb" style={{ color:"#7E97B0" }}>
            <a onClick={()=>nav("home")} style={{cursor:"pointer",color:"#9FB7CF"}}>Home</a> {I.arrow({width:13,height:13})} <span>Company</span>
          </div>
          <div style={{ maxWidth:860, marginTop:20 }}>
            <span className="eyebrow eyebrow-light">About Integrum Energy</span>
            <h1 style={{ color:"#fff", fontSize:"clamp(36px,5vw,60px)", letterSpacing:"-.035em", marginTop:16, lineHeight:1.02 }}>Integrating energy solutions for businesses.</h1>
            <p style={{ color:"#C9D6E4", fontSize:19, marginTop:20, maxWidth:700, lineHeight:1.6 }}>Integrated energy. Enduring value. One accountable partner across strategy, development, execution, operations and power markets.</p>
          </div>
        </div>
      </section>

      {/* ---- purpose, vision, mission ---- */}
      <section className="section vmv-sec">
        <div className="shell">
          <Reveal className="vmv-lead">
            <span className="eyebrow">Purpose, vision &amp; mission</span>
            <h2>Integrated energy.<br/><span className="vmv-hl">Enduring value.</span></h2>
          </Reveal>
          <div className="vmv-grid">
            {[
              { k:"Our purpose", ic:"bolt", core:true,
                d:"To accelerate the transition to clean energy by making sustainable energy reliable, accessible and value-accretive through integrated energy solutions for businesses and communities." },
              { k:"Vision", ic:"compass",
                d:"To be a trusted energy partner delivering intelligent and integrated energy solutions for a sustainable future." },
              { k:"Mission", ic:"gauge",
                d:"To deliver innovative, reliable and cost-efficient clean energy solutions through integrated execution, operational excellence and long-term partnerships." },
            ].map((n,i)=>(
              <Reveal key={i} delay={i*80} className={"vmv-card"+(n.core?" is-core":"")}>
                <span className="vmv-ic">{I[n.ic]({ width:22, height:22 })}</span>
                <h3>{n.k}</h3>
                <p>{n.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- values ---- */}
      <section className="section">
        <div className="shell">
          <Reveal>
            <h3 className="fam-title">Our values</h3>
            <ol className="val-ledger">
              {VALUES.map((v,i)=>(
                <li key={i}>
                  <span className="vl-n">{String(i+1).padStart(2,"0")}</span>
                  <span className="vl-k">{v.k}</span>
                  <span className="vl-d">{v.d}</span>
                </li>
              ))}
            </ol>
            <p className="plat-note">These six values represent Integrum's foundation — agility, ethics, innovation, customer centricity, people focus, and financial discipline — forming the cultural core that drives us to long-term success.</p>
          </Reveal>
        </div>
      </section>

      {/* ---- strategic pillars ---- */}
      <section className="section" style={{ background:"var(--surface-2)" }}>
        <div className="shell">
          <Reveal className="sec-head">
            <span className="eyebrow">Strategic pillars</span>
            <h2>The execution drivers behind the vision.</h2>
            <p className="lead">Each pillar is mapped to organizational KPIs and performance metrics.</p>
          </Reveal>
          <div className="pillar-grid">
            {PILLARS.map((p,i)=>(
              <Reveal key={i} delay={i*60} className="pillar-card">
                <span className="pc-n">{String(i+1).padStart(2,"0")}</span>
                <h4>{p.k}</h4>
                <p>{p.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- why we exist ---- */}
      <section className="section">
        <div className="shell">
          <Reveal className="sec-head">
            <span className="eyebrow">Why we exist</span>
            <h2>Energy complexity, brought under one integrated partner.</h2>
            <p className="lead">Energy is becoming more complex. Industrial customers today have to manage all of this — usually supplied by different companies.</p>
          </Reveal>
          <div className="cx-row">
            {COMPLEXITY.map((c,i)=>(<span className="cx-chip" key={i}>{c}</span>))}
          </div>
          <Reveal><p className="conn-close">Integrum was built to bring these decisions together — around one objective: the best long-term energy outcome for the customer.</p></Reveal>
        </div>
      </section>

      {/* ---- our evolution ---- */}
      <section className="section" style={{ background:"var(--surface-2)" }}>
        <div className="shell">
          <Reveal className="sec-head">
            <span className="eyebrow">Our evolution</span>
            <h2>From consulting to an integrated energy platform.</h2>
          </Reveal>
          <div className="evo-rail">
            {EVOLUTION.map((e,i)=>(
              <Reveal key={i} delay={i*60} className="evo-step">
                <span className="evo-n">{String(i+1).padStart(2,"0")}</span>
                <span className="evo-k">{e.k}</span>
                <span className="evo-d">{e.d}</span>
              </Reveal>
            ))}
          </div>
          <Reveal><p className="conn-close">What began as renewable project execution has evolved into an integrated energy platform.</p></Reveal>
        </div>
      </section>

      {/* ---- Integrum today ---- */}
      <section className="section">
        <div className="shell">
          <Reveal className="sec-head">
            <span className="eyebrow">Integrum today</span>
            <h2>Our scale, in numbers.</h2>
            <p className="lead">Company-level figures are being finalised and will be published once confirmed.</p>
          </Reveal>
          <div className="today-split">
            <Reveal className="today-hero">
              <span className="today-hero-v num">{TODAY[0].v}{TODAY[0].u && <em className="today-hero-u">{TODAY[0].u}</em>}</span>
              <span className="today-hero-k">{TODAY[0].k}</span>
              {TODAY[0].note && <span className="today-hero-n">{TODAY[0].note}</span>}
            </Reveal>
            <div className="today-stack">
              {TODAY.slice(1).map((t,i)=>(
                <Reveal key={i} delay={(i+1)*60} className="today-line">
                  <span className="today-v num">{t.v}{t.u && <em className="today-u">{t.u}</em>}</span>
                  <span className="today-txt">
                    <span className="today-k">{t.k}</span>
                    {t.note && <span className="today-note">{t.note}</span>}
                  </span>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---- how we're different ---- */}
      <section className="section">
        <div className="shell">
          <Reveal className="sec-head">
            <span className="eyebrow">How we're different</span>
            <h2>Make to requisition and long-term partnership.</h2>
          </Reveal>
          <div className="diff-flow">
            {DIFFERENT.map((d,i)=>(
              <Reveal key={i} delay={i*60} className="diff-chev">
                <span className="dc-top">
                  <span className="dc-ico">{I[d.ic]({width:19,height:19})}</span>
                  <span className="dc-n">{String(i+1).padStart(2,"0")}</span>
                </span>
                <h4>{d.k}</h4>
                <p>{d.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- our story ---- */}
      <section className="section" style={{ background:"var(--surface-2)" }}>
        <div className="shell">
          <div className="story-grid">
            <Reveal>
              <span className="eyebrow">Our story</span>
              <h2 style={{ fontSize:"clamp(30px,3.9vw,46px)", letterSpacing:"-.03em", marginTop:12 }}>Expanding who clean energy is actually for.</h2>
              <p className="lead" style={{ marginTop:18 }}>We set out to build a platform with real breadth and depth in renewable energy. Industrial &amp; Commercial demand makes up nearly 170 GW of hybrid power requirement — roughly half the country's total consumption — yet wind and solar PPAs together meet only about 2% of it.</p>
              <p style={{ marginTop:16, color:"var(--ink-2)", fontSize:16.5, lineHeight:1.65 }}>Our analysis shows that today's credit-rating-driven IPP models address only around 6 GW. We're expanding that market in both breadth — including customers who aren't high-investment-grade — and depth, replacing far more of each customer's consumption. Together, that opens the addressable market by more than ten times, to nearly 70 hybrid GW.</p>
            </Reveal>
            <Reveal delay={120}>
              <div className="story-highlights">
                {STORY_HIGHLIGHTS.map((h,i)=>(
                  <div className="shl" key={i}><div className="v num">{h.v}</div><div className="k">{h.k}</div></div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---- leadership ---- */}
      <section className="section" id="leadership">
        <div className="shell">
          <Reveal className="sec-head">
            <span className="eyebrow">Leadership</span>
            <h2>Experts behind every solution.</h2>
            <p className="muted" style={{ marginTop:12, fontSize:17 }}>A team that has structured, financed, engineered and scaled energy businesses across India.</p>
          </Reveal>
          <h3 className="fam-title">Key management personnel</h3>
          <div className="leader-grid">
            {LEADERS.map((l,i)=>(
              <Reveal key={i} delay={i*70}>
                <div className="leader-card">
                  {l.photo
                    ? <img className="leader-photo" src={l.photo} alt={l.name} loading="lazy" style={{ "--ring":l.hex }}/>
                    : <span className="leader-photo leader-initials" style={{ "--ring":l.hex, background:l.hex }} aria-hidden="true">{initials(l.name)}</span>}
                  <div>
                    <h4>{l.name}</h4>
                    <div className="role">{l.role}</div>
                    <p className="bio">{l.bio}</p>
                    {l.creds && <div className="creds">{l.creds}</div>}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <h3 className="fam-title">Senior management personnel</h3>
          <div className="leader-grid">
            {SENIOR.map((l,i)=>(
              <Reveal key={i} delay={i*50}>
                <div className="leader-card">
                  {l.photo
                    ? <img className="leader-photo" src={l.photo} alt={l.name} loading="lazy" style={{ "--ring":l.hex }}/>
                    : <span className="leader-photo leader-initials" style={{ "--ring":l.hex, background:l.hex }} aria-hidden="true">{initials(l.name)}</span>}
                  <div>
                    <h4>{l.name}</h4>
                    <div className="role">{l.role}</div>
                    <p className="bio">{l.bio}</p>
                    {l.creds && <div className="creds">{l.creds}</div>}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- governance + operating principles ---- */}
      <section className="section" style={{ background:"var(--surface-2)" }}>
        <div className="shell">
          <Reveal className="sec-head">
            <span className="eyebrow">Governance</span>
            <h2>Built for institutional scale.</h2>
          </Reveal>
          <div className="gov-row">
            {GOVERNANCE.map((g,i)=>(
              <span className="gov-chip" key={i}>{I.check({width:15,height:15})} {g}</span>
            ))}
          </div>
          <Reveal>
            <h3 className="fam-title">Operating principles</h3>
            <dl className="prin-list">
              {PRINCIPLES.map((p,i)=>(
                <div className="prin-row" key={i}>
                  <dt>{p.k}</dt>
                  <dd>{p.d}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal>
            <div className="pri-strip" style={{ marginTop:26 }}>
              <span className="pri-ic">{I.shield({width:24,height:24})}</span>
              <div style={{ flex:"1 1 320px" }}>
                <div style={{ fontWeight:600, fontSize:16.5, color:"var(--ink)" }}>Signatory to the Principles for Responsible Investment (PRI)</div>
                <div className="muted" style={{ fontSize:14, marginTop:3 }}>A global commitment to integrating responsible, ESG-aligned practice into how we invest and operate.</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---- impact ---- */}
      <section className="section">
        <div className="shell">
          <Reveal className="sec-head">
            <span className="eyebrow">Our impact</span>
            <h2>Real units. Real tonnes avoided.</h2>
          </Reveal>
          <div className="about-stats">
            {ABOUT_STATS.map((s,i)=>(
              <Reveal key={i} delay={i*70}>
                <div className="astat">
                  <div className="ic">{I[s.ic]()}</div>
                  <div className="v num">{s.v}{s.u && <span className="u">{s.u}</span>}</div>
                  <div className="k">{s.k}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- company timeline ---- */}
      <section className="section" style={{ background:"var(--surface-2)" }}>
        <div className="shell">
          <Reveal className="sec-head">
            <span className="eyebrow">Company timeline</span>
            <h2>How we got here.</h2>
            <p className="lead">From incorporation in 2021 to an integrated energy platform.</p>
          </Reveal>
          <div className="tline">
            <div className="tline-spine" aria-hidden="true"></div>
            {TIMELINE.map((t,i)=>(
              <Reveal key={i} delay={i*45} className={"tline-row "+(i%2 ? "is-right" : "is-left")}>
                <div className="tline-node">
                  <span className="tline-year">{t.y}</span>
                </div>
                <div className={"tline-card"+(t.d ? " has-more" : "")} tabIndex={t.d ? 0 : -1}>
                  <span className="tline-k">{t.k}</span>
                  {t.d && <span className="tline-d">{t.d}</span>}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- awards & recognition ---- */}
      <section className="section" style={{ background:"var(--surface-2)" }} id="awards">
        <div className="shell">
          <Reveal className="sec-head">
            <span className="eyebrow">Awards &amp; recognition</span>
            <h2>Recognised by the industry we're building in.</h2>
          </Reveal>
          <div className="award-list">
            {[
              { y:"2022", t:"Best C&I Hybrid Project Award", o:"SolarQuarter C&I Energy Leadership Awards 2022" },
              { y:"2022", t:"Best Design & Engineering Hybrid Award", o:"SolarQuarter C&I Energy Leadership Awards 2022" },
              { y:"2024", t:"Company of the Year: Projects in Wind and Hybrid Energy", o:"India Wind Energy Forum Leadership Awards 2024" },
            ].map((a,i)=>(
              <Reveal key={i} delay={i*60} className="award-item">
                <span className="ai-y">{a.y}</span>
                <div>
                  <h4>{a.t}</h4>
                  <div className="ai-o">{a.o}</div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="award-feature">
              <div className="award-photo">
                <img src="assets/award-iwef-2024.png" alt="Integrum Energy receiving Company of the Year at the India Wind Energy Forum Leadership Awards 2024" loading="lazy"/>
              </div>
              <div className="award-copy">
                <span className="award-year">2024</span>
                <h3>Company of the Year: Projects in Wind and Hybrid Energy</h3>
                <div className="award-org">India Wind Energy Forum Leadership Awards 2024</div>
                <p>We are honoured and excited to share that Integrum Energy has been awarded the prestigious Company of the Year: Projects in Wind and Hybrid Energy at the India Wind Energy Forum Leadership Awards 2024.</p>
                <p>To the dedicated team at Integrum Energy, this award underscores your hard work, commitment, and stellar performance.</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={90}>
            <div className="award-feature is-flip">
              <div className="award-photo">
                <img src="assets/award-solarquarter-2022.jpeg" alt="Two SolarQuarter C&amp;I Energy Leadership Awards 2022 trophies received by Integrum Energy" loading="lazy"/>
              </div>
              <div className="award-copy">
                <span className="award-year">2022</span>
                <h3>Best C&amp;I Hybrid Project Award &amp; Best Design &amp; Engineering Hybrid Award</h3>
                <div className="award-org">SolarQuarter "C&amp;I Energy Leadership Awards 2022"</div>
                <p>We are humbled to receive two awards at Solar Quarter "C&amp;I Energy Leadership Awards 2022" — Best C&amp;I Hybrid Project Award and Best Design &amp; Engineering Hybrid Award.</p>
                <p>We started our journey 18 months back. In this short period, as a team we have delivered 85 MWs plus of marquee projects in the C&amp;I Hybrid space. This endorses our leadership position in offering Hybrid solutions to C&amp;I customers.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---- certifications (certificates shown inline, no downloads) ---- */}
      <section className="section" id="certifications">
        <div className="shell">
          <Reveal className="sec-head">
            <span className="eyebrow">Certifications</span>
            <h2>Independently assessed, and current.</h2>
            <p className="lead">Our workplace and quality-management certifications, issued by external assessors.</p>
          </Reveal>
          <div className="cert-row">
            <Reveal className="cert-card">
              <div className="cert-shot">
                <img src="assets/cert-gptw.png" alt="Great Place to Work Certified certificate for Integrum Energy Infrastructure Limited, valid March 2026 to March 2027" loading="lazy"/>
              </div>
              <div className="cert-meta">
                <h4>Great Place to Work&reg; Certified</h4>
                <p>Great Place to Work&reg; India &middot; valid March 2026 to March 2027</p>
              </div>
            </Reveal>
            <Reveal delay={80} className="cert-card">
              <div className="cert-shot">
                <img src="assets/cert-iso.png" alt="ISO 9001:2015 quality management system certificate for Integrum Energy Infrastructure Limited" loading="lazy"/>
              </div>
              <div className="cert-meta">
                <h4>ISO 9001:2015</h4>
                <p>Quality management system</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section className="section" style={{ paddingTop:0 }}>
        <div className="shell">
          <Reveal>
            <div className="card" style={{ display:"flex", gap:20, flexWrap:"wrap", alignItems:"center", justifyContent:"space-between", padding:"clamp(28px,3.5vw,44px)" }}>
              <div>
                <h3 style={{ fontSize:"clamp(24px,2.8vw,32px)", letterSpacing:"-.02em" }}>Bring us your energy challenge.</h3>
                <p className="muted" style={{ marginTop:8, fontSize:16.5 }}>Tell us about your sites and load — we'll map your path to lower, greener power.</p>
              </div>
              <button className="btn btn-nav-cta btn-lg" onClick={()=>nav("contact")}>Talk to a consultant {I.arrow()}</button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { About });
