/**
 * Purchase Order API service.
 * Uses real backend API.
 */

import type {
  PurchaseOrder,
  PurchaseOrderCreateInput,
  PurchaseOrderUpdateInput,
} from "@/finance/purchase-orders/types";
import { api } from "@/lib/api/client";

const VENDOR_PO_BASE = "/api/finance/purchase-order";

export async function getPurchaseOrders(): Promise<PurchaseOrder[]> {
  return api.get<PurchaseOrder[]>(VENDOR_PO_BASE);
}

export async function getPurchaseOrderById(id: string): Promise<PurchaseOrder | null> {
  try {
    return await api.get<PurchaseOrder>(`${VENDOR_PO_BASE}/${id}`);
  } catch {
    return null;
  }
}

export async function createPurchaseOrder(
  input: PurchaseOrderCreateInput
): Promise<PurchaseOrder> {
  return api.post<PurchaseOrder>(VENDOR_PO_BASE, input);
}

export async function updatePurchaseOrder(
  id: string,
  input: PurchaseOrderUpdateInput
): Promise<PurchaseOrder> {
  return api.put<PurchaseOrder>(`${VENDOR_PO_BASE}/${id}`, input);
}

export async function deletePurchaseOrder(id: string): Promise<boolean> {
  try {
    await api.delete(`${VENDOR_PO_BASE}/${id}`);
    return true;
  } catch {
    return false;
  }
}

export function getPurchaseOrderPdfUrl(id: string): string {
  const base = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
  return base ? `${base}/api/finance/purchase-order/${id}/pdf` : `/api/finance/purchase-order/${id}/pdf`;
}
