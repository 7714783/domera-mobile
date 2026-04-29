# API integration — backend contract expectations

The mobile client speaks to the same `apps/api` backend as the web dashboard. This document lists the endpoints and shapes mobile depends on. Anything marked **[needs backend]** is a new endpoint the backend doesn't yet expose — fixing that before shipping is the fastest way to unblock mobile features.

All endpoints are JSON, all tenant-scoped calls must carry `X-Tenant-Id` and `Authorization: Bearer <token>`.

## Error contract

Every non-2xx response should return a JSON body the client can render:

```json
{
  "message": "human readable message",
  "error": "Unauthorized",
  "statusCode": 401,
  "code": "optional_machine_code"
}
```

The client's `ApiError` captures all of these. `message` may be a string or a string[] (NestJS class-validator style is accepted).

## Pagination

Lists the client reads:

```json
{ "total": 123, "items": [ ... ] }
```

Query params the client sends: `take`, `skip`, plus domain-specific filters.

## Auth

| Method | Path              | Purpose                                                             |
| ------ | ----------------- | ------------------------------------------------------------------- |
| `POST` | `/v1/auth/login`  | `{ email, password }` → `{ token, user? }`                          |
| `GET`  | `/v1/auth/me`     | `CurrentUser` (includes `buildingRoles[]` and **`capabilities[]`**) |
| `POST` | `/v1/auth/logout` | Optional — client clears locally regardless                         |

`CurrentUser` shape (`src/auth/types.ts`):

```ts
{
  id: string;
  email: string;
  displayName: string;
  tenantId: string | null;
  buildingRoles: Array<{
    buildingId: string;
    buildingSlug: string;
    buildingName: string;
    tenantId: string;
    roleKey: string;
    roleName?: string;
  }>;
  capabilities?: string[];  // ← REQUIRED for RBAC. Empty array = no capabilities.
}
```

Backend already has most of this. **[needs backend]** is the `capabilities[]` projection on `/v1/auth/me`. Without it every `can(...)` returns false and mobile UI is heavily degraded.

## Tasks / work requests

Mobile treats the web-side "plan item executions" as tasks. The contract below is what mobile reads — the backend may already expose some of it under different paths; the mapping layer lives in `src/modules/tasks/tasksApi.ts`.

| Method | Path                             | Purpose                                                               |
| ------ | -------------------------------- | --------------------------------------------------------------------- |
| `GET`  | `/v1/tasks?mine=1&buildingId=<>` | `Paginated<TaskSummary>` **[needs backend — unified tasks endpoint]** |
| `GET`  | `/v1/tasks/:id`                  | `TaskDetail` including `allowedTransitions[]`                         |
| `GET`  | `/v1/tasks/:id/timeline`         | `TaskTimelineEntry[]`                                                 |
| `POST` | `/v1/tasks/:id/transition`       | `{ toStatus, comment? }`                                              |
| `POST` | `/v1/tasks/:id/comments`         | `{ message }`                                                         |

Key rule: the backend drives **allowed transitions** per user. The mobile UI only renders transitions that come back in `allowedTransitions[]`. No hardcoded status machine in the client.

## Scanner

| Method | Path                           | Purpose                                                                                                       |
| ------ | ------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `POST` | `/v1/scanner/resolve`          | `{ token }` → `{ kind: 'task' \| 'asset' \| 'location' \| 'cleaning_request_form', ... }` **[needs backend]** |
| `GET`  | `/v1/public/cleaning/qr/:code` | existing — reused for cleaning QRs                                                                            |

The resolver is the **single point** where a short opaque token gets turned into a domain intent. Adding new scan targets = extending this endpoint, no client change required beyond an extra `kind`.

## Notifications

| Method   | Path                         | Purpose                                      |
| -------- | ---------------------------- | -------------------------------------------- |
| `POST`   | `/v1/notifications/devices`  | Register Expo push token **[needs backend]** |
| `DELETE` | `/v1/notifications/devices`  | Unregister (on logout) **[needs backend]**   |
| `GET`    | `/v1/notifications?take=50`  | Inbox                                        |
| `POST`   | `/v1/notifications/:id/read` | Mark read                                    |

Registration body: `{ expoPushToken, platform, deviceId?, appVersion? }`. Backend should upsert by `(userId, expoPushToken)`.

## Buildings & locations

Mobile already has everything it needs from existing web endpoints:

| Method | Path                            |
| ------ | ------------------------------- |
| `GET`  | `/v1/buildings`                 |
| `GET`  | `/v1/buildings/:slug/locations` |

Active building is driven by the client's `authStore.scope`. Mobile does not filter locations globally — it relies on the backend to respect `X-Tenant-Id`.

## Attachments / photos (foundation, not wired)

| Method | Path                        | Purpose                                                                                                                                      |
| ------ | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `POST` | `/v1/documents/upload`      | Existing — raw-body upload. Mobile will need a multipart/signed-URL alternative for large files. **[needs backend]** presigned URL endpoint. |
| `POST` | `/v1/tasks/:id/attachments` | Attach existing doc to a task. **[needs backend]**                                                                                           |

Planned shape: `POST /v1/documents/presigned-upload → { uploadUrl, documentId }`. Client PUTs file directly to the URL, then calls `/tasks/:id/attachments { documentId }`.

## Versioning

The API already lives under `/v1/*`. Mobile does not send an `Accept-Version` header. When a breaking change ships on the backend, a new prefix (`/v2/*`) is the expectation — mobile will pin to the new path per module.

## Summary: backend work required to unblock full mobile functionality

1. `capabilities[]` on `/v1/auth/me`.
2. Unified `/v1/tasks` list + detail + timeline + transition + comments (may already exist as `/v1/ppm/executions/*` etc. — we need a consolidated view or a mapping doc).
3. `POST /v1/scanner/resolve` (opaque token → typed target).
4. `/v1/notifications/devices` (register/unregister).
5. Presigned upload endpoint for attachments.
6. Consistent error shape `{ message, error, statusCode }` across all new endpoints (already true for most Nest controllers).
