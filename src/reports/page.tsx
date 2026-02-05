import {
  FileBarChart,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  Filter,
  PieChart,
  BarChart,
  ShieldCheck,
  ArrowUpRight,
  Search,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as ReBarChart,
  Bar,
  Cell,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const performanceData = [
  { month: "Jan", revenue: 45000, expenses: 32000 },
  { month: "Feb", revenue: 52000, expenses: 34000 },
  { month: "Mar", revenue: 48000, expenses: 31000 },
  { month: "Apr", revenue: 61000, expenses: 42000 },
  { month: "May", revenue: 55000, expenses: 38000 },
  { month: "Jun", revenue: 67000, expenses: 45000 },
];

const expenditureData = [
  { name: "Salaries", value: 45, color: "#6366f1" },
  { name: "Infrastructure", value: 25, color: "#10b981" },
  { name: "Marketing", value: 15, color: "#f59e0b" },
  { name: "Operational", value: 15, color: "#f43f5e" },
];

const availableReports = [
  {
    id: "REP-001",
    name: "Q4 Financial Statement",
    type: "Financial",
    date: "Feb 01, 2024",
    size: "2.4 MB",
    status: "Ready",
  },
  {
    id: "REP-002",
    name: "Annual Tax Compliance",
    type: "Tax",
    date: "Jan 15, 2024",
    size: "1.8 MB",
    status: "Ready",
  },
  {
    id: "REP-003",
    name: "Client Yield Analysis",
    type: "Operational",
    date: "Jan 10, 2024",
    size: "4.2 MB",
    status: "Ready",
  },
  {
    id: "REP-004",
    name: "Employee Overhead Projection",
    type: "HR",
    date: "Jan 05, 2024",
    size: "0.9 MB",
    status: "Ready",
  },
];

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-4 p-4 max-w-[1600px] mx-auto bg-white dark:bg-[#111111] min-h-screen transition-colors">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-slate-900 dark:text-foreground">
            Analytics & Reports <span className="text-2xl">📊</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Generate insights, monitor financial health, and export
            enterprise-grade reports.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="h-9 gap-2 text-xs font-semibold bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400"
          >
            <Calendar className="h-4 w-4" /> Custom Period
          </Button>
          <Button className="h-9 gap-2 text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 shadow-sm transition-all">
            <Download className="h-4 w-4" /> Export All Data
          </Button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ReportMetricCard
          title="Consolidated Revenue"
          value="$328,400"
          change="+12.4%"
          trend="up"
          description="Fiscal Year 2024 YTD"
          icon={<TrendingUp className="h-4 w-4 text-emerald-500" />}
        />
        <ReportMetricCard
          title="Operating Margin"
          value="24.8%"
          change="+1.2%"
          trend="up"
          description="Efficiency Benchmark: 22%"
          icon={<PieChart className="h-4 w-4 text-indigo-500" />}
        />
        <ReportMetricCard
          title="Expense Ratio"
          value="68.2%"
          change="-2.4%"
          trend="down"
          description="Vs Target Projection: 72%"
          icon={<TrendingDown className="h-4 w-4 text-rose-500" />}
        />
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Performance Chart */}
        <Card className="xl:col-span-8 shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm group hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-4 px-2">
            <span className="text-[13px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2 uppercase tracking-wider">
              <BarChart className="h-4 w-4" /> Revenue vs Expenditure
            </span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-indigo-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                  Revenue
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                  Expenses
                </span>
              </div>
            </div>
          </div>
          <CardContent className="h-[350px] p-6 bg-white dark:bg-background rounded-sm border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E2E8F033"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#94A3B8", fontWeight: "bold" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#94A3B8", fontWeight: "bold" }}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111111",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "10px",
                    color: "#fff",
                  }}
                  itemStyle={{ padding: "2px 0" }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorExp)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Expenditure Breakdown */}
        <Card className="xl:col-span-4 shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm group hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-4 px-2">
            <span className="text-[13px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2 uppercase tracking-wider">
              <PieChart className="h-4 w-4" /> Expenditure Allocation
            </span>
          </div>
          <CardContent className="h-[350px] p-6 bg-white dark:bg-background rounded-sm border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex flex-col justify-between">
            <div className="flex-1 min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <ReBarChart data={expenditureData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    width={80}
                    tick={{ fontSize: 9, fill: "#64748B", fontWeight: "bold" }}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      backgroundColor: "#111111",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "10px",
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
                    {expenditureData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </ReBarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-1 gap-2 mt-4">
              {expenditureData.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-[11px] font-medium text-slate-600 dark:text-slate-400"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-foreground">
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Repository */}
      <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm group hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center mb-4 px-2">
          <span className="text-[13px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2 uppercase tracking-wider">
            <FileBarChart className="h-4 w-4" /> Generated Reports Library
          </span>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
              <input
                placeholder="Search reports..."
                className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg py-1 pl-8 pr-4 text-[10px] focus:ring-1 focus:ring-slate-200 outline-none w-48"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-2 rounded-lg text-[10px] font-bold bg-white dark:bg-white/5 border-slate-200 dark:border-white/10"
            >
              <Filter className="h-3.5 w-3.5" /> Filter
            </Button>
          </div>
        </div>
        <CardContent className="p-0 bg-white dark:bg-background rounded-sm overflow-hidden border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-white/5">
              <TableRow className="hover:bg-transparent border-slate-100 dark:border-white/5">
                <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase py-4">
                  Report ID
                </TableHead>
                <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Description
                </TableHead>
                <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Category
                </TableHead>
                <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Date Generated
                </TableHead>
                <TableHead className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  File Size
                </TableHead>
                <TableHead className="text-right py-4"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {availableReports.map((report) => (
                <TableRow
                  key={report.id}
                  className="group/row hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors border-slate-100 dark:border-white/5"
                >
                  <TableCell className="py-3 text-[10px] font-bold text-slate-900 dark:text-foreground">
                    {report.id}
                  </TableCell>
                  <TableCell className="py-3 text-xs font-bold text-slate-900 dark:text-foreground">
                    {report.name}
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge
                      variant="outline"
                      className="text-[9px] font-bold px-1.5 py-0 border-none bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400"
                    >
                      {report.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 text-[10px] text-slate-500 font-medium">
                    {report.date}
                  </TableCell>
                  <TableCell className="py-3 text-[10px] text-slate-500 font-medium">
                    {report.size}
                  </TableCell>
                  <TableCell className="py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 gap-2 text-[10px] font-bold text-primary hover:text-primary hover:bg-primary/5 transition-colors"
                    >
                      <Download className="h-3 w-3" /> Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Compliance Warning Row */}
      <div className="p-4 bg-indigo-50/50 dark:bg-indigo-500/5 rounded-sm border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-white dark:bg-[#111111] border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-indigo-500" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-foreground">
              Compliance Verification Active
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
              All financial reports are automatically cross-checked with latest
              PSAK/IFRS regulations for Fiscal Year 2024.
            </p>
          </div>
        </div>
        <Button
          variant="link"
          className="text-xs font-bold text-indigo-500 gap-1 no-underline"
        >
          View Compliance Log <ArrowUpRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

function ReportMetricCard({ title, value, change, trend, icon }: any) {
  return (
    <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm group hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-2 px-1">
        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none">
          {title}
        </span>
        <div className="h-8 w-8 rounded-lg bg-white dark:bg-background flex items-center justify-center shadow-sm border border-slate-100 dark:border-white/5">
          {icon}
        </div>
      </div>
      <CardContent className="p-4 bg-white dark:bg-background rounded-sm border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-foreground leading-none mb-1">
              {value}
            </div>
            <div
              className={cn(
                "text-[10px] font-bold flex items-center gap-1 mt-1",
                trend === "up" ? "text-emerald-500" : "text-rose-500",
              )}
            >
              {trend === "up" ? "↑" : "↓"} {change}
              <span className="text-slate-400 font-normal ml-1 text-[9px]">
                vs last period
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
