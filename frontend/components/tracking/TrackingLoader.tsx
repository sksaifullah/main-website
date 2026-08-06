"use client";

import React from "react";

interface TrackingLoaderProps {
  trackingNumber?: string;
}

export const TrackingLoader: React.FC<TrackingLoaderProps> = ({ trackingNumber }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 max-w-2xl mx-auto text-center shadow-xl border border-slate-100 dark:border-slate-800 animate-fade-in my-8">
      <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-slate-800 text-[#005DC3] dark:text-sky-400 flex items-center justify-center mx-auto mb-4 text-2xl">
        <i className="fa-solid fa-circle-notch fa-spin"></i>
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
        Searching Tracking Records
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
        Connecting to Sky Worldwide logistics server for waybill{" "}
        <strong className="font-mono text-slate-800 dark:text-white">{trackingNumber || "..."}</strong>...
      </p>
    </div>
  );
};
