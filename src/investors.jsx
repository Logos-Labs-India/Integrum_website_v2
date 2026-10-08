/* ============================================================
   investors.jsx — Investor Relations (/investors/<section>)

   Routes:  /investors               → Snapshot
            /investors/financials    → Financials
            /investors/announcements → Corporate announcements
            /investors/press         → Press releases
            /investors/presentations → Presentations & transcripts
            /investors/governance    → Governance
            /investors/offer         → Offer & IPO
            /investors/esg           → ESG & sustainability
            /investors/directors     → Board of Directors

   All content comes from ir-data.js — this file holds no data.
   ============================================================ */
import React, { useState, useEffect, useMemo } from "react";
import ReactDOM from "react-dom";
import { I, Reveal, ProjectsMapDark, PROJECT_REGIONS } from "./dataviz";
import {
  IR_STAGE, IR_SECTIONS, IR_KPIS, IR_HIGHLIGHTS, IR_DOCS, IR_BOARD,
  IR_COMMITTEES, IR_MATRIX, IR_DISCLOSURES, IR_OPS, IR_CONTACT,
} from "./ir-data";

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

/* ---------- DRHP / DAP / DRHP advertisement — legal disclaimer gate ----------
   Shown on EVERY download click (no session/local memory, by legal instruction).
   "I Confirm" downloads; "I Do Not Confirm" blocks it and shows the notice. */
const IR_DRHP_DISCLAIMER = [
  "The following disclaimer applies to the draft red herring prospectus dated September 24, 2026 (the “Draft Red Herring Prospectus”) filed with the Securities and Exchange Board of India (“SEBI”), BSE Limited and National Stock Exchange of India Limited hosted on this website in relation to the proposed initial public offering in India of the equity shares bearing face value of ₹2 each (“Equity Shares”) of Integrum Energy Infrastructure Limited (the “Company”) (the “Offer”). You are advised to read this disclaimer carefully before reading, accessing or making any other use of the Draft Red Herring Prospectus.",
  "The Draft Red Herring Prospectus does not constitute an offer of securities for sale in any jurisdiction, including India, and any potential investors should not rely on the Draft Red Herring Prospectus. Neither the Company nor any of its affiliates is soliciting any action based on the Draft Red Herring Prospectus. The offer and sale of the Equity Shares to be offered in the Offer shall be made only pursuant to the Red Herring Prospectus (when available), if the investor is in India, or the Red Herring Prospectus and the accompanying preliminary international wrap (which contains, among other things, the selling restrictions for the Offer outside India) if the investor is outside India. No person outside India is eligible to bid for Equity Shares in the Offer unless that person has received the preliminary offering memorandum for the Offer, which comprises the Red Herring Prospectus and the preliminary international wrap.",
  "The Equity Shares offered in the Offer have not been and will not be registered, listed or otherwise qualified in any jurisdiction except India and may not be offered or sold to persons outside of India except in compliance with the applicable laws of each such jurisdiction. In particular, the Equity Shares offered in the Offer have not been and will not be registered, listed or otherwise qualified in any jurisdiction except India and may not be offered or sold to persons outside of India except in compliance with the applicable laws of each such jurisdiction. In particular, the Equity Shares offered in the Offer have not been and will not be registered under the U.S. Securities Act of 1933, as amended (the “U.S. Securities Act”), or the securities laws of any state of the United States and may not be offered or sold in the United States, except pursuant to an exemption from, or in a transaction not subject to, the registration requirements of the U.S. Securities Act and applicable state securities laws. The Equity Shares offered in the Offer are being offered and sold only outside the United States in “offshore transactions” as defined in and in reliance on Regulation S under the U.S. Securities Act.",
  "The copy of the Draft Red Herring Prospectus hosted on this website may not be distributed, directly or indirectly, outside India. You are hereby notified that any forwarding, delivery, distribution or reproduction of the Draft Red Herring Prospectus, in whole or in part, outside India is strictly prohibited. Failure to comply with this disclaimer may result in a violation of the applicable laws. If you access the Draft Red Herring Prospectus, you agree not to forward, deliver or distribute it, in whole or in part, to any person outside India.",
  "You are accessing this website at your own risk. None of the Company, Mefcom Capital Markets Limited, Centrum Broking Limited (as successor to the merchant banking business of Centrum Capital Limited), Beeline Capital Advisors Private Limited (together, the “Book Running Lead Managers”) or their respective affiliates, directors, officers, agents, representatives, advisors or employees will be liable or have any responsibility of any kind for any loss or damage that you incur in the event of any failure or disruption of this website, or resulting from the act or omission of any other party involved in making this website or the data contained therein available to you, or from any other cause relating to your access to, inability to access, or use of the website or these materials.",
  "The Company and its affiliates shall not be responsible for any loss or damage that could result from interception and interpretation by any third parties of any information being made available to you through this website. Our Company has taken all necessary steps to ensure that the contents of the Draft Red Herring Prospectus as appearing on this website are identical to the Draft Red Herring Prospectus filed with SEBI. You are reminded that documents transmitted in electronic form may be altered or changed during the process of transmission and consequently, none of the Company, Book Running Lead Managers, their respective affiliates, directors, officers, agents, representatives, advisors or employees accepts any liability or responsibility whatsoever in respect of alterations or changes which may have taken place during the course of transmission of the Draft Red Herring Prospectus in electronic format.",
  "You are responsible for protecting against viruses and other destructive items. You are accessing this website at your own risk, and it is your responsibility to take precautions to ensure that it is free from viruses and other items of a destructive nature."
];
function IRDisclaimer({ doc, onClose }) {
  const [declined, setDeclined] = React.useState(false);
  React.useEffect(() => {
    const k = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", k);
    const o = document.body.style.overflow; document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = o; };
  }, []);
  const confirm = () => {
    const a = document.createElement("a");
    a.href = doc.url; a.download = doc.url.split("/").pop(); a.rel = "noopener";
    document.body.appendChild(a); a.click(); a.remove();
    onClose();
  };
  return (
    <div className="irdc-overlay" onMouseDown={(e)=>{ if (e.target === e.currentTarget) onClose(); }}>
      <div className="irdc-box" role="dialog" aria-modal="true" aria-labelledby="irdc-title">
        {declined ? (
          <div className="irdc-declined">
            <p className="irdc-declined-msg">You are not permitted to view the materials in this section of the website</p>
            <button className="btn btn-ghost" onClick={onClose} autoFocus>Close</button>
          </div>
        ) : (<>
          <div className="irdc-head">
            <span className="irdc-eyebrow">Website screening and disclaimer</span>
            <h3 id="irdc-title" className="irdc-title">Important Disclaimer</h3>
            <span className="irdc-doc">{doc.t}</span>
          </div>
          <div className="irdc-body">
            <p className="irdc-caps">PLEASE READ THIS DISCLAIMER CAREFULLY AND AGREE WITH THE TERMS AND CONDITIONS OF THIS DISCLAIMER BEFORE CONTINUING. IT APPLIES TO ALL PERSONS WHO VIEW THIS WEBSITE. PLEASE NOTE THAT THE DISCLAIMER SET OUT BELOW MAY BE ALTERED OR UPDATED. YOU SHOULD READ IT IN FULL EACH TIME YOU VISIT THE WEBSITE. BY ACCESSING THIS INFORMATION ON THIS WEBSITE, YOU AGREE TO THE TERMS AND CONDITIONS BELOW, INCLUDING ANY MODIFICATIONS THAT MAY BE MADE TO THEM FROM TIME TO TIME.</p>
            <p className="irdc-caps">THESE MATERIALS ARE NOT DIRECTED AT OR INTENDED TO BE ACCESSED BY PERSONS OUTSIDE INDIA.</p>
            <p className="irdc-caps">THE DRAFT RED HERRING PROSPECTUS HAS BEEN MADE AVAILABLE ON OUR WEBSITE TO COMPLY WITH THE SECURITIES AND EXCHANGE BOARD OF INDIA (ISSUE OF CAPITAL AND DISCLOSURE REQUIREMENTS) REGULATIONS, 2018, AS AMENDED.</p>
            {IR_DRHP_DISCLAIMER.map((p, i) => <p key={i}>{p}</p>)}
            <p><strong>Due to legal restrictions, access to this part of this website is only available to residents of India from within India.</strong></p>
            <p><strong>If you are not in India, please exit this webpage.</strong></p>
            <h4 className="irdc-h4">Confirmation of your acceptance of the terms and conditions</h4>
            <p>By clicking on the “I Confirm” button below you represent to the Company that:</p>
            <ol className="irdc-list">
              <li>You have read the disclaimer set out above and you agree to be bound by its terms; and</li>
              <li>You are a resident of India and are located in India.</li>
            </ol>
            <p>If you cannot make these confirmations, you must press the button marked “I Do Not Confirm”.</p>
          </div>
          <div className="irdc-foot">
            <button className="btn btn-ghost" onClick={()=>setDeclined(true)}>I Do Not Confirm</button>
            <button className="btn btn-primary" onClick={confirm}>I Confirm</button>
          </div>
        </>)}
      </div>
    </div>
  );
}

/* ---------- one document row ---------- */
function IRDocRow({ d }) {
  const locked = irLocked(d);
  const [gate, setGate] = React.useState(false);
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
        : <a className="dl-arrow" href={d.url || "#"} onClick={(e)=>{ if (!d.url) { e.preventDefault(); return; } if (d.gated) { e.preventDefault(); setGate(true); } }} aria-label={"Download " + d.t}>{I.download()}</a>}
      {gate && ReactDOM.createPortal(<IRDisclaimer doc={d} onClose={()=>setGate(false)}/>, document.body)}
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
  if (!IR_DISCLOSURES.length) return (
    <div className="ir-empty">Statutory disclosures will be published here.</div>
  );
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
/* ---------- snapshot · DRHP statutory audio-visual ---------- */
const IR_AV = [
  { key:"en", label:"English", src:"/assets/investors/IEIL-DRHP-Statutory-AV-English.mp4" },
  { key:"hi", label:"हिन्दी (Hindi)", src:"/assets/investors/IEIL-DRHP-Statutory-AV-Hindi.mp4" },
];

function IRStatutoryAV() {
  const [lang, setLang] = useState(IR_AV[0].key);
  const cur = IR_AV.find(v => v.key === lang) || IR_AV[0];
  return (
    <>
      <h3 className="ir-h3" style={{ marginTop: 40 }}>Statutory audio-visual — DRHP</h3>
      <p className="muted" style={{ maxWidth:640, marginTop:-4 }}>Draft Red Herring Prospectus audio-visual, in English and Hindi.</p>
      <IRGroupTabs groups={IR_AV} active={lang} onPick={setLang}/>
      <Reveal className="ir-av">
        <video key={cur.key} controls preload="metadata" playsInline
               poster="/assets/investors/IEIL-DRHP-Statutory-AV-poster.jpg">
          <source src={cur.src} type="video/mp4"/>
        </video>
      </Reveal>
    </>
  );
}

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
            <div className="geo-sub">Four states across India's highest-resource wind and solar corridors</div>
          </div>
        </div>
        <div className="geo-split">
          <div className="geo-map-col"><ProjectsMapDark height={430}/></div>
          <div className="geo-state-col">
            {PROJECT_REGIONS.map((r,i)=>(
              <div className="geo-state" key={i} style={{ "--gc": r.glow }}>
                <div className="gs-main">
                  <span className="gs-dot"></span>
                  <span className="gs-name">{r.name}</span>
                  {r.status==="development"
                    ? <span className="gs-n" style={{ fontSize:13, fontWeight:600 }}>Under development</span>
                    : <span className="gs-n num">{r.n}<em>projects</em></span>}
                </div>
                <div className="gs-track">
                  {r.status==="development"
                    ? <span style={{ width:"100%", opacity:.35, background:"repeating-linear-gradient(90deg, var(--gc) 0 6px, transparent 6px 12px)" }}></span>
                    : <span style={{ width: Math.round((r.n/25)*100)+"%" }}></span>}
                </div>
              </div>
            ))}
            <div className="geo-state-foot">
              <span className="gsf-ic">{I.compass({width:16,height:16})}</span>
              <p>Wind, solar and hybrid assets sited on validated resource data, with transmission access secured before construction.</p>
            </div>
          </div>
        </div>
      </Reveal>

      <IRStatutoryAV/>

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
export function Investors({ nav, sub }) {
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
            
          </div>

          <div style={{ maxWidth:760, marginTop:18 }}>
            <span className="eyebrow">Investor relations</span>
            <h1 style={{ fontSize: sec.key === "snapshot" ? "clamp(38px,5.2vw,62px)" : "clamp(32px,4.2vw,50px)", letterSpacing:"-.035em", marginTop:16, lineHeight:1.0 }}>{sec.title}</h1>
            <p className="lead" style={{ fontSize:18.5, maxWidth:640 }}>{sec.blurb}</p>

            {IR_HIGHLIGHTS.length > 0 && <div className="ir-highlight-row">
              {IR_HIGHLIGHTS.map((h,i)=>(
                <Reveal key={i} delay={i*60}><span className="ir-highlight-chip">{h}</span></Reveal>
              ))}
            </div>}
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

          {sec.kind === "directors" && <div className="page-fade"><IRBoard/></div>}

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

