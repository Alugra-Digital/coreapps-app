import { Bell, Check, CheckCheck } from "lucide-react";
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { PageLoader } from "@/components/ui/PageLoader";
import { toast } from "sonner";

export default function NotificationsPage() {
  const { data: notifications = [], isLoading, error } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="flex flex-col gap-4 p-4 max-w-[900px] mx-auto bg-white dark:bg-[#111111] min-h-screen transition-colors">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-slate-900 dark:text-foreground">
            <Bell className="h-8 w-8" />
            Notifications
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllRead.mutate(undefined, {
              onSuccess: () => toast.success("All notifications marked as read"),
              onError: () => toast.error("Failed to mark notifications as read")
            })}
            disabled={markAllRead.isPending}
            className="gap-2"
          >
            <CheckCheck className="h-4 w-4" /> Mark all as read
          </Button>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {String((error as { message?: string }).message ?? "Failed to load notifications")}
        </div>
      )}

      {isLoading ? (
        <PageLoader />
      ) : notifications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-slate-500">
            No notifications yet.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-200 dark:divide-white/10">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-4 p-4 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors ${n.unread ? "bg-primary/5 dark:bg-primary/10" : ""
                    }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className={`font-medium ${n.unread ? "text-slate-900 dark:text-foreground" : "text-slate-600 dark:text-slate-400"}`}>
                        {n.title ?? "Notification"}
                      </h3>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-slate-400">
                          {n.createdAt ? formatDistanceToNow(new Date(n.createdAt), { addSuffix: true }) : n.time ?? "—"}
                        </span>
                        {n.unread && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={() => markRead.mutate(n.id, {
                              onSuccess: () => toast.success("Notification marked as read"),
                              onError: () => toast.error("Failed to mark notification as read")
                            })}
                            disabled={markRead.isPending}
                          >
                            <Check className="h-3 w-3 mr-1" /> Mark read
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {n.description ?? n.message ?? ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
