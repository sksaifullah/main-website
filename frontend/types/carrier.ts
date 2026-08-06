export type CarrierCode = "fedex" | "dhl" | "ups" | "aramex";

export interface CarrierTestResult {
  success: boolean;
  message: string;
  timestamp: string;
}

export interface CarrierConfig {
  enabled?: boolean;
  is_active?: boolean;
  sandbox_mode?: boolean;
  client_id?: string;
  client_secret?: string;
  account_number?: string;
  account_pin?: string;
  api_key?: string;
  api_secret?: string;
  username?: string;
  password?: string;
  mode?: "sandbox" | "production" | string;
  entity?: string;
  version?: string;
  access_token?: string;
  expires_in?: number;
  token_acquired_at?: string;
  last_test_result?: CarrierTestResult;
}

export interface AutoSyncConfig {
  enabled: boolean;
  interval_minutes: number;
}

export interface CarrierConfigsResponse {
  fedex?: CarrierConfig;
  dhl?: CarrierConfig;
  ups?: CarrierConfig;
  aramex?: CarrierConfig;
  auto_sync?: AutoSyncConfig;
}

export interface CarrierTestResponse {
  success: boolean;
  carrier: string;
  message: string;
  token?: string;
  expires_in?: number;
  details?: Record<string, unknown>;
}

export type { SyncLogEntry } from "./dashboard";
