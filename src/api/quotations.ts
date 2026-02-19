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

export async function getQuotations(): Promise<Quotation[]> {
  return api.get<Quotation[]>("/api/finance/quotations");
}

export async function getQuotationById(id: string): Promise<Quotation | null> {
  try {
    return await api.get<Quotation>(`/api/finance/quotations/${id}`);
  } catch {
    return null;
  }
}

export async function createQuotation(
  input: QuotationCreateInput
): Promise<Quotation> {
  return api.post<Quotation>("/api/finance/quotations", input);
}

export async function updateQuotation(
  id: string,
  input: QuotationUpdateInput
): Promise<Quotation | null> {
  try {
    return await api.put<Quotation>(`/api/finance/quotations/${id}`, input);
  } catch {
    return null;
  }
}

export async function deleteQuotation(id: string): Promise<boolean> {
  try {
    await api.delete(`/api/finance/quotations/${id}`);
    return true;
  } catch {
    return false;
  }
}
