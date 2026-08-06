"use client";

import React from "react";

interface DashboardCardProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  subtitle,
  action,
  children,
  className = "",
}) => {
  return (
    <div
      className={`admin-card bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl space-y-4 max-w-full overflow-hidden ${className}`}
    >
      {(title || subtitle || action) && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-700/60 pb-4">
          <div className="min-w-0">
            {title && (
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xs text-slate-400 mt-0.5 font-medium">{subtitle}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};

export default DashboardCard;
