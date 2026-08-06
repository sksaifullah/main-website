"use client";

import React from "react";

interface ShipmentChartProps {
  dailyData: { date: string; shipments: number }[];
}

export const ShipmentChart: React.FC<ShipmentChartProps> = ({ dailyData }) => {
  const maxShipments = Math.max(...dailyData.map((d) => d.shipments)) || 40;

  return (
    <div className="bg-slate-900/60 border border-slate-700/60 rounded-3xl p-5 space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
            <i className="fa-solid fa-chart-line text-[#005DC3]"></i> Weekly Shipment Volume Trend
          </h4>
          <p className="text-[11px] text-slate-400">Daily express parcel count</p>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 font-bold text-[10px] border border-blue-500/40">
          Peak Wed (31)
        </span>
      </div>

      <div className="h-44 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-800">
        {dailyData.map((item) => {
          const heightPercent = Math.round((item.shipments / maxShipments) * 100);
          return (
            <div key={item.date} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
              <div
                style={{ height: `${heightPercent}%` }}
                className="w-full bg-gradient-to-t from-[#005DC3] to-blue-400 rounded-t-lg group-hover:from-blue-600 group-hover:to-blue-300 transition-all relative"
              >
                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-950 text-blue-300 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border border-slate-700 pointer-events-none transition whitespace-nowrap shadow-xl">
                  {item.shipments} pkgs
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 font-mono">{item.date}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShipmentChart;
