/**
 * Users API service.
 * Mock implementation; replace with real API when backend is ready.
 * getCurrentUser returns first user with role populated (for AuthContext).
 */

import type {
  User,
  UserCreateInput,
  UserUpdateInput,
  CurrentUser,
  UserRoleSummary,
} from "@/access-control/users/types";
import { mockUsers } from "@/access-control/users/data";
import { getRoleById } from "./roles";

let usersStore: User[] = [...mockUsers];

export async function getUsers(): Promise<User[]> {
  return Promise.resolve([...usersStore]);
}

export async function getUserById(id: string): Promise<User | null> {
  const user = usersStore.find((u) => u.id === id);
  return Promise.resolve(user ?? null);
}

/**
 * Get current user with role and permissionKeys (for AuthContext).
 * API: GET /api/auth/me
 * Mock: returns first user with role populated.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const user = usersStore[0];
  if (!user) return Promise.resolve(null);
  const role = await getRoleById(user.roleId);
  if (!role) return Promise.resolve(null);
  const summary: UserRoleSummary = {
    id: role.id,
    code: role.code,
    name: role.name,
    permissionKeys: role.permissionKeys,
  };
  return Promise.resolve({
    ...user,
    role: summary,
  });
}

export async function createUser(input: UserCreateInput): Promise<User> {
  const id = `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const now = new Date().toISOString();
  const { password: _pw, ...rest } = input;
  const user: User = {
    ...rest,
    id,
    createdAt: now,
    updatedAt: now,
  };
  usersStore.push(user);
  return Promise.resolve(user);
}

export async function updateUser(id: string, input: UserUpdateInput): Promise<User | null> {
  const index = usersStore.findIndex((u) => u.id === id);
  if (index === -1) return Promise.resolve(null);
  const { password: _pw, ...rest } = input;
  usersStore[index] = {
    ...usersStore[index],
    ...rest,
    updatedAt: new Date().toISOString(),
  };
  return Promise.resolve(usersStore[index]);
}

export async function deleteUser(id: string): Promise<boolean> {
  const index = usersStore.findIndex((u) => u.id === id);
  if (index === -1) return Promise.resolve(false);
  usersStore.splice(index, 1);
  return Promise.resolve(true);
}
