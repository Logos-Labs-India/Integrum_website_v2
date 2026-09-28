# SEO — what is done, what you must do at launch, what remains

## Done in the code (no action needed)

| Item | Where |
|---|---|
| Unique title + meta description per route | `app.jsx` → `PAGE_META`, applied on every route change |
| Canonical tag per route | `app.jsx` SEO effect (`link[rel=canonical]`) |
| `og:title` / `og:description` / `og:url` per route | same effect |
| Organization schema with full NAP | `index.html` |
| LocalBusiness schema (Koramangala office, states served) | `index.html` |
| WebSite + SearchAction schema | `index.html` |
| BreadcrumbList schema, generated per route | `app.jsx` SEO effect |
| robots.txt with search + AI-crawler rules, sitemap reference | `robots.txt` |
| `llms.txt` summary for answer engines | `llms.txt` |
| XML sitemap | `sitemap.xml` |
| Descriptive alt text on images | already present across all page files |
| GA4 loader, dormant until an ID is set | `index.html` |
| GA4 page views on route change | `app.jsx` SEO effect |

## Do these at launch (10 minutes, no code)

1. **Turn on Google Analytics.** Create a GA4 property → Admin → Data streams → Web →
   copy the Measurement ID (`G-XXXXXXXXXX`). Paste it into `index.html`:

   ```html
   <script>window.GA_MEASUREMENT_ID = "G-XXXXXXXXXX";</script>
   ```

   Nothing loads while it is empty, so shipping without it is safe.

2. **Google Search Console.** Add `integrumenergy.in` as a *Domain* property, verify by
   the DNS TXT record your host supports, then submit
   `https://integrumenergy.in/sitemap.xml`. This — not Analytics — is what shows you
   indexing status and real search queries. Analytics measures visitors; it has no
   effect on ranking.

3. **Google Business Profile.** Create/claim it using exactly the same name, address and
   phone number that appear on the site — if they differ anywhere, Google treats them as
   two different businesses and both rank worse:

   ```
   Integrum Energy Infrastructure Ltd.
   736, 2nd Floor, 3rd Block, Koramangala, Bengaluru 560034, Karnataka, India
   +91 76187 02052
   ```

   This is the only step that needs anything from you beyond a copy-paste.

4. **Bing Webmaster Tools** — import from Search Console in one click. Bing's index feeds
   several AI answer engines.

## The one real gap: client-side rendering

Every page renders in the browser from `home.jsx`, `platform.jsx` etc., and routes are
hash URLs (`/#platform`). Two consequences:

- Crawlers that do not execute JavaScript see only the `<noscript>` block. Most AI
  crawlers fall in this group.
- A fragment is not a separate URL to Google, so the whole site competes as one page.
  `/#cni` cannot rank for "industrial solar Karnataka" independently of the homepage.

This does not block launch — launch today, the homepage will index. But the highest-impact
SEO work after launch is converting to real paths with pre-rendered HTML:

- `/`, `/solutions`, `/platform`, `/knowledge-hub`, `/investors`, `/company`, `/people`,
  `/contact` as descriptive slugs
- each served as static HTML containing its own copy, title, description and canonical
- the React app hydrating on top for interactivity

Pre-rendering also fixes Core Web Vitals. Babel currently transpiles all page files in the
visitor's browser on first load, which is the largest LCP cost on the site. Removing
in-browser Babel (pre-compiling the JSX at build time) is the second post-launch item, and
is worth more than any further on-page tuning.

## Also worth adding after launch

- FAQPage schema on Solutions, Article schema on Knowledge Hub entries
- One H1 per page — audit each page file; section headings should be H2/H3 below it
- Location pages for the states you operate in, if Karnataka-first local search matters

## Provenance of every value I added

Nothing here is invented or carried over from another project's brief. Each value was read
out of this codebase:

| Value | Source file |
|---|---|
| 736, 2nd Floor, 3rd Block, Koramangala, Bengaluru 560034 | `legal.jsx`, `home.jsx` |
| +91 76187 02052 | `home.jsx`, `ir-data.js` |
| info@integrumenergy.in | `index.html`, `home.jsx` |
| CIN U40106KA2021PLC144691 | `app.jsx` footer, `ir-data.js` |
| States served: Karnataka, Maharashtra, Gujarat, Tamil Nadu | `dataviz.jsx` → `PROJECT_REGIONS` |
| 264+ MW / 155+ MW / 34+ partners (in `llms.txt`) | `figures.js` → `FIG` |
| SPARK stage names (in `llms.txt`) | `spark.jsx` → `SPARK_FULL` |

The LocalBusiness block is optional. It exists only so Google can connect the Koramangala
office to searches like "solar company Bengaluru". If you would rather not publish the
office address in structured data, delete that one `<script type="application/ld+json">`
block from `index.html` — nothing else depends on it.
