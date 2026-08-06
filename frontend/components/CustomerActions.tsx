"use client";

import React, { useRef } from "react";

interface CustomerActionsProps {
  onNewCustomer?: () => void;
  onOpenCreate?: () => void;
  onExportCSV: () => void;
  onImportJSON: (jsonArray: Record<string, unknown>[]) => void;
  selectedCount?: number;
  onBulkDelete?: () => Promise<void>;
}

export const CustomerActions: React.FC<CustomerActionsProps> = ({
  onNewCustomer,
  onOpenCreate,
  onExportCSV,
  onImportJSON,
  selectedCount = 0,
  onBulkDelete,
}) => {
  const handleCreateClick = onOpenCreate || onNewCustomer || (() => {});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
          onImportJSON(parsed as Record<string, unknown>[]);
        } else {
          alert("Invalid file format. Please upload a JSON array of customer objects.");
        }
      } catch {
        alert("Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 w-full">
      {/* Hidden file input for import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />

      {/* Selection / Bulk Actions */}
      <div className="flex items-center gap-2">
        {selectedCount > 0 ? (
          <div className="flex items-center gap-2 bg-blue-950/60 border border-blue-800/80 px-3 py-1.5 rounded-xl text-xs text-blue-200 animate-fadeIn">
            <span className="font-bold">{selectedCount}</span> selected
            <div className="h-4 w-px bg-blue-800 mx-1"></div>
            {onBulkDelete && (
              <button
                onClick={onBulkDelete}
                className="text-red-400 hover:text-red-300 font-bold transition flex items-center gap-1"
              >
                <i className="fa-solid fa-trash-can"></i> Delete Selected
              </button>
            )}
          </div>
        ) : (
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            Manage corporate and individual shipper accounts
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition flex items-center gap-2"
          title="Import JSON array"
        >
          <i className="fa-solid fa-file-import text-blue-400"></i> Import JSON
        </button>

        <button
          onClick={onExportCSV}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition flex items-center gap-2"
          title="Export CSV"
        >
          <i className="fa-solid fa-file-csv text-emerald-400"></i> Export CSV
        </button>

        <button
          onClick={handleCreateClick}
          className="btn-primary px-4 py-2 rounded-xl font-extrabold text-xs shadow-lg flex items-center gap-2"
        >
          <i className="fa-solid fa-user-plus"></i> Add New Customer
        </button>
      </div>
    </div>
  );
};

export default CustomerActions;
