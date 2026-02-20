/**
 * Invoice API service.
 * Uses real backend API.
 */

import type {
  Invoice,
  InvoiceCreateInput,
  InvoiceUpdateInput,
} from "@/invoice/types";
import { api } from "@/lib/api/client";

export async function getInvoices(): Promise<Invoice[]> {
  return api.get<Invoice[]>("/api/finance/invoices");
}

export async function getInvoiceById(id: string): Promise<Invoice | null> {
  try {
    return await api.get<Invoice>(`/api/finance/invoices/${id}`);
  } catch {
    return null;
  }
}

export async function createInvoice(input: InvoiceCreateInput): Promise<Invoice> {
  return api.post<Invoice>("/api/finance/invoices", input);
}

export async function updateInvoice(
  id: string,
  input: InvoiceUpdateInput
): Promise<Invoice | null> {
  try {
    return await api.put<Invoice>(`/api/finance/invoices/${id}`, input);
  } catch {
    return null;
  }
}

export async function deleteInvoice(id: string): Promise<boolean> {
  try {
    await api.delete(`/api/finance/invoices/${id}`);
    return true;
  } catch {
    return false;
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export function getInvoicePdfUrl(id: string): string {
  const base = API_BASE_URL ? API_BASE_URL.replace(/\/$/, "") : "";
  return `${base}/api/finance/invoices/${id}/pdf`;
}
