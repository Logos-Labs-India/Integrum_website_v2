/* ============================================================
   enquiry.jsx — dedicated customer enquiry form (Solutions / Platform)
   Captures industry, average annual consumption, location and state.
   ============================================================ */
const { useState: useStateE } = React;

const ENQ_INDUSTRIES = [
  "Steel & metals","Graphite & metals","Cement","Automotive","Chemicals","Healthcare",
  "Textiles","Paper & packaging","Food & beverage","Commercial real estate","Jewellery retail","Other",
];
const ENQ_STATES = [
  "Karnataka","Maharashtra","Tamil Nadu","Gujarat","Rajasthan","Telangana",
  "Andhra Pradesh","Madhya Pradesh","Uttar Pradesh","Haryana","Punjab","Other",
];
const ENQ_CONSUMPTION = [
  "Under 5 million units / yr","5–20 million units / yr","20–50 million units / yr",
  "50–100 million units / yr","Over 100 million units / yr","Not sure yet",
];

function CustomerEnquiry({ nav, variant = "light" }) {
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
        <h3>Thank you. Your details are with our energy advisory desk.</h3>
        <p>An advisor will review your consumption profile and state regulations, and come back within one business day.</p>
        <button className="btn btn-ghost" style={{ marginTop:20 }} onClick={()=>nav("case")}>Read a comparable case study</button>
      </div>
    </div>
  );

  return (
    <div className={`enq-card enq-${variant}`} id="energy-challenge">
      <div className="enq-head">
        <span className="eyebrow">Bring us your energy challenge</span>
        <h3>Tell us about your load. We'll come back with an approach.</h3>
        <p className="enq-sub">Share a few details and an energy advisor will assess your consumption, state regulations and the commercial models available to you.</p>
      </div>
      <div className="enq-grid">
        <label className="enq-f"><span>Name</span>
          <input value={f.name} onChange={set("name")} className={err.name?"invalid":""} placeholder="Your full name"/>
          {err.name && <em className="field-err">{err.name}</em>}
        </label>
        <label className="enq-f"><span>Company</span>
          <input value={f.company} onChange={set("company")} className={err.company?"invalid":""} placeholder="Company name"/>
          {err.company && <em className="field-err">{err.company}</em>}
        </label>
        <label className="enq-f"><span>Work email</span>
          <input type="email" value={f.email} onChange={set("email")} className={err.email?"invalid":""} placeholder="name@company.com"/>
          {err.email && <em className="field-err">{err.email}</em>}
        </label>
        <label className="enq-f"><span>Phone</span>
          <input value={f.phone} onChange={set("phone")} className={`num ${err.phone?"invalid":""}`} placeholder="+91 00000 00000"/>
          {err.phone && <em className="field-err">{err.phone}</em>}
        </label>
        <label className="enq-f"><span>Industry</span>
          <select value={f.industry} onChange={set("industry")} className={err.industry?"invalid":""}>
            <option value="">Select industry</option>
            {ENQ_INDUSTRIES.map(x=>(<option key={x} value={x}>{x}</option>))}
          </select>
          {err.industry && <em className="field-err">{err.industry}</em>}
        </label>
        <label className="enq-f"><span>Average annual consumption</span>
          <select value={f.consumption} onChange={set("consumption")} className={err.consumption?"invalid":""}>
            <option value="">Select consumption</option>
            {ENQ_CONSUMPTION.map(x=>(<option key={x} value={x}>{x}</option>))}
          </select>
          {err.consumption && <em className="field-err">{err.consumption}</em>}
        </label>
        <label className="enq-f"><span>Location</span>
          <input value={f.location} onChange={set("location")} className={err.location?"invalid":""} placeholder="City / district of your plant"/>
          {err.location && <em className="field-err">{err.location}</em>}
        </label>
        <label className="enq-f"><span>State</span>
          <select value={f.state} onChange={set("state")} className={err.state?"invalid":""}>
            <option value="">Select state</option>
            {ENQ_STATES.map(x=>(<option key={x} value={x}>{x}</option>))}
          </select>
          {err.state && <em className="field-err">{err.state}</em>}
        </label>
        <label className="enq-f enq-wide"><span>Anything else we should know <em className="enq-opt">(optional)</em></span>
          <textarea rows="3" value={f.notes} onChange={set("notes")} placeholder="Current tariff, open-access status, sustainability targets, timelines"></textarea>
        </label>
      </div>
      <button className="btn btn-nav-cta btn-lg enq-submit" onClick={submit} disabled={busy}>{busy ? "Sending…" : "Submit my details"} {!busy && I.arrow()}</button>
      <p className="enq-note">We use these details only to prepare your assessment. See our <a onClick={()=>nav("privacy")} style={{cursor:"pointer"}}>Privacy Policy</a>.</p>
    </div>
  );
}

Object.assign(window, { CustomerEnquiry, ENQ_INDUSTRIES, ENQ_STATES, ENQ_CONSUMPTION });
