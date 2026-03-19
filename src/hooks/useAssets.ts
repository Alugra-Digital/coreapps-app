import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateAssetInput, UpdateAssetInput } from '@/finance/assets/types';
import * as assetsApi from '@/api/assets';

export const assetKeys = {
  all: ['assets'] as const,
  list: () => [...assetKeys.all, 'list'] as const,
  detail: (id: number) => [...assetKeys.all, 'detail', id] as const,
  types: () => [...assetKeys.all, 'types'] as const,
  checkCode: (code: string) => [...assetKeys.all, 'checkCode', code] as const,
  nextCode: (type: string, month: number, year: number) => [...assetKeys.all, 'nextCode', type, month, year] as const,
};

export function useAssets() {
  return useQuery({
    queryKey: assetKeys.list(),
    queryFn: assetsApi.getAssets,
  });
}

export function useAssetById(id: number | undefined) {
  return useQuery({
    queryKey: assetKeys.detail(id ?? 0),
    queryFn: () => assetsApi.getAssetById(id ?? 0),
    enabled: !!id,
  });
}

export function useCreateAsset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAssetInput) => assetsApi.createAsset(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: assetKeys.all }),
  });
}

export function useUpdateAsset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateAssetInput }) =>
      assetsApi.updateAsset(id, input),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: assetKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: assetKeys.list() });
    },
  });
}

export function useDeleteAsset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => assetsApi.deleteAsset(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: assetKeys.all }),
  });
}

export function useAssetTypes() {
  return useQuery({
    queryKey: assetKeys.types(),
    queryFn: assetsApi.getAssetTypes,
  });
}

export function useCheckAssetCode(code: string) {
  return useQuery({
    queryKey: assetKeys.checkCode(code),
    queryFn: () => assetsApi.checkAssetCode(code),
    enabled: !!code,
    retry: false,
  });
}

export function useNextAssetCode(typeCode: string, month: number, year: number) {
  return useQuery({
    queryKey: assetKeys.nextCode(typeCode, month, year),
    queryFn: () => assetsApi.getNextAssetCode(typeCode, month, year),
    enabled: !!typeCode && !!month && !!year,
  });
}
