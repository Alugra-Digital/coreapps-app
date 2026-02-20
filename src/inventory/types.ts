/** Inventory / Asset item entity */
export interface InventoryItem {
  id: string;
  code: string;
  name: string;
  quantity: number;
  price: number;
  createdAt?: string;
  updatedAt?: string;
}

export type InventoryItemCreateInput = Omit<
  InventoryItem,
  "id" | "createdAt" | "updatedAt"
>;
export type InventoryItemUpdateInput = Partial<InventoryItemCreateInput>;
