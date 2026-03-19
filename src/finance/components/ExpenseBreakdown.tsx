import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import { PieChart as PieChartIcon, MoreHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ExpenseBreakdownItem } from "@/api/finance";

export function ExpenseBreakdown({
  className,
  data,
}: {
  className?: string;
  data?: ExpenseBreakdownItem[] | null;
}) {
  const expenseData = data && data.length > 0 ? data : [];
  const hasData = expenseData.length > 0;
  return (
    <Card
      className={cn(
        "shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm group hover:shadow-md transition-shadow flex flex-col",
        className,
      )}
    >
      <div className="flex justify-between items-center px-2">
        <span className="text-[13px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2 uppercase tracking-wider">
          <PieChartIcon className="h-4 w-4" /> Expense Breakdown
        </span>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      <CardContent className="p-6 bg-white dark:bg-background rounded-sm overflow-hidden border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex flex-col gap-6 flex-1">
        <div className="h-[200px] w-full relative">
          {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {expenseData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="none"
                  />
                ))}
              </Pie>
              <RechartsTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-medium shadow-xl border-none">
                        {payload[0].name}: {payload[0].value}%
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm">
              No expense data available
            </div>
          )}
          {hasData && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-slate-900 dark:text-foreground">
              100%
            </span>
            <span className="text-[10px] text-slate-400 dark:text-muted-foreground uppercase font-medium">
              Breakdown
            </span>
          </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-2">
          {expenseData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[11px] text-slate-600 dark:text-slate-300 font-medium truncate">
                {item.name}
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 ml-auto">
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
