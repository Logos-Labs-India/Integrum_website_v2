# Deploying the Integrum Energy website on AWS

This is a **built React app** (Vite + React Router). There's no backend and no
database — `npm run build` produces a folder of static files (`dist/`), and
deployment is still just "copy the files to storage and serve them." The
difference from before is that there's now a build step, and because routes
are real paths (`/investors`, `/case/khayati-steel`, not `#investors`), the
host needs one SPA fallback rule so a direct hit on a nested path serves
`index.html` instead of a 404.

- **Build first:** `npm install` (once), then `npm run build`. This compiles
  `src/` into `dist/` — that's the folder you upload, not the project root.
- **Entry point:** `dist/index.html`. Every other route (Solutions, Platform,
  Company, People, Investors, Knowledge Hub, SPARK, legal pages) is a real
  path handled client-side by React Router once the bundle loads.
- **Form submissions** go to a Google Apps Script Web App, not to your server.
  See "Lead capture" below. The endpoint URL lives in `src/leads.js` and is
  baked into the bundle at build time — changing it means rebuilding.

---

## 1. Build and what to upload

```bash
npm install
npm run build
```

This produces `dist/`:

```
dist/
  index.html            entry point
  assets/                hashed, fingerprinted JS/CSS bundles (from src/ + vite.config.js)
  assets/                also contains the site's own images/videos/PDFs, copied verbatim
                          from public/assets/ — same directory, both merge into one
  robots.txt             crawler rules (from public/robots.txt)
  sitemap.xml             search-engine sitemap (from public/sitemap.xml)
  llms.txt                summary for answer engines (from public/llms.txt)
```

Upload **the contents of `dist/`**, not the project source. `src/`,
`node_modules/`, `uploads/`, `screens/`, `screenshots/`, `apps-script-leads.gs`
and the `.md` files never need to leave your machine — they aren't part of
`dist/` and don't need excluding from anything, since you're only uploading
`dist/`'s contents in the first place.

`uploads/` in particular must stay out of any deploy: it holds internal
documents (leadership profiles, AGM notices, job descriptions) that should
not be publicly reachable, and it was never part of the build input.

---

## 2. Recommended: S3 + CloudFront

Static hosting with a CDN. Cheapest and fastest option.

### 2.1 Create the bucket

1. S3 → **Create bucket** → name it e.g. `integrumenergy-site`
2. Region: `ap-south-1` (Mumbai) — closest to your audience
3. Leave **Block all public access** ON. CloudFront will read the bucket privately.

### 2.2 Upload

From the project folder, after `npm run build`:

```bash
aws s3 sync dist/ s3://integrumenergy-site --delete
```

Then set longer caching on the hashed build assets (optional but worthwhile —
safe because Vite fingerprints filenames, so a new build never collides with
a cached old one):

```bash
aws s3 cp s3://integrumenergy-site/assets s3://integrumenergy-site/assets \
  --recursive --metadata-directive REPLACE \
  --cache-control "public, max-age=31536000, immutable"
```

### 2.3 CloudFront distribution

1. CloudFront → **Create distribution**
2. **Origin domain:** your S3 bucket
3. **Origin access:** *Origin access control (OAC)* → create → then click the button
   to update the bucket policy. This lets CloudFront read a private bucket.
4. **Viewer protocol policy:** *Redirect HTTP to HTTPS*
5. **Default root object:** `index.html`
6. **Compress objects automatically:** Yes
7. **Custom error responses** (this is the part that matters now that routes
   are real paths, not `#hash`): add two entries —
   - HTTP error code `403` → Response page path `/index.html` → HTTP response code `200`
   - HTTP error code `404` → Response page path `/index.html` → HTTP response code `200`

   Without this, a visitor who pastes `integrumenergy.in/case/khayati-steel`
   straight into the address bar gets S3's raw 403/404 instead of the app —
   S3 has no `index.html`-per-directory at that path, so the request needs to
   fall back to the real `index.html` and let React Router take it from there.

### 2.4 Domain and certificate

1. ACM → request a public certificate for `integrumenergy.in` and
   `www.integrumenergy.in`. **The certificate must be created in `us-east-1`**
   (N. Virginia) — CloudFront only reads certificates from that region.
2. Validate by DNS (add the CNAME records ACM shows you).
3. Back in CloudFront → distribution settings → **Alternate domain names**: add both
   domains → attach the certificate.
4. Route 53 (or your DNS provider) → point both names at the distribution with an
   **A record / Alias** to CloudFront.

### 2.5 Publishing an update

```bash
npm run build
aws s3 sync dist/ s3://integrumenergy-site --delete
aws cloudfront create-invalidation \
  --distribution-id <YOUR_DISTRIBUTION_ID> --paths "/*"
```

The invalidation matters — without it, CloudFront keeps serving the old build for
up to 24 hours and your change appears not to have taken effect. (The hashed
files under `assets/` don't strictly need invalidating since their filenames
change every build, but `index.html` and `robots.txt`/`sitemap.xml`/`llms.txt` do.)

---

## 3. Alternative: AWS Amplify Hosting

Simpler if you'd rather not manage S3 and CloudFront yourself. Connect a Git repo
and Amplify builds and serves it with HTTPS and a CDN, including the SPA
fallback automatically for a Vite/React app.

Build settings:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

---

## 4. Alternative: EC2 with nginx

Only if you already have an EC2 instance you want to use.

```bash
npm run build
sudo apt update && sudo apt install -y nginx
sudo rsync -av --delete dist/ /var/www/integrum/
```

`/etc/nginx/sites-available/integrum`:

```nginx
server {
    listen 80;
    server_name integrumenergy.in www.integrumenergy.in;
    root /var/www/integrum;
    index index.html;

    location / { try_files $uri $uri/ /index.html; }

    gzip on;
    gzip_types text/css application/javascript image/svg+xml;

    location ~* \.(png|jpe?g|svg|mp4|pdf|woff2?)$ {
        expires 30d;
        add_header Cache-Control "public";
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/integrum /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo snap install --classic certbot     # then:
sudo certbot --nginx -d integrumenergy.in -d www.integrumenergy.in
```

---

## 5. Lead capture (do this before going live)

Forms post to the Integrum lead API in `server/` — a small Express app that
writes each submission to Postgres and, for résumé uploads, to S3. Unlike the
rest of this site, **this piece is not static** — it needs to actually run
somewhere reachable over HTTPS, separately from the S3/CloudFront/Amplify/EC2
deploy of the frontend itself. How/where you host `server/` (its own small
EC2 instance, a container platform, etc.) is up to you; this section covers
what the frontend needs from it.

**Frontend side:** the API's base URL is baked into the JS bundle at build
time via `VITE_API_BASE_URL` — **changing it requires `npm run build` again**,
not just a re-sync of static files.

```bash
VITE_API_BASE_URL=https://api.integrumenergy.in npm run build
```

**Backend side (`server/`):**

- Copy `server/.env.example` to `server/.env` and fill in `DATABASE_URL`
  (Postgres) and the `AWS_*` values (S3, for résumés) — never commit `.env`.
- `SES_FROM_EMAIL` must be a **verified identity** in SES for `AWS_REGION`
  (SES console → Verified identities), or every notification email will fail
  silently (logged server-side, doesn't block the submission). `HR_EMAIL` is
  where the summary of every submission gets sent.
- Set `ALLOWED_ORIGINS` to your real site origin(s), e.g.
  `https://integrumenergy.in,https://www.integrumenergy.in` — any
  `http://localhost:*` origin is allowed automatically outside production,
  but production traffic must come from an explicitly allowed origin.
- `npm install && npm start` — on boot it creates the `leads` table if it
  doesn't already exist (see `server/src/db/schema.sql`).
- Confirm `GET /api/health` returns `{"ok":true}` from wherever you host it,
  then confirm the frontend's `VITE_API_BASE_URL` points at that same host.

If the API is unreachable, submissions still aren't lost — every lead is
written to the visitor's own browser storage first (see `#leads`), the same
safety net as before.

---

## 6. Post-deployment checklist

Test on the live domain, not localhost:

- [ ] `https://integrumenergy.in` loads over HTTPS with no certificate warning
- [ ] Hero background video plays and loops through all three clips
- [ ] Every nav item opens: Solutions, Platform, Knowledge Hub, Investors, Company, People
- [ ] Deep links work when pasted **fresh** into the address bar (this is the
      SPA-fallback check from step 2.3), e.g.
      `…/spark/p`, `…/investors`, `…/case/khayati-steel`
- [ ] **Talk to an Advisor** submits → row appears in the Google Sheet
- [ ] **Bring us your energy challenge** (Platform) submits → row appears
- [ ] A careers application with a CV submits → row appears **and** the CV lands in
      the Drive folder
- [ ] Browser console is clean
- [ ] Mobile: 320px, 375px and 768px widths — no horizontal scrolling
- [ ] PDFs open: GPTW certificate, ISO 9001 certificate, AGM and EGM notices
- [ ] `https://integrumenergy.in/uploads/` returns 403 or 404 — internal documents
      must not be reachable (trivially true now — `uploads/` was never part of `dist/`)

---

## 7. One note worth acting on

**Video weight.** The three hero clips in `public/assets/` total around 40 MB at
1920×1080. On a slow mobile connection the poster image shows for a while before
the video starts. Re-exporting them at 1280×720, ~2 Mbps, no audio would bring
each to 2–3 MB. Drop the replacements into `public/assets/` under the same
filenames and rebuild — no other code change needed.
