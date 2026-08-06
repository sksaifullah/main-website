"use client";

import React, { useState } from "react";
import { CarrierCode, CarrierConfig } from "@/services/carrier";
import SyncStatusBadge, { ConnectionStatus } from "./SyncStatusBadge";
import ApiCredentialsForm from "./ApiCredentialsForm";
import ConnectionTestButton from "./ConnectionTestButton";

interface CarrierCardProps {
  carrierCode: CarrierCode;
  carrierName: string;
  icon: string;
  brandColor: string;
  config?: CarrierConfig;
  onSave: (code: CarrierCode, updatedConfig: CarrierConfig) => Promise<void>;
  onTest: (code: CarrierCode) => Promise<{ success: boolean; message: string }>;
}

const DEFAULT_CONFIG: CarrierConfig = {
  api_key: "",
  api_secret: "",
  account_number: "",
  enabled: false,
  sandbox_mode: true,
};

export const CarrierCard: React.FC<CarrierCardProps> = ({
  carrierCode,
  carrierName,
  icon,
  brandColor,
  config = DEFAULT_CONFIG,
  onSave,
  onTest,
}) => {
  const [localConfig, setLocalConfig] = useState<CarrierConfig>(config || {});
  const [isEnabled, setIsEnabled] = useState<boolean>(config?.enabled ?? true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const connectionStatus: ConnectionStatus = isEnabled
    ? config?.last_test_result?.success === false
      ? "error"
      : "connected"
    : "disabled";

  const handleFieldChange = (field: string, value: string) => {
    setLocalConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleToggleEnable = async (enabled: boolean) => {
    setIsEnabled(enabled);
    const updated = { ...localConfig, enabled };
    setLocalConfig(updated);
    await onSave(carrierCode, updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setSaveSuccess(false);
      const updated = { ...localConfig, enabled: isEnabled };
      await onSave(carrierCode, updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl space-y-4 hover:border-slate-600 transition flex flex-col justify-between">
      {/* Header Row: Logo, Name, Badge, Enable Toggle */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg font-extrabold border ${brandColor}`}
            >
              <i className={`fa-solid ${icon}`}></i>
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">{carrierName}</h3>
              <SyncStatusBadge status={connectionStatus} size="sm" />
            </div>
          </div>

          {/* Enable Toggle Switch */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400">
              {isEnabled ? "Enabled" : "Disabled"}
            </span>
            <button
              type="button"
              onClick={() => handleToggleEnable(!isEnabled)}
              className={`w-11 h-6 rounded-full transition p-1 flex items-center ${
                isEnabled ? "bg-[#005DC3] justify-end" : "bg-slate-700 justify-start"
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white shadow-md"></span>
            </button>
          </div>
        </div>

        {/* Action Bar: Expand Config / Run Test */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-700/60">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 transition flex items-center gap-1.5"
          >
            <i
              className={`fa-solid ${
                isExpanded ? "fa-chevron-up" : "fa-sliders"
              }`}
            ></i>
            {isExpanded ? "Hide API Credentials" : "Configure API Credentials"}
          </button>

          {config?.token_acquired_at && (
            <span className="text-[10px] text-slate-400 font-mono">
              Token Synced
            </span>
          )}
        </div>
      </div>

      {/* Collapsible API Form */}
      {isExpanded && (
        <form onSubmit={handleSave} className="space-y-4 pt-2 border-t border-slate-700/60 animate-fadeIn">
          <ApiCredentialsForm
            carrierCode={carrierCode}
            config={localConfig}
            onChange={handleFieldChange}
            disabled={!isEnabled}
          />

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              disabled={isSaving || !isEnabled}
              className="flex-1 btn-primary text-xs py-2 px-3 shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <i className="fa-solid fa-spinner animate-spin"></i> Saving...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-floppy-disk"></i> Save API Credentials
                </>
              )}
            </button>
          </div>

          {saveSuccess && (
            <p className="text-emerald-400 text-[11px] font-bold text-center animate-fadeIn">
              <i className="fa-solid fa-check mr-1"></i> API Credentials Saved Successfully!
            </p>
          )}
        </form>
      )}

      {/* Live Connection Test Button */}
      <div className="pt-2">
        <ConnectionTestButton
          carrierCode={carrierCode}
          carrierName={carrierName}
          onTest={onTest}
          disabled={!isEnabled}
        />
      </div>
    </div>
  );
};

export default CarrierCard;
