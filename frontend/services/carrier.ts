import axios from "axios";
import {
  CarrierCode,
  CarrierConfig,
  AutoSyncConfig,
  CarrierConfigsResponse,
  SyncLogEntry,
  getErrorMessage,
} from "@/types";

export type {
  CarrierCode,
  CarrierConfig,
  AutoSyncConfig,
  CarrierConfigsResponse,
  SyncLogEntry,
};
export { getErrorMessage } from "@/types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (typeof window !== "undefined" && window.location.origin.includes("localhost")
    ? "http://localhost:8000"
    : "");

export interface ConnectionTestResult {
  success: boolean;
  message: string;
  access_token?: string;
  expires_in?: number;
}

/**
 * Fetches current carrier configurations from backend.
 */
export async function getCarrierConfigs(): Promise<CarrierConfigsResponse> {
  try {
    const res = await axios.get<{ success: boolean; data: CarrierConfigsResponse }>(
      `${API_BASE}/api/admin/carrier-configs`,
      { params: { _t: Date.now() } }
    );
    return res.data?.data || {};
  } catch (error: unknown) {
    const message = getErrorMessage(error, "Failed to load carrier configurations.");
    console.error("[services/carrier.ts] getCarrierConfigs error:", error);
    throw new Error(message);
  }
}
export const fetchCarrierConfigs = getCarrierConfigs;

/**
 * Saves carrier configuration credentials and settings in backend database.
 */
export async function updateCarrierConfigs(
  payload: Partial<CarrierConfigsResponse>
): Promise<CarrierConfigsResponse> {
  try {
    const res = await axios.post<{
      success: boolean;
      message?: string;
      data: CarrierConfigsResponse;
    }>(`${API_BASE}/api/admin/carrier-configs`, payload);
    return res.data?.data || {};
  } catch (error: unknown) {
    const message = getErrorMessage(error, "Failed to update carrier configurations.");
    console.error("[services/carrier.ts] updateCarrierConfigs error:", error);
    throw new Error(message);
  }
}

/**
 * Tests live connection for a carrier (FedEx OAuth, DHL Key, UPS OAuth, Aramex SOAP).
 */
export async function testCarrierConnection(
  carrierCode: CarrierCode
): Promise<ConnectionTestResult> {
  try {
    const res = await axios.post<ConnectionTestResult>(
      `${API_BASE}/api/admin/carrier-configs/${carrierCode}/test`
    );
    return {
      success: res.data?.success ?? true,
      message: res.data?.message || `Connection test for ${carrierCode} succeeded.`,
      access_token: res.data?.access_token,
      expires_in: res.data?.expires_in,
    };
  } catch (error: unknown) {
    const message = getErrorMessage(error, `Connection test failed for ${carrierCode}.`);
    console.error(`[services/carrier.ts] testCarrierConnection (${carrierCode}) error:`, error);
    throw new Error(message);
  }
}

/**
 * Triggers manual sync for all active carrier shipments.
 */
export async function syncAllCarriers(): Promise<{ success: boolean; synced_count: number; message: string }> {
  try {
    const res = await axios.post<{
      success: boolean;
      message: string;
      synced_count: number;
    }>(`${API_BASE}/api/admin/sync-all-carriers`);
    return {
      success: res.data?.success ?? true,
      synced_count: res.data?.synced_count || 0,
      message: res.data?.message || "Sync across all carriers completed.",
    };
  } catch (error: unknown) {
    const message = getErrorMessage(error, "Failed to sync carrier shipments.");
    console.error("[services/carrier.ts] syncAllCarriers error:", error);
    throw new Error(message);
  }
}
export const triggerManualSyncAll = syncAllCarriers;

/**
 * Fetches auto-sync interval configuration.
 */
export async function getAutoSyncConfig(): Promise<AutoSyncConfig> {
  try {
    const res = await axios.get<{ success: boolean; data: AutoSyncConfig }>(
      `${API_BASE}/api/admin/auto-sync-config`
    );
    return res.data?.data || { enabled: true, interval_minutes: 30 };
  } catch (error: unknown) {
    console.warn("Could not fetch auto sync config:", error);
    return { enabled: true, interval_minutes: 30 };
  }
}
export const fetchAutoSyncSettings = getAutoSyncConfig;

/**
 * Updates auto-sync configuration settings.
 */
export async function updateAutoSyncConfig(
  payload: Partial<AutoSyncConfig>
): Promise<AutoSyncConfig> {
  try {
    const res = await axios.post<{ success: boolean; data: AutoSyncConfig }>(
      `${API_BASE}/api/admin/auto-sync-config`,
      payload
    );
    return res.data?.data || { enabled: true, interval_minutes: 30 };
  } catch (error: unknown) {
    const message = getErrorMessage(error, "Failed to update auto-sync settings.");
    console.error("[services/carrier.ts] updateAutoSyncConfig error:", error);
    throw new Error(message);
  }
}
export const updateAutoSyncSettings = updateAutoSyncConfig;

/**
 * Fetches carrier synchronization audit logs.
 */
export async function getSyncLogs(carrier?: string | number): Promise<SyncLogEntry[]> {
  try {
    const courierVal = typeof carrier === "number" ? String(carrier) : carrier || "all";
    const res = await axios.get<{ success: boolean; logs: SyncLogEntry[] }>(
      `${API_BASE}/api/admin/sync-logs`,
      { params: { courier: courierVal, _t: Date.now() } }
    );
    return res.data?.logs || [];
  } catch (error: unknown) {
    console.warn("Could not fetch sync logs:", error);
    return [];
  }
}
export const fetchCarrierLogs = getSyncLogs;
