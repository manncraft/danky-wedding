# Research: GAS Google Sheet Guest Data Integration

**Branch**: `005-gas-sheet-integration` | **Date**: 2026-03-20

## Findings

### 1. Fetch timeout — AbortSignal.timeout()

**Decision**: Use `AbortSignal.timeout(ms)` rather than the manual `AbortController` + `setTimeout` pattern.

**Rationale**: Vercel serverless functions run on Node 18+, where `AbortSignal.timeout()` is available (added in Node 17.3). It is a single-expression form that is cleaner and avoids the `clearTimeout` bookkeeping of the manual pattern. If the signal fires, `fetch` rejects with a `TimeoutError` (a `DOMException` with `name === 'TimeoutError'`).

**Alternatives considered**: Manual `AbortController` + `setTimeout` — correct but verbose; `Promise.race` with a timer — no signal propagation, leaves the fetch pending.

---

### 2. GAS web app HTTP responses

**Decision**: GAS error detection uses a dual-body check: presence of `error` key OR missing/null `guests` field.

**Rationale**: Google Apps Script's `ContentService` can only set response body and MIME type. The HTTP status code is always 200 regardless of what the script does. A script that throws, receives a bad secret, or fails to read the sheet will still return HTTP 200. The Vercel function therefore cannot rely on HTTP status; it must inspect the JSON body. Using both checks (error key AND absent guests) is defensive against both intentional rejection signals and unexpected response shapes.

**Alternatives considered**: Check only `guests` absence — could confuse a legitimate empty guest list (zero rows) with an error; check only `error` key — script crash may produce no `error` key at all.

---

### 3. GAS web app authentication

**Decision**: Shared secret passed as a URL query parameter (`?secret=GAS_SECRET`). The GAS script reads it via `e.parameter.secret`.

**Rationale**: GAS web apps receive requests via the `doGet(e)` / `doPost(e)` event object. GET parameters are available via `e.parameter`. Arbitrary HTTP request headers are not accessible through `ContentService` web apps. A query parameter secret is therefore the only viable mechanism. `GAS_SECRET` is stored as a Vercel server-side environment variable and never appears in client-side code or the repo.

**Alternatives considered**: Authorization header — not accessible in GAS web app context; POST body secret — would require changing to `doPost`, adding complexity with no security benefit over a GET param for a read-only endpoint.

---

### 4. CORS

**Decision**: No CORS configuration needed on the GAS web app.

**Rationale**: The GAS endpoint is called exclusively from the Vercel serverless function (server-to-server). Browser CORS restrictions do not apply to server-side `fetch` calls. The Vercel function acts as the CORS boundary — the browser never sees the GAS URL.

---

### 5. GAS execution quota

**Decision**: No quota mitigation needed (no caching).

**Rationale**: Google's consumer Apps Script quota is 6 minutes of execution time per day. Reading a 200-row sheet takes approximately 0.2–0.5 seconds per invocation. Even with 500 guest lookups in a single day (very high estimate for a wedding), that is ~250 seconds — well under the 360-second daily cap. Per the spec assumption, no caching is required.

**Alternatives considered**: In-memory cache in the Vercel function — would persist only within a single function instance lifecycle (seconds to minutes); external cache (Redis, KV) — violates the Zero-Cost constitution principle.

---

### 6. GAS script language and runtime

**Decision**: Write the repo copy as plain JavaScript (`.gs` extension) targeting Google's V8 runtime (enabled by default since 2020).

**Rationale**: GAS uses its own V8-based runtime. The script file cannot be TypeScript. Modern JS (const/let, arrow functions, template literals) is supported under V8 runtime. The script should be ES2019-compatible to avoid any edge cases.

**Alternatives considered**: Using clasp (GAS CLI) with TypeScript — introduces a build step and external tooling dependency that the couple cannot maintain; out of scope per MVP discipline.
