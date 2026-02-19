/**
 * Users API service.
 * Uses real backend API.
 */

import type {
  User,
  UserCreateInput,
  UserUpdateInput,
  CurrentUser,
} from "@/access-control/users/types";
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

export async function getUsers(): Promise<User[]> {
  const response = await api.get<User[] | { data: User[] }>("/api/users");
  return normalizeListResponse<User>(response);
}

export interface GetUsersPaginatedParams {
  page?: number;
  limit?: number;
}

export async function getUsersPaginated(
  params: GetUsersPaginatedParams = {}
): Promise<PaginatedResponse<User>> {
  const { page = 1, limit = 10 } = params;
  const query = new URLSearchParams({ page: String(page), limit: String(limit) });
  return api.get<PaginatedResponse<User>>(`/api/users?${query}`);
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    return await api.get<User>(`/api/users/${id}`);
  } catch {
    return null;
  }
}

/**
 * Get current user with role and permissionKeys (for AuthContext).
 * API: GET /api/auth/me
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    return await api.get<CurrentUser>("/api/auth/me");
  } catch {
    return null;
  }
}

export async function createUser(input: UserCreateInput): Promise<User> {
  return api.post<User>("/api/users", input);
}

export async function updateUser(id: string, input: UserUpdateInput): Promise<User> {
  return api.put<User>(`/api/users/${id}`, input);
}

export async function deleteUser(id: string): Promise<boolean> {
  try {
    await api.delete(`/api/users/${id}`);
    return true;
  } catch {
    return false;
  }
}
