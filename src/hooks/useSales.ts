/**
 * TanStack Query hooks for Sales API
 */

import { useQuery } from "@tanstack/react-query";
import * as salesApi from "@/api/sales";

export const salesKeys = {
  all: ["sales"] as const,
  data: () => [...salesKeys.all, "data"] as const,
};

export function useSales() {
  return useQuery({
    queryKey: salesKeys.data(),
    queryFn: () => salesApi.getSalesData(),
  });
}
