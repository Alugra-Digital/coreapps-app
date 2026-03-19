/**
 * Quotations API service.
 * Uses real backend API.
 */

import type {
  Quotation,
  QuotationCreateInput,
  QuotationUpdateInput,
} from "@/finance/quotations/types";
import { api } from "@/lib/api/client";

const VENDOR_QUOTATIONS_BASE = "/api/finance/vendor-quotations";

export async function getQuotations(): Promise<Quotation[]> {
  return api.get<Quotation[]>(VENDOR_QUOTATIONS_BASE);
}

export async function getQuotationById(id: string): Promise<Quotation | null> {
  try {
    return await api.get<Quotation>(`${VENDOR_QUOTATIONS_BASE}/${id}`);
  } catch {
    return null;
  }
}

export async function createQuotation(
  input: QuotationCreateInput
): Promise<Quotation> {
  return api.post<Quotation>(VENDOR_QUOTATIONS_BASE, input);
}

export async function updateQuotation(
  id: string,
  input: QuotationUpdateInput
): Promise<Quotation | null> {
  try {
    return await api.put<Quotation>(`${VENDOR_QUOTATIONS_BASE}/${id}`, input);
  } catch {
    return null;
  }
}

export async function deleteQuotation(id: string): Promise<boolean> {
  try {
    await api.delete(`${VENDOR_QUOTATIONS_BASE}/${id}`);
    return true;
  } catch {
    return false;
  }
}
