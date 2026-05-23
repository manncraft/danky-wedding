# Research: 017-add-to-calendar

## Decision 1: Calendar format for Apple / Outlook

**Decision**: Generate ICS (iCalendar, RFC 5545) client-side as a plain string, trigger a `Blob` download.  
**Rationale**: ICS is the universal interchange format supported natively by Apple Calendar (macOS + iOS), Microsoft Outlook, and any other compliant calendar app. No library dependency required — the format is simple enough to construct manually.  
**Alternatives considered**: Third-party library (`add-to-calendar-button`) — rejected; unnecessary dependency for a small static payload; constitution mandates MVP discipline.

## Decision 2: Google Calendar integration

**Decision**: Construct a `calendar.google.com/calendar/render?action=TEMPLATE` URL and open it in a new tab.  
**Rationale**: Google Calendar offers a documented URL API that pre-fills event details. No OAuth, no API key, no backend. Opens a review-and-save flow in the user's logged-in Google session.  
**Alternatives considered**: None — this is the canonical approach; no viable pure-client alternative exists.

## Decision 3: UTC times for 12 January 2027 (NZDT = UTC+13)

**Decision**: Use UTC times in all calendar data: DTSTART `20270112T020000Z`, DTEND `20270112T090000Z`.  
**Rationale**: NZDT (UTC+13) applies in January (Southern Hemisphere summer, daylight saving active). 3:00pm − 13h = 02:00 UTC; 10:00pm − 13h = 09:00 UTC.  
**Alternatives considered**: TZID-based timestamps — more portable but adds VTIMEZONE block complexity; UTC is universally safe and simpler.

## Decision 4: UI pattern — dropdown from a single button

**Decision**: A single "Add to Calendar" button reveals a small dropdown listing three options (Google Calendar, Apple Calendar, Outlook). Closes on outside click or on selection.  
**Rationale**: FR-002 requires at least three options but SC-001 requires ≤ 2 taps. A dropdown satisfies both: tap 1 = open options, tap 2 = choose service.  
**Alternatives considered**: Three separate buttons — clutters the layout and wastes vertical space on mobile.

## Decision 5: No new npm packages

**Decision**: Implement entirely with React, TypeScript, and Tailwind. No calendar library dependency.  
**Rationale**: ICS format and Google Calendar URL are simple enough to hand-construct. Avoids supply-chain risk, bundle size increase, and dependency maintenance burden. Aligns with constitution Principle II (zero-cost) and IV (MVP discipline).

## Resolved technical details

| Item | Value |
|---|---|
| Google Calendar base URL | `https://calendar.google.com/calendar/render` |
| Google Calendar params | `action=TEMPLATE`, `text`, `dates` (`start/end` UTC), `location` |
| ICS content-type | `text/calendar;charset=utf-8` |
| ICS mandatory fields | `BEGIN/END VCALENDAR`, `VERSION`, `PRODID`, `BEGIN/END VEVENT`, `UID`, `DTSTAMP`, `DTSTART`, `DTEND`, `SUMMARY`, `LOCATION` |
| ICS comma escaping | `Kumeū 0892\, New Zealand` (backslash before comma) |
| Download trigger | `Blob` → `URL.createObjectURL` → `<a download>` click → `URL.revokeObjectURL` |
| DTSTART UTC | `20270112T020000Z` |
| DTEND UTC | `20270112T090000Z` |
| Event title | `Becky & Daniel's Wedding` |
| Location | `Markovina Vineyard Estate, 84 Old Railway Road, Kumeū 0892, New Zealand` |
