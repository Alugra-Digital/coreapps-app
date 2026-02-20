/**
 * RBAC utilities for permission checks.
 * Used by Sidebar to filter menu items based on role.permissionKeys from GET /api/auth/me.
 *
 * Parent key rule: If user has parent permission (e.g. "finance"), they have access to all
 * children (e.g. "finance.invoice", "finance.clients"). SUPER_ADMIN gets full keys from backend.
 */

/**
 * Check if the user has permission for the required key.
 * Returns true if:
 * - permissionKeys includes requiredKey directly, OR
 * - requiredKey is a child (e.g. "finance.invoice") and permissionKeys includes the parent ("finance")
 */
export function hasPermission(
  permissionKeys: string[],
  requiredKey: string
): boolean {
  if (!permissionKeys?.length) return false;
  if (permissionKeys.includes(requiredKey)) return true;
  // Parent rule: "finance.invoice" → check "finance"
  if (requiredKey.includes(".")) {
    const parentKey = requiredKey.split(".")[0];
    if (parentKey && permissionKeys.includes(parentKey)) return true;
  }
  return false;
}
