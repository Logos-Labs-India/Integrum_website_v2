/* ============================================================
   content/Rich.jsx — renders CMS text with two bits of light formatting,
   so editors never type HTML:

     *phrase*   → <span className={hl}>phrase</span>  (the heading's accent)
     new line   → <br/>

   Everything else is plain text — React escapes it, so content can never
   inject markup or scripts.
   ============================================================ */
import React from "react";

export function Rich({ text, hl = "hl-plain" }) {
  if (text == null) return null;
  const lines = String(text).split("\n");
  return lines.map((line, li) => (
    <React.Fragment key={li}>
      {li > 0 && <br />}
      {line.split(/(\*[^*]+\*)/g).map((part, pi) =>
        part.length > 2 && part.startsWith("*") && part.endsWith("*")
          ? <span key={pi} className={hl}>{part.slice(1, -1)}</span>
          : <React.Fragment key={pi}>{part}</React.Fragment>
      )}
    </React.Fragment>
  ));
}
