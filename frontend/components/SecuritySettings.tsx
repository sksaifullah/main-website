"use client";

import React, { useState } from "react";
import { SystemSettingsConfig } from "@/services/settings";

interface SecuritySettingsProps {
  settings: SystemSettingsConfig;
  onSave: (partial: Partial<SystemSettingsConfig>) => Promise<void>;
}

export const SecuritySettings: React.FC<SecuritySettingsProps> = ({
  settings,
  onSave,
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactor, setTwoFactor] = useState(settings.two_factor_auth);
  const [isSaving, setIsSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    setIsSaving(true);
    await onSave({ two_factor_auth: twoFactor });
    setIsSaving(false);
    setMsg("Security settings updated successfully.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setMsg(null), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-xs">
      <div>
        <h3 className="text-base font-extrabold text-white">Security &amp; Password Management</h3>
        <p className="text-slate-400 text-xs mt-0.5">
          Change admin console password and configure Two-Factor Authentication (2FA).
        </p>
      </div>

      {msg && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-200 rounded-xl text-xs font-bold">
          {msg}
        </div>
      )}

      <div className="space-y-4 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-slate-300 font-bold mb-1">Current Admin Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono outline-none focus:border-[#005DC3]"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono outline-none focus:border-[#005DC3]"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono outline-none focus:border-[#005DC3]"
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-700/60 mt-4">
          <div>
            <p className="font-bold text-white text-sm">Two-Factor Authentication (2FA)</p>
            <p className="text-[11px] text-slate-400">
              Require an authenticator app code for admin console login.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setTwoFactor(!twoFactor)}
            className={`w-11 h-6 rounded-full transition p-1 flex items-center ${
              twoFactor ? "bg-emerald-500 justify-end" : "bg-slate-700 justify-start"
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
          {isSaving ? "Saving..." : "Update Security Settings"}
        </button>
      </div>
    </form>
  );
};

export default SecuritySettings;
