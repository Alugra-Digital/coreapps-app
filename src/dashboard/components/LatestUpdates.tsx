import { useState } from "react";
import {
  MoreHorizontal,
  Search,
  FileText,
  ClipboardCheck,
  FileBarChart,
  Package,
  Briefcase,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DashboardActivity } from "@/api/dashboard";

function getActivityIcon(_type: string, entityType: DashboardActivity["entityType"]) {
  const color = {
    invoice: "text-blue-500",
    purchase_order: "text-emerald-500",
    proposal: "text-indigo-500",
    bast: "text-amber-500",
    project: "text-slate-500",
  }[entityType];
  switch (entityType) {
    case "invoice":
      return <FileText className={cn("h-4 w-4", color)} />;
    case "purchase_order":
      return <ClipboardCheck className={cn("h-4 w-4", color)} />;
    case "proposal":
      return <FileBarChart className={cn("h-4 w-4", color)} />;
    case "bast":
      return <Package className={cn("h-4 w-4", color)} />;
    case "project":
      return <Briefcase className={cn("h-4 w-4", color)} />;
    default:
      return <FileText className={cn("h-4 w-4", color)} />;
  }
}

function formatActivityTime(timestamp: string): string {
  const d = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

interface LatestUpdatesProps {
  activities: DashboardActivity[];
  className?: string;
}

export function LatestUpdates({ activities, className }: LatestUpdatesProps) {
  const [search, setSearch] = useState("");

  const filtered = activities.filter(
    (a) =>
      (a.type ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (a.details ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card
      className={cn(
        "shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm group hover:shadow-md transition-shadow flex flex-col",
        className,
      )}
    >
      <div className="flex justify-between items-center px-2">
        <span className="text-[13px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2 uppercase tracking-wider">
          Latest Updates
        </span>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      <CardContent className="p-6 bg-white dark:bg-background rounded-sm overflow-hidden border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex flex-col gap-4 flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            placeholder="Search activities"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-white/5 border-none rounded-lg py-2 pl-9 pr-4 text-xs focus:ring-1 focus:ring-slate-200 dark:focus:ring-white/10 outline-none text-foreground"
          />
        </div>

        <div className="flex flex-col gap-6 mt-2 flex-1 overflow-hidden min-h-0">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            {filtered.length} recent activities
          </span>
          <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
            {filtered.length === 0 ? (
              <p className="text-xs text-slate-500 py-4">No activities yet</p>
            ) : (
              filtered.map((activity) => (
                <div
                  key={activity.id}
                  className="flex gap-4 group/item cursor-pointer"
                >
                  <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 group-hover/item:bg-white dark:group-hover/item:bg-white/10 group-hover/item:shadow-sm transition-all">
                    {getActivityIcon(activity.type, activity.entityType)}
                  </div>
                  <div className="mt-1 flex flex-col gap-0.5 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                        {activity.type}
                      </span>
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {formatActivityTime(activity.timestamp)}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {activity.details}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
