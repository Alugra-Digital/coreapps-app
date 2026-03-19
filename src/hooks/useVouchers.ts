import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { VoucherType, CreateVoucherInput, UpdateVoucherInput } from '@/finance/vouchers/types';
import * as vouchersApi from '@/api/vouchers';

export const voucherKeys = {
  all: ['vouchers'] as const,
  list: (params: { periodId?: number; month?: number; year?: number; type?: VoucherType }) =>
    [...voucherKeys.all, 'list', params] as const,
  detail: (id: number) => [...voucherKeys.all, 'detail', id] as const,
};

export function useVoucherList(params: {
  periodId?: number;
  month?: number;
  year?: number;
  type?: VoucherType;
}) {
  return useQuery({
    queryKey: voucherKeys.list(params),
    queryFn: () => vouchersApi.getVoucherList(params),
    enabled: !!(params.periodId || (params.month && params.year)),
  });
}

export function useVoucherById(id: number | undefined) {
  return useQuery({
    queryKey: voucherKeys.detail(id!),
    queryFn: () => vouchersApi.getVoucherById(id!),
    enabled: !!id,
  });
}

export function useCreateVoucher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateVoucherInput) => vouchersApi.createVoucher(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: voucherKeys.all }),
  });
}

export function useUpdateVoucher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateVoucherInput }) =>
      vouchersApi.updateVoucher(id, input),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: voucherKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: voucherKeys.all });
    },
  });
}

export function useDeleteVoucher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => vouchersApi.deleteVoucher(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: voucherKeys.all }),
  });
}

export function useSubmitVoucher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => vouchersApi.submitVoucher(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: voucherKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: voucherKeys.all });
    },
  });
}

export function useReviewVoucher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => vouchersApi.reviewVoucher(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: voucherKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: voucherKeys.all });
    },
  });
}

export function useApproveVoucher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => vouchersApi.approveVoucher(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: voucherKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: voucherKeys.all });
    },
  });
}

export function usePayVoucher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => vouchersApi.payVoucher(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: voucherKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: voucherKeys.all });
    },
  });
}

export function useRejectVoucher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      vouchersApi.rejectVoucher(id, reason),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: voucherKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: voucherKeys.all });
    },
  });
}

export function useCancelVoucher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => vouchersApi.cancelVoucher(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: voucherKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: voucherKeys.all });
    },
  });
}
