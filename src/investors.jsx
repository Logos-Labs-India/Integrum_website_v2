/* ============================================================
   investors.jsx — Investor Relations (/investors/<section>)

   Routes:  #investors               → Snapshot
            #investors/financials    → Financials
            #investors/announcements → Corporate announcements
            #investors/press         → Press releases
            #investors/presentations → Presentations & transcripts
            #investors/governance    → Governance
            #investors/offer         → Offer & IPO
            #investors/esg           → ESG & sustainability

   All content comes from ir-data.js — this file holds no data.
   ============================================================ */
import React, { useState, useEffect, useMemo } from "react";
import { I, Reveal, ProjectsMapDark } from "./dataviz.jsx";
import {
  IR_STAGE, IR_SECTIONS, IR_KPIS, IR_DOCS, IR_BOARD, IR_COMMITTEES,
  IR_MATRIX, IR_DISCLOSURES, IR_OPS, IR_CONTACT,
} from "./ir-data.js";

/* ---------- helpers ---------- */
const IR_MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
function irDate(iso) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return "—";
  return `${String(d).padStart(2,"0")} ${IR_MONTHS[m-1]} ${y}`;
}
/* The financial year a document RELATES TO — not the date it was filed.
   Results for FY26 are published in May 2026 (i.e. in FY27), and an investor
   looks for them under FY26. So an explicit d.fy always wins; the filing date
   is only a fallback for documents with no reporting period (press, policies).
   Indian FY runs April–March: 2026-02-10 → FY26, 2026-05-28 → FY27. */
function irFY(doc) {
  if (doc && doc.fy) return doc.fy;
  const iso = doc && typeof doc === "object" ? doc.d : doc;
  if (!iso) return null;
  const [y, m] = iso.split("-").map(Number);
  if (!y || !m) return null;
  return "FY" + String((m >= 4 ? y + 1 : y) % 100).padStart(2, "0");
}
const irDocs = (sec, grp) => IR_DOCS.filter(d => d.sec === sec && (!grp || d.grp === grp));
const irSection = (key) => IR_SECTIONS.find(s => s.key === key) || IR_SECTIONS[0];

/* A row marked from:"listing" exists only once the company is listed. While
   IR_STAGE is "preipo" it renders as a locked placeholder instead of a file. */
const irLocked = (d) => IR_STAGE !== "listed" && d && d.from === "listing";

/* ---------- one document row ---------- */
function IRDocRow({ d }) {
  const locked = irLocked(d);
  return (
    <li className={"ir-doc-row" + (locked ? " locked" : "")}>
      <span className="dl-ico">{I.doc()}</span>
      <span className="ir-doc-main">
        <span className="dt">{d.t}</span>
        {d.q && !locked && <span className="ir-doc-tag">{d.q}</span>}
      </span>
      <span className="ir-doc-date num">{locked ? "—" : irDate(d.d)}</span>
      <span className="dm num">{locked ? "—" : (d.size ? "PDF · " + d.size : "PDF")}</span>
      {locked
        ? <span className="ir-lock">Available on listing</span>
        : <a className="dl-arrow" href={d.url || "#"} onClick={(e)=>{ if (!d.url) e.preventDefault(); }} aria-label={"Download " + d.t}>{I.download()}</a>}
    </li>
  );
}

/* ---------- filterable document list (the workhorse) ---------- */
function IRDocList({ docs, emptyNote }) {
  const [year, setYear] = useState("all");
  const [quarter, setQuarter] = useState("all");
  const [q, setQ] = useState("");
  const [shown, setShown] = useState(8);

  const years = useMemo(() => {
    const set = [];
    docs.forEach(d => { if (irLocked(d)) return; const f = irFY(d); if (f && !set.includes(f)) set.push(f); });
    return set.sort().reverse();
  }, [docs]);
  const hasQuarters = docs.some(d => d.q && !irLocked(d));

  /* locked rows carry a future-dated stub, so they ignore the period filters
     and always sit at the end of the list */
  const filtered = useMemo(() => docs.filter(d => irLocked(d)
    ? (!q.trim() || d.t.toLowerCase().includes(q.trim().toLowerCase()))
    : (year === "all" || irFY(d) === year) &&
      (quarter === "all" || d.q === quarter) &&
      (!q.trim() || d.t.toLowerCase().includes(q.trim().toLowerCase()))
  ).sort((a,b) => (irLocked(a) ? 1 : 0) - (irLocked(b) ? 1 : 0)),
  [docs, year, quarter, q]);

  useEffect(() => { setShown(8); }, [docs, year, quarter, q]);

  return (
    <div>
      {docs.length > 0 && <div className="ir-filterbar">
        {years.length > 1 && (
          <select className="ir-select" value={year} onChange={e=>setYear(e.target.value)} aria-label="Filter by financial year">
            <option value="all">All years</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        )}
        {hasQuarters && (
          <select className="ir-select" value={quarter} onChange={e=>setQuarter(e.target.value)} aria-label="Filter by quarter">
            <option value="all">All quarters</option>
            {["Q1","Q2","Q3","Q4"].map(x => <option key={x} value={x}>{x}</option>)}
          </select>
        )}
        <span className="ir-searchwrap">
          {I.search({ width:15, height:15 })}
          <input className="ir-search" value={q} onChange={e=>setQ(e.target.value)} placeholder="Filter documents…" aria-label="Filter documents by name"/>
          {q && <button className="ir-clear" onClick={()=>setQ("")} aria-label="Clear filter">{I.x({ width:13, height:13 })}</button>}
        </span>
        <span className="ir-count num">{filtered.length} {filtered.length === 1 ? "document" : "documents"}</span>
      </div>}

      {filtered.length === 0
        ? <div className="ir-empty">{emptyNote || "No documents match these filters."}</div>
        : <ul className="ir-doclist">{filtered.slice(0, shown).map((d,i) => <IRDocRow key={i} d={d}/>)}</ul>}

      {filtered.length > shown && (
        <button className="btn btn-ghost ir-loadmore" onClick={()=>setShown(s => s + 8)}>
          Load more <span className="num">({shown} of {filtered.length})</span>
        </button>
      )}
    </div>
  );
}

/* ---------- inner group tabs ---------- */
function IRGroupTabs({ groups, active, onPick }) {
  if (!groups || groups.length < 2) return null;
  return (
    <div className="ir-tabs" role="tablist">
      {groups.map(g => (
        <button key={g.key} role="tab" aria-selected={g.key === active}
                className={g.key === active ? "active" : ""} onClick={()=>onPick(g.key)}>
          {g.label}
        </button>
      ))}
    </div>
  );
}

/* ---------- governance · board + committee matrix ---------- */
function IRBoard() {
  if (!IR_BOARD.length) return (
    <div className="ir-empty">Board and committee composition will be published here.</div>
  );
  return (
    <div>
      <div className="ir-people">
        {IR_BOARD.map((p,i) => (
          <Reveal key={i} delay={i*60} className={"ir-person" + (p.ph ? " ph" : "")}>
            <span className="ir-avatar">{p.ph ? I.plus({ width:18, height:18 }) : p.n.split(" ").map(w=>w[0]).join("")}</span>
            <div className="ir-person-name">{p.n}</div>
            <div className="ir-person-role">{p.r}</div>
            <span className={"ir-tag t-" + p.t.toLowerCase()}>{p.t}</span>
            <p className="ir-person-bio">{p.b}</p>
          </Reveal>
        ))}
      </div>

      {IR_MATRIX.length > 0 && <React.Fragment>
      <h3 className="ir-h3">Committee composition</h3>
      <div className="ir-table-wrap">
        <table className="ir-table ir-matrix">
          <thead>
            <tr><th>Director</th>{IR_COMMITTEES.map(c => <th key={c} className="ctr">{c}</th>)}</tr>
          </thead>
          <tbody>
            {IR_MATRIX.map((r,i) => (
              <tr key={i}>
                <td>{r.n}</td>
                {r.roles.map((x,j) => (
                  <td key={j} className="ctr">
                    {x === "C" ? <span className="mk chair" title="Chair">C</span>
                      : x === "M" ? <span className="mk" title="Member">M</span>
                      : <span className="mk none">—</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="ir-legend"><span><i className="mk chair">C</i> Chair</span><span><i className="mk">M</i> Member</span></div>
      </React.Fragment>}
    </div>
  );
}

/* ---------- governance · statutory disclosure table ---------- */
function IRDisclosures() {
  return (
    <div className="ir-table-wrap">
      <table className="ir-table">
        <thead><tr><th className="sr">Sr.</th><th>Particulars</th><th className="rt">Reference</th></tr></thead>
        <tbody>
          {IR_DISCLOSURES.map((r,i) => (
            <tr key={i}>
              <td className="sr num">{i+1}</td>
              <td>{r.p}</td>
              <td className="rt">
                {(r.a === "doc" || (r.a === "listing" && IR_STAGE === "listed"))
                  ? <a className="ir-link" href={r.url || "#"} onClick={e=>{ if (!r.url) e.preventDefault(); }}>View {I.link({ width:13, height:13 })}</a>
                  : r.a === "listing" ? <span className="ir-lock">On listing</span>
                  : r.a === "pending" ? <span className="muted">—</span>
                  : <span className="muted">Not applicable</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- snapshot ---------- */
function IRSnapshot({ nav }) {
  const jump = IR_SECTIONS.filter(s => s.key !== "snapshot").map(s => ({
    ...s, n: IR_DOCS.filter(d => d.sec === s.key).length,
  }));
  return (
    <div className="page-fade">
      {IR_OPS.length > 0 && (
        <Reveal className="snap-card ir-wide-card">
          <h4>Capacity build-out</h4>
          <div className="sc-sub">Commissioned, under construction and advanced pipeline.</div>
          <div style={{ marginTop:22, display:"flex", flexDirection:"column", gap:16 }}>
            {IR_OPS.map((r,i) => (
              <div key={i}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:14, marginBottom:7 }}>
                  <span>{r.l}</span><span className="num" style={{ fontWeight:600 }}>{r.v} {r.s}</span>
                </div>
                <div style={{ height:12, borderRadius:999, background:"var(--hairline)", overflow:"hidden" }}>
                  <div style={{ height:"100%", width:(r.v/r.max*100)+"%", background:r.c, borderRadius:999 }}></div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      )}

      <Reveal className="geo-band" style={{ marginTop: IR_OPS.length ? 22 : 8 }}>
        <div className="geo-map-head">
          <div>
            <h4>Where we operate</h4>
            <div className="geo-sub">Tamil Nadu · Karnataka · Gujarat · Maharashtra</div>
          </div>
          <span className="geo-legend">
            <span><i style={{ background:"#F0C000" }}></i>Gujarat</span>
            <span><i style={{ background:"#5FE0B5" }}></i>Maharashtra</span>
            <span><i style={{ background:"#4AA8E8" }}></i>Karnataka</span>
            <span><i style={{ background:"#C084FC" }}></i>Tamil Nadu</span>
          </span>
        </div>
        <ProjectsMapDark height={400}/>
      </Reveal>

      <h3 className="ir-h3" style={{ marginTop: 40 }}>Document library</h3>
      <p className="muted" style={{ maxWidth:640, marginTop:-4 }}>Filed by section.</p>
      <div className="ir-jump">
        {jump.map((s,i) => (
          <Reveal key={s.key} delay={i*50}>
            <a className="ir-jump-card" onClick={()=>nav("investors/"+s.key)} style={{ cursor:"pointer" }}>
              <span className="ir-jump-head">
                <span className="dl-ico">{I.doc()}</span>
                <span className="dt">{s.label}</span>
                <span className="dl-arrow">{I.arrow({ width:16, height:16 })}</span>
              </span>
              <span className="ir-jump-sub">{s.blurb}</span>
              {s.n > 0 && <span className="ir-jump-n num">{s.n} {s.n === 1 ? "document" : "documents"}</span>}
            </a>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/* ---------- bottom rail: subscribe + IR contact ---------- */
function IRRail() {
  return (
    <div className="inv-bottom ir-rail">
      <Reveal>
        <div className="ir-sidebar">
          <h4>Stay on the list.</h4>
          <p style={{ color:"#9FB7CF", fontSize:14.5, marginTop:8, position:"relative" }}>Results, filings and the latest deck — straight to your inbox.</p>
          <input className="ir-input" placeholder="you@fund.com" aria-label="Your email address"/>
          <button className="btn btn-primary" style={{ width:"100%", marginTop:14 }}>Subscribe to IR updates</button>
          <button className="btn btn-ghost" style={{ width:"100%", marginTop:10, color:"#fff", borderColor:"rgba(255,255,255,.28)" }}>Download latest investor deck {I.download({ width:16, height:16 })}</button>
        </div>
      </Reveal>
      <Reveal delay={80}>
        <div className="ir-contact">
          <h4>Investor contact</h4>
          <div className="ir-contact-row"><span>{IR_CONTACT.name}</span></div>
          <div className="ir-contact-row muted">{IR_CONTACT.role}</div>
          <a className="ir-contact-row ir-link" href={"mailto:" + IR_CONTACT.email}>{IR_CONTACT.email}</a>
          <a className="ir-contact-row ir-link" href={"tel:" + IR_CONTACT.phone.replace(/\s/g,"")}>{IR_CONTACT.phone}</a>
          <div className="ir-contact-row muted" style={{ fontSize:13 }}>{IR_CONTACT.addr}</div>
        </div>
      </Reveal>
    </div>
  );
}

/* ============================================================
   page shell
   ============================================================ */
function Investors({ nav, sub }) {
  const sec = irSection(sub);
  const groups = sec.groups || [];
  const [grp, setGrp] = useState(groups[0] ? groups[0].key : null);

  /* reset the inner tab whenever the section changes */
  useEffect(() => { setGrp(sec.groups && sec.groups[0] ? sec.groups[0].key : null); }, [sec.key]);

  const activeGroup = groups.find(g => g.key === grp) || groups[0];
  const groupKind = activeGroup ? (activeGroup.kind || "docs") : null;

  return (
    <div className="page-fade lane-accent" style={{ "--p-color":"#3E6FD6", "--accent":"#3E6FD6", "--accent-deep":"#2C53A8", "--accent-soft":"#E3EAFA" }}>
      <section className="page-hero">
        <div className="shell">
          <div className="breadcrumb">
            <a onClick={()=>nav("home")} style={{cursor:"pointer"}}>Home</a> {I.arrow({width:13,height:13})}
            {sec.key === "snapshot"
              ? <span style={{color:"var(--ink-2)"}}>Investors</span>
              : <React.Fragment>
                  <a onClick={()=>nav("investors")} style={{cursor:"pointer"}}>Investors</a> {I.arrow({width:13,height:13})}
                  <span style={{color:"var(--ink-2)"}}>{sec.label}</span>
                </React.Fragment>}
            <span className="t3">· /investors{sec.key === "snapshot" ? "" : "/" + sec.key}</span>
          </div>

          <div style={{ maxWidth:760, marginTop:18 }}>
            <span className="eyebrow">Investor relations</span>
            <h1 style={{ fontSize: sec.key === "snapshot" ? "clamp(38px,5.2vw,62px)" : "clamp(32px,4.2vw,50px)", letterSpacing:"-.035em", marginTop:16, lineHeight:1.0 }}>{sec.title}</h1>
            <p className="lead" style={{ fontSize:18.5, maxWidth:640 }}>{sec.blurb}</p>
          </div>

          {IR_KPIS.length > 0 && <div className="inv-keys">
            {IR_KPIS.map((x,i)=>(
              <Reveal key={i} delay={i*70}><div className="inv-key">
                <div className="v num">{x.v}<span className="u">{x.u}</span></div>
                <div className="k">{x.k}</div>
                <div className="d num">{x.d}</div>
              </div></Reveal>
            ))}
          </div>}
        </div>
      </section>

      <section className="section" style={{ paddingTop:8 }}>
        <div className="shell">
          <nav className="ir-subnav" aria-label="Investor relations sections">
            {IR_SECTIONS.map(s => (
              <a key={s.key} className={s.key === sec.key ? "active" : ""}
                 onClick={()=>nav("investors" + (s.key === "snapshot" ? "" : "/" + s.key))}
                 style={{cursor:"pointer"}}>{s.label}</a>
            ))}
          </nav>

          {sec.kind === "snapshot" && <IRSnapshot nav={nav}/>}

          {sec.kind === "docs" && (
            <div className="page-fade">
              <IRGroupTabs groups={groups} active={activeGroup && activeGroup.key} onPick={setGrp}/>
              {activeGroup && activeGroup.note && <p className="ir-note">{activeGroup.note}</p>}
              {groupKind === "board" && <IRBoard/>}
              {groupKind === "disclosures" && <IRDisclosures/>}
              {groupKind === "docs" && (
                <IRDocList
                  docs={irDocs(sec.key, activeGroup.key)}
                  emptyNote="Nothing filed in this category yet. Documents appear here as they are published."/>
              )}
            </div>
          )}

          <IRRail/>
        </div>
      </section>
    </div>
  );
}

export { Investors };
