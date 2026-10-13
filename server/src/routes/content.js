import { Router } from "express";
import { pool } from "../db/pool.js";
import { CONTENT_KEYS } from "../cms/keys.js";

export const contentRouter = Router();

// Public: every published content document, as { key: data }. The site
// fetches this once on load. Keys with nothing published yet are simply
// absent, and the site falls back to the content built into the bundle.
contentRouter.get("/", async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      "SELECT key, published FROM cms_content WHERE published IS NOT NULL AND key = ANY($1)",
      [CONTENT_KEYS]
    );
    const content = Object.fromEntries(rows.map((r) => [r.key, r.published]));
    // Browsers may keep a copy but must re-check it on every load. Express's
    // ETag turns an unchanged re-check into a tiny 304, and a publish shows
    // up on the very next page load.
    res.setHeader("Cache-Control", "no-cache");
    return res.json({ ok: true, content });
  } catch (err) {
    return next(err);
  }
});
