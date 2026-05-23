# Feature Specification: Add to Calendar Button

**Feature Branch**: `017-add-to-calendar`  
**Created**: 2026-05-23  
**Status**: Draft  
**Input**: User description: "I want an 'add to calendar' button at the bottom of the 'date and time' section. This button should create a calendar invite that can be added to all common calendars (google, apple, microsoft/outlook etc.)"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Guest Adds Wedding to Google Calendar (Priority: P1)

A guest on a desktop or Android device reads the Date & Time section and wants to save the wedding to their Google Calendar so they don't forget the date.

**Why this priority**: Google Calendar is the most widely used calendar service globally and especially common on Android devices, which represent the majority of mobile users.

**Independent Test**: Can be fully tested by clicking "Add to Calendar", selecting the Google Calendar option, and confirming a new browser tab opens with the event pre-filled and ready to save.

**Acceptance Scenarios**:

1. **Given** a guest is viewing the Date & Time section, **When** they click "Add to Calendar", **Then** they see options for different calendar services including Google Calendar.
2. **Given** a guest selects Google Calendar, **When** the action completes, **Then** Google Calendar opens (in a new tab) with the event title, date, time, and venue address pre-filled.
3. **Given** a guest saves the event in Google Calendar, **When** they check their calendar, **Then** the event appears on Tuesday 12 January 2027 starting at 3:00pm.

---

### User Story 2 - Guest Adds Wedding to Apple or Outlook Calendar (Priority: P2)

A guest on an iPhone or using Outlook saves the wedding to their calendar by downloading a standard calendar file that their device or application opens automatically.

**Why this priority**: iPhone users represent a significant portion of guests and cannot add events via Google Calendar web links as easily; Outlook is common in corporate environments.

**Independent Test**: Can be tested by selecting the Apple Calendar or Outlook option and confirming a standard calendar file is downloaded containing the correct event details.

**Acceptance Scenarios**:

1. **Given** a guest selects Apple Calendar or Outlook from the calendar options, **When** the action completes, **Then** a calendar file is downloaded to their device.
2. **Given** a guest opens the downloaded file, **When** their calendar application processes it, **Then** the event is offered for import with the correct title, date, time, and location.
3. **Given** a guest on an iPhone taps the Apple Calendar option, **When** they confirm the event, **Then** it appears in their iOS Calendar on Tuesday 12 January 2027 at 3:00pm.

---

### Edge Cases

- A guest whose device does not have a supported calendar app installed still sees the option but may see a system error when their device cannot open the file — this is acceptable and outside the website's control.
- The button must be visible and tappable on small mobile screens without overlapping other content.
- All calendar options must be presented in a single interaction — the guest should not need more than two taps/clicks to start the add-to-calendar process.
- The event end time is assumed to be 10:00pm (reception ends) so the full event block is reserved in the guest's calendar.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: An "Add to Calendar" button MUST appear at the bottom of the Date & Time section, below the ceremony time and arrival guidance.
- **FR-002**: Clicking the button MUST present options for at least the following calendar services: Google Calendar, Apple Calendar, and Microsoft Outlook.
- **FR-003**: The Google Calendar option MUST open Google Calendar in a new browser tab with the following event details pre-filled: event name, date (Tuesday 12 January 2027), start time (3:00pm), end time (10:00pm), and venue address (Markovina Vineyard Estate, 84 Old Railway Road, Kumeū 0892).
- **FR-004**: The Apple Calendar and Outlook options MUST trigger the download of a standard calendar file containing the same event details as FR-003.
- **FR-005**: The standard calendar file produced for FR-004 MUST be compatible with Apple Calendar (macOS and iOS) and Microsoft Outlook.
- **FR-006**: The event details embedded in all calendar options MUST match the wedding details exactly: title "Becky & Daniel's Wedding", date 12 January 2027, start 3:00pm, end 10:00pm, location Markovina Vineyard Estate, 84 Old Railway Road, Kumeū 0892.
- **FR-007**: The feature MUST work without requiring the guest to be logged in or to submit any personal information — clicking a calendar option is sufficient.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A guest can go from seeing the Date & Time section to having the wedding saved in their calendar in two taps or fewer.
- **SC-002**: The feature supports at least three distinct calendar services: Google Calendar, Apple Calendar, and Microsoft Outlook.
- **SC-003**: The event details (title, date, start time, end time, location) are correct in every supported calendar service with zero manual editing required by the guest.
- **SC-004**: The button is visible and functional on a 375px-wide mobile viewport without layout overflow or accessibility issues.

## Assumptions

- The event details are: title "Becky & Daniel's Wedding", date Tuesday 12 January 2027, start 3:00pm NZDT, end 10:00pm NZDT, location Markovina Vineyard Estate, 84 Old Railway Road, Kumeū 0892, New Zealand.
- End time is 10:00pm (reception ends) so guests block the full event in their calendar.
- No account, login, or personal information is required from the guest to use this feature.
- "Other" calendar applications that support the same standard format used for Apple/Outlook are considered implicitly supported.
