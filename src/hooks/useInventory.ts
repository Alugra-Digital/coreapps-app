/**
 * TanStack Query hooks for Inventory API
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  InventoryItemCreateInput,
  InventoryItemUpdateInput,
} from "@/inventory/types";
import * as inventoryApi from "@/api/inventory";

export const inventoryKeys = {
  all: ["inventory"] as const,
  lists: () => [...inventoryKeys.all, "list"] as const,
  details: () => [...inventoryKeys.all, "detail"] as const,
  detail: (id: string) => [...inventoryKeys.details(), id] as const,
};

export function useInventoryItems() {
  return useQuery({
    queryKey: inventoryKeys.lists(),
    queryFn: () => inventoryApi.getInventoryItems(),
  });
}

export function useInventoryItemById(id: string | undefined) {
  return useQuery({
    queryKey: inventoryKeys.detail(id!),
    queryFn: () => inventoryApi.getInventoryItemById(id!),
    enabled: !!id,
  });
}

export function useCreateInventoryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: InventoryItemCreateInput) =>
      inventoryApi.createInventoryItem(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
    },
  });
}

export function useUpdateInventoryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: InventoryItemUpdateInput;
    }) => inventoryApi.updateInventoryItem(id, input),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
    },
  });
}

export function useDeleteInventoryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => inventoryApi.deleteInventoryItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
    },
  });
}
