# Contract: POST /api/rsvp-submit

**Feature**: 013-song-suggestions | **Date**: 2026-04-22
**File**: `api/rsvp-submit.ts`

## Change Summary

The `guests` array gains an optional `song` field per guest. All other fields are unchanged.

## Request

```
POST /api/rsvp-submit
Headers:
  Content-Type: application/json
  X-Invite-Secret: <shared secret>

Body:
{
  "attending": boolean,
  "guests": Guest[]
}
```

### Guest object (updated)

```typescript
{
  name: string,           // required, non-empty
  type: "primary" | "plus-one",
  dietary?: string,       // optional, max 200 chars
  song?: string           // NEW optional, max 200 chars — omitted if blank
}
```

### Example payload (attending, 1 plus-one, both with song suggestions)

```json
{
  "attending": true,
  "guests": [
    {
      "name": "Alice Johnson",
      "type": "primary",
      "dietary": "vegetarian",
      "song": "Mr Brightside - The Killers"
    },
    {
      "name": "Bob Smith",
      "type": "plus-one",
      "song": "Dancing Queen"
    }
  ]
}
```

### Example payload (attending, no song suggestions)

```json
{
  "attending": true,
  "guests": [
    { "name": "Alice Johnson", "type": "primary" }
  ]
}
```

### Example payload (not attending — song field never present)

```json
{
  "attending": false,
  "guests": [
    { "name": "Alice Johnson", "type": "primary" }
  ]
}
```

## Response

Unchanged from existing contract.

```
200 OK  — RSVP recorded
400 Bad Request — validation failure (including song > 200 chars)
401 Unauthorized — missing/invalid secret
500 Internal Server Error — GAS write failure
```

## GAS Downstream Contract

The Vercel function POSTs to the GAS web app. The `rows` array now includes `song_suggestion` at index 10 of each row value array.

```typescript
// GAS request body (unchanged wrapper, updated rows)
{
  secret: string,
  rows: RsvpRow[]  // each row now has .song (string, may be empty)
}

// Sheet row written (columns A–K)
[timestamp, guest_name, attending, dietary, type, invite_source,
 is_child, age_range, seating_needs, safety_ack, song_suggestion]
```
