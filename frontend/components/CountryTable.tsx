"use client";

import React from "react";
import { CountryRecord } from "@/services/country";
import CountryRow from "./CountryRow";

interface CountryTableProps {
  countries: CountryRecord[];
  isLoading?: boolean;
  onEdit: (country: CountryRecord) => void;
  onToggle?: (id: string, enabled: boolean) => Promise<void>;
  onToggleEnabled?: (id: string, enabled: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const CountryTable: React.FC<CountryTableProps> = ({
  countries,
  isLoading = false,
  onEdit,
  onToggle,
  onToggleEnabled,
  onDelete,
}) => {
  const handleToggle = onToggleEnabled || onToggle || (async () => {});
  return (
    <div className="overflow-x-auto w-full max-w-full rounded-xl border border-slate-700/60 bg-slate-900/60">
      <table className="w-full min-w-[900px] text-left text-xs text-slate-300">
        <thead className="bg-slate-900/90 text-slate-400 uppercase font-bold border-b border-slate-700">
          <tr>
            <th className="p-3">Country &amp; Flag</th>
            <th className="p-3">Express Delivery Lead Time</th>
            <th className="p-3">Currency</th>
            <th className="p-3">Timezone</th>
            <th className="p-3">Major Hub Cities</th>
            <th className="p-3">Service Status</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/50 font-medium">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <tr key={idx} className="animate-pulse">
                <td className="p-3">
                  <div className="h-4 bg-slate-800 rounded w-28"></div>
                </td>
                <td className="p-3">
                  <div className="h-4 bg-slate-800 rounded w-20"></div>
                </td>
                <td className="p-3">
                  <div className="h-4 bg-slate-800 rounded w-16"></div>
                </td>
                <td className="p-3">
                  <div className="h-4 bg-slate-800 rounded w-24"></div>
                </td>
                <td className="p-3">
                  <div className="h-4 bg-slate-800 rounded w-32"></div>
                </td>
                <td className="p-3">
                  <div className="h-5 bg-slate-800 rounded-full w-20"></div>
                </td>
                <td className="p-3 text-right">
                  <div className="h-7 bg-slate-800 rounded w-16 ml-auto"></div>
                </td>
              </tr>
            ))
          ) : countries.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="p-8 text-center text-slate-400 font-semibold space-y-2"
              >
                <i className="fa-solid fa-globe text-3xl text-slate-600 mb-2 block"></i>
                <p>No country records found matching your filters.</p>
              </td>
            </tr>
          ) : (
            countries.map((c) => (
              <CountryRow
                key={c.id}
                country={c}
                onEdit={onEdit}
                onToggle={handleToggle}
                onDelete={onDelete}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CountryTable;
