/* ============================================================
   careers.jsx — Careers / People (Life at Integrum, open roles)
   Section structure per client content sheet (People page).
   ============================================================ */
import { useState as useStateC } from "react";
import { I, Reveal, VideoBG, VID, media } from "./dataviz";
import { CAREER_ROLES } from "./jobs";

export const CAREER_VALUES = [
  { ic:"compass", h:"Purpose-driven work", p:"Every megawatt we build displaces conventional power for real industrial businesses. The work is measurable, and it matters." },
  { ic:"bolt", h:"Cutting-edge renewable technologies", p:"Hybrid generation, storage, forecasting and energy markets — you work at the front edge of how energy is actually delivered." },
  { ic:"trendUp", h:"A fast-growing organization", p:"Scale brings scope. New states, new businesses and new capabilities mean the remit grows as quickly as you do." },
  { ic:"gauge", h:"Learning opportunities", p:"Structuring, engineering, regulation, markets and software — the breadth of the energy transition is on the table, and you're trusted with it early." },
  { ic:"compass", h:"Innovation-first culture", p:"We challenge conventional thinking and back ideas with data, simulation and rigour rather than habit." },
  { ic:"handshake", h:"Ownership and accountability", p:"You won't hand work over a wall. Teams carry a project from first site scan to a plant running 25 years later." },
];

export const CAREER_CULTURE = [
  { h:"Small teams, real responsibility", p:"Lean teams mean your work ships and your voice is heard — no layers between an idea and its impact." },
  { h:"Rigour over noise", p:"We model before we commit and prove every kilowatt-hour on a live platform. Good decisions come from good data." },
  { h:"Flexibility with accountability", p:"We care about outcomes, not hours logged. Own your calendar; own your commitments." },
];

export const CAREER_GROWTH = [
  { ic:"gauge", h:"Structured mentorship", p:"Regular one-on-ones with leaders who have built and scaled power businesses across India." },
  { ic:"factory", h:"Cross-functional exposure", p:"Rotate across development, engineering, commercial and operations to see the full lifecycle." },
  { ic:"leaf", h:"Learning budget", p:"Support for certifications and courses that deepen your edge in renewable energy and finance." },
];

export const CAREER_AWARDS = [
  "Great Place to Work",
  "ISO certifications",
  "Safety awards",
  "Innovation awards",
  "Industry recognitions",
];


/* ---------- page text (CMS-editable) ---------- */
export const CAREERS_TEXT = {
  breadcrumb: "People",
  heroPoster: "/assets/hero-poster.png",
  heroEyebrow: "People",
  heroTitle: "Building India's energy future starts with great people.",
  heroSub: "Behind every renewable energy project is a team of engineers, energy strategists, project managers, data scientists, and industry experts working together to deliver measurable business outcomes. At Integrum, our people combine technical excellence, deep industry knowledge, and a customer-first mindset to help organizations transition confidently towards a cleaner and more intelligent energy future.",
  heroCta: "Join our team",
  heroCta2: "Meet our experts",
  teamEyebrow: "About our team",
  teamTitle: "Expertise that powers every project.",
  teamP1: "Our multidisciplinary teams bring together expertise across renewable energy engineering, project execution, commercial advisory, digital technology, energy markets, regulatory compliance, and asset management. This enables us to provide end-to-end solutions — from concept and feasibility to commissioning, operations, optimization, and energy intelligence.",
  teamP2: "Whether designing hybrid renewable energy systems, developing Energy-as-a-Service models, or building AI-driven energy platforms, our people are committed to solving complex energy challenges through innovation and collaboration.",
  whyEyebrow: "Why work with Integrum",
  whyTitle: "The energy transition, at close range.",
  whyLead: "Renewable energy is one of the largest, fastest-moving problems of our time. Here you work on it directly — with the ownership and support to actually move it.",
  cultureEyebrow: "Our culture",
  cultureTitle: "One team. One purpose.",
  cultureLead: "At Integrum, we believe that innovation is built on collaboration, continuous learning, and ownership. We foster an environment where every individual is empowered to solve problems, challenge conventional thinking, and create meaningful impact for our customers and the renewable energy industry.",
  lifeEyebrow: "Life at Integrum",
  lifeTitle: "The work, and everything around it.",
  lifeLead: "Site visits, commissioning, celebrations and the everyday work in between.",
  growthEyebrow: "Learning & growth",
  growthTitle: "Investing in continuous development.",
  growthLead: "We encourage continuous learning through technical certifications, leadership development, digital skills, renewable energy research, safety training, and cross-functional collaboration. Every employee has opportunities to expand their expertise while contributing to India's clean energy transition.",
  awardsLabel: "Awards & certifications",
  openingsEyebrow: "Current openings",
  openingsTitle: "Find your role.",
  openingsLead: "Don't see an exact fit? We're always glad to hear from strong people — write to us and tell us where you'd add value.",
  allTeams: "All",
  jdShow: "View full JD",
  jdHide: "Hide details",
  applyNow: "Apply now",
  reportsTo: "Reports to",
  qualsTitle: "Qualifications & experience",
  skillsTitle: "Key skills",
  preferredTitle: "Preferred",
  profileTitle: "Ideal candidate",
  jdPending: "Detailed job description to follow — apply and our HR team will share the full brief.",
  applyRole: "Apply for this role",
  ctaTitle: "Ready to shape the future of energy?",
  ctaText: "If you're passionate about renewable energy, digital innovation, and solving complex business challenges, we'd love to hear from you. Send your CV to",
  ctaEmail: "Careers@integrumenergy.in",
  ctaCta: "Explore careers",
  ctaCta2: "Talk to our HR team",
};

export const TEAM_DISCIPLINES = ["Renewable energy engineering","Project execution","Commercial advisory","Digital technology","Energy markets","Regulatory compliance","Asset management"];

export const LIFE_PHOTOS = [
  { src:"/assets/life-sitevisit.jpg", t:"Site visit", s:"Team at an operating hybrid plant", wide:true },
  { src:"/assets/life-commissioning.jpeg", t:"Project commissioning", s:"Team at a newly energised pooling substation", wide:true },
  { src:"/assets/life-commissioning-2.jpeg", t:"Charging the panel", s:"Control and relay panel on commissioning day" },
  { src:"/assets/life-training.jpeg", t:"Safety training", s:"CPR and first-aid session at site" },
  { src:"/assets/life-office-1.jpg", t:"Our Bengaluru office", s:"The Integrum frontage in Koramangala", pos:"50% 18%" },
  { src:"/assets/life-office-2.jpg", t:"Office inauguration", s:"Marking a new office with the team", tall:true, pos:"50% 22%" },
  { src:"/assets/life-turbine.jpg", t:"Turbine erection", s:"Nacelle lift during commissioning" },
  { src:"/assets/life-gptw.jpeg", t:"Great Place to Work celebration", s:"Marking our certification at the Bengaluru office", tall:true, pos:"50% 28%" },
  { src:"/assets/life-hackathon.jpeg", t:"Internal hackathon", s:"Presenting an AI contract-review workflow" },
  { src:"/assets/life-csr-school.jpeg", t:"CSR · school outreach", s:"Community programme at a village school" },
  { src:"/assets/life-csr-performance.jpeg", t:"CSR · cultural programme", s:"Students performing at a community event" },
  { src:"/assets/life-teambuilding.jpg", t:"Team building", s:"Company offsite activities" },
  { src:"/assets/life-vmv.jpg", t:"Vision, mission & values workshop", s:"Teams presenting their group work" },
  { src:"/assets/life-office-mgmt.jpeg", t:"Marking a milestone", s:"Leadership at the Bengaluru office", pos:"50% 30%" },
];

export function Careers({ nav }) {
  const [team, setTeam] = useStateC("All");
  const [openJD, setOpenJD] = useStateC(null);
  // a role added through the CMS may have no id; its list position stands in
  const allRoles = CAREER_ROLES.map((r,i)=>({ ...r, id: r.id || "role-"+i }));
  const teams = ["All", ...Array.from(new Set(allRoles.map(r=>r.team)))];
  const roles = team==="All" ? allRoles : allRoles.filter(r=>r.team===team);
  return (
    <div className="page-fade lane-accent" style={{ "--p-color":"var(--amber)" }}>
      {/* hero */}
      <section className="page-hero has-photo" style={{ background:"var(--navy)", color:"#EAF1F8", paddingBottom:"clamp(40px,5vw,68px)" }}>
        <VideoBG srcs={VID.site} starts={[0, 8, 0]} poster={media(CAREERS_TEXT.heroPoster)}
          overlay="linear-gradient(120deg, rgba(8,23,42,.82) 38%, rgba(8,23,42,.44) 100%)" pos="center 46%"/>
        <div className="shell">
          <div className="breadcrumb" style={{ color:"#7E97B0" }}>
            <a onClick={()=>nav("home")} style={{cursor:"pointer",color:"#9FB7CF"}}>Home</a> {I.arrow({width:13,height:13})} <span>{CAREERS_TEXT.breadcrumb}</span>
          </div>
          <div style={{ maxWidth:820, marginTop:20 }}>
            <span className="eyebrow eyebrow-light">{CAREERS_TEXT.heroEyebrow}</span>
            <h1 style={{ color:"#fff", fontSize:"clamp(36px,5vw,60px)", letterSpacing:"-.035em", marginTop:16, lineHeight:1.02 }}>{CAREERS_TEXT.heroTitle}</h1>
            <p style={{ color:"#C9D6E4", fontSize:19, marginTop:20, maxWidth:680, lineHeight:1.6 }}>{CAREERS_TEXT.heroSub}</p>
            <div style={{ display:"flex", gap:14, flexWrap:"wrap", marginTop:26 }}>
              <button className="btn btn-solar btn-lg" onClick={()=>{ const el=document.getElementById("openings"); if(el) window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-80,behavior:"smooth"}); }}>{CAREERS_TEXT.heroCta} {I.arrow()}</button>
              <button className="btn btn-ghost-light btn-lg" onClick={()=>nav("about#leadership")}>{CAREERS_TEXT.heroCta2}</button>
            </div>
          </div>
        </div>
      </section>

      {/* about our team */}
      <section className="section">
        <div className="shell">
          <Reveal className="sec-head">
            <span className="eyebrow">{CAREERS_TEXT.teamEyebrow}</span>
            <h2>{CAREERS_TEXT.teamTitle}</h2>
            <p className="lead" style={{ marginTop:16 }}>{CAREERS_TEXT.teamP1}</p>
            <p className="lead" style={{ marginTop:14 }}>{CAREERS_TEXT.teamP2}</p>
          </Reveal>
          <div className="team-disc">
            {TEAM_DISCIPLINES.map((d,i)=>(
              <span className="team-disc-chip" key={i}>{d}</span>
            ))}
          </div>
        </div>
      </section>

      {/* why work with us */}
      <section className="section">
        <div className="shell">
          <Reveal className="sec-head">
            <span className="eyebrow">{CAREERS_TEXT.whyEyebrow}</span>
            <h2>{CAREERS_TEXT.whyTitle}</h2>
            <p className="lead" style={{ marginTop:16 }}>{CAREERS_TEXT.whyLead}</p>
          </Reveal>
          <div className="wwd-grid">
            {CAREER_VALUES.map((v,i)=>(
              <Reveal key={i} delay={i*70} className="wwd-card">
                <span className="wwd-ico">{I[v.ic]({width:22,height:22})}</span>
                <h3>{v.h}</h3>
                <p>{v.p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* culture / life at integrum */}
      <section className="section" style={{ background:"var(--surface-2)", paddingTop:"clamp(40px,5vw,72px)" }}>
        <div className="shell">
          <Reveal className="sec-head">
            <span className="eyebrow">{CAREERS_TEXT.cultureEyebrow}</span>
            <h2>{CAREERS_TEXT.cultureTitle}</h2>
            <p className="lead" style={{ marginTop:16 }}>{CAREERS_TEXT.cultureLead}</p>
          </Reveal>
          <div className="culture-grid">
            {CAREER_CULTURE.map((c,i)=>(
              <Reveal key={i} delay={i*70}>
                <div className="culture-card">
                  <span className="culture-n num">0{i+1}</span>
                  <h4>{c.h}</h4>
                  <p>{c.p}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* life at integrum */}
      <section className="section">
        <div className="shell">
          <Reveal className="sec-head">
            <span className="eyebrow">{CAREERS_TEXT.lifeEyebrow}</span>
            <h2>{CAREERS_TEXT.lifeTitle}</h2>
            <p className="muted" style={{ marginTop:12, fontSize:16.5 }}>{CAREERS_TEXT.lifeLead}</p>
          </Reveal>
          <div className="life-photos">
            {LIFE_PHOTOS.map((p,i)=>(
              <Reveal key={i} delay={i*60} className={"life-photo"+(p.wide?" is-wide":"")+(p.tall?" is-tall":"")}>
                <img src={media(p.src)} alt={p.t} loading="lazy" style={p.pos?{objectPosition:p.pos}:null}/>
                <span className="lp-cap"><strong>{p.t}</strong>{p.s}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* learning & growth */}
      <section className="section">
        <div className="shell">
          <Reveal className="sec-head">
            <span className="eyebrow">{CAREERS_TEXT.growthEyebrow}</span>
            <h2>{CAREERS_TEXT.growthTitle}</h2>
            <p className="lead" style={{ marginTop:16 }}>{CAREERS_TEXT.growthLead}</p>
          </Reveal>
          <div className="wwd-grid wwd-grid-3">
            {CAREER_GROWTH.map((g,i)=>(
              <Reveal key={i} delay={i*70} className="wwd-card">
                <span className="wwd-ico">{I[g.ic]({width:22,height:22})}</span>
                <h3>{g.h}</h3>
                <p>{g.p}</p>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="awards-row">
              <span className="awards-k">{CAREERS_TEXT.awardsLabel}</span>
              <div className="awards-badges">
                {CAREER_AWARDS.map((a,i)=>(<span className="fbadge" key={i} style={{ color:"var(--ink-2)", borderColor:"var(--hairline-2)" }}>{I.award({width:14,height:14})}{a}</span>))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* current openings */}
      <section className="section" style={{ background:"var(--surface-2)", paddingTop:"clamp(40px,5vw,72px)" }} id="openings">
        <div className="shell">
          <Reveal className="sec-head">
            <span className="eyebrow">{CAREERS_TEXT.openingsEyebrow}</span>
            <h2>{CAREERS_TEXT.openingsTitle}</h2>
            <p className="muted" style={{ marginTop:12, fontSize:16.5 }}>{CAREERS_TEXT.openingsLead}</p>
          </Reveal>
          <div className="role-filters">
            {teams.map(t=>(
              <button key={t} className={`role-filter ${team===t?"is-active":""}`} onClick={()=>setTeam(t)}>{t==="All" ? CAREERS_TEXT.allTeams : t}</button>
            ))}
          </div>
          <div className="role-list">
            {roles.map((r,i)=>(
              <Reveal key={i} delay={i*40}>
                <div className="role-card">
                  <div className="role-main">
                    <h4>{r.role}</h4>
                    <p>{r.blurb}</p>
                    <div className="role-tags">
                      <span className="role-tag">{I.compass({width:13,height:13})} {r.team}</span>
                      <span className="role-tag">{r.loc}</span>
                      {r.exp && <span className="role-tag">{r.exp}</span>}
                      <span className="role-tag">{r.type}</span>
                    </div>
                  </div>
                  <div className="role-actions">
                    <button className="btn btn-ghost role-jd-btn" aria-expanded={openJD===r.id} onClick={()=>setOpenJD(openJD===r.id?null:r.id)}>
                      {openJD===r.id ? CAREERS_TEXT.jdHide : CAREERS_TEXT.jdShow}
                    </button>
                    <button className="btn btn-nav-cta" onClick={()=>nav("contact/careers")}>{CAREERS_TEXT.applyNow} {I.arrow()}</button>
                  </div>
                </div>
                {openJD===r.id && (
                  <div className="role-jd slidein">
                    {r.reports && <div className="jd-meta"><span>{CAREERS_TEXT.reportsTo}</span><strong>{r.reports}</strong></div>}
                    {r.purpose && <p className="jd-purpose">{r.purpose}</p>}
                    {(r.groups||[]).map((g,gi)=>(
                      <div className="jd-block" key={gi}>
                        <h5>{g.h}</h5>
                        <ul>{g.items.map((it,ii)=>(<li key={ii}>{I.check({width:14,height:14})}<span>{it}</span></li>))}</ul>
                      </div>
                    ))}
                    <div className="jd-cols">
                      {r.quals && r.quals.length > 0 && (
                        <div className="jd-block">
                          <h5>{CAREERS_TEXT.qualsTitle}</h5>
                          <ul>{r.quals.map((q,qi)=>(<li key={qi}>{I.check({width:14,height:14})}<span>{q}</span></li>))}</ul>
                        </div>
                      )}
                      {r.skills && r.skills.length > 0 && (
                        <div className="jd-block">
                          <h5>{CAREERS_TEXT.skillsTitle}</h5>
                          <div className="jd-chips">{r.skills.map((sk,si)=>(<span key={si}>{sk}</span>))}</div>
                        </div>
                      )}
                    </div>
                    {r.preferred && r.preferred.length > 0 && (
                      <div className="jd-block">
                        <h5>{CAREERS_TEXT.preferredTitle}</h5>
                        <ul>{r.preferred.map((p,pi)=>(<li key={pi}>{I.check({width:14,height:14})}<span>{p}</span></li>))}</ul>
                      </div>
                    )}
                    {r.profile && (
                      <div className="jd-profile">
                        <span className="jd-profile-k">{CAREERS_TEXT.profileTitle}</span>
                        <p>{r.profile}</p>
                      </div>
                    )}
                    {r.jdPending && <p className="jd-pending">{CAREERS_TEXT.jdPending}</p>}
                    <button className="btn btn-nav-cta" style={{ marginTop:20 }} onClick={()=>nav("contact/careers")}>{CAREERS_TEXT.applyRole} {I.arrow()}</button>
                  </div>
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="shell">
          <Reveal>
            <div className="card" style={{ display:"flex", gap:20, flexWrap:"wrap", alignItems:"center", justifyContent:"space-between", padding:"clamp(28px,3.5vw,44px)" }}>
              <div>
                <h3 style={{ fontSize:"clamp(24px,2.8vw,32px)", letterSpacing:"-.02em" }}>{CAREERS_TEXT.ctaTitle}</h3>
                <p className="muted" style={{ marginTop:8, fontSize:16.5, maxWidth:620 }}>{CAREERS_TEXT.ctaText} <strong style={{color:"var(--ink)"}}>{CAREERS_TEXT.ctaEmail}</strong>.</p>
              </div>
              <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                <button className="btn btn-nav-cta btn-lg" onClick={()=>{ const el=document.getElementById("openings"); if(el) window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-80,behavior:"smooth"}); }}>{CAREERS_TEXT.ctaCta} {I.arrow()}</button>
                <button className="btn btn-ghost btn-lg" onClick={()=>nav("contact/careers")}>{CAREERS_TEXT.ctaCta2}</button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

