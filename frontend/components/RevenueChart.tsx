"use client";

import React from "react";

interface RevenueChartProps {
  monthlyData: { month: string; revenue: number }[];
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ monthlyData }) => {
  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue)) || 40000;

  return (
    <div className="bg-slate-900/60 border border-slate-700/60 rounded-3xl p-5 space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
            <i className="fa-solid fa-chart-column text-emerald-400"></i> Monthly Revenue Growth ($)
          </h4>
          <p className="text-[11px] text-slate-400">Gross courier revenue performance</p>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/40">
          +18.4% YoY
        </span>
      </div>

      <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-slate-800">
        {monthlyData.map((item) => {
          const heightPercent = Math.round((item.revenue / maxRevenue) * 100);
          return (
            <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
              <div
                style={{ height: `${heightPercent}%` }}
                className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-lg group-hover:from-emerald-500 group-hover:to-emerald-300 transition-all relative"
              >
                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-950 text-emerald-300 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border border-slate-700 pointer-events-none transition whitespace-nowrap shadow-xl">
                  ${item.revenue.toLocaleString()}
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 font-mono">{item.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RevenueChart;
