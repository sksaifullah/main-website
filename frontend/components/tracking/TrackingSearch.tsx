"use client";

import React, { useState } from "react";

interface TrackingSearchProps {
  initialValue?: string;
  onSearch: (trackingNumber: string) => void;
  isLoading?: boolean;
}

export const TrackingSearch: React.FC<TrackingSearchProps> = ({
  initialValue = "",
  onSearch,
  isLoading = false,
}) => {
  const [inputVal, setInputVal] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      onSearch(inputVal.trim());
    }
  };

  const handleQuickClick = (num: string) => {
    setInputVal(num);
    onSearch(num);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 dark:border-slate-800 mb-8 max-w-3xl mx-auto">
      <div className="mb-4">
        <span className="badge-primary mb-2">
          <i className="fa-solid fa-location-crosshairs"></i> Shipment Locator
        </span>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Track Your International Shipment
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Enter your waybill or partner tracking number (FedEx, DHL, UPS, Aramex) to get live status updates.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <i className="fa-solid fa-barcode absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg"></i>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="e.g. 7940561073, JD0146001234567890, 1Z999AA10123456784"
            className="form-input pl-12 py-3.5 text-sm font-semibold border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary py-3.5 px-6 text-sm whitespace-nowrap justify-center cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <i className="fa-solid fa-circle-notch fa-spin mr-1"></i> Searching...
            </>
          ) : (
            <>
              <i className="fa-solid fa-magnifying-glass"></i> Track Shipment
            </>
          )}
        </button>
      </form>

      {/* Quick Example Waybills */}
      <div className="flex flex-wrap items-center gap-2 mt-4 text-xs">
        <span className="text-slate-400 font-semibold">Sample Waybills:</span>
        <button
          type="button"
          onClick={() => handleQuickClick("7940561073")}
          className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-slate-800 text-[#005DC3] dark:text-sky-400 font-mono font-bold hover:bg-blue-100 dark:hover:bg-slate-700 transition cursor-pointer"
        >
          7940561073 (FedEx)
        </button>
        <button
          type="button"
          onClick={() => handleQuickClick("JD0146001234567890")}
          className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-slate-800 text-[#005DC3] dark:text-sky-400 font-mono font-bold hover:bg-blue-100 dark:hover:bg-slate-700 transition cursor-pointer"
        >
          JD0146001234567890 (DHL)
        </button>
        <button
          type="button"
          onClick={() => handleQuickClick("1Z999AA10123456784")}
          className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-slate-800 text-[#005DC3] dark:text-sky-400 font-mono font-bold hover:bg-blue-100 dark:hover:bg-slate-700 transition cursor-pointer"
        >
          1Z999AA10123456784 (UPS)
        </button>
      </div>
    </div>
  );
};
