"use client";

import React, { useState } from "react";
import { SystemSettingsConfig } from "@/services/settings";

interface CompanySettingsProps {
  settings: SystemSettingsConfig;
  onSave: (partial: Partial<SystemSettingsConfig>) => Promise<void>;
}

export const CompanySettings: React.FC<CompanySettingsProps> = ({
  settings,
  onSave,
}) => {
  const [name, setName] = useState(settings.company_name);
  const [email, setEmail] = useState(settings.company_email);
  const [phone, setPhone] = useState(settings.company_phone);
  const [address, setAddress] = useState(settings.company_address);
  const [logoUrl, setLogoUrl] = useState(settings.logo_url);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await onSave({
      company_name: name,
      company_email: email,
      company_phone: phone,
      company_address: address,
      logo_url: logoUrl,
    });
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-xs">
      <div>
        <h3 className="text-base font-extrabold text-white">Company Profile &amp; Branding</h3>
        <p className="text-slate-400 text-xs mt-0.5">
          Configure corporate name, logo branding, contact details, and physical hub address.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div>
          <label className="block text-slate-300 font-bold mb-1">Company Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-medium focus:border-[#005DC3] outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-slate-300 font-bold mb-1">Support Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-medium focus:border-[#005DC3] outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-slate-300 font-bold mb-1">Contact Phone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono focus:border-[#005DC3] outline-none"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-bold mb-1">Logo URL</label>
          <input
            type="text"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono text-xs focus:border-[#005DC3] outline-none"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-slate-300 font-bold mb-1">Corporate Office Address</label>
          <textarea
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-medium focus:border-[#005DC3] outline-none resize-none"
          ></textarea>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-700">
        <button
          type="submit"
          disabled={isSaving}
          className="btn-primary text-xs py-2.5 px-6 shadow-lg flex items-center gap-2 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <i className="fa-solid fa-spinner animate-spin"></i> Saving...
            </>
          ) : (
            "Save Company Settings"
          )}
        </button>
      </div>
    </form>
  );
};

export default CompanySettings;
