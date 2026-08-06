"use client";

import React from "react";
import { ShipmentDetailsData } from "../../types/tracking";

interface ShipmentDetailsProps {
  data: ShipmentDetailsData;
}

export const ShipmentDetails: React.FC<ShipmentDetailsProps> = ({ data }) => {
  return (
    <div className="space-y-6 mb-8">
      {/* Route Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-3xl bg-blue-50/60 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700 shadow-sm text-sm">
        {/* Origin */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950 text-[#005DC3] dark:text-blue-300 flex items-center justify-center font-bold flex-shrink-0">
            <i className="fa-solid fa-location-arrow text-base"></i>
          </div>
          <div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              Sender / Origin
            </p>
            <p className="font-extrabold text-slate-900 dark:text-white text-base">
              {data.origin}
            </p>
            {data.sender_name && (
              <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold mt-0.5">
                <i className="fa-solid fa-user text-slate-400 mr-1"></i> {data.sender_name}
              </p>
            )}
          </div>
        </div>

        {/* Destination */}
        <div className="flex items-start gap-3 border-t sm:border-t-0 sm:border-l border-blue-100 dark:border-slate-700 pt-4 sm:pt-0 sm:pl-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold flex-shrink-0">
            <i className="fa-solid fa-flag-checkered text-base"></i>
          </div>
          <div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              Receiver / Destination
            </p>
            <p className="font-extrabold text-slate-900 dark:text-white text-base">
              {data.destination}
            </p>
            {data.receiver_name && (
              <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold mt-0.5">
                <i className="fa-solid fa-user-check text-slate-400 mr-1"></i> {data.receiver_name}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Package Specs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Carrier Partner
          </span>
          <span className="text-sm font-bold text-slate-900 dark:text-white mt-1 block">
            {data.partner_courier || "Sky Express"}
          </span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Service Type
          </span>
          <span className="text-sm font-bold text-slate-900 dark:text-white mt-1 block">
            {data.service || "Express Air"}
          </span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Package Weight
          </span>
          <span className="text-sm font-bold text-slate-900 dark:text-white mt-1 block">
            {data.weight || "N/A"}
          </span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Pieces / Quantity
          </span>
          <span className="text-sm font-bold text-slate-900 dark:text-white mt-1 block">
            {data.pieces ? `${data.pieces} Box(es)` : "1 Piece"}
          </span>
        </div>
      </div>

      {/* Proof of Delivery Card if available */}
      {data.proof_of_delivery && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs font-semibold text-emerald-900 dark:text-emerald-200 flex items-center gap-3">
          <i className="fa-solid fa-file-signature text-emerald-600 dark:text-emerald-400 text-xl"></i>
          <div>
            <p className="font-bold text-sm">Proof of Delivery Verified</p>
            <p className="text-emerald-700 dark:text-emerald-300">{data.proof_of_delivery}</p>
          </div>
        </div>
      )}
    </div>
  );
};
