import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreatePeriodInput } from '@/finance/accounting-periods/types';
import * as periodsApi from '@/api/accounting-periods';

export const periodKeys = {
  all: ['accountingPeriods'] as const,
  lists: () => [...periodKeys.all, 'list'] as const,
  detail: (id: number) => [...periodKeys.all, 'detail', id] as const,
};

export function useAccountingPeriods() {
  return useQuery({
    queryKey: periodKeys.lists(),
    queryFn: periodsApi.getAccountingPeriods,
  });
}

export function useAccountingPeriodById(id: number | undefined) {
  return useQuery({
    queryKey: periodKeys.detail(id!),
    queryFn: () => periodsApi.getAccountingPeriodById(id!),
    enabled: !!id,
  });
}

export function useLastOpenPeriod() {
  return useQuery({
    queryKey: [...periodKeys.all, 'lastOpen'] as const,
    queryFn: periodsApi.getLastOpenPeriod,
  });
}

export function useCreatePeriod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePeriodInput) => periodsApi.createPeriod(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: periodKeys.lists() }),
  });
}

export function useValidateClosePeriod() {
  return useMutation({
    mutationFn: (id: number) => periodsApi.validateClosePeriod(id),
  });
}

export function useCreateNextPeriod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (currentPeriodId: number) => periodsApi.createNextPeriod(currentPeriodId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: periodKeys.all }),
  });
}

export function useClosePeriod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => periodsApi.closePeriod(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: periodKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: periodKeys.lists() });
    },
  });
}

export function useReopenPeriod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) => periodsApi.reopenPeriod(id, reason),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: periodKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: periodKeys.lists() });
    },
  });
}

export function useLockPeriod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => periodsApi.lockPeriod(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: periodKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: periodKeys.lists() });
    },
  });
}

export function useGenerateNextNumber() {
  return useMutation({
    mutationFn: ({ periodId, type }: { periodId: number; type: 'KK' | 'KM' | 'BK' | 'BM' | 'JM' }) =>
      periodsApi.generateNextNumber(periodId, type),
  });
}
