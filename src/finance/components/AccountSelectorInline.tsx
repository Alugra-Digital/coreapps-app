/**
 * Inline Account Selector Component
 * Combobox pattern for selecting accounts from Master Accounts
 * Designed for use in table rows and forms
 *
 * Features:
 * - Dropdown showing all accounts (code + name)
 * - Typeable input for account number with autocomplete
 * - When an account is selected, both accountNumber and accountName are filled
 * - Typing in input filters dropdown
 */

'use client';

import { useState, useEffect } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { api } from '@/lib/api/client';

// Popover components
const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverContent = PopoverPrimitive.Content;

interface Account {
  code: string;
  name: string;
  id?: number;
}

interface AccountSelectorInlineProps {
  value?: { code: string; name: string } | null;
  onChange: (account: { code: string; name: string } | null) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
}

// Hook to fetch accounts
function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAccounts = async (search = '') => {
    setLoading(true);
    try {
      const query = search ? `?search=${encodeURIComponent(search)}` : '';
      const data = await api.get<{ accounts: Account[] }>(`/api/accounting/accounts${query}`);
      setAccounts(data.accounts || []);
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  return { accounts, loading, fetchAccounts };
}

export default function AccountSelectorInline({
  value,
  onChange,
  placeholder = 'Pilih akun...',
  className,
  inputClassName,
}: AccountSelectorInlineProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { accounts, loading, fetchAccounts } = useAccounts();

  // Load accounts on mount
  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  // Fetch accounts when search changes (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.length > 0) {
        fetchAccounts(search);
      } else {
        fetchAccounts();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Display value
  const displayValue = value ? `${value.code} - ${value.name}` : '';

  // Handle account selection
  const handleSelect = (account: Account) => {
    onChange({ code: account.code, name: account.name });
    setOpen(false);
    setSearch('');
  };

  // Handle clear
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setSearch('');
  };

  // Handle input change (filter)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearch(newValue);
    // Also update parent if it looks like a direct account code entry
    if (newValue && /^\d+/.test(newValue)) {
      // Try to find matching account
      const match = accounts.find(a => a.code === newValue);
      if (match) {
        onChange({ code: match.code, name: match.name });
      }
    }
  };

  // Filter accounts
  const filteredAccounts = accounts.filter(account => {
    const searchLower = search.toLowerCase();
    return (
      account.code.toLowerCase().includes(searchLower) ||
      account.name.toLowerCase().includes(searchLower)
    );
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className={cn('relative w-full', className)}>
          <input
            type="text"
            value={search || displayValue}
            onChange={handleInputChange}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className={cn(
              'h-7 text-xs bg-[#111113] border-[#1E1E22] text-[#F0F0F0] focus:ring-1 focus:ring-[#F5A623] rounded-md px-2 py-1.5 w-full pr-8',
              inputClassName
            )}
          />
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-1 top-1/2 -translate-y-1/2 text-[#6B6B75] hover:text-[#F0F0F0]"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <ChevronDown className={cn(
            'absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#6B6B75] transition-transform',
            open && 'rotate-180',
            value && 'hidden'
          )} />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-[300px] p-0 bg-[#111113] border-[#1E1E22]"
        align="start"
      >
        <ScrollArea className="max-h-[200px]">
          {loading ? (
            <div className="p-4 text-center text-xs text-[#6B6B75]">
              Memuat akun...
            </div>
          ) : filteredAccounts.length === 0 ? (
            <div className="p-4 text-center text-xs text-[#6B6B75]">
              Tidak ada akun ditemukan
            </div>
          ) : (
            <div className="py-1">
              {filteredAccounts.map((account) => (
                <button
                  key={`${account.code}-${account.name}`}
                  type="button"
                  onClick={() => handleSelect(account)}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-1.5 text-left text-xs hover:bg-[#1E1E22] transition-colors',
                    value?.code === account.code && 'bg-[#1E1E22]'
                  )}
                >
                  <span className="font-mono text-[#6B6B75] w-16">{account.code}</span>
                  <span className="flex-1 truncate text-[#F0F0F0]">{account.name}</span>
                  {value?.code === account.code && (
                    <Check className="w-3 h-3 text-[#F5A623]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
