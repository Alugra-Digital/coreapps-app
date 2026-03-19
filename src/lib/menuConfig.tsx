import React from "react";
import {
  LayoutDashboard,
  Wallet,
  Package,
  FolderKanban,
  Shield,
  Bell,
} from "lucide-react";

export interface MenuItemConfig {
  permissionKey: string;
  path: string;
  label: string;
  icon: React.ReactNode;
  children?: MenuItemChildConfig[];
}

export interface MenuItemChildConfig {
  permissionKey: string;
  path: string;
  label: string;
  children?: MenuItemChildConfig[];
}

/** All permission keys for RBAC (used in Role form) */
export const ALL_PERMISSION_KEYS: string[] = [
  "dashboard",
  "finance",
  "finance.invoice",
  "finance.purchase-orders",
  "finance.clients",
  "finance.quotations",
  "finance.proposal-penawaran",
  "finance.perpajakan",
  "finance.bast",
  "finance.catatan-pengeluaran",
  "finance.kas-kecil",
  "finance.kas-bank",
  "finance.jurnal-memorial",
  "finance.vouchers",
  "finance.assets",
  "finance.asset-acquisition-journals",
  "finance.asset-depreciation-journals",
  "finance.buku-besar",
  "finance.neraca-saldo",
  "assets",
  "projects",
  "notifications",
  "access_control",
  "access_control.roles",
  "access_control.users",
  "finance.master-account",
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
    path: "/finance/invoice",
    label: "Finance",
    icon: <Wallet className="h-[18px] w-[18px]" />,
    children: [
      { permissionKey: "finance.invoice", path: "/finance/invoice", label: "Invoice" },
      { permissionKey: "finance.purchase-orders", path: "/finance/purchase-orders", label: "Purchase Order" },
      { permissionKey: "finance.clients", path: "/finance/clients", label: "Clients" },
      { permissionKey: "finance.quotations", path: "/finance/quotations", label: "Vendor Quotation" },
      { permissionKey: "finance.proposal-penawaran", path: "/finance/proposal-penawaran", label: "Proposal Penawaran" },
      { permissionKey: "finance.perpajakan", path: "/finance/perpajakan", label: "Perpajakan" },
      { permissionKey: "finance.bast", path: "/finance/bast", label: "BAST" },
      // Catatan Pengeluaran (Module 6A)
      {
        permissionKey: "finance.catatan-pengeluaran",
        path: "/finance/catatan-pengeluaran",
        label: "Catatan Pengeluaran",
        children: [
          { permissionKey: "finance.kas-kecil", path: "/finance/kas-kecil", label: "Kas Kecil" },
          { permissionKey: "finance.kas-bank", path: "/finance/kas-bank", label: "Kas Bank" },
        ],
      },
      { permissionKey: "finance.jurnal-memorial", path: "/finance/jurnal-memorial", label: "Jurnal Memorial" },
      // Voucher (Module 6B)
      { permissionKey: "finance.vouchers", path: "/finance/vouchers", label: "Voucher" },
      // Master Data (Module 6)
      { permissionKey: "finance.master-account", path: "/finance/master-account", label: "Master Account" },
      // Pembukuan (Module 6D)
      { permissionKey: "finance.buku-besar", path: "/finance/buku-besar", label: "Buku Besar" },
      { permissionKey: "finance.neraca-saldo", path: "/finance/neraca-saldo", label: "Neraca Saldo" },
    ],
  },
  {
    permissionKey: "assets",
    path: "/finance/assets",
    label: "Laporan dan Jurnal Aset",
    icon: <Package className="h-[18px] w-[18px]" />,
    children: [
      { permissionKey: "finance.assets", path: "/finance/assets", label: "Daftar Aset" },
      { permissionKey: "finance.asset-acquisition-journals", path: "/finance/asset-acquisition-journals", label: "Jurnal Memori Aset" },
      { permissionKey: "finance.asset-depreciation-journals", path: "/finance/asset-depreciation-journals", label: "Jurnal Penyusutan Aset" },
    ],
  },
  {
    permissionKey: "projects",
    path: "/projects",
    label: "Project",
    icon: <FolderKanban className="h-[18px] w-[18px]" />,
  },
  {
    permissionKey: "notifications",
    path: "/notifications",
    label: "Notifications",
    icon: <Bell className="h-[18px] w-[18px]" />,
  },
  {
    permissionKey: "access_control",
    path: "/access-control/roles",
    label: "Access Control",
    icon: <Shield className="h-[18px] w-[18px]" />,
    children: [
      { permissionKey: "access_control.roles", path: "/access-control/roles", label: "Master Role" },
      { permissionKey: "access_control.users", path: "/access-control/users", label: "Master User" },
    ],
  },
];
