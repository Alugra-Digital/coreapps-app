/**
 * Roles API service.
 * Uses real backend API.
 */

import type { Role, RoleCreateInput, RoleUpdateInput } from "@/access-control/roles/types";
import { api } from "@/lib/api/client";

export async function getRoles(): Promise<Role[]> {
  return api.get<Role[]>("/api/roles");
}

export async function getRoleById(id: string): Promise<Role | null> {
  try {
    return await api.get<Role>(`/api/roles/${id}`);
  } catch {
    return null;
  }
}

export async function createRole(input: RoleCreateInput): Promise<Role> {
  return api.post<Role>("/api/roles", input);
}

export async function updateRole(id: string, input: RoleUpdateInput): Promise<Role> {
  return api.put<Role>(`/api/roles/${id}`, input);
}

export async function deleteRole(id: string): Promise<boolean> {
  try {
    await api.delete(`/api/roles/${id}`);
    return true;
  } catch {
    return false;
  }
}
