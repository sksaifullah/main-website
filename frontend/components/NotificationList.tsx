"use client";

import React from "react";
import { NotificationItem } from "@/services/notifications";
import NotificationCard from "./NotificationCard";

interface NotificationListProps {
  notifications: NotificationItem[];
  isLoading?: boolean;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  isLoading = false,
  onMarkRead,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="h-20 bg-slate-900/60 rounded-2xl animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 font-semibold space-y-2 bg-slate-900/40 rounded-3xl border border-slate-800">
        <i className="fa-solid fa-bell-slash text-3xl text-slate-600 mb-2 block"></i>
        <p>No notifications found matching your filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((item) => (
        <NotificationCard
          key={item.id}
          notification={item}
          onMarkRead={onMarkRead}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default NotificationList;
