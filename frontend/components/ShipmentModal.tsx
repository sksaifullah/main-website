"use client";

import React from "react";
import { ShipmentDetailsData } from "@/types/tracking";
import { CreateShipmentPayload } from "@/services/shipment";
import ShipmentForm from "./ShipmentForm";

export type ModalMode = "create" | "edit" | "view" | null;

interface ShipmentModalProps {
  isOpen: boolean;
  mode: ModalMode;
  shipment: ShipmentDetailsData | null;
  onClose: () => void;
  onSubmit: (data: CreateShipmentPayload) => Promise<void>;
  onSync?: (trackingNumber: string) => Promise<void>;
  isSubmitting?: boolean;
}

export const ShipmentModal: React.FC<ShipmentModalProps> = ({
  isOpen,
  mode,
  shipment,
  onClose,
  onSubmit,
  isSubmitting = false,
}) => {
  if (!isOpen || !mode) return null;

  const trackingId =
    shipment?.partner_tracking_number || shipment?.tracking_number || "";

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
                    ? "fa-plus"
                    : mode === "edit"
                    ? "fa-pen-to-square"
                    : "fa-eye"
                } text-sm`}
              ></i>
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">
                {mode === "create" && "New Express Shipment Registration"}
                {mode === "edit" && `Edit Shipment Record (${trackingId})`}
                {mode === "view" && `Shipment Audit & Tracking (${trackingId})`}
              </h3>
              <p className="text-[11px] text-slate-400">
                {mode === "create" && "Register a new shipment for live carrier sync"}
                {mode === "edit" && "Modify shipment route, status, or recipient details"}
                {mode === "view" && "View live tracking status and complete audit history"}
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
          {mode === "view" && shipment ? (
            <div className="space-y-6 text-xs text-slate-300">
              {/* Top Overview Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">
                    Partner Courier
                  </p>
                  <p className="text-sm font-extrabold text-white mt-0.5">
                    {shipment.partner_courier || "DHL"}
                  </p>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">
                    Current Status
                  </p>
                  <p className="text-sm font-extrabold text-emerald-400 mt-0.5">
                    {shipment.status || "Booked"}
                  </p>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">
                    Package Weight
                  </p>
                  <p className="text-sm font-extrabold text-white mt-0.5 font-mono">
                    {shipment.weight || "1.0 kg"}
                  </p>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">
                    Pieces
                  </p>
                  <p className="text-sm font-extrabold text-white mt-0.5">
                    {shipment.pieces || 1}
                  </p>
                </div>
              </div>

              {/* Sender & Receiver Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
                <div>
                  <h4 className="font-bold text-white mb-1.5 flex items-center gap-2">
                    <i className="fa-solid fa-user-ninja text-[#005DC3]"></i> Sender / Customer
                  </h4>
                  <p className="font-bold text-slate-200">
                    {shipment.customer_name || shipment.sender_name || "Valued Customer"}
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    Origin: {shipment.origin || "Mumbai Hub"}
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1.5 flex items-center gap-2">
                    <i className="fa-solid fa-location-dot text-emerald-400"></i> Receiver / Consignee
                  </h4>
                  <p className="font-bold text-slate-200">
                    {shipment.receiver_name || "Consignee"}
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    Destination: {shipment.destination || "International"}
                  </p>
                </div>
              </div>

              {/* Timeline Audit History */}
              <div>
                <h4 className="font-bold text-white mb-3 text-sm flex items-center gap-2">
                  <i className="fa-solid fa-clock-rotate-left text-[#005DC3]"></i> Tracking History Timeline
                </h4>
                {shipment.history && shipment.history.length > 0 ? (
                  <div className="space-y-3 relative pl-4 border-l-2 border-slate-700 ml-2">
                    {shipment.history.map((event, idx) => (
                      <div key={idx} className="relative group">
                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#005DC3] ring-4 ring-slate-900"></div>
                        <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-white">
                              {event.stage || event.status || "Status Event"}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {event.timestamp || event.date || ""}
                            </span>
                          </div>
                          {event.location && (
                            <p className="text-[11px] text-slate-400">
                              Location: {event.location}
                            </p>
                          )}
                          {event.details && (
                            <p className="text-[11px] text-slate-300">
                              {event.details}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-xs italic bg-slate-800/40 p-4 rounded-xl text-center">
                    No explicit tracking timeline events logged yet.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <ShipmentForm
              initialData={mode === "edit" ? shipment : null}
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

export default ShipmentModal;
