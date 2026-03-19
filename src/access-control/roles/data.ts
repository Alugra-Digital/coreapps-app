import type { Role } from "./types";
import { ALL_PERMISSION_KEYS } from "@/lib/menuConfig";

export const mockRoles: Role[] = [
  {
    id: "role-admin",
    code: "ADMIN",
    name: "Administrator",
    description: "Full access to all modules",
    permissionKeys: [...ALL_PERMISSION_KEYS],
    isActive: true,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "role-finance",
    code: "FINANCE_USER",
    name: "Finance User",
    description: "Access to finance modules",
    permissionKeys: [
      "dashboard",
      "finance",
      "finance.accounting",
      "finance.invoice",
      "finance.purchase-orders",
      "finance.proposal-penawaran",
      "finance.perpajakan",
      "finance.bast",
    ],
    isActive: true,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
];
