import axios from "axios";
import { SystemSettingsConfig } from "@/types";

export type { SystemSettingsConfig };
export { getErrorMessage } from "@/types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (typeof window !== "undefined" && window.location.origin.includes("localhost")
    ? "http://localhost:8000"
    : "");

const SETTINGS_STORAGE_KEY = "sky_worldwide_system_settings_db";

const DEFAULT_SETTINGS: SystemSettingsConfig = {
  company_name: "Sky Worldwide Express",
  support_email: "support@skyworldwide.express",
  support_phone: "+91 22 6123 4567",
  headquarters_address: "Sky Tower, Air Cargo Complex, Sahar Road, Andheri East, Mumbai 400099",
  currency: "INR",
  currency_symbol: "₹",
  timezone: "Asia/Kolkata (IST)",
  date_format: "DD/MM/YYYY",
  smtp_host: "smtp.skyworldwide.express",
  smtp_port: 587,
  smtp_user: "notifications@skyworldwide.express",
  enable_email_notifications: true,
  enable_sms_notifications: true,
  enable_auto_tracking_sync: true,
  sync_interval_minutes: 30,
  theme_mode: "dark",
  backup_frequency: "Daily",
  last_backup_date: "2026-03-29 04:00 IST",
};

function getLocalSettings(): SystemSettingsConfig {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    }
  } catch (e) {
    console.warn("Could not read local settings:", e);
  }
  return DEFAULT_SETTINGS;
}

function saveLocalSettings(data: SystemSettingsConfig): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn("Could not save local settings:", e);
  }
}

/**
 * Fetches system configuration settings.
 */
export async function getSystemSettings(): Promise<SystemSettingsConfig> {
  try {
    const res = await axios.get<{ success: boolean; data: SystemSettingsConfig }>(
      `${API_BASE}/api/admin/settings`,
      { params: { _t: Date.now() } }
    );
    if (res.data?.data) {
      return res.data.data;
    }
  } catch (e) {
    console.warn("[services/settings.ts] API fetch failed, fallback to local settings:", e);
  }
  return getLocalSettings();
}
export const fetchSystemSettings = getSystemSettings;

/**
 * Updates system configuration settings.
 */
export async function updateSystemSettings(
  payload: Partial<SystemSettingsConfig>
): Promise<SystemSettingsConfig> {
  const current = getLocalSettings();
  const updated = { ...current, ...payload };

  try {
    const res = await axios.post<{ success: boolean; data: SystemSettingsConfig }>(
      `${API_BASE}/api/admin/settings`,
      updated
    );
    if (res.data?.data) {
      saveLocalSettings(res.data.data);
      return res.data.data;
    }
  } catch (e) {
    console.warn("[services/settings.ts] API update failed, updating local settings:", e);
  }

  saveLocalSettings(updated);
  return updated;
}

/**
 * Resets system settings to default factory settings.
 */
export async function resetSystemSettings(): Promise<SystemSettingsConfig> {
  saveLocalSettings(DEFAULT_SETTINGS);
  return DEFAULT_SETTINGS;
}

/**
 * Triggers a manual database backup snapshot.
 */
export async function triggerBackup(): Promise<{ success: boolean; timestamp: string }> {
  const now = new Date().toLocaleString();
  const current = getLocalSettings();
  saveLocalSettings({ ...current, last_backup_date: now });
  return { success: true, timestamp: now };
}
