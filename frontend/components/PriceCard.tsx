"use client";

import React from "react";

export type PriceCardColor = "blue" | "emerald" | "amber" | "purple";

interface PriceCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  icon?: string;
  color?: PriceCardColor;
  isLoading?: boolean;
}

export const PriceCard: React.FC<PriceCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = "blue",
  isLoading = false,
}) => {
  const getColorClasses = (c: PriceCardColor) => {
    switch (c) {
      case "emerald":
        return "text-emerald-400 border-emerald-500/30 bg-emerald-950/20";
      case "amber":
        return "text-amber-400 border-amber-500/30 bg-amber-950/20";
      case "purple":
        return "text-purple-400 border-purple-500/30 bg-purple-950/20";
      case "blue":
      default:
        return "text-blue-400 border-blue-500/30 bg-blue-950/20";
    }
  };

  return (
    <div className="admin-card bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {title}
        </p>
        {isLoading ? (
          <div className="h-8 w-20 bg-slate-700/60 animate-pulse rounded-lg mt-1"></div>
        ) : (
          <h3 className={`text-2xl font-extrabold mt-1 ${getColorClasses(color).split(" ")[0]}`}>
            {value}
          </h3>
        )}
        {subtitle && <p className="text-[11px] text-slate-400">{subtitle}</p>}
      </div>

      {icon && (
        <div
          className={`w-12 h-12 rounded-xl border flex items-center justify-center text-lg ${getColorClasses(
            color
          )}`}
        >
          <i className={`fa-solid ${icon}`}></i>
        </div>
      )}
    </div>
  );
};

export default PriceCard;
