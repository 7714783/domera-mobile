// Single source of truth for TanStack Query keys. Every module that needs
// a query uses one of these factories so cache invalidation is predictable
// and there's never a typo-based cache miss.

export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  buildings: {
    list: () => ['buildings', 'list'] as const,
    detail: (idOrSlug: string) => ['buildings', 'detail', idOrSlug] as const,
  },
  tasks: {
    mine: (scope: { tenantId?: string | null; buildingId?: string | null }) =>
      ['tasks', 'mine', scope.tenantId ?? null, scope.buildingId ?? null] as const,
    detail: (id: string) => ['tasks', 'detail', id] as const,
    timeline: (id: string) => ['tasks', 'timeline', id] as const,
  },
  notifications: {
    list: () => ['notifications', 'list'] as const,
    unread: () => ['notifications', 'unread'] as const,
  },
  permissions: {
    current: () => ['permissions', 'current'] as const,
  },
  scanner: {
    resolve: (token: string) => ['scanner', 'resolve', token] as const,
  },
};
