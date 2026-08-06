"use client";

import React from "react";

interface TrackingErrorProps {
  trackingNumber?: string;
  errorMessage?: string;
  onRetry?: () => void;
}

export const TrackingError: React.FC<TrackingErrorProps> = ({
  trackingNumber,
  errorMessage = "Tracking details not found.",
  onRetry,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 max-w-2xl mx-auto text-center shadow-xl border border-slate-100 dark:border-slate-800 animate-fade-in my-8">
      <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/40 text-red-500 flex items-center justify-center mx-auto mb-4 text-2xl">
        <i className="fa-solid fa-circle-exclamation"></i>
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
        Tracking Information Unavailable
      </h3>
      {trackingNumber && (
        <p className="text-sm text-slate-600 dark:text-slate-300 font-medium mb-2">
          Tracking Number: <strong className="font-mono text-slate-900 dark:text-white">{trackingNumber}</strong>
        </p>
      )}
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
        {errorMessage}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-secondary py-2.5 px-6 text-xs justify-center mx-auto cursor-pointer"
        >
          <i className="fa-solid fa-rotate-right"></i> Try Searching Again
        </button>
      )}
    </div>
  );
};
