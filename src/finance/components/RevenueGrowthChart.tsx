import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
} from "recharts";
import { TrendingUp, Calendar, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const financeData = [
  { month: "Aug", value: 65000 },
  { month: "Sep", value: 78000 },
  { month: "Oct", value: 82000 },
  { month: "Nov", value: 95000, active: true },
  { month: "Dec", value: 88000 },
  { month: "Jan", value: 92000 },
  { month: "Feb", value: 98000 },
];

export function RevenueGrowthChart({ className }: { className?: string }) {
  return (
    <Card
      className={cn(
        "shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm group hover:shadow-md transition-shadow",
        className,
      )}
    >
      <div className="flex justify-between items-center px-2">
        <span className="text-[13px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2 uppercase tracking-wider">
          <TrendingUp className="h-4 w-4" /> Revenue Growth
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1 rounded-lg text-[10px] font-medium bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
          >
            <Calendar className="h-3 w-3" /> Monthly View{" "}
            <ChevronDown className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <CardContent className="p-6 bg-white dark:bg-background rounded-sm overflow-hidden border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col gap-1 mb-6">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-foreground">
              $98,240
            </span>
            <Badge
              variant="outline"
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-2xl border-green-600 text-green-600 bg-transparent hover:bg-transparent"
            >
              +12.5%
              <span className="font-normal ml-1">vs last year</span>
            </Badge>
          </div>
        </div>

        <div className="h-[220px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={financeData}>
              <defs>
                <linearGradient
                  id="revenueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                dx={-10}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <RechartsTooltip
                cursor={{ stroke: "#10b981", strokeWidth: 1 }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-medium shadow-xl border-none">
                        {data?.month} : ${payload[0].value?.toLocaleString()}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#10b981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#revenueGradient)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
