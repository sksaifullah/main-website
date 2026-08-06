"use client";

import React, { useState } from "react";
import Link from "next/link";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "info" | "warning" | "success" | "error";
  read: boolean;
}

export const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "1",
      title: "Carrier API Sync Active",
      message: "Aramex and DHL Express endpoints are live.",
      time: "5m ago",
      type: "success",
      read: false,
    },
    {
      id: "2",
      title: "New Quote Request Received",
      message: "Quote requested for 15kg Express parcel to UK.",
      time: "20m ago",
      type: "info",
      read: false,
    },
    {
      id: "3",
      title: "System Backup Verified",
      message: "Disk database snapshot saved successfully.",
      time: "1h ago",
      type: "info",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition"
        title="Notifications"
      >
        <i className="fa-solid fa-bell text-sm"></i>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-extrabold flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl z-50 overflow-hidden text-xs">
          <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
            <span className="font-extrabold text-white">System Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[10px] text-blue-400 hover:text-blue-300 font-bold"
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="divide-y divide-slate-800 max-h-64 overflow-y-auto">
            {notifications.map((item) => (
              <div
                key={item.id}
                className={`p-3 hover:bg-slate-800/50 transition ${
                  !item.read ? "bg-blue-950/20" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white">{item.title}</span>
                  <span className="text-[10px] text-slate-500">{item.time}</span>
                </div>
                <p className="text-slate-400 text-[11px]">{item.message}</p>
              </div>
            ))}
          </div>
          <div className="p-2.5 border-t border-slate-800 text-center bg-slate-950/60">
            <Link
              href="/dashboard/notifications"
              onClick={() => setIsOpen(false)}
              className="text-[11px] font-bold text-[#005DC3] hover:underline block"
            >
              View All Notifications Center →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
