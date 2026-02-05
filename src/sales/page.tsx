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
  performanceData,
  dealsByCategory,
  recentDeals,
} from "./components/data";

export default function SalesPage() {
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
          value="$742,500.00"
          change="+12.4%"
          trend="up"
          icon={<DollarSign className="h-5 w-5" />}
        />
        <SalesMetricCard
          title="Quarterly Target"
          value="$1.2M"
          change="62% Met"
          progress={62}
          icon={<Target className="h-5 w-5" />}
        />
        <SalesMetricCard
          title="Avg. Deal Size"
          value="$8,450.00"
          change="+3.1%"
          trend="up"
          icon={<Briefcase className="h-5 w-5" />}
        />
        <SalesMetricCard
          title="Conversion"
          value="24.8%"
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
