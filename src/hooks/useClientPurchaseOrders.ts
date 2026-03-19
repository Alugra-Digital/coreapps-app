/**
 * TanStack Query hooks for Client Purchase Orders (PO Masuk) API
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ClientPurchaseOrderCreateInput, ClientPurchaseOrderUpdateInput } from '@/finance/purchase-orders/clientPurchaseOrderTypes';
import * as cpoApi from '@/api/client-purchase-orders';

export const clientPurchaseOrderKeys = {
    all: ['clientPurchaseOrders'] as const,
    lists: () => [...clientPurchaseOrderKeys.all, 'list'] as const,
    details: () => [...clientPurchaseOrderKeys.all, 'detail'] as const,
    detail: (id: number) => [...clientPurchaseOrderKeys.details(), id] as const,
};

export function useClientPurchaseOrders() {
    return useQuery({
        queryKey: clientPurchaseOrderKeys.lists(),
        queryFn: () => cpoApi.getClientPurchaseOrders(),
    });
}

export function useClientPurchaseOrderById(id: number | undefined) {
    return useQuery({
        queryKey: clientPurchaseOrderKeys.detail(id!),
        queryFn: () => cpoApi.getClientPurchaseOrderById(id!),
        enabled: !!id,
    });
}

export function useCreateClientPurchaseOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: ClientPurchaseOrderCreateInput) => cpoApi.createClientPurchaseOrder(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: clientPurchaseOrderKeys.lists() });
        },
    });
}

export function useUpdateClientPurchaseOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, input }: { id: number; input: ClientPurchaseOrderUpdateInput }) =>
            cpoApi.updateClientPurchaseOrder(id, input),
        onSuccess: (_data, { id }) => {
            queryClient.invalidateQueries({ queryKey: clientPurchaseOrderKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: clientPurchaseOrderKeys.lists() });
        },
    });
}

export function useVerifyClientPurchaseOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => cpoApi.verifyClientPurchaseOrder(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: clientPurchaseOrderKeys.lists() });
        },
    });
}

export function useDeleteClientPurchaseOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => cpoApi.deleteClientPurchaseOrder(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: clientPurchaseOrderKeys.lists() });
        },
    });
}
