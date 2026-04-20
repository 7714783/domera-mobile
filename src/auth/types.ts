// Auth domain types shared across the module.

export type RoleKey = string;   // opaque — never hardcode comparisons, use capability helpers

export type BuildingMembership = {
  buildingId: string;
  buildingSlug: string;
  buildingName: string;
  tenantId: string;
  roleKey: RoleKey;
  roleName?: string;
};

export type CurrentUser = {
  id: string;
  email: string;
  displayName: string;
  tenantId: string | null;      // primary tenant, for single-tenant users
  buildingRoles: BuildingMembership[];
  // Capabilities expected to be projected from backend; client NEVER invents
  // new capabilities. See permissions/capabilities.ts for the enum mirror.
  capabilities?: string[];
};

export type LoginInput = {
  email: string;
  password: string;
};

export type LoginResult = {
  token: string;
  user: CurrentUser;
};
