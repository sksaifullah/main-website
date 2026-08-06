"use client";

import React from "react";
import { ItemStatus } from "@/services/messages";

interface StatusBadgeProps {
  status: ItemStatus;
  size?: "sm" | "md";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = "sm",
}) => {
  const getBadgeClass = (st: ItemStatus) => {
    switch (st) {
      case "Replied":
      case "Resolved":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
      case "Pending":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40";
      case "Archived":
      default:
        return "bg-slate-700/50 text-slate-400 border-slate-600";
    }
  };

  const getIcon = (st: ItemStatus) => {
    switch (st) {
      case "Replied":
        return "fa-reply";
      case "Resolved":
        return "fa-circle-check";
      case "Pending":
        return "fa-clock";
      case "Archived":
      default:
        return "fa-box-archive";
    }
  };

  const textSizeClass = size === "md" ? "text-xs px-3 py-1" : "text-[10px] px-2.5 py-0.5";

  return (
    <span
      className={`rounded-full font-extrabold border inline-flex items-center gap-1.5 ${textSizeClass} ${getBadgeClass(
        status
      )}`}
    >
      <i className={`fa-solid ${getIcon(status)} text-[10px]`}></i>
      {status}
    </span>
  );
};

export default StatusBadge;
