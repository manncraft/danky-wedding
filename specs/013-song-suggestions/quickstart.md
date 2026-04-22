# Quickstart: Testing Guest Song Suggestions

**Feature**: 013-song-suggestions | **Date**: 2026-04-22

## Prerequisites

- Existing local dev setup working (`npm run dev`)
- GAS deployed and connected (env vars set: `GAS_ENDPOINT_URL`, `GAS_SECRET`)
- Valid QR secret in URL or sessionStorage

## Manual Test Walkthrough

### 1. Primary guest, attending, with song suggestion

1. Open the RSVP form and complete the name lookup.
2. Select **Attending: Yes**.
3. Confirm a "Song suggestion" field appears below the dietary field.
4. Enter a value, e.g. `Mr Brightside - The Killers`.
5. Submit the form.
6. Open the RSVPs Google Sheet — verify column K "Song Suggestion" on the primary guest row contains `Mr Brightside - The Killers`.

### 2. Primary guest, attending, no song suggestion

1. Complete lookup → select **Attending: Yes**.
2. Leave the song suggestion field blank.
3. Submit.
4. Verify column K on the guest's row is blank (not an error).

### 3. Primary guest, not attending

1. Complete lookup → select **Attending: No**.
2. Verify the song suggestion field is **not visible**.
3. Submit.
4. Verify the guest row has no value in column K (blank).

### 4. Multi-guest RSVP with mixed suggestions

1. Complete lookup for a primary guest whose party has 2+ people.
2. Select **Attending: Yes** and add an additional guest.
3. Enter a song suggestion for the primary guest; leave additional guest's song blank.
4. Submit.
5. Verify:
   - Primary guest row: column K = entered song.
   - Additional guest row: column K = blank.

### 5. Validation — max length

1. Paste 201+ characters into the song suggestion field.
2. Verify an inline validation error appears and the form cannot be submitted.

## Running Tests

```bash
npm test
npm run lint
```
