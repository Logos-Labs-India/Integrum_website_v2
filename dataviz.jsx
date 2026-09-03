/* ============================================================
   dataviz.jsx — hooks, icons, charts, counters, India map
   Exposes components on window for other babel scripts.
   ============================================================ */
const { useState, useEffect, useRef, useMemo } = React;

/* ---------- hooks ---------- */
function useInView(opts) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const inView = () => {
      const r = el.getBoundingClientRect();
      return r.top < (window.innerHeight || 800) * 0.92 && r.bottom > 0;
    };
    if (inView()) { setSeen(true); return; }          // already visible on mount
    let done = false;
    const reveal = () => { if (done) return; done = true; setSeen(true); cleanup(); };
    const onScroll = () => { if (inView()) reveal(); };  // works even if IO is frame-paused
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) reveal(); },
      { threshold: 0.12, ...(opts || {}) });
    io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    function cleanup() { io.disconnect(); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); }
    return cleanup;
  }, []);
  return [ref, seen];
}

function Reveal({ children, delay = 0, as = "div", className = "", ...rest }) {
  const [ref, seen] = useInView();
  const Tag = as;
  return (
    <Tag ref={ref} className={`reveal ${seen ? "in" : ""} ${className}`}
         style={{ transitionDelay: `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  );
}

/* count-up that triggers when in view */
function useCountUp(target, { dur = 1400, decimals = 0, start = 0 } = {}) {
  const [ref, seen] = useInView();
  const [val, setVal] = useState(start);
  useEffect(() => {
    if (!seen) return;
    let raf, t0, done = false;
    const finish = () => { if (!done) { done = true; setVal(target); } };
    const tick = (t) => {
      if (!t0) t0 = t;
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(start + (target - start) * eased);
      if (p < 1) raf = requestAnimationFrame(tick); else done = true;
    };
    raf = requestAnimationFrame(tick);
    // guarantee the end state even if rAF is paused (unfocused/background load)
    const fallback = setTimeout(finish, dur + 250);
    return () => { cancelAnimationFrame(raf); clearTimeout(fallback); };
  }, [seen, target]);
  const formatted = useMemo(() => {
    const n = decimals ? val.toFixed(decimals) : Math.round(val);
    return Number(n).toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  }, [val]);
  return [ref, formatted];
}

/* ---------- icon set (stroke, 1.6) ---------- */
const I = {
  segSteel: (p) => <svg viewBox="0 0 64 64" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M11 9h42a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3H41a3 3 0 0 0-3 3v22a3 3 0 0 0 3 3h12a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3v-3a3 3 0 0 1 3-3h12a3 3 0 0 0 3-3V21a3 3 0 0 0-3-3H11a3 3 0 0 1-3-3v-3a3 3 0 0 1 3-3z"/></svg>,
  segHospital: (p) => <svg viewBox="0 0 64 64" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M22 56V9a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v47"/><path d="M22 23H9a1 1 0 0 0-1 1v32M42 23h13a1 1 0 0 1 1 1v32"/><path d="M32 12.5v8M28 16.5h8" strokeWidth="2.2"/><path d="M27.5 56V47a4.5 4.5 0 0 1 9 0v9"/><path d="M6 56h52"/></svg>,
  segGraphite: (p) => <svg viewBox="0 0 64 64" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}><polygon points="32,9 43.26,15.5 43.26,28.5 32,35 20.74,28.5 20.74,15.5"/><polygon points="20.74,28.5 32,35 32,48 20.74,54.5 9.48,48 9.48,35"/><polygon points="43.26,28.5 54.52,35 54.52,48 43.26,54.5 32,48 32,35"/></svg>,
  segScooter: (p) => <svg viewBox="0 0 64 64" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="14" cy="46" r="8"/><circle cx="50" cy="46" r="8"/><path d="M22 46h20"/><path d="M50 38V22a6 6 0 0 0-6-6h-4"/><path d="M40 16 26 34h-8"/><path d="M18 34a10 10 0 0 0-4 8"/></svg>,
  segFlask: (p) => <svg viewBox="0 0 64 64" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M24.5 8.5h15"/><path d="M27 8.5v11.8L12.8 49.7a3.6 3.6 0 0 0 3.2 5.3h32a3.6 3.6 0 0 0 3.2-5.3L37 20.3V8.5"/><path d="M18.4 42.4q3.6-3.4 7.2 0t7.2 0 7.2 0 5.6-.6" strokeWidth="2"/></svg>,
  segPipes: (p) => <svg viewBox="0 0 64 64" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M32 5.5c7 9.2 11.2 13.6 11.2 19.3A11.2 11.2 0 0 1 20.8 24.8C20.8 19.1 25 14.7 32 5.5z"/><rect x="24" y="32.5" width="16" height="5.5" rx="1.8"/><path d="M28 38v6.5M36 38v6.5"/><rect x="8" y="41.5" width="5.5" height="17" rx="1.8"/><rect x="50.5" y="41.5" width="5.5" height="17" rx="1.8"/><path d="M13.5 44.5h14.5M36 44.5h14.5M13.5 55.5h37"/></svg>,
  segWoven: (p) => <svg viewBox="0 0 64 64" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><g transform="rotate(45 32 32)"><path d="M14 15h13M14 21h13M14 27h13"/><path d="M37 14v13M43 14v13M49 14v13"/><path d="M15 37v13M21 37v13M27 37v13"/><path d="M37 38h13M37 44h13M37 50h13"/></g></svg>,
  segCement: (p) => <svg viewBox="0 0 64 64" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M19 13.5c4.5 2.5 21.5 2.5 26 0l3 5.5v32a3 3 0 0 1-3 3H19a3 3 0 0 1-3-3v-32z"/><path d="M19 13.5 16 19h32l-3-5.5" strokeWidth="1.8"/><circle cx="32" cy="35" r="7.5"/><path d="M28.5 35.5c2-4 4.5-5.5 7-6-.5 4.5-2.5 7-7 8z" strokeWidth="1.8"/></svg>,
  segDiamond: (p) => <svg viewBox="0 0 64 64" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M22 13.5h20L50.5 22 32 54.5 13.5 22z"/><path d="M13.5 22h37"/><path d="M22 13.5 26 22M42 13.5 38 22"/><path d="M26 22 32 54.5M38 22 32 54.5"/></svg>,
  factory: (p) => <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 21h18M4 21V9l5 3V9l5 3V7l5 3v11"/><path d="M4 21V6"/></svg>,
  trendUp: (p) => <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 17l6-6 4 4 8-8"/><path d="M21 7v5h-5"/></svg>,
  gauge: (p) => <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 13l4-4"/><path d="M3.5 18a9 9 0 1 1 17 0"/><circle cx="12" cy="13" r="1.4" fill="currentColor" stroke="none"/></svg>,
  handshake: (p) => <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M11 17l-2 2-3-3 2-2"/><path d="M13 7l3-2 5 5-2 2-3-1-4 4-2-2 3-3"/><path d="M3 10l3-3 4 1"/></svg>,
  leaf: (p) => <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/></svg>,
  arrow: (p) => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12h14M13 6l6 6-6 6"/></svg>,
  arrowUR: (p) => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M7 17L17 7M8 7h9v9"/></svg>,
  check: (p) => <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 6L9 17l-5-5"/></svg>,
  x: (p) => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M18 6L6 18M6 6l12 12"/></svg>,
  plus: (p) => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 5v14M5 12h14"/></svg>,
  search: (p) => <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>,
  sun: (p) => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"/></svg>,
  moon: (p) => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.5 6.5 0 0 0 9.8 9.8z"/></svg>,
  doc: (p) => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg>,
  download: (p) => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3v12M7 11l5 5 5-5M5 21h14"/></svg>,
  bolt: (p) => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M13 2L4 14h6l-1 8 9-12h-6z"/></svg>,
  shield: (p) => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/></svg>,
  battery: (p) => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="2" y="8" width="17" height="9" rx="2"/><path d="M22 11v3"/><path d="M6 12.5l2.5-2 -1 3 2.5-2"/></svg>,
  wind: (p) => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 8h11a3 3 0 1 0-3-3M3 12h16a3 3 0 1 1-3 3M3 16h8a2.5 2.5 0 1 1-2.5 2.5"/></svg>,
  bell: (p) => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M10.3 21a2 2 0 0 0 3.4 0"/></svg>,
  pin: (p) => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.4"/></svg>,
  menu: (p) => <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" {...p}><path d="M3 6h18M3 12h18M3 18h18"/></svg>,
  compass: (p) => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/></svg>,
  arrowDown: (p) => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 5v14M6 13l6 6 6-6"/></svg>,
  link: (p) => <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M10 13a5 5 0 0 0 7.07 0l2.12-2.12a5 5 0 0 0-7.07-7.07L10.5 5.5"/><path d="M14 11a5 5 0 0 0-7.07 0L4.8 13.1a5 5 0 0 0 7.07 7.07L13.5 18.5"/></svg>,
  award: (p) => <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="9" r="6"/><path d="M9 14.5L7.5 22l4.5-2.5L16.5 22 15 14.5"/></svg>,
  linkedin: (p) => <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...p}><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.5 8.65 21 11.1 21 14.3V21h-4v-5.9c0-1.4-.03-3.2-1.95-3.2-1.95 0-2.25 1.52-2.25 3.1V21H9z"/></svg>,
  instagram: (p) => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none"/></svg>,
  twitterx: (p) => <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...p}><path d="M17.53 3H20.5l-6.49 7.42L21.75 21h-5.96l-4.67-6.1L5.77 21H2.8l6.94-7.93L2.25 3h6.11l4.22 5.58zM16.48 19.2h1.65L7.6 4.7H5.83z"/></svg>,
};

/* ---------- shared form validators ---------- */
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((v || "").trim());
const isPhone = (v) => /^\+?\d{10,13}$/.test((v || "").replace(/[\s\-()]/g, ""));
const isFilled = (v) => !!(v && String(v).trim().length);

/* logo mark — abstract "I" + sun/wind motif */
function LogoMark({ size = 30 }) {
  return (
    <svg className="logo-mark" viewBox="0 0 32 32" width={size} height={size} aria-hidden="true">
      <rect x="2" y="2" width="28" height="28" rx="8" fill="var(--navy)"/>
      <circle cx="16" cy="16" r="6" fill="none" stroke="var(--amber)" strokeWidth="2"/>
      <path d="M16 4v4M16 24v4M4 16h4M24 16h4" stroke="var(--amber)" strokeWidth="2" strokeLinecap="round"/>
      <path d="M16 13v6" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"/>
    </svg>
  );
}

/* ---------- sparkline ---------- */
function Sparkline({ data, w = 320, h = 60, color = "#6D4AFF", fill = true }) {
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((d, i) => [ (i/(data.length-1))*w, h - ((d-min)/(max-min || 1))*(h-8) - 4 ]);
  const line = pts.map((p,i)=> (i?"L":"M")+p[0].toFixed(1)+" "+p[1].toFixed(1)).join(" ");
  const area = `${line} L ${w} ${h} L 0 ${h} Z`;
  const id = useMemo(()=>"sg"+Math.random().toString(36).slice(2,7),[]);
  return (
    <svg className="spark-svg" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={color} stopOpacity="0.28"/>
        <stop offset="1" stopColor={color} stopOpacity="0"/>
      </linearGradient></defs>
      {fill && <path d={area} fill={`url(#${id})`}/>}
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="3" fill={color}/>
    </svg>
  );
}

/* ---------- live MW counter (homepage card) ---------- */
function LiveCounter() {
  const [mw, setMw] = useState(42.8);
  const [ago, setAgo] = useState(12);
  const [pulse, setPulse] = useState(false);
  const [curve, setCurve] = useState(() => {
    // a day generation curve, ramps up midday
    return Array.from({length: 32}, (_,i) => {
      const x = i/31; const bell = Math.exp(-Math.pow((x-0.52)*3.1,2));
      return +(bell*44 + Math.random()*3).toFixed(1);
    });
  });
  const [co2Ref, co2] = useCountUp(184500, { dur: 1800 });

  useEffect(() => {
    const id = setInterval(() => {
      setMw(v => {
        const nv = Math.max(38, Math.min(47, v + (Math.random()-0.45)*1.4));
        return +nv.toFixed(1);
      });
      setAgo(0); setPulse(true); setTimeout(()=>setPulse(false), 700);
    }, 4200);
    const id2 = setInterval(()=> setAgo(a => a+1), 1000);
    return () => { clearInterval(id); clearInterval(id2); };
  }, []);

  const wind = (mw * 0.42), solar = (mw * 0.58), bess = 68;
  return (
    <div className="counter-card">
      <VideoBG src={VID.grid} poster={IMG.solarAerial} overlay="linear-gradient(125deg, rgba(8,23,42,.78) 40%, rgba(8,23,42,.55) 100%)"/>
      <div className="cc-head">
        <span className="cc-live"><span className="pulse-dot"></span> Live · 33 plants</span>
        <span className="t3" style={{color:"#8AA0B8", fontSize:12}}>Energy Intelligence Platform</span>
      </div>
      <div style={{marginTop:20, transition:"transform .3s", transform: pulse?"scale(1.015)":"none"}}>
        <div className="cc-big cc-n1 num" style={{color: pulse ? "var(--accent)" : "#fff", transition:"color .4s"}}>
          {mw.toFixed(1)}<span className="cc-unit">MW</span>
        </div>
        <div className="cc-label">being generated right now across 33 hybrid plants</div>
      </div>

      <div className="cc-sources">
        {[
          { k:"Wind", v:wind.toFixed(1)+" MW", pct:42, c:"#3E92DD" },
          { k:"Solar", v:solar.toFixed(1)+" MW", pct:58, c:"#F5B81C" },
          { k:"Storage", v:bess+"%", pct:bess, c:"#5DCAA5" },
        ].map((s,i)=>(
          <div className="cc-src" key={i}>
            <div className="cc-src-top"><span className="cc-src-k">{s.k}</span><span className="cc-src-v num">{s.v}</span></div>
            <div className="cc-src-bar"><div style={{ width:s.pct+"%", background:s.c }}></div></div>
          </div>
        ))}
      </div>

      <div className="cc-divider"></div>
      <div className="cc-co2row">
        <div>
          <div ref={co2Ref} className="cc-big cc-n2 num">
            {co2}<span className="cc-unit">tCO₂e</span>
          </div>
          <div className="cc-label">carbon avoided this year · ≈ 1.4M trees</div>
        </div>
        <Sparkline data={curve} w={150} h={48} color="#5DCAA5"/>
      </div>
      <div className="cc-foot">
        <span><span className="pulse-dot" style={{background:"var(--accent)"}}></span> Updated {ago === 0 ? "just now" : ago + "s ago"}</span>
        <span className="cc-foot-link">Open live platform {I.arrow({width:14,height:14})}</span>
      </div>
    </div>
  );
}
/* fix: co2 ref attach */
LiveCounter.displayName = "LiveCounter";

/* ---------- cost curve chart (prop-driven, animates on recalc) ---------- */
function CostCurveChart({ gridStart = 7.0, gridEnd = 9.8, target = 3.2, saveLabel = null }) {
  const [ref, seen] = useInView();
  const w = 560, h = 320, pad = { l: 46, r: 22, t: 28, b: 40 };
  const years = [0,1,2,3,4,5];
  // grid tariff climbs from now → yr5; Integrum drops to target by yr1 then eases lower
  const before = years.map(i => +(gridStart + (gridEnd - gridStart) * (i / 5)).toFixed(2));
  const after = years.map(i => i === 0 ? +gridStart.toFixed(2) : +(target + (gridStart - target) * Math.max(0, (1 - i)) * 0 + (i === 1 ? 0.9 : i === 2 ? 0.4 : i === 3 ? 0.2 : i === 4 ? 0.1 : 0)).toFixed(2));
  const maxY = Math.max(10, Math.ceil(gridEnd + 1)), minY = 0;
  const X = (i)=> pad.l + (i/5)*(w-pad.l-pad.r);
  const Y = (v)=> pad.t + (1-(v-minY)/(maxY-minY))*(h-pad.t-pad.b);
  const path = (arr)=> arr.map((v,i)=>(i?"L":"M")+X(i).toFixed(1)+" "+Y(v).toFixed(1)).join(" ");
  const gap = `${path(before)} L ${X(5)} ${Y(after[5])} ${after.slice().reverse().map((v,i)=>"L "+X(5-i)+" "+Y(v)).join(" ")} Z`;
  const dash = seen ? 0 : 1600;
  const ticks = []; for (let v=0; v<=maxY; v+=2) ticks.push(v);
  return (
    <svg ref={ref} viewBox={`0 0 ${w} ${h}`} style={{width:"100%", height:"auto", display:"block"}}>
      <defs>
        <linearGradient id="savefill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F5B81C" stopOpacity="0.34"/>
          <stop offset="1" stopColor="#1F8F63" stopOpacity="0.08"/>
        </linearGradient>
        <linearGradient id="afterline" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#014976"/><stop offset="1" stopColor="#1F8F63"/>
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      {ticks.map(v=>(
        <g key={v}>
          <line x1={pad.l} y1={Y(v)} x2={w-pad.r} y2={Y(v)} stroke="var(--hairline)" strokeWidth="1"/>
          <text x={pad.l-10} y={Y(v)+4} textAnchor="end" fontSize="11" fill="var(--ink-3)" className="num">₹{v}</text>
        </g>
      ))}
      {years.map(i=>(
        <line key={"v"+i} x1={X(i)} y1={pad.t} x2={X(i)} y2={h-pad.b} stroke="var(--hairline)" strokeWidth="1" opacity="0.5"/>
      ))}
      {years.map(i=>(
        <text key={i} x={X(i)} y={h-14} textAnchor="middle" fontSize="11" fill="var(--ink-3)">{i===0?"Now":"Yr "+i}</text>
      ))}
      <path d={gap} fill="url(#savefill)" opacity={seen?1:0} style={{transition:"opacity .8s .4s"}}/>
      {saveLabel && <text x={(X(2)+X(4))/2} y={Y((before[3]+after[3])/2)} textAnchor="middle" fontSize="15" fontWeight="800" fill="#146B49" opacity={seen?1:0} style={{transition:"opacity .6s .9s"}}>{saveLabel}</text>}
      <text x={(X(2)+X(4))/2} y={Y((before[3]+after[3])/2)+ (saveLabel?18:0)} textAnchor="middle" fontSize="12" fontWeight="700" fill="#146B49" opacity={seen?0.9:0} style={{transition:"opacity .6s 1s"}}>Your savings zone</text>
      {/* grid tariff (rising cost) */}
      <path d={path(before)} fill="none" stroke="#C25A3E" strokeWidth="2.4" strokeDasharray="6 5"
            style={{strokeDashoffset:dash, transition:"stroke-dashoffset 1.4s ease"}}/>
      <circle cx={X(5)} cy={Y(before[5])} r="4" fill="#C25A3E"/>
      <text x={X(5)-6} y={Y(before[5])-10} textAnchor="end" fontSize="11.5" fontWeight="700" fill="#A9432B">Grid: ₹{gridEnd.toFixed(1)}</text>
      {/* Integrum tariff (falling) */}
      <path d={path(after)} fill="none" stroke="url(#afterline)" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)"
            pathLength="1" style={{strokeDasharray:1, strokeDashoffset: seen?0:1, transition:"stroke-dashoffset 1.5s ease"}}/>
      {after.map((v,i)=>(<circle key={i} cx={X(i)} cy={Y(v)} r="3.4" fill="#146B49" opacity={seen?1:0} style={{transition:`opacity .3s ${0.5+i*0.12}s`}}/>))}
      <circle cx={X(5)} cy={Y(after[5])} r="7" fill="none" stroke="#1F8F63" strokeWidth="2" opacity={seen?1:0} style={{transition:"opacity .4s 1.1s"}}/>
      <text x={X(5)-6} y={Y(after[5])+22} textAnchor="end" fontSize="11.5" fontWeight="800" fill="#146B49">Integrum: ₹{target.toFixed(1)}</text>
    </svg>
  );
}

/* ---------- 24h generation area (dashboard) ---------- */
function GenerationChart({ color = "#18A0B8" }) {
  const data = useMemo(()=> Array.from({length:48},(_,i)=>{
    const x=i/47; const bell=Math.exp(-Math.pow((x-0.5)*3.3,2));
    return +(bell*5.4 + Math.random()*0.3).toFixed(2);
  }),[]);
  const w=600,h=200,pad=28;
  const max=6;
  const X=(i)=>pad+(i/(data.length-1))*(w-pad*1.4);
  const Y=(v)=>h-24-(v/max)*(h-44);
  const line=data.map((v,i)=>(i?"L":"M")+X(i).toFixed(1)+" "+Y(v).toFixed(1)).join(" ");
  const area=`${line} L ${X(data.length-1)} ${h-24} L ${X(0)} ${h-24} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{width:"100%",height:"auto"}}>
      <defs><linearGradient id="genf" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={color} stopOpacity="0.26"/><stop offset="1" stopColor={color} stopOpacity="0"/>
      </linearGradient></defs>
      {[0,2,4,6].map(v=>(<g key={v}><line x1={pad} y1={Y(v)} x2={w-pad*0.4} y2={Y(v)} stroke="var(--hairline)"/>
        <text x={pad-6} y={Y(v)+3} textAnchor="end" fontSize="10" fill="var(--ink-3)" className="num">{v}</text></g>))}
      {["00","06","12","18","24"].map((t,i)=>(<text key={t} x={pad+(i/4)*(w-pad*1.4)} y={h-8} textAnchor="middle" fontSize="10" fill="var(--ink-3)">{t}:00</text>))}
      <path d={area} fill="url(#genf)"/>
      <path d={line} fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ---------- India map from real Natural Earth geometry (d3-geo + TopoJSON) ---------- */
const INDIA_W = 400, INDIA_H = 460;
const INDIA_VB = `0 0 ${INDIA_W} ${INDIA_H}`;
const TOPO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json";
/* project sites by real coordinates — projected with the same projection as the outline */
const PROJECT_REGIONS = [
  { name: "Maharashtra", lng: 75.4, lat: 19.4, n: 12, color: "#005B96", off: [[16,-12],[-12,10],[8,20]] },
  { name: "Karnataka",   lng: 76.2, lat: 14.8, n: 14, color: "#0A6FB0", off: [[14,-10],[-10,12],[6,20]] },
  { name: "Tamil Nadu",  lng: 78.3, lat: 11.0, n: 7,  color: "#1D9E75", off: [[10,-9],[-8,11]] },
];

let _indiaGeoCache = null;
function useIndiaGeo() {
  const [geo, setGeo] = useState(_indiaGeoCache);
  useEffect(()=>{
    if (_indiaGeoCache) { setGeo(_indiaGeoCache); return; }
    let alive = true;
    (async ()=>{
      try {
        if (!window.d3 || !window.topojson) return;
        const topo = await fetch(TOPO_URL).then(r=>r.json());
        const fc = window.topojson.feature(topo, topo.objects.countries);
        const india = fc.features.find(f => f.id === "356" || f.properties?.name === "India");
        if (!india) return;
        const proj = window.d3.geoMercator().fitExtent([[10,10],[INDIA_W-10,INDIA_H-10]], india);
        const d = window.d3.geoPath(proj)(india);
        const pins = PROJECT_REGIONS.map(r=>{ const [x,y] = proj([r.lng, r.lat]); return { ...r, x, y }; });
        _indiaGeoCache = { d, pins };
        if (alive) setGeo(_indiaGeoCache);
      } catch (e) { /* map stays empty rather than showing wrong geography */ }
    })();
    return ()=>{ alive = false; };
  },[]);
  return geo;
}

function IndiaMap({ height = 380, interactive = true }) {
  const [hover, setHover] = useState(null);
  const geo = useIndiaGeo();
  const pins = geo ? geo.pins : [];
  return (
    <div className="map-wrap" style={{height}}>
      <svg viewBox={INDIA_VB} preserveAspectRatio="xMidYMid meet" style={{width:"100%", height:"100%", overflow:"visible"}}>
        {geo && <path d={geo.d} fill="var(--amber-soft)" stroke="color-mix(in srgb, var(--accent) 50%, transparent)" strokeWidth="1.2" strokeLinejoin="round"/>}
        {pins.map(r=>(
          <circle key={r.name} cx={r.x} cy={r.y} r={hover===r.name?34:24} fill={r.color} opacity={hover===r.name?0.20:0.10} style={{transition:"r .3s ease, opacity .3s ease"}}/>
        ))}
        {pins.map(r=>(
          <g key={r.name+"p"} className="map-pin"
             onMouseEnter={()=> interactive && setHover(r.name)}
             onMouseLeave={()=> interactive && setHover(null)}>
            {r.off.map((o,j)=>(<circle key={j} cx={r.x+o[0]} cy={r.y+o[1]} r="2.6" fill={r.color} opacity="0.5"/>))}
            <circle cx={r.x} cy={r.y} r="6" fill={r.color} stroke="#fff" strokeWidth="2"/>
          </g>
        ))}
      </svg>
      {hover && (()=>{ const r=pins.find(x=>x.name===hover);
        return <div className="map-tooltip" style={{left:`${(r.x/INDIA_W)*100}%`, top:`${(r.y/INDIA_H)*100}%`}}>
          <div className="mt-t">{r.name}</div><div className="mt-m num">{r.n} hybrid projects</div>
        </div>; })()}
    </div>
  );
}

/* ---------- elegant DARK projects map (glowing India silhouette + pins) ---------- */
function ProjectsMapDark({ height = 420 }) {
  const [hover, setHover] = useState(null);
  const geo = useIndiaGeo();
  const glows = ["#5FE0B5", "#F0C000", "#4AA8E8"];
  const regions = (geo ? geo.pins : []).map((r, i) => ({ ...r, glow: glows[i] || "#5FE0B5" }));
  return (
    <div className="map-wrap" style={{ height }}>
      <svg viewBox={INDIA_VB} preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%", overflow: "visible" }}>
        <defs>
          <filter id="pinglow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="3.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          {glows.map((g, i) => (<radialGradient id={`halo${i}`} key={i}><stop offset="0" stopColor={g} stopOpacity="0.42"/><stop offset="100%" stopColor={g} stopOpacity="0"/></radialGradient>))}
        </defs>
        {geo && <path d={geo.d} fill="rgba(120,175,225,.09)" stroke="rgba(140,190,235,.50)" strokeWidth="1.2" strokeLinejoin="round"/>}
        {regions.map((rg, i) => (<circle key={i} cx={rg.x} cy={rg.y} r={hover === rg.name ? 46 : 36} fill={`url(#halo${i})`} style={{ transition: "r .3s ease" }}/>))}
        {regions.map((rg) => (
          <g key={rg.name+"p"} className="map-pin" onMouseEnter={() => setHover(rg.name)} onMouseLeave={() => setHover(null)} style={{ cursor: "pointer" }}>
            {rg.off.map((o,j)=>(<rect key={j} x={rg.x+o[0]-4} y={rg.y+o[1]-4} width="8" height="8" rx="2" fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.6)" strokeWidth="1.1"/>))}
            <rect x={rg.x-8} y={rg.y-8} width="16" height="16" rx="3" fill={rg.glow} filter="url(#pinglow)"/>
          </g>
        ))}
      </svg>
      {hover && (() => { const r = regions.find(x => x.name === hover);
        return <div className="map-tooltip" style={{ left: `${(r.x/INDIA_W)*100}%`, top: `${(r.y/INDIA_H)*100}%` }}><div className="mt-t">{r.name}</div><div className="mt-m num">{r.n} hybrid projects</div></div>; })()}
    </div>
  );
}

/* ---------- donut / revenue mix ---------- */
function Donut({ segments, size = 150, thickness = 22, center }) {
  const r = (size - thickness)/2; const c = 2*Math.PI*r; let off = 0;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{transform:"rotate(-90deg)"}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--hairline)" strokeWidth={thickness}/>
      {segments.map((s,i)=>{ const len=(s.v/100)*c; const el=
        <circle key={i} cx={size/2} cy={size/2} r={r} fill="none" stroke={s.color} strokeWidth={thickness}
          strokeDasharray={`${len} ${c-len}`} strokeDashoffset={-off} strokeLinecap="butt"/>; off+=len; return el; })}
      {center && <g transform={`rotate(90 ${size/2} ${size/2})`}><text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central" fontFamily="var(--font-display)" fontSize="22" fontWeight="600" fill="var(--ink)">{center}</text></g>}
    </svg>
  );
}

/* ---------- bess ring ---------- */
function BessRing({ pct = 68, size = 96 }) {
  const r=(size-14)/2, c=2*Math.PI*r;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--hairline)" strokeWidth="10"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--green)" strokeWidth="10" strokeLinecap="round"
        strokeDasharray={`${(pct/100)*c} ${c}`} transform={`rotate(-90 ${size/2} ${size/2})`}/>
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central" fontFamily="var(--font-display)" fontSize="22" fontWeight="600" fill="var(--ink)" className="num">{pct}%</text>
    </svg>
  );
}

/* ---------- energy imagery (hotlinked, navy-overlaid for legibility) ---------- */
const U = (id, w = 1600, q = 72) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=${q}`;
const IMG = {
  solarAerial: U("1509391366360-2e959784a276"),
  wind:        U("1466611653911-95081537e5b7"),
  solarClose:  U("1508514177221-188b1cf16e9d"),
  windSingle:  U("1548337138-e87d889cc369"),
  storage:     U("1610028290816-5d937a395a49"),
  team:        U("1559302504-64aae6ca6b6d"),
  windField:   U("1497435334941-8c899ee9e8e9"),
  industrial:  U("1581092160562-40aa08e78837"),
  steelPlant:  "assets/steel-plant.jpeg",
  commercialSolar: U("1613665813446-82a78c468a1d"),
  heroField:   U("1548337138-e87d889cc369"),
  meadow:      U("1466611653911-95081537e5b7"),
};
// absolutely-positioned photo layer with overlay; drop inside a position:relative parent
function PhotoBG({ src, overlay, pos = "center", style }) {
  const ov = overlay || "linear-gradient(180deg, rgba(8,23,42,.82), rgba(8,23,42,.93))";
  return (
    <div aria-hidden="true" className="photo-bg" style={style}>
      <div className="photo-bg-img" style={{ backgroundImage: `url(${src})`, backgroundPosition: pos }} />
      <div className="photo-bg-ov" style={{ background: ov }} />
    </div>
  );
}
// looping muted background video with overlay + poster fallback; plays when on-screen.
// Pass a single `src`, OR `srcs={[a,b,...]}` to play clips in sequence and loop the whole set.
// Background video. `src` for one clip, or `srcs={[a,b,...]}` to play clips as one
// continuous sequence. `starts={[s,...]}` skips that many seconds into each clip.
// Two stacked <video>s crossfade, so no poster ever flashes between clips.
function VideoBG({ src, srcs, starts, poster, overlay, style }) {
  const list = (srcs && srcs.length) ? srcs : [src];
  const multi = list.length > 1;
  const offs = starts || [];
  const ov = overlay || "linear-gradient(155deg, rgba(8,23,42,.90), rgba(11,31,58,.95))";
  const aRef = useRef(null), bRef = useRef(null);
  const [front, setFront] = useState(0);          // which element is visible: 0=a, 1=b
  const [ready, setReady] = useState(false);       // first frame painted → drop the poster
  const idxRef = useRef(0);                        // clip index currently on the front element
  const busyRef = useRef(false);                   // a transition is in flight → ignore stray events

  const seekStart = (v, i) => { try { v.currentTime = offs[i] || 0; } catch(e){} };
  const kick = (v) => { v.muted = true; v.defaultMuted = true; const p = v.play(); if (p && p.catch) p.catch(()=>{}); };
  // load a clip into an element without disturbing anything that's visible
  const warm = (v, i) => {
    if (!v || !multi) return;
    const url = list[i];
    if (v.dataset.clip === String(i) && v.readyState >= 2) return;
    v.dataset.clip = String(i);
    v.src = url; v.preload = "auto"; v.load();
  };

  // boot the first clip on the A element, then warm clip 2 onto B
  useEffect(() => {
    const a = aRef.current; if (!a) return;
    a.dataset.clip = "0";
    a.src = list[0];
    a.load();
    const onLoaded = () => {
      seekStart(a, 0); kick(a); setReady(true);
      if (multi) warm(bRef.current, 1 % list.length);
    };
    a.addEventListener("loadeddata", onLoaded);
    return () => a.removeEventListener("loadeddata", onLoaded);
  }, []);

  // pause when off-screen
  useEffect(() => {
    const host = aRef.current && aRef.current.parentNode; if (!host) return;
    const io = new IntersectionObserver(([e]) => {
      [aRef.current, bRef.current].forEach(v => {
        if (!v) return;
        if (e.isIntersecting) { if (v === (front ? bRef.current : aRef.current)) kick(v); }
        else v.pause();
      });
    }, { threshold: 0.05 });
    io.observe(host);
    return () => io.disconnect();
  }, [front]);

  // when the visible clip ends, crossfade to the other element with the next clip.
  // The outgoing element is left completely untouched until the fade has finished.
  const handleEnded = (which) => () => {
    if (!multi) return;
    if (which !== front) return;            // stray event from the hidden element
    if (busyRef.current) return;            // already transitioning
    busyRef.current = true;
    const cur = which === 0 ? aRef.current : bRef.current;
    const nxt = which === 0 ? bRef.current : aRef.current;
    if (!nxt) { busyRef.current = false; return; }
    const nextIdx = (idxRef.current + 1) % list.length;
    const afterIdx = (nextIdx + 1) % list.length;
    const start = () => {
      idxRef.current = nextIdx;
      seekStart(nxt, nextIdx);
      kick(nxt);
      setFront(which === 0 ? 1 : 0);
      // only once the crossfade is over: stop the old clip and give it the NEXT one
      setTimeout(() => {
        if (cur) { cur.pause(); warm(cur, afterIdx); }
        busyRef.current = false;
      }, 700);
    };
    if (nxt.dataset.clip === String(nextIdx) && nxt.readyState >= 2) start();
    else {
      warm(nxt, nextIdx);
      const once = () => { nxt.removeEventListener("loadeddata", once); start(); };
      nxt.addEventListener("loadeddata", once);
    }
  };

  const vStyle = (mine) => ({ opacity: front === mine ? 1 : 0, transition: "opacity .6s ease" });
  return (
    <div aria-hidden="true" className="photo-bg" style={style}>
      {poster && !ready && <div className="photo-bg-img" style={{ backgroundImage: `url(${poster})`, backgroundPosition: "center" }} />}
      <video ref={aRef} className="video-bg-el" style={vStyle(0)} muted playsInline
        loop={!multi} preload="auto" onEnded={handleEnded(0)} onError={handleEnded(0)} />
      <video ref={bRef} className="video-bg-el" style={vStyle(1)} muted playsInline
        preload="auto" onEnded={handleEnded(1)} onError={handleEnded(1)} />
      <div className="photo-bg-ov" style={{ background: ov }} />
    </div>
  );
}

const VID = {
  grid:    "https://videos.pexels.com/video-files/3129957/3129957-hd_1920_1080_25fps.mp4",  // glowing network globe (HD — smoother loop)
  circuit: "https://videos.pexels.com/video-files/2792370/2792370-hd_1920_1080_30fps.mp4",   // energy circuitry
  solar:   "https://videos.pexels.com/video-files/7442016/7442016-hd_1920_1080_25fps.mp4",   // drone over solar farm
  wind:    "https://videos.pexels.com/video-files/9789422/9789422-hd_1920_1080_30fps.mp4",   // desert wind turbines
  // real Integrum site footage — played in sequence as one continuous loop
  site:    ["assets/site-1.mp4", "assets/site-2.mp4", "assets/site-3.mp4"],
};

Object.assign(window, {
  React, useState, useEffect, useRef, useMemo,
  useInView, Reveal, useCountUp, I, LogoMark,
  Sparkline, LiveCounter, CostCurveChart, GenerationChart, IndiaMap, Donut, BessRing,
  IMG, VID, PhotoBG, VideoBG, ProjectsMapDark,
  isEmail, isPhone, isFilled,
});
