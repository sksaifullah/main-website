"use client";

import React, { useState } from "react";
import { SystemSettingsConfig, triggerBackup } from "@/services/settings";

interface BackupSettingsProps {
  settings: SystemSettingsConfig;
  onRefresh: () => void;
}

export const BackupSettings: React.FC<BackupSettingsProps> = ({
  settings,
  onRefresh,
}) => {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [lastBackup, setLastBackup] = useState(settings.last_backup_date || "Never");

  const handleBackupNow = async () => {
    setIsBackingUp(true);
    const res = await triggerBackup();
    setLastBackup(res.timestamp);
    setIsBackingUp(false);
    onRefresh();
  };

  return (
    <div className="space-y-5 text-xs">
      <div>
        <h3 className="text-base font-extrabold text-white">Database Backup &amp; Disaster Recovery</h3>
        <p className="text-slate-400 text-xs mt-0.5">
          Generate full database snapshots of shipments, rates, customers, and carrier settings.
        </p>
      </div>

      <div className="space-y-4 pt-2">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-700/60 flex items-center justify-between">
          <div>
            <p className="font-bold text-white text-xs">Last System Backup</p>
            <p className="text-xs font-mono text-emerald-400 mt-0.5">{lastBackup}</p>
          </div>
          <button
            type="button"
            onClick={handleBackupNow}
            disabled={isBackingUp}
            className="px-4 py-2 rounded-xl bg-blue-950/80 hover:bg-blue-900 text-blue-200 font-bold text-xs border border-blue-800/80 transition flex items-center gap-2 disabled:opacity-50"
          >
            {isBackingUp ? (
              <>
                <i className="fa-solid fa-spinner animate-spin"></i> Backing up...
              </>
            ) : (
              <>
                <i className="fa-solid fa-download"></i> Create Snapshot Now
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BackupSettings;
