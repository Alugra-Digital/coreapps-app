import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Cell,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface RevenueItem {
  projectId: string;
  projectName: string;
  income: number;
}

interface PerformanceTrendChartProps {
  revenueByProject: RevenueItem[];
  totalRevenue: number;
  className?: string;
}

function formatIdr(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return String(value);
}

export function PerformanceTrendChart({
  revenueByProject,
  totalRevenue,
  className,
}: PerformanceTrendChartProps) {
  const chartData = revenueByProject.slice(0, 7).map((p) => ({
    name: p.projectName.length > 20 ? p.projectName.slice(0, 17) + "..." : p.projectName,
    value: p.income,
    fullName: p.projectName,
  }));

  const hasData = chartData.length > 0;

  return (
    <Card
      className={cn(
        "shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm group hover:shadow-md transition-shadow",
        className,
      )}
    >
      <div className="flex justify-between items-center px-2">
        <span className="text-[13px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2 uppercase tracking-wider">
          <TrendingUp className="h-4 w-4" /> Revenue by Project
        </span>
      </div>

      <CardContent className="p-6 bg-white dark:bg-background rounded-sm overflow-hidden border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col gap-1 mb-6">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-foreground">
              {formatIdr(totalRevenue)}
            </span>
            <span className="text-xs text-slate-500">IDR total</span>
          </div>
        </div>

        <div className="h-[220px] w-full mt-4">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 20 }}>
                <defs>
                  <linearGradient id="revenueBarGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#059669" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  tickFormatter={formatIdr}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={100}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                />
                <RechartsTooltip
                  cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const p = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-medium shadow-xl border-none">
                          <div className="font-bold">{p.fullName}</div>
                          <div>Rp {new Intl.NumberFormat("id-ID").format(p.value)}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24} fill="url(#revenueBarGradient)">
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} className="transition-all duration-300 hover:opacity-80" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm">
              No revenue data yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
