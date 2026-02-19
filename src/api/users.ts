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
import { api } from "@/lib/api/client";

export async function getUsers(): Promise<User[]> {
  return api.get<User[]>("/api/users");
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
