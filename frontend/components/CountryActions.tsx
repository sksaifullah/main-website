"use client";

import React from "react";

interface CountryActionsProps {
  onNewCountry?: () => void;
  onOpenCreate?: () => void;
  onExportCSV: () => void;
  viewMode: "table" | "grid";
  onToggleViewMode?: (mode: "table" | "grid") => void;
  onViewModeChange?: (mode: "table" | "grid") => void;
}

export const CountryActions: React.FC<CountryActionsProps> = ({
  onNewCountry,
  onOpenCreate,
  onExportCSV,
  viewMode,
  onToggleViewMode,
  onViewModeChange,
}) => {
  const handleToggle = onViewModeChange || onToggleViewMode || (() => {});
  const handleCreate = onOpenCreate || onNewCountry || (() => {});
  return (
    <div className="flex flex-wrap items-center gap-2.5 shrink-0">
      {/* View Toggle */}
      <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-xl p-1">
        <button
          onClick={() => handleToggle("table")}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
            viewMode === "table"
              ? "bg-[#005DC3] text-white shadow-md"
              : "text-slate-400 hover:text-white"
          }`}
          title="Table View"
        >
          <i className="fa-solid fa-table-list"></i> Table
        </button>
        <button
          onClick={() => handleToggle("grid")}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
            viewMode === "grid"
              ? "bg-[#005DC3] text-white shadow-md"
              : "text-slate-400 hover:text-white"
          }`}
          title="Grid View"
        >
          <i className="fa-solid fa-grip"></i> Grid
        </button>
      </div>

      <button
        onClick={onExportCSV}
        className="px-3.5 py-2 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-slate-200 font-bold text-xs transition border border-slate-600 flex items-center gap-2 whitespace-nowrap"
        title="Export country list to CSV"
      >
        <i className="fa-solid fa-file-csv text-emerald-400"></i> Export CSV
      </button>

      <button
        onClick={handleCreate}
        className="btn-primary text-xs py-2 px-4 shadow-lg flex items-center gap-2 whitespace-nowrap"
      >
        <i className="fa-solid fa-plus"></i> Add New Country
      </button>
    </div>
  );
};

export default CountryActions;
