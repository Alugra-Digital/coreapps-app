/**
 * TanStack Query hook for Finance Overview API
 *
 * Fetches finance overview data (metrics, revenue growth, account balances,
 * expense breakdown, recent transactions) from GET /api/finance/overview.
 */

import { useQuery } from "@tanstack/react-query";
import { getFinanceOverview } from "@/api/finance";

export const financeOverviewKeys = {
  all: ["finance", "overview"] as const,
  list: (params?: { period?: string; from?: string; to?: string }) =>
    [...financeOverviewKeys.all, params] as const,
};

export function useFinanceOverview(params?: {
  period?: string;
  from?: string;
  to?: string;
}) {
  return useQuery({
    queryKey: financeOverviewKeys.list(params),
    queryFn: () => getFinanceOverview(params),
  });
}
