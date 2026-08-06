"use client";

import React from "react";

interface ShipmentFiltersProps {
  partnerCourier: string;
  onPartnerCourierChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  onReset?: () => void;
}

export const ShipmentFilters: React.FC<ShipmentFiltersProps> = ({
  partnerCourier,
  onPartnerCourierChange,
  status,
  onStatusChange,
  onReset,
}) => {
  const hasActiveFilters = Boolean(partnerCourier || status);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
      {/* Partner Courier Filter */}
      <div className="w-full sm:flex-1">
        <select
          value={partnerCourier}
          onChange={(e) => onPartnerCourierChange(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700/80 focus:border-[#005DC3] focus:ring-1 focus:ring-[#005DC3] rounded-xl px-3 py-2.5 text-xs text-white font-semibold outline-none transition cursor-pointer"
        >
          <option value="">Filter by Courier (All)</option>
          <option value="DHL">DHL Express</option>
          <option value="FedEx">FedEx Express</option>
          <option value="UPS">UPS Courier</option>
          <option value="Aramex">Aramex Express</option>
        </select>
      </div>

      {/* Status Filter */}
      <div className="w-full sm:flex-1">
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700/80 focus:border-[#005DC3] focus:ring-1 focus:ring-[#005DC3] rounded-xl px-3 py-2.5 text-xs text-white font-semibold outline-none transition cursor-pointer"
        >
          <option value="">Filter by Status (All)</option>
          <option value="Booked">Booked</option>
          <option value="Picked Up">Picked Up</option>
          <option value="In Transit">In Transit</option>
          <option value="Out for Delivery">Out for Delivery</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
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

export default ShipmentFilters;
