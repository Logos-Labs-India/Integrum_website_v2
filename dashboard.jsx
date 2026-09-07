/* ============================================================
   dashboard.jsx — customer login + sample dashboard
   ============================================================ */
function Dashboard({ nav }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [mode, setMode] = useState("signin");   // signin | signup | forgot
  const [form, setForm] = useState({ name:"", company:"", email:"", phone:"", password:"", confirm:"" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);    // {type:'success'|'error', msg}
  const set = (k) => (e) => { setForm(f=>({ ...f, [k]: e.target.value })); setErrors(er=>({ ...er, [k]:null })); };

  const validate = () => {
    const e = {};
    if (mode === "signup") {
      if (!isFilled(form.name)) e.name = "Please enter your name.";
      if (!isFilled(form.company)) e.company = "Please enter your company.";
      if (!isPhone(form.phone)) e.phone = "Enter a valid phone number (10–13 digits).";
    }
    if (!isEmail(form.email)) e.email = "Enter a valid email address.";
    if (mode !== "forgot") {
      if (!isFilled(form.password)) e.password = "Please enter a password.";
      else if (mode === "signup" && form.password.length < 8) e.password = "Password must be at least 8 characters.";
    }
    if (mode === "signup" && form.confirm !== form.password) e.confirm = "Passwords don't match.";
    return e;
  };
  const submit = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) { setStatus({ type:"error", msg:"Please fix the highlighted fields and try again." }); return; }
    setStatus(null);
    if (mode === "signin") setLoggedIn(true);
    else if (mode === "signup") { setStatus({ type:"success", msg:"Account created — you can now sign in." }); setMode("signin"); setForm(f=>({ ...f, password:"", confirm:"" })); }
    else if (mode === "forgot") setStatus({ type:"success", msg:`If an account exists for ${form.email}, a reset link is on its way.` });
  };
  const switchMode = (m) => { setMode(m); setErrors({}); setStatus(null); };
  const titles = {
    signin: ["Customer login", "Sign in to your Energy Intelligence dashboard."],
    signup: ["Create your account", "Activate access to your live plant data."],
    forgot: ["Reset your password", "We'll email you a secure reset link."],
  };

  if (!loggedIn || mode !== "signin" ? !loggedIn : false) {
    /* show auth whenever not logged in */
  }
  if (!loggedIn) {
    const [h, sub] = titles[mode];
    return (
      <div className="page-fade lane-accent" style={{ "--p-color":"#004A7A", "--accent":"#004A7A", "--accent-deep":"#14517F", "--accent-soft":"#D6E7F4" }}>
        <div className="login-wrap">
          <div className="login-aside">
            <PhotoBG src={IMG.solarAerial} overlay="linear-gradient(160deg, rgba(8,23,42,.88), rgba(8,23,42,.82))" pos="center"/>
            <div style={{ position:"relative" }}>
              <div className="brand-chip" style={{ alignSelf:"flex-start" }}><img src="assets/logo-integrum.svg" alt="Integrum Energy"/></div>
            </div>
            <div style={{ position:"relative" }}>
              <span className="cc-live" style={{ color:"#7FE3C9" }}><span className="pulse-dot"></span> Live across your plants</span>
              <h2 style={{ color:"#fff", fontSize:"clamp(30px,3.6vw,44px)", marginTop:18, letterSpacing:"-.03em", lineHeight:1.05 }}>Your energy. Visible, intelligent, always on.</h2>
              <p style={{ color:"#9FB7CF", fontSize:17, marginTop:18, maxWidth:420, lineHeight:1.6 }}>Generation, consumption, banking ledger and BESS dispatch — every kilowatt-hour, accounted for.</p>
            </div>
            <div style={{ position:"relative", display:"flex", gap:28, flexWrap:"wrap" }}>
              <div><div className="num" style={{ fontFamily:"var(--font-display)", fontSize:30, color:"#fff", fontWeight:600 }}>33</div><div style={{ color:"#7E97B0", fontSize:13 }}>plants monitored</div></div>
              <div><div className="num" style={{ fontFamily:"var(--font-display)", fontSize:30, color:"#fff", fontWeight:600 }}>24×7</div><div style={{ color:"#7E97B0", fontSize:13 }}>live telemetry</div></div>
              <div><div className="num" style={{ fontFamily:"var(--font-display)", fontSize:30, color:"#fff", fontWeight:600 }}>&lt;5s</div><div style={{ color:"#7E97B0", fontSize:13 }}>data latency</div></div>
            </div>
          </div>
          <div className="login-form-wrap">
            <form className="login-form" noValidate onSubmit={(ev)=>{ ev.preventDefault(); submit(); }}>
              <h2 style={{ fontSize:30 }}>{h}</h2>
              <p className="muted" style={{ marginTop:8, marginBottom:26 }}>{sub}</p>

              {status && <div className={`form-alert ${status.type}`}>{status.type==="success" ? I.check({width:16,height:16}) : I.x({width:15,height:15})}<span>{status.msg}</span></div>}

              {mode === "signup" && (
                <React.Fragment>
                  <div className="field-l"><label>Full name</label><input value={form.name} onChange={set("name")} className={errors.name?"invalid":""} placeholder="Your name"/>{errors.name && <span className="field-err">{errors.name}</span>}</div>
                  <div className="field-l"><label>Company</label><input value={form.company} onChange={set("company")} className={errors.company?"invalid":""} placeholder="Your company"/>{errors.company && <span className="field-err">{errors.company}</span>}</div>
                </React.Fragment>
              )}

              <div className="field-l"><label>Work email</label><input type="email" value={form.email} onChange={set("email")} className={errors.email?"invalid":""} placeholder="you@yourplant.com"/>{errors.email && <span className="field-err">{errors.email}</span>}</div>

              {mode === "signup" && (
                <div className="field-l"><label>Phone</label><input type="tel" value={form.phone} onChange={set("phone")} className={errors.phone?"invalid":""} placeholder="+91 98765 43210"/>{errors.phone && <span className="field-err">{errors.phone}</span>}</div>
              )}

              {mode !== "forgot" && (
                <div className="field-l"><label>Password</label><input type="password" value={form.password} onChange={set("password")} className={errors.password?"invalid":""} placeholder="••••••••"/>{errors.password && <span className="field-err">{errors.password}</span>}</div>
              )}
              {mode === "signup" && (
                <div className="field-l"><label>Confirm password</label><input type="password" value={form.confirm} onChange={set("confirm")} className={errors.confirm?"invalid":""} placeholder="••••••••"/>{errors.confirm && <span className="field-err">{errors.confirm}</span>}</div>
              )}

              {mode === "signin" && (
                <div className="login-meta">
                  <label style={{ display:"flex", alignItems:"center", gap:8, color:"var(--ink-2)" }}><input type="checkbox" style={{ width:"auto" }}/> Keep me signed in</label>
                  <a className="link-arrow" style={{ fontSize:13.5, cursor:"pointer" }} onClick={()=>switchMode("forgot")}>Forgot password?</a>
                </div>
              )}

              <button type="submit" className="btn btn-primary" style={{ width:"100%", marginTop: mode==="signin"?0:8 }}>
                {mode==="signin" ? "Sign in" : mode==="signup" ? "Create account" : "Send reset link"} {I.arrow()}
              </button>

              <div style={{ textAlign:"center", marginTop:18, fontSize:13.5, color:"var(--ink-3)" }}>
                {mode==="signin" && <React.Fragment>First time here? <a className="link-arrow" style={{ fontSize:13.5, display:"inline-flex", cursor:"pointer" }} onClick={()=>switchMode("signup")}>Create an account</a></React.Fragment>}
                {mode==="signup" && <React.Fragment>Already have an account? <a className="link-arrow" style={{ fontSize:13.5, display:"inline-flex", cursor:"pointer" }} onClick={()=>switchMode("signin")}>Sign in</a></React.Fragment>}
                {mode==="forgot" && <a className="link-arrow" style={{ fontSize:13.5, display:"inline-flex", cursor:"pointer" }} onClick={()=>switchMode("signin")}>{I.arrow({width:14,height:14,style:{transform:"rotate(180deg)"}})} Back to sign in</a>}
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return <DashboardApp nav={nav} onLogout={()=>setLoggedIn(false)}/>;
}

function DashboardApp({ nav, onLogout }) {
  const strip = [
    { k:"Today's generation", v:"38,420", u:"kWh", delta:"+6.2% vs yesterday", up:true, icon:"bolt" },
    { k:"Today's consumption", v:"31,180", u:"kWh", delta:"81% met by renewables", up:true, icon:"gauge" },
    { k:"Banking position", v:"+7,240", u:"units", delta:"Net credited today", up:true, icon:"trendUp" },
  ];
  const ledger = [
    ["Units credited (export)", "+12,480", "var(--green)"],
    ["Units drawn (import)", "−5,240", "var(--ink)"],
    ["Opening balance", "1,84,320", "var(--ink)"],
    ["Closing balance", "1,91,560", "var(--p-customer)"],
  ];
  const alerts = [
    { t:"Inverter 3B back online", m:"Pune plant · auto-recovered", time:"12m", c:"var(--green)" },
    { t:"Scheduled maintenance", m:"Hubli site · Sat 06:00–09:00", time:"2h", c:"#6D4AFF" },
    { t:"Peak-tariff window approaching", m:"BESS will discharge 18:00–22:00", time:"4h", c:"#3E6FD6" },
    { t:"Monthly BRSR report ready", m:"April generation & tCO₂e", time:"1d", c:"var(--p-customer)" },
  ];

  return (
    <div className="dash page-fade lane-accent" style={{ "--p-color":"#004A7A", "--accent":"#004A7A", "--accent-deep":"#14517F" }}>
      <div className="shell">
        <div className="dash-top">
          <div>
            <span className="cc-live" style={{ color:"var(--p-customer)" }}><span className="pulse-dot" style={{ background:"var(--p-customer)" }}></span> Live · all systems nominal</span>
            <h2 style={{ fontSize:28, marginTop:8 }}>Good afternoon, Ramesh.</h2>
            <p className="muted" style={{ fontSize:14.5 }}>Sterling Cement · 3 sites · 24 MWp hybrid</p>
          </div>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <span className="chip">Apr 2026 ▾</span>
            <button className="btn btn-ghost" onClick={onLogout}>Sign out</button>
          </div>
        </div>

        <div className="dash-strip">
          {strip.map((s,i)=>(
            <div className="dstat" key={i}>
              <div className="k"><span style={{ color:"var(--p-customer)" }}>{I[s.icon]({width:18,height:18})}</span>{s.k}</div>
              <div className="v num">{s.v}<span className="u">{s.u}</span></div>
              <div className={`delta ${s.up?"up":"down"} num`}>{s.delta}</div>
            </div>
          ))}
        </div>

        <div className="dash-main" style={{ paddingBottom:48 }}>
          <div className="dpanel">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div><h4>Generation — last 24 hours</h4><div className="dpanel-sub">Hybrid output across all 3 sites · MW</div></div>
              <span className="chip" style={{ fontSize:12 }}>Peak 5.4 MW · 12:40</span>
            </div>
            <div style={{ marginTop:18 }}><GenerationChart color="#004A7A"/></div>
          </div>

          <div className="dash-col">
            <div className="dpanel">
              <h4>Banking ledger</h4>
              <div className="dpanel-sub">Units credited vs. drawn · today</div>
              <div style={{ marginTop:10 }}>
                {ledger.map((r,i)=>(
                  <div className="ledger-row" key={i} style={ i===ledger.length-1 ? { borderTop:"1px solid var(--hairline)", borderBottom:"none", marginTop:4, paddingTop:14 } : null }>
                    <span style={{ color:"var(--ink-2)" }}>{r[0]}</span>
                    <span className="lr-v num" style={{ color:r[2] }}>{r[1]}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="dpanel">
              <h4>BESS state</h4>
              <div className="dpanel-sub">Charge level & last dispatch</div>
              <div className="bess-ring">
                <BessRing pct={68}/>
                <div>
                  <div style={{ fontSize:14, color:"var(--ink-2)" }}>Last action</div>
                  <div style={{ fontWeight:600, marginTop:2 }}>Charged on surplus</div>
                  <div className="muted" style={{ fontSize:13, marginTop:6 }}>13:10 · 1.2 MWh stored</div>
                  <div className="chip" style={{ marginTop:10, fontSize:12, color:"var(--green)", borderColor:"var(--green-soft)" }}><span className="pulse-dot"></span>Next: discharge at peak 18:00</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="dpanel" style={{ marginBottom:56 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div><h4>Alerts & messages</h4><div className="dpanel-sub">System notices and maintenance</div></div>
            <span style={{ display:"inline-flex", color:"var(--ink-3)" }}>{I.bell()}</span>
          </div>
          <div style={{ marginTop:10 }}>
            {alerts.map((a,i)=>(
              <div className="alert-row" key={i}>
                <span className="alert-dot" style={{ background:a.c }}></span>
                <div><div className="ar-t">{a.t}</div><div className="ar-m">{a.m}</div></div>
                <span className="ar-time num">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Dashboard });
