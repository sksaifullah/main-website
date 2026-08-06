"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CountryRecord } from "@/types";

interface CountryRowProps {
  country: CountryRecord;
  onEdit: (country: CountryRecord) => void;
  onToggle: (id: string, enabled: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const CountryRow: React.FC<CountryRowProps> = ({
  country,
  onEdit,
  onToggle,
  onDelete,
}) => {
  const [isEnabled, setIsEnabled] = useState(country.is_enabled);
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleClick = async () => {
    const nextState = !isEnabled;
    try {
      setIsToggling(true);
      setIsEnabled(nextState);
      await onToggle(country.id, nextState);
    } catch {
      setIsEnabled(!nextState);
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
    <tr className="hover:bg-slate-800/60 transition divide-y-0">
      {/* Flag & Name */}
      <td className="p-3">
        <div className="flex items-center gap-3">
          <Image
            src={country.flag_url || "https://flagcdn.com/w80/un.png"}
            alt={country.name}
            width={28}
            height={16}
            unoptimized
            className="w-7 h-4 object-cover rounded shadow border border-slate-700"
          />
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white text-xs">{country.name}</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] font-bold border border-slate-700">
              {country.code}
            </span>
          </div>
        </div>
      </td>

      {/* Zone */}
      <td className="p-3">
        <span className="px-2 py-1 rounded-lg bg-blue-950/80 text-blue-300 font-extrabold text-[10px] border border-blue-800/60">
          {country.zone || "Worldwide"}
        </span>
      </td>

      {/* Delivery Estimate */}
      <td className="p-3 font-semibold text-slate-300 text-xs">
        {country.delivery_estimate || country.delivery_time}
      </td>

      {/* Base Tariff Rate */}
      <td className="p-3 font-bold text-emerald-400 text-xs">
        ${country.base_tariff || 15}/kg
      </td>

      {/* Currency */}
      <td className="p-3 font-mono text-slate-300 text-xs">
        {country.currency} ({country.currency_symbol})
      </td>

      {/* Status Toggle Switch */}
      <td className="p-3">
        <button
          onClick={handleToggleClick}
          disabled={isToggling}
          className={`w-9 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors ${
            isEnabled ? "bg-emerald-600 justify-end" : "bg-slate-700 justify-start"
          }`}
        >
          <div className="w-3.5 h-3.5 bg-white rounded-full shadow-md"></div>
        </button>
      </td>

      {/* Actions */}
      <td className="p-3 text-right">
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => onEdit(country)}
            className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-blue-400 transition"
            title="Edit Country"
          >
            <i className="fa-solid fa-pen-to-square text-xs"></i>
          </button>
          <button
            onClick={handleDeleteClick}
            disabled={isDeleting}
            className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-400 border border-red-800/60 transition disabled:opacity-50"
            title="Delete Country"
          >
            {isDeleting ? (
              <i className="fa-solid fa-spinner animate-spin text-xs"></i>
            ) : (
              <i className="fa-solid fa-trash-can text-xs"></i>
            )}
          </button>
        </div>
      </td>
    </tr>
  );
};

export default CountryRow;
