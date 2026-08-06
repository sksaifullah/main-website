"use client";

import React from "react";

interface PricingFiltersProps {
  zone: string;
  onZoneChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  currency: string;
  onCurrencyChange: (value: string) => void;
  onReset?: () => void;
}

export const PricingFilters: React.FC<PricingFiltersProps> = ({
  zone,
  onZoneChange,
  category,
  onCategoryChange,
  currency,
  onCurrencyChange,
  onReset,
}) => {
  const hasActiveFilters = Boolean(zone || category || currency);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
      {/* Zone Filter */}
      <div className="w-full sm:flex-1">
        <select
          value={zone}
          onChange={(e) => onZoneChange(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700/80 focus:border-[#005DC3] focus:ring-1 focus:ring-[#005DC3] rounded-xl px-3 py-2.5 text-xs text-white font-semibold outline-none transition cursor-pointer"
        >
          <option value="">Filter by Zone (All)</option>
          <option value="Zone A">Zone A - North America</option>
          <option value="Zone B">Zone B - Europe</option>
          <option value="Zone C">Zone C - Middle East</option>
          <option value="Zone D">Zone D - Asia Pacific</option>
        </select>
      </div>

      {/* Category Filter */}
      <div className="w-full sm:flex-1">
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700/80 focus:border-[#005DC3] focus:ring-1 focus:ring-[#005DC3] rounded-xl px-3 py-2.5 text-xs text-white font-semibold outline-none transition cursor-pointer"
        >
          <option value="">Filter by Category (All)</option>
          <option value="Express Air">Express Air Parcel</option>
          <option value="Medicine">Medicine Shipping</option>
          <option value="Food Items">Food Items Delivery</option>
          <option value="Documents">Documents</option>
          <option value="Excess Baggage">Excess Baggage</option>
        </select>
      </div>

      {/* Currency Filter */}
      <div className="w-full sm:w-36">
        <select
          value={currency}
          onChange={(e) => onCurrencyChange(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700/80 focus:border-[#005DC3] focus:ring-1 focus:ring-[#005DC3] rounded-xl px-3 py-2.5 text-xs text-white font-semibold outline-none transition cursor-pointer"
        >
          <option value="">Currency (All)</option>
          <option value="USD">USD ($)</option>
          <option value="INR">INR (₹)</option>
          <option value="EUR">EUR (€)</option>
          <option value="GBP">GBP (£)</option>
          <option value="AED">AED</option>
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

export default PricingFilters;
