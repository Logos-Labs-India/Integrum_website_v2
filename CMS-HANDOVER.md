# Website CMS — handover

Branch: **`feature/cms`** (based on `feature/react-app`, includes everything on it
up to `dbd965e`). Nothing here is live yet — the live site still runs
`feature/react-app`.

## What it is

An admin at **`/admin`** where signed-in editors change the site's content through
forms — text, numbers, cards, images, PDFs, videos — and publish. Layout and
design stay in code.

- Each page's content is one JSON document in Postgres (`cms_content`).
- On load the site fetches published documents from `GET /api/content` and
  writes them into the page data modules **before** any page code is imported
  (`src/content/cms.js`). Pages keep importing `FIG`, `IR_DOCS`, `HOME_TEXT`…
  exactly as before.
- No API / nothing published → the site renders its built-in content, so a CMS
  outage can't blank the site.
- Publishing needs no rebuild or redeploy; the change shows on the next page load.

| Admin page | Covers |
|---|---|
| Company figures | MW, CO₂, generation… — used on Home, Company, Investors |
| Investor relations | documents, DRHP videos, board, disclosures, IR contact, labels, section/tab names |
| Home · Solutions · Platform · SPARK · Company · People & careers | every heading, paragraph, button, card, list and image on those pages; open roles with full JDs |
| Case studies & contact | case cards/groups/industries, full case pages, Contact page text |
| Knowledge Hub articles | article text and body blocks (paragraphs, tables, lists…) |
| Legal pages | Terms, Privacy, Disclaimer |
| Forms & sign-in | enquiry form labels/dropdown choices, sign-in page panel |
| Site-wide | logo, menu, footer, badges, socials, per-page SEO title/description |

Deliberately **not** editable: layout/design, the DRHP legal disclaimer wording
(lawyer-approved), the Contact form's "Who are you?" options (form logic depends
on them), calculator formulas, maps, the demo dashboard.

Roles: **editor** saves drafts; **publisher** also publishes and restores.

## Where things are

| Path | What |
|---|---|
| `server/src/routes/content.js` | public `GET /api/content` |
| `server/src/routes/adminAuth.js` | sign in/out, `/me`, change password |
| `server/src/routes/adminContent.js` | drafts, publish, discard, history, restore, preview |
| `server/src/routes/adminUploads.js` | presigned S3 upload URLs |
| `server/src/auth/` | password hashing (scrypt), sessions (httpOnly cookie, CSRF header) |
| `server/src/cms/keys.js` | the list of content keys + validation (URL fields, size) |
| `server/scripts/create-admin.js` | `npm run create-admin` — accounts / password resets |
| `server/src/db/schema.sql` | tables — created on server start, additive only |
| `src/content/cms.js` | loads published content into the data modules |
| `src/admin/` | the admin app; `schemas.js` = the form for each page, `auto.js` builds forms from content shape |
| `src/site.js` | menu, footer, SEO (moved out of `App.jsx`) |

To add a page to the CMS: put its content in an exported data module, add it to
`CONTENT_DEFS` (`src/content/cms.js`), `SCHEMAS` (`src/admin/schemas.js`) and
`CONTENT_KEYS` (`server/src/cms/keys.js`).

## Run it locally

Use a **local/test database**, never the production `DATABASE_URL` — anything
published there goes live as soon as the CMS is deployed.

```bash
# 1. a throwaway Postgres (no install needed); keep the data folder outside the repo
npx -p @electric-sql/pglite-socket pglite-server --port=55432 --max-connections=10 --db=../cms-testdb

# 2. API — server/.env from the team (ask for it; never committed), with the DB overridden
cd server && npm install
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:55432/postgres PORT=4100 npm start

# 3. a test account (prints a one-time password)
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:55432/postgres \
  npm run create-admin -- --email you@example.com --name "Your Name" --role publisher

# 4. site — port must be in ALLOWED_ORIGINS or be localhost (allowed outside production)
cd .. && npm install
VITE_API_BASE_URL=http://localhost:4100 npx vite --port 5500
```

Open `http://localhost:5500/admin`, sign in, set your own password.

## Test checklist

- [ ] Sign in; wrong password is rejected; first sign-in forces a new password.
- [ ] Company figures → change CO₂ → Publish → Home, Company and Investors show it.
- [ ] Edit a heading containing `*asterisks*` → that phrase renders in the accent colour.
- [ ] Save draft (don't publish) → **Preview** shows it with a yellow bar; a private window does not.
- [ ] History → Restore an earlier version → it's live again.
- [ ] People & careers → add an open role → appears on /careers; remove it → gone.
- [ ] Case studies → add a case with a new page address → /case/<address> works.
- [ ] Two browsers editing the same page → the second save gets a "someone else saved" conflict.
- [ ] An editor-role account can save but not publish.
- [ ] Uploads (needs the S3 setup below): image, PDF, MP4 → appear on the site.
- [ ] With the API stopped, the public site still renders (built-in content).
- [ ] All public pages look unchanged versus `feature/react-app` before anything is published.
- [ ] Investors: DRHP/DAP/advert downloads and both DRHP videos still show the disclaimer every time.

## Pending before go-live

1. **Test** — the checklist above, especially uploads (never tested against real S3).
2. **Deploy the API server** from this branch, with in `server/.env`:
   `NODE_ENV=production`, `ALLOWED_ORIGINS=https://integrumenergy.in,https://www.integrumenergy.in`
   (currently localhost), `HR_EMAIL`, `GENERAL_NOTIFY_EMAIL`, optional `CMS_PUBLIC_BASE_URL`.
   The API must be HTTPS on a subdomain of the site (e.g. `api.integrumenergy.in`) — the admin
   session cookie is `SameSite=None; Secure` and needs to be first-party.
3. **AWS** — `DEPLOYMENT.md` § 5a: public read on `cms/*` only (résumés stay private), bucket CORS
   for `PUT` from the site origins, IAM `s3:PutObject` on `cms/*`.
4. **Build and deploy the frontend** from this branch with `VITE_API_BASE_URL` = the API URL.
   The SPA fallback already routes `/admin` to `index.html`.
5. **Merge** `feature/cms` into `feature/react-app` once tested.
6. **Rotate** the AWS key and the database password (they were shared in chat).

Production accounts already exist (publisher): Krutika Gouda and Sanjay Kumar. Their one-time
passwords were shared separately. Reset or add accounts with `npm run create-admin`.

## Known limitations / possible next steps

- No "forgot password" email — resets go through `npm run create-admin -- --email … --reset`.
- No admin user guide for the client yet.
- Investors sub-page SEO titles (`IR_META`) are still in code.
- The public bundle is ~560 KB (Vite warns); the admin is already split into its own chunk.
