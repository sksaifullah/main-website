import {
  NotificationItem,
  NotificationCategory,
  NotificationFilterParams,
} from "@/types";

export type { NotificationItem, NotificationCategory, NotificationFilterParams };

const NOTIFICATIONS_STORAGE_KEY = "sky_worldwide_notifications_db";

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    category: "shipment",
    title: "New Shipment Created",
    message: "Tracking #SW9821034 created for Raj Enterprises to NYC, USA.",
    link: "/dashboard",
    is_read: false,
    timestamp: "10 mins ago",
  },
  {
    id: "notif-2",
    category: "system",
    title: "FedEx API Token Refreshed",
    message: "OAuth2 bearer token renewed for FedEx Production Environment.",
    is_read: false,
    timestamp: "1 hour ago",
  },
  {
    id: "notif-3",
    category: "inquiry",
    title: "Quote Request Received",
    message: "New quote request from Sunil Kapoor for Pharma Freight to Dubai.",
    link: "/dashboard/messages",
    is_read: true,
    timestamp: "3 hours ago",
  },
  {
    id: "notif-4",
    category: "customer",
    title: "New Customer Registered",
    message: "Desai Pharma Export onboarded with active status.",
    link: "/dashboard/customers",
    is_read: true,
    timestamp: "Yesterday",
  },
];

function getLocalNotifications(): NotificationItem[] {
  if (typeof window === "undefined") return DEFAULT_NOTIFICATIONS;
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Could not read local notifications:", e);
  }
  return DEFAULT_NOTIFICATIONS;
}

function saveLocalNotifications(list: NotificationItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn("Could not save local notifications:", e);
  }
}

/**
 * Fetches all notifications.
 */
export async function getNotifications(): Promise<NotificationItem[]> {
  return getLocalNotifications();
}
export const fetchNotificationsList = getNotifications;

/**
 * Marks a notification as read.
 */
export async function markNotificationAsRead(id: string): Promise<boolean> {
  const current = getLocalNotifications();
  const idx = current.findIndex((n) => n.id === id);
  if (idx !== -1) {
    current[idx].is_read = true;
    saveLocalNotifications(current);
    return true;
  }
  return false;
}

/**
 * Marks all notifications as read.
 */
export async function markAllNotificationsAsRead(): Promise<boolean> {
  const current = getLocalNotifications();
  const updated = current.map((n) => ({ ...n, is_read: true }));
  saveLocalNotifications(updated);
  return true;
}

/**
 * Clears/Deletes a notification.
 */
export async function deleteNotification(id: string): Promise<boolean> {
  const current = getLocalNotifications();
  const filtered = current.filter((n) => n.id !== id);
  saveLocalNotifications(filtered);
  return true;
}
export const deleteNotificationItem = deleteNotification;

/**
 * Clears all notifications.
 */
export async function clearAllNotifications(): Promise<boolean> {
  saveLocalNotifications([]);
  return true;
}
