"use client";

import React from "react";
import { CustomerRecord, CreateCustomerPayload } from "@/services/customer";
import CustomerForm from "./CustomerForm";

export type CustomerModalMode = "create" | "edit" | "view" | null;

interface CustomerDetailsModalProps {
  isOpen?: boolean;
  mode: CustomerModalMode;
  customer: CustomerRecord | null;
  onClose: () => void;
  onSubmit: (data: CreateCustomerPayload) => Promise<void>;
  isSubmitting?: boolean;
}

export const CustomerDetailsModal: React.FC<CustomerDetailsModalProps> = ({
  isOpen = true,
  mode,
  customer,
  onClose,
  onSubmit,
  isSubmitting = false,
}) => {
  if (!isOpen || !mode) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#005DC3]/20 border border-[#005DC3]/40 flex items-center justify-center text-[#005DC3]">
              <i
                className={`fa-solid ${
                  mode === "create"
                    ? "fa-user-plus"
                    : mode === "edit"
                    ? "fa-pen-to-square"
                    : "fa-user"
                } text-sm`}
              ></i>
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">
                {mode === "create" && "New Customer Registration"}
                {mode === "edit" && `Edit Customer Profile (${customer?.name})`}
                {mode === "view" && `Customer Account Profile (${customer?.name})`}
              </h3>
              <p className="text-[11px] text-slate-400">
                {mode === "create" && "Add new customer account & contact details"}
                {mode === "edit" && "Update customer address, phone, email, or status"}
                {mode === "view" && "View customer statistics, address, and account status"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition flex items-center justify-center"
          >
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {mode === "view" && customer ? (
            <div className="space-y-6 text-xs text-slate-300">
              {/* Top Overview Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">
                    Account Status
                  </p>
                  <p className="text-sm font-extrabold text-emerald-400 mt-0.5">
                    {customer.status}
                  </p>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">
                    Total Shipments
                  </p>
                  <p className="text-sm font-extrabold text-white mt-0.5 font-mono">
                    {customer.total_shipments}
                  </p>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">
                    Country
                  </p>
                  <p className="text-sm font-extrabold text-white mt-0.5">
                    {customer.country}
                  </p>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">
                    Registered On
                  </p>
                  <p className="text-sm font-extrabold text-slate-300 mt-0.5 font-mono">
                    {customer.created_date}
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800 space-y-3">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <i className="fa-solid fa-address-card text-[#005DC3]"></i> Contact &amp; Company Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                      Company / Firm
                    </span>
                    <p className="font-bold text-white text-sm mt-0.5">
                      {customer.company}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                      Phone Number
                    </span>
                    <p className="font-bold text-white text-sm mt-0.5 font-mono">
                      {customer.phone || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                      Email Address
                    </span>
                    <p className="font-bold text-white text-sm mt-0.5">
                      {customer.email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                      Last Shipment Date
                    </span>
                    <p className="font-bold text-white text-sm mt-0.5 font-mono">
                      {customer.last_shipment}
                    </p>
                  </div>
                </div>
              </div>

              {/* Physical Address */}
              <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
                <h4 className="font-bold text-white mb-1.5 flex items-center gap-2">
                  <i className="fa-solid fa-location-dot text-emerald-400"></i> Office / Dispatch Address
                </h4>
                <p className="text-slate-300 font-medium text-xs">
                  {customer.address || "No primary address registered."}
                </p>
              </div>
            </div>
          ) : (
            <CustomerForm
              initialData={mode === "edit" ? customer : null}
              onSubmit={onSubmit}
              onCancel={onClose}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsModal;
