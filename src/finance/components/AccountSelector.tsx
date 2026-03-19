/**
 * Account Selector Component
 * Simple input with autocomplete dropdown
 */

'use client';

import { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { api } from '@/lib/api/client';

export interface Account {
  code: string;
  name: string;
  id?: number;
}

function AccountSelector({
  value,
  onChange,
}: {
  value: { code: string; name: string } | undefined;
  onChange: (account: { code: string; name: string; id?: number } | undefined) => void;
  placeholder?: string;
}) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [inputValue, setInputValue] = useState('');

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

  useEffect(() => {
    fetchAccounts();
  }, []);

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = !search ||
      account.code.toLowerCase().includes(search.toLowerCase()) ||
      account.name.toLowerCase().includes(search.toLowerCase());

    const matchesInput = !inputValue ||
      account.code.toLowerCase().includes(inputValue.toLowerCase()) ||
      account.name.toLowerCase().includes(inputValue.toLowerCase());

    return matchesSearch && matchesInput;
  });

  return (
    <div className="w-full">
      <div className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Cari akun atau kode..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setOpen(true)}
          className="h-10 px-3 border rounded-md"
        />

        {value ? (
          <div className="flex items-center gap-2 border rounded-md p-2 mt-2">
            <div className="text-sm font-medium">{value.code}</div>
            <div className="text-sm text-muted-foreground">-</div>
            <div className="text-sm font-medium">{value.name}</div>
            <button
              type="button"
              onClick={() => {
                onChange({ code: '', name: '' });
                setInputValue('');
                setSearch('');
              }}
              className="p-1 hover:bg-muted rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          open && filteredAccounts.length > 0 && (
            <div className="mt-2 border rounded-md bg-background">
              {loading ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Memuat akun...
                </div>
              ) : (
                filteredAccounts.map((account) => (
                  <div
                    key={`${account.code}-${account.name}`}
                    onClick={() => {
                      onChange(account);
                      setInputValue('');
                      setSearch('');
                      setOpen(false);
                    }}
                    className="cursor-pointer p-3 hover:bg-muted flex items-center gap-2"
                  >
                    <div className="flex-1">
                      <span className="text-sm font-medium text-muted-foreground w-16">
                        {account.code}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {account.name}
                      </span>
                    </div>
                    {value && value.code === account.code ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : null}
                  </div>
                ))
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default AccountSelector;
