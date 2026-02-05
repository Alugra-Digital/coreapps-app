import { BarChart3, Briefcase, Heart } from "lucide-react";
import { MetricCard } from "./components/MetricCard";
import { PerformanceTrendChart } from "./components/PerformanceTrendChart";
import { LatestUpdates } from "./components/LatestUpdates";
import { SLAMonitoringTable } from "./components/SLAMonitoringTable";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4 p-4 max-w-[1600px] mx-auto bg-white dark:bg-[#111111] min-h-screen transition-colors">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-slate-900 dark:text-foreground">
          Hello, Raid Ikram <span className="text-2xl">👋</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Overview of your ERP Implementation & Consulting performance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Section: Metrics & Charts */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title="Utilization Rate"
              value="84.2%"
              change="+5.4%"
              trend="up"
              icon={<BarChart3 className="h-4 w-4" />}
              chartColor="#10b981"
              badge="3"
            />
            <MetricCard
              title="In-Flight Projects"
              value="12"
              change="+2"
              trend="up"
              icon={<Briefcase className="h-4 w-4" />}
              chartColor="#3b82f6"
              badge="12"
            />
            <MetricCard
              title="Client NPS Score"
              value="9.2"
              change="+0.4"
              trend="up"
              icon={<Heart className="h-4 w-4" />}
              chartColor="#ef4444"
              badge="9"
            />
          </div>

          {/* Performance Trend Chart */}
          <PerformanceTrendChart className="flex-1" />
        </div>

        {/* Right Section: Sidebar Activity */}
        <div className="lg:col-span-1">
          <LatestUpdates className="h-full" />
        </div>
      </div>

      {/* SLA Monitoring Table */}
      <SLAMonitoringTable />
    </div>
  );
}
