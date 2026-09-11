# Deploying the Integrum Energy website on AWS

This is a **static website**. There is no server, no build step, no Node, no database.
Every page is one HTML file plus CSS, JavaScript and assets, all rendered in the
browser. That makes deployment simple: copy the files to storage and serve them.

- **Entry point:** `index.html` — this is the only page. Everything else (Solutions,
  Platform, Company, People, Investors, Knowledge Hub, SPARK, legal pages) is a
  route inside it, addressed by URL hash, e.g. `#platform`, `#about`, `#investors`.
- **No `npm install`, no `npm run build`.** Do not look for a `package.json` — there
  isn't one, and nothing needs compiling.
- **Form submissions** go to a Google Apps Script Web App, not to your server.
  See "Lead capture" below.

---

## 1. What to upload

Upload the **whole project folder except the files listed under "Do not upload"**.

Required at the root:

```
index.html            entry point
styles.css            design tokens, base, nav, footer
components.css        section + component styles
pages.css             page-specific styles
leads.js              form submission → Google Sheet
figures.js             company figures (single source, loads before everything)
india-geo.js           India outline used by the operations map — loads before dataviz.jsx
ir-data.js            investor page data (KPIs, filings, meetings)
dataviz.jsx           icons, charts, video background, shared hooks
tweaks-panel.jsx      required — app.jsx renders <TweaksPanel>
home.jsx  cni.jsx  platform.jsx  spark.jsx
about.jsx  careers.jsx  jobs.jsx  casestudy.jsx
investors.jsx  dashboard.jsx  legal.jsx  enquiry.jsx
app.jsx               router + nav + footer (must load last)
robots.txt            crawler rules
sitemap.xml           search-engine sitemap
assets/               logos, photos, videos, certificates, PDFs
```

### Do not upload

These are working files, not part of the site:

```
uploads/                        client source material (PDFs, DOCX, XLSX, raw photos)
screens/  screenshots/          design references
apps-script-leads.gs            pasted into Google Sheets, not served
SETUP-leads-to-google-sheets.md
BACKEND-leads-options.md
DEPLOYMENT.md                   this file
.thumbnail
```

Leaving `uploads/` out matters: it holds internal documents (leadership profiles,
AGM notices, job descriptions) that should not be publicly reachable.

Two files are easy to miss because their names don't look essential:
`ir-data.js` (the Investors page loses all its data without it) and
`tweaks-panel.jsx` (`app.jsx` renders `<TweaksPanel>`, so a missing file throws
`TweaksPanel is not defined` and the **entire site fails to render**, not just one
page). The `aws s3 sync` command below copies everything except the excluded
folders, so both are included automatically — this only matters if you upload
files by hand.

---

## 2. Recommended: S3 + CloudFront

Static hosting with a CDN. Cheapest and fastest option.

### 2.1 Create the bucket

1. S3 → **Create bucket** → name it e.g. `integrumenergy-site`
2. Region: `ap-south-1` (Mumbai) — closest to your audience
3. Leave **Block all public access** ON. CloudFront will read the bucket privately.

### 2.2 Upload

Using the AWS CLI from the project folder:

```bash
aws s3 sync . s3://integrumenergy-site \
  --delete \
  --exclude ".*" \
  --exclude "uploads/*" \
  --exclude "screens/*" \
  --exclude "screenshots/*" \
  --exclude "*.gs" \
  --exclude "*.md"
```

Then set longer caching on assets (optional but worthwhile):

```bash
aws s3 cp s3://integrumenergy-site/assets s3://integrumenergy-site/assets \
  --recursive --metadata-directive REPLACE \
  --cache-control "public, max-age=2592000"
```

### 2.3 CloudFront distribution

1. CloudFront → **Create distribution**
2. **Origin domain:** your S3 bucket
3. **Origin access:** *Origin access control (OAC)* → create → then click the button
   to update the bucket policy. This lets CloudFront read a private bucket.
4. **Viewer protocol policy:** *Redirect HTTP to HTTPS*
5. **Default root object:** `index.html`
6. **Compress objects automatically:** Yes

Because the site is a single page addressed by hash, you do **not** need custom
error-page rewrites. `#platform` never reaches the server — the browser handles it.

### 2.4 Domain and certificate

1. ACM → request a public certificate for `integrumenergy.in` and
   `www.integrumenergy.in`. **The certificate must be created in `us-east-1`**
   (N. Virginia) — CloudFront only reads certificates from that region.
2. Validate by DNS (add the CNAME records ACM shows you).
3. Back in CloudFront → distribution settings → **Alternate domain names**: add both
   domains → attach the certificate.
4. Route 53 (or your DNS provider) → point both names at the distribution with an
   **A record / Alias** to CloudFront.

### 2.5 MIME types

The `.jsx` files must be served as JavaScript. S3 normally sets
`application/javascript` for them automatically. If the browser console shows
`Refused to execute … MIME type ('text/plain')`, force it:

```bash
aws s3 cp s3://integrumenergy-site s3://integrumenergy-site \
  --recursive --exclude "*" --include "*.jsx" \
  --metadata-directive REPLACE --content-type "text/babel"
```

### 2.6 Publishing an update

```bash
aws s3 sync . s3://integrumenergy-site --delete   # (same excludes as above)
aws cloudfront create-invalidation \
  --distribution-id <YOUR_DISTRIBUTION_ID> --paths "/*"
```

The invalidation matters — without it, CloudFront keeps serving the old CSS/JS for
up to 24 hours and your change appears not to have taken effect.

---

## 3. Alternative: AWS Amplify Hosting

Simpler if you'd rather not manage S3 and CloudFront yourself. Connect a Git repo
and Amplify serves it with HTTPS and a CDN.

Build settings — **leave the build phase empty**, there is nothing to compile:

```yaml
version: 1
frontend:
  phases:
    build:
      commands: []
  artifacts:
    baseDirectory: /
    files:
      - '**/*'
  cache:
    paths: []
```

---

## 4. Alternative: EC2 with nginx

Only if you already have an EC2 instance you want to use.

```bash
sudo apt update && sudo apt install -y nginx
sudo rsync -av --exclude 'uploads' --exclude 'screens' \
  --exclude 'screenshots' --exclude '*.md' --exclude '*.gs' \
  ./ /var/www/integrum/
```

`/etc/nginx/sites-available/integrum`:

```nginx
server {
    listen 80;
    server_name integrumenergy.in www.integrumenergy.in;
    root /var/www/integrum;
    index index.html;

    # serve .jsx as JavaScript
    location ~ \.jsx$ { default_type text/babel; }

    location / { try_files $uri $uri/ /index.html; }

    gzip on;
    gzip_types text/css application/javascript text/babel image/svg+xml;

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

Forms post to a Google Apps Script Web App. The endpoint is already set in
`leads.js`. Nothing runs on AWS for this, and **it works from any domain** —
the request is sent with `Content-Type: text/plain`, which browsers treat as a
simple request, so no CORS configuration is needed on your side.

Confirm in the Apps Script deployment settings:

- **Execute as:** Me
- **Who has access:** **Anyone**

If access is set to "Only myself", every visitor submission fails silently.

If you ever redeploy the script, Apps Script issues a **new** URL. Update the first
line of `leads.js`, re-sync, and invalidate CloudFront.

Full instructions: `SETUP-leads-to-google-sheets.md`.

---

## 6. Post-deployment checklist

Test on the live domain, not localhost:

- [ ] `https://integrumenergy.in` loads over HTTPS with no certificate warning
- [ ] Hero background video plays and loops through all three clips
- [ ] Every nav item opens: Solutions, Platform, Knowledge Hub, Investors, Company, People
- [ ] Deep links work when pasted fresh into the address bar, e.g.
      `…/#spark/p`, `…/#investors`, `…/#case/khayati-steel`
- [ ] **Talk to an Advisor** submits → row appears in the Google Sheet
- [ ] **Bring us your energy challenge** (Platform) submits → row appears
- [ ] A careers application with a CV submits → row appears **and** the CV lands in
      the Drive folder
- [ ] Browser console is clean (one Babel development-mode warning is expected)
- [ ] Mobile: 320px, 375px and 768px widths — no horizontal scrolling
- [ ] PDFs open: GPTW certificate, ISO 9001 certificate, AGM and EGM notices
- [ ] `https://integrumenergy.in/uploads/` returns 403 or 404 — internal documents
      must not be reachable

---

## 7. Two notes worth acting on

**Babel runs in the browser.** `index.html` loads Babel and compiles the `.jsx`
files on each page load. This works and is what the site is built on, but it adds
roughly 1–2 seconds to first paint and prints a development-mode console warning.
If page speed becomes a priority later, the fix is to pre-compile the `.jsx` files
to plain `.js` as a build step — the site's structure does not otherwise change.

**Video weight.** The three hero clips in `assets/` total around 40 MB at
1920×1080. On a slow mobile connection the poster image shows for a while before
the video starts. Re-exporting them at 1280×720, ~2 Mbps, no audio would bring
each to 2–3 MB. Drop the replacements into `assets/` under the same filenames —
no code change needed.
