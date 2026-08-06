"use client";

import React, { useEffect, useState, useCallback } from "react";
import SettingsLayout, { SettingsTab } from "@/components/SettingsLayout";
import CompanySettings from "@/components/CompanySettings";
import ProfileSettings from "@/components/ProfileSettings";
import NotificationSettings from "@/components/NotificationSettings";
import SecuritySettings from "@/components/SecuritySettings";
import ThemeSettings from "@/components/ThemeSettings";
import ApiSettings from "@/components/ApiSettings";
import SystemSettings from "@/components/SystemSettings";
import BackupSettings from "@/components/BackupSettings";
import DangerZone from "@/components/DangerZone";
import {
  SystemSettingsConfig,
  fetchSystemSettings,
  updateSystemSettings,
} from "@/services/settings";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("company");
  const [settings, setSettings] = useState<SystemSettingsConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchSystemSettings();
      setSettings(data);
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetchSystemSettings()
      .then((data) => {
        if (isMounted) {
          setSettings(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load settings:", err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSave = async (partial: Partial<SystemSettingsConfig>) => {
    const updated = await updateSystemSettings(partial);
    setSettings(updated);
    showToast("Settings updated successfully.");
  };

  if (isLoading || !settings) {
    return (
      <div className="p-8 text-center text-slate-400 space-y-3 animate-pulse">
        <i className="fa-solid fa-spinner animate-spin text-3xl text-[#005DC3]"></i>
        <p className="text-xs font-bold">Loading System Settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="bg-emerald-950/90 border border-emerald-800 p-3.5 rounded-2xl text-emerald-200 text-xs font-bold flex items-center justify-between shadow-xl animate-fadeIn">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-circle-check text-emerald-400"></i>
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-400 hover:text-white">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      )}

      {/* Main Settings Header */}
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight">
          System Settings &amp; Global Configuration
        </h2>
        <p className="text-xs text-slate-400 mt-0.5 font-medium">
          Manage company branding, security, region, currency, notifications, API keys, and backups.
        </p>
      </div>

      {/* Settings Layout Tab Wrapper */}
      <SettingsLayout activeTab={activeTab} onTabChange={setActiveTab}>
        {activeTab === "company" && (
          <CompanySettings settings={settings} onSave={handleSave} />
        )}
        {activeTab === "profile" && (
          <ProfileSettings settings={settings} onSave={handleSave} />
        )}
        {activeTab === "notifications" && (
          <NotificationSettings settings={settings} onSave={handleSave} />
        )}
        {activeTab === "security" && (
          <SecuritySettings settings={settings} onSave={handleSave} />
        )}
        {activeTab === "theme" && (
          <ThemeSettings settings={settings} onSave={handleSave} />
        )}
        {activeTab === "api" && (
          <ApiSettings settings={settings} onSave={handleSave} />
        )}
        {activeTab === "system" && (
          <SystemSettings settings={settings} onSave={handleSave} />
        )}
        {activeTab === "backup" && (
          <BackupSettings settings={settings} onRefresh={loadData} />
        )}
        {activeTab === "danger" && <DangerZone onReset={loadData} />}
      </SettingsLayout>
    </div>
  );
}
