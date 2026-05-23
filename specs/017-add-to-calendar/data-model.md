# Data Model: 017-add-to-calendar

## Event Constants

All wedding event details are compile-time constants. There is no runtime data, no API calls, and no user-supplied fields for this feature.

```typescript
// Hardcoded in AddToCalendar.tsx
const EVENT = {
  title: "Becky & Daniel's Wedding",
  dtStartUtc: "20270112T020000Z",   // 3:00pm NZDT (UTC+13)
  dtEndUtc:   "20270112T090000Z",   // 10:00pm NZDT (UTC+13)
  location:   "Markovina Vineyard Estate, 84 Old Railway Road, Kumeū 0892, New Zealand",
} as const;
```

## UI State

The only runtime state is whether the dropdown is open or closed.

```typescript
const [open, setOpen] = useState(false);
```

No persistence, no validation schema, no Zod types needed.

## Calendar Output Formats

### Google Calendar URL

Parameters passed as URL-encoded query string:

| Param | Value |
|---|---|
| `action` | `TEMPLATE` |
| `text` | `Becky & Daniel's Wedding` |
| `dates` | `20270112T020000Z/20270112T090000Z` |
| `location` | `Markovina Vineyard Estate, 84 Old Railway Road, Kumeū 0892, New Zealand` |

### ICS Payload (RFC 5545)

```
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Becky & Daniel's Wedding//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:becky-daniel-wedding-2027@danky-wedding
DTSTAMP:20260523T000000Z
DTSTART:20270112T020000Z
DTEND:20270112T090000Z
SUMMARY:Becky & Daniel's Wedding
LOCATION:Markovina Vineyard Estate\, 84 Old Railway Road\, Kumeū 0892\, New Zealand
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR
```

**Escaping rule**: commas in `LOCATION` are escaped as `\,` per RFC 5545 §3.3.11.
