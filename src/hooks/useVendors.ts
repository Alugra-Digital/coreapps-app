/**
 * TanStack Query hooks for Vendors API
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Vendor, VendorCreateInput, VendorUpdateInput } from '@/finance/vendors/types';
import * as vendorsApi from '@/api/vendors';

export const vendorKeys = {
    all: ['vendors'] as const,
    lists: () => [...vendorKeys.all, 'list'] as const,
    list: (filters?: unknown) => [...vendorKeys.lists(), filters] as const,
    details: () => [...vendorKeys.all, 'detail'] as const,
    detail: (id: string) => [...vendorKeys.details(), id] as const,
};

export function useVendors() {
    return useQuery({
        queryKey: vendorKeys.lists(),
        queryFn: () => vendorsApi.getVendors(),
    });
}

export function useVendorById(id: string | undefined) {
    return useQuery({
        queryKey: vendorKeys.detail(id!),
        queryFn: () => vendorsApi.getVendorById(id!),
        enabled: !!id,
    });
}

export function useCreateVendor() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: VendorCreateInput) => vendorsApi.createVendor(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: vendorKeys.lists() });
        },
    });
}

export function useUpdateVendor() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: VendorUpdateInput }) =>
            vendorsApi.updateVendor(id, input),
        onMutate: async ({ id, input }) => {
            await queryClient.cancelQueries({ queryKey: vendorKeys.detail(id) });
            const previousVendor = queryClient.getQueryData<Vendor>(vendorKeys.detail(id));

            if (previousVendor) {
                queryClient.setQueryData<Vendor>(vendorKeys.detail(id), {
                    ...previousVendor,
                    ...input,
                });
            }

            return { previousVendor };
        },
        onError: (_err, { id }, context) => {
            if (context?.previousVendor) {
                queryClient.setQueryData(vendorKeys.detail(id), context.previousVendor);
            }
        },
        onSettled: (_data, _error, { id }) => {
            queryClient.invalidateQueries({ queryKey: vendorKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: vendorKeys.lists() });
        },
    });
}

export function useDeleteVendor() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => vendorsApi.deleteVendor(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: vendorKeys.lists() });
            const previousVendors = queryClient.getQueryData<Vendor[]>(vendorKeys.lists());

            if (previousVendors) {
                queryClient.setQueryData<Vendor[]>(
                    vendorKeys.lists(),
                    previousVendors.filter((vendor) => vendor.id !== id)
                );
            }

            return { previousVendors };
        },
        onError: (_err, _id, context) => {
            if (context?.previousVendors) {
                queryClient.setQueryData(vendorKeys.lists(), context.previousVendors);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: vendorKeys.lists() });
        },
    });
}
