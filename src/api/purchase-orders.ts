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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export async function getPurchaseOrders(): Promise<PurchaseOrder[]> {
  return api.get<PurchaseOrder[]>("/api/finance/purchase-orders");
}

export async function getPurchaseOrderById(id: string): Promise<PurchaseOrder | null> {
  try {
    return await api.get<PurchaseOrder>(`/api/finance/purchase-orders/${id}`);
  } catch {
    return null;
  }
}

export async function createPurchaseOrder(
  input: PurchaseOrderCreateInput
): Promise<PurchaseOrder> {
  return api.post<PurchaseOrder>("/api/finance/purchase-orders", input);
}

export async function updatePurchaseOrder(
  id: string,
  input: PurchaseOrderUpdateInput
): Promise<PurchaseOrder | null> {
  try {
    return await api.put<PurchaseOrder>(`/api/finance/purchase-orders/${id}`, input);
  } catch {
    return null;
  }
}

export async function deletePurchaseOrder(id: string): Promise<boolean> {
  try {
    await api.delete(`/api/finance/purchase-orders/${id}`);
    return true;
  } catch {
    return false;
  }
}

export function getPurchaseOrderPdfUrl(id: string): string {
  const base = API_BASE_URL ? API_BASE_URL.replace(/\/$/, "") : "";
  return `${base}/api/finance/purchase-orders/${id}/pdf`;
}
