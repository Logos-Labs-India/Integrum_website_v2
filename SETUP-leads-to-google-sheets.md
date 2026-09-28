# Connecting the website forms to Google Sheets

Every form submission (Talk to an Advisor, Bring Us Your Energy Challenge, and
job applications) is captured by `leads.js`. Follow the steps below once and
every submission lands as a row in your spreadsheet, with CVs saved to Drive.

**Your sheet:**
<https://docs.google.com/spreadsheets/d/1QAwDiV8qrg2l_HrIg8yIqXyAAeemNq3XolG-OuDtHZ4/edit>

The script is ready to paste, with your sheet ID already filled in — it's the
file **`apps-script-leads.gs`** in this project.

---

## 1. Open Apps Script

In your spreadsheet: **Extensions → Apps Script**.
Delete everything in `Code.gs` and paste the whole of `apps-script-leads.gs`.
Save.

## 2. Optional sanity check

In the editor, choose the `testInsert` function and press **Run**. Approve the
permissions when asked. A row saying "Editor test — delete this row" should
appear in the sheet. Delete it. This proves the script can reach the sheet
before you deploy anything.

## 3. Deploy it

1. Click **Deploy → New deployment**.
2. Click the gear next to "Select type" and choose **Web app**.
3. Set:
   - **Description:** `Integrum lead capture`
   - **Execute as:** `Me`
   - **Who has access:** `Anyone`  ← required, or the website can't post to it
4. Click **Deploy**, then **Authorize access** and approve the permissions
   (Google will warn it's an unverified app — choose *Advanced → Go to project*).
5. Copy the **Web app URL**. It looks like:
   `https://script.google.com/macros/s/AKfycb...../exec`

## 4. Test the URL on the site (no code needed)

1. Open the website and go to **#leads**.
2. Paste the web-app URL into the box and press **Save & test**.
3. A test row should appear in your spreadsheet within a second or two. Delete
   that row afterwards.

If it fails, the usual cause is step 3.3 — the deployment must be set to
**Anyone**, not "Anyone with Google account".

## 5. Make it live for every visitor

The URL you pasted in step 4 is saved in *that browser only*, which is fine for
testing. To deliver leads from every visitor, open `leads.js` and set the first
line:

```javascript
window.LEADS_ENDPOINT = "https://script.google.com/macros/s/AKfycb...../exec";
```

That is the only code change the site needs. The **#leads** screen shows the
exact line to copy once you've tested successfully.

## 6. Final check

1. Submit the **Bring Us Your Energy Challenge** form on the Platform page and
   confirm a row appears.
2. Submit a job application with a CV and confirm the file lands in the
   **Integrum CVs** folder in Drive, with a link in the row.
3. Go to **#leads** and press **Clear stored leads** to remove the test entries.

---

## Notes

- **Nothing is lost if delivery fails.** Every lead is also written to the
  visitor's browser storage. Visiting `#leads` on the site shows a table of
  what that browser captured, with a **Download CSV** button.
- **CV uploads** are limited to 4 MB. Larger files are rejected with a message
  asking the applicant to email them instead.
- **Why text/plain?** The site posts the JSON body with a `text/plain`
  content-type when the URL is an Apps Script one. Apps Script does not answer
  the CORS preflight that `application/json` triggers, so the request would
  otherwise be blocked by the browser. The script still parses it as JSON.
- **Redeploying:** after editing the script, use **Deploy → Manage deployments
  → Edit → Version: New version**, otherwise the old code keeps running.
- **Switching to a CRM later** needs no rework — any endpoint that accepts a
  JSON POST will work. Just change the URL in `leads.js`.

## Fields you'll see as columns

| Column | Meaning |
|---|---|
| `form` | Which form it came from |
| `submitted_at` | ISO timestamp |
| `page` | Page the visitor was on |
| `name`, `company`, `email`, `phone` | Contact details |
| `industry`, `consumption`, `location`, `state` | Enquiry form only |
| `reason`, `role` | Contact form — enquiry type and job role |
| `resume_name`, `resume_size`, `resume_file` | CV filename, bytes, Drive link |
| `notes` / `help` | Free-text message |
