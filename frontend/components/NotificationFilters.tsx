"use client";

import React from "react";

interface NotificationFiltersProps {
  category: string;
  onCategoryChange: (cat: string) => void;
  status: string;
  onStatusChange: (st: string) => void;
  onMarkAllRead: () => void;
}

export const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  category,
  onCategoryChange,
  status,
  onStatusChange,
  onMarkAllRead,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white font-semibold outline-none focus:border-[#005DC3]"
        >
          <option value="">All Categories</option>
          <option value="shipment">Shipment Alerts</option>
          <option value="customer">Customer &amp; Quote Requests</option>
          <option value="system">System &amp; API Logs</option>
        </select>

        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white font-semibold outline-none focus:border-[#005DC3]"
        >
          <option value="">Read &amp; Unread</option>
          <option value="unread">Unread Only</option>
          <option value="read">Read Only</option>
        </select>
      </div>

      <button
        onClick={onMarkAllRead}
        className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 border border-slate-700 whitespace-nowrap"
      >
        <i className="fa-solid fa-check-double text-emerald-400"></i> Mark All as Read
      </button>
    </div>
  );
};

export default NotificationFilters;
