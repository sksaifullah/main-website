"use client";

import React, { useState } from "react";
import { resetSystemSettings } from "@/services/settings";

interface DangerZoneProps {
  onReset: () => Promise<void>;
}

export const DangerZone: React.FC<DangerZoneProps> = ({ onReset }) => {
  const [isResetting, setIsResetting] = useState(false);

  const handleResetClick = async () => {
    if (!confirm("CAUTION: Are you sure you want to reset all system settings to default factory values?")) {
      return;
    }
    try {
      setIsResetting(true);
      await resetSystemSettings();
      await onReset();
      alert("System settings reset to default factory parameters.");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-5 text-xs">
      <div>
        <h3 className="text-base font-extrabold text-red-400">Danger Zone &amp; Factory Reset</h3>
        <p className="text-slate-400 text-xs mt-0.5">
          Perform high-privilege system resets and clear local application caches.
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-red-950/20 border border-red-800/40 flex items-center justify-between">
        <div>
          <p className="font-bold text-red-200 text-xs">Reset All System Configuration</p>
          <p className="text-[11px] text-red-300/80">
            Reverts company details, currency, theme, and API keys to default values.
          </p>
        </div>
        <button
          type="button"
          onClick={handleResetClick}
          disabled={isResetting}
          className="px-4 py-2 rounded-xl bg-red-950 hover:bg-red-900 text-red-200 font-bold text-xs border border-red-800 transition flex items-center gap-2 disabled:opacity-50"
        >
          {isResetting ? "Resetting..." : "Reset System Settings"}
        </button>
      </div>
    </div>
  );
};

export default DangerZone;
