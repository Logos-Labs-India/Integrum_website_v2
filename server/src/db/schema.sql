-- Union of every field the site's lead forms send (Contact / Talk to an
-- Advisor, and the Platform page's customer enquiry form). Mirrors the
-- canonical field set apps-script-leads.gs already established.
CREATE TABLE IF NOT EXISTS leads (
  id            BIGSERIAL PRIMARY KEY,
  submitted_at  TIMESTAMPTZ NOT NULL,
  form          TEXT NOT NULL,
  reason        TEXT,
  name          TEXT NOT NULL,
  company       TEXT,
  email         TEXT NOT NULL,
  phone         TEXT NOT NULL,
  role          TEXT,
  industry      TEXT,
  consumption   TEXT,
  location      TEXT,
  state         TEXT,
  notes         TEXT,
  help          TEXT,
  resume_name   TEXT,
  resume_size   INTEGER,
  resume_bucket TEXT,
  resume_key    TEXT,
  page          TEXT,
  route_to      TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Additive, idempotent — CREATE TABLE IF NOT EXISTS above is a no-op once
-- the table already exists, so new columns need their own statement to
-- reach a database that was created before they were added.
ALTER TABLE leads ADD COLUMN IF NOT EXISTS resume_upload_failed BOOLEAN NOT NULL DEFAULT false;

-- ============================================================
-- CMS — admin users, sessions, and page content as JSON
-- ============================================================

-- role: "publisher" can save drafts AND publish; "editor" can only save
-- drafts, which a publisher then reviews and publishes.
CREATE TABLE IF NOT EXISTS admin_users (
  id             BIGSERIAL PRIMARY KEY,
  email          TEXT NOT NULL UNIQUE,
  name           TEXT NOT NULL,
  role           TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('editor', 'publisher')),
  password_hash  TEXT NOT NULL,
  must_change_password BOOLEAN NOT NULL DEFAULT true,
  disabled       BOOLEAN NOT NULL DEFAULT false,
  last_login_at  TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Only a SHA-256 of the session token is stored, so a database leak can't
-- be replayed as a login.
CREATE TABLE IF NOT EXISTS admin_sessions (
  token_hash  TEXT PRIMARY KEY,
  user_id     BIGINT NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS admin_sessions_user_idx ON admin_sessions (user_id);

-- One row per content document (e.g. "figures", "investors"). The site
-- reads `published`; the admin edits `draft`. draft_rev guards against two
-- people overwriting each other's unsaved work.
CREATE TABLE IF NOT EXISTS cms_content (
  key               TEXT PRIMARY KEY,
  published         JSONB,
  published_at      TIMESTAMPTZ,
  published_by      BIGINT REFERENCES admin_users(id),
  draft             JSONB,
  draft_rev         INTEGER NOT NULL DEFAULT 0,
  draft_updated_at  TIMESTAMPTZ,
  draft_updated_by  BIGINT REFERENCES admin_users(id)
);

-- Every publish (and revert) keeps a full copy, so any earlier version can
-- be restored.
CREATE TABLE IF NOT EXISTS cms_history (
  id          BIGSERIAL PRIMARY KEY,
  key         TEXT NOT NULL,
  data        JSONB NOT NULL,
  action      TEXT NOT NULL CHECK (action IN ('publish', 'revert')),
  user_id     BIGINT REFERENCES admin_users(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS cms_history_key_idx ON cms_history (key, id DESC);
