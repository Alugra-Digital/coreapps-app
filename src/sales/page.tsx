import {
  TrendingUp,
  DollarSign,
  Target,
  Download,
  Calendar,
  Filter,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Local Components
import { SalesMetricCard } from "./components/SalesMetricCard";
import { SalesCharts } from "./components/SalesCharts";
import { SalesPipelineTable } from "./components/SalesPipelineTable";
import {
  performanceData as defaultPerformance,
  dealsByCategory as defaultDealsByCategory,
  recentDeals as defaultRecentDeals,
} from "./components/data";
import { useSales } from "@/hooks/useSales";
import { formatIdr } from "@/lib/currency";

export default function SalesPage() {
  const { data: salesData } = useSales();

  const performanceData = salesData?.performanceData?.length
    ? salesData.performanceData.map((p) => ({ name: p.month ?? (p as { name?: string }).name ?? "", revenue: p.revenue, deals: (p as { deals?: number }).deals }))
    : defaultPerformance;
  const dealsByCategory = salesData?.dealsByCategory?.length ? salesData.dealsByCategory : defaultDealsByCategory;
  const recentDeals = salesData?.recentDeals?.length
    ? salesData.recentDeals.map((d) => ({
        id: d.id,
        client: d.client,
        avatar: d.client?.slice(0, 2).toUpperCase() ?? "—",
        owner: "—",
        value: formatIdr(d.amount),
        status: d.stage ?? "—",
        probability: d.probability ?? 0,
        date: "—",
      }))
    : defaultRecentDeals;
  return (
    <div className="flex flex-col gap-4 p-4 max-w-[1600px] mx-auto bg-white dark:bg-[#111111] min-h-screen transition-colors">
      {/* Sales Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-slate-900 dark:text-foreground">
            Sales Analytics <span className="text-2xl">📈</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Performance tracking, pipeline management, and revenue insights.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="h-9 gap-2 text-xs font-semibold bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400"
          >
            <Calendar className="h-4 w-4" /> This Quarter
          </Button>
          <Button
            variant="outline"
            className="h-9 border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 px-3"
          >
            <Filter className="h-4 w-4" />
          </Button>
          <Button className="h-9 gap-2 text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 shadow-sm transition-all px-5">
            <Download className="h-4 w-4" /> Export Data
          </Button>
        </div>
      </div>

      {/* Sales Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SalesMetricCard
          title="Total Revenue"
          value={salesData?.totalRevenue != null ? formatIdr(salesData.totalRevenue) : "Rp 742,5 jt"}
          change="+12.4%"
          trend="up"
          icon={<DollarSign className="h-5 w-5" />}
        />
        <SalesMetricCard
          title="Quarterly Target"
          value={salesData?.quarterlyTarget != null ? formatIdr(salesData.quarterlyTarget, true) : "Rp 1,2 M"}
          change={`${salesData?.targetPercent ?? 62}% Met`}
          progress={salesData?.targetPercent ?? 62}
          icon={<Target className="h-5 w-5" />}
        />
        <SalesMetricCard
          title="Avg. Deal Size"
          value={salesData?.avgDealSize != null ? formatIdr(salesData.avgDealSize) : "Rp 8,45 jt"}
          change="+3.1%"
          trend="up"
          icon={<Briefcase className="h-5 w-5" />}
        />
        <SalesMetricCard
          title="Conversion"
          value={`${salesData?.conversion ?? 24.8}%`}
          change="-1.2%"
          trend="down"
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      {/* Main Charts Row */}
      <SalesCharts
        performanceData={performanceData}
        dealsByCategory={dealsByCategory}
      />

      {/* Recent Transactions Table */}
      <SalesPipelineTable recentDeals={recentDeals} />
    </div>
  );
}
