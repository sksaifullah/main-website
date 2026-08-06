"use client";

import React from "react";

interface CountryFiltersProps {
  status?: string;
  statusFilter?: string;
  onStatusChange: (value: string) => void;
  currency?: string;
  currencyFilter?: string;
  onCurrencyChange: (value: string) => void;
  onReset?: () => void;
}

export const CountryFilters: React.FC<CountryFiltersProps> = ({
  status: inputStatus,
  statusFilter,
  onStatusChange,
  currency: inputCurrency,
  currencyFilter,
  onCurrencyChange,
  onReset,
}) => {
  const status = inputStatus !== undefined ? inputStatus : statusFilter || "";
  const currency = inputCurrency !== undefined ? inputCurrency : currencyFilter || "";
  const hasActiveFilters = Boolean(status || currency);

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
          <option value="enabled font-semibold">Enabled (Active Express Service)</option>
          <option value="disabled">Disabled (Route Suspended)</option>
        </select>
      </div>

      {/* Currency Filter */}
      <div className="w-full sm:flex-1">
        <select
          value={currency}
          onChange={(e) => onCurrencyChange(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700/80 focus:border-[#005DC3] focus:ring-1 focus:ring-[#005DC3] rounded-xl px-3 py-2.5 text-xs text-white font-semibold outline-none transition cursor-pointer"
        >
          <option value="">Filter by Currency (All)</option>
          <option value="USD">USD ($)</option>
          <option value="GBP">GBP (£)</option>
          <option value="EUR">EUR (€)</option>
          <option value="AED">AED</option>
          <option value="CAD">CAD (C$)</option>
          <option value="AUD">AUD (AU$)</option>
          <option value="SAR">SAR</option>
          <option value="SGD">SGD (S$)</option>
        </select>
      </div>

      {/* Reset Button */}
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

export default CountryFilters;
