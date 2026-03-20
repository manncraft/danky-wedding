# danky-wedding Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-03-20

## Active Technologies
- TypeScript 5.9 / React 19 + React 19, Vite 8, Tailwind CSS v4, react-hook-form (to be installed) (002-rsvp-dummy)
- N/A — no data persistence (002-rsvp-dummy)
- TypeScript 5.9 + React 19, Vite 8, Tailwind CSS v4, react-hook-form 7, `@vercel/node` (devDep, new) (003-rsvp-backend-stub)
- None — canned data hard-coded in function (003-rsvp-backend-stub)
- `sessionStorage` (client-side, tab-scoped); Vercel Environment Variable (server-side) (004-qr-secret-auth)
- TypeScript 5.9 (Vercel function) / JavaScript ES2019 (GAS script) + `@vercel/node` (already installed), Google Apps Script runtime (V8, managed by Google) (005-gas-sheet-integration)
- Google Sheets (external, zero-cost) — no new persistent storage added to the project (005-gas-sheet-integration)

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
- 005-gas-sheet-integration: Added TypeScript 5.9 (Vercel function) / JavaScript ES2019 (GAS script) + `@vercel/node` (already installed), Google Apps Script runtime (V8, managed by Google)
- 004-qr-secret-auth: Added TypeScript 5.9 + React 19, Vite 8, Tailwind CSS v4, react-hook-form 7, `@vercel/node`
- 003-rsvp-backend-stub: Added TypeScript 5.9 + React 19, Vite 8, Tailwind CSS v4, react-hook-form 7, `@vercel/node` (devDep, new)


<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
