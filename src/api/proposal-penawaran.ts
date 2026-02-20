/**
 * Proposal Penawaran API service.
 * Uses real backend API.
 */

import type {
  ProposalPenawaran,
  ProposalPenawaranCreateInput,
  ProposalPenawaranUpdateInput,
} from "@/finance/proposal-penawaran/types";
import { api } from "@/lib/api/client";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export interface GetProposalsParams {
  search?: string;
  status?: string;
  clientId?: string;
}

export async function getProposals(
  params?: GetProposalsParams
): Promise<ProposalPenawaran[]> {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.status) query.set("status", params.status);
  if (params?.clientId) query.set("clientId", params.clientId);
  const qs = query.toString();
  return api.get<ProposalPenawaran[]>(`/api/finance/proposal-penawaran${qs ? `?${qs}` : ""}`);
}

export async function getProposalById(id: string): Promise<ProposalPenawaran | null> {
  try {
    return await api.get<ProposalPenawaran>(`/api/finance/proposal-penawaran/${id}`);
  } catch {
    return null;
  }
}

export async function createProposal(
  input: ProposalPenawaranCreateInput
): Promise<ProposalPenawaran> {
  return api.post<ProposalPenawaran>("/api/finance/proposal-penawaran", input);
}

export async function updateProposal(
  id: string,
  input: ProposalPenawaranUpdateInput
): Promise<ProposalPenawaran | null> {
  try {
    return await api.put<ProposalPenawaran>(`/api/finance/proposal-penawaran/${id}`, input);
  } catch {
    return null;
  }
}

export async function deleteProposal(id: string): Promise<boolean> {
  try {
    await api.delete(`/api/finance/proposal-penawaran/${id}`);
    return true;
  } catch {
    return false;
  }
}

export function getProposalPdfUrl(id: string): string {
  const base = API_BASE_URL ? API_BASE_URL.replace(/\/$/, "") : "";
  return `${base}/api/finance/proposal-penawaran/${id}/pdf`;
}
