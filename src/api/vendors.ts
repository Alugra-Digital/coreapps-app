/**
 * Vendors API service.
 * Uses real backend API.
 */

import type {
  Vendor,
  VendorCreateInput,
  VendorUpdateInput,
} from "@/finance/vendors/types";
import { api } from "@/lib/api/client";
import type { PaginatedResponse } from "@/lib/api/pagination";

export async function getVendors(): Promise<Vendor[]> {
  const res = await api.get<Vendor[] | PaginatedResponse<Vendor>>("/api/finance/vendors");
  return Array.isArray(res) ? res : res.data;
}

export interface GetVendorsParams {
  page?: number;
  limit?: number;
}

export async function getVendorsPaginated(
  params: GetVendorsParams = {}
): Promise<PaginatedResponse<Vendor>> {
  const { page = 1, limit = 10 } = params;
  const query = new URLSearchParams({ page: String(page), limit: String(limit) });
  return api.get<PaginatedResponse<Vendor>>(`/api/finance/vendors?${query}`);
}

export async function getVendorById(id: string): Promise<Vendor | null> {
  try {
    return await api.get<Vendor>(`/api/finance/vendors/${id}`);
  } catch {
    return null;
  }
}

export async function createVendor(input: VendorCreateInput): Promise<Vendor> {
  return api.post<Vendor>("/api/finance/vendors", input);
}

export async function updateVendor(
  id: string,
  input: VendorUpdateInput
): Promise<Vendor | null> {
  try {
    return await api.put<Vendor>(`/api/finance/vendors/${id}`, input);
  } catch {
    return null;
  }
}

export async function deleteVendor(id: string): Promise<boolean> {
  try {
    await api.delete(`/api/finance/vendors/${id}`);
    return true;
  } catch {
    return false;
  }
}
