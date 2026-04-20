# Mobile folder structure

```
apps/mobile/
├── app/                          # Expo Router — one file = one route
│   ├── _layout.tsx               # Providers: QueryClient, I18n, SafeArea, session bootstrap
│   ├── index.tsx                 # Splash / auth-aware redirect
│   ├── +not-found.tsx            # Unknown-route fallback
│   ├── (auth)/                   # Unauthenticated group
│   │   ├── _layout.tsx           # Redirects to /(app) if logged in
│   │   └── login.tsx
│   └── (app)/                    # Authenticated group (tabs + stacks)
│       ├── _layout.tsx           # Tab navigator + auth guard
│       ├── index.tsx             # Home
│       ├── tasks/                # Tasks stack
│       │   ├── _layout.tsx
│       │   ├── index.tsx
│       │   └── [id].tsx
│       ├── scanner.tsx
│       ├── notifications.tsx
│       ├── profile.tsx
│       ├── settings.tsx
│       ├── buildings.tsx         # Scope-switcher (not in tab bar)
│       ├── assets/[id].tsx       # Target for scanner 'asset' intent
│       ├── locations/[id].tsx    # Target for scanner 'location' intent
│       └── cleaning/[code].tsx   # Target for public cleaning QR
│
├── src/
│   ├── api/
│   │   ├── client.ts             # Centralized fetch client (auth, tenant, timeout, error normalization)
│   │   ├── queryKeys.ts          # Single source of truth for TanStack Query keys
│   │   └── types.ts              # ApiError, Paginated<T>, RequestOptions
│   ├── auth/
│   │   ├── types.ts              # CurrentUser, BuildingMembership, LoginInput/Result
│   │   ├── authApi.ts            # login / logout / fetchCurrentUser shims
│   │   └── session.ts            # useSessionBootstrap — wires api client to auth store
│   ├── config/
│   │   └── env.ts                # apiBase, environment via expo-constants extras
│   ├── i18n/
│   │   ├── index.ts              # I18nProvider + useI18n — locale detection + dictionary
│   │   └── locales/{en,ru,he}.ts # Translation trees (he sets RTL direction)
│   ├── modules/                  # Domain-scoped features
│   │   └── tasks/
│   │       ├── types.ts
│   │       ├── tasksApi.ts
│   │       └── useTasks.ts
│   ├── notifications/
│   │   ├── push.ts               # Register device, foreground handler, tap routing
│   │   └── notificationsApi.ts   # /v1/notifications/{devices, list, read}
│   ├── permissions/
│   │   ├── capabilities.ts       # Typed mirror of backend capability keys
│   │   └── usePermissions.ts     # can('tasks.transition') → boolean; default-deny
│   ├── scanner/
│   │   ├── parse.ts              # Raw payload → typed ScanResult
│   │   ├── scannerApi.ts         # /v1/scanner/resolve for opaque tokens
│   │   └── useScanRouter.ts      # Async routeScan() used by scanner screen
│   ├── shared/
│   │   ├── secureStorage.ts      # expo-secure-store with web fallback
│   │   └── ui/                   # Design-system primitives
│   │       ├── Badge.tsx
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── EmptyState.tsx
│   │       ├── ErrorBlock.tsx
│   │       ├── Input.tsx
│   │       ├── Loader.tsx
│   │       ├── Screen.tsx
│   │       └── SectionHeader.tsx
│   ├── store/
│   │   └── authStore.ts          # Zustand — session + active scope
│   └── theme/
│       └── tokens.ts             # Colors, spacing, typography, MIN_TAP
│
├── docs/                         # Architecture docs (you are here)
├── app.json                      # Expo config — permissions, plugins, extras
├── tsconfig.json                 # strict, path aliases
└── package.json                  # Scripts + dependencies
```

## Naming & boundaries

- **Routes import from `src/`, never the other way.** UI in `src/` must not depend on `app/` (Expo Router) — use the `router` export from `expo-router` inside hooks/services when navigation is needed.
- **One domain module = one folder under `src/modules/`.** Each ships its own `types.ts`, `<name>Api.ts`, `use<Name>.ts`. Screens consume the module hooks; they don't inline fetch.
- **No fetch calls in components.** Routed through `api/client` + TanStack Query hooks.
- **`shared/ui/` is a design system.** No business-logic imports — these components must stay reusable from any screen.
- **Path aliases** (tsconfig): `@/`, `@api/`, `@auth/`, `@config/`, `@i18n/`, `@modules/`, `@notifications/`, `@permissions/`, `@scanner/`, `@shared/`, `@store/`, `@theme/`. Current screens use relative imports for consistency; aliases are there when we lift reusable hooks out of the tree.
