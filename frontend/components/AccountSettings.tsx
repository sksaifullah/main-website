"use client";

import React, { useState } from "react";
import { UserProfileData, ActivityLogItem } from "@/types";

interface AccountSettingsProps {
  profile: UserProfileData;
  onSave: (partial: Partial<UserProfileData>) => Promise<void>;
}

export const AccountSettings: React.FC<AccountSettingsProps> = ({ profile, onSave }) => {
  const [tfa, setTfa] = useState(profile.two_factor_enabled);

  const handleTfaToggle = async () => {
    const next = !tfa;
    setTfa(next);
    await onSave({ two_factor_enabled: next });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-extrabold text-white text-base">Account Security &amp; Audit Logs</h3>
      <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-700/60 flex items-center justify-between">
        <div>
          <p className="font-bold text-white text-xs">Two-Factor Authentication (2FA)</p>
          <p className="text-[11px] text-slate-400">Add an extra layer of security using Google Authenticator or SMS.</p>
        </div>
        <button
          type="button"
          onClick={handleTfaToggle}
          className={`w-11 h-6 rounded-full transition p-1 flex items-center ${
            tfa ? "bg-emerald-500 justify-end" : "bg-slate-700 justify-start"
          }`}
        >
          <span className="w-4 h-4 rounded-full bg-white shadow"></span>
        </button>
      </div>

      <div className="space-y-2">
        <p className="font-bold text-white text-xs">Recent Login Activity</p>
        <div className="space-y-2">
          {profile.activity_history.map((act: ActivityLogItem, idx: number) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
            >
              <div>
                <p className="font-bold text-slate-200">{act.action}</p>
                <p className="text-[10px] font-mono text-slate-400">IP: {act.ip}</p>
              </div>
              <span className="text-[10px] font-mono text-slate-400">{act.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
