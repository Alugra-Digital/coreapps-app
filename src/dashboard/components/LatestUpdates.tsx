import { useState } from "react";
import {
  MoreHorizontal,
  Search,
  FileText,
  ClipboardCheck,
  Building2,
  TrendingUp,
  PackageCheck,
  CreditCard,
  Briefcase,
  AlertTriangle,
  Settings,
  ShieldCheck,
  BarChart3,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TabType = "Today" | "Yesterday" | "This week";

const activitiesData: Record<TabType, any[]> = {
  Today: [
    {
      id: 1,
      type: "Invoice Generated",
      details: "INV-2024-001 for PT. Alpha Indonesia",
      time: "11:20 AM",
      icon: <FileText className="h-4 w-4 text-blue-500" />,
    },
    {
      id: 2,
      type: "PO Approved",
      details: "Purchase Order #992 (Office Supplies)",
      time: "11:15 AM",
      icon: <ClipboardCheck className="h-4 w-4 text-emerald-500" />,
    },
    {
      id: 3,
      type: "New Vendor",
      details: "Global Logistics registered as vendor",
      time: "11:00 AM",
      icon: <Building2 className="h-4 w-4 text-indigo-500" />,
    },
    {
      id: 4,
      type: "Revenue Projection",
      details: "Q1 financial forecast updated (+5%)",
      time: "10:45 AM",
      icon: <TrendingUp className="h-4 w-4 text-sky-500" />,
    },
    {
      id: 5,
      type: "Stock Restock",
      details: "Inventory 'Metal Sheets' restocked (+500kg)",
      time: "10:30 AM",
      icon: <PackageCheck className="h-4 w-4 text-amber-500" />,
    },
    {
      id: 6,
      type: "Billable Utilization",
      details: "Billable Utilization updated (+500kg)",
      time: "10:30 AM",
      icon: <BarChart3 className="h-4 w-4 text-slate-500" />,
    },
  ],
  Yesterday: [
    {
      id: 6,
      type: "Payroll Processed",
      details: "January payroll disbursed to 84 employees",
      time: "04:30 PM",
      icon: <CreditCard className="h-4 w-4 text-purple-500" />,
    },
    {
      id: 7,
      type: "New Work Order",
      details: "WO-2024-012 for Facility Maintenance",
      time: "02:15 PM",
      icon: <Briefcase className="h-4 w-4 text-slate-500" />,
    },
    {
      id: 8,
      type: "Compliance Alert",
      details: "Monthly tax report needs review",
      time: "11:00 AM",
      icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
    },
  ],
  "This week": [
    {
      id: 9,
      type: "System Migration",
      details: "Accounting module migrated to v4.5",
      time: "Jan 28",
      icon: <Settings className="h-4 w-4 text-slate-600" />,
    },
    {
      id: 10,
      type: "Audit Completed",
      details: "External audit for ISO-9001 passed",
      time: "Jan 26",
      icon: <ShieldCheck className="h-4 w-4 text-green-600" />,
    },
  ],
};

export function LatestUpdates({ className }: { className?: string }) {
  const [activeTab, setActiveTab] = useState<TabType>("Today");
  const activities = activitiesData[activeTab];

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
        <div className="flex p-0.5 bg-slate-100 dark:bg-white/5 rounded-lg">
          {(Object.keys(activitiesData) as TabType[]).map((tab) => (
            <Button
              key={tab}
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 text-xs font-medium h-7 rounded-md transition-all",
                activeTab === tab
                  ? "shadow-sm bg-white dark:bg-white/10 text-slate-900 dark:text-foreground"
                  : "text-muted-foreground hover:bg-slate-200/50 dark:hover:bg-white/5",
              )}
            >
              {tab}
            </Button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            placeholder="Search activities"
            className="w-full bg-slate-50 dark:bg-white/5 border-none rounded-lg py-2 pl-9 pr-4 text-xs focus:ring-1 focus:ring-slate-200 dark:focus:ring-white/10 outline-none text-foreground"
          />
        </div>

        <div className="flex flex-col gap-6 mt-2 flex-1 overflow-hidden min-h-0">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            {activities.length} new activities {activeTab.toLowerCase()}
          </span>
          <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex gap-4 group/item cursor-pointer"
              >
                <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 group-hover/item:bg-white dark:group-hover/item:bg-white/10 group-hover/item:shadow-sm transition-all">
                  {activity.icon}
                </div>
                <div className="mt-1 flex flex-col gap-0.5 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                      {activity.type}
                    </span>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {activity.time}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {activity.details}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
