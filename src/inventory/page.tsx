import {
  Package,
  Plus,
  FileDown,
  LayoutGrid,
  TrendingDown,
  Warehouse,
} from "lucide-react";
import { InventoryStockTable } from "./components/InventoryStockTable";
import { AppointmentCard } from "./components/AppointmentCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function InventoryPage() {
  return (
    <div className="flex flex-col gap-4 p-4 max-w-[1600px] mx-auto bg-white dark:bg-[#111111] min-h-screen transition-colors">
      {/* Header with Quick Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-slate-900 dark:text-foreground">
            IT Asset Management <span className="text-2xl">💻</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Control enterprise assets, license compliance, and service
            deployments.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="h-9 gap-2 text-xs font-semibold bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
          >
            <FileDown className="h-4 w-4" /> Export Assets
          </Button>
          <Button className="h-9 gap-2 text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 shadow-sm transition-all">
            <Plus className="h-4 w-4" /> Assign New Asset
          </Button>
        </div>
      </div>

      {/* Overview Cards (Mirroring Finance Style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InventorySummaryCard
          title="Total Managed Assets"
          value="4,821"
          description="Enterprise hardware & IoT nodes"
          icon={<Package className="h-4 w-4" />}
          color="#3b82f6"
        />
        <InventorySummaryCard
          title="Critical Software Risks"
          value="07"
          description="Licenses nearing expiration"
          icon={<TrendingDown className="h-4 w-4" />}
          color="#f59e0b"
          badge="Audit Alert"
        />
        <InventorySummaryCard
          title="Leasing Optimization"
          value="82%"
          description="Equipment utilization rate"
          icon={<Warehouse className="h-4 w-4" />}
          color="#10b981"
        />
      </div>

      {/* Main Content: Table & Appointments */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Compact Table */}
        <div className="xl:col-span-8">
          <InventoryStockTable />
        </div>

        {/* Appointment Card */}
        <div className="xl:col-span-4">
          <AppointmentCard className="h-full" />
        </div>
      </div>

      {/* Integration/Quick Links row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm group hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 px-1 mb-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <LayoutGrid className="h-4 w-4 text-indigo-500" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-foreground uppercase tracking-wider">
                Service Mesh Sync
              </h4>
              <p className="text-[10px] text-slate-500">
                Connected with cloud monitoring
              </p>
            </div>
          </div>
        </Card>
        <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm group hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 px-1 mb-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <TrendingDown className="h-4 w-4 text-emerald-500" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-foreground uppercase tracking-wider">
                Compliance Index
              </h4>
              <p className="text-[10px] text-slate-500">
                ISO 27001 Certified (98% score)
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function InventorySummaryCard({
  title,
  value,
  description,
  icon,
  color,
  badge,
}: any) {
  return (
    <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm group hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-2 px-1">
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none">
          {title}
        </span>
        <div
          className="h-8 w-8 rounded-lg flex items-center justify-center shadow-sm"
          style={{ backgroundColor: `${color}15`, color: color }}
        >
          {icon}
        </div>
      </div>
      <CardContent className="p-4 bg-white dark:bg-background rounded-sm border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-foreground leading-none mb-1">
              {value}
            </div>
            <div className="text-[10px] text-slate-400 leading-tight">
              {description}
            </div>
          </div>
          {badge && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-100 dark:border-amber-500/20">
              {badge}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
