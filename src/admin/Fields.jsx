/* ============================================================
   admin/Fields.jsx — renders a schema (admin/schemas.js) as a form.
   Every field is controlled: value in, onChange(newValue) out.
   ============================================================ */
import React, { useState } from "react";
import { uploadFile } from "./api";
import { media } from "../dataviz";

let uid = 0;
const nextId = () => `f${++uid}`;

function Label({ field, htmlFor }) {
  return (
    <label className="adm-label" htmlFor={htmlFor}>
      {field.label}{field.required && <span className="adm-req" aria-hidden="true"> *</span>}
    </label>
  );
}

const Help = ({ text }) => (text ? <p className="adm-help">{text}</p> : null);

function FileField({ field, value, onUploaded, onChange, id }) {
  const [state, setState] = useState(null); // null | number (progress) | { error }
  const busy = typeof state === "number";
  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setState(0);
    try {
      const { url, sizeLabel } = await uploadFile(file, (p) => setState(p));
      onUploaded(url, sizeLabel);
      setState(null);
    } catch (err) {
      setState({ error: err.message });
    }
  };
  const name = value ? decodeURIComponent(String(value).split("/").pop()) : "";
  return (
    <div className="adm-file">
      <div className="adm-file-row">
        <input id={id} className="adm-input" value={value || ""} onChange={(e) => onChange(e.target.value)}
               placeholder="Upload a file, or paste a link (https://… or /assets/…)" />
        <label className={"btn btn-ghost adm-upload" + (busy ? " is-busy" : "")}>
          {busy ? `Uploading ${Math.round(state * 100)}%` : value ? "Replace file" : "Upload file"}
          <input type="file" accept={field.accept} onChange={pick} disabled={busy} hidden />
        </label>
        {value && !busy && <a className="adm-link" href={value} target="_blank" rel="noreferrer">Open</a>}
      </div>
      {busy && <div className="adm-progress"><span style={{ width: `${Math.round(state * 100)}%` }} /></div>}
      {state?.error && <p className="adm-error-text">{state.error}</p>}
      {field.image && value && !busy && <img className="adm-thumb" src={media(value)} alt="" />}
      {name && !busy && <p className="adm-help">Current file: {name}</p>}
    </div>
  );
}

/* A single scalar field inside a group. `item` is the whole group value, so
   select options and onChange hooks can depend on sibling fields. */
function ScalarField({ field, item, setItem }) {
  const [id] = useState(nextId);
  const value = item?.[field.name];
  const set = (v) => setItem(field.onChange ? field.onChange(item, v) : { ...item, [field.name]: v });

  if (field.type === "checkbox") {
    const on = field.trueValue !== undefined ? value === field.trueValue : !!value;
    return (
      <div className="adm-field adm-check">
        <label>
          <input type="checkbox" checked={on}
                 onChange={(e) => {
                   const next = { ...item };
                   if (e.target.checked) next[field.name] = field.trueValue ?? true;
                   else delete next[field.name];
                   setItem(next);
                 }} />
          <span>{field.label}</span>
        </label>
        <Help text={field.help} />
      </div>
    );
  }

  let control;
  if (field.type === "textarea") {
    control = <textarea id={id} className="adm-input" rows={field.rows || 4} value={value || ""} onChange={(e) => set(e.target.value)} />;
  } else if (field.type === "select") {
    const options = field.options(item || {});
    const known = options.some((o) => o.value === value);
    control = (
      <select id={id} className="adm-input" value={value ?? ""} onChange={(e) => set(e.target.value)}>
        {(field.allowEmpty || !known) && <option value="">{field.allowEmpty ? "—" : "Choose…"}</option>}
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    );
  } else if (field.type === "file") {
    control = (
      <FileField id={id} field={field} value={value} onChange={set}
        onUploaded={(url, sizeLabel) => setItem({ ...item, [field.name]: url, ...(field.sizeTo ? { [field.sizeTo]: sizeLabel } : {}) })} />
    );
  } else if (field.type === "number") {
    control = (
      <input id={id} className="adm-input" type="number" step="any" value={value ?? ""}
             onChange={(e) => set(e.target.value === "" ? 0 : Number(e.target.value))} />
    );
  } else {
    control = (
      <input id={id} className="adm-input" type={field.type === "date" ? "date" : "text"}
             value={value || ""} placeholder={field.placeholder} onChange={(e) => set(e.target.value)} />
    );
  }
  return (
    <div className={"adm-field" + (field.half ? " is-half" : "")}>
      <Label field={field} htmlFor={id} />
      {control}
      <Help text={field.help} />
    </div>
  );
}

/* A fixed-length row stored as an array, e.g. ["Before", "After"]. */
function TupleFields({ schema, value, onChange }) {
  const row = Array.isArray(value) ? value : [];
  return (
    <div className="adm-group">
      {schema.fields.map((f, i) => (
        <ScalarField key={i} field={{ ...f, name: "v", half: schema.fields.length === 2 }} item={{ v: row[i] }}
          setItem={(o) => { const next = row.slice(); next[i] = o.v; onChange(next); }} />
      ))}
    </div>
  );
}

/* A titled section that can be folded away. Top-level page sections start
   folded so a long page reads as a table of contents. */
function Section({ title, count, help, startOpen, children }) {
  const [open, setOpen] = useState(startOpen);
  return (
    <fieldset className={"adm-section" + (open ? "" : " is-folded")}>
      <legend>
        <button type="button" className="adm-fold" onClick={() => setOpen(!open)} aria-expanded={open}>
          <span className="adm-fold-ic" aria-hidden="true">{open ? "▾" : "▸"}</span>{title}
          {count != null && <span className="adm-count">{count}</span>}
        </button>
      </legend>
      {open && <>{help && <Help text={help} />}{children}</>}
    </fieldset>
  );
}

export function GroupFields({ schema, value, onChange, depth = 0 }) {
  const item = value || {};
  return (
    <div className="adm-group">
      {schema.fields.map((f) => {
        if (f.showIf && !f.showIf(item)) return null;
        if (f.type === "list") {
          return <ListField key={f.name + (f.showIf ? "-list" : "")} schema={f} depth={depth} value={item[f.name] || []} onChange={(v) => onChange({ ...item, [f.name]: v })} />;
        }
        if (f.type === "group") {
          return (
            <Section key={f.name} title={f.label} help={f.help} startOpen={depth > 0}>
              <GroupFields schema={f} depth={depth + 1} value={item[f.name]} onChange={(v) => onChange({ ...item, [f.name]: v })} />
            </Section>
          );
        }
        return <ScalarField key={f.name} field={f} item={item} setItem={onChange} />;
      })}
    </div>
  );
}

function ListField({ schema, value, onChange, depth = 1 }) {
  const [open, setOpen] = useState(null);     // index of the expanded row
  const [filter, setFilter] = useState({});   // { fieldName: value }
  const items = Array.isArray(value) ? value : [];

  const visible = items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => Object.entries(filter).every(([k, v]) => !v || item?.[k] === v));

  const update = (i, v) => onChange(items.map((x, j) => (j === i ? v : x)));
  const remove = (i) => {
    const s = schema.summary ? schema.summary(items[i]).title : `item ${i + 1}`;
    if (!window.confirm(`Remove "${s}"? It disappears from the site when you publish.`)) return;
    onChange(items.filter((_, j) => j !== i));
    setOpen(null);
  };
  const move = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const next = items.slice();
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
    setOpen(open === i ? j : open === j ? i : open);
  };
  const add = () => {
    const blank = schema.newItem ? schema.newItem() : {};
    // Pre-fill the active filter so a new row lands where the editor is looking.
    const seeded = blank && typeof blank === "object" ? { ...blank, ...Object.fromEntries(Object.entries(filter).filter(([, v]) => v)) } : blank;
    if (seeded && typeof seeded === "object" && filter.sec && schema.item.fields) {
      const secField = schema.item.fields.find((f) => f.name === "sec");
      if (secField?.onChange) Object.assign(seeded, secField.onChange(seeded, filter.sec));
    }
    onChange([seeded, ...items]);
    setOpen(0);
  };

  return (
    <Section title={schema.label} count={items.length} help={schema.help} startOpen={depth > 0}>
      <div className="adm-list-bar">
        {(schema.filters || []).map((f) => (
          <select key={f.name} className="adm-input adm-filter" value={filter[f.name] || ""}
                  onChange={(e) => { setFilter({ ...filter, [f.name]: e.target.value }); setOpen(null); }}>
            <option value="">All {f.label.toLowerCase()}s</option>
            {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        ))}
        {!schema.fixed && <button type="button" className="btn btn-primary adm-add" onClick={add}>+ {schema.addLabel || "Add"}</button>}
      </div>
      {visible.length === 0 && <p className="adm-empty">Nothing here yet.</p>}
      <ul className="adm-list">
        {visible.map(({ item, index }) => {
          const sum = schema.summary ? schema.summary(item) : { title: `Item ${index + 1}` };
          const isOpen = open === index;
          return (
            <li key={index} className={"adm-row" + (isOpen ? " is-open" : "")}>
              <div className="adm-row-head">
                <button type="button" className="adm-row-main" onClick={() => setOpen(isOpen ? null : index)} aria-expanded={isOpen}>
                  <span className="adm-row-title">{sum.title}</span>
                  {sum.meta && <span className="adm-row-meta">{sum.meta}</span>}
                </button>
                {!schema.fixed && <div className="adm-row-tools">
                  <button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Move up" title="Move up">↑</button>
                  <button type="button" onClick={() => move(index, 1)} disabled={index === items.length - 1} aria-label="Move down" title="Move down">↓</button>
                  <button type="button" className="adm-del" onClick={() => remove(index)} aria-label="Remove" title="Remove">✕</button>
                </div>}
              </div>
              {isOpen && (
                <div className="adm-row-body">
                  {schema.item.type === "list"
                    ? <ListField schema={schema.item} depth={depth + 1} value={item} onChange={(v) => update(index, v)} />
                    : schema.item.type === "group"
                    ? <GroupFields schema={schema.item} depth={depth + 1} value={item} onChange={(v) => update(index, v)} />
                    : schema.item.type === "tuple"
                      ? <TupleFields schema={schema.item} value={item} onChange={(v) => update(index, v)} />
                      : <ScalarField field={{ ...schema.item, name: "v" }} item={{ v: item }} setItem={(o) => update(index, o.v)} />}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
