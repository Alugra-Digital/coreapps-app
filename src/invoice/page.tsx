import { useEffect, useState, useCallback, useId } from "react";
import {
  FilePlus,
  TrendingUp,
  FileDown,
  CreditCard,
  FileText,
  Target,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { InvoiceTable } from "./components/InvoiceTable";
import { InvoiceActivity } from "./components/InvoiceActivity";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getInvoices } from "@/api/invoices";
import type { Invoice } from "./types";

const totalInvoicedChartData = [
  { value: 35 },
  { value: 48 },
  { value: 42 },
  { value: 55 },
  { value: 60 },
  { value: 52 },
  { value: 70 },
];

const pendingCollectionChartData = [
  { value: 28 },
  { value: 35 },
  { value: 32 },
  { value: 40 },
  { value: 38 },
  { value: 45 },
  { value: 42 },
];

function CircularProgress({
  value,
  color,
  size = 56,
}: {
  value: number;
  color: string;
  size?: number;
}) {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const percentText = `${Math.round(value)}%`;
  const id = useId().replace(/:/g, "");
  const filterId = `glow-${id}`;
  const gradientId = `gradient-${id}`;

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity={0.5} />
            <stop offset="50%" stopColor={color} stopOpacity={1} />
            <stop offset="100%" stopColor={color} stopOpacity={0.7} />
          </linearGradient>
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-100 dark:text-white/10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          filter={`url(#${filterId})`}
          className="transition-all"
        />
      </svg>
      <span className="absolute text-[11px] font-bold text-slate-900 dark:text-foreground">
        {percentText}
      </span>
    </div>
  );
}

export default function InvoicePage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadInvoices = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await getInvoices();
      setInvoices(data);
    } catch (err) {
      const message = err && typeof err === "object" && "message" in err
        ? String((err as { message: string }).message)
        : "Failed to load invoices";
      setError(message);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  const totalInvoiced = invoices.reduce((sum, inv) => {
    const items = inv.lineItems ?? [];
    return sum + items.reduce((s, i) => s + (i.priceAfterTax ?? i.subtotal ?? 0), 0);
  }, 0);

  const formatCurrencyCompact = (value: number): string => {
    if (value >= 1_000_000_000) {
      return `Rp ${(value / 1_000_000_000).toLocaleString("id-ID", { maximumFractionDigits: 2, minimumFractionDigits: 0 })} B`;
    }
    if (value >= 1_000_000) {
      return `Rp ${(value / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 2, minimumFractionDigits: 0 })} jt`;
    }
    if (value >= 1_000) {
      return `Rp ${(value / 1_000).toLocaleString("id-ID", { maximumFractionDigits: 1, minimumFractionDigits: 0 })} rb`;
    }
    return `Rp ${value.toLocaleString("id-ID")}`;
  };

  return (
    <div
      className="flex flex-col gap-4 p-4 max-w-[1600px] mx-auto bg-white dark:bg-[#111111] min-h-screen transition-colors"
      data-testid="invoice-page"
    >
      {/* Header with Quick Actions - always visible */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1
            className="text-3xl font-bold tracking-tight flex items-center gap-2 text-slate-900 dark:text-foreground"
            data-testid="invoice-heading"
          >
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
          <Button
            className="h-9 gap-2 text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 shadow-sm transition-all"
            onClick={() => setIsAddOpen(true)}
            data-testid="create-invoice-btn"
          >
            <FilePlus className="h-4 w-4" /> Create Invoice
          </Button>
        </div>
      </div>

      {/* Error state - visible when API fails */}
      {error && (
        <div
          className="flex items-center justify-between gap-4 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3"
          data-testid="invoice-load-error"
        >
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
          <Button variant="outline" size="sm" onClick={loadInvoices}>
            <RefreshCw className="h-4 w-4 mr-2" /> Try again
          </Button>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InvSummaryCard
          title="Total Invoiced"
          value={formatCurrencyCompact(totalInvoiced)}
          description={`${invoices.length} invoice(s)`}
          icon={<FileText className="h-4 w-4" />}
          color="#ef4444"
          chartData={totalInvoicedChartData}
          chartColor="#ef4444"
        />
        <InvSummaryCard
          title="Pending Collection"
          value={formatCurrencyCompact(totalInvoiced)}
          description="Due within next 15 days"
          icon={<CreditCard className="h-4 w-4" />}
          color="#3b82f6"
          chartData={pendingCollectionChartData}
          chartColor="#3b82f6"
        />
        <InvSummaryCard
          title="DSO (Collection Speed)"
          value="24 Days"
          description="Target: <30 Days"
          icon={<Target className="h-4 w-4" />}
          color="#10b981"
          progressValue={24}
          progressMax={30}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 xl:items-stretch xl:min-h-[360px]">
        {/* Invoice Table */}
        <div className="xl:col-span-8 flex flex-col min-h-0">
          <InvoiceTable
            invoices={invoices}
            onRefresh={loadInvoices}
            onAddClick={() => setIsAddOpen(true)}
            isAddOpen={isAddOpen}
            onAddOpenChange={setIsAddOpen}
          />
        </div>

        {/* Activity Card */}
        <div className="xl:col-span-4 flex flex-col min-h-0">
          <InvoiceActivity className="h-full min-h-0" />
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
  chartData,
  chartColor,
  progressValue,
  progressMax,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  badge?: string;
  chartData?: { value: number }[];
  chartColor?: string;
  progressValue?: number;
  progressMax?: number;
}) {
  const chartId = `inv-chart-${useId().replace(/:/g, "")}`;

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
        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col gap-1.5 min-w-0">
            <div className="text-2xl font-bold text-slate-900 dark:text-foreground leading-none">
              {value}
            </div>
            <div className="text-[10px] text-slate-400 leading-tight">
              {description}
            </div>
          </div>
          {progressValue != null && progressMax != null && (
            <div className="shrink-0">
              <CircularProgress
                value={(progressValue / progressMax) * 100}
                color={color}
                size={56}
              />
            </div>
          )}
          {chartData && chartColor && (
            <div className="flex-1 h-[60px] min-w-[80px] max-w-[120px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient
                      id={chartId}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={chartColor}
                        stopOpacity={0.2}
                      />
                      <stop
                        offset="95%"
                        stopColor={chartColor}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={chartColor}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill={`url(#${chartId})`}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
          {badge && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-100 dark:border-amber-500/20 shrink-0 self-start">
              {badge}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
