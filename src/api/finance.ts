/**
 * Finance overview API service.
 * GET /api/finance/overview
 */

import { api } from "@/lib/api/client";

export interface FinanceMetric {
  key: string;
  title: string;
  value: number;
  formattedValue: string;
  changePercent: number;
  trend: "up" | "down";
}

export interface RevenueGrowthItem {
  month: string;
  value: number;
  active?: boolean;
}

export interface AccountBalance {
  id: number;
  name: string;
  number: string;
  balance: number;
  formattedBalance: string;
}

export interface ExpenseBreakdownItem {
  name: string;
  value: number;
  color: string;
}

export interface RecentTransaction {
  id: string;
  date: string;
  entity: string;
  category: string;
  amount: number;
  formattedAmount: string;
  type: "inbound" | "outbound";
  status: string;
}

export interface FinanceOverview {
  metrics: FinanceMetric[];
  revenueGrowth: RevenueGrowthItem[];
  accountBalances: AccountBalance[];
  expenseBreakdown: ExpenseBreakdownItem[];
  recentTransactions: RecentTransaction[];
}

export interface FinanceOverviewResponse {
  success: boolean;
  message: string;
  data: FinanceOverview;
  meta?: { generatedAt: string };
}

export async function getFinanceOverview(params?: {
  period?: string;
  from?: string;
  to?: string;
  currency?: string;
}): Promise<FinanceOverview> {
  const qs = params
    ? "?" + new URLSearchParams(params as Record<string, string>).toString()
    : "";
  const res = await api.get<FinanceOverviewResponse>(`/api/finance/overview${qs}`);
  const body = res as FinanceOverviewResponse;
  if (!body?.data) {
    throw new Error(body?.message ?? "Invalid finance overview response");
  }
  return body.data;
}
