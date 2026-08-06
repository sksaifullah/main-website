"use client";

import React from "react";

export type StatColor = "blue" | "emerald" | "amber" | "red" | "purple";

interface StatisticsCardProps {
  title: string;
  value: number | string;
  icon?: string;
  color?: StatColor;
  trend?: string;
  isLoading?: boolean;
}

export const StatisticsCard: React.FC<StatisticsCardProps> = ({
  title,
  value,
  icon,
  color = "blue",
  isLoading = false,
}) => {
  const getColorClasses = (c: StatColor) => {
    switch (c) {
      case "emerald":
        return "text-emerald-400 border-emerald-500/30 bg-emerald-950/20";
      case "amber":
        return "text-amber-400 border-amber-500/30 bg-amber-950/20";
      case "red":
        return "text-red-400 border-red-500/30 bg-red-950/20";
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

export default StatisticsCard;
