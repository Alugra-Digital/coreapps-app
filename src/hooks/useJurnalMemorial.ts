import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateJurnalMemorialInput, UpdateJurnalMemorialInput } from '@/finance/jurnal-memorial/types';
import * as jurnalApi from '@/api/jurnal-memorial';

export const jurnalMemorialKeys = {
  all: ['jurnalMemorial'] as const,
  list: (params: { periodId?: number; month?: number; year?: number }) =>
    [...jurnalMemorialKeys.all, 'list', params] as const,
  detail: (id: number) => [...jurnalMemorialKeys.all, 'detail', id] as const,
};

export function useJurnalMemorialList(params: { periodId?: number; month?: number; year?: number }) {
  return useQuery({
    queryKey: jurnalMemorialKeys.list(params),
    queryFn: () => jurnalApi.getJurnalMemorialList(params),
    enabled: !!(params.periodId || (params.month && params.year)),
  });
}

export function useCreateJurnalMemorial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateJurnalMemorialInput) => jurnalApi.createJurnalMemorial(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: jurnalMemorialKeys.all }),
  });
}

export function useUpdateJurnalMemorial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateJurnalMemorialInput }) =>
      jurnalApi.updateJurnalMemorial(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: jurnalMemorialKeys.all }),
  });
}

export function usePostJurnalMemorial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => jurnalApi.postJurnalMemorial(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: jurnalMemorialKeys.all }),
  });
}

export function useDeleteJurnalMemorial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => jurnalApi.deleteJurnalMemorial(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: jurnalMemorialKeys.all }),
  });
}
