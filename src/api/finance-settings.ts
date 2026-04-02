import { api } from '@/lib/api/client';

const BASE = '/api/finance/settings';

export interface FinanceSetting {
  key: string;
  value: string;
  description?: string;
  updatedAt?: string;
}

export async function getAllSettings(): Promise<FinanceSetting[]> {
  return api.get<FinanceSetting[]>(BASE);
}

export async function getSettingByKey(key: string): Promise<FinanceSetting> {
  return api.get<FinanceSetting>(`${BASE}/${key}`);
}

export async function upsertSetting(key: string, value: string, description?: string): Promise<FinanceSetting> {
  return api.put<FinanceSetting>(`${BASE}/${key}`, { value, description });
}
