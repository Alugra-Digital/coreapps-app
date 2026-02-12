/**
 * Proposal Penawaran API service.
 * Uses mock implementation; swap with api.get/post/put/delete when backend is ready.
 */

import type {
  ProposalPenawaran,
  ProposalPenawaranCreateInput,
  ProposalPenawaranUpdateInput,
} from "@/finance/proposal-penawaran/types";
import { mockProposals } from "@/finance/proposal-penawaran/data";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

let proposalsStore: ProposalPenawaran[] = [...mockProposals];

export interface GetProposalsParams {
  search?: string;
  status?: string;
  clientId?: string;
}

/**
 * Get all proposals.
 * API: GET /proposal-penawaran
 */
export async function getProposals(
  params?: GetProposalsParams
): Promise<ProposalPenawaran[]> {
  let result = [...proposalsStore];
  if (params?.search) {
    const s = params.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.coverInfo.jobOffer.toLowerCase().includes(s) ||
        p.proposalNumber.toLowerCase().includes(s) ||
        p.clientInfo.clientName.toLowerCase().includes(s)
    );
  }
  if (params?.status) {
    result = result.filter((p) => p.status === params.status);
  }
  if (params?.clientId) {
    result = result.filter((p) => p.clientInfo.clientId === params.clientId);
  }
  return Promise.resolve(result);
}

/**
 * Get proposal by ID.
 * API: GET /proposal-penawaran/:id
 */
export async function getProposalById(id: string): Promise<ProposalPenawaran | null> {
  const proposal = proposalsStore.find((p) => p.id === id);
  return Promise.resolve(proposal ?? null);
}

/**
 * Create proposal.
 * API: POST /proposal-penawaran
 */
export async function createProposal(
  input: ProposalPenawaranCreateInput
): Promise<ProposalPenawaran> {
  const id = `PP-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const now = new Date().toISOString();
  const proposal: ProposalPenawaran = {
    ...input,
    id,
    createdAt: now,
    updatedAt: now,
  };
  proposalsStore.push(proposal);
  return Promise.resolve(proposal);
}

/**
 * Update proposal.
 * API: PUT /proposal-penawaran/:id
 */
export async function updateProposal(
  id: string,
  input: ProposalPenawaranUpdateInput
): Promise<ProposalPenawaran | null> {
  const index = proposalsStore.findIndex((p) => p.id === id);
  if (index === -1) return Promise.resolve(null);
  proposalsStore[index] = {
    ...proposalsStore[index],
    ...input,
    updatedAt: new Date().toISOString(),
  };
  return Promise.resolve(proposalsStore[index]);
}

/**
 * Delete proposal.
 * API: DELETE /proposal-penawaran/:id
 */
export async function deleteProposal(id: string): Promise<boolean> {
  const index = proposalsStore.findIndex((p) => p.id === id);
  if (index === -1) return Promise.resolve(false);
  proposalsStore.splice(index, 1);
  return Promise.resolve(true);
}

/**
 * Get PDF URL for proposal (for iframe display).
 * API: GET /proposal-penawaran/:id/pdf
 */
export function getProposalPdfUrl(id: string): string {
  return `${API_BASE_URL}/proposal-penawaran/${id}/pdf`;
}
