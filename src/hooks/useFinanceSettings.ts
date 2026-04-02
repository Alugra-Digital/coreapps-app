import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as settingsApi from '@/api/finance-settings';

export const settingsKeys = {
  all: ['financeSettings'] as const,
  byKey: (key: string) => [...settingsKeys.all, key] as const,
};

export function useFinanceSetting(key: string) {
  return useQuery({
    queryKey: settingsKeys.byKey(key),
    queryFn: () => settingsApi.getSettingByKey(key),
  });
}

export function useUpsertFinanceSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ key, value, description }: { key: string; value: string; description?: string }) =>
      settingsApi.upsertSetting(key, value, description),
    onSuccess: (_, { key }) => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.byKey(key) });
      queryClient.invalidateQueries({ queryKey: settingsKeys.all });
    },
  });
}
