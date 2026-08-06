"use client";

import React from "react";
import { ShipmentDetailsData } from "../../types/tracking";

interface ShipmentProgressProps {
  data: ShipmentDetailsData;
}

export const ShipmentProgress: React.FC<ShipmentProgressProps> = ({ data }) => {
  const isDelivered =
    data.status_code === "DELIVERED" || (data.status || "").toLowerCase() === "delivered";
  const isOut =
    data.status_code === "OUT_FOR_DELIVERY" ||
    (data.status || "").toLowerCase().includes("out for delivery");
  const isWaiting = data.status_code === "WAITING";

  const pct =
    data.progress_percent !== undefined
      ? data.progress_percent
      : isDelivered
      ? 100
      : isOut
      ? 85
      : isWaiting
      ? 15
      : 50;

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-md mb-8">
      <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-200 mb-2">
        <span className="text-sm font-bold text-slate-900 dark:text-white">
          <i className="fa-solid fa-bars-progress text-[#005DC3] mr-2"></i> Shipment Progress
        </span>
        <span className="text-[#005DC3] dark:text-sky-400 font-extrabold text-sm">
          {pct}% Completed
        </span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-700 h-3.5 rounded-full overflow-hidden p-0.5 mb-5">
        <div
          className="bg-[#005DC3] h-full rounded-full transition-all duration-1000 shadow-sm"
          style={{ width: `${pct}%` }}
        ></div>
      </div>
      <div className="grid grid-cols-4 text-center gap-2 text-[11px] sm:text-xs font-semibold">
        <div className={pct >= 20 ? "text-[#005DC3] dark:text-sky-400 font-bold" : "text-slate-400"}>
          <i className="fa-solid fa-circle-check text-sm block mb-1"></i> Booked
        </div>
        <div className={pct >= 40 ? "text-[#005DC3] dark:text-sky-400 font-bold" : "text-slate-400"}>
          <i className="fa-solid fa-box text-sm block mb-1"></i> Picked Up
        </div>
        <div className={pct >= 70 ? "text-[#005DC3] dark:text-sky-400 font-bold" : "text-slate-400"}>
          <i className="fa-solid fa-plane-flight text-sm block mb-1"></i> In Transit
        </div>
        <div className={pct >= 100 ? "text-emerald-600 font-bold" : "text-slate-400"}>
          <i className="fa-solid fa-house-chimney-check text-sm block mb-1"></i> Delivered
        </div>
      </div>
    </div>
  );
};
