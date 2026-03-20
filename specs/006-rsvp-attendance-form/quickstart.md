# Quickstart: RSVP Attendance Form

**Branch**: `006-rsvp-attendance-form` | **Date**: 2026-03-20

---

## What this feature adds

After the guest name lookup confirms a match, the RSVP screen now shows an inline attendance form where the guest selects Attending or Not Attending and submits. The backend endpoint stubs a success response.

---

## Prerequisites

- Features 001–005 implemented and working
- `INTERNAL_SECRET` environment variable set in Vercel (already required by 004)
- Local dev server running (`npm run dev` from repo root)

---

## Files changed / added

| File | Change |
|------|--------|
| `src/types/rsvp.ts` | Add `RsvpSubmitRequest`, `RsvpSubmitResponse` |
| `src/services/rsvpApi.ts` | Add `submitRsvp(guestName, attending, secret)` |
| `src/components/RsvpLookup.tsx` | Replace "coming soon" in `confirmed` state; add `rsvp-submitted` state |
| `api/rsvp-submit.ts` | New Vercel function — validates secret, stubs `{ status: 'ok' }` |

---

## Testing the flow locally

1. Open the app and click **RSVP** in the nav
2. Enter a guest name that exists in the Google Sheet
3. Confirm the match — the attendance form should appear inline
4. Select **Attending** or **Not Attending**
5. Click **Submit**
6. Confirmation message should appear inline with your name and choice
7. Refresh the page → you should be back at the lookup form (session resets)

### Testing the stub endpoint directly

```bash
curl -X POST http://localhost:3000/api/rsvp-submit \
  -H "Content-Type: application/json" \
  -H "X-Invite-Secret: <your INTERNAL_SECRET>" \
  -d '{"guest_name":"Jane Smith","attending":true}'
# Expected: {"status":"ok"}

# Missing secret → 401
curl -X POST http://localhost:3000/api/rsvp-submit \
  -H "Content-Type: application/json" \
  -d '{"guest_name":"Jane Smith","attending":true}'

# Invalid body → 400
curl -X POST http://localhost:3000/api/rsvp-submit \
  -H "Content-Type: application/json" \
  -H "X-Invite-Secret: <your INTERNAL_SECRET>" \
  -d '{"guest_name":""}'
```

---

## Environment variables

No new environment variables are required. The existing `INTERNAL_SECRET` covers the new endpoint.
