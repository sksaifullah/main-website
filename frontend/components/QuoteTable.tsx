"use client";

import React from "react";
import { QuoteRequestItem } from "@/services/messages";
import StatusBadge from "./StatusBadge";

interface QuoteTableProps {
  quotes: QuoteRequestItem[];
  isLoading?: boolean;
  onView: (quote: QuoteRequestItem) => void;
  onReply: (quote: QuoteRequestItem) => void;
  onArchive: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const QuoteTable: React.FC<QuoteTableProps> = ({
  quotes,
  isLoading = false,
  onView,
  onReply,
  onArchive,
  onDelete,
}) => {
  return (
    <div className="overflow-x-auto w-full max-w-full rounded-xl border border-slate-700/60 bg-slate-900/60">
      <table className="w-full min-w-[950px] text-left text-xs text-slate-300">
        <thead className="bg-slate-900/90 text-slate-400 uppercase font-bold border-b border-slate-700">
          <tr>
            <th className="p-3">Quote ID</th>
            <th className="p-3">Customer Name</th>
            <th className="p-3">Route (Origin → Destination)</th>
            <th className="p-3">Weight &amp; Service</th>
            <th className="p-3">Est. Cost</th>
            <th className="p-3">Request Date</th>
            <th className="p-3">Status</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/50 font-medium">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <tr key={idx} className="animate-pulse">
                <td className="p-3">
                  <div className="h-4 bg-slate-800 rounded w-16"></div>
                </td>
                <td className="p-3">
                  <div className="h-4 bg-slate-800 rounded w-28"></div>
                </td>
                <td className="p-3">
                  <div className="h-4 bg-slate-800 rounded w-36"></div>
                </td>
                <td className="p-3">
                  <div className="h-4 bg-slate-800 rounded w-28"></div>
                </td>
                <td className="p-3">
                  <div className="h-4 bg-slate-800 rounded w-16"></div>
                </td>
                <td className="p-3">
                  <div className="h-4 bg-slate-800 rounded w-20"></div>
                </td>
                <td className="p-3">
                  <div className="h-5 bg-slate-800 rounded-full w-16"></div>
                </td>
                <td className="p-3 text-right">
                  <div className="h-7 bg-slate-800 rounded w-20 ml-auto"></div>
                </td>
              </tr>
            ))
          ) : quotes.length === 0 ? (
            <tr>
              <td
                colSpan={8}
                className="p-8 text-center text-slate-400 font-semibold space-y-2"
              >
                <i className="fa-solid fa-calculator text-3xl text-slate-600 mb-2 block"></i>
                <p>No quote requests found.</p>
              </td>
            </tr>
          ) : (
            quotes.map((q) => (
              <tr key={q.id} className="hover:bg-slate-800/60 transition">
                {/* Quote ID */}
                <td className="p-3 font-mono font-bold text-emerald-400">{q.id}</td>

                {/* Customer Name & Contact */}
                <td className="p-3">
                  <div className="flex flex-col">
                    <span className="font-bold text-white">{q.name}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{q.email}</span>
                  </div>
                </td>

                {/* Route */}
                <td className="p-3">
                  <div className="flex items-center gap-1.5 font-bold text-slate-200">
                    <span>{q.origin_country}</span>
                    <i className="fa-solid fa-arrow-right text-[10px] text-slate-500"></i>
                    <span className="text-white">{q.destination_country}</span>
                  </div>
                </td>

                {/* Weight & Service */}
                <td className="p-3">
                  <div className="flex flex-col">
                    <span className="font-extrabold text-white font-mono">{q.weight_kg} kg</span>
                    <span className="text-[11px] text-slate-400">{q.service_type}</span>
                  </div>
                </td>

                {/* Estimated Cost */}
                <td className="p-3">
                  <span className="font-extrabold text-white font-mono bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                    {q.estimated_cost || "Custom"}
                  </span>
                </td>

                {/* Request Date */}
                <td className="p-3 font-mono text-[11px] text-slate-400">
                  {q.created_at}
                </td>

                {/* Status */}
                <td className="p-3">
                  <StatusBadge status={q.status} />
                </td>

                {/* Actions */}
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onView(q)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                      title="View Quote Details"
                    >
                      <i className="fa-solid fa-eye text-xs"></i>
                    </button>
                    <button
                      onClick={() => onReply(q)}
                      className="p-1.5 rounded-lg bg-blue-950/60 hover:bg-blue-900/80 text-blue-300 transition"
                      title="Reply Quote"
                    >
                      <i className="fa-solid fa-reply text-xs"></i>
                    </button>
                    <button
                      onClick={() => onArchive(q.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 transition"
                      title="Archive Quote"
                    >
                      <i className="fa-solid fa-box-archive text-xs"></i>
                    </button>
                    <button
                      onClick={() => onDelete(q.id)}
                      className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-400 transition"
                      title="Delete Quote"
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

export default QuoteTable;
