import apiClient, { extractError } from "@/lib/apiClient";
import {
  NotificationItem,
  NotificationCategory,
  NotificationFilterParams,
} from "@/types";

export type { NotificationItem, NotificationCategory, NotificationFilterParams };

/** Maps backend notification (uses `read`) to frontend NotificationItem (uses `is_read`). */
function mapNotification(n: Record<string, unknown>): NotificationItem {
  return {
    id: String(n.id || ""),
    category: (n.type as NotificationCategory) || "system",
    title: String(n.title || ""),
    message: String(n.message || ""),
    link: n.link ? String(n.link) : undefined,
    is_read: Boolean(n.read),
    timestamp: n.created_at
      ? new Date(String(n.created_at)).toLocaleString()
      : "Just now",
  };
}

/**
 * Fetches all notifications from the backend.
 */
export async function getNotifications(): Promise<NotificationItem[]> {
  try {
    const res = await apiClient.get<{
      success: boolean;
      data: Record<string, unknown>[];
    }>("/api/admin/notifications", { params: { _t: Date.now() } });
    return (res.data?.data || []).map(mapNotification);
  } catch (err) {
    console.warn("[notifications] fetch failed:", extractError(err));
    return [];
  }
}

export const fetchNotificationsList = getNotifications;

/**
 * Marks a single notification as read.
 */
export async function markNotificationAsRead(id: string): Promise<boolean> {
  try {
    await apiClient.put(`/api/admin/notifications/${id}/read`);
    return true;
  } catch (err) {
    console.warn("[notifications] markRead failed:", extractError(err));
    return false;
  }
}

/**
 * Marks all notifications as read.
 */
export async function markAllNotificationsAsRead(): Promise<boolean> {
  try {
    await apiClient.put("/api/admin/notifications/mark-all-read");
    return true;
  } catch (err) {
    console.warn("[notifications] markAllRead failed:", extractError(err));
    return false;
  }
}

/**
 * Deletes a single notification.
 */
export async function deleteNotification(id: string): Promise<boolean> {
  try {
    await apiClient.delete(`/api/admin/notifications/${id}`);
    return true;
  } catch (err) {
    console.warn("[notifications] delete failed:", extractError(err));
    return false;
  }
}

export const deleteNotificationItem = deleteNotification;

/**
 * Clears all notifications.
 */
export async function clearAllNotifications(): Promise<boolean> {
  try {
    await apiClient.delete("/api/admin/notifications");
    return true;
  } catch (err) {
    console.warn("[notifications] clearAll failed:", extractError(err));
    return false;
  }
}
