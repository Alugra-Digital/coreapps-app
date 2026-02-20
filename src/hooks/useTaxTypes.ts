/**
 * TanStack Query hooks for Tax Types API
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { TaxTypeCreateInput, TaxTypeUpdateInput } from '@/finance/perpajakan/types';
import * as taxTypesApi from '@/api/tax-types';

export const taxTypeKeys = {
    all: ['taxTypes'] as const,
    lists: () => [...taxTypeKeys.all, 'list'] as const,
    details: () => [...taxTypeKeys.all, 'detail'] as const,
    detail: (id: string) => [...taxTypeKeys.details(), id] as const,
};

export function useTaxTypes() {
    return useQuery({
        queryKey: taxTypeKeys.lists(),
        queryFn: () => taxTypesApi.getTaxTypes(),
    });
}

export function useTaxTypeById(id: string | undefined) {
    return useQuery({
        queryKey: taxTypeKeys.detail(id!),
        queryFn: () => taxTypesApi.getTaxTypeById(id!),
        enabled: !!id,
    });
}

export function useCreateTaxType() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: TaxTypeCreateInput) => taxTypesApi.createTaxType(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: taxTypeKeys.lists() });
        },
    });
}

export function useUpdateTaxType() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: TaxTypeUpdateInput }) =>
            taxTypesApi.updateTaxType(id, input),
        onSuccess: (_data, { id }) => {
            queryClient.invalidateQueries({ queryKey: taxTypeKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: taxTypeKeys.lists() });
        },
    });
}

export function useDeleteTaxType() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => taxTypesApi.deleteTaxType(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: taxTypeKeys.lists() });
        },
    });
}
