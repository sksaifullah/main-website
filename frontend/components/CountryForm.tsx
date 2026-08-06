"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CountryRecord, CreateCountryPayload } from "@/types";

interface CountryFormProps {
  initialData?: CountryRecord | null;
  onSubmit: (payload: CreateCountryPayload) => Promise<void>;
  onCancel?: () => void;
  onClose?: () => void;
  isSubmitting?: boolean;
}

export const CountryForm: React.FC<CountryFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  onClose,
  isSubmitting = false,
}) => {
  const cancelFn = onClose || onCancel || (() => {});
  const isEditing = Boolean(initialData);

  const [code, setCode] = useState(initialData?.code || "US");
  const [name, setName] = useState(initialData?.name || "");
  const [flagUrl, setFlagUrl] = useState(
    initialData?.flag_url || "https://flagcdn.com/w80/us.png"
  );
  const [deliveryTime, setDeliveryTime] = useState(initialData?.delivery_time || "3–5 Days");
  const [currency, setCurrency] = useState(initialData?.currency || "USD");
  const [currencySymbol, setCurrencySymbol] = useState(initialData?.currency_symbol || "$");
  const [timezone, setTimezone] = useState(initialData?.timezone || "UTC-5 to UTC-8 (EST/PST)");
  const [majorCities, setMajorCities] = useState(initialData?.major_cities || "");
  const [dutyTaxInfo, setDutyTaxInfo] = useState(initialData?.duty_tax_info || "");
  const [isEnabled, setIsEnabled] = useState(initialData?.is_enabled ?? true);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleCodeChange = (newCode: string) => {
    const cleanCode = newCode.toUpperCase().slice(0, 2);
    setCode(cleanCode);
    if (cleanCode.length === 2 && !initialData) {
      setFlagUrl(`https://flagcdn.com/w80/${cleanCode.toLowerCase()}.png`);
    }
  };

  const handleCurrencyChange = (curr: string) => {
    setCurrency(curr);
    if (curr === "USD") setCurrencySymbol("$");
    else if (curr === "GBP") setCurrencySymbol("£");
    else if (curr === "EUR") setCurrencySymbol("€");
    else if (curr === "AED") setCurrencySymbol("AED ");
    else if (curr === "CAD") setCurrencySymbol("C$");
    else if (curr === "AUD") setCurrencySymbol("AU$");
    else if (curr === "SAR") setCurrencySymbol("SAR ");
    else if (curr === "SGD") setCurrencySymbol("S$");
  };

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!name.trim()) {
      errs.name = "Country Name is required.";
    }
    if (!code.trim() || code.length !== 2) {
      errs.code = "2-letter ISO Country Code is required (e.g. US, GB).";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: CreateCountryPayload = {
      code,
      name,
      flag_url: flagUrl,
      delivery_time: deliveryTime,
      currency,
      currency_symbol: currencySymbol,
      timezone,
      major_cities: majorCities,
      duty_tax_info: dutyTaxInfo,
      is_enabled: isEnabled,
    };

    await onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-900/60 text-blue-400 flex items-center justify-center text-lg border border-blue-800/80">
              <i className="fa-solid fa-earth-americas"></i>
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">
                {isEditing ? `Edit Country: ${initialData?.name}` : "Add New Destination Country"}
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Configure international shipping route specs and customs data.
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-white transition"
          >
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        {/* Form Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Country Name */}
            <div>
              <label className="block text-slate-300 font-bold mb-1">
                Country Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. United States"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold focus:border-[#005DC3] outline-none"
              />
              {errors.name && (
                <p className="text-[11px] text-red-400 mt-1 font-bold">{errors.name}</p>
              )}
            </div>

            {/* Country Code */}
            <div>
              <label className="block text-slate-300 font-bold mb-1">
                ISO Code (2 Letters) <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                maxLength={2}
                placeholder="US"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono uppercase font-bold focus:border-[#005DC3] outline-none"
              />
              {errors.code && (
                <p className="text-[11px] text-red-400 mt-1 font-bold">{errors.code}</p>
              )}
            </div>
          </div>

          {/* Flag Image URL */}
          <div>
            <label className="block text-slate-300 font-bold mb-1">Flag Image URL</label>
            <div className="flex items-center gap-3">
              {flagUrl && (
                <Image
                  src={flagUrl}
                  alt="Flag Preview"
                  width={36}
                  height={24}
                  unoptimized
                  className="w-9 h-6 object-cover rounded border border-slate-700 shrink-0"
                />
              )}
              <input
                type="text"
                value={flagUrl}
                onChange={(e) => setFlagUrl(e.target.value)}
                placeholder="https://flagcdn.com/w80/us.png"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:border-[#005DC3] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Delivery Time Estimate */}
            <div>
              <label className="block text-slate-300 font-bold mb-1">Delivery Estimate</label>
              <input
                type="text"
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
                placeholder="3–5 Days"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold focus:border-[#005DC3] outline-none"
              />
            </div>

            {/* Currency Code */}
            <div>
              <label className="block text-slate-300 font-bold mb-1">Currency Code</label>
              <select
                value={currency}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold focus:border-[#005DC3] outline-none"
              >
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
                <option value="EUR">EUR (€)</option>
                <option value="AED">AED (AED)</option>
                <option value="CAD">CAD (C$)</option>
                <option value="AUD">AUD (AU$)</option>
                <option value="SAR">SAR (SAR)</option>
                <option value="SGD">SGD (S$)</option>
              </select>
            </div>

            {/* Timezone */}
            <div>
              <label className="block text-slate-300 font-bold mb-1">Timezone</label>
              <input
                type="text"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                placeholder="UTC-5"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold focus:border-[#005DC3] outline-none"
              />
            </div>
          </div>

          {/* Major Cities Served */}
          <div>
            <label className="block text-slate-300 font-bold mb-1">Major Cities (Comma-separated)</label>
            <input
              type="text"
              value={majorCities}
              onChange={(e) => setMajorCities(e.target.value)}
              placeholder="New York, Los Angeles, Chicago, Miami, Dallas"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold focus:border-[#005DC3] outline-none"
            />
          </div>

          {/* Duty & Tax Restrictions */}
          <div>
            <label className="block text-slate-300 font-bold mb-1">Customs Duty &amp; Tax Info</label>
            <textarea
              rows={2}
              value={dutyTaxInfo}
              onChange={(e) => setDutyTaxInfo(e.target.value)}
              placeholder="e.g. De minimis threshold is $800. DDP duty prepayment available."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white font-medium focus:border-[#005DC3] outline-none"
            ></textarea>
          </div>

          {/* Enable Switch */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-bold text-slate-300">Enable Route for Public Quotes</span>
            <button
              type="button"
              onClick={() => setIsEnabled(!isEnabled)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                isEnabled ? "bg-emerald-600 justify-end" : "bg-slate-700 justify-start"
              }`}
            >
              <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
            </button>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-700">
            <button
              type="button"
              onClick={cancelFn}
              className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary px-5 py-2 rounded-xl font-bold text-xs shadow-lg flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <i className="fa-solid fa-spinner animate-spin"></i> Saving Route...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-check"></i> Save Country Route
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CountryForm;
