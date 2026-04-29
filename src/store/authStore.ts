// Client-side auth state. Server is the source of truth for roles and
// permissions — the store just caches the projection so the UI can render
// without a round-trip on every screen.

import { create } from 'zustand';
import type { CurrentUser } from '../auth/types';
import { secureGet, secureSet, secureDelete } from '../shared/secureStorage';

const TOKEN_KEY = 'domera.session.token';

type AuthStatus = 'bootstrapping' | 'unauthenticated' | 'authenticated';

export type ActiveScope = {
  tenantId: string | null;
  buildingId: string | null;
  buildingSlug: string | null;
};

type AuthState = {
  status: AuthStatus;
  token: string | null;
  user: CurrentUser | null;
  scope: ActiveScope;
  // actions
  bootstrap: () => Promise<void>;
  setSession: (token: string, user: CurrentUser) => Promise<void>;
  setUser: (user: CurrentUser) => void;
  clearSession: () => Promise<void>;
  setActiveBuilding: (buildingId: string | null) => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  status: 'bootstrapping',
  token: null,
  user: null,
  scope: { tenantId: null, buildingId: null, buildingSlug: null },

  bootstrap: async () => {
    const stored = await secureGet(TOKEN_KEY);
    if (!stored) {
      set({ status: 'unauthenticated', token: null, user: null });
      return;
    }
    // Token restored; user profile will be fetched by the session bootstrapper.
    set({ token: stored, status: 'bootstrapping' });
  },

  setSession: async (token, user) => {
    await secureSet(TOKEN_KEY, token);
    const primary = user.buildingRoles[0];
    set({
      status: 'authenticated',
      token,
      user,
      scope: {
        tenantId: user.tenantId ?? primary?.tenantId ?? null,
        buildingId: primary?.buildingId ?? null,
        buildingSlug: primary?.buildingSlug ?? null,
      },
    });
  },

  setUser: (user) => {
    const current = get();
    // Preserve active building choice if user still has access to it.
    const stillHasBuilding =
      current.scope.buildingId &&
      user.buildingRoles.some((r) => r.buildingId === current.scope.buildingId);
    const primary = user.buildingRoles[0];
    set({
      status: 'authenticated',
      user,
      scope: {
        tenantId: user.tenantId ?? primary?.tenantId ?? null,
        buildingId: stillHasBuilding ? current.scope.buildingId : (primary?.buildingId ?? null),
        buildingSlug: stillHasBuilding
          ? current.scope.buildingSlug
          : (primary?.buildingSlug ?? null),
      },
    });
  },

  clearSession: async () => {
    await secureDelete(TOKEN_KEY);
    set({
      status: 'unauthenticated',
      token: null,
      user: null,
      scope: { tenantId: null, buildingId: null, buildingSlug: null },
    });
  },

  setActiveBuilding: (buildingId) => {
    const { user } = get();
    if (!user) return;
    const match = user.buildingRoles.find((r) => r.buildingId === buildingId);
    set({
      scope: {
        tenantId: match?.tenantId ?? user.tenantId ?? null,
        buildingId: match?.buildingId ?? null,
        buildingSlug: match?.buildingSlug ?? null,
      },
    });
  },
}));
