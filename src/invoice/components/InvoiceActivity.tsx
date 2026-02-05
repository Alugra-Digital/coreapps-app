import { History, TrendingUp, ArrowRight, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const activities = [
  {
    event: "Payment Received",
    client: "Bank Mandiri HQ",
    amount: "$12,400.00",
    time: "2 hours ago",
    color: "#10b981",
  },
  {
    event: "Invoice Generated",
    client: "Pertamina Corp",
    amount: "$8,500.00",
    time: "Submited today",
    color: "#3b82f6",
  },
  {
    event: "Overdue Alert",
    client: "Telkomsel Office",
    amount: "$4,200.00",
    time: "3 days ago",
    color: "#ef4444",
  },
];

export function InvoiceActivity({ className }: { className?: string }) {
  return (
    <Card
      className={cn(
        "shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm group hover:shadow-md transition-shadow flex flex-col h-full",
        className,
      )}
    >
      <div className="flex justify-between items-center mb-3 px-1">
        <span className="text-[13px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2 uppercase tracking-wider">
          <History className="h-4 w-4" /> Billing Activity
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-[10px] text-slate-500 hover:text-slate-900 transition-colors"
        >
          View Log
        </Button>
      </div>

      <CardContent className="p-4 bg-white dark:bg-background rounded-sm overflow-hidden border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex flex-col gap-4 flex-1">
        {activities.map((act, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 relative pb-4 last:pb-0 border-b last:border-0 border-slate-50 dark:border-white/5"
          >
            <div
              className="mt-1 h-3 w-3 rounded-full shrink-0 shadow-[0_0_8px_rgba(0,0,0,0.1)]"
              style={{ backgroundColor: act.color }}
            />
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <div className="flex justify-between items-center gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-foreground">
                  {act.event}
                </span>
                <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap">
                  {act.time}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-500">
                <div className="flex items-center gap-1">
                  <span className="truncate">{act.client}</span>
                </div>
                <span>•</span>
                <span className="font-bold text-slate-900 dark:text-foreground">
                  {act.amount}
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-md hover:bg-slate-50 dark:hover:bg-white/5 transition-colors hidden group-hover/row:flex"
            >
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        ))}

        <div className="mt-auto grid grid-cols-2 gap-2 pt-2">
          <div className="flex flex-col gap-1 p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-3 w-3" /> Collected
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-foreground leading-none">
              $24.8k
            </div>
          </div>
          <div className="flex flex-col gap-1 p-2 rounded-lg bg-red-50/50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/10">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-red-600 dark:text-red-400">
              <DollarSign className="h-3 w-3" /> Outstanding
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-foreground leading-none">
              $4.2k
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
