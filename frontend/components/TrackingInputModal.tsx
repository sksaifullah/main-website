"use client";

import React, { useState } from "react";

interface TrackingInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (trackingNumber: string) => void;
}

export const TrackingInputModal: React.FC<TrackingInputModalProps> = ({
  isOpen,
  onClose,
  onSearch,
}) => {
  const [num, setNum] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (num.trim()) {
      onSearch(num.trim());
      onClose();
    }
  };

  return (
    <div
      id="tracking-modal-input"
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full relative shadow-2xl animate-fade-in border border-slate-100 dark:border-slate-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 transition cursor-pointer"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Track Your Shipment</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Enter your waybill or tracking number to view real-time status.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              id="modal-track-input"
              value={num}
              onChange={(e) => setNum(e.target.value)}
              className="form-input text-base"
              placeholder="e.g. SKY-9823471, 7940561073"
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full justify-center cursor-pointer">
            Search Status
          </button>
        </form>
      </div>
    </div>
  );
};
