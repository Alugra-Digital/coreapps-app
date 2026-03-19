/**
 * Finance transactions API service.
 * CRUD for /api/finance/transactions
 */

import { api } from "@/lib/api/client";

export interface Transaction {
  id: string;
  date: string;
  entity: string;
  category: string;
  amount: number;
  formattedAmount?: string;
  type: "inbound" | "outbound";
  status: "Completed" | "Pending" | "Processing";
  createdAt?: string;
  updatedAt?: string;
}

export interface TransactionCreateInput {
  date: string;
  entity: string;
  category: string;
  amount: number;
  type: "inbound" | "outbound";
  status: "Completed" | "Pending" | "Processing";
}

export type TransactionUpdateInput = Partial<TransactionCreateInput>;

export interface TransactionsListResponse {
  success: boolean;
  message: string;
  data: Transaction[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export async function getTransactions(params?: {
  page?: number;
  limit?: number;
  search?: string;
  type?: "inbound" | "outbound";
  status?: string;
  category?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}): Promise<{ data: Transaction[]; meta: TransactionsListResponse["meta"] }> {
  const qs = params ? "?" + new URLSearchParams(params as Record<string, string>).toString() : "";
  const res = await api.get<TransactionsListResponse>(`/api/finance/transactions${qs}`);
  return { data: res.data, meta: res.meta };
}

export async function createTransaction(input: TransactionCreateInput): Promise<Transaction> {
  const res = await api.post<{ success?: boolean; data?: Transaction }>("/api/finance/transactions", input);
  return (res as { data: Transaction }).data ?? (res as Transaction);
}

export async function getTransactionById(id: string): Promise<Transaction | null> {
  try {
    const res = await api.get<{ success?: boolean; data?: Transaction }>(`/api/finance/transactions/${id}`);
    return (res as { data: Transaction }).data ?? (res as Transaction);
  } catch {
    return null;
  }
}

export async function updateTransaction(id: string, input: TransactionUpdateInput): Promise<Transaction> {
  const res = await api.put<{ success?: boolean; data?: Transaction }>(`/api/finance/transactions/${id}`, input);
  return (res as { data: Transaction }).data ?? (res as Transaction);
}

export async function deleteTransaction(id: string): Promise<void> {
  await api.delete(`/api/finance/transactions/${id}`);
}
