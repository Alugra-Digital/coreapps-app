/**
 * Client Purchase Order (PO Masuk) API service.
 * Uses real backend API for client-issued purchase orders.
 */

import type {
    ClientPurchaseOrder,
    ClientPurchaseOrderCreateInput,
    ClientPurchaseOrderUpdateInput,
} from "@/finance/purchase-orders/clientPurchaseOrderTypes";
import { api } from "@/lib/api/client";

const CPO_BASE = "/api/finance/client-purchase-orders";

export async function getClientPurchaseOrders(): Promise<ClientPurchaseOrder[]> {
    return api.get<ClientPurchaseOrder[]>(CPO_BASE);
}

export async function getClientPurchaseOrderById(id: number): Promise<ClientPurchaseOrder | null> {
    try {
        return await api.get<ClientPurchaseOrder>(`${CPO_BASE}/${id}`);
    } catch {
        return null;
    }
}

export async function createClientPurchaseOrder(
    input: ClientPurchaseOrderCreateInput
): Promise<ClientPurchaseOrder> {
    return api.post<ClientPurchaseOrder>(CPO_BASE, input);
}

export async function updateClientPurchaseOrder(
    id: number,
    input: ClientPurchaseOrderUpdateInput
): Promise<ClientPurchaseOrder | null> {
    try {
        return await api.put<ClientPurchaseOrder>(`${CPO_BASE}/${id}`, input);
    } catch {
        return null;
    }
}

export async function verifyClientPurchaseOrder(id: number): Promise<ClientPurchaseOrder | null> {
    try {
        return await api.patch<ClientPurchaseOrder>(`${CPO_BASE}/${id}/verify`, {});
    } catch {
        return null;
    }
}

export async function deleteClientPurchaseOrder(id: number): Promise<boolean> {
    try {
        await api.delete(`${CPO_BASE}/${id}`);
        return true;
    } catch {
        return false;
    }
}
