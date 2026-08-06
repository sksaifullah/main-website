"use client";

import React from "react";
import { AutoSyncConfig } from "@/services/carrier";

interface CarrierStatusProps {
  activeCount: number;
  totalCount: number;
  autoSync: AutoSyncConfig;
  onAutoSyncToggle: (enabled: boolean) => Promise<void>;
  onSyncAll: () => Promise<void>;
  isSyncing?: boolean;
}

export const CarrierStatus: React.FC<CarrierStatusProps> = ({
  activeCount,
  totalCount,
  autoSync,
  onAutoSyncToggle,
  onSyncAll,
  isSyncing = false,
}) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Title & Health Overview */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Partner Courier Integrations Console
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Configure live OAuth &amp; REST APIs for FedEx, UPS, DHL Express, and Aramex.
          </p>
        </div>

        {/* Sync Controls */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {/* Auto-Sync Toggle */}
          <div className="flex items-center gap-2 bg-slate-800/80 px-3.5 py-2 rounded-2xl border border-slate-700/80 text-xs">
            <span className="font-bold text-slate-300">Auto Sync (30m):</span>
            <button
              onClick={() => onAutoSyncToggle(!autoSync.enabled)}
              className={`w-10 h-6 rounded-full transition p-1 flex items-center ${
                autoSync.enabled ? "bg-emerald-500 justify-end" : "bg-slate-700 justify-start"
              }`}
              title="Toggle automatic background sync"
            >
              <span className="w-4 h-4 rounded-full bg-white shadow-md"></span>
            </button>
          </div>

          {/* Sync All Button */}
          <button
            onClick={onSyncAll}
            disabled={isSyncing}
            className="btn-primary text-xs py-2.5 px-4 shadow-lg flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
          >
            <i
              className={`fa-solid fa-arrows-rotate ${
                isSyncing ? "animate-spin" : ""
              }`}
            ></i>
            {isSyncing ? "Syncing Carries..." : "Sync All Carriers Now"}
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-800">
          <p className="text-[10px] text-slate-400 uppercase font-bold">Active Carriers</p>
          <p className="text-lg font-extrabold text-emerald-400 mt-0.5">
            {activeCount} / {totalCount}
          </p>
        </div>
        <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-800">
          <p className="text-[10px] text-slate-400 uppercase font-bold">FedEx OAuth 2.0</p>
          <p className="text-sm font-bold text-purple-300 mt-1">Live Token Active</p>
        </div>
        <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-800">
          <p className="text-[10px] text-slate-400 uppercase font-bold">DHL Express API</p>
          <p className="text-sm font-bold text-amber-300 mt-1">Key Validated</p>
        </div>
        <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-800">
          <p className="text-[10px] text-slate-400 uppercase font-bold">Aramex Web Services</p>
          <p className="text-sm font-bold text-blue-300 mt-1">Account Verified</p>
        </div>
      </div>
    </div>
  );
};

export default CarrierStatus;
