"use client";

import React from "react";

export type ConnectionStatus =
  | "connected"
  | "testing"
  | "error"
  | "disabled"
  | "waiting";

interface SyncStatusBadgeProps {
  status: ConnectionStatus;
  customLabel?: string;
  size?: "sm" | "md";
}

export const SyncStatusBadge: React.FC<SyncStatusBadgeProps> = ({
  status,
  customLabel,
  size = "md",
}) => {
  const getBadgeStyle = (st: ConnectionStatus) => {
    switch (st) {
      case "connected":
        return {
          bg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
          dot: "bg-emerald-400 animate-pulse",
          label: "Live Connected",
        };
      case "testing":
        return {
          bg: "bg-blue-500/20 text-blue-300 border-blue-500/40",
          dot: "bg-blue-400 animate-ping",
          label: "Verifying Token...",
        };
      case "error":
        return {
          bg: "bg-red-500/20 text-red-300 border-red-500/40",
          dot: "bg-red-500",
          label: "Auth Failed",
        };
      case "disabled":
        return {
          bg: "bg-slate-700/50 text-slate-400 border-slate-600",
          dot: "bg-slate-500",
          label: "Disabled",
        };
      case "waiting":
      default:
        return {
          bg: "bg-amber-500/20 text-amber-300 border-amber-500/40",
          dot: "bg-amber-400",
          label: "Waiting Verification",
        };
    }
  };

  const style = getBadgeStyle(status);
  const textLabel = customLabel || style.label;
  const paddingClass = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-extrabold border ${style.bg} ${paddingClass}`}
    >
      <span className={`w-2 h-2 rounded-full ${style.dot}`}></span>
      {textLabel}
    </span>
  );
};

export default SyncStatusBadge;
