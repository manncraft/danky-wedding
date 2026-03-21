# danky-wedding Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-03-21

## Active Technologies
- TypeScript 5.9 / React 19 + React 19, Vite 8, Tailwind CSS v4, react-hook-form (to be installed) (002-rsvp-dummy)
- N/A — no data persistence (002-rsvp-dummy)
- TypeScript 5.9 + React 19, Vite 8, Tailwind CSS v4, react-hook-form 7, `@vercel/node` (devDep, new) (003-rsvp-backend-stub)
- None — canned data hard-coded in function (003-rsvp-backend-stub)
- `sessionStorage` (client-side, tab-scoped); Vercel Environment Variable (server-side) (004-qr-secret-auth)
- TypeScript 5.9 (Vercel function) / JavaScript ES2019 (GAS script) + `@vercel/node` (already installed), Google Apps Script runtime (V8, managed by Google) (005-gas-sheet-integration)
- Google Sheets (external, zero-cost) — no new persistent storage added to the project (005-gas-sheet-integration)
- TypeScript 5.9 (frontend + Vercel function) + React 19, Vite 8, Tailwind CSS v4, react-hook-form 7, Zod, `@vercel/node` (006-rsvp-attendance-form)
- N/A — backend stubs success; no persistence in this iteration (006-rsvp-attendance-form)
- TypeScript 5.9 (frontend + Vercel function) + React 19, react-hook-form 7, Zod, `@vercel/node` (007-dietary-requirements)
- N/A — backend stub; no persistence in this iteration (007-dietary-requirements)
- TypeScript 5.9 (frontend + Vercel function) + React 19, Vite 8, Tailwind CSS v4, react-hook-form 7 + useFieldArray, `@vercel/node` (008-multi-guest-rsvp)
- N/A — backend stub only; no persistence in this iteration (008-multi-guest-rsvp)
- TypeScript 5.9 (Vercel function) / Google Apps Script (V8 runtime, managed by Google) + `@vercel/node` (existing), Google Apps Script Spreadsheet Service (built-in) (009-rsvp-sheet-persistence)
- Google Sheets — existing `Invites` sheet unchanged; new `RSVPs` sheet appended (009-rsvp-sheet-persistence)

- TypeScript 5.9 / React 19 + React 19, Vite 8, Tailwind CSS v4 (to be installed) (001-landing-page)

## Project Structure

```text
backend/
frontend/
tests/
```

## Commands

npm test && npm run lint

## Code Style

TypeScript 5.9 / React 19: Follow standard conventions

## Recent Changes
- 009-rsvp-sheet-persistence: Added TypeScript 5.9 (Vercel function) / Google Apps Script (V8 runtime, managed by Google) + `@vercel/node` (existing), Google Apps Script Spreadsheet Service (built-in)
- 008-multi-guest-rsvp: Added TypeScript 5.9 (frontend + Vercel function) + React 19, Vite 8, Tailwind CSS v4, react-hook-form 7 + useFieldArray, `@vercel/node`
- 007-dietary-requirements: Added TypeScript 5.9 (frontend + Vercel function) + React 19, react-hook-form 7, Zod, `@vercel/node`


<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
