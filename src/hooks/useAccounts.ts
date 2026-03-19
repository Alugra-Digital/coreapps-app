import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Account } from '../api/accounts';
import { accountsApi } from '../api/accounts';

export const useAccounts = () => {
    return useQuery<Account[], Error>({
        queryKey: ['accounts'],
        queryFn: accountsApi.getAccounts,
    });
};

export const useCreateAccount = () => {
    const queryClient = useQueryClient();
    return useMutation<Account, Error, Partial<Account>>({
        mutationFn: accountsApi.createAccount,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
        },
    });
};

export const useUpdateAccount = () => {
    const queryClient = useQueryClient();
    return useMutation<Account, Error, { id: number; data: Partial<Account> }>({
        mutationFn: ({ id, data }) => accountsApi.updateAccount(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
        },
    });
};

export const useDeleteAccount = () => {
    const queryClient = useQueryClient();
    return useMutation<void, Error, number>({
        mutationFn: accountsApi.deleteAccount,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
        },
    });
};
