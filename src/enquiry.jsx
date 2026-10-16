/* ============================================================
   enquiry.jsx — dedicated customer enquiry form (Solutions / Platform)
   Captures industry, average annual consumption, location and state.
   ============================================================ */
import { useState as useStateE } from "react";
import { I } from "./dataviz";
import { validateName, validateEmail, validatePhone, submitLead } from "./leads";

export const ENQ_INDUSTRIES = [
  "Steel & metals","Graphite & metals","Cement","Automotive","Chemicals","Healthcare",
  "Textiles","Paper & packaging","Food & beverage","Commercial real estate","Jewellery retail","Other",
];
export const ENQ_STATES = [
  "Karnataka","Maharashtra","Tamil Nadu","Gujarat","Rajasthan","Telangana",
  "Andhra Pradesh","Madhya Pradesh","Uttar Pradesh","Haryana","Punjab","Other",
];
export const ENQ_CONSUMPTION = [
  "Under 5 million units / yr","5–20 million units / yr","20–50 million units / yr",
  "50–100 million units / yr","Over 100 million units / yr","Not sure yet",
];

/* ---------- form text (CMS-editable) ---------- */
export const ENQ_TEXT = {
  eyebrow: "Bring us your energy challenge",
  title: "Tell us about your load. We'll come back with an approach.",
  sub: "Share a few details and an energy advisor will assess your consumption, state regulations and the commercial models available to you.",
  nameLabel: "Name", companyLabel: "Company", emailLabel: "Work email", phoneLabel: "Phone",
  industryLabel: "Industry", industryPick: "Select industry",
  consumptionLabel: "Average annual consumption", consumptionPick: "Select consumption",
  locationLabel: "Location", locationPlaceholder: "City / district of your plant",
  stateLabel: "State", statePick: "Select state",
  notesLabel: "Anything else we should know", notesPlaceholder: "Current tariff, open-access status, sustainability targets, timelines",
  submit: "Submit my details",
  privacyNote: "We use these details only to prepare your assessment. See our",
  privacyLink: "Privacy Policy",
  doneTitle: "Thank you. Your details are with our energy advisory desk.",
  doneText: "An advisor will review your consumption profile and state regulations, and come back within one business day.",
  doneCta: "Read a comparable case study",
};

export function CustomerEnquiry({ nav, variant = "light" }) {
  const [f, setF] = useStateE({ name:"", company:"", email:"", phone:"", industry:"", consumption:"", location:"", state:"", notes:"" });
  const [err, setErr] = useStateE({});
  const [sent, setSent] = useStateE(false);
  const [busy, setBusy] = useStateE(false);
  const set = (k) => (e) => { setF({ ...f, [k]: e.target.value }); if (err[k]) setErr({ ...err, [k]:null }); };

  const submit = async () => {
    const e = {};
    const nameErr = validateName(f.name); if (nameErr) e.name = nameErr;
    if (!f.company.trim()) e.company = "Please enter your company";
    const mailErr = validateEmail(f.email, { requireWork:true }); if (mailErr) e.email = mailErr;
    const phoneErr = validatePhone(f.phone); if (phoneErr) e.phone = phoneErr;
    if (!f.industry) e.industry = "Select your industry";
    if (!f.consumption) e.consumption = "Select your annual consumption";
    if (!f.location.trim()) e.location = "Enter your plant location";
    if (!f.state) e.state = "Select your state";
    setErr(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    await submitLead("Customer enquiry", f);
    setBusy(false);
    setSent(true);
  };

  if (sent) return (
    <div className={`enq-card enq-${variant} slidein`} id="energy-challenge">
      <div className="enq-done">
        <span className="enq-tick">{I.check({ width:26, height:26 })}</span>
        <h3>{ENQ_TEXT.doneTitle}</h3>
        <p>{ENQ_TEXT.doneText}</p>
        <button className="btn btn-ghost" style={{ marginTop:20 }} onClick={()=>nav("case")}>{ENQ_TEXT.doneCta}</button>
      </div>
    </div>
  );

  return (
    <div className={`enq-card enq-${variant}`} id="energy-challenge">
      <div className="enq-head">
        <span className="eyebrow">{ENQ_TEXT.eyebrow}</span>
        <h3>{ENQ_TEXT.title}</h3>
        <p className="enq-sub">{ENQ_TEXT.sub}</p>
      </div>
      <div className="enq-grid">
        <label className="enq-f"><span>{ENQ_TEXT.nameLabel}</span>
          <input value={f.name} onChange={set("name")} className={err.name?"invalid":""} placeholder="Your full name"/>
          {err.name && <em className="field-err">{err.name}</em>}
        </label>
        <label className="enq-f"><span>{ENQ_TEXT.companyLabel}</span>
          <input value={f.company} onChange={set("company")} className={err.company?"invalid":""} placeholder="Company name"/>
          {err.company && <em className="field-err">{err.company}</em>}
        </label>
        <label className="enq-f"><span>{ENQ_TEXT.emailLabel}</span>
          <input type="email" value={f.email} onChange={set("email")} className={err.email?"invalid":""} placeholder="name@company.com"/>
          {err.email && <em className="field-err">{err.email}</em>}
        </label>
        <label className="enq-f"><span>{ENQ_TEXT.phoneLabel}</span>
          <input value={f.phone} onChange={set("phone")} className={`num ${err.phone?"invalid":""}`} placeholder="+91 00000 00000"/>
          {err.phone && <em className="field-err">{err.phone}</em>}
        </label>
        <label className="enq-f"><span>{ENQ_TEXT.industryLabel}</span>
          <select value={f.industry} onChange={set("industry")} className={err.industry?"invalid":""}>
            <option value="">{ENQ_TEXT.industryPick}</option>
            {ENQ_INDUSTRIES.map(x=>(<option key={x} value={x}>{x}</option>))}
          </select>
          {err.industry && <em className="field-err">{err.industry}</em>}
        </label>
        <label className="enq-f"><span>{ENQ_TEXT.consumptionLabel}</span>
          <select value={f.consumption} onChange={set("consumption")} className={err.consumption?"invalid":""}>
            <option value="">{ENQ_TEXT.consumptionPick}</option>
            {ENQ_CONSUMPTION.map(x=>(<option key={x} value={x}>{x}</option>))}
          </select>
          {err.consumption && <em className="field-err">{err.consumption}</em>}
        </label>
        <label className="enq-f"><span>{ENQ_TEXT.locationLabel}</span>
          <input value={f.location} onChange={set("location")} className={err.location?"invalid":""} placeholder={ENQ_TEXT.locationPlaceholder}/>
          {err.location && <em className="field-err">{err.location}</em>}
        </label>
        <label className="enq-f"><span>{ENQ_TEXT.stateLabel}</span>
          <select value={f.state} onChange={set("state")} className={err.state?"invalid":""}>
            <option value="">{ENQ_TEXT.statePick}</option>
            {ENQ_STATES.map(x=>(<option key={x} value={x}>{x}</option>))}
          </select>
          {err.state && <em className="field-err">{err.state}</em>}
        </label>
        <label className="enq-f enq-wide"><span>{ENQ_TEXT.notesLabel} <em className="enq-opt">(optional)</em></span>
          <textarea rows="3" value={f.notes} onChange={set("notes")} placeholder={ENQ_TEXT.notesPlaceholder}></textarea>
        </label>
      </div>
      <button className="btn btn-nav-cta btn-lg enq-submit" onClick={submit} disabled={busy}>{busy ? "Sending…" : ENQ_TEXT.submit} {!busy && I.arrow()}</button>
      <p className="enq-note">{ENQ_TEXT.privacyNote} <a onClick={()=>nav("privacy")} style={{cursor:"pointer"}}>{ENQ_TEXT.privacyLink}</a>.</p>
    </div>
  );
}
