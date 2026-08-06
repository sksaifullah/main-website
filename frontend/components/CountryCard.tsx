"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CountryRecord } from "@/types";

interface CountryCardProps {
  country: CountryRecord;
  onEdit: (country: CountryRecord) => void;
  onToggle?: (id: string, enabled: boolean) => Promise<void>;
  onToggleEnabled?: (id: string, enabled: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const CountryCard: React.FC<CountryCardProps> = ({
  country,
  onEdit,
  onToggle,
  onToggleEnabled,
  onDelete,
}) => {
  const toggleFn = onToggleEnabled || onToggle || (async () => {});
  const [isEnabled, setIsEnabled] = useState(country.is_enabled);
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleClick = async () => {
    const nextState = !isEnabled;
    try {
      setIsToggling(true);
      setIsEnabled(nextState);
      await toggleFn(country.id, nextState);
    } catch {
      setIsEnabled(!nextState); // revert
    } finally {
      setIsToggling(false);
    }
  };

  const handleDeleteClick = async () => {
    if (!confirm(`Are you sure you want to delete ${country.name}?`)) {
      return;
    }
    try {
      setIsDeleting(true);
      await onDelete(country.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-5 shadow-xl space-y-4 hover:border-slate-600 transition flex flex-col justify-between">
      <div className="space-y-3">
        {/* Header: Flag, Name, Code, Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src={country.flag_url || "https://flagcdn.com/w80/un.png"}
              alt={country.name}
              width={32}
              height={20}
              unoptimized
              className="w-8 h-5 object-cover rounded shadow-md border border-slate-700"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-base tracking-tight">
                  {country.name}
                </h3>
                <span className="text-[10px] font-mono font-bold bg-slate-900 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
                  {country.code}
                </span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400">
                Zone: <strong className="text-blue-400">{country.zone || "Worldwide"}</strong>
              </span>
            </div>
          </div>

          <button
            onClick={handleToggleClick}
            disabled={isToggling}
            className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
              isEnabled ? "bg-emerald-600 justify-end" : "bg-slate-700 justify-start"
            }`}
          >
            <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
          </button>
        </div>

        {/* Details Badges */}
        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/50">
            <span className="text-[10px] text-slate-400 block font-bold">EST. DELIVERY</span>
            <span className="font-semibold text-slate-200 text-xs">
              {country.delivery_estimate || country.delivery_time}
            </span>
          </div>

          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/50">
            <span className="text-[10px] text-slate-400 block font-bold">BASE TARIFF</span>
            <span className="font-bold text-emerald-400 text-xs">
              ${country.base_tariff || 15}/kg
            </span>
          </div>
        </div>

        {/* Custom Restrictions / Notes */}
        {(country.restrictions || country.duty_tax_info) && (
          <div className="bg-amber-950/40 border border-amber-800/60 p-2.5 rounded-xl text-[11px] text-amber-200 flex items-start gap-2">
            <i className="fa-solid fa-triangle-exclamation text-amber-400 mt-0.5 shrink-0"></i>
            <span className="truncate">{country.restrictions || country.duty_tax_info}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-3 border-t border-slate-700/60">
        <button
          onClick={() => onEdit(country)}
          className="flex-1 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs transition flex items-center justify-center gap-1.5"
        >
          <i className="fa-solid fa-pen-to-square text-blue-400"></i> Edit
        </button>

        <button
          onClick={handleDeleteClick}
          disabled={isDeleting}
          className="py-2 px-3 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-300 font-bold text-xs transition border border-red-800/60 flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          {isDeleting ? (
            <i className="fa-solid fa-spinner animate-spin text-red-400"></i>
          ) : (
            <i className="fa-solid fa-trash-can text-red-400"></i>
          )}
        </button>
      </div>
    </div>
  );
};

export default CountryCard;
