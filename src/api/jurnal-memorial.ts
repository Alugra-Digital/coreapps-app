import { api } from '@/lib/api/client';
import type {
  JurnalMemorialListResponse,
  JurnalMemorial,
  CreateJurnalMemorialInput,
  UpdateJurnalMemorialInput,
} from '@/finance/jurnal-memorial/types';

const BASE = '/api/finance/jurnal-memorial';

export async function getJurnalMemorialList(params: {
  periodId?: number;
  month?: number;
  year?: number;
}): Promise<JurnalMemorialListResponse> {
  const query = new URLSearchParams();
  if (params.periodId) query.set('periodId', String(params.periodId));
  if (params.month) query.set('month', String(params.month));
  if (params.year) query.set('year', String(params.year));
  return api.get<JurnalMemorialListResponse>(`${BASE}?${query.toString()}`);
}

export async function getJurnalMemorialById(id: number): Promise<JurnalMemorial> {
  return api.get<JurnalMemorial>(`${BASE}/${id}`);
}

export async function createJurnalMemorial(input: CreateJurnalMemorialInput): Promise<JurnalMemorial> {
  return api.post<JurnalMemorial>(BASE, input);
}

export async function updateJurnalMemorial(id: number, input: UpdateJurnalMemorialInput): Promise<JurnalMemorial> {
  return api.put<JurnalMemorial>(`${BASE}/${id}`, input);
}

export async function postJurnalMemorial(id: number): Promise<JurnalMemorial> {
  return api.post<JurnalMemorial>(`${BASE}/${id}/post`, {});
}

export async function deleteJurnalMemorial(id: number): Promise<void> {
  return api.delete<void>(`${BASE}/${id}`);
}
