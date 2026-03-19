/**
 * TanStack Query hooks for Settings API
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as settingsApi from "@/api/settings";
import type { Settings } from "@/api/settings";

export const settingsKeys = {
  all: ["settings"] as const,
};

export function useSettings() {
  return useQuery({
    queryKey: settingsKeys.all,
    queryFn: () => settingsApi.getSettings(),
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Partial<Settings>) => settingsApi.updateSettings(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.all });
    },
  });
}
