/**
 * danky-wedding — Guest Lookup GAS Web App
 * =========================================
 * Source of truth: gas/guest-lookup.gs in the repository.
 * Deploy manually by following the steps below.
 *
 * SHEET STRUCTURE
 * ---------------
 * Tab name : Invites  (case-sensitive — must match exactly)
 * Row 1    : Header row (skipped automatically)
 * Col A    : Full Name   — e.g. "Alice Johnson"
 * Col B    : Max Guests  — positive integer, e.g. 2
 *
 * Blank rows (empty col A) are skipped silently.
 * Non-numeric or blank col B defaults to 1.
 *
 * SETUP STEPS
 * -----------
 * 1. In the spreadsheet go to Extensions → Apps Script.
 * 2. Delete any default code, paste this entire file, save.
 * 3. Set the script secret:
 *      Project Settings (gear icon) → Script Properties → Add property
 *      Key:   GUEST_SECRET
 *      Value: a long random string  (e.g. `openssl rand -base64 32`)
 *      Save script properties.
 * 4. Deploy as a web app:
 *      Deploy → New deployment → Type: Web app
 *      Execute as : Me
 *      Who has access : Anyone
 *      → Deploy  (copy the Web app URL — this is GAS_ENDPOINT_URL)
 *
 * VERCEL ENVIRONMENT VARIABLES (server-side only)
 * ------------------------------------------------
 * GAS_ENDPOINT_URL  — the Web app URL from step 4
 * GAS_SECRET        — the GUEST_SECRET value from step 3
 *                     (MUST be a different secret from INTERNAL_SECRET)
 * GAS_TIMEOUT_MS    — optional; how long Vercel waits for this endpoint
 *                     before returning a 502 to the guest (default: 6000)
 *                     Increase to ~10000 if cold-start timeouts occur.
 *
 * UPDATING AFTER CODE CHANGES
 * ---------------------------
 * 1. Paste updated code into the Apps Script editor.
 * 2. Deploy → Manage deployments → edit → Version: New version → Deploy.
 *    The Web app URL stays the same; no Vercel env update needed.
 */

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

function doGet(e) {
  var secret = e && e.parameter && e.parameter.secret;
  var expected = PropertiesService.getScriptProperties().getProperty('GUEST_SECRET');

  if (!expected || secret !== expected) {
    return jsonResponse({ error: 'unauthorised' });
  }

  try {
    var guests = readGuests();
    return jsonResponse({ guests: guests });
  } catch (err) {
    return jsonResponse({ error: 'failed to read sheet: ' + err.message });
  }
}

// ---------------------------------------------------------------------------
// Sheet reader
// ---------------------------------------------------------------------------

function readGuests() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Invites');

  if (!sheet) {
    throw new Error('Sheet "Invites" not found');
  }

  var lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return []; // header only — no guest rows
  }

  var values = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
  var guests = [];

  for (var i = 0; i < values.length; i++) {
    var fullName = String(values[i][0]).trim();
    if (!fullName) continue; // skip blank rows

    var maxGuests = Number(values[i][1]);
    guests.push({
      full_name: fullName,
      max_guests: isNaN(maxGuests) || maxGuests < 1 ? 1 : maxGuests,
    });
  }

  return guests;
}

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function jsonResponse(data) {
  // GAS ContentService always returns HTTP 200.
  // Callers must inspect the body: check for `error` key OR absent/null `guests`.
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
