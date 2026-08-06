"use client";

import React, { useState } from "react";
import { ShipmentDetailsData } from "@/types/tracking";
import { CreateShipmentPayload } from "@/services/shipment";

interface ShipmentFormProps {
  initialData?: ShipmentDetailsData | null;
  onSubmit: (data: CreateShipmentPayload) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const ShipmentForm: React.FC<ShipmentFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const isEditing = Boolean(initialData);

  const [partnerCourier, setPartnerCourier] = useState(
    initialData?.partner_courier || "DHL"
  );
  const [partnerTrackingNum, setPartnerTrackingNum] = useState(
    initialData?.partner_tracking_number || initialData?.tracking_number || ""
  );
  const [customerName, setCustomerName] = useState(
    initialData?.customer_name || initialData?.sender_name || ""
  );
  const [receiverName, setReceiverName] = useState(
    initialData?.receiver_name || ""
  );
  const phone = initialData?.phone || "";
  const email = initialData?.email || "";
  const [origin, setOrigin] = useState(initialData?.origin || "Mumbai Hub");
  const [destination, setDestination] = useState(
    initialData?.destination || ""
  );
  const [packageType, setPackageType] = useState(
    initialData?.package_type || initialData?.service || "Express Parcel"
  );
  const [weight, setWeight] = useState(initialData?.weight || "1.0 kg");
  const [pieces, setPieces] = useState<number>(initialData?.pieces || 1);
  const [status, setStatus] = useState(initialData?.status || "Booked");
  const [estimatedDelivery, setEstimatedDelivery] = useState(
    initialData?.estimated_delivery || ""
  );
  const [manualOverride, setManualOverride] = useState(
    initialData?.manual_override || false
  );

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!partnerCourier.trim()) {
      errs.partnerCourier = "Partner Courier is required.";
    }
    if (!partnerTrackingNum.trim()) {
      errs.partnerTrackingNum = "Partner Tracking Number is required.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: CreateShipmentPayload = {
      partner_courier: partnerCourier.trim(),
      partner_tracking_number: partnerTrackingNum.trim(),
      customer_name: customerName.trim() || "Valued Customer",
      receiver_name: receiverName.trim() || "Consignee",
      phone: phone.trim(),
      email: email.trim(),
      origin: origin.trim() || "Mumbai Hub",
      destination: destination.trim() || "International Destination",
      package_type: packageType.trim() || "Express Parcel",
      weight: weight.trim() || "1.0 kg",
      pieces: Number(pieces) || 1,
      status: status.trim() || "Booked",
      estimated_delivery: estimatedDelivery.trim(),
      manual_override: manualOverride,
    };

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-[#ffffff] space-y-4 text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Partner Courier */}
        <div>
          <label className="block text-slate-300 font-bold mb-1">
            Partner Courier <span className="text-red-400">*</span>
          </label>
          <select
            value={partnerCourier}
            onChange={(e) => setPartnerCourier(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:border-[#005DC3] focus:ring-1 focus:ring-[#005DC3] outline-none"
          >
            <option value="DHL">DHL Express</option>
            <option value="FedEx">FedEx Express</option>
            <option value="UPS">UPS Courier</option>
            <option value="Aramex">Aramex Express</option>
          </select>
          {errors.partnerCourier && (
            <p className="text-red-400 text-[11px] mt-1">{errors.partnerCourier}</p>
          )}
        </div>

        {/* Partner Tracking Number */}
        <div>
          <label className="block text-slate-300 font-bold mb-1">
            Partner Tracking Number <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={partnerTrackingNum}
            onChange={(e) => setPartnerTrackingNum(e.target.value)}
            disabled={isEditing}
            placeholder="e.g. 7940561073"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-[#005DC3] focus:ring-1 focus:ring-[#005DC3] outline-none disabled:opacity-60"
          />
          {errors.partnerTrackingNum && (
            <p className="text-red-400 text-[11px] mt-1">
              {errors.partnerTrackingNum}
            </p>
          )}
        </div>

        {/* Customer / Sender Name */}
        <div>
          <label className="block text-slate-300 font-bold mb-1">
            Sender / Customer Name
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="e.g. Rajesh Kumar"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:border-[#005DC3] focus:ring-1 focus:ring-[#005DC3] outline-none"
          />
        </div>

        {/* Consignee / Receiver Name */}
        <div>
          <label className="block text-slate-300 font-bold mb-1">
            Receiver / Consignee Name
          </label>
          <input
            type="text"
            value={receiverName}
            onChange={(e) => setReceiverName(e.target.value)}
            placeholder="e.g. John Smith"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:border-[#005DC3] focus:ring-1 focus:ring-[#005DC3] outline-none"
          />
        </div>

        {/* Origin */}
        <div>
          <label className="block text-slate-300 font-bold mb-1">Origin Hub</label>
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="e.g. Mumbai Hub"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:border-[#005DC3] focus:ring-1 focus:ring-[#005DC3] outline-none"
          />
        </div>

        {/* Destination */}
        <div>
          <label className="block text-slate-300 font-bold mb-1">
            Destination Country / City
          </label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="e.g. London, UK"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:border-[#005DC3] focus:ring-1 focus:ring-[#005DC3] outline-none"
          />
        </div>

        {/* Package Type */}
        <div>
          <label className="block text-slate-300 font-bold mb-1">Package Type</label>
          <select
            value={packageType}
            onChange={(e) => setPackageType(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:border-[#005DC3] focus:ring-1 focus:ring-[#005DC3] outline-none"
          >
            <option value="Express Parcel">Express Parcel</option>
            <option value="Medicine Delivery">Medicine Delivery</option>
            <option value="Food Items Delivery">Food Items Delivery</option>
            <option value="Documents">Documents</option>
            <option value="Excess Baggage">Excess Baggage</option>
            <option value="Air Cargo Freight">Air Cargo Freight</option>
          </select>
        </div>

        {/* Weight */}
        <div>
          <label className="block text-slate-300 font-bold mb-1">Weight</label>
          <input
            type="text"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="e.g. 2.5 kg"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:border-[#005DC3] focus:ring-1 focus:ring-[#005DC3] outline-none"
          />
        </div>

        {/* Pieces */}
        <div>
          <label className="block text-slate-300 font-bold mb-1">Number of Pieces</label>
          <input
            type="number"
            min={1}
            value={pieces}
            onChange={(e) => setPieces(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:border-[#005DC3] focus:ring-1 focus:ring-[#005DC3] outline-none"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-slate-300 font-bold mb-1">Current Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:border-[#005DC3] focus:ring-1 focus:ring-[#005DC3] outline-none"
          >
            <option value="Booked">Booked</option>
            <option value="Picked Up">Picked Up</option>
            <option value="In Transit">In Transit</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Estimated Delivery */}
        <div className="sm:col-span-2">
          <label className="block text-slate-300 font-bold mb-1">
            Estimated Delivery Date
          </label>
          <input
            type="text"
            value={estimatedDelivery}
            onChange={(e) => setEstimatedDelivery(e.target.value)}
            placeholder="e.g. Oct 24, 2026, 4:00 PM"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:border-[#005DC3] focus:ring-1 focus:ring-[#005DC3] outline-none"
          />
        </div>

        {/* Manual Override Checkbox */}
        <div className="sm:col-span-2 flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="manual_override_cb"
            checked={manualOverride}
            onChange={(e) => setManualOverride(e.target.checked)}
            className="rounded border-slate-700 bg-slate-900 text-[#005DC3] focus:ring-[#005DC3] cursor-pointer"
          />
          <label
            htmlFor="manual_override_cb"
            className="text-slate-300 text-xs font-semibold cursor-pointer select-none"
          >
            Enable Manual Override (Prevents auto-sync from overwriting manual status updates)
          </label>
        </div>
      </div>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary text-xs py-2 px-5 shadow-lg flex items-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <i className="fa-solid fa-spinner animate-spin"></i> Saving...
            </>
          ) : isEditing ? (
            "Update Shipment"
          ) : (
            "Create Shipment"
          )}
        </button>
      </div>
    </form>
  );
};

export default ShipmentForm;
