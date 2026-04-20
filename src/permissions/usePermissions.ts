// Hook-level facade over the auth store's capability projection. UI code
// should NEVER if/else on role names — it asks `can('tasks.transition')`.
//
// Default-deny for unknown capabilities. If backend introduces a new
// capability the client doesn't know about yet, we still read it (the user
// will get that capability), but if the client codepath checks for something
// the backend hasn't projected, we hide it.

import { useAuthStore } from '../store/authStore';
import type { CapabilityKey } from './capabilities';

export function usePermissions() {
  const user = useAuthStore((s) => s.user);
  const scope = useAuthStore((s) => s.scope);

  const caps = new Set(user?.capabilities ?? []);

  const can = (cap: CapabilityKey | string): boolean => caps.has(cap);

  const roleInActiveBuilding = user?.buildingRoles.find(
    (r) => r.buildingId === scope.buildingId,
  )?.roleKey ?? null;

  return {
    can,
    caps,
    roleInActiveBuilding,
    hasAnyBuildingAccess: (user?.buildingRoles.length ?? 0) > 0,
  };
}
