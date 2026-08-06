"use client";

import React from "react";

export const ZONE_OPTIONS = [
  { id: "Zone A (North America)", name: "Zone A - North America (USA, Canada)" },
  { id: "Zone B (Europe)", name: "Zone B - Europe (UK, Germany, France)" },
  { id: "Zone C (Middle East)", name: "Zone C - Middle East (UAE, KSA, Qatar)" },
  { id: "Zone D (Asia Pacific)", name: "Zone D - Asia Pacific (Australia, SG, Japan)" },
  { id: "Zone E (Rest of World)", name: "Zone E - Rest of World (Africa, S. America)" },
];

interface ZoneSelectorProps {
  value: string;
  onChange: (zone: string) => void;
  disabled?: boolean;
}

export const ZoneSelector: React.FC<ZoneSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="space-y-1">
      <label className="block text-slate-300 font-bold text-xs mb-1">
        Shipping Rate Zone <span className="text-red-400">*</span>
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white font-semibold outline-none focus:border-[#005DC3]"
      >
        {ZONE_OPTIONS.map((z) => (
          <option key={z.id} value={z.id}>
            {z.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ZoneSelector;
