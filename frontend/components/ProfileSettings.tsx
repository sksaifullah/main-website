"use client";

import React, { useState } from "react";
import { SystemSettingsConfig } from "@/services/settings";

interface ProfileSettingsProps {
  settings: SystemSettingsConfig;
  onSave: (partial: Partial<SystemSettingsConfig>) => Promise<void>;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  settings,
  onSave,
}) => {
  const [adminName, setAdminName] = useState("Administrator");
  const [adminEmail, setAdminEmail] = useState(settings.company_email);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await onSave({ company_email: adminEmail });
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-xs">
      <div>
        <h3 className="text-base font-extrabold text-white">Admin Profile Settings</h3>
        <p className="text-slate-400 text-xs mt-0.5">
          Manage system administrator account name, contact email, and role privileges.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div>
          <label className="block text-slate-300 font-bold mb-1">Admin Display Name</label>
          <input
            type="text"
            value={adminName}
            onChange={(e) => setAdminName(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-medium focus:border-[#005DC3] outline-none"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-bold mb-1">Account Email Address</label>
          <input
            type="email"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-medium focus:border-[#005DC3] outline-none"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-bold mb-1">System Role</label>
          <input
            type="text"
            value="Super Administrator"
            disabled
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-400 font-bold cursor-not-allowed"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-700">
        <button
          type="submit"
          disabled={isSaving}
          className="btn-primary text-xs py-2.5 px-6 shadow-lg flex items-center gap-2 disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Update Profile"}
        </button>
      </div>
    </form>
  );
};

export default ProfileSettings;
