# Domera Mobile

React Native / Expo client for the Domera platform. Shares one backend and one database with the web dashboard — this app is a thin client, not a second source of truth.

## Quick start

```bash
# From the monorepo root
pnpm install
pnpm --filter @domera/api db:migrate:deploy    # if the API schema is ahead of your local
pnpm --filter @domera/api dev                  # start the backend (http://localhost:4000)

# In another terminal
pnpm --filter @domera/mobile dev               # Expo devtools, pick a simulator or device
```

Expo will open the dev tools. Press:
- **i** → iOS simulator (requires Xcode on macOS)
- **a** → Android emulator
- **w** → web (useful for quick iteration; camera/push are no-ops)

On a physical device, install Expo Go and scan the QR. The device has to reach `localhost:4000` — use your machine's LAN IP in `app.json` `extras.apiBase` for device testing.

## Environments

App reads config from `app.json` `extras`. Override per build target:

```json
"extra": {
  "apiBase": "https://api.test.domera.io",
  "environment": "test"
}
```

For EAS builds, use [EAS profiles](https://docs.expo.dev/build/eas-json/) to inject different `extras` per profile (`development` / `preview` / `production`).

## Scripts

| Command | Purpose |
|---|---|
| `pnpm --filter @domera/mobile dev` | Expo dev server |
| `pnpm --filter @domera/mobile typecheck` | `tsc --noEmit` |
| `pnpm --filter @domera/mobile build` | Placeholder — production builds go through EAS Build |

## Folder tour

See `docs/folder-structure.md` for the full layout. The three files you'll touch most:

- `app/(app)/_layout.tsx` — tabs + auth guard.
- `src/api/client.ts` — the boundary between components and HTTP.
- `src/store/authStore.ts` — session + active tenant/building scope.

## Architecture docs

- `docs/mobile-architecture.md` — stack, layering, state model.
- `docs/auth-flow.md` — login, session, 401 handling.
- `docs/push-flow.md` — registration, foreground handler, tap routing.
- `docs/scanner-flow.md` — parser, router, recognised codes.
- `docs/rbac.md` — capability model, how to gate UI.
- `docs/api-integration.md` — every backend endpoint mobile consumes, plus **[needs backend]** gaps.
- `docs/folder-structure.md` — source layout.
- `docs/future-roadmap.md` — what's next, what we're not building.

## The one rule

Mobile is a client over the shared backend and shared Postgres. No parallel database, no offline-first by default, no role-checking in screens, no business rules in the scanner. See `docs/mobile-architecture.md` for the full reasoning.
