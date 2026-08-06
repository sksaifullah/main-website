export type NotificationCategory =
  | "system"
  | "shipment"
  | "customer"
  | "inquiry"
  | "billing"
  | "security";

export interface NotificationItem {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  link?: string;
  is_read: boolean;
  timestamp: string;
}

export interface NotificationFilterParams {
  category?: NotificationCategory | "all";
  unreadOnly?: boolean;
}
