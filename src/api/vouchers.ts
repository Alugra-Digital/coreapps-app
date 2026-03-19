import { api } from '@/lib/api/client';
import type {
  VoucherListResponse,
  Voucher,
  VoucherType,
  CreateVoucherInput,
  UpdateVoucherInput,
} from '@/finance/vouchers/types';

const BASE = '/api/finance/vouchers';

export async function getVoucherList(params: {
  periodId?: number;
  month?: number;
  year?: number;
  type?: VoucherType;
}): Promise<VoucherListResponse> {
  const query = new URLSearchParams();
  if (params.periodId) query.set('periodId', String(params.periodId));
  if (params.month) query.set('month', String(params.month));
  if (params.year) query.set('year', String(params.year));
  if (params.type) query.set('type', params.type);
  return api.get<VoucherListResponse>(`${BASE}?${query.toString()}`);
}

export async function getVoucherById(id: number): Promise<Voucher> {
  return api.get<Voucher>(`${BASE}/${id}`);
}

export async function createVoucher(input: CreateVoucherInput): Promise<Voucher> {
  return api.post<Voucher>(BASE, input);
}

export async function updateVoucher(id: number, input: UpdateVoucherInput): Promise<Voucher> {
  return api.put<Voucher>(`${BASE}/${id}`, input);
}

export async function deleteVoucher(id: number): Promise<void> {
  return api.delete<void>(`${BASE}/${id}`);
}

export async function submitVoucher(id: number): Promise<Voucher> {
  return api.post<Voucher>(`${BASE}/${id}/submit`, {});
}

export async function reviewVoucher(id: number): Promise<Voucher> {
  return api.post<Voucher>(`${BASE}/${id}/review`, {});
}

export async function approveVoucher(id: number): Promise<Voucher> {
  return api.post<Voucher>(`${BASE}/${id}/approve`, {});
}

export async function payVoucher(id: number): Promise<Voucher> {
  return api.post<Voucher>(`${BASE}/${id}/pay`, {});
}

export async function rejectVoucher(id: number, reason: string): Promise<Voucher> {
  return api.post<Voucher>(`${BASE}/${id}/reject`, { reason });
}

export async function cancelVoucher(id: number): Promise<Voucher> {
  return api.post<Voucher>(`${BASE}/${id}/cancel`, {});
}
