"use client";

import React from "react";
import { ShipmentDetailsData } from "@/types/tracking";
import ShipmentRow from "./ShipmentRow";

interface ShipmentTableProps {
  shipments: ShipmentDetailsData[];
  isLoading?: boolean;
  selectedIds: string[];
  onSelectAll: (selected: boolean) => void;
  onSelectRow: (id: string, selected: boolean) => void;
  onView: (shipment: ShipmentDetailsData) => void;
  onEdit: (shipment: ShipmentDetailsData) => void;
  onSync: (trackingId: string) => Promise<void>;
  onDelete: (trackingId: string) => Promise<void>;
  onStatusChange?: (trackingId: string, status: string) => Promise<void>;
}

export const ShipmentTable: React.FC<ShipmentTableProps> = ({
  shipments,
  isLoading = false,
  selectedIds,
  onSelectAll,
  onSelectRow,
  onView,
  onEdit,
  onSync,
  onDelete,
  onStatusChange,
}) => {
  const allIds = shipments.map(
    (s) => s.partner_tracking_number || s.tracking_number || ""
  );
  const isAllSelected =
    allIds.length > 0 && allIds.every((id) => selectedIds.includes(id));

  return (
    <div className="overflow-x-auto w-full max-w-full rounded-xl border border-slate-700/60 bg-slate-900/60">
      <table className="w-full min-w-[900px] text-left text-xs text-slate-300">
        <thead className="bg-slate-900/90 text-slate-400 uppercase font-bold border-b border-slate-700">
          <tr>
            <th className="p-3 w-10">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-[#005DC3] focus:ring-[#005DC3] cursor-pointer"
              />
            </th>
            <th className="p-3">Partner Tracking No &amp; Courier</th>
            <th className="p-3">Customer Details</th>
            <th className="p-3">Route</th>
            <th className="p-3">Package &amp; Weight</th>
            <th className="p-3">Status</th>
            <th className="p-3">Live Connection</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/50 font-medium">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <tr key={index} className="animate-pulse">
                <td className="p-3">
                  <div className="w-4 h-4 bg-slate-800 rounded"></div>
                </td>
                <td className="p-3">
                  <div className="h-4 bg-slate-800 rounded w-28 mb-1"></div>
                  <div className="h-3 bg-slate-800/60 rounded w-20"></div>
                </td>
                <td className="p-3">
                  <div className="h-4 bg-slate-800 rounded w-32 mb-1"></div>
                  <div className="h-3 bg-slate-800/60 rounded w-24"></div>
                </td>
                <td className="p-3">
                  <div className="h-4 bg-slate-800 rounded w-24 mb-1"></div>
                  <div className="h-3 bg-slate-800/60 rounded w-20"></div>
                </td>
                <td className="p-3">
                  <div className="h-4 bg-slate-800 rounded w-20 mb-1"></div>
                  <div className="h-3 bg-slate-800/60 rounded w-16"></div>
                </td>
                <td className="p-3">
                  <div className="h-6 bg-slate-800 rounded-full w-20"></div>
                </td>
                <td className="p-3">
                  <div className="h-4 bg-slate-800 rounded w-16"></div>
                </td>
                <td className="p-3 text-right">
                  <div className="h-7 bg-slate-800 rounded w-24 ml-auto"></div>
                </td>
              </tr>
            ))
          ) : shipments.length === 0 ? (
            <tr>
              <td
                colSpan={8}
                className="p-8 text-center text-slate-400 font-semibold space-y-2"
              >
                <i className="fa-solid fa-box-open text-3xl text-slate-600 mb-2 block"></i>
                <p>No shipments found matching your search filters.</p>
                <p className="text-xs text-slate-500 font-normal">
                  Try adjusting your search terms or clearing the status/courier filters.
                </p>
              </td>
            </tr>
          ) : (
            shipments.map((shipment, idx) => {
              const id =
                shipment.partner_tracking_number ||
                shipment.tracking_number ||
                `shipment-${idx}`;
              return (
                <ShipmentRow
                  key={id}
                  shipment={shipment}
                  isSelected={selectedIds.includes(id)}
                  onSelect={onSelectRow}
                  onView={onView}
                  onEdit={onEdit}
                  onSync={onSync}
                  onDelete={onDelete}
                  onStatusChange={onStatusChange}
                />
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ShipmentTable;
