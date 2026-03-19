import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  CreateAssetAcquisitionJournalInput,
  UpdateAssetAcquisitionJournalInput,
} from '@/finance/asset-acquisition-journals/types';
import type { GenerateDepreciationInput } from '@/finance/asset-depreciation-journals/types';
import * as assetJournalsApi from '@/api/asset-journals';

// ── Query keys ────────────────────────────────────────────────────────────────

export const acqJournalKeys = {
  all: ['asset-acquisition-journals'] as const,
  list: (periodId: number) => [...acqJournalKeys.all, 'list', periodId] as const,
  detail: (id: number) => [...acqJournalKeys.all, 'detail', id] as const,
};

export const depJournalKeys = {
  all: ['asset-depreciation-journals'] as const,
  list: (periodId: number) => [...depJournalKeys.all, 'list', periodId] as const,
};

// ── Acquisition Journals ─────────────────────────────────────────────────────

export function useAcquisitionJournals(periodId: number | undefined) {
  return useQuery({
    queryKey: acqJournalKeys.list(periodId!),
    queryFn: () => assetJournalsApi.getAcquisitionJournals(periodId!),
    enabled: !!periodId,
  });
}

export function useAcquisitionJournalById(id: number | undefined) {
  return useQuery({
    queryKey: acqJournalKeys.detail(id!),
    queryFn: () => assetJournalsApi.getAcquisitionJournalById(id!),
    enabled: !!id,
  });
}

export function useCreateAcquisitionJournal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAssetAcquisitionJournalInput) =>
      assetJournalsApi.createAcquisitionJournal(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: acqJournalKeys.all }),
  });
}

export function useUpdateAcquisitionJournal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateAssetAcquisitionJournalInput }) =>
      assetJournalsApi.updateAcquisitionJournal(id, input),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: acqJournalKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: acqJournalKeys.all });
    },
  });
}

export function usePostAcquisitionJournal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => assetJournalsApi.postAcquisitionJournal(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: acqJournalKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: acqJournalKeys.all });
    },
  });
}

export function useDeleteAcquisitionJournal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => assetJournalsApi.deleteAcquisitionJournal(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: acqJournalKeys.all }),
  });
}

// ── Depreciation Journals ─────────────────────────────────────────────────────

export function useDepreciationJournals(periodId: number | undefined) {
  return useQuery({
    queryKey: depJournalKeys.list(periodId!),
    queryFn: () => assetJournalsApi.getDepreciationJournals(periodId!),
    enabled: !!periodId,
  });
}

export function useGenerateDepreciation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: GenerateDepreciationInput) =>
      assetJournalsApi.generateDepreciationJournals(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: depJournalKeys.all }),
  });
}

export function usePostAllDepreciation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: GenerateDepreciationInput) =>
      assetJournalsApi.postAllDepreciationJournals(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: depJournalKeys.all }),
  });
}

export function useDeleteDepreciationJournal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => assetJournalsApi.deleteDepreciationJournal(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: depJournalKeys.all }),
  });
}
