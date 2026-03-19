/** User entity (no password in API response) */
export interface User {
  id: string;
  username: string;
  email: string | null;
  fullName: string | null;
  roleId: string | null;
  isActive: boolean;
  phone?: string | null;
  bio?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

/** Role summary for embedding in user response */
export interface UserRoleSummary {
  id: string;
  code: string;
  name: string;
  permissionKeys: string[];
}

/** Current user with role populated (for AuthContext) */
export interface CurrentUser extends User {
  role: UserRoleSummary;
}

export type UserCreateInput = Omit<User, "id" | "createdAt" | "updatedAt"> & {
  password?: string;
};
export type UserUpdateInput = Partial<Omit<User, "id">> & { password?: string };
