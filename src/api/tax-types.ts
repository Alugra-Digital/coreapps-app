/**
 * Tax Type (Perpajakan) API service.
 * Uses mock implementation; swap with api.get/post/put/delete when backend is ready.
 */

import type {
  TaxType,
  TaxTypeCreateInput,
  TaxTypeUpdateInput,
} from "@/finance/perpajakan/types";
import { mockTaxTypes } from "@/finance/perpajakan/data";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

let taxTypesStore: TaxType[] = [...mockTaxTypes];

/**
 * Get all tax types.
 * API: GET /tax-types
 */
export async function getTaxTypes(): Promise<TaxType[]> {
  return Promise.resolve([...taxTypesStore]);
}

/**
 * Get tax type by ID.
 * API: GET /tax-types/:id
 */
export async function getTaxTypeById(id: string): Promise<TaxType | null> {
  const tax = taxTypesStore.find((t) => t.id === id);
  return Promise.resolve(tax ?? null);
}

/**
 * Create tax type.
 * API: POST /tax-types
 */
export async function createTaxType(input: TaxTypeCreateInput): Promise<TaxType> {
  const id = `TAX-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const now = new Date().toISOString();
  const taxType: TaxType = {
    ...input,
    id,
    createdAt: now,
    updatedAt: now,
  };
  taxTypesStore.push(taxType);
  return Promise.resolve(taxType);
}

/**
 * Update tax type.
 * API: PUT /tax-types/:id
 */
export async function updateTaxType(
  id: string,
  input: TaxTypeUpdateInput
): Promise<TaxType | null> {
  const index = taxTypesStore.findIndex((t) => t.id === id);
  if (index === -1) return Promise.resolve(null);
  taxTypesStore[index] = {
    ...taxTypesStore[index],
    ...input,
    updatedAt: new Date().toISOString(),
  };
  return Promise.resolve(taxTypesStore[index]);
}

/**
 * Delete tax type.
 * API: DELETE /tax-types/:id
 */
export async function deleteTaxType(id: string): Promise<boolean> {
  const index = taxTypesStore.findIndex((t) => t.id === id);
  if (index === -1) return Promise.resolve(false);
  taxTypesStore.splice(index, 1);
  return Promise.resolve(true);
}

/**
 * Get PDF URL for tax type (for iframe display).
 * API: GET /tax-types/:id/pdf
 */
export function getTaxTypePdfUrl(id: string): string {
  return `${API_BASE_URL}/tax-types/${id}/pdf`;
}
