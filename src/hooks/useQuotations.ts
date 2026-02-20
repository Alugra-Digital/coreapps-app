/**
 * TanStack Query hooks for Quotations API
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Quotation, QuotationCreateInput, QuotationUpdateInput } from '@/finance/quotations/types';
import * as quotationsApi from '@/api/quotations';

export const quotationKeys = {
    all: ['quotations'] as const,
    lists: () => [...quotationKeys.all, 'list'] as const,
    list: (filters?: unknown) => [...quotationKeys.lists(), filters] as const,
    details: () => [...quotationKeys.all, 'detail'] as const,
    detail: (id: string) => [...quotationKeys.details(), id] as const,
};

export function useQuotations() {
    return useQuery({
        queryKey: quotationKeys.lists(),
        queryFn: () => quotationsApi.getQuotations(),
    });
}

export function useQuotationById(id: string | undefined) {
    return useQuery({
        queryKey: quotationKeys.detail(id!),
        queryFn: () => quotationsApi.getQuotationById(id!),
        enabled: !!id,
    });
}

export function useCreateQuotation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: QuotationCreateInput) => quotationsApi.createQuotation(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: quotationKeys.lists() });
        },
    });
}

export function useUpdateQuotation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: QuotationUpdateInput }) =>
            quotationsApi.updateQuotation(id, input),
        onMutate: async ({ id, input }) => {
            await queryClient.cancelQueries({ queryKey: quotationKeys.detail(id) });
            const previousQuotation = queryClient.getQueryData<Quotation>(quotationKeys.detail(id));

            if (previousQuotation) {
                queryClient.setQueryData<Quotation>(quotationKeys.detail(id), {
                    ...previousQuotation,
                    ...input,
                });
            }

            return { previousQuotation };
        },
        onError: (_err, { id }, context) => {
            if (context?.previousQuotation) {
                queryClient.setQueryData(quotationKeys.detail(id), context.previousQuotation);
            }
        },
        onSettled: (_data, _error, { id }) => {
            queryClient.invalidateQueries({ queryKey: quotationKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: quotationKeys.lists() });
        },
    });
}

export function useDeleteQuotation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => quotationsApi.deleteQuotation(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: quotationKeys.lists() });
            const previousQuotations = queryClient.getQueryData<Quotation[]>(quotationKeys.lists());

            if (previousQuotations) {
                queryClient.setQueryData<Quotation[]>(
                    quotationKeys.lists(),
                    previousQuotations.filter((quotation) => quotation.id !== id)
                );
            }

            return { previousQuotations };
        },
        onError: (_err, _id, context) => {
            if (context?.previousQuotations) {
                queryClient.setQueryData(quotationKeys.lists(), context.previousQuotations);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: quotationKeys.lists() });
        },
    });
}
