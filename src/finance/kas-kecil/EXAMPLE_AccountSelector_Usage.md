# AccountSelector Usage Example

This example shows how to use the new AccountSelector component with Kas Kecil form.

## Overview

Instead of a simple text input for `coaAccount`, use the new AccountSelector component:
- Combobox dropdown with search and type-ahead
- Shows account code and name
- Type account number directly in the input
- When selected, both code and name are pre-filled
- Syncs with form using `useAccountSelectorEffect` hook

## Usage in Kas Kecil Page

```tsx
import { useState, useEffect } from 'react';
import { AccountSelector, useAccountSelectorEffect } from '@/finance/components/AccountSelector';

export default function KasKecilPage() {
  // ... your existing state management

  // NEW: Use AccountSelector hook
  const accountSelector = useAccountSelector();

  const form = useForm<KasKecilFormValues>({
    resolver: zodResolver(kasKecilFormSchema),
    defaultValues: {
      periodId: activePeriod?.id ?? 0,
      date: new Date().toISOString().slice(0, 10),
      description: '',
      debit: 0,
      credit: 0,
    },
  });

  // Sync account selection with form
  useAccountSelectorEffect(accountSelector, form, 'coaAccount', form.setValue);

  // Rest of your form handling...
}
```

## Key Changes

1. **Import the hook:**
   ```tsx
   import { AccountSelector, useAccountSelectorEffect } from '@/finance/components/AccountSelector';
   ```

2. **Initialize hook:**
   ```tsx
   const accountSelector = useAccountSelector();
   ```

3. **Sync form with hook:**
   ```tsx
   useAccountSelectorEffect(accountSelector, form, 'coaAccount', form.setValue);
   ```
   This will:
   - Fill both `accountNumber` and `accountName` fields when account is selected
   - Clear both fields when no account is selected

4. **Replace text input with AccountSelector component:**
   ```tsx
   {/* BEFORE - Remove this */}
   <FormField
     control={<Control as FormField control={form.control} name="coaAccount" label="Akun" placeholder="Kode Akun..." />}
   {/* AFTER - Add this */}
   <AccountSelector
     value={form.watch('coaAccount') ? { code: form.watch('coaAccount'), name: '' } : undefined}
     onChange={(account) => {
       // The AccountSelector returns { code, name }
       form.setValue('coaAccount', account.code || '');
       form.setValue('accountName', account.name || '');
     }}
     placeholder="Pilih akun..."
   />
   ```

## Pattern to Apply to Other Modules

Apply the same pattern to:
- Kas Bank (uses `coaAccount` for transaction lines)
- Jurnal Memorial (uses account dropdown for lines)
- Vouchers (uses account dropdown for payee/account)
- Asset Acquisition Journals (uses accounts from asset)
- And any other module that uses account selection
