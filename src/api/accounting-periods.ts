import { api } from '@/lib/api/client';
import type { AccountingPeriod, CreatePeriodInput } from '@/finance/accounting-periods/types';

const BASE = '/api/finance/accounting-periods';

export async function getAccountingPeriods(): Promise<AccountingPeriod[]> {
  return api.get<AccountingPeriod[]>(BASE);
}

export async function getAccountingPeriodById(id: number): Promise<AccountingPeriod> {
  return api.get<AccountingPeriod>(`${BASE}/${id}`);
}

export async function getLastOpenPeriod(): Promise<AccountingPeriod | null> {
  try {
    return await api.get<AccountingPeriod>(`${BASE}/last-open`);
  } catch {
    return null;
  }
}

export async function createPeriod(input: CreatePeriodInput): Promise<AccountingPeriod> {
  return api.post<AccountingPeriod>(BASE, input);
}

export async function validateClosePeriod(id: number): Promise<{
  canClose: boolean;
  warnings: string[];
  errors: string[];
}> {
  return api.get(`${BASE}/${id}/validate-close`);
}

export async function createNextPeriod(currentPeriodId: number): Promise<AccountingPeriod> {
  return api.post<AccountingPeriod>(`${BASE}/${currentPeriodId}/create-next`, {});
}

export async function closePeriod(id: number): Promise<AccountingPeriod> {
  return api.post<AccountingPeriod>(`${BASE}/${id}/close`, {});
}

export async function reopenPeriod(id: number, reason: string): Promise<AccountingPeriod> {
  return api.post<AccountingPeriod>(`${BASE}/${id}/reopen`, { reason });
}

export async function lockPeriod(id: number): Promise<AccountingPeriod> {
  return api.post<AccountingPeriod>(`${BASE}/${id}/lock`, {});
}

export async function generateNextNumber(
  periodId: number,
  type: 'KK' | 'KM' | 'BK' | 'BM' | 'JM'
): Promise<{ code: string }> {
  return api.post(`${BASE}/${periodId}/generate-number`, { type });
}
