"use client";

import React from "react";
import { ShipmentDetailsData } from "../../types/tracking";

interface TrackingStatusCardProps {
  data: ShipmentDetailsData;
}

export const TrackingStatusCard: React.FC<TrackingStatusCardProps> = ({ data }) => {
  const isDelivered =
    data.status_code === "DELIVERED" || (data.status || "").toLowerCase() === "delivered";
  const courierName = data.partner_courier || "Partner Courier";
  const isLiveSynced = Boolean(data.is_live_synced && !data.manual_override);

  const headerTitle = isLiveSynced
    ? "Official Courier Live Tracking"
    : "Sky Worldwide Express Tracking";
  const trackingNumberLabel = isLiveSynced
    ? `${courierName} Official Tracking Number`
    : `Sky Worldwide Tracking Number (${courierName})`;

  return (
    <div className="bg-gradient-to-r from-slate-900 via-[#00398A] to-[#005DC3] rounded-3xl p-6 sm:p-8 text-white mb-6 shadow-xl relative overflow-hidden animate-fade-in">
      <div className="relative z-10 flex flex-wrap justify-between items-start gap-4">
        <div>
          <span className="text-xs font-bold text-blue-300 uppercase tracking-widest block mb-1">
            {headerTitle}
          </span>
          <p className="text-xs font-semibold text-blue-200 uppercase tracking-wider">
            {trackingNumberLabel}
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 text-white font-mono">
            {data.tracking_number}
          </h2>
          <p className="text-xs text-blue-100 mt-2 flex items-center gap-2">
            <i className="fa-solid fa-plane-up"></i> {data.service}{" "}
            {data.weight && (
              <>
                • <span className="font-bold">{data.weight}</span>
              </>
            )}
          </p>
        </div>

        <div className="text-right">
          <span
            className={`inline-block text-xs sm:text-sm font-extrabold px-4 py-2 rounded-full ${
              isDelivered
                ? "bg-emerald-500 text-white"
                : "bg-amber-400 text-slate-950"
            } shadow-lg mb-2`}
          >
            {data.status}
          </span>
          <p className="text-xs text-blue-200 font-medium">
            Est. Delivery:{" "}
            <strong className="text-white text-sm">{data.estimated_delivery}</strong>
          </p>
          {data.current_location && (
            <p className="text-xs text-blue-200 mt-1">
              Current Location: <strong className="text-white">{data.current_location}</strong>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
