"use client";

import React from "react";

interface FiltersProps {
  typeFilter: string;
  onTypeFilterChange?: (type: string) => void;
  onTypeChange?: (type: string) => void;
  statusFilter: string;
  onStatusFilterChange?: (status: string) => void;
  onStatusChange?: (status: string) => void;
  onReset?: () => void;
}

export const Filters: React.FC<FiltersProps> = ({
  typeFilter,
  onTypeFilterChange,
  onTypeChange,
  statusFilter,
  onStatusFilterChange,
  onStatusChange,
  onReset,
}) => {
  const handleType = onTypeChange || onTypeFilterChange || (() => {});
  const handleStatus = onStatusChange || onStatusFilterChange || (() => {});
  const hasActiveFilters = Boolean(typeFilter || statusFilter);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
      {/* Type Filter */}
      <div className="w-full sm:flex-1">
        <select
          value={typeFilter}
          onChange={(e) => handleType(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700/80 focus:border-[#005DC3] focus:ring-1 focus:ring-[#005DC3] rounded-xl px-3 py-2.5 text-xs text-white font-semibold outline-none transition cursor-pointer"
        >
          <option value="">All Inquiry Types</option>
          <option value="quote">Quote Requests Only</option>
          <option value="message">Contact Messages Only</option>
        </select>
      </div>

      {/* Status Filter */}
      <div className="w-full sm:flex-1">
        <select
          value={statusFilter}
          onChange={(e) => handleStatus(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700/80 focus:border-[#005DC3] focus:ring-1 focus:ring-[#005DC3] rounded-xl px-3 py-2.5 text-xs text-white font-semibold outline-none transition cursor-pointer"
        >
          <option value="">Filter by Status (All)</option>
          <option value="Pending">Pending Response</option>
          <option value="Replied">Replied</option>
          <option value="Archived">Archived</option>
        </select>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && onReset && (
        <button
          onClick={onReset}
          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap border border-slate-700"
          title="Reset filters"
        >
          <i className="fa-solid fa-rotate-left text-xs"></i> Reset
        </button>
      )}
    </div>
  );
};

export default Filters;
