"use client";

import React, { useState } from "react";
import { SystemSettingsConfig } from "@/services/settings";

interface ThemeSettingsProps {
  settings: SystemSettingsConfig;
  onSave: (partial: Partial<SystemSettingsConfig>) => Promise<void>;
}

export const ThemeSettings: React.FC<ThemeSettingsProps> = ({
  settings,
  onSave,
}) => {
  const [theme, setTheme] = useState<"dark" | "light" | "system">(settings.theme || "dark");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await onSave({ theme });
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-xs">
      <div>
        <h3 className="text-base font-extrabold text-white">Theme &amp; UI Aesthetics</h3>
        <p className="text-slate-400 text-xs mt-0.5">
          Choose visual appearance mode for the admin console layout.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <button
          type="button"
          onClick={() => setTheme("dark")}
          className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between h-32 ${
            theme === "dark"
              ? "bg-[#005DC3]/20 border-[#005DC3] text-white ring-2 ring-[#005DC3]"
              : "bg-slate-900/60 border-slate-700/60 text-slate-300 hover:border-slate-500"
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <i className="fa-solid fa-moon text-lg text-blue-400"></i>
            {theme === "dark" && <i className="fa-solid fa-circle-check text-emerald-400 text-sm"></i>}
          </div>
          <div>
            <p className="font-extrabold text-sm">Dark Console (Default)</p>
            <p className="text-[11px] text-slate-400">Sleek slate-950 dark mode dashboard</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setTheme("light")}
          className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between h-32 ${
            theme === "light"
              ? "bg-[#005DC3]/20 border-[#005DC3] text-white ring-2 ring-[#005DC3]"
              : "bg-slate-900/60 border-slate-700/60 text-slate-300 hover:border-slate-500"
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <i className="fa-solid fa-sun text-lg text-amber-400"></i>
            {theme === "light" && <i className="fa-solid fa-circle-check text-emerald-400 text-sm"></i>}
          </div>
          <div>
            <p className="font-extrabold text-sm">Light Mode</p>
            <p className="text-[11px] text-slate-400">High-contrast white background theme</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setTheme("system")}
          className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between h-32 ${
            theme === "system"
              ? "bg-[#005DC3]/20 border-[#005DC3] text-white ring-2 ring-[#005DC3]"
              : "bg-slate-900/60 border-slate-700/60 text-slate-300 hover:border-slate-500"
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <i className="fa-solid fa-desktop text-lg text-purple-400"></i>
            {theme === "system" && <i className="fa-solid fa-circle-check text-emerald-400 text-sm"></i>}
          </div>
          <div>
            <p className="font-extrabold text-sm">System Default</p>
            <p className="text-[11px] text-slate-400">Matches OS appearance settings</p>
          </div>
        </button>
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-700">
        <button
          type="submit"
          disabled={isSaving}
          className="btn-primary text-xs py-2.5 px-6 shadow-lg flex items-center gap-2 disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Apply Theme"}
        </button>
      </div>
    </form>
  );
};

export default ThemeSettings;
