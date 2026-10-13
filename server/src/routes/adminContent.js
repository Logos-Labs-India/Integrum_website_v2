import { Router } from "express";
import { pool } from "../db/pool.js";
import { requireAdmin, requirePublisher } from "../auth/session.js";
import { CONTENT_KEYS, isContentKey, validateContent } from "../cms/keys.js";

export const adminContentRouter = Router();
adminContentRouter.use(requireAdmin());

adminContentRouter.param("key", (req, res, next, key) => {
  if (!isContentKey(key)) return res.status(404).json({ ok: false, error: "Unknown content" });
  return next();
});

const META_SQL = `
  SELECT c.key, c.published, c.published_at, pu.name AS published_by,
         c.draft, c.draft_rev, c.draft_updated_at, du.name AS draft_updated_by
    FROM cms_content c
    LEFT JOIN admin_users pu ON pu.id = c.published_by
    LEFT JOIN admin_users du ON du.id = c.draft_updated_by`;

const toDoc = (r) => ({
  key: r.key,
  published: r.published,
  publishedAt: r.published_at,
  publishedBy: r.published_by,
  draft: r.draft,
  draftRev: r.draft_rev,
  draftUpdatedAt: r.draft_updated_at,
  draftUpdatedBy: r.draft_updated_by,
  // Unpublished changes exist when the draft differs from what's live.
  hasUnpublished: r.draft != null && JSON.stringify(r.draft) !== JSON.stringify(r.published),
});

const emptyDoc = (key) => ({
  key, published: null, publishedAt: null, publishedBy: null,
  draft: null, draftRev: 0, draftUpdatedAt: null, draftUpdatedBy: null, hasUnpublished: false,
});

// Overview of every managed document.
adminContentRouter.get("/", async (_req, res, next) => {
  try {
    const { rows } = await pool.query(META_SQL);
    const byKey = Object.fromEntries(rows.map((r) => [r.key, toDoc(r)]));
    const docs = CONTENT_KEYS.map((k) => {
      const d = byKey[k] || emptyDoc(k);
      return { key: d.key, publishedAt: d.publishedAt, publishedBy: d.publishedBy,
               draftUpdatedAt: d.draftUpdatedAt, draftUpdatedBy: d.draftUpdatedBy, hasUnpublished: d.hasUnpublished };
    });
    return res.json({ ok: true, docs });
  } catch (err) {
    return next(err);
  }
});

// Drafts (falling back to published) for every key — used by the
// signed-in preview of the site.
adminContentRouter.get("/preview", async (_req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT key, COALESCE(draft, published) AS data FROM cms_content");
    const content = Object.fromEntries(rows.filter((r) => r.data && isContentKey(r.key)).map((r) => [r.key, r.data]));
    return res.json({ ok: true, content });
  } catch (err) {
    return next(err);
  }
});

adminContentRouter.get("/:key", async (req, res, next) => {
  try {
    const { rows } = await pool.query(`${META_SQL} WHERE c.key = $1`, [req.params.key]);
    return res.json({ ok: true, doc: rows.length ? toDoc(rows[0]) : emptyDoc(req.params.key) });
  } catch (err) {
    return next(err);
  }
});

// Save a draft. `rev` must match the draft the editor started from, so a
// second person's save can't silently overwrite the first one's.
adminContentRouter.put("/:key", async (req, res, next) => {
  const { data, rev } = req.body || {};
  const invalid = validateContent(data);
  if (invalid) return res.status(400).json({ ok: false, error: invalid });

  try {
    const { rows } = await pool.query(
      `INSERT INTO cms_content (key, draft, draft_rev, draft_updated_at, draft_updated_by)
       VALUES ($1, $2, 1, now(), $3)
       ON CONFLICT (key) DO UPDATE
         SET draft = EXCLUDED.draft, draft_rev = cms_content.draft_rev + 1,
             draft_updated_at = now(), draft_updated_by = EXCLUDED.draft_updated_by
         WHERE cms_content.draft_rev = $4
       RETURNING draft_rev`,
      [req.params.key, data, req.admin.id, Number(rev) || 0]
    );
    if (!rows.length) {
      return res.status(409).json({ ok: false, code: "conflict",
        error: "Someone else saved changes to this page while you were editing. Reload to see them before saving again." });
    }
    return res.json({ ok: true, draftRev: rows[0].draft_rev });
  } catch (err) {
    return next(err);
  }
});

// Publish the current draft. `rev` confirms the publisher is publishing
// exactly the version they reviewed.
adminContentRouter.post("/:key/publish", requirePublisher, async (req, res, next) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      "SELECT draft, draft_rev FROM cms_content WHERE key = $1 FOR UPDATE", [req.params.key]
    );
    if (!rows.length || rows[0].draft == null) {
      await client.query("ROLLBACK");
      return res.status(400).json({ ok: false, error: "Nothing to publish — save a draft first" });
    }
    if (rows[0].draft_rev !== Number(req.body?.rev)) {
      await client.query("ROLLBACK");
      return res.status(409).json({ ok: false, code: "conflict",
        error: "The draft changed since you opened it. Reload and review it before publishing." });
    }
    const invalid = validateContent(rows[0].draft);
    if (invalid) {
      await client.query("ROLLBACK");
      return res.status(400).json({ ok: false, error: invalid });
    }
    await client.query(
      "UPDATE cms_content SET published = draft, published_at = now(), published_by = $2 WHERE key = $1",
      [req.params.key, req.admin.id]
    );
    await client.query(
      "INSERT INTO cms_history (key, data, action, user_id) VALUES ($1, $2, 'publish', $3)",
      [req.params.key, rows[0].draft, req.admin.id]
    );
    await client.query("COMMIT");
    return res.json({ ok: true });
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    return next(err);
  } finally {
    client.release();
  }
});

// Throw away unpublished changes: the draft goes back to what's live.
adminContentRouter.post("/:key/discard", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `UPDATE cms_content SET draft = published, draft_rev = draft_rev + 1,
              draft_updated_at = now(), draft_updated_by = $2
        WHERE key = $1 RETURNING draft_rev`,
      [req.params.key, req.admin.id]
    );
    return res.json({ ok: true, draftRev: rows[0]?.draft_rev ?? 0 });
  } catch (err) {
    return next(err);
  }
});

adminContentRouter.get("/:key/history", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT h.id, h.action, h.created_at, u.name AS user_name
         FROM cms_history h LEFT JOIN admin_users u ON u.id = h.user_id
        WHERE h.key = $1 ORDER BY h.id DESC LIMIT 100`,
      [req.params.key]
    );
    return res.json({ ok: true, history: rows });
  } catch (err) {
    return next(err);
  }
});

adminContentRouter.get("/:key/history/:id", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      "SELECT data FROM cms_history WHERE key = $1 AND id = $2", [req.params.key, Number(req.params.id) || 0]
    );
    if (!rows.length) return res.status(404).json({ ok: false, error: "Version not found" });
    return res.json({ ok: true, data: rows[0].data });
  } catch (err) {
    return next(err);
  }
});

// Put an earlier published version live again (and make it the draft).
adminContentRouter.post("/:key/revert/:id", requirePublisher, async (req, res, next) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      "SELECT data FROM cms_history WHERE key = $1 AND id = $2", [req.params.key, Number(req.params.id) || 0]
    );
    if (!rows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ ok: false, error: "Version not found" });
    }
    const data = rows[0].data;
    await client.query(
      `UPDATE cms_content SET published = $2, published_at = now(), published_by = $3,
              draft = $2, draft_rev = draft_rev + 1, draft_updated_at = now(), draft_updated_by = $3
        WHERE key = $1`,
      [req.params.key, data, req.admin.id]
    );
    await client.query(
      "INSERT INTO cms_history (key, data, action, user_id) VALUES ($1, $2, 'revert', $3)",
      [req.params.key, data, req.admin.id]
    );
    await client.query("COMMIT");
    return res.json({ ok: true });
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    return next(err);
  } finally {
    client.release();
  }
});
