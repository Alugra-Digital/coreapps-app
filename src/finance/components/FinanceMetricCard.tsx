import React from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const metricData = [
  { value: 30 },
  { value: 40 },
  { value: 35 },
  { value: 50 },
  { value: 45 },
  { value: 60 },
  { value: 55 },
];

interface FinanceMetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ReactNode;
  chartColor: string;
  badge?: string;
  className?: string;
}

export function FinanceMetricCard({
  title,
  value,
  change,
  trend,
  icon,
  chartColor,
  badge,
  className,
}: FinanceMetricCardProps) {
  const chartId = React.useId().replace(/:/g, "");

  return (
    <Card
      className={cn(
        "shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm group hover:shadow-md transition-shadow",
        className,
      )}
    >
      <div className="flex justify-between items-center mb-3 px-1">
        <span className="text-[13px] font-medium text-slate-600 dark:text-slate-400">
          {title}
        </span>
        <div className="relative">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg border transition-all group-hover:shadow-sm"
            style={{
              backgroundColor: `${chartColor}15`,
              borderColor: `${chartColor}30`,
            }}
          >
            <div style={{ color: chartColor }}>{icon}</div>
          </div>
          {badge && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 px-1 py-0 min-w-4 h-4 text-[8px] flex items-center justify-center rounded-full border-2 border-white dark:border-[#111111] shadow-sm font-bold"
            >
              {badge}
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-6 bg-white dark:bg-background rounded-sm overflow-hidden border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-foreground">
            {value}
          </span>
          <div className="flex items-center gap-1.5 min-w-max">
            <span
              className={cn(
                "text-[10px] font-bold",
                trend === "up" ? "text-green-500" : "text-red-500",
              )}
            >
              {change}
            </span>
            <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
              vs last month
            </span>
          </div>
        </div>

        <div className="flex-1 h-[60px] max-w-[120px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metricData}>
              <defs>
                <linearGradient
                  id={`gradient-${chartId}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={chartColor}
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#gradient-${chartId})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
