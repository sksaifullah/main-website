"use client";

import React from "react";

export const RecentActivity: React.FC = () => {
  const activities = [
    {
      id: "act-1",
      title: "Shipment Dispatched",
      details: "Tracking #SW9821034 - NYC, USA Hub Transit",
      time: "10 mins ago",
      icon: "fa-plane-departure",
      color: "text-blue-400 bg-blue-950/60 border-blue-800/60",
    },
    {
      id: "act-2",
      title: "Delivered Confirmation",
      details: "Tracking #SW8812903 - London Heathrow Airport",
      time: "25 mins ago",
      icon: "fa-circle-check",
      color: "text-emerald-400 bg-emerald-950/60 border-emerald-800/60",
    },
    {
      id: "act-3",
      title: "New Quote Request",
      details: "5.5 kg Medicine Courier to Dubai, UAE",
      time: "42 mins ago",
      icon: "fa-calculator",
      color: "text-amber-400 bg-amber-950/60 border-amber-800/60",
    },
    {
      id: "act-4",
      title: "Carrier API Sync",
      details: "FedEx Express 62 packages tracking synced successfully",
      time: "1 hour ago",
      icon: "fa-arrows-rotate",
      color: "text-purple-400 bg-purple-950/60 border-purple-800/60",
    },
  ];

  return (
    <div className="bg-slate-900/60 border border-slate-700/60 rounded-3xl p-5 space-y-4 shadow-xl">
      <div>
        <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
          <i className="fa-solid fa-clock-rotate-left text-blue-400"></i> Live Activity &amp; Audit Stream
        </h4>
        <p className="text-[11px] text-slate-400 font-medium">Real-time system events</p>
      </div>

      <div className="space-y-3">
        {activities.map((act) => (
          <div
            key={act.id}
            className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition"
          >
            <div
              className={`w-8 h-8 rounded-xl border flex items-center justify-center text-xs shrink-0 ${act.color}`}
            >
              <i className={`fa-solid ${act.icon}`}></i>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-bold text-white text-xs">{act.title}</p>
                <span className="text-[10px] font-mono text-slate-400">{act.time}</span>
              </div>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">{act.details}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
