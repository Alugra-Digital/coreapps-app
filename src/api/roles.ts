/**
 * Roles API service.
 * Mock implementation; replace with real API when backend is ready.
 */

import type { Role, RoleCreateInput, RoleUpdateInput } from "@/access-control/roles/types";
import { mockRoles } from "@/access-control/roles/data";

let rolesStore: Role[] = [...mockRoles];

export async function getRoles(): Promise<Role[]> {
  return Promise.resolve([...rolesStore]);
}

export async function getRoleById(id: string): Promise<Role | null> {
  const role = rolesStore.find((r) => r.id === id);
  return Promise.resolve(role ?? null);
}

export async function createRole(input: RoleCreateInput): Promise<Role> {
  const id = `role-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const now = new Date().toISOString();
  const role: Role = {
    ...input,
    id,
    createdAt: now,
    updatedAt: now,
  };
  rolesStore.push(role);
  return Promise.resolve(role);
}

export async function updateRole(id: string, input: RoleUpdateInput): Promise<Role | null> {
  const index = rolesStore.findIndex((r) => r.id === id);
  if (index === -1) return Promise.resolve(null);
  rolesStore[index] = {
    ...rolesStore[index],
    ...input,
    updatedAt: new Date().toISOString(),
  };
  return Promise.resolve(rolesStore[index]);
}

export async function deleteRole(id: string): Promise<boolean> {
  const index = rolesStore.findIndex((r) => r.id === id);
  if (index === -1) return Promise.resolve(false);
  rolesStore.splice(index, 1);
  return Promise.resolve(true);
}
