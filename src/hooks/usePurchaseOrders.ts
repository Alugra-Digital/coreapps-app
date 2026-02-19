/**
 * TanStack Query hooks for Purchase Orders API
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { PurchaseOrderCreateInput, PurchaseOrderUpdateInput } from '@/finance/purchase-orders/types';
import * as purchaseOrdersApi from '@/api/purchase-orders';

export const purchaseOrderKeys = {
    all: ['purchaseOrders'] as const,
    lists: () => [...purchaseOrderKeys.all, 'list'] as const,
    details: () => [...purchaseOrderKeys.all, 'detail'] as const,
    detail: (id: string) => [...purchaseOrderKeys.details(), id] as const,
};

export function usePurchaseOrders() {
    return useQuery({
        queryKey: purchaseOrderKeys.lists(),
        queryFn: () => purchaseOrdersApi.getPurchaseOrders(),
    });
}

export function usePurchaseOrderById(id: string | undefined) {
    return useQuery({
        queryKey: purchaseOrderKeys.detail(id!),
        queryFn: () => purchaseOrdersApi.getPurchaseOrderById(id!),
        enabled: !!id,
    });
}

export function useCreatePurchaseOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: PurchaseOrderCreateInput) => purchaseOrdersApi.createPurchaseOrder(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.lists() });
        },
    });
}

export function useUpdatePurchaseOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: PurchaseOrderUpdateInput }) =>
            purchaseOrdersApi.updatePurchaseOrder(id, input),
        onSuccess: (_data, { id }) => {
            queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.lists() });
        },
    });
}

export function useDeletePurchaseOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => purchaseOrdersApi.deletePurchaseOrder(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.lists() });
        },
    });
}
