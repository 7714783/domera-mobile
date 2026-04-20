// Session bootstrap: wires the api client to the auth store on mount, and
// restores the user profile when a token is present in secure storage.

import { useEffect } from 'react';
import { configureApiAuthContext } from '../api/client';
import { useAuthStore } from '../store/authStore';
import { fetchCurrentUser } from './authApi';

export function useSessionBootstrap() {
  const status = useAuthStore((s) => s.status);
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    configureApiAuthContext({
      getToken: () => useAuthStore.getState().token,
      getTenantId: () => useAuthStore.getState().scope.tenantId,
      onUnauthorized: () => {
        // Token invalid / expired on the server. Clear local session so
        // guards route the user back to /login.
        void useAuthStore.getState().clearSession();
      },
    });
    void useAuthStore.getState().bootstrap();
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!token || status !== 'bootstrapping') return;
    (async () => {
      try {
        const user = await fetchCurrentUser();
        if (cancelled) return;
        useAuthStore.getState().setUser(user);
      } catch {
        if (!cancelled) await useAuthStore.getState().clearSession();
      }
    })();
    return () => { cancelled = true; };
  }, [token, status]);
}
