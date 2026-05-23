# Quickstart: 017-add-to-calendar

## What is being built

A self-contained `AddToCalendar` React component added to the existing `DateAndTime` section. It renders a button that opens a dropdown with three calendar service options (Google Calendar, Apple Calendar, Outlook). No backend, no new packages.

## Files changed

| File | Change |
|---|---|
| `src/components/AddToCalendar.tsx` | New component (button + dropdown) |
| `src/components/sections/DateAndTime.tsx` | Import and render `<AddToCalendar />` at the bottom |

## Run the dev server

```bash
cd /home/coder/danky-wedding/frontend
npm run dev
```

## Manual test checklist

1. Navigate to the Date & Time section on the landing page.
2. Click "Add to Calendar" → dropdown appears with three options.
3. Click elsewhere → dropdown closes.
4. **Google Calendar**: click option → new tab opens at `calendar.google.com` with event pre-filled (title, dates, location visible before saving).
5. **Apple Calendar**: click option → `.ics` file downloads; open it → calendar app offers to add event with correct details.
6. **Outlook**: click option → same `.ics` file downloads (same content, same outcome).
7. Resize to 375px width → button and dropdown remain readable with no overflow.

## Key constants to verify

| Field | Expected value |
|---|---|
| Event title | Becky & Daniel's Wedding |
| Date | Tuesday 12 January 2027 |
| Start | 3:00pm NZDT (02:00 UTC) |
| End | 10:00pm NZDT (09:00 UTC) |
| Location | Markovina Vineyard Estate, 84 Old Railway Road, Kumeū 0892, New Zealand |
