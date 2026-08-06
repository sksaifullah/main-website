"use client";

import React, { useState } from "react";
import Image from "next/image";
import { PricingRecord } from "@/services/pricing";

interface PricingTableProps {
  records: PricingRecord[];
  isLoading?: boolean;
  onViewSlabs: (record: PricingRecord) => void;
  onEdit: (record: PricingRecord) => void;
  onDelete: (id: string) => Promise<void>;
}

export const PricingTable: React.FC<PricingTableProps> = ({
  records,
  isLoading = false,
  onViewSlabs,
  onEdit,
  onDelete,
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, country: string) => {
    if (!confirm(`Are you sure you want to delete rate slab for ${country}?`)) {
      return;
    }
    try {
      setDeletingId(id);
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="overflow-x-auto w-full max-w-full rounded-xl border border-slate-700/60 bg-slate-900/60">
      <table className="w-full min-w-[900px] text-left text-xs text-slate-300">
        <thead className="bg-slate-900/90 text-slate-400 uppercase font-bold border-b border-slate-700">
          <tr>
            <th className="p-3">Country &amp; Flag</th>
            <th className="p-3">Shipping Zone</th>
            <th className="p-3">Service Category</th>
            <th className="p-3">Currency</th>
            <th className="p-3">Express Starting Rate</th>
            <th className="p-3">Economy Starting Rate</th>
            <th className="p-3">Weight Slabs</th>
            <th className="p-3">Status</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/50 font-medium">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <tr key={idx} className="animate-pulse">
                <td className="p-3">
                  <div className="h-4 bg-slate-800 rounded w-24"></div>
                </td>
                <td className="p-3">
                  <div className="h-4 bg-slate-800 rounded w-28"></div>
                </td>
                <td className="p-3">
                  <div className="h-4 bg-slate-800 rounded w-20"></div>
                </td>
                <td className="p-3">
                  <div className="h-4 bg-slate-800 rounded w-12"></div>
                </td>
                <td className="p-3">
                  <div className="h-4 bg-slate-800 rounded w-16"></div>
                </td>
                <td className="p-3">
                  <div className="h-4 bg-slate-800 rounded w-16"></div>
                </td>
                <td className="p-3">
                  <div className="h-4 bg-slate-800 rounded w-16"></div>
                </td>
                <td className="p-3">
                  <div className="h-5 bg-slate-800 rounded-full w-14"></div>
                </td>
                <td className="p-3 text-right">
                  <div className="h-7 bg-slate-800 rounded w-20 ml-auto"></div>
                </td>
              </tr>
            ))
          ) : records.length === 0 ? (
            <tr>
              <td
                colSpan={9}
                className="p-8 text-center text-slate-400 font-semibold space-y-2"
              >
                <i className="fa-solid fa-tags text-3xl text-slate-600 mb-2 block"></i>
                <p>No pricing records found matching your filters.</p>
              </td>
            </tr>
          ) : (
            records.map((p) => (
              <tr key={p.id} className="hover:bg-slate-800/60 transition">
                {/* Country */}
                <td className="p-3 font-bold text-white flex items-center gap-2">
                  {p.flag_url && (
                    <Image
                      src={p.flag_url}
                      alt={p.country}
                      width={20}
                      height={14}
                      unoptimized
                      className="w-5 h-3.5 object-cover rounded"
                    />
                  )}
                  <span>{p.country}</span>
                </td>

                {/* Zone */}
                <td className="p-3 font-semibold text-slate-200">{p.zone}</td>

                {/* Category */}
                <td className="p-3 font-medium text-slate-300">{p.category}</td>

                {/* Currency */}
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono font-bold text-[11px] border border-slate-700">
                    {p.currency} ({p.currency_symbol})
                  </span>
                </td>

                {/* Express Base Price */}
                <td className="p-3">
                  <span className="font-extrabold text-emerald-400 font-mono">
                    {p.currency_symbol}
                    {p.base_express_price}
                  </span>
                </td>

                {/* Economy Base Price */}
                <td className="p-3">
                  <span className="font-bold text-blue-300 font-mono">
                    {p.currency_symbol}
                    {p.base_economy_price}
                  </span>
                </td>

                {/* Weight Slabs Badge */}
                <td className="p-3">
                  <button
                    onClick={() => onViewSlabs(p)}
                    className="px-2.5 py-1 rounded-lg bg-blue-950/60 hover:bg-blue-900 text-blue-300 font-bold text-[11px] border border-blue-800/60 transition flex items-center gap-1"
                  >
                    <i className="fa-solid fa-[#005DC3] fa-table-cells"></i>{" "}
                    {p.weight_slabs?.length || 7} Slabs
                  </button>
                </td>

                {/* Status */}
                <td className="p-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                      p.is_active
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                        : "bg-slate-700/50 text-slate-400 border-slate-600"
                    }`}
                  >
                    {p.is_active ? "Active" : "Inactive"}
                  </span>
                </td>

                {/* Actions */}
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onViewSlabs(p)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                      title="View Weight Slab Matrix"
                    >
                      <i className="fa-solid fa-eye text-xs"></i>
                    </button>
                    <button
                      onClick={() => onEdit(p)}
                      className="p-1.5 rounded-lg bg-blue-950/60 hover:bg-blue-900/80 text-blue-300 transition"
                      title="Edit Pricing"
                    >
                      <i className="fa-solid fa-pen-to-square text-xs"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(p.id, p.country)}
                      disabled={deletingId === p.id}
                      className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-400 transition disabled:opacity-50"
                      title="Delete Pricing"
                    >
                      <i className="fa-solid fa-trash text-xs"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PricingTable;
