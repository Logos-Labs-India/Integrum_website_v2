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

## The one remaining gap: no pre-rendered HTML

The site moved from an in-browser Babel/no-build setup to a real Vite build (see
`DEPLOYMENT.md`). Two of the three items formerly listed here are already done:

- **Routes are real paths**, not hash fragments — `/cni`, `/platform`, `/investors`
  etc. are genuine URLs handled by React Router, each independently linkable and
  indexable as its own address.
- **In-browser Babel is gone.** `src/*.jsx` is compiled at build time by Vite;
  the browser only ever downloads plain, minified JS — this was the largest LCP
  cost on the site and no longer exists.

What's still true: every route still renders its content **client-side** — the
server sends the same `index.html` shell for every path, and React fills it in
after the JS bundle loads. Two consequences:

- Crawlers that do not execute JavaScript see only the `<noscript>` block. Most AI
  crawlers fall in this group.
- A slower/blocked JS load delays when a crawler (or a visitor) sees real content,
  even though the URL itself is now correct and indexable on its own.

This does not block launch — launch today, every route will index once crawled.
The highest-impact SEO work after launch is now narrower than before: add
pre-rendering (static HTML per route, generated at build time, with the same
React app hydrating on top for interactivity) — e.g. a prerender step in the
Vite build. The URL structure and build pipeline needed for that already exist;
this is purely an additive step on top of them.

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
