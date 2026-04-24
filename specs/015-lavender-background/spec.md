# Feature Specification: Lavender Background Styling

**Feature Branch**: `015-lavender-background`  
**Created**: 2026-04-24  
**Status**: Draft  
**Input**: User description: "I want a solid off white background and a background image stuck to the left that doesn't repeat. The background colour should blend with the image background"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Cohesive decorative background on page load (Priority: P1)

A visitor opens the wedding website and sees a cohesive, elegant visual design: a soft off-white page background with a lavender botanical illustration pinned to the left edge of the viewport, visible as they scroll through the content. The illustration's own background colour seamlessly matches the page background so there is no visible border or colour jump between image and page.

**Why this priority**: This is the core visual outcome; everything else depends on it being correct.

**Independent Test**: Open the page in a browser, resize to desktop and mobile widths, and scroll through all content. The lavender image should be visible along the left edge at all widths, should never tile, and the background colour should match the image background with no visible seam.

**Acceptance Scenarios**:

1. **Given** a visitor loads the site, **When** the page renders, **Then** the entire page background is a uniform off-white colour that matches the near-white background of the lavender illustration.
2. **Given** the page has rendered, **When** the visitor scrolls down, **Then** the lavender illustration remains fixed to the left edge of the viewport and does not scroll with the content.
3. **Given** the lavender illustration is displayed, **When** viewed at any zoom level, **Then** the illustration appears only once and does not tile or repeat horizontally or vertically.

---

### User Story 2 - No content overlap on narrow viewports (Priority: P2)

On smaller screens the lavender illustration should remain visible but must not overlap or obscure readable page content. The layout should degrade gracefully — the image may be partially clipped or hidden if it would otherwise cover text.

**Why this priority**: The decorative image must not harm usability on mobile devices.

**Independent Test**: Open the page on a viewport narrower than 480 px. Page text and interactive elements remain fully readable; the lavender image does not block any content.

**Acceptance Scenarios**:

1. **Given** a mobile viewport, **When** the page loads, **Then** all text content and interactive elements are fully readable without being obscured by the background illustration.
2. **Given** a viewport where showing the full illustration would overlap content, **When** the page renders, **Then** the illustration is clipped or reduced so content is unobstructed.

---

### Edge Cases

- What happens when the image file fails to load? The page should still display the off-white background without a broken-image placeholder.
- How does the background look when the browser is zoomed in significantly? The single image should remain in place and the background colour should fill the remainder of the page seamlessly.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The page background MUST be a solid off-white colour that visually matches the near-white background of the provided lavender illustration.
- **FR-002**: The lavender illustration MUST be positioned fixed to the left edge of the viewport so it does not move when the user scrolls.
- **FR-003**: The lavender illustration MUST appear exactly once and MUST NOT tile or repeat in any direction.
- **FR-004**: The background colour and the illustration background MUST blend seamlessly with no visible colour boundary or edge artefact.
- **FR-005**: If the illustration fails to load, the page MUST still display the correct off-white background without showing a broken-image indicator.
- **FR-006**: The illustration MUST NOT overlap or obscure readable page content on any viewport width.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A reviewer examining the page at desktop, tablet, and mobile breakpoints sees no visible colour seam between the lavender illustration and the page background.
- **SC-002**: The lavender illustration is visible exactly once on the page at all tested viewport widths with no tiling.
- **SC-003**: Scrolling the page at any tested viewport width leaves the illustration stationary at the left edge of the viewport throughout the full scroll range.
- **SC-004**: All body text and interactive controls remain readable and unobscured on viewports down to 320 px wide.
- **SC-005**: Disabling image loading in the browser leaves a clean off-white background with no broken-image icons visible.

## Assumptions

- The lavender botanical illustration provided by the user is the intended background decoration image.
- "Stuck to the left" means the illustration is fixed to the left side of the viewport and does not scroll with page content.
- The off-white background colour will be matched to the near-white background of the provided illustration (approximately `#f5f4f0` or similar); the exact value will be confirmed during implementation by sampling the image.
- The illustration is displayed at its natural size without stretching or scaling.
- This styling applies to all pages/routes of the site, not just the landing page.
