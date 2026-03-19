/**
 * Hook for Account Selection from Master Accounts
 * Provides easy integration with AccountSelector component
 *
 * Features:
 * - Fetches accounts from Master Accounts (accounting-service /accounts)
 * - Manages selected account state
 * - Provides helper to update account fields in forms
 */

import { useState, useEffect } from 'react';
import { api } from '@/lib/api/client';

export interface Account {
  code: string;
  name: string;
  id?: number;
}

export function useAccountSelector() {
  const [selectedAccount, setSelectedAccount] = useState<Account | undefined>(undefined);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch accounts from Master Accounts
  const fetchAccounts = async (search = '') => {
    setLoading(true);
    try {
      const query = search ? `?search=${encodeURIComponent(search)}` : '';
      const data = await api.get<{ accounts: Account[] }>(`/api/accounting/accounts${query}`);
      setAccounts(data.accounts || []);
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize accounts on mount
  useEffect(() => {
    fetchAccounts();
  }, []);

  return {
    selectedAccount,
    setSelectedAccount,
    accounts,
    loading,
    fetchAccounts,
  };
}

/**
 * Helper to update form values with account from selector
 * Use this in your forms to sync with AccountSelector
 *
 * @param values - Current form values
 * @param setFieldValue - Function to update a field
 * @param accountField - The field name for account (e.g., 'coaAccount', 'debitAccount')
 *
 * @example
 * ```tsx
 * const accountSelector = useAccountSelector();
 * const form = useForm({...});
 *
 * // When account is selected
 * useAccountSelectorEffect(accountSelector, form, setFieldValue);
 * ```
 */
export function useAccountSelectorEffect(
  accountSelector: ReturnType<typeof useAccountSelector>,
  form: Record<string, unknown>,
  setFieldValue: (field: string, value: unknown) => void,
) {
  // When selectedAccount changes, update both accountNumber and accountName fields
  useEffect(() => {
    if (accountSelector.selectedAccount) {
      setFieldValue('accountNumber', accountSelector.selectedAccount.code);
      setFieldValue('accountName', accountSelector.selectedAccount.name);
    } else {
      // Clear both fields when no account selected
      setFieldValue('accountNumber', '');
      setFieldValue('accountName', '');
    }
  }, [accountSelector.selectedAccount]);
}
