# Auth flow

## States

```
bootstrapping  ─── no decision yet, splash visible
   │
   ├── no token in secure-store   ──► unauthenticated
   │
   └── token found ───► fetch /v1/auth/me
                          ├── 200  ──► authenticated
                          └── 401  ──► clearSession → unauthenticated
```

The state machine lives in `src/store/authStore.ts` (Zustand). Every screen reads `status` via `useAuthStore((s) => s.status)` — no explicit provider, no render prop.

## Session bootstrap

`src/auth/session.ts::useSessionBootstrap` runs once in the root layout. It:

1. Wires `api/client.ts` with lambdas that read the live auth state — `getToken`, `getTenantId`, `onUnauthorized`.
2. Calls `authStore.bootstrap()` to read the persisted token from secure-store.
3. When the token appears, fetches `/v1/auth/me` and calls `setUser(user)`. On failure, clears the session.

Because the api client reads the store via callbacks (not a captured snapshot), every fetch after a login uses the new token without any reload.

## Login

`(auth)/login.tsx`:

1. Takes email + password.
2. Calls `POST /v1/auth/login` (via `login()` in `authApi.ts`). This is the only endpoint we call with `skipAuthRedirect: true` — a 401 here means wrong password, not an expired session.
3. If the backend returns `{ token, user }`, uses it directly. Otherwise we fetch `/v1/auth/me` to get the full user projection.
4. `setSession(token, user)` persists the token to secure-store and seeds the active scope from the first building role.

## 401 handling

Any `apiFetch` response with HTTP 401 (and no `skipAuthRedirect`) triggers `onUnauthorized()`. The live auth store clears session state, which triggers the `(app)` layout's redirect guard to send the user back to `/login`. No screen has to know about this.

## Logout

`profile.tsx` → `POST /v1/auth/logout` (best-effort), then `authStore.clearSession()`, then `router.replace('/(auth)/login')`. Clearing happens even if the network call fails — we never leave the user on an authenticated UI after they pressed "sign out".

## Secure storage

`src/shared/secureStorage.ts` wraps `expo-secure-store` on native, falls back to `localStorage` on web. Token key is `domera.session.token`. Nothing else persists — user profile is re-fetched from `/v1/auth/me` on every cold start.

## What the backend should keep in mind

See `docs/api-integration.md` §auth. Minimal contract:

- `POST /v1/auth/login { email, password } → { token, user? }`
- `GET /v1/auth/me → CurrentUser`
- `POST /v1/auth/logout`

A refresh-token flow is not required yet — the client treats a 401 as "session invalid, reprompt". When refresh lands on the backend, we'll add it as a transparent retry in `api/client.ts` without changing any screen.
