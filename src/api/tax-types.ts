/**
 * Tax Type (Perpajakan) API service.
 * Uses real backend API.
 */

import type {
  TaxType,
  TaxTypeCreateInput,
  TaxTypeUpdateInput,
} from "@/finance/perpajakan/types";
import { api } from "@/lib/api/client";

export async function getTaxTypes(): Promise<TaxType[]> {
  return api.get<TaxType[]>("/api/finance/tax-types");
}

export async function getTaxTypeById(id: string): Promise<TaxType | null> {
  try {
    return await api.get<TaxType>(`/api/finance/tax-types/${id}`);
  } catch {
    return null;
  }
}

export async function createTaxType(input: TaxTypeCreateInput): Promise<TaxType> {
  return api.post<TaxType>("/api/finance/tax-types", input);
}

export async function updateTaxType(
  id: string,
  input: TaxTypeUpdateInput
): Promise<TaxType | null> {
  try {
    return await api.put<TaxType>(`/api/finance/tax-types/${id}`, input);
  } catch {
    return null;
  }
}

export async function deleteTaxType(id: string): Promise<boolean> {
  try {
    await api.delete(`/api/finance/tax-types/${id}`);
    return true;
  } catch {
    return false;
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export function getTaxTypePdfUrl(id: string): string {
  const base = API_BASE_URL ? API_BASE_URL.replace(/\/$/, "") : "";
  return `${base}/api/finance/tax-types/${id}/pdf`;
}
