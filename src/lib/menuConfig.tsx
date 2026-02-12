import React from "react";
import {
  LayoutDashboard,
  Wallet,
  Package,
  FolderKanban,
  TrendingUp,
  FileBarChart,
  UserCog,
  Shield,
} from "lucide-react";

export interface MenuItemConfig {
  permissionKey: string;
  path: string;
  label: string;
  icon: React.ReactNode;
  children?: { permissionKey: string; path: string; label: string }[];
}

/** All permission keys for RBAC (used in Role form) */
export const ALL_PERMISSION_KEYS: string[] = [
  "dashboard",
  "finance",
  "finance.accounting",
  "finance.invoice",
  "finance.payment",
  "finance.purchase-orders",
  "finance.proposal-penawaran",
  "finance.perpajakan",
  "finance.bast",
  "inventory",
  "projects",
  "sales",
  "reports",
  "hr",
  "hr.employees",
  "access_control",
  "access_control.roles",
  "access_control.users",
];

/** Menu structure with permission keys for RBAC-driven sidebar */
export const MAIN_NAV_MENU: MenuItemConfig[] = [
  {
    permissionKey: "dashboard",
    path: "/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="h-[18px] w-[18px]" />,
  },
  {
    permissionKey: "finance",
    path: "/finance/accounting",
    label: "Finance",
    icon: <Wallet className="h-[18px] w-[18px]" />,
    children: [
      { permissionKey: "finance.accounting", path: "/finance/accounting", label: "Accounting" },
      { permissionKey: "finance.invoice", path: "/finance/invoice", label: "Invoice" },
      { permissionKey: "finance.payment", path: "/finance/payment", label: "Payment" },
      { permissionKey: "finance.purchase-orders", path: "/finance/purchase-orders", label: "Purchase Order" },
      { permissionKey: "finance.proposal-penawaran", path: "/finance/proposal-penawaran", label: "Proposal Penawaran" },
      { permissionKey: "finance.perpajakan", path: "/finance/perpajakan", label: "Perpajakan" },
      { permissionKey: "finance.bast", path: "/finance/bast", label: "BAST" },
    ],
  },
  {
    permissionKey: "inventory",
    path: "/inventory",
    label: "Inventory",
    icon: <Package className="h-[18px] w-[18px]" />,
  },
  {
    permissionKey: "projects",
    path: "/projects",
    label: "Project",
    icon: <FolderKanban className="h-[18px] w-[18px]" />,
  },
  {
    permissionKey: "sales",
    path: "/sales",
    label: "Sales",
    icon: <TrendingUp className="h-[18px] w-[18px]" />,
  },
  {
    permissionKey: "reports",
    path: "/reports",
    label: "Reports",
    icon: <FileBarChart className="h-[18px] w-[18px]" />,
  },
  {
    permissionKey: "hr",
    path: "/hr/employees",
    label: "HR",
    icon: <UserCog className="h-[18px] w-[18px]" />,
    children: [
      { permissionKey: "hr.employees", path: "/hr/employees", label: "Employee" },
    ],
  },
  {
    permissionKey: "access_control",
    path: "/access-control/roles",
    label: "Access Control",
    icon: <Shield className="h-[18px] w-[18px]" />,
    children: [
      { permissionKey: "access_control.roles", path: "/access-control/roles", label: "Roles" },
      { permissionKey: "access_control.users", path: "/access-control/users", label: "Users" },
    ],
  },
];
