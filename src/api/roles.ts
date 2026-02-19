/**
 * Roles API service.
 * Uses real backend API.
 */

import type { Role, RoleCreateInput, RoleUpdateInput } from "@/access-control/roles/types";
import type { PaginatedResponse } from "@/lib/api/pagination";
import { api } from "@/lib/api/client";

/** Normalize response: return data array when paginated, otherwise return as-is */
function normalizeListResponse<T>(response: unknown): T[] {
  if (response && typeof response === "object" && "data" in response) {
    const data = (response as { data: T[] }).data;
    return Array.isArray(data) ? data : [];
  }
  return Array.isArray(response) ? (response as T[]) : [];
}

export async function getRoles(): Promise<Role[]> {
  const response = await api.get<Role[] | { data: Role[] }>("/api/roles");
  return normalizeListResponse<Role>(response);
}

export interface GetRolesPaginatedParams {
  page?: number;
  limit?: number;
}

export async function getRolesPaginated(
  params: GetRolesPaginatedParams = {}
): Promise<PaginatedResponse<Role>> {
  const { page = 1, limit = 10 } = params;
  const query = new URLSearchParams({ page: String(page), limit: String(limit) });
  return api.get<PaginatedResponse<Role>>(`/api/roles?${query}`);
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

export async function deleteRole(id: string): Promise<void> {
  await api.delete(`/api/roles/${id}`);
}
