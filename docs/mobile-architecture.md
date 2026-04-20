# Domera Mobile — architecture

## The one non-negotiable rule

Mobile is a **thin client** over the same backend that powers the web dashboard and any internal tools. There is **one** PostgreSQL database and **one** set of REST endpoints. Mobile never:

- runs a second database,
- invents a second business rule,
- decides what a role can or can't do on its own.

Everything the user sees comes from `/v1/*` endpoints. Anything stored locally is either a **cache** (TanStack Query) or **secure session material** (secure-store). Both are disposable.

## Stack

| Concern | Choice | Why |
|---|---|---|
| Framework | **Expo (SDK 53) + React Native** | Managed workflow, EAS Build for CI, no manual native tool-chain for most devs. |
| Router | **expo-router** | File-based routing matches the rest of the monorepo's mental model. |
| Language | **TypeScript strict** | Same as web. |
| Server state | **TanStack Query v5** | De-dup, background refresh, cache invalidation that actually works. |
| Client UI state | **Zustand v5** | Small, no boilerplate, easy to read in middleware (api client, push router). |
| Forms | **react-hook-form + zod** | Standard RHF, zod for contract-level validation. |
| Camera / QR | **expo-camera** (`CameraView`) | Actively maintained successor to `BarCodeScanner`. |
| Secure storage | **expo-secure-store** | Keychain/Keystore; web falls back to localStorage for dev. |
| Notifications | **expo-notifications** | Expo push tokens, single registration path. |
| Localization | **expo-localization** + our own provider | Dictionary stays small; swap for formatjs when we need plurals/interpolation. |

## Layer map

```
┌────────────────────────────────────────────────────────────────┐
│ Expo Router screens  (app/)                                    │
│   — read hooks from src/modules or src/auth                    │
│   — no fetch, no business decisions                            │
├────────────────────────────────────────────────────────────────┤
│ Domain modules  (src/modules/<domain>/*)                       │
│   types.ts   — DTO shapes                                      │
│   <n>Api.ts  — transport shims over apiFetch                   │
│   use<N>.ts  — React Query hooks, mutations, cache keys         │
├────────────────────────────────────────────────────────────────┤
│ Cross-cutting  (src/auth, src/permissions, src/notifications,  │
│                 src/scanner, src/i18n, src/store, src/config)  │
├────────────────────────────────────────────────────────────────┤
│ Transport  (src/api/client.ts)                                 │
│   – injects Authorization header from auth store               │
│   – injects X-Tenant-Id from active scope                      │
│   – normalizes errors to ApiError                              │
│   – calls onUnauthorized() → auth store clears → router → /login│
├────────────────────────────────────────────────────────────────┤
│ Backend (apps/api)  ← single source of truth                   │
└────────────────────────────────────────────────────────────────┘
```

## State model

Three kinds of state, three stores:

1. **Server state** → TanStack Query cache. Keyed via `src/api/queryKeys.ts`. Everything async.
2. **Session + scope** → Zustand `authStore`. Token, current user projection, active tenant/building. Persisted to secure-store.
3. **Form state** → react-hook-form, local to each screen. Not shared.

Rules:
- Server state is **never** mirrored into Zustand (no double source).
- Optimistic updates only on mutations where compensation is safe (comment add, status toggle). Everywhere else we wait for server truth.
- Cache TTL (`staleTime: 30s`) keeps screens snappy without going stale longer than a minute of field work.

## RBAC

Capabilities ≠ roles. The auth store persists whatever `capabilities[]` the backend projects for the current user. UI gates on **capability strings** via `usePermissions().can('tasks.transition')`. Unknown capability → default-deny.

Role is rendered (for humans) from `buildingRoles[].roleName`, never branched on in code.

When the backend adds a new capability we just add its key to `src/permissions/capabilities.ts` as a typed alias and use it where appropriate. No migration needed for older clients — they simply don't render the new UI.

## Multi-tenant & building scope

- `user.tenantId` — primary tenant.
- `user.buildingRoles[]` — explicit list of buildings the user can access.
- `authStore.scope.{tenantId,buildingId,buildingSlug}` — the **active** context. Every tenant-scoped request rides through `X-Tenant-Id`, and building-scoped lists pass `buildingId` explicitly.
- `(app)/buildings.tsx` is the switcher. Home screen shows "Switch building" only when more than one membership exists.

## Contract with the backend

See `docs/api-integration.md` for the list of endpoints the mobile foundation expects. The client is tolerant — if an optional field is missing (capabilities, displayName, roleName), UI degrades gracefully.

## What lives in `src/lib/api.ts`

Legacy shim. The original scaffold exported a minimal `apiGet`. It's now aliased to `apiFetch` in `src/api/client.ts`. Delete when no imports remain.
