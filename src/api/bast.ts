/**
 * BAST API service.
 * Uses mock implementation; swap with api.get/post/put/delete when backend is ready.
 */

import type { BAST, BASTCreateInput, BASTUpdateInput } from "@/finance/bast/types";
import { mockBasts } from "@/finance/bast/data";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

let bastsStore: BAST[] = [...mockBasts];

/**
 * Get all BASTs.
 * API: GET /basts
 */
export async function getBasts(): Promise<BAST[]> {
  return Promise.resolve([...bastsStore]);
}

/**
 * Get BAST by ID.
 * API: GET /basts/:id
 */
export async function getBastById(id: string): Promise<BAST | null> {
  const bast = bastsStore.find((b) => b.id === id);
  return Promise.resolve(bast ?? null);
}

/**
 * Create BAST.
 * API: POST /basts
 */
export async function createBast(input: BASTCreateInput): Promise<BAST> {
  const id = `BAST-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const now = new Date().toISOString();
  const bast: BAST = {
    ...input,
    id,
    createdAt: now,
    updatedAt: now,
  };
  bastsStore.push(bast);
  return Promise.resolve(bast);
}

/**
 * Update BAST.
 * API: PUT /basts/:id
 */
export async function updateBast(id: string, input: BASTUpdateInput): Promise<BAST | null> {
  const index = bastsStore.findIndex((b) => b.id === id);
  if (index === -1) return Promise.resolve(null);
  bastsStore[index] = {
    ...bastsStore[index],
    ...input,
    updatedAt: new Date().toISOString(),
  };
  return Promise.resolve(bastsStore[index]);
}

/**
 * Delete BAST.
 * API: DELETE /basts/:id
 */
export async function deleteBast(id: string): Promise<boolean> {
  const index = bastsStore.findIndex((b) => b.id === id);
  if (index === -1) return Promise.resolve(false);
  bastsStore.splice(index, 1);
  return Promise.resolve(true);
}

/**
 * Get PDF URL for BAST (for iframe display).
 * API: GET /basts/:id/pdf
 */
export function getBastPdfUrl(id: string): string {
  return `${API_BASE_URL}/basts/${id}/pdf`;
}
