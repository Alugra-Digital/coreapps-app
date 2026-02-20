import {
  DollarSign,
  ExternalLink,
  ShieldCheck,
  Plus,
  FileDown,
} from "lucide-react";
import { FinanceMetricCard } from "./components/FinanceMetricCard";
import { RevenueGrowthChart } from "./components/RevenueGrowthChart";
import { AccountBalances } from "./components/AccountBalances";
import { TransactionHistoryTable } from "./components/TransactionHistoryTable";
import { ExpenseBreakdown } from "./components/ExpenseBreakdown";
import { Button } from "@/components/ui/button";

export default function FinancePage() {
  return (
    <div className="flex flex-col gap-4 p-4 max-w-[1600px] mx-auto bg-white dark:bg-[#111111] min-h-screen transition-colors">
      {/* Header with Quick Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-slate-900 dark:text-foreground">
            Financial Overview <span className="text-2xl">💰</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Track revenue, expenses, and transaction history across all
            platforms.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="h-9 gap-2 text-xs font-semibold bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
          >
            <FileDown className="h-4 w-4" /> Export Report
          </Button>
          <Button className="h-9 gap-2 text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 shadow-sm transition-all">
            <Plus className="h-4 w-4" /> New Transaction
          </Button>
        </div>
      </div>

      {/* Main Focus: Performance & Cash Positions */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div className="xl:col-span-8">
          <RevenueGrowthChart className="h-[420px]" />
        </div>
        <div className="xl:col-span-4">
          <AccountBalances className="h-[420px]" />
        </div>
      </div>

      {/* Secondary: Key Financial Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FinanceMetricCard
          title="Total Revenue"
          value="Rp 6,64 M"
          change="+12.4%"
          trend="up"
          icon={<DollarSign className="h-4 w-4" />}
          chartColor="#10b981"
        />
        <FinanceMetricCard
          title="Operational Expenses"
          value="Rp 1,93 M"
          change="-2.1%"
          trend="down"
          icon={<ExternalLink className="h-4 w-4" />}
          chartColor="#3b82f6"
        />
        <FinanceMetricCard
          title="Net Profit"
          value="Rp 4,72 M"
          change="+15.8%"
          trend="up"
          icon={<ShieldCheck className="h-4 w-4" />}
          chartColor="#ef4444"
          badge="!"
        />
      </div>

      {/* Details: Operations & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <TransactionHistoryTable />
        </div>
        <div className="lg:col-span-2">
          <ExpenseBreakdown className="h-full" />
        </div>
      </div>
    </div>
  );
}
