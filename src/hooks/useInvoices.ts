/**
 * TanStack Query hooks for Invoices API
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { InvoiceCreateInput, InvoiceUpdateInput } from '@/invoice/types';
import * as invoicesApi from '@/api/invoices';

export const invoiceKeys = {
    all: ['invoices'] as const,
    lists: () => [...invoiceKeys.all, 'list'] as const,
    details: () => [...invoiceKeys.all, 'detail'] as const,
    detail: (id: string) => [...invoiceKeys.details(), id] as const,
};

export function useInvoices() {
    return useQuery({
        queryKey: invoiceKeys.lists(),
        queryFn: () => invoicesApi.getInvoices(),
    });
}

export function useInvoiceById(id: string | undefined) {
    return useQuery({
        queryKey: invoiceKeys.detail(id!),
        queryFn: () => invoicesApi.getInvoiceById(id!),
        enabled: !!id,
    });
}

export function useCreateInvoice() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: InvoiceCreateInput) => invoicesApi.createInvoice(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
        },
    });
}

export function useUpdateInvoice() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: InvoiceUpdateInput }) =>
            invoicesApi.updateInvoice(id, input),
        onSuccess: (_data, { id }) => {
            queryClient.invalidateQueries({ queryKey: invoiceKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
        },
    });
}

export function useDeleteInvoice() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => invoicesApi.deleteInvoice(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
        },
    });
}
