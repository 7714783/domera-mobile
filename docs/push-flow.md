# Push notifications flow

## What the client does

1. User logs in → `useNotificationRouter()` picks up the authenticated state and calls `ensurePushRegistered()`.
2. `ensurePushRegistered`:
   - asks the OS for permission,
   - fetches an Expo push token,
   - POSTs it to `/v1/notifications/devices` along with platform + app version.
3. When a notification arrives in foreground, the OS banner is shown (handler configured via `Notifications.setNotificationHandler`).
4. When the user taps a notification, `addNotificationResponseReceivedListener` fires. We read the `type` and IDs from `request.content.data` and route with Expo Router. **The payload is a routing hint — never the data we render.** The destination screen re-fetches the actual resource from the backend.

## Payload contract

Minimal shape the client understands today:

```json
{
  "type": "new_task_assigned",
  "taskId": "0f92..."
}
```

Recognised `type` values (in `src/notifications/push.ts`):

- `new_task_assigned` / `task_status_changed` → navigate to `/(app)/tasks/[id]`
- anything else → navigate to `/(app)/notifications` (inbox)

Adding a new type is a ~3-line change in `push.ts` — no schema, no migration.

## Inbox

`/(app)/notifications` calls `GET /v1/notifications?take=50` and renders the list. Read state is managed server-side via `POST /v1/notifications/:id/read`.

## Rules

- Notifications **do not** carry authoritative data. If the server changes a task to `cancelled` between push and tap, the detail screen will show `cancelled` (because it re-fetches).
- Registrations are idempotent. The backend should upsert by `(userId, expoPushToken)`.
- On logout we should unregister the token (`DELETE /v1/notifications/devices`). That call is wired in `notificationsApi.ts` but not yet invoked from logout — flagged in `docs/future-roadmap.md`.
