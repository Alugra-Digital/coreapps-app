/**
 * TanStack Query hooks for Dashboard API.
 * Uses queryClient.fetchQuery for fallback to populate cache for other pages.
 */

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import {
  aggregateDashboardFromRawData,
  type DashboardSummary,
} from "@/api/dashboard";
import * as projectsApi from "@/api/projects";
import * as invoicesApi from "@/api/invoices";
import * as purchaseOrdersApi from "@/api/purchase-orders";
import * as proposalApi from "@/api/proposal-penawaran";
import * as bastApi from "@/api/bast";
import * as employeesApi from "@/api/employees";
import * as taxTypesApi from "@/api/tax-types";
import { projectKeys } from "@/hooks/useProjects";
import { invoiceKeys } from "@/hooks/useInvoices";
import { purchaseOrderKeys } from "@/hooks/usePurchaseOrders";
import { proposalKeys } from "@/hooks/useProposal";
import { bastKeys } from "@/hooks/useBast";
import { employeeKeys } from "@/hooks/useEmployees";
import { taxTypeKeys } from "@/hooks/useTaxTypes";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  data: () => [...dashboardKeys.all, "data"] as const,
};

export function useDashboardData() {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: dashboardKeys.data(),
    queryFn: async (): Promise<DashboardSummary> => {
      try {
        const res = await api.get<DashboardSummary>("/api/analytics/dashboard");
        if (res?.metrics) return res;
      } catch {
        // Fall through to aggregation with cache population
      }

      const [projects, invoices, purchaseOrders, proposals, basts, employees, taxTypes] =
        await Promise.all([
          queryClient
            .fetchQuery({
              queryKey: projectKeys.lists(),
              queryFn: () => projectsApi.getProjects(),
            })
            .catch(() => []),
          queryClient
            .fetchQuery({
              queryKey: invoiceKeys.lists(),
              queryFn: () => invoicesApi.getInvoices(),
            })
            .catch(() => []),
          queryClient
            .fetchQuery({
              queryKey: purchaseOrderKeys.lists(),
              queryFn: () => purchaseOrdersApi.getPurchaseOrders(),
            })
            .catch(() => []),
          queryClient
            .fetchQuery({
              queryKey: proposalKeys.lists(),
              queryFn: () => proposalApi.getProposals(),
            })
            .catch(() => []),
          queryClient
            .fetchQuery({
              queryKey: bastKeys.lists(),
              queryFn: () => bastApi.getBasts(),
            })
            .catch(() => []),
          queryClient
            .fetchQuery({
              queryKey: employeeKeys.lists(),
              queryFn: () => employeesApi.getEmployees(),
            })
            .catch(() => []),
          queryClient
            .fetchQuery({
              queryKey: taxTypeKeys.lists(),
              queryFn: () => taxTypesApi.getTaxTypes(),
            })
            .catch(() => []),
        ]);

      return aggregateDashboardFromRawData({
        projects,
        invoices,
        purchaseOrders,
        proposals,
        basts,
        employees,
        taxTypes,
      });
    },
  });
}
