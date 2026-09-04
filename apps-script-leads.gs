/**
 * Integrum website — lead capture endpoint
 * ------------------------------------------------------------------
 * Target sheet:
 * https://docs.google.com/spreadsheets/d/1QAwDiV8qrg2l_HrIg8yIqXyAAeemNq3XolG-OuDtHZ4/edit
 *
 * WHAT IT DOES
 *   · Appends every website form submission as a row
 *   · Creates and extends the header row automatically
 *   · Saves uploaded CVs to a Drive folder and links them in the row
 *   · Emails a notification on each submission
 *
 * HOW TO INSTALL  (about 5 minutes, once)
 *   1. Open the spreadsheet above.
 *   2. Extensions → Apps Script.
 *   3. Delete everything in Code.gs and paste this entire file.
 *   4. Save (disk icon).
 *   5. Deploy → New deployment → gear icon → Web app.
 *        Description   : Integrum lead capture
 *        Execute as    : Me
 *        Who has access: Anyone          ← must be "Anyone", not
 *                                          "Anyone with Google account"
 *   6. Deploy → Authorize access → pick your account → Advanced →
 *      "Go to <project> (unsafe)" → Allow.
 *      (Google shows that warning for every personal script. It is your
 *       own code running under your own account.)
 *   7. Copy the Web app URL. It looks like:
 *        https://script.google.com/macros/s/AKfycb....../exec
 *   8. On the website open  #leads , paste the URL, press "Save & test".
 *      A test row should appear in the sheet. Delete that row.
 *   9. Paste the same URL into the first line of leads.js:
 *        window.LEADS_ENDPOINT = "https://script.google.com/macros/s/..../exec";
 *      That makes it live for every visitor.
 *
 * AFTER EDITING THIS SCRIPT
 *   Deploy → Manage deployments → pencil → Version: New version → Deploy.
 *   Without a new version the old code keeps running.
 */

var SHEET_ID     = '1QAwDiV8qrg2l_HrIg8yIqXyAAeemNq3XolG-OuDtHZ4';
var SHEET_NAME   = 'Leads';
var CV_FOLDER    = 'Integrum CVs';              // created on first upload
var NOTIFY_EMAIL = 'info@integrumenergy.in';    // general enquiries; '' disables emails
var HR_EMAIL     = 'HR@integrumenergy.in';      // careers enquiries + CVs

// Fixed column order/labels for every field either form can send. Any field
// not listed here still gets its own column, appended after these — so the
// sheet never drops data, it just keeps these ones in a stable place.
var FIELD_ORDER = ['submitted_at','form','reason','name','company','email','phone',
  'role','industry','consumption','location','state','notes','help',
  'resume_name','resume_file','resume_size','page','route_to'];
var FIELD_LABELS = {
  submitted_at: 'Submitted At', form: 'Form', reason: 'Reason', name: 'Name',
  company: 'Company', email: 'Email', phone: 'Phone', role: 'Role Applied For',
  industry: 'Industry', consumption: 'Annual Consumption', location: 'Location',
  state: 'State', notes: 'Notes', help: 'Message',
  resume_name: 'Resume File Name', resume_file: 'Resume Link', resume_size: 'Resume Size (bytes)',
  page: 'Page', route_to: 'Routed To (email)'
};
function headerForKey_(k) { return FIELD_LABELS[k] || k; }
function keyForHeader_(h) {
  for (var k in FIELD_LABELS) if (FIELD_LABELS[k] === h) return k;
  return h; // unrecognised header — its label is the raw field key
}

/* ------------------------------------------------------------------ */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);                 // two submissions can't collide
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return json({ ok: false, error: 'Empty request body' });
    }
    var data = JSON.parse(e.postData.contents);

    // ---- CV upload: decode, save to Drive, replace with a link ----
    if (data.resume_file && String(data.resume_file).indexOf('base64,') !== -1) {
      try {
        var parts  = String(data.resume_file).split('base64,');
        var meta   = parts[0];
        var mime   = meta.substring(meta.indexOf(':') + 1, meta.indexOf(';'));
        var bytes  = Utilities.base64Decode(parts[1]);
        var fname  = data.resume_name || ('cv-' + new Date().getTime());
        var blob   = Utilities.newBlob(bytes, mime, fname);
        var found  = DriveApp.getFoldersByName(CV_FOLDER);
        var folder = found.hasNext() ? found.next() : DriveApp.createFolder(CV_FOLDER);
        data.resume_file = folder.createFile(blob).getUrl();
      } catch (fileErr) {
        data.resume_file = 'CV received but could not be saved: ' + fileErr;
      }
    }

    var sheet = getSheet_();

    // ---- header row: fixed order for known fields, grown for new ones ----
    var lastCol = sheet.getLastColumn();
    var headerLabels = (sheet.getLastRow() > 0 && lastCol > 0)
      ? sheet.getRange(1, 1, 1, lastCol).getValues()[0].filter(String)
      : [];
    var keys = headerLabels.map(keyForHeader_);
    var added = false;
    Object.keys(data).forEach(function (k) {
      if (keys.indexOf(k) === -1) { keys.push(k); headerLabels.push(headerForKey_(k)); added = true; }
    });
    if (added || sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, headerLabels.length).setValues([headerLabels]);
      sheet.getRange(1, 1, 1, headerLabels.length)
           .setFontWeight('bold')
           .setBackground('#014976')
           .setFontColor('#ffffff');
      sheet.setFrozenRows(1);
    }

    // ---- the row itself ----
    var row = keys.map(function (k) {
      return data[k] !== undefined && data[k] !== null ? data[k] : '';
    });
    sheet.appendRow(row);

    // ---- notification email (never blocks the save) ----
    if (NOTIFY_EMAIL) {
      try {
        var body = keys.map(function (k) {
          return headerForKey_(k) + ': ' + (data[k] || '');
        }).join('\n');
        // careers submissions (and their CVs) go to HR, everything else to info
        var to = (data.route_to && String(data.route_to).indexOf('@') !== -1)
          ? data.route_to
          : NOTIFY_EMAIL;
        MailApp.sendEmail(
          to,
          'Website enquiry — ' + (data.form || 'Form') + ' — ' + (data.name || ''),
          body
        );
      } catch (mailErr) { /* quota hit — the row is already saved */ }
    }

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Lets you confirm the deployment is live by opening the URL in a browser.
function doGet() {
  return json({ ok: true, status: 'Integrum lead endpoint is live' });
}

function getSheet_() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  return ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Optional: run this once from the Apps Script editor (select
 * "testInsert" and press Run) to confirm the sheet and permissions
 * work before deploying. It writes one row you can delete.
 */
function testInsert() {
  var sheet = getSheet_();
  sheet.appendRow(['Editor test — delete this row', new Date()]);
}

/**
 * Optional: run this once from the Apps Script editor (select "setupHeaders"
 * and press Run) to lay down the full set of column headers immediately,
 * before any real submission arrives. Safe to run even if the sheet already
 * has rows — it only touches row 1, and only adds columns, never removes any.
 */
function setupHeaders() {
  var sheet = getSheet_();

  // Check A1 directly rather than getLastRow()/getLastColumn() — those can
  // report a phantom non-empty extent from formatting alone (e.g. a bold/
  // coloured cell left over from a previous run whose value was cleared),
  // which produced a mismatched range width here. A1's actual value is
  // unambiguous: blank means "no headers written yet".
  var a1Empty = !String(sheet.getRange(1, 1).getValue() || '').trim();

  var labels, keys;
  if (a1Empty) {
    keys = FIELD_ORDER.slice();
    labels = keys.map(headerForKey_);
  } else {
    var lastCol = Math.max(1, sheet.getLastColumn());
    labels = sheet.getRange(1, 1, 1, lastCol).getValues()[0].filter(String);
    keys = labels.map(keyForHeader_);
    FIELD_ORDER.forEach(function (k) {
      if (keys.indexOf(k) === -1) { keys.push(k); labels.push(headerForKey_(k)); }
    });
  }

  var range = sheet.getRange(1, 1, 1, labels.length);
  range.setValues([labels]);
  range.setFontWeight('bold').setBackground('#014976').setFontColor('#ffffff');
  sheet.setFrozenRows(1);
}
