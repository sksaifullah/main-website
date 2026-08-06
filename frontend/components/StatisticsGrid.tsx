"use client";

import React from "react";

interface StatisticsGridProps {
  deliveredRate?: string;
  avgDeliveryTime?: string;
  activeRateZones?: number;
  apiSuccessRate?: string;
}

export const StatisticsGrid: React.FC<StatisticsGridProps> = ({
  deliveredRate = "94.2%",
  avgDeliveryTime = "3.8 Days",
  activeRateZones = 5,
  apiSuccessRate = "99.9%",
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <div className="bg-slate-900/60 border border-slate-700/60 p-4 rounded-2xl text-center space-y-1">
        <p className="text-[10px] uppercase font-bold text-slate-400">On-Time Delivery</p>
        <p className="text-xl font-extrabold text-emerald-400 font-mono">{deliveredRate}</p>
      </div>
      <div className="bg-slate-900/60 border border-slate-700/60 p-4 rounded-2xl text-center space-y-1">
        <p className="text-[10px] uppercase font-bold text-slate-400">Avg Lead Time</p>
        <p className="text-xl font-extrabold text-blue-400 font-mono">{avgDeliveryTime}</p>
      </div>
      <div className="bg-slate-900/60 border border-slate-700/60 p-4 rounded-2xl text-center space-y-1">
        <p className="text-[10px] uppercase font-bold text-slate-400">Global Rate Zones</p>
        <p className="text-xl font-extrabold text-purple-400 font-mono">{activeRateZones} Zones</p>
      </div>
      <div className="bg-slate-900/60 border border-slate-700/60 p-4 rounded-2xl text-center space-y-1">
        <p className="text-[10px] uppercase font-bold text-slate-400">Carrier API Uptime</p>
        <p className="text-xl font-extrabold text-amber-400 font-mono">{apiSuccessRate}</p>
      </div>
    </div>
  );
};

export default StatisticsGrid;
