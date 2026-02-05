import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SalesMetricCardProps {
  title: string;
  value: string;
  change: string;
  trend?: "up" | "down";
  progress?: number;
  icon: React.ReactNode;
}

export function SalesMetricCard({
  title,
  value,
  change,
  trend,
  progress,
  icon,
}: SalesMetricCardProps) {
  const isUp = trend === "up";

  return (
    <Card className="shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm group hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-2 px-1">
        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none">
          {title}
        </span>
        <div className="h-8 w-8 rounded-lg bg-white dark:bg-background border border-slate-100 dark:border-white/5 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors shadow-sm">
          {icon}
        </div>
      </div>
      <CardContent className="p-4 bg-white dark:bg-background rounded-sm border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-foreground leading-none mb-1">
              {value}
            </h2>
            <div
              className={cn(
                "text-[10px] font-bold flex items-center gap-1 mt-1",
                progress
                  ? "text-indigo-500"
                  : isUp
                    ? "text-emerald-500"
                    : "text-rose-500",
              )}
            >
              {progress ? null : isUp ? "↑" : "↓"} {change}
              <span className="text-slate-400 font-normal ml-1 text-[9px]">
                vs last period
              </span>
            </div>
          </div>
          {progress && (
            <div className="w-16 h-1 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden mb-1">
              <div
                className="h-full bg-indigo-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
