# OpsPilot frontend progress

Updated: 13 November 2026. Canonical location: `D:\GITHUB\OPS-Pilot\main\opspilot-frontend`.
The obsolete `dev\opspilot-frontend` path does not exist. The old `dev\front-end` and backend were inspected only and remain unchanged.

## Audit and roadmap

1. Foundation: implement theme, providers, router, shared primitives. Implemented; build/lint validated.
2. Authentication: integrate verified login, memory session, protected/guest routes. Implemented; successful authentication still needs authorized test credentials.
3. Layout: sidebar independent scrolling, fixed header/footer, collapse, mobile dialog, topbar. Implemented; interactive/viewport QA pending.
4. Dashboard: reference-informed composition and theme-aware sample charts. Implemented only as clearly labeled demonstration; live metrics blocked.
5. Core modules: route and honest integration-pending screen for Departments, Employees, Projects, Tasks. CRUD and actual data blocked by missing contracts.
6. Business modules: same boundary for CRM, Finance, Inventory, Documents.
7. Enterprise modules: planned capabilities, analytics integration status, disabled AI composer, notification availability dialog, local appearance settings. Backend operations blocked.
8. Engineering: build/lint/tests, accessibility and responsive implementation, documentation. Automated checks pass; complete mobile/browser QA remains outstanding.

## Implemented frontend behavior

- Early inline theme initialization before React; dark fallback, validated saved preference, blocked-storage handling.
- Shared typed ThemeProvider/useTheme, localStorage persistence, cross-tab synchronization, login/topbar/settings controls.
- Central Axios client, configurable API URL, credentials/cookies, in-memory Bearer header, timeout and safe error handling.
- Verified `POST /api/v1/auth/login` integration, runtime response validation, React Hook Form validation, password visibility, remember-me request flag, submission/error feedback.
- No fabricated success or credentials. Memory-only session expires after server-supplied lifetime and on a protected request's 401. Query cache cleared on session change.
- Guest login redirects authenticated users; protected routes return to login and preserve the intended internal path.
- Public `/preview/*` workspace uses sample data only and grants no session or backend access.
- Sidebar flex layout: nonshrinking header/footer, `flex: 1; min-height: 0; overflow-y: auto` navigation. Workspace scrolls separately.
- Persistent desktop collapse, active navigation, labeled icon links, modal mobile drawer with native focus containment and Escape dismissal.
- Page search navigates across application modules. Profile menu, pending notification dialog, not-found state, error boundary, lazy dashboard loading.
- Sample dashboard: four metrics, selectable revenue period, accessible revenue table, project distribution, task completion, department chart/data, sample activity/deadlines, real navigation links.
- All thirteen requested navigation destinations exist. Unavailable capabilities are labeled planned; no fabricated records, forms, CRUD, exports, uploads, or AI responses.
- Settings: working local appearance preferences; read-only identity and clearly pending notifications, security, organization, and account preferences.
- Extensible fail-closed authorization helper supports Admin, HR, future roles, and explicit permissions. Not wired to an invented role response; navigation currently exposes only nonmutating screens.
- Standard CSS/CSS Modules, centralized tokens, reduced-motion support, labels, focus states, native dialogs, skip link, chart summaries.

## Verified backend boundary

Inspected `dev/backend/src/auth/{auth.controller.ts,auth.service.ts,dto/login.dto.ts}` and `src/main.ts`. Live Swagger at `http://localhost:3000/api/docs-json` also lists only login.

- Request: `{ email: string, password: string, rememberMe?: boolean }`.
- Success: `{ success: true, message, data: { accessToken, tokenType: 'Bearer', expiresIn: 900, user: { id, email, firstName, lastName } } }`.
- Refresh cookie: HttpOnly, backend-controlled secure/sameSite settings, scoped to `/api/v1/auth`.
- No refresh, current-user, server logout, permissions, tenant, notification, or module endpoints found. No endpoints invented.
- Remember-me is passed to backend for refresh-cookie duration; session restoration cannot operate until a refresh contract exists. Reloading requires sign-in.
- “End browser session” clears memory only; it cannot revoke the server refresh cookie without an endpoint.

## Assets and decisions

- Existing global tokens preserved and extended; Vite starter stylesheet imports removed to prevent conflicting layout/theme rules.
- Original screenshots and a standalone official logo were not found. The old frontend's embedded SVG marks differ between screens, so no official logo was inferred or redrawn. Text wordmark used pending an approved asset.
- Inspected and copied the existing Earth image from old frontend; no generated imagery.
- Added only approved runtime packages: React Router, Axios, TanStack Query, React Hook Form, Recharts, Lucide React. GSAP omitted because CSS/native interactions suffice.
- TanStack Query provider is ready for verified server queries; no fake business queries added.
- Prettier used as an ephemeral formatting tool; no new formatter runtime dependency.

## Test status and known limitations

- Production build and lint passed after the auth-service and responsive refinements.
- All 24 automated tests passed: seven startup-theme cases, twelve login-contract validation cases, five authorization-policy cases.
- Local frontend HTTP 200 and transformed App module HTTP 200 verified. Backend Swagger HTTP 200.
- A single deliberately invalid login using `frontend-qa@example.invalid` returned expected 401 `INVALID_CREDENTIALS` from the real backend. No account was created.
- Observed a signed-in dashboard in the user's existing session; credentials were not read or entered by the agent. Successful-login automation, remember-cookie behavior, authenticated expiry flow, and role authorization remain untested.
- Browser host unavailable; native Edge UI verification subsequently succeeded. Verified light topbar toggle, dark Settings selection, Settings navigation, collapse/expand, independent workspace scrolling, fixed Settings footer during overflow, sample dashboard navigation, charts in both themes, accessible revenue table opening, and notification dialog opening/Escape dismissal. Desktop dark/light screenshots inspected. Mobile viewport, reload persistence, complete keyboard/focus, API error UI, and console-error QA remain outstanding.
- Existing Vite resolver cached missing packages during installation; touching configuration to trigger restart restored module HTTP 200. No config content changes.
- npm audit reports ten moderate development-tool advisories rooted in minimatch via ESLint/TypeScript ESLint. No high/critical advisories. Do not force major tooling downgrades automatically; review compatible upstream fixes.
- Google Fonts requires network availability; sans-serif fallbacks remain available.

## Remaining work

Obtain approved logo/screenshots, authorized test account, and actual business/session/permission contracts. Then wire supported data views/forms, query/mutation behavior, role visibility and action gates, notifications, uploads/exports, and AI/BI integrations. Finish browser-based responsive/accessibility/interaction QA and review dependency advisories before a production-readiness claim.

This is a functional frontend foundation and demonstrator, not a complete production enterprise system.
