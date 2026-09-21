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
