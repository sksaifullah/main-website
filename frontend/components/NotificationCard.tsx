"use client";

import React from "react";
import Link from "next/link";
import { NotificationItem } from "@/services/notifications";

interface NotificationCardProps {
  notification: NotificationItem;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onMarkRead,
  onDelete,
}) => {
  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "shipment":
        return "fa-truck-fast text-blue-400 bg-blue-950/60 border-blue-800/60";
      case "customer":
        return "fa-user-clock text-amber-400 bg-amber-950/60 border-amber-800/60";
      case "system":
      default:
        return "fa-sliders text-purple-400 bg-purple-950/60 border-purple-800/60";
    }
  };

  return (
    <div
      className={`p-4 rounded-2xl border transition flex items-start justify-between gap-4 ${
        notification.is_read
          ? "bg-slate-900/40 border-slate-800 text-slate-400 opacity-80"
          : "bg-slate-900/90 border-slate-700 text-slate-200 shadow-lg ring-1 ring-[#005DC3]/30"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-9 h-9 rounded-xl border flex items-center justify-center text-xs shrink-0 ${getCategoryIcon(
            notification.category
          )}`}
        >
          <i className={`fa-solid ${getCategoryIcon(notification.category).split(" ")[0]}`}></i>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-extrabold text-white text-xs">{notification.title}</h4>
            {!notification.is_read && (
              <span className="w-2 h-2 rounded-full bg-[#005DC3] animate-pulse"></span>
            )}
          </div>
          <p className="text-xs text-slate-300">{notification.message}</p>
          <div className="flex items-center gap-3 pt-1">
            <span className="text-[10px] font-mono text-slate-400">{notification.timestamp}</span>
            {notification.link && (
              <Link
                href={notification.link}
                className="text-[11px] font-bold text-[#005DC3] hover:underline"
              >
                View Details →
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {!notification.is_read && (
          <button
            onClick={() => onMarkRead(notification.id)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Mark as Read"
          >
            <i className="fa-solid fa-check text-xs"></i>
          </button>
        )}
        <button
          onClick={() => onDelete(notification.id)}
          className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-400 transition"
          title="Delete Notification"
        >
          <i className="fa-solid fa-trash text-xs"></i>
        </button>
      </div>
    </div>
  );
};

export default NotificationCard;
