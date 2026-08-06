"use client";

import React from "react";

interface CourierChartProps {
  topCouriers: { courier: string; count: number; percentage: number }[];
}

export const CourierChart: React.FC<CourierChartProps> = ({ topCouriers }) => {
  const getCourierColor = (idx: number) => {
    switch (idx) {
      case 0:
        return "from-purple-600 to-pink-500 text-purple-400";
      case 1:
        return "from-amber-500 to-yellow-400 text-amber-400";
      case 2:
        return "from-blue-600 to-cyan-400 text-blue-400";
      case 3:
      default:
        return "from-red-600 to-orange-400 text-red-400";
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-700/60 rounded-3xl p-5 space-y-4 shadow-xl">
      <div>
        <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
          <i className="fa-solid fa-plug-circle-bolt text-amber-400"></i> Courier Partner Share
        </h4>
        <p className="text-[11px] text-slate-400">Volume routed through integration APIs</p>
      </div>

      <div className="space-y-3 pt-2">
        {topCouriers.map((cr, idx) => (
          <div key={cr.courier} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white">{cr.courier}</span>
              <span className="font-mono text-slate-400 text-[11px]">
                <strong className="text-white">{cr.count}</strong> ({cr.percentage}%)
              </span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                style={{ width: `${cr.percentage}%` }}
                className={`bg-gradient-to-r ${getCourierColor(idx).split(" ")[0]} ${getCourierColor(idx).split(" ")[1]} h-full rounded-full transition-all duration-500`}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourierChart;
