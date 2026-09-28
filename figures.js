/* ============================================================
   figures.js — company figures: DEFINE ONCE, reference everywhere.

   This is a PLAIN script loaded before everything else, because plain
   <script src> files execute before Babel transpiles the .jsx files —
   so a definition inside a JSX module would not exist yet for ir-data.js.

   Never restate one of these numbers inline. Change it here and it updates
   the home hero band, the Company page, the Impact section and the investor
   snapshot together. Three separate defects were caused by the same figure
   being hand-copied into sibling arrays; this object exists to prevent that.
   ============================================================ */
window.FIG = {
  greenUnitsMn:  "876",              // mn kWh cumulative (87,63,59,709 kWh)
  co2Total:      "6,22,215",         // tonnes, cumulative
  co2LatestFY:   "2,17,435",         // tonnes, FY25-26
  commissioned:  "264+",              // MW operating
  ongoing:       "351+",              // MW under development
  hybrid:        "155",              // MW hybrid capacity (85 MW hybrid + 70 MW hybridisation)
  partners:      "34",               // customers served
  states:        "4",                // states with a presence (Tamil Nadu is under development, not yet on the operating map)
};
