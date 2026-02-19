/**
 * Auth API service.
 * POST /api/auth/login - JWT login (no auth header required).
 */

import type { CurrentUser } from "@/access-control/users/types";
import { api } from "@/lib/api/client";

export interface LoginResponse {
  token: string;
  user: CurrentUser | { id: string; username: string; email: string; fullName: string; role?: string };
}

/**
 * Login with username and password.
 * Returns { token, user }. Store token and optionally fetch /api/auth/me for full user with role.permissionKeys.
 */
export async function login(
  username: string,
  password: string
): Promise<LoginResponse> {
  return api.post<LoginResponse>("/api/auth/login", { username, password });
}
