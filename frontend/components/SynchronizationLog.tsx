"use client";

import React, { useState } from "react";
import { SyncLogEntry } from "@/services/dashboard";

interface SynchronizationLogProps {
  logs: SyncLogEntry[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

export const SynchronizationLog: React.FC<SynchronizationLogProps> = ({
  logs,
  isLoading = false,
  onRefresh,
}) => {
  const [carrierFilter, setCarrierFilter] = useState("all");

  const filteredLogs = logs.filter((l) => {
    if (carrierFilter === "all") return true;
    const c = (l.courier || l.partner_courier || "").toLowerCase();
    return c.includes(carrierFilter.toLowerCase());
  });

  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl space-y-4">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-700/60 pb-3">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-list-check text-[#005DC3] text-sm"></i>
          <h3 className="text-base font-extrabold text-white">
            Carrier Synchronization Audit Logs
          </h3>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Filter Dropdown */}
          <select
            value={carrierFilter}
            onChange={(e) => setCarrierFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-semibold outline-none cursor-pointer"
          >
            <option value="all">All Carriers</option>
            <option value="dhl">DHL Express</option>
            <option value="fedex">FedEx Express</option>
            <option value="ups">UPS Courier</option>
            <option value="aramex">Aramex Express</option>
          </select>

          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold transition border border-slate-600"
              title="Refresh logs"
            >
              <i className="fa-solid fa-rotate"></i>
            </button>
          )}
        </div>
      </div>

      {/* Log Feed Table */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="h-12 bg-slate-900/60 animate-pulse rounded-2xl border border-slate-800"
            ></div>
          ))}
        </div>
      ) : filteredLogs.length === 0 ? (
        <p className="text-xs text-slate-400 py-6 text-center italic">
          No carrier sync logs matching the selected filter.
        </p>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {filteredLogs.map((log, idx) => {
            const isSuccess =
              (log.result || log.sync_result || "").toLowerCase() === "success" ||
              log.http_status === 200;
            const courier = log.courier || log.partner_courier || "Partner Carrier";
            const trackingNum =
              log.partner_tracking_number ||
              log.tracking_number ||
              log.shipment_id ||
              "System";

            return (
              <div
                key={log.id || idx}
                className="bg-slate-900/70 p-3 rounded-2xl border border-slate-800 flex items-center justify-between text-xs hover:border-slate-700 transition"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                      isSuccess
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-red-500/20 text-red-400 border border-red-500/30"
                    }`}
                  >
                    <i
                      className={`fa-solid ${
                        isSuccess ? "fa-check" : "fa-triangle-exclamation"
                      }`}
                    ></i>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-white">{courier}</span>
                      <span className="font-mono text-slate-300 text-[11px]">
                        {trackingNum}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Triggered by: {log.triggered_by || "Admin Engine"}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                      isSuccess
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                        : "bg-red-500/20 text-red-300 border-red-500/30"
                    }`}
                  >
                    {log.result || (isSuccess ? "SUCCESS" : "ERROR")}
                  </span>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                    {log.timestamp || log.date || "Just now"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SynchronizationLog;
