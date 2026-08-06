"use client";

import React from "react";
import { QuoteRequestItem } from "@/services/messages";
import StatusBadge from "./StatusBadge";

interface QuoteDetailsProps {
  isOpen?: boolean;
  quote: QuoteRequestItem | null;
  onClose: () => void;
  onOpenReply?: (quote: QuoteRequestItem) => void;
  onReply?: () => void;
  onArchive?: () => void;
}

export const QuoteDetails: React.FC<QuoteDetailsProps> = ({
  isOpen = true,
  quote,
  onClose,
  onOpenReply,
  onReply,
}) => {
  if (!isOpen || !quote) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-950/60 border border-purple-800/60 flex items-center justify-center text-purple-400">
              <i className="fa-solid fa-calculator text-sm"></i>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-base">
                  Quote Request ({quote.id})
                </h3>
                <StatusBadge status={quote.status} />
              </div>
              <p className="text-[11px] text-slate-400">Requested on {quote.created_at}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition flex items-center justify-center"
          >
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs text-slate-300">
          {/* Route Overview */}
          <div className="bg-gradient-to-r from-blue-950/60 to-purple-950/60 p-4 rounded-2xl border border-blue-800/60 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] text-blue-300 font-bold uppercase">Origin</p>
              <p className="text-base font-extrabold text-white">{quote.origin_country}</p>
            </div>
            <div className="flex flex-col items-center">
              <i className="fa-solid fa-plane text-emerald-400 text-base"></i>
              <span className="text-[10px] text-slate-400 font-mono mt-1">
                {quote.service_type}
              </span>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-[10px] text-purple-300 font-bold uppercase">Destination</p>
              <p className="text-base font-extrabold text-white">{quote.destination_country}</p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">
                Customer Name
              </span>
              <p className="font-bold text-white text-sm mt-0.5">{quote.name}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">
                Email Address
              </span>
              <p className="font-bold text-slate-200 mt-0.5 font-mono">{quote.email}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">
                Phone Number
              </span>
              <p className="font-bold text-slate-200 mt-0.5 font-mono">
                {quote.phone || "N/A"}
              </p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">
                Package Weight
              </span>
              <p className="font-extrabold text-emerald-400 text-sm mt-0.5 font-mono">
                {quote.weight_kg} kg
              </p>
            </div>
          </div>

          {/* Item Description */}
          {(quote.item_description || quote.package_contents) && (
            <div className="space-y-1">
              <label className="block text-slate-400 font-bold uppercase text-[10px]">
                Shipment Description &amp; Content Notes
              </label>
              <p className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs">
                {quote.item_description || quote.package_contents}
              </p>
            </div>
          )}

          {/* Estimated Cost */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="font-bold text-slate-300">Estimated Rate Quote:</span>
            <span className="text-lg font-extrabold text-white font-mono">
              {quote.estimated_cost || "Custom Rate Quote"}
            </span>
          </div>

          {/* Reply History */}
          {quote.reply && (
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <label className="block text-emerald-400 font-bold uppercase text-[10px] flex items-center gap-1.5">
                <i className="fa-solid fa-reply text-xs"></i> Official Quote Sent on {quote.replied_at}
              </label>
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/60 text-emerald-200 font-normal text-xs leading-relaxed">
                {quote.reply}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-end gap-3 bg-slate-950/60">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              if (onOpenReply) onOpenReply(quote);
              if (onReply) onReply();
            }}
            className="btn-primary text-xs py-2 px-4 shadow-lg flex items-center gap-2"
          >
            <i className="fa-solid fa-reply"></i> Send Official Quote Response
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuoteDetails;
