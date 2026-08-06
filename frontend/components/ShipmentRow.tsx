"use client";

import React, { useState } from "react";
import { ShipmentDetailsData } from "@/types/tracking";

interface ShipmentRowProps {
  shipment: ShipmentDetailsData;
  isSelected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
  onView: (shipment: ShipmentDetailsData) => void;
  onEdit: (shipment: ShipmentDetailsData) => void;
  onSync: (trackingId: string) => Promise<void>;
  onDelete: (trackingId: string) => Promise<void>;
  onStatusChange?: (trackingId: string, status: string) => Promise<void>;
}

export const ShipmentRow: React.FC<ShipmentRowProps> = ({
  shipment,
  isSelected = false,
  onSelect,
  onView,
  onEdit,
  onSync,
  onDelete,
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const trackingId =
    shipment.partner_tracking_number || shipment.tracking_number || "";
  const partnerCourier = shipment.partner_courier || "Partner Express";
  const customerName = shipment.customer_name || shipment.sender_name || "Valued Customer";
  const status = shipment.status || "Booked";

  const getStatusBadgeClass = (st: string) => {
    const s = st.toLowerCase();
    if (s === "delivered")
      return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
    if (s.includes("transit") || s.includes("flight") || s.includes("out for delivery"))
      return "bg-blue-500/20 text-blue-300 border-blue-500/40";
    if (s === "picked up" || s === "booked")
      return "bg-amber-500/20 text-amber-300 border-amber-500/40";
    if (s === "cancelled" || s.includes("exception"))
      return "bg-red-500/20 text-red-300 border-red-500/40";
    return "bg-slate-700/50 text-slate-300 border-slate-600";
  };

  const getCourierColorClass = (courier: string) => {
    const c = courier.toLowerCase();
    if (c.includes("dhl")) return "bg-amber-500/20 text-amber-400 border-amber-500/40";
    if (c.includes("fedex")) return "bg-purple-500/20 text-purple-300 border-purple-500/40";
    if (c.includes("ups")) return "bg-yellow-600/20 text-yellow-300 border-yellow-600/40";
    if (c.includes("aramex")) return "bg-red-500/20 text-red-400 border-red-500/40";
    return "bg-blue-900/30 text-blue-300 border-blue-800";
  };

  const handleSyncClick = async () => {
    try {
      setIsSyncing(true);
      await onSync(trackingId);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDeleteClick = async () => {
    if (!confirm(`Are you sure you want to delete shipment ${trackingId}?`)) {
      return;
    }
    try {
      setIsDeleting(true);
      await onDelete(trackingId);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <tr
      className={`hover:bg-slate-800/60 transition divide-y-0 ${
        isSelected ? "bg-blue-950/30" : ""
      }`}
    >
      {/* Checkbox */}
      <td className="p-3 w-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect && onSelect(trackingId, e.target.checked)}
          className="rounded border-slate-700 bg-slate-900 text-[#005DC3] focus:ring-[#005DC3] cursor-pointer"
        />
      </td>

      {/* Partner Tracking No & Courier */}
      <td className="p-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase border ${getCourierColorClass(
                partnerCourier
              )}`}
            >
              {partnerCourier}
            </span>
          </div>
          <span className="font-mono font-bold text-white text-xs tracking-wider">
            {trackingId}
          </span>
        </div>
      </td>

      {/* Customer Details */}
      <td className="p-3">
        <div className="flex flex-col">
          <span className="font-bold text-white text-xs">{customerName}</span>
          <span className="text-[11px] text-slate-400">
            Receiver: {shipment.receiver_name || "Consignee"}
          </span>
          {shipment.phone && (
            <span className="text-[10px] text-slate-500">{shipment.phone}</span>
          )}
        </div>
      </td>

      {/* Route */}
      <td className="p-3">
        <div className="flex flex-col text-xs">
          <span className="font-semibold text-slate-200">
            {shipment.origin || "Origin"}
          </span>
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <i className="fa-solid fa-arrow-down text-[9px] text-[#005DC3]"></i>{" "}
            {shipment.destination || "Destination"}
          </span>
        </div>
      </td>

      {/* Package & Weight */}
      <td className="p-3">
        <div className="flex flex-col text-xs">
          <span className="text-slate-300 font-medium">
            {shipment.package_type || shipment.service || "Express Parcel"}
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            {shipment.weight || "1.0 kg"}{" "}
            {shipment.pieces ? `(${shipment.pieces} pcs)` : ""}
          </span>
        </div>
      </td>

      {/* Status */}
      <td className="p-3">
        <div className="flex flex-col gap-1">
          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold border inline-block w-max ${getStatusBadgeClass(
              status
            )}`}
          >
            {status}
          </span>
          {shipment.estimated_delivery && (
            <span className="text-[10px] text-slate-400">
              Est: {shipment.estimated_delivery}
            </span>
          )}
        </div>
      </td>

      {/* Live Sync Status */}
      <td className="p-3">
        <div className="flex items-center gap-1.5 text-[11px]">
          {shipment.is_live_synced ? (
            <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Sync
            </span>
          ) : shipment.manual_override ? (
            <span className="inline-flex items-center gap-1 text-amber-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Manual Override
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-slate-500"></span>
              Standard
            </span>
          )}
        </div>
      </td>

      {/* Actions */}
      <td className="p-3 text-right">
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => onView(shipment)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="View Details"
          >
            <i className="fa-solid fa-eye text-xs"></i>
          </button>
          <button
            onClick={() => onEdit(shipment)}
            className="p-1.5 rounded-lg bg-blue-950/60 hover:bg-blue-900/80 text-blue-300 transition"
            title="Edit Shipment"
          >
            <i className="fa-solid fa-pen-to-square text-xs"></i>
          </button>
          <button
            onClick={handleSyncClick}
            disabled={isSyncing}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 transition disabled:opacity-50"
            title="Sync with Partner API"
          >
            <i
              className={`fa-solid fa-arrows-rotate text-xs ${
                isSyncing ? "animate-spin" : ""
              }`}
            ></i>
          </button>
          <button
            onClick={handleDeleteClick}
            disabled={isDeleting}
            className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-400 transition disabled:opacity-50"
            title="Delete Shipment"
          >
            <i className="fa-solid fa-trash text-xs"></i>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ShipmentRow;
