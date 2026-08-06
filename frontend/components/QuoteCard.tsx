"use client";

import React from "react";
import { QuoteRequestItem } from "@/types";
import StatusBadge from "./StatusBadge";

interface QuoteCardProps {
  quote: QuoteRequestItem;
  onView: (quote: QuoteRequestItem) => void;
  onReply: (quote: QuoteRequestItem) => void;
  onArchive?: (id: string) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({
  quote,
  onView,
  onReply,
  onArchive,
  onDelete,
}) => {
  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-5 shadow-xl space-y-4 hover:border-slate-600 transition flex flex-col justify-between">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-emerald-400 font-bold text-xs">{quote.id}</span>
            <span className="px-2 py-0.5 rounded-full bg-purple-950/60 text-purple-300 font-bold text-[10px] border border-purple-800/60">
              Quote Request
            </span>
          </div>
          <StatusBadge status={quote.status} />
        </div>

        {/* Customer Info */}
        <div>
          <h4 className="font-extrabold text-white text-sm">{quote.name}</h4>
          <p className="text-[11px] text-slate-400 font-mono">{quote.email}</p>
        </div>

        {/* Route & Weight */}
        <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-300">{quote.origin_country}</span>
            <i className="fa-solid fa-arrow-right text-slate-500 text-xs"></i>
            <span className="font-bold text-white">{quote.destination_country}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800">
            <span className="text-slate-400 font-mono">{quote.service_type}</span>
            <span className="font-extrabold text-emerald-400 font-mono">{quote.weight_kg} kg</span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-700/60 text-xs">
        <span className="font-extrabold text-white font-mono text-sm">
          {quote.estimated_cost || "Custom"}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onView(quote)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="View Details"
          >
            <i className="fa-solid fa-eye text-xs"></i>
          </button>
          <button
            onClick={() => onReply(quote)}
            className="px-2.5 py-1 rounded-lg bg-blue-950/60 hover:bg-blue-900 text-blue-300 font-bold transition flex items-center gap-1 border border-blue-800/60 text-xs"
          >
            <i className="fa-solid fa-reply text-xs"></i> Quote Reply
          </button>
          {onArchive && (
            <button
              onClick={() => onArchive(quote.id)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 transition"
              title="Archive Quote"
            >
              <i className="fa-solid fa-box-archive text-xs"></i>
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(quote.id)}
              className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-400 transition"
              title="Delete Quote"
            >
              <i className="fa-solid fa-trash-can text-xs"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuoteCard;
