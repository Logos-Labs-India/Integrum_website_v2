/* ============================================================
   admin/AdminApp.jsx — the CMS admin at /admin.

   Sign in → pick a page → edit its form → Save draft → Publish.
   Publishing writes the page's JSON to the API; the public site loads it
   on the next visit (see content/cms.js). Layout and design never change
   here — only the content that fills them.
   ============================================================ */
import React, { useState, useEffect, useCallback, useRef } from "react";
import { api, ApiError } from "./api";
import { SCHEMAS, findProblems, resolveSchema } from "./schemas";
import { GroupFields } from "./Fields";
import { loadDefaults } from "../content/cms";
import "./admin.css";

const BASE = import.meta.env.BASE_URL.replace(/\/+$/, "");
const siteUrl = (p = "") => `${BASE}/${p}`.replace(/\/{2,}/g, "/");

function fmt(ts) {
  if (!ts) return "";
  return new Date(ts).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

/* ---------- tiny router: /admin and /admin/edit/<key> ---------- */
function useAdminRoute() {
  const read = () => {
    const m = window.location.pathname.slice(BASE.length).match(/^\/admin\/edit\/([a-z0-9-]+)/i);
    return m ? m[1] : null;
  };
  const [key, setKey] = useState(read);
  useEffect(() => {
    const onPop = () => setKey(read());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  const go = useCallback((k) => {
    window.history.pushState(null, "", siteUrl(k ? `admin/edit/${k}` : "admin"));
    setKey(k);
    window.scrollTo(0, 0);
  }, []);
  return [key, go];
}

/* ---------- sign in ---------- */
function Login({ onSignedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setError("");
    try {
      const { user } = await api("POST", "/auth/login", { email, password });
      onSignedIn(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="adm-center">
      <form className="adm-card adm-auth" onSubmit={submit}>
        <img src={siteUrl("assets/integrum-logo.png")} alt="Integrum Energy" className="adm-logo" />
        <h1>Website admin</h1>
        <p className="adm-help">Sign in to edit the content of integrumenergy.in.</p>
        <label className="adm-label" htmlFor="adm-email">Email</label>
        <input id="adm-email" className="adm-input" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label className="adm-label" htmlFor="adm-pw">Password</label>
        <input id="adm-pw" className="adm-input" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="adm-error-text">{error}</p>}
        <button className="btn btn-primary adm-wide" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
        <p className="adm-help adm-fine">Forgotten your password? Ask a site administrator to reset it.</p>
      </form>
    </div>
  );
}

/* ---------- change password (forced on first sign-in) ---------- */
function ChangePassword({ user, forced, onDone, onCancel }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    if (next !== confirm) { setError("The new passwords don't match."); return; }
    setBusy(true); setError("");
    try {
      const res = await api("POST", "/auth/password", { currentPassword: current, newPassword: next });
      onDone(res.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="adm-center">
      <form className="adm-card adm-auth" onSubmit={submit}>
        <h1>{forced ? "Choose your password" : "Change password"}</h1>
        <p className="adm-help">{forced
          ? `Welcome, ${user.name}. Replace the one-time password you were given with your own.`
          : "Signing in elsewhere will end once you change it."}</p>
        <label className="adm-label" htmlFor="pw-cur">{forced ? "One-time password" : "Current password"}</label>
        <input id="pw-cur" className="adm-input" type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} required />
        <label className="adm-label" htmlFor="pw-new">New password</label>
        <input id="pw-new" className="adm-input" type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} required minLength={12} />
        <p className="adm-help">At least 12 characters, with letters and numbers.</p>
        <label className="adm-label" htmlFor="pw-confirm">Confirm new password</label>
        <input id="pw-confirm" className="adm-input" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
        {error && <p className="adm-error-text">{error}</p>}
        <button className="btn btn-primary adm-wide" disabled={busy}>{busy ? "Saving…" : "Save password"}</button>
        {!forced && <button type="button" className="btn btn-ghost adm-wide" onClick={onCancel}>Cancel</button>}
      </form>
    </div>
  );
}

/* ---------- top bar ---------- */
function TopBar({ user, onHome, onPassword, onSignOut }) {
  return (
    <header className="adm-top">
      <button className="adm-brand" onClick={onHome}>
        <img src={siteUrl("assets/integrum-logo.png")} alt="" /> <span>Website admin</span>
      </button>
      <div className="adm-top-right">
        <a className="adm-link" href={siteUrl("")} target="_blank" rel="noreferrer">View site ↗</a>
        <span className="adm-user">{user.name} · {user.role === "publisher" ? "Publisher" : "Editor"}</span>
        <button className="btn btn-ghost adm-sm" onClick={onPassword}>Password</button>
        <button className="btn btn-ghost adm-sm" onClick={onSignOut}>Sign out</button>
      </div>
    </header>
  );
}

/* ---------- dashboard: the list of editable pages ---------- */
function Dashboard({ onOpen }) {
  const [docs, setDocs] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    api("GET", "/content").then((r) => setDocs(r.docs)).catch((e) => setError(e.message));
  }, []);
  return (
    <main className="adm-main">
      <h1 className="adm-h1">Pages</h1>
      <p className="adm-help">Choose what to edit. Changes stay as a draft until a publisher publishes them.</p>
      {error && <p className="adm-error-text">{error}</p>}
      {!docs && !error && <p className="adm-help">Loading…</p>}
      <div className="adm-cards">
        {docs?.map((d) => {
          const s = SCHEMAS[d.key];
          if (!s) return null;
          return (
            <button key={d.key} className="adm-card adm-doc-card" onClick={() => onOpen(d.key)}>
              <span className="adm-doc-title">{s.title}</span>
              <span className="adm-help">{s.description}</span>
              <span className="adm-doc-status">
                {d.hasUnpublished && <span className="adm-badge is-draft">Unpublished changes</span>}
                {d.publishedAt
                  ? <span className="adm-badge">Published {fmt(d.publishedAt)}{d.publishedBy ? ` by ${d.publishedBy}` : ""}</span>
                  : <span className="adm-badge is-muted">Showing built-in content</span>}
              </span>
            </button>
          );
        })}
      </div>
    </main>
  );
}

/* ---------- history drawer ---------- */
function History({ docKey, canRestore, onRestored, onClose }) {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(null);
  useEffect(() => {
    api("GET", `/content/${docKey}/history`).then((r) => setRows(r.history)).catch((e) => setError(e.message));
  }, [docKey]);
  const restore = async (id) => {
    if (!window.confirm("Put this version live again? It replaces what's published now and becomes the draft.")) return;
    setBusy(id);
    try {
      await api("POST", `/content/${docKey}/revert/${id}`);
      onRestored();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(null);
    }
  };
  return (
    <div className="adm-drawer-back" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <aside className="adm-drawer" role="dialog" aria-label="Publish history">
        <div className="adm-drawer-head">
          <h2>Publish history</h2>
          <button className="btn btn-ghost adm-sm" onClick={onClose}>Close</button>
        </div>
        {error && <p className="adm-error-text">{error}</p>}
        {!rows && !error && <p className="adm-help">Loading…</p>}
        {rows?.length === 0 && <p className="adm-help">Nothing has been published yet.</p>}
        <ul className="adm-history">
          {rows?.map((h, i) => (
            <li key={h.id}>
              <div>
                <strong>{h.action === "revert" ? "Restored an earlier version" : "Published"}</strong>
                {i === 0 && <span className="adm-badge">Live now</span>}
                <div className="adm-help">{fmt(h.created_at)}{h.user_name ? ` · ${h.user_name}` : ""}</div>
              </div>
              {canRestore && i > 0 && (
                <button className="btn btn-ghost adm-sm" disabled={busy != null} onClick={() => restore(h.id)}>
                  {busy === h.id ? "Restoring…" : "Restore"}
                </button>
              )}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

/* ---------- the editor for one page ---------- */
function Editor({ docKey, user, onBack }) {
  const [schema, setSchema] = useState(() => SCHEMAS[docKey]?.root ? SCHEMAS[docKey] : null);
  const [doc, setDoc] = useState(null);           // server state
  const [value, setValue] = useState(null);       // the form's working copy
  const [savedJSON, setSavedJSON] = useState(""); // what's saved as the draft
  const [busy, setBusy] = useState("");
  const [msg, setMsg] = useState(null);           // { kind, text }
  const [showHistory, setShowHistory] = useState(false);
  const isPublisher = user.role === "publisher";

  const load = useCallback(async () => {
    setMsg(null);
    const [{ doc: d }, defaults] = await Promise.all([api("GET", `/content/${docKey}`), loadDefaults()]);
    // Merge over the built-in defaults so fields added to the site after the
    // last publish still show up in the form — one level down too, so a new
    // label inside an existing section (e.g. `text`) is filled in as well.
    const base = defaults[docKey] || {};
    setSchema(resolveSchema(docKey, defaults));
    const saved = d.draft ?? d.published ?? {};
    const isObj = (v) => !!v && typeof v === "object" && !Array.isArray(v);
    const start = { ...base, ...saved };
    for (const k of Object.keys(saved)) {
      if (isObj(base[k]) && isObj(saved[k])) start[k] = { ...base[k], ...saved[k] };
    }
    setDoc(d);
    setValue(start);
    setSavedJSON(JSON.stringify(start));
  }, [docKey]);

  useEffect(() => { load().catch((e) => setMsg({ kind: "error", text: e.message })); }, [load]);

  const dirty = value != null && JSON.stringify(value) !== savedJSON;
  const dirtyRef = useRef(false);
  dirtyRef.current = dirty;
  useEffect(() => {
    const warn = (e) => { if (dirtyRef.current) { e.preventDefault(); e.returnValue = ""; } };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, []);

  if (!SCHEMAS[docKey]) return <main className="adm-main"><p>Unknown page.</p></main>;
  if (!value || !schema) {
    return <main className="adm-main">{msg ? <p className="adm-error-text">{msg.text}</p> : <p className="adm-help">Loading…</p>}</main>;
  }

  const fail = (e) => {
    setMsg({ kind: "error", text: e.message });
    if (e instanceof ApiError && e.code === "conflict") setMsg({ kind: "error", text: e.message, reload: true });
  };

  const save = async () => {
    setBusy("save"); setMsg(null);
    try {
      const { draftRev } = await api("PUT", `/content/${docKey}`, { data: value, rev: doc.draftRev });
      setDoc({ ...doc, draft: value, draftRev, hasUnpublished: true });
      setSavedJSON(JSON.stringify(value));
      setMsg({ kind: "ok", text: isPublisher ? "Draft saved. Publish when you're ready." : "Draft saved. A publisher can now review and publish it." });
      return draftRev;
    } catch (e) {
      fail(e);
      return null;
    } finally {
      setBusy("");
    }
  };

  const publish = async () => {
    const problems = findProblems(schema.root, value);
    if (problems.length) {
      setMsg({ kind: "error", text: "Fix these before publishing:", list: problems.slice(0, 12) });
      return;
    }
    if (!window.confirm("Publish these changes to the live website?")) return;
    let rev = doc.draftRev;
    if (dirty || !doc.draft) {
      rev = await save();
      if (rev == null) return;
    }
    setBusy("publish"); setMsg(null);
    try {
      await api("POST", `/content/${docKey}/publish`, { rev });
      await load();
      setMsg({ kind: "ok", text: "Published. The live site shows the changes from the next page load." });
    } catch (e) {
      fail(e);
    } finally {
      setBusy("");
    }
  };

  const discard = async () => {
    if (!window.confirm("Throw away all unpublished changes and go back to what's live?")) return;
    setBusy("discard"); setMsg(null);
    try {
      await api("POST", `/content/${docKey}/discard`);
      await load();
      setMsg({ kind: "ok", text: "Unpublished changes discarded." });
    } catch (e) {
      fail(e);
    } finally {
      setBusy("");
    }
  };

  const preview = async () => {
    if (dirty && (await save()) == null) return;
    window.open(siteUrl("?cms-preview"), "_blank", "noopener");
  };

  const leave = () => {
    if (dirty && !window.confirm("You have unsaved changes. Leave without saving?")) return;
    onBack();
  };

  const hasUnpublished = dirty || doc.hasUnpublished;

  return (
    <main className="adm-main adm-editor">
      <button className="adm-back" onClick={leave}>← All pages</button>
      <h1 className="adm-h1">{schema.title}</h1>
      <p className="adm-help">{schema.description}</p>
      <p className="adm-status">
        {doc.publishedAt
          ? <>Live version published {fmt(doc.publishedAt)}{doc.publishedBy ? ` by ${doc.publishedBy}` : ""}.</>
          : <>Nothing published yet — the site shows its built-in content.</>}
        {doc.draftUpdatedAt && doc.hasUnpublished && <> Draft saved {fmt(doc.draftUpdatedAt)}{doc.draftUpdatedBy ? ` by ${doc.draftUpdatedBy}` : ""}.</>}
      </p>

      {msg && (
        <div className={"adm-msg is-" + msg.kind} role="status">
          {msg.text}
          {msg.list && <ul>{msg.list.map((p, i) => <li key={i}>{p}</li>)}</ul>}
          {msg.reload && <button className="btn btn-ghost adm-sm" onClick={() => load()}>Reload latest</button>}
        </div>
      )}

      <GroupFields schema={schema.root} value={value} onChange={setValue} />

      <div className="adm-actions">
        <div className="adm-actions-state">
          {dirty ? <span className="adm-badge is-draft">Unsaved changes</span>
            : hasUnpublished ? <span className="adm-badge is-draft">Saved — not published</span>
            : <span className="adm-badge">Up to date with the live site</span>}
        </div>
        <button className="btn btn-ghost" onClick={() => setShowHistory(true)}>History</button>
        {doc.hasUnpublished && doc.published && <button className="btn btn-ghost" disabled={!!busy} onClick={discard}>Discard changes</button>}
        <button className="btn btn-ghost" disabled={!!busy} onClick={preview}>Preview</button>
        <button className="btn btn-ghost" disabled={!!busy || !dirty} onClick={save}>{busy === "save" ? "Saving…" : "Save draft"}</button>
        {isPublisher && (
          <button className="btn btn-primary" disabled={!!busy || !hasUnpublished} onClick={publish}>
            {busy === "publish" ? "Publishing…" : "Publish"}
          </button>
        )}
      </div>

      {showHistory && (
        <History docKey={docKey} canRestore={isPublisher} onClose={() => setShowHistory(false)}
          onRestored={async () => { setShowHistory(false); await load(); setMsg({ kind: "ok", text: "Earlier version restored and live." }); }} />
      )}
    </main>
  );
}

/* ---------- app shell ---------- */
export function AdminApp() {
  const [user, setUser] = useState(undefined); // undefined = checking, null = signed out
  const [changingPw, setChangingPw] = useState(false);
  const [docKey, go] = useAdminRoute();

  useEffect(() => {
    document.title = "Website admin | Integrum Energy";
    const robots = document.createElement("meta");
    robots.name = "robots"; robots.content = "noindex, nofollow";
    document.head.appendChild(robots);
    api("GET", "/auth/me").then((r) => setUser(r.user)).catch(() => setUser(null));
  }, []);

  const signOut = async () => {
    try { await api("POST", "/auth/logout"); } catch { /* signed out either way */ }
    setUser(null);
    go(null);
  };

  if (user === undefined) return <div className="adm-center"><p className="adm-help">Loading…</p></div>;
  if (!user) return <Login onSignedIn={setUser} />;
  if (user.mustChangePassword || changingPw) {
    return <ChangePassword user={user} forced={user.mustChangePassword}
      onDone={(u) => { setUser(u); setChangingPw(false); }} onCancel={() => setChangingPw(false)} />;
  }

  return (
    <div className="adm">
      <TopBar user={user} onHome={() => go(null)} onPassword={() => setChangingPw(true)} onSignOut={signOut} />
      {docKey ? <Editor key={docKey} docKey={docKey} user={user} onBack={() => go(null)} /> : <Dashboard onOpen={go} />}
    </div>
  );
}
