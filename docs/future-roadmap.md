# Mobile roadmap

## Done — foundation (this PR)

- Expo SDK 53 + Expo Router, path aliases, env via `app.json` extras.
- Centralized api client with auth + tenant + timeout + normalized errors.
- Auth store (Zustand) + session bootstrap + secure-store persistence.
- RBAC primitive — typed capabilities + `usePermissions` with default-deny.
- Push foundation — permission, token registration, foreground + tap routing.
- Scanner foundation — parser, opaque-token resolver stub, camera screen, debounce, permission states.
- Tasks module — list, detail, timeline, transition, comment.
- Home / Notifications / Profile / Settings / Buildings switcher screens.
- i18n scaffolding (en/ru/he) with RTL flag.
- Shared UI kit — Button, Input, Card, Badge, EmptyState, ErrorBlock, Loader, SectionHeader, Screen.
- Docs: architecture, auth, push, scanner, rbac, api, folder structure, this roadmap.

## Phase 1 — wire backend

Each item unlocks real data in the client. Ordered by impact.

1. **`capabilities[]` on `/v1/auth/me`** — without this, RBAC is fully closed.
2. **`/v1/tasks` unified endpoint family** — list/detail/timeline/transition/comments. Today the web client reads task-equivalents from PPM executions + approvals; mobile needs a thinner surface.
3. **`POST /v1/scanner/resolve`** — opaque-token resolver. Mobile has the client path built; backend needs the route.
4. **`/v1/notifications/devices` (register/unregister)** — push notifications don't reach users until this ships.
5. **Presigned upload** — unblocks evidence attachment flows from mobile.

## Phase 2 — feature build-out

- **Attachments / photo pickers** for tasks and inspections. Scaffolding tokens already in UI.
- **Offline-aware forms** — draft persistence for comment + status-change so field users don't lose input on flaky LTE.
- **Inspections / checklists module** — new domain folder with question/answer state, submission.
- **Cleaning flow (authenticated side)** — distinct from the public-QR flow, for staff.
- **Incidents / reactive work** — mobile-first creation from the scanner.
- **Asset detail** — beyond the placeholder; read attributes, documents, attached PPM.
- **Timeline of building events** on Home.
- **Logout → unregister device** — wire the existing helper in to `profile.tsx::signOut`.

## Phase 3 — hardening

- **Biometric re-auth** on cold start (expo-local-authentication) for field devices that stay logged in.
- **Refresh token flow** once backend ships it.
- **Sentry / Crashlytics**.
- **EAS Build profiles** for dev / test / prod signed builds.
- **Over-the-air updates** (expo-updates) with env-scoped channels.
- **Pull-to-refresh** everywhere (currently implicit via TanStack Query refetch on focus).
- **Accessibility audit** — VoiceOver / TalkBack labels, dynamic type, contrast.
- **i18n upgrade** — swap our dictionary provider for formatjs once we need plural rules.

## Anti-roadmap — things we will NOT do

- Separate mobile database (SQLite ORM as a second source of truth). Cache only.
- Role checks hardcoded in screens.
- Permission logic inside the payload parser.
- Business rules derived from push notification payload.
- Offline-first everything. We'll add offline support per-feature when the field tells us they need it.
- Home-grown state manager. TanStack Query + Zustand are enough.
