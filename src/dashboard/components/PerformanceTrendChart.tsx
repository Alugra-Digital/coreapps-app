import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Cell,
} from "recharts";
import { TrendingUp, Calendar, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const utilizationData = [
  { day: "Sun", value: 45 },
  { day: "Mon", value: 78 },
  { day: "Tue", value: 92, active: true },
  { day: "Wed", value: 85 },
  { day: "Thu", value: 88 },
  { day: "Fri", value: 82 },
  { day: "Sat", value: 50 },
];

export function PerformanceTrendChart({ className }: { className?: string }) {
  return (
    <Card
      className={cn(
        "shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm group hover:shadow-md transition-shadow",
        className,
      )}
    >
      <div className="flex justify-between items-center px-2">
        <span className="text-[13px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2 uppercase tracking-wider">
          <TrendingUp className="h-4 w-4" /> Billable Utilization
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1 rounded-lg text-[10px] font-medium bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10"
          >
            <Calendar className="h-3 w-3" /> Daily View{" "}
            <ChevronDown className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <CardContent className="p-6 bg-white dark:bg-background rounded-sm overflow-hidden border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col gap-1 mb-6">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-foreground">
              84.2%
            </span>
            <Badge
              variant="outline"
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-2xl border-[#edb53b]/50 text-[#edb53b] bg-[#edb53b]/10 hover:bg-[#edb53b]/20"
            >
              +5.4%
              <span className="font-normal ml-1">vs yesterday</span>
            </Badge>
          </div>
        </div>

        <div className="h-[220px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={utilizationData}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#edb53b" stopOpacity={1} />
                  <stop offset="100%" stopColor="#d9a32d" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
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
              />
              <RechartsTooltip
                cursor={{
                  fill: "rgba(0, 0, 0, 0.05)",
                  className: "dark:fill-white/5",
                }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-medium shadow-xl border-none">
                        {payload[0].payload.day} : {payload[0].value}%
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                {utilizationData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.active ? "url(#barGradient)" : "rgba(0, 0, 0, 0.03)"
                    }
                    className={cn(
                      "transition-all duration-300 hover:opacity-80",
                      !entry.active && "dark:fill-white/5",
                    )}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
