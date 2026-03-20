<!--
SYNC IMPACT REPORT
==================
Version change: (unversioned template) → 1.0.0
New constitution — initial ratification from PRD + tech-spec docs.

Principles added:
  I.   Guest-First, Mobile-First UX
  II.  Zero-Cost Serverless Architecture
  III. Privacy & Security by Design
  IV.  MVP Discipline (Simplicity Over Completeness)
  V.   Admin Visibility & Data Integrity

Sections added:
  - Locked Tech Stack
  - Governance

Templates reviewed:
  ✅ .specify/templates/plan-template.md — Constitution Check section present; no updates needed,
     gates will be project-specific per feature.
  ✅ .specify/templates/spec-template.md — structure compatible; no updates needed.
  ✅ .specify/templates/tasks-template.md — phase/path conventions compatible; no updates needed.

Deferred TODOs:
  - RATIFICATION_DATE set to today (2026-03-20) as first constitution creation date.
  - Wedding date and venue address not yet known; relevant to info-module features only.
    Add to docs when available.
-->

# Danky Wedding Micro-Site Constitution

## Core Principles

### I. Guest-First, Mobile-First UX

Every UI decision MUST optimise for a guest scanning a QR code on a phone with
variable connectivity and low patience. Specifically:

- All layouts MUST be mobile-first; desktop is an enhancement, not the baseline.
- Guests MUST NOT be required to create an account or remember a password.
- Loading states (skeleton loaders or spinners) MUST be present on any operation
  that hits a network endpoint, to mask serverless cold-start latency.
- The end-to-end RSVP flow MUST be completable without external help; if a guest
  needs to text the couple, the UX has failed.
- Dark mode is SHOULD (preferred for late-night use); offline PWA caching of the
  schedule and venue address is a stretch goal, not a blocker.

**Rationale**: 90 % of guests arrive via QR code on a phone. A single confusing
step will generate support messages to the couple on their wedding day.

### II. Zero-Cost Serverless Architecture

The system MUST NOT introduce infrastructure with ongoing hosting costs or
operational overhead. The locked architecture is:

- **Client**: React + Vite, hosted on Vercel (free tier).
- **API Proxy**: Vercel Serverless Function — the only layer that holds secrets.
- **Data store**: Google Sheets + Google Apps Script (doGet / doPost).

No relational database, no managed auth service, and no paid third-party
integrations may be added without explicit re-ratification of this constitution.

**Rationale**: The site has a finite lifespan (pre/post-wedding) and is
maintained by non-engineers. Zero marginal cost and zero ops burden are
non-negotiable constraints.

### III. Privacy & Security by Design

Guest data MUST be protected through layered controls:

- **Two-tier access**: Tier 1 — shared secret via URL param (from QR code).
  Tier 2 — first-initial + last-name lookup returning only that guest's own
  record (`max_guests`, `full_name`, group display name).
- Guests MUST NOT be able to enumerate or view other guests' names or records.
- All secrets (`GOOGLE_SCRIPT_URL`, `INTERNAL_SECRET`) MUST be stored as Vercel
  Environment Variables and MUST NOT appear in client-side code or version
  control.
- All name lookups MUST be normalised (lowercase, trimmed, special characters
  stripped) before matching to prevent trivial bypass.
- CORS for GAS MUST be handled by the Vercel proxy, not by the client.

**Rationale**: Guest list privacy is a social expectation. Credential exposure
via a public repo or client bundle would be a serious breach of trust.

### IV. MVP Discipline — Simplicity Over Completeness

Features outside the defined MVP scope MUST NOT be built. The following are
explicitly out-of-scope and MUST be resisted even if technically trivial:

- Automated RSVP confirmation emails.
- In-app RSVP editing (guests MUST contact the couple or re-submit).
- Automated de-duplication (handled manually in Google Sheets).
- Complex authentication (no OAuth, no magic links, no session management
  beyond the shared-secret cookie/param).

New scope MUST be added to the PRD (`docs/prd.md`) before any implementation
begins. The test for whether something belongs in MVP: *does removing it cause
a guest to fail to RSVP or the couple to lose critical headcount data?*

**Rationale**: This is a one-time event site. Gold-plating costs real time and
introduces real bugs. Every hour spent on out-of-scope features is an hour not
spent on polish and reliability of the core flow.

### V. Admin Visibility & Data Integrity

The Google Sheet is the primary interface for the couple and vendors. All
backend writes MUST optimise for human readability in Sheets:

- The GAS MUST write **one row per person** (data flattening), not one row per
  RSVP submission.
- The `Invites` sheet is the source of truth for allowed guests; the `RSVPs`
  sheet is an append-only log.
- The RSVP schema MUST capture all fields required by catering vendors:
  `guest_name`, `dietary`, `type` (Primary / Plus-One), `invite_source`,
  `is_child`, `age_range`, `seating_needs`, `safety_ack`, `timestamp`.
- Zero "mystery guests" (rows with no matching `invite_source`) is a hard
  success criterion.

**Rationale**: Non-technical stakeholders (fiancée, caterers, planners) rely
on the Sheet directly. Unreadable or incomplete data defeats the entire purpose
of the backend.

## Locked Tech Stack

The following stack is fixed for the lifetime of this project. Substitutions
require constitution amendment.

| Layer | Choice | Notes |
|---|---|---|
| Frontend framework | React 18 + Vite | SPA, no SSR needed |
| Styling | Tailwind CSS | Utility-first; no CSS-in-JS |
| Form management | react-hook-form + useFieldArray | Dynamic plus-one fields |
| Validation | Zod | Schema-first, shared types |
| Hosting | Vercel | Free tier; serverless functions included |
| Backend / DB | Google Sheets + Google Apps Script | Zero cost; admin-friendly |
| State (if needed) | Redux Toolkit (already installed) | Use only if cross-cutting state required |

## Governance

- This constitution supersedes all other written and verbal agreements about
  project scope, architecture, or technical approach.
- **Amendments** require: (1) updating `docs/prd.md` or `docs/tech-spec.md`,
  (2) incrementing `CONSTITUTION_VERSION` per semver rules, and (3) updating
  `LAST_AMENDED_DATE`.
- **Versioning policy**: MAJOR = principle removal or redefinition;
  MINOR = new principle or section added; PATCH = clarifications or wording.
- **Compliance**: Every implementation plan (`plan.md`) MUST include a
  Constitution Check section that gates work against the five principles above.
- Any complexity that violates Principle IV MUST be justified in the plan's
  Complexity Tracking table before work begins.

**Version**: 1.0.0 | **Ratified**: 2026-03-20 | **Last Amended**: 2026-03-20
