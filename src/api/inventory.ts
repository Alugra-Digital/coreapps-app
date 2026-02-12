/**
 * Inventory / Asset Management API service.
 * Uses mock implementation; swap with api.get/post/put/delete when backend is ready.
 */

import type {
  InventoryItem,
  InventoryItemCreateInput,
  InventoryItemUpdateInput,
} from "@/inventory/types";
import { mockInventoryItems } from "@/inventory/data";

let inventoryStore: InventoryItem[] = [...mockInventoryItems];

/**
 * Get all inventory items.
 * API: GET /inventory
 */
export async function getInventoryItems(): Promise<InventoryItem[]> {
  return Promise.resolve([...inventoryStore]);
}

/**
 * Get inventory item by ID.
 * API: GET /inventory/:id
 */
export async function getInventoryItemById(
  id: string
): Promise<InventoryItem | null> {
  const item = inventoryStore.find((i) => i.id === id);
  return Promise.resolve(item ?? null);
}

/**
 * Create inventory item.
 * API: POST /inventory
 */
export async function createInventoryItem(
  input: InventoryItemCreateInput
): Promise<InventoryItem> {
  const id = `INV-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const now = new Date().toISOString();
  const item: InventoryItem = {
    ...input,
    id,
    createdAt: now,
    updatedAt: now,
  };
  inventoryStore.push(item);
  return Promise.resolve(item);
}

/**
 * Update inventory item.
 * API: PUT /inventory/:id
 */
export async function updateInventoryItem(
  id: string,
  input: InventoryItemUpdateInput
): Promise<InventoryItem | null> {
  const index = inventoryStore.findIndex((i) => i.id === id);
  if (index === -1) return Promise.resolve(null);
  inventoryStore[index] = {
    ...inventoryStore[index],
    ...input,
    updatedAt: new Date().toISOString(),
  };
  return Promise.resolve(inventoryStore[index]);
}

/**
 * Delete inventory item.
 * API: DELETE /inventory/:id
 */
export async function deleteInventoryItem(id: string): Promise<boolean> {
  const index = inventoryStore.findIndex((i) => i.id === id);
  if (index === -1) return Promise.resolve(false);
  inventoryStore.splice(index, 1);
  return Promise.resolve(true);
}
