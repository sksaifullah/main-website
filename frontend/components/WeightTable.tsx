"use client";

import React from "react";
import { WeightSlabRate, PricingRecord } from "@/services/pricing";

interface WeightTableProps {
  slabs?: WeightSlabRate[];
  record?: PricingRecord;
  currencySymbol?: string;
  isEditable?: boolean;
  onSlabChange?: (index: number, field: "express_rate" | "economy_rate", value: number) => void;
  onClose?: () => void;
}

export const WeightTable: React.FC<WeightTableProps> = ({
  slabs: inputSlabs,
  record,
  currencySymbol: inputSymbol,
  isEditable = false,
  onSlabChange,
  onClose,
}) => {
  const slabs = inputSlabs || record?.weight_slabs || [];
  const currencySymbol = inputSymbol || record?.currency_symbol || "$";

  const tableContent = (
    <div className="overflow-x-auto w-full rounded-2xl border border-slate-700/80 bg-slate-900/80">
      <table className="w-full text-left text-xs text-slate-300">
        <thead className="bg-slate-950 text-slate-400 font-bold uppercase border-b border-slate-700">
          <tr>
            <th className="p-2.5">Weight Slab</th>
            <th className="p-2.5">Express Air Rate ({currencySymbol})</th>
            <th className="p-2.5">Economy Cargo Rate ({currencySymbol})</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800 font-medium">
          {slabs.map((slab, idx) => {
            const slabLabel = slab.weight_slab || `${slab.min_weight}–${slab.max_weight} kg`;
            const expressPrice = slab.express_rate ?? (slab.price_per_kg ? slab.price_per_kg * 1.5 : 15);
            const economyPrice = slab.economy_rate ?? slab.price_per_kg ?? 10;

            return (
              <tr key={slabLabel || idx} className="hover:bg-slate-800/50 transition">
                <td className="p-2.5 font-bold text-white font-mono">{slabLabel}</td>
                <td className="p-2.5">
                  {isEditable ? (
                    <div className="relative flex items-center">
                      <span className="absolute left-2.5 text-slate-400 font-mono">{currencySymbol}</span>
                      <input
                        type="number"
                        step="0.1"
                        min={0}
                        value={expressPrice}
                        onChange={(e) =>
                          onSlabChange && onSlabChange(idx, "express_rate", Number(e.target.value))
                        }
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-7 pr-2 py-1 text-white font-mono outline-none focus:border-[#005DC3]"
                      />
                    </div>
                  ) : (
                    <span className="font-extrabold text-emerald-400 font-mono">
                      {currencySymbol}{expressPrice}
                    </span>
                  )}
                </td>
                <td className="p-2.5">
                  {isEditable ? (
                    <div className="relative flex items-center">
                      <span className="absolute left-2.5 text-slate-400 font-mono">{currencySymbol}</span>
                      <input
                        type="number"
                        step="0.1"
                        min={0}
                        value={economyPrice}
                        onChange={(e) =>
                          onSlabChange && onSlabChange(idx, "economy_rate", Number(e.target.value))
                        }
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-7 pr-2 py-1 text-white font-mono outline-none focus:border-[#005DC3]"
                      />
                    </div>
                  ) : (
                    <span className="font-bold text-blue-300 font-mono">
                      {currencySymbol}{economyPrice}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  if (record && onClose) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-xl w-full space-y-4 shadow-2xl">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-extrabold text-white text-lg">{record.country} Weight Slabs</h3>
              <p className="text-xs text-slate-400 font-mono">{record.zone} | {record.category}</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          {tableContent}
          <div className="flex justify-end pt-2">
            <button onClick={onClose} className="btn-secondary text-xs px-4 py-2">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return tableContent;
};

export default WeightTable;
