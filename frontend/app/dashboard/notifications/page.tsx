"use client";

import React, { useEffect, useState } from "react";
import NotificationList from "@/components/NotificationList";
import NotificationFilters from "@/components/NotificationFilters";
import {
  NotificationItem,
  fetchNotificationsList,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotificationItem,
} from "@/services/notifications";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    let isMounted = true;
    fetchNotificationsList()
      .then((res) => {
        if (isMounted) {
          setNotifications(res);
          setIsLoading(false);
        }
      })
      .catch((e) => {
        console.error("Failed to load notifications:", e);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleMarkRead = async (id: string) => {
    await markNotificationAsRead(id);
    const refreshed = await fetchNotificationsList();
    setNotifications(refreshed);
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead();
    const refreshed = await fetchNotificationsList();
    setNotifications(refreshed);
  };

  const handleDelete = async (id: string) => {
    await deleteNotificationItem(id);
    const refreshed = await fetchNotificationsList();
    setNotifications(refreshed);
  };

  const filtered = notifications.filter((item) => {
    if (categoryFilter && item.category !== categoryFilter) return false;
    if (statusFilter === "unread" && item.is_read) return false;
    if (statusFilter === "read" && !item.is_read) return false;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Notifications &amp; Activity Alerts Center
            </h2>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#005DC3] text-white font-extrabold text-xs shadow-lg animate-pulse">
                {unreadCount} New
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            System logs, tracking updates, customs hold alerts, and customer quote notifications.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="admin-card bg-slate-800/80 border border-slate-700/80 rounded-3xl p-4 sm:p-6 lg:p-8 space-y-6 max-w-full overflow-hidden shadow-2xl">
        {/* Filters Toolbar */}
        <NotificationFilters
          category={categoryFilter}
          onCategoryChange={setCategoryFilter}
          status={statusFilter}
          onStatusChange={setStatusFilter}
          onMarkAllRead={handleMarkAllRead}
        />

        {/* List */}
        <NotificationList
          notifications={filtered}
          isLoading={isLoading}
          onMarkRead={handleMarkRead}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
