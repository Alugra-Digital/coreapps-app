import { Calendar, User, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const appointments = [
  {
    id: "SRV-001",
    time: "09:00 AM",
    contact: "Bank Mandiri HQ",
    type: "On-site Audit",
    status: "Confirmed",
    color: "#3b82f6",
  },
  {
    id: "SRV-002",
    time: "01:30 PM",
    contact: "Pertamina Corp",
    type: "Cloud Migration",
    status: "In Progress",
    color: "#f59e0b",
  },
  {
    id: "SRV-003",
    time: "Tomorrow, 11:00 AM",
    contact: "Telkomsel Office",
    type: "Network Setup",
    status: "Scheduled",
    color: "#10b981",
  },
];

export function AppointmentCard({ className }: { className?: string }) {
  return (
    <Card
      className={cn(
        "shadow-sm border-none bg-slate-50/80 dark:bg-card/80 p-3 rounded-sm group hover:shadow-md transition-shadow flex flex-col h-full",
        className,
      )}
    >
      <div className="flex justify-between items-center mb-3 px-1">
        <span className="text-[13px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2 uppercase tracking-wider">
          <Calendar className="h-4 w-4" /> Service Schedule
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-[10px] text-slate-500 hover:text-slate-900 transition-colors"
        >
          View All
        </Button>
      </div>

      <CardContent className="p-4 bg-white dark:bg-background rounded-sm overflow-hidden border border-slate-100 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex flex-col gap-4 flex-1">
        {appointments.map((apt) => (
          <div
            key={apt.id}
            className="flex items-start gap-3 relative pb-4 last:pb-0 border-b last:border-0 border-slate-50 dark:border-white/5"
          >
            <div
              className="mt-1 h-3 w-3 rounded-full shrink-0 shadow-[0_0_8px_rgba(0,0,0,0.1)]"
              style={{ backgroundColor: apt.color }}
            />
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <div className="flex justify-between items-center gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-foreground">
                  {apt.type}
                </span>
                <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap">
                  {apt.time}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-500">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span className="truncate">{apt.contact}</span>
                </div>
                <span>•</span>
                <Badge
                  variant="outline"
                  className="text-[8px] font-bold px-1 py-0 h-4 border-none bg-slate-50 dark:bg-white/5"
                >
                  {apt.status}
                </Badge>
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

        <div className="mt-auto pt-2">
          <Button className="w-full h-8 text-[10px] font-bold bg-slate-900 dark:bg-primary text-white dark:text-primary-foreground hover:opacity-90 transition-all">
            Schedule New Appointment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
