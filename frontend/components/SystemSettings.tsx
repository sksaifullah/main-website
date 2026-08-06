"use client";

import React, { useState } from "react";
import { SystemSettingsConfig } from "@/services/settings";

interface SystemSettingsProps {
  settings: SystemSettingsConfig;
  onSave: (partial: Partial<SystemSettingsConfig>) => Promise<void>;
}

export const SystemSettings: React.FC<SystemSettingsProps> = ({
  settings,
  onSave,
}) => {
  const [currency, setCurrency] = useState(settings.currency);
  const [timezone, setTimezone] = useState(settings.timezone);
  const [language, setLanguage] = useState(settings.language);
  const [autoSync, setAutoSync] = useState(settings.auto_sync_carriers);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const sym =
      currency === "INR" ? "₹" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : "$";
    await onSave({
      currency,
      currency_symbol: sym,
      timezone,
      language,
      auto_sync_carriers: autoSync,
    });
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-xs">
      <div>
        <h3 className="text-base font-extrabold text-white">System Regional &amp; Carrier Settings</h3>
        <p className="text-slate-400 text-xs mt-0.5">
          Configure system default currency, timezone, language, and carrier sync behavior.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div>
          <label className="block text-slate-300 font-bold mb-1">Default Base Currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-semibold outline-none focus:border-[#005DC3]"
          >
            <option value="USD">USD ($)</option>
            <option value="INR">INR (₹)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="AED">AED</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-300 font-bold mb-1">System Timezone</label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-semibold outline-none focus:border-[#005DC3]"
          >
            <option value="Asia/Kolkata (IST +5:30)">Asia/Kolkata (IST +5:30)</option>
            <option value="UTC (GMT +0:00)">UTC (GMT +0:00)</option>
            <option value="America/New_York (EST -5:00)">America/New_York (EST -5:00)</option>
            <option value="Europe/London (BST +1:00)">Europe/London (BST +1:00)</option>
            <option value="Asia/Dubai (GST +4:00)">Asia/Dubai (GST +4:00)</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-300 font-bold mb-1">System Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-semibold outline-none focus:border-[#005DC3]"
          >
            <option value="English (US)">English (US)</option>
            <option value="English (UK)">English (UK)</option>
            <option value="Hindi (HI)">Hindi (HI)</option>
            <option value="Arabic (AR)">Arabic (AR)</option>
          </select>
        </div>

        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-700/60 sm:col-span-2 mt-2">
          <div>
            <p className="font-bold text-white text-xs">Background Carrier Auto-Sync</p>
            <p className="text-[11px] text-slate-400">
              Periodically fetch live tracking updates from FedEx, UPS, DHL &amp; Aramex.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAutoSync(!autoSync)}
            className={`w-11 h-6 rounded-full transition p-1 flex items-center ${
              autoSync ? "bg-emerald-500 justify-end" : "bg-slate-700 justify-start"
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white shadow"></span>
          </button>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-700">
        <button
          type="submit"
          disabled={isSaving}
          className="btn-primary text-xs py-2.5 px-6 shadow-lg flex items-center gap-2 disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save System Settings"}
        </button>
      </div>
    </form>
  );
};

export default SystemSettings;
