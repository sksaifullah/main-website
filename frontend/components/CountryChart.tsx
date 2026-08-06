"use client";

import React from "react";

interface CountryChartProps {
  topCountries: { country: string; count: number; percentage: number }[];
}

export const CountryChart: React.FC<CountryChartProps> = ({ topCountries }) => {
  return (
    <div className="bg-slate-900/60 border border-slate-700/60 rounded-3xl p-5 space-y-4 shadow-xl">
      <div>
        <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
          <i className="fa-solid fa-globe text-purple-400"></i> Top Destination Countries
        </h4>
        <p className="text-[11px] text-slate-400">Parcel destination distribution</p>
      </div>

      <div className="space-y-3 pt-2">
        {topCountries.map((c) => (
          <div key={c.country} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white">{c.country}</span>
              <span className="font-mono text-slate-400 text-[11px]">
                <strong className="text-white">{c.count}</strong> shipments ({c.percentage}%)
              </span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                style={{ width: `${c.percentage}%` }}
                className="bg-gradient-to-r from-purple-600 to-indigo-400 h-full rounded-full transition-all duration-500"
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountryChart;
