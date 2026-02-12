import { useEffect, useState } from "react";
import {
  FolderKanban,
  FileText,
  ShoppingCart,
  FileBarChart,
  Package,
  Users,
  Receipt,
} from "lucide-react";
import { DashboardStatCard } from "./components/DashboardStatCard";
import { PerformanceTrendChart } from "./components/PerformanceTrendChart";
import { LatestUpdates } from "./components/LatestUpdates";
import { ActiveProjectsTable } from "./components/ActiveProjectsTable";
import { getDashboardData } from "@/api/dashboard";

function formatIdr(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return new Intl.NumberFormat("id-ID").format(value);
}

export default function DashboardPage() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getDashboardData>> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardData()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-4 p-4 max-w-[1600px] mx-auto bg-white dark:bg-[#111111] min-h-screen transition-colors">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-foreground">
            Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  const metrics = data?.metrics ?? {
    projects: { total: 0, onProgress: 0, completed: 0, cancelled: 0 },
    invoices: { count: 0, totalRevenue: 0 },
    purchaseOrders: { count: 0 },
    proposals: { total: 0, draft: 0, sent: 0, accepted: 0, rejected: 0 },
    basts: { count: 0 },
    employees: { count: 0 },
    taxTypes: { count: 0 },
  };

  const recentActivities = data?.recentActivities ?? [];
  const activeProjects = data?.activeProjects ?? [];
  const revenueByProject = data?.revenueByProject ?? [];
  const projectRevenueTotal = revenueByProject.reduce((s, p) => s + p.income, 0);

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

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardStatCard
          title="Projects"
          value={String(metrics.projects.total)}
          description={`${metrics.projects.onProgress} active`}
          icon={<FolderKanban className="h-4 w-4" />}
          color="#3b82f6"
        />
        <DashboardStatCard
          title="Invoices"
          value={String(metrics.invoices.count)}
          description={`Rp ${formatIdr(metrics.invoices.totalRevenue)} total`}
          icon={<FileText className="h-4 w-4" />}
          color="#10b981"
        />
        <DashboardStatCard
          title="Purchase Orders"
          value={String(metrics.purchaseOrders.count)}
          description="Total POs"
          icon={<ShoppingCart className="h-4 w-4" />}
          color="#f59e0b"
        />
        <DashboardStatCard
          title="Proposals"
          value={String(metrics.proposals.total)}
          description={`${metrics.proposals.draft} draft, ${metrics.proposals.accepted} accepted`}
          icon={<FileBarChart className="h-4 w-4" />}
          color="#8b5cf6"
        />
        <DashboardStatCard
          title="BAST"
          value={String(metrics.basts.count)}
          description="Handover documents"
          icon={<Package className="h-4 w-4" />}
          color="#06b6d4"
        />
        <DashboardStatCard
          title="Employees"
          value={String(metrics.employees.count)}
          description="Total staff"
          icon={<Users className="h-4 w-4" />}
          color="#ec4899"
        />
        <DashboardStatCard
          title="Tax Types"
          value={String(metrics.taxTypes.count)}
          description="Perpajakan configs"
          icon={<Receipt className="h-4 w-4" />}
          color="#64748b"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Section: Chart */}
        <div className="lg:col-span-2">
          <PerformanceTrendChart
            revenueByProject={revenueByProject}
            totalRevenue={projectRevenueTotal}
            className="flex-1"
          />
        </div>

        {/* Right Section: Latest Updates */}
        <div className="lg:col-span-1">
          <LatestUpdates activities={recentActivities} className="h-full" />
        </div>
      </div>

      {/* Active Projects Table */}
      <ActiveProjectsTable projects={activeProjects} />
    </div>
  );
}
