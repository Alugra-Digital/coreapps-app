/**
 * Clients API service.
 * Uses real backend API.
 */

export type { Client } from "@/finance/clients/types";

import type {
  Client,
  ClientCreateInput,
  ClientUpdateInput,
} from "@/finance/clients/types";
import { api } from "@/lib/api/client";
import type { PaginatedResponse } from "@/lib/api/pagination";

export async function getClients(): Promise<Client[]> {
  const res = await api.get<Client[] | PaginatedResponse<Client>>("/api/finance/clients");
  return Array.isArray(res) ? res : res.data;
}

export interface GetClientsParams {
  page?: number;
  limit?: number;
}

export async function getClientsPaginated(
  params: GetClientsParams = {}
): Promise<PaginatedResponse<Client>> {
  const { page = 1, limit = 10 } = params;
  const query = new URLSearchParams({ page: String(page), limit: String(limit) });
  return api.get<PaginatedResponse<Client>>(`/api/finance/clients?${query}`);
}

export async function getClientById(id: string): Promise<Client | null> {
  try {
    return await api.get<Client>(`/api/finance/clients/${id}`);
  } catch {
    return null;
  }
}

export async function createClient(input: ClientCreateInput): Promise<Client> {
  return api.post<Client>("/api/finance/clients", input);
}

export async function updateClient(
  id: string,
  input: ClientUpdateInput
): Promise<Client | null> {
  try {
    return await api.put<Client>(`/api/finance/clients/${id}`, input);
  } catch {
    return null;
  }
}

export async function deleteClient(id: string): Promise<boolean> {
  try {
    await api.delete(`/api/finance/clients/${id}`);
    return true;
  } catch {
    return false;
  }
}
