import { apiFetch } from '../api/client';

export type ResolvedScanTarget =
  | { kind: 'task'; taskId: string }
  | { kind: 'asset'; assetId: string }
  | { kind: 'location'; locationId: string; buildingSlug: string | null }
  | { kind: 'cleaning_request_form'; qrCode: string; buildingId: string };

export async function resolveScanToken(token: string): Promise<ResolvedScanTarget> {
  // Single backend resolution endpoint. Client never guesses what a token
  // means — we ask the server.
  return apiFetch<ResolvedScanTarget>(`/v1/scanner/resolve`, {
    method: 'POST',
    body: { token },
  });
}
