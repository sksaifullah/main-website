"use client";

import React from "react";
import { CustomerRecord } from "@/services/customer";
import CustomerRow from "./CustomerRow";

interface CustomerTableProps {
  customers: CustomerRecord[];
  isLoading?: boolean;
  selectedIds: string[];
  onSelectAll: (selected: boolean) => void;
  onSelectRow: (id: string, selected: boolean) => void;
  onView: (customer: CustomerRecord) => void;
  onEdit: (customer: CustomerRecord) => void;
  onDelete: (id: string) => Promise<void>;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  isLoading = false,
  selectedIds,
  onSelectAll,
  onSelectRow,
  onView,
  onEdit,
  onDelete,
}) => {
  const allIds = customers.map((c) => c.id);
  const isAllSelected =
    allIds.length > 0 && allIds.every((id) => selectedIds.includes(id));

  return (
    <div className="overflow-x-auto w-full max-w-full rounded-xl border border-slate-700/60 bg-slate-900/60">
      <table className="w-full min-w-[950px] text-left text-xs text-slate-300">
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
            <th className="p-3">Customer &amp; Company</th>
            <th className="p-3">Phone &amp; Email</th>
            <th className="p-3">Country &amp; Address</th>
            <th className="p-3 text-center">Shipments</th>
            <th className="p-3">Last Shipment</th>
            <th className="p-3">Status</th>
            <th className="p-3">Created Date</th>
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
                  <div className="h-4 bg-slate-800 rounded w-24 mb-1"></div>
                  <div className="h-3 bg-slate-800/60 rounded w-28"></div>
                </td>
                <td className="p-3">
                  <div className="h-4 bg-slate-800 rounded w-20 mb-1"></div>
                  <div className="h-3 bg-slate-800/60 rounded w-32"></div>
                </td>
                <td className="p-3 text-center">
                  <div className="h-5 bg-slate-800 rounded w-8 mx-auto"></div>
                </td>
                <td className="p-3">
                  <div className="h-4 bg-slate-800 rounded w-20"></div>
                </td>
                <td className="p-3">
                  <div className="h-6 bg-slate-800 rounded-full w-16"></div>
                </td>
                <td className="p-3">
                  <div className="h-4 bg-slate-800 rounded w-20"></div>
                </td>
                <td className="p-3 text-right">
                  <div className="h-7 bg-slate-800 rounded w-20 ml-auto"></div>
                </td>
              </tr>
            ))
          ) : customers.length === 0 ? (
            <tr>
              <td
                colSpan={9}
                className="p-8 text-center text-slate-400 font-semibold space-y-2"
              >
                <i className="fa-solid fa-users-slash text-3xl text-slate-600 mb-2 block"></i>
                <p>No customer records found matching your filters.</p>
                <p className="text-xs text-slate-500 font-normal">
                  Try clearing the search query or adjusting status/country filters.
                </p>
              </td>
            </tr>
          ) : (
            customers.map((c) => (
              <CustomerRow
                key={c.id}
                customer={c}
                isSelected={selectedIds.includes(c.id)}
                onSelect={onSelectRow}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;
