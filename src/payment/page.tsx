import {
  CreditCard,
  Plus,
  FileDown,
  TrendingUp,
  AlertCircle,
  Activity,
  ArrowRight,
  Filter,
} from "lucide-react";
import { PaymentEntryCard } from "./components/PaymentEntryCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const payments = [
  {
    id: "PAY-9921",
    source: "Bank Mandiri Transfer",
    amount: "$12,400.00",
    date: "Today, 10:45 AM",
    method: "Wire Transfer" as const,
    status: "Completed" as const,
  },
  {
    id: "PAY-9922",
    source: "Corporate Visa XXXX-4211",
    amount: "$2,150.40",
    date: "Today, 09:12 AM",
    method: "Credit Card" as const,
    status: "Processing" as const,
  },
  {
    id: "PAY-9923",
    source: "BCA Corporate Billing",
    amount: "$8,500.00",
    date: "Yesterday, 04:30 PM",
    method: "Wire Transfer" as const,
    status: "Completed" as const,
  },
  {
    id: "PAY-9924",
    source: "OCBC NISP Direct",
    amount: "$3,200.00",
    date: "Yesterday, 02:15 PM",
    method: "Direct Debit" as const,
    status: "Completed" as const,
  },
  {
    id: "PAY-9925",
    source: "Amex Business Centurion",
    amount: "$5,800.00",
    date: "Feb 02, 2024",
    method: "Credit Card" as const,
    status: "Failed" as const,
  },
  {
    id: "PAY-9926",
    source: "DBS Treasury Account",
    amount: "$45,000.00",
    date: "Feb 01, 2024",
    method: "Wire Transfer" as const,
    status: "Completed" as const,
  },
];

export default function PaymentPage() {
  return (
    <div className="flex flex-col gap-4 p-4 max-w-[1600px] mx-auto bg-white dark:bg-[#111111] min-h-screen transition-colors">
      {/* Header with Quick Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-slate-900 dark:text-foreground">
            Payment Processing <span className="text-2xl">💳</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Monitor transaction status, manage payment methods, and reconcile
            accounts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="h-9 gap-2 text-xs font-semibold bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
          >
            <FileDown className="h-4 w-4" /> Batch Report
          </Button>
          <Button className="h-9 gap-2 text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 shadow-sm transition-all">
            <Plus className="h-4 w-4" /> New Payment
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <PaymentStatCard
          title="Total Processed"
          value="$284.5k"
          change="+8.2%"
          trend="up"
          icon={<CreditCard className="h-4 w-4" />}
          color="#3b82f6"
        />
        <PaymentStatCard
          title="Pending Settlement"
          value="$12,840"
          description="03 items awaiting clearance"
          icon={<Activity className="h-4 w-4" />}
          color="#f59e0b"
        />
        <PaymentStatCard
          title="Payment Failures"
          value="02.1%"
          change="-0.5%"
          trend="down"
          icon={<AlertCircle className="h-4 w-4" />}
          color="#ef4444"
          badge="Healthy"
        />
        <PaymentStatCard
          title="Top Method"
          value="Transfer"
          description="Wire Transfer (64% volume)"
          icon={<TrendingUp className="h-4 w-4" />}
          color="#10b981"
        />
      </div>

      {/* Filter Row */}
      <div className="flex justify-between items-center bg-slate-50/50 dark:bg-white/5 p-2 rounded-lg border border-slate-100 dark:border-white/5 shadow-sm">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-2 text-[11px] font-bold text-slate-600 dark:text-slate-400"
          >
            All Transactions <ArrowRight className="h-3 w-3" />
          </Button>
          <div className="h-4 w-px bg-slate-200 dark:bg-white/10 mx-1" />
          <span className="text-[10px] text-slate-400 font-medium">
            Showing {payments.length} transactions for February
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-2 rounded-lg text-[10px] font-bold bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
        >
          <Filter className="h-3.5 w-3.5" /> Filter Results
        </Button>
      </div>

      {/* Transaction Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {payments.map((payment) => (
          <PaymentEntryCard key={payment.id} {...payment} />
        ))}
      </div>
    </div>
  );
}

function PaymentStatCard({
  title,
  value,
  change,
  trend,
  description,
  icon,
  color,
  badge,
}: any) {
  return (
    <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm group hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-2 px-1">
        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none">
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
            {change ? (
              <div
                className={cn(
                  "text-[10px] font-bold flex items-center gap-1",
                  trend === "up" ? "text-emerald-500" : "text-rose-500",
                )}
              >
                {trend === "up" ? "↑" : "↓"} {change}
                <span className="text-slate-400 font-normal ml-1 text-[9px]">
                  vs last month
                </span>
              </div>
            ) : (
              <div className="text-[10px] text-slate-400 leading-tight">
                {description}
              </div>
            )}
          </div>
          {badge && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border border-emerald-100 dark:border-emerald-500/20">
              {badge}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
