import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateKasBankInput, UpdateKasBankInput } from '@/finance/kas-bank/types';
import * as kasBankApi from '@/api/kas-bank';

export const kasBankKeys = {
  all: ['kasBank'] as const,
  list: (params: { periodId?: number; month?: number; year?: number; coaAccount?: string }) =>
    [...kasBankKeys.all, 'list', params] as const,
  detail: (id: number) => [...kasBankKeys.all, 'detail', id] as const,
};

export function useKasBankList(params: {
  periodId?: number;
  month?: number;
  year?: number;
  coaAccount?: string;
}) {
  return useQuery({
    queryKey: kasBankKeys.list(params),
    queryFn: () => kasBankApi.getKasBankList(params),
    enabled: !!(params.periodId || (params.month && params.year)),
  });
}

export function useCreateKasBank() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateKasBankInput) => kasBankApi.createKasBank(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: kasBankKeys.all }),
  });
}

export function useUpdateKasBank() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateKasBankInput }) =>
      kasBankApi.updateKasBank(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: kasBankKeys.all }),
  });
}

export function useDeleteKasBank() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => kasBankApi.deleteKasBank(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: kasBankKeys.all }),
  });
}
