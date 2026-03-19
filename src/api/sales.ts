/**
 * Sales API service.
 * GET /api/analytics/sales
 */

import { api } from "@/lib/api/client";

export interface SalesPerformanceItem {
  month: string;
  revenue: number;
  target?: number;
}

export interface SalesDealCategory {
  name: string;
  value: number;
  color: string;
}

export interface SalesRecentDeal {
  id: string;
  client: string;
  amount: number;
  stage: string;
  probability: number;
}

export interface SalesData {
  performanceData: SalesPerformanceItem[];
  dealsByCategory: SalesDealCategory[];
  recentDeals: SalesRecentDeal[];
  totalRevenue?: number;
  quarterlyTarget?: number;
  targetPercent?: number;
  avgDealSize?: number;
  conversion?: number;
}

export interface SalesResponse {
  success?: boolean;
  message?: string;
  data: SalesData;
}

export async function getSalesData(): Promise<SalesData> {
  try {
    const res = await api.get<SalesResponse>("/api/analytics/sales");
    if (res?.data) return res.data;
    return res as unknown as SalesData;
  } catch {
    return {
      performanceData: [],
      dealsByCategory: [],
      recentDeals: [],
    };
  }
}
