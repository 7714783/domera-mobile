# Scanner flow

## Scope

The scanner is a **capability**, not a single screen. Any screen that needs scan input should navigate to `/(app)/scanner` and rely on the shared router to come back.

## Pipeline

```
raw payload
   │
   ▼   parseScan()
typed ScanResult
   │
   ▼   routeScan()
navigate to domain screen
   │
   ▼   the domain screen fetches the server resource
```

### Recognised shapes (`src/scanner/parse.ts`)

| Shape                    | Example                                    | Routed to                                       |
| ------------------------ | ------------------------------------------ | ----------------------------------------------- |
| Deep link                | `domera://task/<id>`                       | `/(app)/tasks/[id]`                             |
| Deep link                | `domera://asset/<id>`                      | `/(app)/assets/[id]`                            |
| Deep link                | `domera://location/<id>`                   | `/(app)/locations/[id]`                         |
| Web URL with cleaning QR | `https://app.domera.io/cleaning/qr/<code>` | `/(app)/cleaning/[code]`                        |
| Opaque short token       | `aB12_cD34`                                | `/v1/scanner/resolve` → typed result → navigate |
| Anything else            | `"hello world"`                            | unknown — UI shows "try a different QR"         |

## Camera

Uses `expo-camera`'s `CameraView` (the modern replacement for `BarCodeScanner`). Barcode types configured: QR, EAN-13, CODE-128, CODE-39, UPC-A.

## Debouncing

Scans fire repeatedly while the user holds the QR in frame. We guard with a `handlingRef` that unlocks 1.2 s after each scan so the app doesn't spam navigations.

## Permission states

- **Permission pending** → loading screen.
- **Permission denied & can ask again** → shows "Allow camera access" CTA which calls `requestPermission()`.
- **Permission denied & can't ask again** → shows copy pointing to system Settings (we can't open it programmatically on iOS without the permission flow).

## Backend contract

`POST /v1/scanner/resolve { token }` returns one of `{ kind: 'task'|'asset'|'location'|'cleaning_request_form', ... }`. See `docs/api-integration.md` for the shape. The client never tries to guess what a token means — it's a server decision.

## Adding a new code kind

1. Add the case to `ScanResult` (`src/scanner/parse.ts`).
2. Add the navigation branch to `routeScan` (`src/scanner/useScanRouter.ts`).
3. If it's backend-resolved, extend `ResolvedScanTarget` in `src/scanner/scannerApi.ts`.
4. Point at the correct Expo Router route.
