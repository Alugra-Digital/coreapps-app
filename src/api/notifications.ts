/**
 * Notifications API (CoreApps 2.0).
 * GET /api/notifications, PATCH /api/notifications/:id/read, PATCH /api/notifications/read-all
 */

import { api } from "@/lib/api/client";

export interface NotificationItem {
  id: number;
  title: string | null;
  description?: string | null;
  message?: string | null;
  time?: string;
  createdAt?: string | null;
  type: string;
  unread: boolean;
  isRead?: boolean;
  link?: string | null;
}

export interface NotificationsResponse {
  success?: boolean;
  data: NotificationItem[];
}

export async function getNotifications(): Promise<NotificationItem[]> {
  const res = await api.get<NotificationsResponse>("/api/notifications");
  return (res as NotificationsResponse)?.data ?? [];
}

export async function markNotificationRead(id: number): Promise<void> {
  await api.patch<{ success?: boolean }>(`/api/notifications/${id}/read`, {});
}

export async function markAllNotificationsRead(): Promise<void> {
  await api.patch<{ success?: boolean }>("/api/notifications/read-all", {});
}
