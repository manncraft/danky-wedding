# Quickstart: Add Dietary Requirements Field

**Branch**: `007-dietary-requirements` | **Date**: 2026-03-20

## What changes

Four files touched; no new files created; no new dependencies.

| File | Change |
|---|---|
| `src/types/rsvp.ts` | Add `dietary?: string` to `RsvpSubmitRequest` |
| `src/services/rsvpApi.ts` | Pass `dietary` in the POST body (when attending) |
| `src/components/RsvpLookup.tsx` | Render dietary field conditionally; clear on toggle |
| `api/rsvp-submit.ts` | Validate optional `dietary` field; trim before use |

## Implementation order

1. **Types** — update `RsvpSubmitRequest` (unblocks everything downstream)
2. **API stub** — add optional `dietary` validation
3. **API service** — pass `dietary` through `submitRsvp()`
4. **Frontend component** — render field, wire to form, handle clear-on-toggle

## Verification

```bash
# Start dev server
npm run dev

# In the RSVP flow:
# 1. Look up a guest
# 2. Select "Attending"
# 3. Verify the dietary field appears
# 4. Type a value
# 5. Toggle to "Not Attending" — verify field disappears and value is cleared
# 6. Toggle back to "Attending" — verify field reappears empty
# 7. Submit — verify no console errors

# Run linter
npm run lint
```

## No migration required

The backend is a stub with no persistence. The `dietary` field is optional, so no existing data is affected.
