import type { User } from "./types";

export const mockUsers: User[] = [
  {
    id: "user-admin-1",
    username: "admin",
    email: "admin@example.com",
    fullName: "Administrator",
    roleId: "role-admin",
    isActive: true,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "user-finance-1",
    username: "finance_user",
    email: "finance@example.com",
    fullName: "Finance User",
    roleId: "role-finance",
    isActive: true,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
];
