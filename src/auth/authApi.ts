// Auth transport. Thin shims over apiFetch — no state, no storage, no React.

import { apiFetch } from '../api/client';
import type { CurrentUser, LoginInput, LoginResult } from './types';

export async function login(input: LoginInput): Promise<LoginResult> {
  return apiFetch<LoginResult>('/v1/auth/login', {
    method: 'POST',
    body: input,
    skipAuthRedirect: true,
  });
}

export async function fetchCurrentUser(): Promise<CurrentUser> {
  return apiFetch<CurrentUser>('/v1/auth/me');
}

export async function logout(): Promise<void> {
  await apiFetch('/v1/auth/logout', { method: 'POST' }).catch(() => undefined);
}
