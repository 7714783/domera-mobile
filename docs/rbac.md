# RBAC in the mobile client

## The rule

Roles ≠ permissions. The backend projects a `capabilities: string[]` array onto `CurrentUser`, and the mobile client only ever checks **capabilities**. Roles are human-readable labels — they show up in the profile screen and the building switcher, never in `if` branches.

## Why

- Roles change. Capabilities rarely do.
- Custom roles per tenant are coming — hardcoding `if (role === 'building_manager')` breaks the moment a tenant creates a "regional_manager".
- The client should defer to the server on "can this user do X?". The server already decides, might as well trust it.

## How to gate UI

```ts
import { usePermissions } from '@/permissions/usePermissions';
import { Capability } from '@/permissions/capabilities';

const { can } = usePermissions();

{can(Capability.tasksTransition) && (
  <Button title="Transition" onPress={...} />
)}
```

**Default-deny.** If `capabilities[]` is missing or empty, every `can(...)` returns `false`. The mobile client is supposed to be conservative — if the backend didn't project a capability, we don't invent one.

## Typed enum mirror

`src/permissions/capabilities.ts` holds the list of capability keys the mobile build recognises. It's a simple `as const` object — add a new key when the backend introduces a new one. The key's **string value must match the backend** exactly.

When the backend adds a capability the client doesn't know about yet, nothing breaks — the user gains it server-side, but no mobile UI gates on it until the client ships the corresponding key.

## What's NOT in the client

- No permission matrix JSON.
- No role → capability expansion table.
- No enum of roles.
- No `hasAnyRole([...])` helper.

Anyone writing `if (user.roleKey === ...)` is writing a bug.

## Active-building scope

`usePermissions()` also returns `roleInActiveBuilding` — the role of the current user within the building they're currently working in. Useful for read-only display (profile, switcher). Still not a substitute for `can(capability)`.

## Examples

- "Show assign-button if user may assign tasks" → `can(Capability.tasksAcceptAssigned)`.
- "Hide scanner tab entirely for users who can't resolve QR" → `can(Capability.scannerResolveQr)`.
- "Admin-only settings section" → `can('settings.admin')` after adding the key to `capabilities.ts`.

## Expected backend contract

`GET /v1/auth/me` must return `capabilities: string[]` for the authenticated user in the context of `X-Tenant-Id`. See `docs/api-integration.md`.
