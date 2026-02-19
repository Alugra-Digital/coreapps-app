/**
 * TanStack Query hooks for Positions API
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Position, PositionCreateInput, PositionUpdateInput } from '@/hr/positions/types';
import * as positionsApi from '@/api/positions';

export const positionKeys = {
    all: ['positions'] as const,
    lists: () => [...positionKeys.all, 'list'] as const,
    list: (filters?: unknown) => [...positionKeys.lists(), filters] as const,
    details: () => [...positionKeys.all, 'detail'] as const,
    detail: (id: string) => [...positionKeys.details(), id] as const,
};

export function usePositions() {
    return useQuery({
        queryKey: positionKeys.lists(),
        queryFn: () => positionsApi.getPositions(),
    });
}

export function usePositionById(id: string | undefined) {
    return useQuery({
        queryKey: positionKeys.detail(id!),
        queryFn: () => positionsApi.getPositionById(id!),
        enabled: !!id,
    });
}

export function useCreatePosition() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: PositionCreateInput) => positionsApi.createPosition(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: positionKeys.lists() });
        },
    });
}

export function useUpdatePosition() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: PositionUpdateInput }) =>
            positionsApi.updatePosition(id, input),
        onMutate: async ({ id, input }) => {
            await queryClient.cancelQueries({ queryKey: positionKeys.detail(id) });
            const previousPosition = queryClient.getQueryData<Position>(positionKeys.detail(id));

            if (previousPosition) {
                queryClient.setQueryData<Position>(positionKeys.detail(id), {
                    ...previousPosition,
                    ...input,
                });
            }

            return { previousPosition };
        },
        onError: (_err, { id }, context) => {
            if (context?.previousPosition) {
                queryClient.setQueryData(positionKeys.detail(id), context.previousPosition);
            }
        },
        onSettled: (_data, _error, { id }) => {
            queryClient.invalidateQueries({ queryKey: positionKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: positionKeys.lists() });
        },
    });
}

export function useDeletePosition() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => positionsApi.deletePosition(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: positionKeys.lists() });
            const previousPositions = queryClient.getQueryData<Position[]>(positionKeys.lists());

            if (previousPositions) {
                queryClient.setQueryData<Position[]>(
                    positionKeys.lists(),
                    previousPositions.filter((position) => position.id !== id)
                );
            }

            return { previousPositions };
        },
        onError: (_err, _id, context) => {
            if (context?.previousPositions) {
                queryClient.setQueryData(positionKeys.lists(), context.previousPositions);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: positionKeys.lists() });
        },
    });
}
