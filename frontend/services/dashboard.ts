import apiClient, { extractError } from "@/lib/apiClient";
import {
  ShipmentDetailsData,
  SyncLogEntry,
  DashboardStatsData,
  DashboardOverviewData,
} from "@/types";

export type { ShipmentDetailsData, SyncLogEntry, DashboardStatsData, DashboardOverviewData };

export interface DashboardStats {
  totalShipments: number;
  delivered: number;
  pending: number;
  inTransit: number;
  cancelled: number;
  totalRevenue: number;
  activeCustomers: number;
  logs?: SyncLogEntry[];
}

/**
 * Fetches dashboard statistics.
 * Derives stats from /api/admin/analytics which computes from live shipment data.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const syncLogs = await getSyncLogs();

  try {
    const res = await apiClient.get<{ success: boolean; data: Record<string, unknown> }>(
      "/api/admin/analytics",
      { params: { range: "30days", _t: Date.now() } }
    );
    if (res.data?.data) {
      const d = res.data.data;
      return {
        totalShipments: Number(d.total_shipments) || 0,
        delivered: Number(d.delivered) || 0,
        pending: Number(d.pending) || 0,
        inTransit: Number(d.in_transit) || 0,
        cancelled: Number(d.cancelled) || 0,
        totalRevenue: Number(d.total_revenue) || 0,
        activeCustomers: Number(d.total_customers) || 0,
        logs: syncLogs,
      };
    }
  } catch (e) {
    console.warn("[dashboard] analytics fetch failed:", extractError(e));
  }

  return {
    totalShipments: 0,
    delivered: 0,
    pending: 0,
    inTransit: 0,
    cancelled: 0,
    totalRevenue: 0,
    activeCustomers: 0,
    logs: syncLogs,
  };
}

/**
 * Fetches recent audit sync logs.
 */
export async function getSyncLogs(courierFilter?: string): Promise<SyncLogEntry[]> {
  try {
    const res = await apiClient.get<{ success: boolean; logs: SyncLogEntry[] }>(
      "/api/admin/sync-logs",
      { params: { courier: courierFilter || "all", _t: Date.now() } }
    );
    return res.data?.logs || [];
  } catch (e) {
    console.warn("[dashboard] sync logs fetch failed:", extractError(e));
    return [];
  }
}

export const fetchDashboardData = getDashboardStats;
