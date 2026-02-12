/**
 * Purchase Order API service.
 * Uses mock implementation; swap with api.get/post/put/delete when backend is ready.
 */

import type {
  PurchaseOrder,
  PurchaseOrderCreateInput,
  PurchaseOrderUpdateInput,
} from "@/finance/purchase-orders/types";
import { mockPurchaseOrders } from "@/finance/purchase-orders/data";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

let purchaseOrdersStore: PurchaseOrder[] = [...mockPurchaseOrders];

/**
 * Get all purchase orders.
 * API: GET /purchase-orders
 */
export async function getPurchaseOrders(): Promise<PurchaseOrder[]> {
  return Promise.resolve([...purchaseOrdersStore]);
}

/**
 * Get purchase order by ID.
 * API: GET /purchase-orders/:id
 */
export async function getPurchaseOrderById(
  id: string
): Promise<PurchaseOrder | null> {
  const po = purchaseOrdersStore.find((p) => p.id === id);
  return Promise.resolve(po ?? null);
}

/**
 * Create purchase order.
 * API: POST /purchase-orders
 */
export async function createPurchaseOrder(
  input: PurchaseOrderCreateInput
): Promise<PurchaseOrder> {
  const id = `PO-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const now = new Date().toISOString();
  const po: PurchaseOrder = {
    ...input,
    id,
    createdAt: now,
    updatedAt: now,
  };
  purchaseOrdersStore.push(po);
  return Promise.resolve(po);
}

/**
 * Update purchase order.
 * API: PUT /purchase-orders/:id
 */
export async function updatePurchaseOrder(
  id: string,
  input: PurchaseOrderUpdateInput
): Promise<PurchaseOrder | null> {
  const index = purchaseOrdersStore.findIndex((p) => p.id === id);
  if (index === -1) return Promise.resolve(null);
  purchaseOrdersStore[index] = {
    ...purchaseOrdersStore[index],
    ...input,
    updatedAt: new Date().toISOString(),
  };
  return Promise.resolve(purchaseOrdersStore[index]);
}

/**
 * Delete purchase order.
 * API: DELETE /purchase-orders/:id
 */
export async function deletePurchaseOrder(id: string): Promise<boolean> {
  const index = purchaseOrdersStore.findIndex((p) => p.id === id);
  if (index === -1) return Promise.resolve(false);
  purchaseOrdersStore.splice(index, 1);
  return Promise.resolve(true);
}

/**
 * Get PDF URL for purchase order (for iframe display).
 * API: GET /purchase-orders/:id/pdf
 * When backend is ready, this returns the API URL. For mock, returns data URL placeholder.
 */
export function getPurchaseOrderPdfUrl(id: string): string {
  return `${API_BASE_URL}/purchase-orders/${id}/pdf`;
}
