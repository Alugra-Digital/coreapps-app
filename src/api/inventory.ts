/**
 * Inventory / Asset Management API service.
 * Uses real backend API.
 */

import type {
  InventoryItem,
  InventoryItemCreateInput,
  InventoryItemUpdateInput,
} from "@/inventory/types";
import { api } from "@/lib/api/client";

export async function getInventoryItems(): Promise<InventoryItem[]> {
  return api.get<InventoryItem[]>("/api/inventory");
}

export async function getInventoryItemById(id: string): Promise<InventoryItem | null> {
  try {
    return await api.get<InventoryItem>(`/api/inventory/${id}`);
  } catch {
    return null;
  }
}

export async function createInventoryItem(
  input: InventoryItemCreateInput
): Promise<InventoryItem> {
  return api.post<InventoryItem>("/api/inventory", input);
}

export async function updateInventoryItem(
  id: string,
  input: InventoryItemUpdateInput
): Promise<InventoryItem | null> {
  try {
    return await api.put<InventoryItem>(`/api/inventory/${id}`, input);
  } catch {
    return null;
  }
}

export async function deleteInventoryItem(id: string): Promise<boolean> {
  try {
    await api.delete(`/api/inventory/${id}`);
    return true;
  } catch {
    return false;
  }
}
