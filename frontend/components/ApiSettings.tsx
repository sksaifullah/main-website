"use client";

import React, { useState } from "react";
import { SystemSettingsConfig } from "@/services/settings";

interface ApiSettingsProps {
  settings: SystemSettingsConfig;
  onSave: (partial: Partial<SystemSettingsConfig>) => Promise<void>;
}

export const ApiSettings: React.FC<ApiSettingsProps> = ({
  settings,
  onSave,
}) => {
  const [apiKey, setApiKey] = useState(settings.api_key);
  const [showKey, setShowKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleGenerateKey = () => {
    const newKey = `sk_live_sky_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    setApiKey(newKey);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await onSave({ api_key: apiKey });
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-xs">
      <div>
        <h3 className="text-base font-extrabold text-white">API Configuration &amp; Integration Keys</h3>
        <p className="text-slate-400 text-xs mt-0.5">
          Manage developer REST API access tokens for external e-commerce integrations.
        </p>
      </div>

      <div className="space-y-4 pt-2">
        <div>
          <label className="block text-slate-300 font-bold mb-1">Production Secret API Key</label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-3 pr-10 py-2.5 text-white font-mono text-xs outline-none focus:border-[#005DC3]"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
              >
                <i className={`fa-solid ${showKey ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>
            <button
              type="button"
              onClick={handleGenerateKey}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition border border-slate-700 whitespace-nowrap"
            >
              <i className="fa-solid fa-arrows-rotate text-blue-400"></i> Regenerate Key
            </button>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-700/60 space-y-2">
          <p className="font-bold text-white text-xs">REST Endpoint Base URL</p>
          <code className="block bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-emerald-400 font-mono text-[11px]">
            http://localhost:8000/api/tracking
          </code>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-700">
        <button
          type="submit"
          disabled={isSaving}
          className="btn-primary text-xs py-2.5 px-6 shadow-lg flex items-center gap-2 disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save API Settings"}
        </button>
      </div>
    </form>
  );
};

export default ApiSettings;
