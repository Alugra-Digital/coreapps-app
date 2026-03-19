/**
 * TanStack Query hooks for Proposal Penawaran API
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  ProposalPenawaranCreateInput,
  ProposalPenawaranUpdateInput,
} from "@/finance/proposal-penawaran/types";
import type { GetProposalsParams } from "@/api/proposal-penawaran";
import * as proposalApi from "@/api/proposal-penawaran";

export const proposalKeys = {
  all: ["proposals"] as const,
  lists: (filters?: GetProposalsParams) =>
    [...proposalKeys.all, "list", filters] as const,
  details: () => [...proposalKeys.all, "detail"] as const,
  detail: (id: string) => [...proposalKeys.details(), id] as const,
};

export function useProposals(params?: GetProposalsParams) {
  return useQuery({
    queryKey: proposalKeys.lists(params),
    queryFn: () => proposalApi.getProposals(params),
  });
}

export function useProposalById(id: string | undefined) {
  return useQuery({
    queryKey: proposalKeys.detail(id!),
    queryFn: () => proposalApi.getProposalById(id!),
    enabled: !!id,
  });
}

export function useCreateProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ProposalPenawaranCreateInput) =>
      proposalApi.createProposal(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: proposalKeys.all });
    },
  });
}

export function useUpdateProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: ProposalPenawaranUpdateInput;
    }) => proposalApi.updateProposal(id, input),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: proposalKeys.all });
    },
  });
}

export function useDeleteProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => proposalApi.deleteProposal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: proposalKeys.all });
    },
  });
}
