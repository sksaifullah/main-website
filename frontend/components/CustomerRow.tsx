"use client";

import React, { useState } from "react";
import { CustomerRecord } from "@/services/customer";

interface CustomerRowProps {
  customer: CustomerRecord;
  isSelected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
  onView: (customer: CustomerRecord) => void;
  onEdit: (customer: CustomerRecord) => void;
  onDelete: (id: string) => Promise<void>;
}

export const CustomerRow: React.FC<CustomerRowProps> = ({
  customer,
  isSelected = false,
  onSelect,
  onView,
  onEdit,
  onDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const getStatusBadgeClass = (st: string) => {
    switch (st) {
      case "VIP":
        return "bg-purple-500/20 text-purple-300 border-purple-500/40";
      case "Active":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
      case "Pending":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40";
      case "Inactive":
      default:
        return "bg-slate-700/50 text-slate-400 border-slate-600";
    }
  };

  const handleDeleteClick = async () => {
    if (!confirm(`Are you sure you want to delete customer ${customer.name}?`)) {
      return;
    }
    try {
      setIsDeleting(true);
      await onDelete(customer.id);
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
          onChange={(e) => onSelect && onSelect(customer.id, e.target.checked)}
          className="rounded border-slate-700 bg-slate-900 text-[#005DC3] focus:ring-[#005DC3] cursor-pointer"
        />
      </td>

      {/* Customer Name & Company */}
      <td className="p-3">
        <div className="flex flex-col">
          <span className="font-extrabold text-white text-xs flex items-center gap-1.5">
            {customer.name}
            {customer.status === "VIP" && (
              <i className="fa-solid fa-crown text-amber-400 text-[10px]" title="VIP Account"></i>
            )}
          </span>
          <span className="text-[11px] text-slate-400 font-medium">
            {customer.company}
          </span>
        </div>
      </td>

      {/* Contact Info (Phone & Email) */}
      <td className="p-3">
        <div className="flex flex-col text-xs">
          <span className="text-slate-200 font-mono text-[11px]">
            {customer.phone || "—"}
          </span>
          <span className="text-[11px] text-slate-400">
            {customer.email || "—"}
          </span>
        </div>
      </td>

      {/* Location (Country & Address) */}
      <td className="p-3">
        <div className="flex flex-col text-xs">
          <span className="font-bold text-slate-200">{customer.country}</span>
          <span className="text-[10px] text-slate-400 truncate max-w-[160px]">
            {customer.address || "—"}
          </span>
        </div>
      </td>

      {/* Total Shipments */}
      <td className="p-3 text-center">
        <span className="font-extrabold text-white text-xs bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
          {customer.total_shipments}
        </span>
      </td>

      {/* Last Shipment */}
      <td className="p-3">
        <span className="text-xs text-slate-300 font-mono">
          {customer.last_shipment}
        </span>
      </td>

      {/* Status Pill */}
      <td className="p-3">
        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border inline-block ${getStatusBadgeClass(
            customer.status
          )}`}
        >
          {customer.status}
        </span>
      </td>

      {/* Created Date */}
      <td className="p-3">
        <span className="text-[11px] text-slate-400 font-mono">
          {customer.created_date}
        </span>
      </td>

      {/* Actions */}
      <td className="p-3 text-right">
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => onView(customer)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="View Customer Profile"
          >
            <i className="fa-solid fa-eye text-xs"></i>
          </button>
          <button
            onClick={() => onEdit(customer)}
            className="p-1.5 rounded-lg bg-blue-950/60 hover:bg-blue-900/80 text-blue-300 transition"
            title="Edit Customer"
          >
            <i className="fa-solid fa-pen-to-square text-xs"></i>
          </button>
          <button
            onClick={handleDeleteClick}
            disabled={isDeleting}
            className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-400 transition disabled:opacity-50"
            title="Delete Customer"
          >
            <i className="fa-solid fa-trash text-xs"></i>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default CustomerRow;
