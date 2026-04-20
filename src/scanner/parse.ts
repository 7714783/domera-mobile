// Scanner parsing + routing. The scanner screen only reads — this module
// turns a raw payload into a typed domain intent. Unknown codes surface as
// `unknown` so the UI can show a friendly "try a different QR" state.
//
// Supported shapes:
//   1. Deep link:       domera://task/<id>   domera://asset/<id>   domera://location/<id>
//   2. Web URL:         https://app.domera.*/<locale>/buildings/<slug>/...
//   3. Short QR token:  opaque token resolved via GET /v1/public/qr/:token
//                       (cleaning QRs and similar already use this on the web)

export type ScanResult =
  | { kind: 'task'; taskId: string }
  | { kind: 'asset'; assetId: string }
  | { kind: 'location'; locationId: string }
  | { kind: 'cleaning_qr'; code: string }
  | { kind: 'opaque_token'; token: string; url: string }   // resolve via backend
  | { kind: 'unknown'; raw: string };

const DOMERA_SCHEME = 'domera://';

export function parseScan(raw: string): ScanResult {
  const trimmed = raw.trim();
  if (!trimmed) return { kind: 'unknown', raw };

  if (trimmed.startsWith(DOMERA_SCHEME)) {
    const rest = trimmed.slice(DOMERA_SCHEME.length);
    const [segment, ...ids] = rest.split('/');
    if (segment === 'task' && ids[0]) return { kind: 'task', taskId: ids[0] };
    if (segment === 'asset' && ids[0]) return { kind: 'asset', assetId: ids[0] };
    if (segment === 'location' && ids[0]) return { kind: 'location', locationId: ids[0] };
  }

  if (/^https?:\/\//.test(trimmed)) {
    // Known public cleaning QR: /cleaning/qr/<code>
    const m = trimmed.match(/\/cleaning\/qr\/([\w-]+)/);
    if (m) return { kind: 'cleaning_qr', code: m[1]! };
    return { kind: 'opaque_token', token: trimmed, url: trimmed };
  }

  // Short opaque tokens (common for printed stickers): 6+ url-safe chars.
  if (/^[A-Za-z0-9_-]{6,}$/.test(trimmed)) {
    return { kind: 'opaque_token', token: trimmed, url: trimmed };
  }

  return { kind: 'unknown', raw };
}
