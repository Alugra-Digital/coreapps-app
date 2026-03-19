import { useMemo } from 'react';
import { useAccountingPeriods } from './useAccountingPeriods';
import type { AccountingPeriod } from '@/finance/accounting-periods/types';

export interface PreviousPeriodSaldo {
  period: AccountingPeriod;
  saldo: number;
}

export function useKasKecilSaldo(currentPeriodId: number | undefined) {
  const { data: periods = [] } = useAccountingPeriods();

  const result = useMemo(() => {
    if (!currentPeriodId) {
      return { availablePeriods: [], saldo: null };
    }

    // Find the current period
    const currentPeriodIndex = periods.findIndex(p => p.id === currentPeriodId);

    if (currentPeriodIndex <= 0) {
      return { availablePeriods: [], saldo: null };
    }

    // Get periods before the current one
    const previousPeriods = periods.slice(0, currentPeriodIndex);

    // Map to include saldo (closingBalance from summary)
    const availablePeriods: PreviousPeriodSaldo[] = previousPeriods
      .filter(p => p.status === 'CLOSED' || p.status === 'LOCKED')
      .map(p => ({
        period: p,
        saldo: p.periodOpeningBalances?.kasKecil ?? 0,
      }))
      .reverse(); // Show most recent first

    return {
      availablePeriods,
      saldo: availablePeriods.length > 0 ? availablePeriods[0].saldo : null,
    };
  }, [currentPeriodId, periods]);

  return result;
}
