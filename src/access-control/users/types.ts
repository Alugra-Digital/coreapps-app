/** User entity (no password in API response) */
export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  roleId: string;
  isActive: boolean;
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
