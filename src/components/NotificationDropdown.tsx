import {
  Bell,
  Package,
  CreditCard,
  UserPlus,
  Info,
  MoreHorizontal,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const notifications = [
  {
    id: 1,
    title: "New Payment Received",
    description: "Transaction #INV-2024-001 has been processed successfully.",
    time: "2 mins ago",
    type: "payment",
    unread: true,
    icon: <CreditCard className="h-4 w-4 text-emerald-500" />,
    color: "bg-emerald-50 dark:bg-emerald-500/10",
  },
  {
    id: 2,
    title: "Low Inventory Alert",
    description:
      "Item 'MacBook Pro M3' is below the safety threshold (5 units left).",
    time: "45 mins ago",
    type: "inventory",
    unread: true,
    icon: <Package className="h-4 w-4 text-amber-500" />,
    color: "bg-amber-50 dark:bg-amber-500/10",
  },
  {
    id: 3,
    title: "New Agent Onboarded",
    description: "Sarah Jenkins has joined the Support Team.",
    time: "5 hours ago",
    type: "user",
    unread: false,
    icon: <UserPlus className="h-4 w-4 text-indigo-500" />,
    color: "bg-indigo-50 dark:bg-indigo-500/10",
  },
  {
    id: 4,
    title: "System Maintenance",
    description: "Scheduled update tonight at 02:00 AM WIB.",
    time: "12 hours ago",
    type: "info",
    unread: false,
    icon: <Info className="h-4 w-4 text-slate-500" />,
    color: "bg-slate-50 dark:bg-slate-500/10",
  },
];

export function NotificationDropdown() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:bg-slate-100 dark:hover:bg-white/5 transition-colors rounded-xl h-10 w-10 group"
        >
          <Bell className="h-5 w-5 group-hover:scale-110 transition-transform" />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-destructive border-2 border-white dark:border-[#111111]" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[380px] p-0 bg-white dark:bg-[#111111] border-slate-200 dark:border-white/10 shadow-2xl rounded-2xl overflow-hidden mt-2"
        align="end"
      >
        <div className="p-4 flex items-center justify-between bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/5">
          <div className="flex items-center gap-2">
            <h3 className="font-black text-sm text-slate-900 dark:text-foreground uppercase tracking-widest">
              Notifications
            </h3>
            <Badge className="bg-primary/10 text-primary border-none text-[10px] font-bold h-5 px-1.5">
              2 New
            </Badge>
          </div>
          <Button
            variant="link"
            className="text-[10px] font-bold text-primary p-0 h-auto hover:no-underline"
          >
            Mark all as read
          </Button>
        </div>

        <div className="max-h-[400px] overflow-y-auto py-1 custom-scrollbar">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                "group relative flex items-start gap-4 p-4 transition-all hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer border-b border-transparent last:border-none",
                notification.unread &&
                  "before:absolute before:left-0 before:top-4 before:bottom-4 before:w-[3px] before:bg-primary before:rounded-r-full",
              )}
            >
              <div
                className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border border-transparent shadow-sm",
                  notification.color,
                )}
              >
                {notification.icon}
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <div className="flex justify-between items-start gap-2">
                  <h4
                    className={cn(
                      "text-xs font-bold leading-none",
                      notification.unread
                        ? "text-slate-900 dark:text-foreground"
                        : "text-slate-500 dark:text-slate-400",
                    )}
                  >
                    {notification.title}
                  </h4>
                  <span className="text-[9px] font-medium text-slate-400 whitespace-nowrap">
                    {notification.time}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {notification.description}
                </p>
              </div>
              {notification.unread && (
                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              )}
            </div>
          ))}
        </div>

        <Separator className="bg-slate-200 dark:bg-white/5" />
        <div className="p-2">
          <Button
            variant="ghost"
            className="w-full h-10 text-[11px] font-bold text-slate-500 hover:text-primary dark:hover:text-primary transition-all rounded-xl group uppercase tracking-widest"
          >
            View All Alerts{" "}
            <MoreHorizontal className="h-3 w-3 ml-2 opacity-50 group-hover:opacity-100 transition-opacity" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
