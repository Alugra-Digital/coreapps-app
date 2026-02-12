import type { InventoryItem } from "./types";

export const mockInventoryItems: InventoryItem[] = [
  {
    id: "INV-001",
    code: "ASSET-1021",
    name: 'MacBook Pro 14" M3 Max',
    quantity: 12,
    price: 2499,
    createdAt: "2025-01-15T10:00:00Z",
    updatedAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "INV-002",
    code: "ASSET-4052",
    name: "Dell PowerEdge R760",
    quantity: 2,
    price: 8500,
    createdAt: "2025-01-16T10:00:00Z",
    updatedAt: "2025-01-16T10:00:00Z",
  },
  {
    id: "INV-003",
    code: "ASSET-9012",
    name: "Cisco Catalyst 9300",
    quantity: 8,
    price: 4200,
    createdAt: "2025-01-17T10:00:00Z",
    updatedAt: "2025-01-17T10:00:00Z",
  },
  {
    id: "INV-004",
    code: "ASSET-3021",
    name: "Logitech MX Master 3S",
    quantity: 45,
    price: 99,
    createdAt: "2025-01-18T10:00:00Z",
    updatedAt: "2025-01-18T10:00:00Z",
  },
];
