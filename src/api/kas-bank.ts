import { api } from '@/lib/api/client';
import type {
  KasBankListResponse,
  KasBankTransaction,
  CreateKasBankInput,
  UpdateKasBankInput,
} from '@/finance/kas-bank/types';

const BASE = '/api/finance/kas-bank';

export async function getKasBankList(params: {
  periodId?: number;
  month?: number;
  year?: number;
  coaAccount?: string;
}): Promise<KasBankListResponse> {
  const query = new URLSearchParams();
  if (params.periodId) query.set('periodId', String(params.periodId));
  if (params.month) query.set('month', String(params.month));
  if (params.year) query.set('year', String(params.year));
  if (params.coaAccount) query.set('coaAccount', params.coaAccount);
  return api.get<KasBankListResponse>(`${BASE}?${query.toString()}`);
}

export async function getKasBankById(id: number): Promise<KasBankTransaction> {
  return api.get<KasBankTransaction>(`${BASE}/${id}`);
}

export async function createKasBank(input: CreateKasBankInput): Promise<KasBankTransaction> {
  return api.post<KasBankTransaction>(BASE, input);
}

export async function updateKasBank(id: number, input: UpdateKasBankInput): Promise<KasBankTransaction> {
  return api.put<KasBankTransaction>(`${BASE}/${id}`, input);
}

export async function deleteKasBank(id: number): Promise<void> {
  return api.delete<void>(`${BASE}/${id}`);
}
