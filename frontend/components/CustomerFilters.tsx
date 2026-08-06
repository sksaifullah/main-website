"use client";

import React from "react";

interface CustomerFiltersProps {
  status: string;
  onStatusChange: (value: string) => void;
  country: string;
  onCountryChange: (value: string) => void;
  countriesList?: string[];
  onReset?: () => void;
}

export const CustomerFilters: React.FC<CustomerFiltersProps> = ({
  status,
  onStatusChange,
  country,
  onCountryChange,
  countriesList = ["India", "United Kingdom", "USA", "UAE", "Australia", "Canada"],
  onReset,
}) => {
  const hasActiveFilters = Boolean(status || country);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
      {/* Status Filter */}
      <div className="w-full sm:flex-1">
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700/80 focus:border-[#005DC3] focus:ring-1 focus:ring-[#005DC3] rounded-xl px-3 py-2.5 text-xs text-white font-semibold outline-none transition cursor-pointer"
        >
          <option value="">Filter by Status (All)</option>
          <option value="Active">Active</option>
          <option value="VIP">VIP Account</option>
          <option value="Pending">Pending</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Country Filter */}
      <div className="w-full sm:flex-1">
        <select
          value={country}
          onChange={(e) => onCountryChange(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700/80 focus:border-[#005DC3] focus:ring-1 focus:ring-[#005DC3] rounded-xl px-3 py-2.5 text-xs text-white font-semibold outline-none transition cursor-pointer"
        >
          <option value="">Filter by Country (All)</option>
          {countriesList.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
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

export default CustomerFilters;
