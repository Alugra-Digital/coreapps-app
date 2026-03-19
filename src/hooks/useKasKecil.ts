import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateKasKecilInput, UpdateKasKecilInput } from '@/finance/kas-kecil/types';
import * as kasKecilApi from '@/api/kas-kecil';

export const kasKecilKeys = {
  all: ['kasKecil'] as const,
  list: (params: { periodId?: number; month?: number; year?: number }) =>
    [...kasKecilKeys.all, 'list', params] as const,
  detail: (id: number) => [...kasKecilKeys.all, 'detail', id] as const,
  reconciliation: (transactionId: number) => [...kasKecilKeys.all, 'reconciliation', transactionId] as const,
};

export function useKasKecilList(params: { periodId?: number; month?: number; year?: number }) {
  return useQuery({
    queryKey: kasKecilKeys.list(params),
    queryFn: () => kasKecilApi.getKasKecilList(params),
    enabled: !!(params.periodId || (params.month && params.year)),
  });
}

export function useCreateKasKecil() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateKasKecilInput) => kasKecilApi.createKasKecil(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: kasKecilKeys.all }),
  });
}

export function useUpdateKasKecil() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateKasKecilInput }) =>
      kasKecilApi.updateKasKecil(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: kasKecilKeys.all }),
  });
}

export function useDeleteKasKecil() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => kasKecilApi.deleteKasKecil(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: kasKecilKeys.all }),
  });
}

// Cash Reconciliation Hooks
export function useKasKecilReconciliation(transactionId: number | undefined) {
  return useQuery({
    queryKey: kasKecilKeys.reconciliation(transactionId!),
    queryFn: () => kasKecilApi.getKasKecilReconciliation(transactionId!),
    enabled: !!transactionId,
  });
}

export function useReconcileKasKecil() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ transactionId, data }: { transactionId: number; data: Record<string, unknown> }) =>
      kasKecilApi.reconcileKasKecil(transactionId, data),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: kasKecilKeys.all });
        queryClient.invalidateQueries({ queryKey: kasKecilKeys.reconciliation(transactionId) });
      },
  });
}
