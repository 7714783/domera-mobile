import { router } from 'expo-router';
import { parseScan, type ScanResult } from './parse';
import { resolveScanToken } from './scannerApi';

export async function routeScan(raw: string): Promise<ScanResult> {
  const parsed = parseScan(raw);
  switch (parsed.kind) {
    case 'task':
      router.push({ pathname: '/(app)/tasks/[id]', params: { id: parsed.taskId } });
      return parsed;
    case 'asset':
      router.push({ pathname: '/(app)/assets/[id]', params: { id: parsed.assetId } });
      return parsed;
    case 'location':
      router.push({ pathname: '/(app)/locations/[id]', params: { id: parsed.locationId } });
      return parsed;
    case 'cleaning_qr':
      router.push({ pathname: '/(app)/cleaning/[code]', params: { code: parsed.code } });
      return parsed;
    case 'opaque_token':
      try {
        const resolved = await resolveScanToken(parsed.token);
        if (resolved.kind === 'task') router.push({ pathname: '/(app)/tasks/[id]', params: { id: resolved.taskId } });
        else if (resolved.kind === 'asset') router.push({ pathname: '/(app)/assets/[id]', params: { id: resolved.assetId } });
        else if (resolved.kind === 'location') router.push({ pathname: '/(app)/locations/[id]', params: { id: resolved.locationId } });
        else if (resolved.kind === 'cleaning_request_form') router.push({ pathname: '/(app)/cleaning/[code]', params: { code: resolved.qrCode } });
        return { kind: 'opaque_token', token: parsed.token, url: parsed.url };
      } catch {
        return { kind: 'unknown', raw };
      }
    case 'unknown':
      return parsed;
  }
}
