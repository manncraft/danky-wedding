# Quickstart: GAS Google Sheet Guest Data Integration

**Branch**: `005-gas-sheet-integration` | **Date**: 2026-03-20

This guide covers everything needed to go from zero to live guest lookups backed by a real Google Sheet.

---

## Prerequisites

- A Google account (the one that owns the wedding spreadsheet)
- Access to the Vercel project dashboard
- The repo checked out locally

---

## Step 1 — Create the Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new spreadsheet.
2. Name the first tab **`Invites`** (exactly — the script is case-sensitive).
3. Add a header row in row 1:
   - **A1**: `Full Name`
   - **B1**: `Max Guests`
4. Add one row per invite group, starting at row 2:

   | A | B |
   |---|---|
   | Alice Johnson | 2 |
   | María García | 4 |
   | Tom & Sarah Williams | 4 |

   - Col A: The guest's full name as you want it displayed on screen
   - Col B: The maximum number of people in that invite group (positive integer)
   - Leave rows blank only to separate sections; blank rows are skipped

---

## Step 2 — Add the GAS Script

1. With the spreadsheet open, go to **Extensions → Apps Script**.
2. Delete all default code in the editor.
3. Open `gas/guest-lookup.gs` from this repository and **copy its entire contents** into the Apps Script editor.
4. Click **Save** (disk icon or Ctrl+S). Name the project anything you like (e.g. `danky-wedding-lookup`).

---

## Step 3 — Set the GAS Secret

1. In the Apps Script editor, go to **Project Settings** (gear icon, left sidebar).
2. Scroll to **Script Properties** and click **Add property**.
3. Add:
   - **Property**: `GUEST_SECRET`
   - **Value**: a long random string (e.g. generate with `openssl rand -base64 32`)
4. Click **Save script properties**.

> Keep this value — you will need it in Step 5 as `GAS_SECRET`.

---

## Step 4 — Deploy the GAS Web App

1. In the Apps Script editor, click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Set:
   - **Description**: `danky-wedding guest lookup`
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
4. Click **Deploy**.
5. Copy the **Web app URL** shown in the confirmation dialog.

> This URL is treated as a secret — it is the `GAS_ENDPOINT_URL` value.

---

## Step 5 — Set Vercel Environment Variables

In the [Vercel dashboard](https://vercel.com/dashboard), go to your project → **Settings → Environment Variables** and add:

| Variable | Value | Environment |
|---|---|---|
| `GAS_ENDPOINT_URL` | The web app URL from Step 4 | Production, Preview |
| `GAS_SECRET` | The `GUEST_SECRET` value from Step 3 | Production, Preview |
| `GAS_TIMEOUT_MS` | `6000` (or higher if cold starts are slow) | Production, Preview |

> `INTERNAL_SECRET` (the guest QR code secret) is unchanged and must remain set.

For local development, add the same variables to `.env.local` (this file is gitignored):

```
GAS_ENDPOINT_URL=https://script.google.com/macros/s/...
GAS_SECRET=your-secret-here
GAS_TIMEOUT_MS=6000
```

---

## Step 6 — Redeploy Vercel

Push the updated `api/rsvp.ts` to your main branch (or trigger a manual redeploy in the Vercel dashboard). The function will now call GAS on every lookup request.

---

## Step 7 — Verify

1. Open the RSVP page (use the Vercel preview URL).
2. Enter a guest name from your sheet.
3. Confirm the correct `max_guests` value is returned.
4. Add a new row to the sheet and verify it appears on the next lookup without redeployment.

---

## Updating the Script After Changes

If you modify `gas/guest-lookup.gs` in the repo:

1. Copy the updated code into the Apps Script editor.
2. Go to **Deploy → Manage deployments**.
3. Click the pencil icon on the existing deployment, set **Version** to "New version", and click **Deploy**.

The `GAS_ENDPOINT_URL` does not change between versions — no Vercel env update needed.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| "could not load guest list" on lookup | Wrong `GAS_ENDPOINT_URL` or `GAS_SECRET`, or GAS not deployed | Check env vars; re-run Step 4–5 |
| Request times out | GAS cold start > `GAS_TIMEOUT_MS` | Increase `GAS_TIMEOUT_MS` to `10000` in Vercel env |
| Guest not found (name is in sheet) | Tab not named exactly `Invites` | Rename the sheet tab |
| Old data returned after sheet edit | No caching is used — should not occur | Check the sheet was saved; try a hard refresh |
