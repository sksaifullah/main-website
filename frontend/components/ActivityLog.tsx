"use client";

import React from "react";
import { SyncLogEntry } from "@/services/dashboard";

interface ActivityLogProps {
  logs: SyncLogEntry[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

export const ActivityLog: React.FC<ActivityLogProps> = ({
  logs,
  isLoading = false,
}) => {
  return (
    <div className="admin-card bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-clock-rotate-left text-[#005DC3] text-sm"></i>
          <h3 className="text-base font-extrabold text-white">
            Carrier Sync &amp; Audit Logs
          </h3>
        </div>
        <span className="text-xs font-bold text-slate-400">
          Recent Activity Feed ({logs.length})
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-12 bg-slate-900/60 animate-pulse rounded-2xl border border-slate-800"
            ></div>
          ))}
        </div>
      ) : logs.length === 0 ? (
        <p className="text-xs text-slate-400 py-6 text-center italic">
          No carrier sync logs recorded yet.
        </p>
      ) : (
        <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
          {logs.map((log, idx) => {
            const isSuccess =
              (log.result || log.sync_result || "").toLowerCase() === "success" ||
              log.http_status === 200;
            const trackingNo =
              log.partner_tracking_number ||
              log.tracking_number ||
              log.shipment_id ||
              "System Audit";

            return (
              <div
                key={log.id || idx}
                className="bg-slate-900/70 p-3 rounded-2xl border border-slate-800 flex items-center justify-between text-xs hover:border-slate-700 transition"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
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
                      <span className="font-bold text-white font-mono">
                        {trackingNo}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                        {log.courier || log.partner_courier || "Partner Sync"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Triggered by: {log.triggered_by || "Auto Engine"}
                      {log.response_time_ms ? ` (${log.response_time_ms}ms)` : ""}
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
                    {log.result || (isSuccess ? "SUCCESS" : "FAILED")}
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1 font-mono">
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

export default ActivityLog;
