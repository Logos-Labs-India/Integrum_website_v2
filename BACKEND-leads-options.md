# Leads on AWS — will the Google Sheet method work?

**Yes. Hosting on AWS changes nothing about it.**

## Why it works

The POST to Google is made by the **visitor's browser**, not by your server:

```
Visitor's browser  ──POST──►  script.google.com  ──►  your Google Sheet
       ▲
       │ (just downloads HTML/CSS/JS)
   AWS S3 + CloudFront
```

AWS only ever serves the files. It never touches the submission. So this works
identically on S3 + CloudFront, Amplify, EC2, or any other host — and it works
better on a real HTTPS domain than in local preview, because Google is happy to
accept requests from a proper origin.

Specifically:

- **No server code needed** — nothing to run, patch or scale on AWS.
- **HTTPS is fine** — your site is HTTPS and `script.google.com` is HTTPS, so
  there's no mixed-content problem.
- **CORS is already handled** — `leads.js` posts Apps Script URLs as
  `text/plain` (Apps Script doesn't answer the JSON preflight). This is the
  one thing that usually breaks such setups, and it's already dealt with.
- **CV uploads work** — the file is base64-encoded in the request, saved to a
  Drive folder by the script, and linked in the sheet row.

## One thing to do before launch

The endpoint is currently **empty** in the code:

```javascript
// leads.js, line 17
window.LEADS_ENDPOINT = "";
```

If you tested via the `#leads` screen, that URL was saved in **your browser
only** — real visitors would not deliver anything. Paste the deployed Apps
Script web-app URL there:

```javascript
window.LEADS_ENDPOINT = "https://script.google.com/macros/s/AKfycb...../exec";
```

That single line is the whole "go live" step. Then deploy the site to AWS as
normal.

## Post-deploy check (2 minutes)

1. Open the live AWS URL, submit the Platform enquiry form.
2. Confirm a row appears in the sheet.
3. Submit a job application with a CV — confirm the file lands in the
   **Integrum CVs** Drive folder and the row links to it.
4. Confirm the notification email arrives (info@ for enquiries, HR@ for
   careers).
5. Visit `#leads` and press **Clear stored leads** to remove test rows.

If step 2 fails, it is almost always the deployment access setting: it must be
**Anyone**, not "Anyone with Google account". Redeploy via
*Deploy → Manage deployments → Edit → Version: New version*.

## Practical limits

Fine for a corporate site's enquiry volume — Apps Script allows thousands of
requests a day and ~100 emails/day on a free Google account (1,500 on Workspace).
If enquiries ever outgrow that, or you want the leads in a real database for
CRM/reporting, the endpoint URL is the only thing that changes — the forms,
validation and CV handling stay exactly as they are.

## Safety net either way

Every lead is written to the visitor's browser storage *before* the network
call, and a failed POST doesn't discard it. `#leads` shows what a browser has
captured with a CSV export, and the panel only reports "delivery verified"
after a POST has genuinely succeeded.
