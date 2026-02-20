/** Role entity */
export interface Role {
  id: string;
  code: string;
  name: string;
  description?: string;
  permissionKeys: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type RoleCreateInput = Omit<Role, "id" | "createdAt" | "updatedAt">;
export type RoleUpdateInput = Partial<RoleCreateInput>;
