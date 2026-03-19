import { api } from '@/lib/api/client';
import type {
  KasKecilListResponse,
  KasKecilTransaction,
  CreateKasKecilInput,
  UpdateKasKecilInput,
} from '@/finance/kas-kecil/types';

const BASE = '/api/finance/kas-kecil';

export async function getKasKecilList(params: {
  periodId?: number;
  month?: number;
  year?: number;
}): Promise<KasKecilListResponse> {
  const query = new URLSearchParams();
  if (params.periodId) query.set('periodId', String(params.periodId));
  if (params.month) query.set('month', String(params.month));
  if (params.year) query.set('year', String(params.year));
  return api.get<KasKecilListResponse>(`${BASE}?${query.toString()}`);
}

export async function getKasKecilById(id: number): Promise<KasKecilTransaction> {
  return api.get<KasKecilTransaction>(`${BASE}/${id}`);
}

export async function createKasKecil(input: CreateKasKecilInput): Promise<KasKecilTransaction> {
  return api.post<KasKecilTransaction>(BASE, input);
}

export async function updateKasKecil(id: number, input: UpdateKasKecilInput): Promise<KasKecilTransaction> {
  return api.put<KasKecilTransaction>(`${BASE}/${id}`, input);
}

export async function deleteKasKecil(id: number): Promise<void> {
  return api.delete<void>(`${BASE}/${id}`);
}

// Physical Cash Reconciliation
export interface CashReconciliation {
  id: number;
  periodId: number;
  kasKecilTransactionId: number;
  paper100000Qty: number;
  paper50000Qty: number;
  paper20000Qty: number;
  paper10000Qty: number;
  paper5000Qty: number;
  paper2000Qty: number;
  paper1000Qty: number;
  coin1000Qty: number;
  coin500Qty: number;
  coin200Qty: number;
  coin100Qty: number;
  totalPhysical: number;
  systemBalance: number;
  difference: number;
  notes?: string;
  reconciledAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function getKasKecilReconciliation(transactionId: number): Promise<CashReconciliation | null> {
  try {
    return await api.get<CashReconciliation>(`${BASE}/${transactionId}/reconcile`);
  } catch {
    return null;
  }
}

export async function reconcileKasKecil(transactionId: number, data: Omit<CashReconciliation, 'id' | 'createdAt' | 'updatedAt' | 'kasKecilTransactionId'>): Promise<CashReconciliation> {
  return api.post<CashReconciliation>(`${BASE}/reconcile`, {
    ...data,
    kasKecilTransactionId: transactionId,
  });
}
