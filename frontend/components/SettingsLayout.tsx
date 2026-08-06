"use client";

import React from "react";

export type SettingsTab =
  | "company"
  | "profile"
  | "notifications"
  | "security"
  | "system"
  | "theme"
  | "api"
  | "backup"
  | "danger";

interface SettingsLayoutProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
  children: React.ReactNode;
}

export const SettingsLayout: React.FC<SettingsLayoutProps> = ({
  activeTab,
  onTabChange,
  children,
}) => {
  const tabs: { id: SettingsTab; label: string; icon: string }[] = [
    { id: "company", label: "Company Info", icon: "fa-building" },
    { id: "profile", label: "Profile", icon: "fa-user-gear" },
    { id: "system", label: "System & Region", icon: "fa-sliders" },
    { id: "notifications", label: "Notifications", icon: "fa-bell" },
    { id: "security", label: "Security & 2FA", icon: "fa-shield-halved" },
    { id: "theme", label: "Theme & UI", icon: "fa-palette" },
    { id: "api", label: "API Keys", icon: "fa-key" },
    { id: "backup", label: "Backup & Restore", icon: "fa-database" },
    { id: "danger", label: "Danger Zone", icon: "fa-triangle-exclamation" },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Settings Tab Sidebar */}
      <div className="w-full lg:w-64 shrink-0 bg-slate-900/60 border border-slate-700/60 rounded-3xl p-3 space-y-1 h-fit shadow-xl">
        <p className="px-3 pt-2 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 border-b border-slate-800 mb-2">
          Configuration Sections
        </p>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => onTabChange(t.id)}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition text-left ${
              activeTab === t.id
                ? "bg-[#005DC3] text-white shadow-lg"
                : "text-slate-400 hover:text-white hover:bg-slate-800/80"
            }`}
          >
            <i className={`fa-solid ${t.icon} text-sm w-4 text-center`}></i>
            {t.label}
          </button>
        ))}
      </div>

      {/* Settings Content Box */}
      <div className="flex-1 bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-2xl space-y-6">
        {children}
      </div>
    </div>
  );
};

export default SettingsLayout;
