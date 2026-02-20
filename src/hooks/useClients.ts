/**
 * TanStack Query hooks for Clients API
 * 
 * Provides optimized data fetching and mutations for client management
 * with automatic caching, background refetching, and optimistic updates.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Client, ClientCreateInput, ClientUpdateInput } from '@/finance/clients/types';
import * as clientsApi from '@/api/clients';

// Query Keys
export const clientKeys = {
    all: ['clients'] as const,
    lists: () => [...clientKeys.all, 'list'] as const,
    list: (filters?: unknown) => [...clientKeys.lists(), filters] as const,
    details: () => [...clientKeys.all, 'detail'] as const,
    detail: (id: string) => [...clientKeys.details(), id] as const,
};

/**
 * Fetch all clients
 */
export function useClients() {
    return useQuery({
        queryKey: clientKeys.lists(),
        queryFn: () => clientsApi.getClients(),
    });
}

/**
 * Fetch a single client by ID
 */
export function useClientById(id: string | undefined) {
    return useQuery({
        queryKey: clientKeys.detail(id!),
        queryFn: () => clientsApi.getClientById(id!),
        enabled: !!id,
    });
}

/**
 * Create a new client
 */
export function useCreateClient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: ClientCreateInput) => clientsApi.createClient(input),
        onSuccess: () => {
            // Invalidate clients list to refetch with new data
            queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
        },
    });
}

/**
 * Update an existing client
 */
export function useUpdateClient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: ClientUpdateInput }) =>
            clientsApi.updateClient(id, input),
        onMutate: async ({ id, input }) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: clientKeys.detail(id) });

            // Snapshot previous value
            const previousClient = queryClient.getQueryData<Client>(clientKeys.detail(id));

            // Optimistically update
            if (previousClient) {
                queryClient.setQueryData<Client>(clientKeys.detail(id), {
                    ...previousClient,
                    ...input,
                });
            }

            return { previousClient };
        },
        onError: (_err, { id }, context) => {
            // Rollback on error
            if (context?.previousClient) {
                queryClient.setQueryData(clientKeys.detail(id), context.previousClient);
            }
        },
        onSettled: (_data, _error, { id }) => {
            // Refetch after mutation
            queryClient.invalidateQueries({ queryKey: clientKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
        },
    });
}

/**
 * Delete a client
 */
export function useDeleteClient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => clientsApi.deleteClient(id),
        onMutate: async (id) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: clientKeys.lists() });

            // Snapshot previous value
            const previousClients = queryClient.getQueryData<Client[]>(clientKeys.lists());

            // Optimistically remove from list
            if (previousClients) {
                queryClient.setQueryData<Client[]>(
                    clientKeys.lists(),
                    previousClients.filter((client) => client.id !== id)
                );
            }

            return { previousClients };
        },
        onError: (_err, _id, context) => {
            // Rollback on error
            if (context?.previousClients) {
                queryClient.setQueryData(clientKeys.lists(), context.previousClients);
            }
        },
        onSettled: () => {
            // Refetch after mutation
            queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
        },
    });
}
