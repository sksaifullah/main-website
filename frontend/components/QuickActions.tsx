"use client";

import React from "react";

interface QuickActionsProps {
  onNewShipment: () => void;
  onSyncAllCarriers?: () => Promise<void>;
  onSyncAll?: () => Promise<void>;
  onExportCSV: () => void;
  onOpenSyncLogs?: () => void;
  isSyncing?: boolean;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onNewShipment,
  onSyncAllCarriers,
  onSyncAll,
  onExportCSV,
  onOpenSyncLogs,
  isSyncing = false,
}) => {
  const handleSyncClick = onSyncAll || onSyncAllCarriers;
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <button
        onClick={onExportCSV}
        className="px-3.5 py-2.5 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-slate-200 font-bold text-xs transition border border-slate-600 flex items-center gap-2 whitespace-nowrap"
        title="Export shipments to CSV"
      >
        <i className="fa-solid fa-file-csv text-emerald-400"></i> Export CSV
      </button>

      <button
        onClick={handleSyncClick}
        disabled={isSyncing}
        className="px-3.5 py-2.5 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-slate-200 font-bold text-xs transition border border-slate-600 flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
      >
        <i
          className={`fa-solid fa-arrows-rotate ${
            isSyncing ? "animate-spin text-blue-400" : ""
          }`}
        ></i>
        {isSyncing ? "Syncing All..." : "Sync All Carriers"}
      </button>

      {onOpenSyncLogs && (
        <button
          onClick={onOpenSyncLogs}
          className="px-3.5 py-2.5 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-slate-200 font-bold text-xs transition border border-slate-600 flex items-center gap-2 whitespace-nowrap"
        >
          <i className="fa-solid fa-list-check"></i> Sync Audit Logs
        </button>
      )}

      <button
        onClick={onNewShipment}
        className="btn-primary text-xs py-2.5 px-4 shadow-lg flex items-center gap-2 whitespace-nowrap"
      >
        <i className="fa-solid fa-plus"></i> New Express Shipment
      </button>
    </div>
  );
};

export default QuickActions;
