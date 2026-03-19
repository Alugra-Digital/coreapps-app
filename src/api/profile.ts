/**
 * Profile API service.
 * GET /api/auth/me, PATCH /api/auth/me
 */

import { api } from "@/lib/api/client";

export interface ProfileUpdateInput {
  fullName?: string;
  email?: string;
  phone?: string;
  bio?: string;
}

export interface Profile {
  id: string;
  username: string;
  email: string | null;
  fullName: string | null;
  phone?: string | null;
  bio?: string | null;
  roleId: string | null;
  isActive: boolean;
  createdAt: string | null;
  updatedAt: string | null;
  role?: { id: string; code: string; name: string; permissionKeys: string[] } | null;
}

export async function getProfile(): Promise<Profile | null> {
  try {
    return await api.get<Profile>("/api/auth/me");
  } catch {
    return null;
  }
}

export async function updateProfile(input: ProfileUpdateInput): Promise<Profile> {
  return api.patch<Profile>("/api/auth/me", input);
}
