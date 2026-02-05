import {
  FilePlus,
  TrendingUp,
  FileDown,
  CreditCard,
  FileText,
  Target,
  ShieldCheck,
} from "lucide-react";
import { InvoiceTable } from "./components/InvoiceTable";
import { InvoiceActivity } from "./components/InvoiceActivity";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function InvoicePage() {
  return (
    <div className="flex flex-col gap-4 p-4 max-w-[1600px] mx-auto bg-white dark:bg-[#111111] min-h-screen transition-colors">
      {/* Header with Quick Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-slate-900 dark:text-foreground">
            Invoice Management <span className="text-2xl">🧾</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Track client billings, manage payment schedules, and monitor
            collection health.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="h-9 gap-2 text-xs font-semibold bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
          >
            <FileDown className="h-4 w-4" /> Export Ledger
          </Button>
          <Button className="h-9 gap-2 text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 shadow-sm transition-all">
            <FilePlus className="h-4 w-4" /> Create Invoice
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InvSummaryCard
          title="Total Invoiced (Q1)"
          value="$342,800"
          description="+14% from last quarter"
          icon={<FileText className="h-4 w-4" />}
          color="#3b82f6"
        />
        <InvSummaryCard
          title="Pending Collection"
          value="$45,210"
          description="Due within next 15 days"
          icon={<CreditCard className="h-4 w-4" />}
          color="#f59e0b"
          badge="Action Required"
        />
        <InvSummaryCard
          title="DSO (Collection Speed)"
          value="24 Days"
          description="Target: <30 Days"
          icon={<Target className="h-4 w-4" />}
          color="#10b981"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Invoice Table */}
        <div className="xl:col-span-8">
          <InvoiceTable />
        </div>

        {/* Activity Card */}
        <div className="xl:col-span-4">
          <InvoiceActivity className="h-full" />
        </div>
      </div>

      {/* Footer / Secondary Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm group hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between px-1 mb-2">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                <ShieldCheck className="h-4 w-4 text-indigo-500" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-foreground uppercase tracking-wider">
                  Automated Tax Sync
                </h4>
                <p className="text-[10px] text-slate-500">
                  VAT/GST calculated automatically
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 rounded-full p-0"
            >
              <TrendingUp className="h-4 w-4 text-slate-400" />
            </Button>
          </div>
        </Card>
        <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm group hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between px-1 mb-2">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-foreground uppercase tracking-wider">
                  Profit Margin Index
                </h4>
                <p className="text-[10px] text-slate-500">
                  Average billing yield: 24%
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function InvSummaryCard({
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
