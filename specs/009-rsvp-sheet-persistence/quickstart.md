# Quickstart: Testing RSVP Sheet Persistence

**Feature**: 009-rsvp-sheet-persistence

---

## Prerequisites

- Google Sheet with `Invites` tab already set up (feature 005)
- GAS script deployed (same deployment as feature 005; you'll redeploy after adding `doPost`)
- Vercel environment variables already set: `INTERNAL_SECRET`, `GAS_ENDPOINT_URL`, `GAS_SECRET`, `GAS_TIMEOUT_MS`

---

## 1. Update and Redeploy the GAS Script

After the `doPost` handler is added to `gas/guest-lookup.gs`:

1. Open the Google Apps Script editor (Extensions → Apps Script from the Google Sheet).
2. Paste / sync the updated `guest-lookup.gs` content.
3. Click **Deploy → Manage deployments → Edit** (pencil icon on the existing web app deployment).
4. Under **Version**, select **"New version"**.
5. Click **Deploy**.
6. The web app URL (`GAS_ENDPOINT_URL`) stays the same — no Vercel env var update needed.

---

## 2. Verify the GAS doPost Handler Directly

Test from a terminal (replace `<URL>` and `<SECRET>` with your values):

```bash
curl -s -X POST "<GAS_ENDPOINT_URL>" \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "<GAS_SECRET>",
    "rows": [{
      "timestamp": "2026-03-21T12:00:00.000Z",
      "guest_name": "Test Guest",
      "attending": "yes",
      "dietary": "none",
      "type": "Primary",
      "invite_source": "Test Guest",
      "is_child": "",
      "age_range": "",
      "seating_needs": "",
      "safety_ack": ""
    }]
  }'
```

**Expected response**: `{"status":"ok","rowsWritten":1}`

**Then open the Google Sheet** — you should see a new `RSVPs` tab with a header row and one data row.

---

## 3. Run Unit Tests

```bash
npm test
```

Covers the row-flattening logic in `api/rsvp-submit.ts` (attending=true multi-guest, attending=false primary-only, invite_source propagation, type capitalisation).

---

## 4. End-to-End Test via the RSVP Form

1. Start the dev server: `npm run dev`
2. Open the app with a valid invite secret in the URL.
3. Look up a guest who has `max_guests > 1`.
4. Submit the RSVP with attending = yes, a dietary note, and one plus-one.
5. Confirm the confirmation screen is shown.
6. Open the Google Sheet → RSVPs tab.
7. Verify: **two new rows** appear, both with the same `timestamp` and `invite_source`. First row is `type=Primary`, second is `type=Plus-One`.

---

## 5. Test the Decline Path

1. Repeat step 2–3 above with a different guest.
2. Submit with attending = no.
3. Confirm confirmation screen shown.
4. In the RSVPs sheet: **one new row** with `attending=no`, `type=Primary`.

---

## 6. Test Error Handling

To verify the form preserves data on failure:

1. Temporarily set `GAS_ENDPOINT_URL` to an invalid URL in `.env.local`.
2. Restart dev server, submit an RSVP.
3. Confirm: error message shown, form still populated, no navigation away.
4. Restore the correct URL and retry — submission should succeed.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `{"error":"unauthorised"}` from GAS | `GAS_SECRET` mismatch | Check Vercel env var vs GAS script property `GUEST_SECRET` |
| 502 from `/api/rsvp-submit` | GAS timeout or error | Check Vercel function logs; check GAS execution log in Apps Script editor |
| Header row duplicated in sheet | `doPost` not checking row count | Verify GAS handler checks `sheet.getLastRow() === 0` before writing header |
| `doGet` stops working after adding `doPost` | Syntax error in script | Check GAS editor for errors; `doGet` and `doPost` must both be valid functions |
| Rows written but `invite_source` blank | Vercel flattening bug | Check that `guests[0].name` is passed as `invite_source` on all rows |
