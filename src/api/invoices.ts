/**
 * Invoice API service.
 * Uses mock implementation; swap with api.get/post/put/delete when backend is ready.
 */

import type {
  Invoice,
  InvoiceCreateInput,
  InvoiceUpdateInput,
} from "@/invoice/types";
import { mockInvoices } from "@/invoice/data";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

let invoicesStore: Invoice[] = [...mockInvoices];

/**
 * Get all invoices.
 * API: GET /invoices
 */
export async function getInvoices(): Promise<Invoice[]> {
  return Promise.resolve([...invoicesStore]);
}

/**
 * Get invoice by ID.
 * API: GET /invoices/:id
 */
export async function getInvoiceById(id: string): Promise<Invoice | null> {
  const inv = invoicesStore.find((i) => i.id === id);
  return Promise.resolve(inv ?? null);
}

/**
 * Create invoice.
 * API: POST /invoices
 */
export async function createInvoice(input: InvoiceCreateInput): Promise<Invoice> {
  const id = `INV-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const now = new Date().toISOString();
  const invoice: Invoice = {
    ...input,
    id,
    createdAt: now,
    updatedAt: now,
  };
  invoicesStore.push(invoice);
  return Promise.resolve(invoice);
}

/**
 * Update invoice.
 * API: PUT /invoices/:id
 */
export async function updateInvoice(
  id: string,
  input: InvoiceUpdateInput
): Promise<Invoice | null> {
  const index = invoicesStore.findIndex((i) => i.id === id);
  if (index === -1) return Promise.resolve(null);
  invoicesStore[index] = {
    ...invoicesStore[index],
    ...input,
    updatedAt: new Date().toISOString(),
  };
  return Promise.resolve(invoicesStore[index]);
}

/**
 * Delete invoice.
 * API: DELETE /invoices/:id
 */
export async function deleteInvoice(id: string): Promise<boolean> {
  const index = invoicesStore.findIndex((i) => i.id === id);
  if (index === -1) return Promise.resolve(false);
  invoicesStore.splice(index, 1);
  return Promise.resolve(true);
}

/**
 * Get PDF URL for invoice (for iframe display).
 * API: GET /invoices/:id/pdf
 * When backend is ready, this returns the API URL. For mock, returns data URL placeholder.
 */
export function getInvoicePdfUrl(id: string): string {
  return `${API_BASE_URL}/invoices/${id}/pdf`;
}
