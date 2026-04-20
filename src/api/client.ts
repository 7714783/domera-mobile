// Centralized API client. Everything crosses this boundary — no raw fetch in
// UI, no fetch in hooks. One place to add retry, logging, tenant context,
// and auth header injection.
//
// Auth and tenant context are injected from the auth store via hooks set by
// the app root (see auth/session.ts). The client itself stays decoupled from
// React state so it can be called from anywhere (background tasks, notifi-
// cation handlers, scanner).

import { env } from '../config/env';
import { ApiError, RequestOptions } from './types';

type AuthCtx = {
  getToken: () => string | null;
  getTenantId: () => string | null;
  onUnauthorized: () => void;
};

// Default context used before the app root wires the real auth store.
// Prevents unauth'd requests from silently attaching stale data.
let authContext: AuthCtx = {
  getToken: () => null,
  getTenantId: () => null,
  onUnauthorized: () => {},
};

export function configureApiAuthContext(ctx: AuthCtx) {
  authContext = ctx;
}

function buildUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const base = env.apiBase.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

function extractMessage(body: unknown, fallback: string): string {
  if (!body || typeof body !== 'object') return fallback;
  const anyBody = body as Record<string, unknown>;
  const m = anyBody.message;
  if (typeof m === 'string') return m;
  if (Array.isArray(m)) return m.join(', ');
  if (typeof anyBody.error === 'string') return anyBody.error;
  return fallback;
}

export async function apiFetch<T = unknown>(path: string, opts: RequestOptions = {}): Promise<T> {
  const url = buildUrl(path);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(opts.headers ?? {}),
  };
  const token = authContext.getToken();
  if (token && !headers['Authorization']) headers['Authorization'] = `Bearer ${token}`;
  const tenant = authContext.getTenantId();
  if (tenant && !headers['X-Tenant-Id']) headers['X-Tenant-Id'] = tenant;

  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(), opts.timeoutMs ?? 15_000);
  if (opts.signal) {
    // Chain caller signal into our internal controller.
    opts.signal.addEventListener('abort', () => ctrl.abort(), { once: true });
  }

  let res: Response;
  try {
    res = await fetch(url, {
      method: opts.method ?? 'GET',
      headers,
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
      signal: ctrl.signal,
    });
  } catch (e: unknown) {
    clearTimeout(timeout);
    const msg = e instanceof Error ? e.message : 'network error';
    throw new ApiError({ status: 0, message: msg, body: null });
  }
  clearTimeout(timeout);

  const text = await res.text();
  const body: unknown = text ? safeParse(text) : null;

  if (!res.ok) {
    if (res.status === 401 && !opts.skipAuthRedirect) {
      authContext.onUnauthorized();
    }
    throw new ApiError({
      status: res.status,
      message: extractMessage(body, `HTTP ${res.status}`),
      body,
      code: typeof (body as any)?.code === 'string' ? (body as any).code : null,
      serverMessage: extractMessage(body, ''),
    });
  }
  return body as T;
}

function safeParse(text: string): unknown {
  try { return JSON.parse(text); } catch { return text; }
}
