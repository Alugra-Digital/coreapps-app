import { api } from '@/lib/api/client';

export interface Account {
    id: number;
    code: string;
    name: string;
    type: string;
    isGroup: boolean;
    parentAccountId: number | null;
}

export const accountsApi = {
    getAccounts: async (): Promise<Account[]> => {
        return api.get<Account[]>('/api/accounting/accounts');
    },
    createAccount: async (data: Partial<Account>): Promise<Account> => {
        return api.post<Account>('/api/accounting/accounts', data);
    },
    updateAccount: async (id: number, data: Partial<Account>): Promise<Account> => {
        return api.patch<Account>(`/api/accounting/accounts/${id}`, data);
    },
    deleteAccount: async (id: number): Promise<void> => {
        return api.delete(`/api/accounting/accounts/${id}`);
    }
};
