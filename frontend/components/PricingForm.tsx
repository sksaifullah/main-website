"use client";

import React, { useState } from "react";
import { PricingRecord, CreatePricingPayload, WeightSlabRate } from "@/services/pricing";
import CountrySelector from "./CountrySelector";
import ZoneSelector from "./ZoneSelector";
import WeightTable from "./WeightTable";

interface PricingFormProps {
  initialData?: PricingRecord | null;
  onSubmit: (payload: CreatePricingPayload) => Promise<void>;
  onCancel?: () => void;
  onClose?: () => void;
  isSubmitting?: boolean;
}

const DEFAULT_SLABS_INITIAL: WeightSlabRate[] = [
  { weight_slab: "0.5 kg", express_rate: 15, economy_rate: 10 },
  { weight_slab: "1.0 kg", express_rate: 25, economy_rate: 18 },
  { weight_slab: "2.0 kg", express_rate: 40, economy_rate: 30 },
  { weight_slab: "5.0 kg", express_rate: 80, economy_rate: 60 },
  { weight_slab: "10.0 kg", express_rate: 140, economy_rate: 105 },
  { weight_slab: "20.0 kg", express_rate: 240, economy_rate: 180 },
  { weight_slab: "50.0+ kg", express_rate: 500, economy_rate: 380 },
];

export const PricingForm: React.FC<PricingFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  onClose,
  isSubmitting = false,
}) => {
  const handleCancelClick = () => {
    if (onCancel) onCancel();
    if (onClose) onClose();
  };
  const isEditing = Boolean(initialData);

  const [country, setCountry] = useState(initialData?.country || "USA");
  const [zone, setZone] = useState(initialData?.zone || "Zone A (North America)");
  const [category, setCategory] = useState(initialData?.category || "Express Air Parcel");
  const [currency, setCurrency] = useState(initialData?.currency || "USD");
  const [currencySymbol, setCurrencySymbol] = useState(initialData?.currency_symbol || "$");
  const [baseExpressPrice, setBaseExpressPrice] = useState<number>(initialData?.base_express_price || 15);
  const [baseEconomyPrice, setBaseEconomyPrice] = useState<number>(initialData?.base_economy_price || 10);
  const [weightSlabs, setWeightSlabs] = useState<WeightSlabRate[]>(
    initialData?.weight_slabs || DEFAULT_SLABS_INITIAL
  );
  const [isActive, setIsActive] = useState<boolean>(initialData?.is_active ?? true);
  const [notes, setNotes] = useState(initialData?.notes || "");

  const handleCountryChange = (cName: string, cZone?: string) => {
    setCountry(cName);
    if (cZone) setZone(cZone);
  };

  const handleCurrencyChange = (curr: string) => {
    setCurrency(curr);
    if (curr === "INR") setCurrencySymbol("₹");
    else if (curr === "USD") setCurrencySymbol("$");
    else if (curr === "EUR") setCurrencySymbol("€");
    else if (curr === "GBP") setCurrencySymbol("£");
    else if (curr === "AED") setCurrencySymbol("AED ");
  };

  const handleSlabChange = (
    index: number,
    field: "express_rate" | "economy_rate",
    value: number
  ) => {
    setWeightSlabs((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: CreatePricingPayload = {
      country: country.trim(),
      zone: zone.trim(),
      category: category.trim() || "Express Air Parcel",
      currency,
      currency_symbol: currencySymbol,
      base_express_price: Number(baseExpressPrice) || 0,
      base_economy_price: Number(baseEconomyPrice) || 0,
      weight_slabs: weightSlabs,
      is_active: isActive,
      notes: notes.trim(),
    };

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Country Selector */}
        <CountrySelector value={country} onChange={handleCountryChange} />

        {/* Zone Selector */}
        <ZoneSelector value={zone} onChange={setZone} />

        {/* Category */}
        <div>
          <label className="block text-slate-300 font-bold mb-1">
            Service Category <span className="text-red-400">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-semibold outline-none focus:border-[#005DC3]"
          >
            <option value="Express Air Parcel">Express Air Parcel</option>
            <option value="Medicine Shipping">Medicine Shipping</option>
            <option value="Food Items Delivery">Food Items Delivery</option>
            <option value="Documents">Documents</option>
            <option value="Excess Baggage">Excess Baggage</option>
            <option value="Air Cargo Freight">Air Cargo Freight</option>
          </select>
        </div>

        {/* Currency Selector */}
        <div>
          <label className="block text-slate-300 font-bold mb-1">Currency</label>
          <select
            value={currency}
            onChange={(e) => handleCurrencyChange(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-semibold outline-none focus:border-[#005DC3]"
          >
            <option value="USD">USD ($)</option>
            <option value="INR">INR (₹)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="AED">AED</option>
          </select>
        </div>

        {/* Base Express Starting Price */}
        <div>
          <label className="block text-slate-300 font-bold mb-1">
            Base Express Rate ({currencySymbol})
          </label>
          <input
            type="number"
            step="0.1"
            min={0}
            value={baseExpressPrice}
            onChange={(e) => setBaseExpressPrice(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono outline-none focus:border-[#005DC3]"
          />
        </div>

        {/* Base Economy Starting Price */}
        <div>
          <label className="block text-slate-300 font-bold mb-1">
            Base Economy Rate ({currencySymbol})
          </label>
          <input
            type="number"
            step="0.1"
            min={0}
            value={baseEconomyPrice}
            onChange={(e) => setBaseEconomyPrice(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono outline-none focus:border-[#005DC3]"
          />
        </div>
      </div>

      {/* Weight Slabs Rate Table */}
      <div className="space-y-2 pt-2 border-t border-slate-800">
        <label className="block text-slate-300 font-bold">
          Weight Slab Rates Matrix ({currencySymbol})
        </label>
        <WeightTable
          slabs={weightSlabs}
          currencySymbol={currencySymbol}
          isEditable={true}
          onSlabChange={handleSlabChange}
        />
      </div>

      {/* Notes & Status */}
      <div className="space-y-3 pt-2 border-t border-slate-800">
        <div>
          <label className="block text-slate-300 font-bold mb-1">Rate Notes &amp; Terms</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Fuel surcharge included. Customs clearance extra."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-medium outline-none focus:border-[#005DC3]"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="pricing_is_active_cb"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="rounded border-slate-700 bg-slate-900 text-[#005DC3] focus:ring-[#005DC3] cursor-pointer"
          />
          <label
            htmlFor="pricing_is_active_cb"
            className="text-slate-300 text-xs font-semibold cursor-pointer select-none"
          >
            Enable this rate slab for public calculator &amp; quote requests
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-700">
        <button
          type="button"
          onClick={handleCancelClick}
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
            "Update Pricing Slab"
          ) : (
            "Save New Pricing Slab"
          )}
        </button>
      </div>
    </form>
  );
};

export default PricingForm;
