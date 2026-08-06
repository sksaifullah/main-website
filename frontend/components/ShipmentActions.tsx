"use client";

import React, { useState } from "react";

interface ShipmentActionsProps {
  onNewShipment: () => void;
  onSyncAllCarriers: () => Promise<void>;
  onExportCSV: () => void;
  selectedCount?: number;
  onBulkDelete?: () => Promise<void>;
  onBulkStatusUpdate?: (status: string) => Promise<void>;
  isSyncingAll?: boolean;
}

export const ShipmentActions: React.FC<ShipmentActionsProps> = ({
  onNewShipment,
  onSyncAllCarriers,
  onExportCSV,
  selectedCount = 0,
  onBulkDelete,
  onBulkStatusUpdate,
  isSyncingAll = false,
}) => {
  const [showBulkStatusDropdown, setShowBulkStatusDropdown] = useState(false);
  const [isBulkLoading, setIsBulkLoading] = useState(false);

  const handleBulkStatus = async (status: string) => {
    if (!onBulkStatusUpdate) return;
    try {
      setIsBulkLoading(true);
      setShowBulkStatusDropdown(false);
      await onBulkStatusUpdate(status);
    } finally {
      setIsBulkLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!onBulkDelete) return;
    if (!confirm(`Are you sure you want to delete ${selectedCount} selected shipment(s)?`)) {
      return;
    }
    try {
      setIsBulkLoading(true);
      await onBulkDelete();
    } finally {
      setIsBulkLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 w-full">
      {/* Selection Info / Bulk Actions */}
      <div className="flex items-center gap-2">
        {selectedCount > 0 ? (
          <div className="flex items-center gap-2 bg-blue-950/60 border border-blue-800/80 px-3 py-1.5 rounded-xl text-xs text-blue-200 animate-fadeIn">
            <span className="font-bold">{selectedCount}</span> selected
            <div className="h-4 w-px bg-blue-800 mx-1"></div>
            {/* Bulk Status Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowBulkStatusDropdown(!showBulkStatusDropdown)}
                disabled={isBulkLoading}
                className="px-2.5 py-1 rounded-lg bg-blue-900/80 hover:bg-blue-800 text-white font-bold text-xs transition flex items-center gap-1"
              >
                Status <i className="fa-solid fa-chevron-down text-[10px]"></i>
              </button>
              {showBulkStatusDropdown && (
                <div className="absolute left-0 mt-1 w-44 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-20 py-1 font-semibold text-xs">
                  {["Booked", "Picked Up", "In Transit", "Out for Delivery", "Delivered", "Cancelled"].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleBulkStatus(st)}
                      className="w-full text-left px-3 py-2 hover:bg-slate-800 text-slate-200 transition"
                    >
                      Set status: {st}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Bulk Delete */}
            <button
              onClick={handleBulkDelete}
              disabled={isBulkLoading}
              className="px-2.5 py-1 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-300 font-bold text-xs transition flex items-center gap-1 border border-red-800/60"
            >
              <i className="fa-solid fa-trash text-xs"></i> Delete
            </button>
          </div>
        ) : (
          <span className="text-xs text-slate-400 hidden lg:inline-block font-medium">
            Manage official partner tracking numbers &amp; live carrier sync
          </span>
        )}
      </div>

      {/* Main Action Buttons */}
      <div className="flex flex-wrap items-center gap-2.5 shrink-0">
        <button
          onClick={onExportCSV}
          className="px-3.5 py-2 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-slate-200 font-bold text-xs transition border border-slate-600 flex items-center gap-2 whitespace-nowrap"
          title="Export shipments to CSV"
        >
          <i className="fa-solid fa-file-csv text-emerald-400"></i> Export CSV
        </button>

        <button
          onClick={onSyncAllCarriers}
          disabled={isSyncingAll}
          className="px-3.5 py-2 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-slate-200 font-bold text-xs transition border border-slate-600 flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
        >
          <i className={`fa-solid fa-arrows-rotate ${isSyncingAll ? "animate-spin text-blue-400" : ""}`}></i>
          {isSyncingAll ? "Syncing..." : "Sync All Carriers"}
        </button>

        <button
          onClick={onNewShipment}
          className="btn-primary text-xs py-2 px-4 shadow-lg flex items-center gap-2 whitespace-nowrap"
        >
          <i className="fa-solid fa-plus"></i> New Express Shipment
        </button>
      </div>
    </div>
  );
};

export default ShipmentActions;
