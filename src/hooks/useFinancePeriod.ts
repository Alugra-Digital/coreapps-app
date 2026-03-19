import { useState } from 'react';

export type PeriodStatus = 'OPEN' | 'CLOSED' | 'LOCKED';

export interface AccountingPeriod {
  id: number;
  year: number;
  month: number;
  status: PeriodStatus;
  closedAt?: string | null;
  closedBy?: number | null;
  reopenedAt?: string | null;
  reopenedReason?: string | null;
  createdAt?: string;
}

const STORAGE_KEY = 'selectedFinancePeriodId';
const STORAGE_DATA_KEY = 'selectedFinancePeriodData';

/**
 * Hook to manage the selected finance period across all finance pages.
 * Persists the selection in localStorage for consistency.
 */
export function useFinancePeriod() {
  const [selectedPeriodId, setSelectedPeriodIdState] = useState<number | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<AccountingPeriod | null>(() => {
    // Load selected period from localStorage on mount
    const savedId = localStorage.getItem(STORAGE_KEY);
    const savedData = localStorage.getItem(STORAGE_DATA_KEY);

    if (savedId && savedData) {
      try {
        setSelectedPeriodIdState(parseInt(savedId, 10));
        return JSON.parse(savedData);
      } catch (error) {
        console.error('Failed to parse saved period:', error);
      }
    }
    return null;
  });

  const setSelectedPeriodId = (periodId: number | null, periodData?: AccountingPeriod | null) => {
    setSelectedPeriodIdState(periodId);

    if (periodId && periodData) {
      localStorage.setItem(STORAGE_KEY, periodId.toString());
      localStorage.setItem(STORAGE_DATA_KEY, JSON.stringify(periodData));
      setSelectedPeriod(periodData);
    } else {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_DATA_KEY);
      setSelectedPeriod(null);
    }
  };

  const clearSelectedPeriod = () => {
    setSelectedPeriodIdState(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_DATA_KEY);
    setSelectedPeriod(null);
  };

  return {
    selectedPeriodId,
    selectedPeriod,
    setSelectedPeriodId,
    clearSelectedPeriod,
  };
}

/**
 * Format period as "JANUARY 2026" or similar
 */
export function formatPeriodName(period: AccountingPeriod | null): string {
  if (!period) return 'Select Period';

  const months = [
    'JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI',
    'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'
  ];

  return `${months[period.month - 1]} ${period.year}`;
}

/**
 * Get period status badge
 */
export function getPeriodStatusBadge(status: PeriodStatus): {
  icon: string;
  color: string;
  bgColor: string;
} {
  switch (status) {
    case 'OPEN':
      return {
        icon: '🟢',
        color: 'text-emerald-600 dark:text-emerald-500',
        bgColor: 'bg-emerald-50 dark:bg-emerald-500/10',
      };
    case 'CLOSED':
      return {
        icon: '🔵',
        color: 'text-blue-600 dark:text-blue-500',
        bgColor: 'bg-blue-50 dark:bg-blue-500/10',
      };
    case 'LOCKED':
      return {
        icon: '⚫',
        color: 'text-slate-600 dark:text-slate-400',
        bgColor: 'bg-slate-50 dark:bg-white/10',
      };
    default:
      return {
        icon: '⚪',
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
      };
  }
}

/**
 * Navigate to previous period
 */
export function getPreviousPeriod(period: AccountingPeriod, allPeriods: AccountingPeriod[]): AccountingPeriod | null {
  const currentIndex = allPeriods.findIndex(p => p.id === period.id);
  if (currentIndex === -1 || currentIndex === allPeriods.length - 1) {
    return null; // Already at the first period
  }
  return allPeriods[currentIndex + 1];
}

/**
 * Navigate to next period
 */
export function getNextPeriod(period: AccountingPeriod, allPeriods: AccountingPeriod[]): AccountingPeriod | null {
  const currentIndex = allPeriods.findIndex(p => p.id === period.id);
  if (currentIndex === -1 || currentIndex === 0) {
    return null; // Already at the last period
  }
  return allPeriods[currentIndex - 1];
}
