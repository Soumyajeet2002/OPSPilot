# OpsPilot frontend

React, TypeScript, Vite, standard CSS and CSS Modules.

Canonical workspace: D:\GITHUB\OPS-Pilot\main\opspilot-frontend

## Run locally

Use Node.js 22.12+ (Node 24 recommended) and npm.

```powershell
npm.cmd install
npm.cmd run dev
```

Open http://localhost:5173/login. The existing backend is expected at http://localhost:3000/api/v1. Copy .env.example to .env.local only if you need to override VITE_API_BASE_URL. Environment variables in Vite are public: never place secrets there.

The development server may need restarting after dependencies are installed. No backend code is changed by this frontend.

## Available experiences

- /login: real backend login form, global theme switch, validation and API errors.
- /preview/dashboard: public, explicitly labeled sample dashboard. No authenticated session or enterprise data is provided by preview mode.
- /preview/settings: persistent browser appearance settings.
- /dashboard and other root module routes: require a successful in-memory login.
- Module screens clearly identify pending integrations. They do not simulate business operations.

Only the login API exists in the accessible backend. Tokens stay in memory. Page reload requires another login because refresh/current-user contracts are absent. End browser session clears local memory; server revocation requires backend support. Remember-me is sent to the backend but cannot restore the frontend until a refresh endpoint exists.

## Validation

```powershell
npm.cmd test
npm.cmd run lint
npm.cmd run build
```

Tests exercise the actual inline theme startup script, runtime authentication response validation, and fail-closed permission policy. They do not replace browser or authenticated integration tests.

## Source organization

- src/app: router composition support, navigation definitions, global providers
- src/theme: typed theme context/provider and reusable hook
- src/features/auth: API contract validation, service, session provider, login, future authorization policy
- src/layouts: shared enterprise shell and independent sidebar/workspace scrolling
- src/features/dashboard: lazy-loaded dashboard and isolated, labeled demo fixtures
- src/features/modules: honest pending-integration screens and AI workspace
- src/features/settings: local appearance and read-only/pending account sections
- src/components: shared controls, dialog, brand text, headers, error boundary
- src/lib: shared Axios transport and error mapping
- src/styles/global.css: authoritative tokens and shared primitives

See FRONTEND_PROGRESS.md for verified contracts, current test evidence, missing assets, and remaining work. The previous frontend and backend are retained unchanged. No deployment has been performed.
