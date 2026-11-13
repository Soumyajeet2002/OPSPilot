/** Populated only by a future verified authorization endpoint, never inferred from email. */
export interface AuthorizationSnapshot {
  roles: readonly string[];
  permissions: readonly string[];
}
export interface AccessRequirement {
  anyRole?: readonly string[];
  allPermissions?: readonly string[];
}
// Admin and HR are role identifiers, not implicit grants. Unknown identity denies access.
export function canAccess(
  snapshot: AuthorizationSnapshot | null,
  requirement: AccessRequirement,
): boolean {
  if (!snapshot) return false;
  const roleAllowed =
    !requirement.anyRole?.length ||
    requirement.anyRole.some((role) => snapshot.roles.includes(role));
  const permissionAllowed =
    !requirement.allPermissions?.length ||
    requirement.allPermissions.every((permission) =>
      snapshot.permissions.includes(permission),
    );
  return roleAllowed && permissionAllowed;
}
