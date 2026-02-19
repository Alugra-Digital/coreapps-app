/**
 * BAST API service.
 * Uses real backend API.
 */

import type { BAST, BASTCreateInput, BASTUpdateInput } from "@/finance/bast/types";
import { api } from "@/lib/api/client";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export async function getBasts(): Promise<BAST[]> {
  return api.get<BAST[]>("/api/finance/basts");
}

export async function getBastById(id: string): Promise<BAST | null> {
  try {
    return await api.get<BAST>(`/api/finance/basts/${id}`);
  } catch {
    return null;
  }
}

export async function createBast(input: BASTCreateInput): Promise<BAST> {
  return api.post<BAST>("/api/finance/basts", input);
}

export async function updateBast(id: string, input: BASTUpdateInput): Promise<BAST | null> {
  try {
    return await api.put<BAST>(`/api/finance/basts/${id}`, input);
  } catch {
    return null;
  }
}

export async function deleteBast(id: string): Promise<boolean> {
  try {
    await api.delete(`/api/finance/basts/${id}`);
    return true;
  } catch {
    return false;
  }
}

export function getBastPdfUrl(id: string): string {
  const base = API_BASE_URL ? API_BASE_URL.replace(/\/$/, "") : "";
  return `${base}/api/finance/basts/${id}/pdf`;
}
