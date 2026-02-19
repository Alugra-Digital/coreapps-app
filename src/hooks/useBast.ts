/**
 * TanStack Query hooks for BAST API
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { BASTCreateInput, BASTUpdateInput } from '@/finance/bast/types';
import * as bastApi from '@/api/bast';

export const bastKeys = {
    all: ['basts'] as const,
    lists: () => [...bastKeys.all, 'list'] as const,
    details: () => [...bastKeys.all, 'detail'] as const,
    detail: (id: string) => [...bastKeys.details(), id] as const,
};

export function useBasts() {
    return useQuery({
        queryKey: bastKeys.lists(),
        queryFn: () => bastApi.getBasts(),
    });
}

export function useBastById(id: string | undefined) {
    return useQuery({
        queryKey: bastKeys.detail(id!),
        queryFn: () => bastApi.getBastById(id!),
        enabled: !!id,
    });
}

export function useCreateBast() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: BASTCreateInput) => bastApi.createBast(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: bastKeys.lists() });
        },
    });
}

export function useUpdateBast() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: BASTUpdateInput }) =>
            bastApi.updateBast(id, input),
        onSuccess: (_data, { id }) => {
            queryClient.invalidateQueries({ queryKey: bastKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: bastKeys.lists() });
        },
    });
}

export function useDeleteBast() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => bastApi.deleteBast(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: bastKeys.lists() });
        },
    });
}
