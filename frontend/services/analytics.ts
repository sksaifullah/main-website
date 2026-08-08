import apiClient, { extractError } from "@/lib/apiClient";
import {
  AnalyticsSummary,
  RevenueChartData,
  CourierChartData,
  CountryChartData,
} from "@/types";

export type {
  AnalyticsSummary,
  RevenueChartData,
  CourierChartData,
  CountryChartData,
};

/**
 * Fetches analytics summary from the backend /api/admin/analytics endpoint.
 */
export async function getAnalyticsSummary(dateRange?: string): Promise<AnalyticsSummary> {
  try {
    const res = await apiClient.get<{ success: boolean; data: Record<string, unknown> }>(
      "/api/admin/analytics",
      { params: { range: dateRange || "30days", _t: Date.now() } }
    );
    const d = res.data?.data || {};

    const topCountries = Array.isArray(d.top_countries)
      ? (d.top_countries as { country: string; count: number }[]).map((c) => ({
          country: c.country,
          count: c.count,
          percentage: Math.round((c.count / Math.max(1, Number(d.total_shipments))) * 100),
        }))
      : [];

    const topCouriers = Array.isArray(d.top_couriers)
      ? (d.top_couriers as { courier: string; count: number }[]).map((c) => ({
          courier: c.courier,
          count: c.count,
          percentage: Math.round((c.count / Math.max(1, Number(d.total_shipments))) * 100),
        }))
      : [];

    return {
      total_shipments: Number(d.total_shipments) || 0,
      delivered_shipments: Number(d.delivered) || 0,
      pending_shipments: Number(d.pending) || 0,
      in_transit_shipments: Number(d.in_transit) || 0,
      estimated_revenue: Number(d.total_revenue) || 0,
      top_countries: topCountries,
      top_couriers: topCouriers,
      monthly_stats: Array.isArray(d.monthly_stats)
        ? (d.monthly_stats as Array<{ month: string; revenue: number }>)
        : [],
      daily_stats: Array.isArray(d.daily_stats)
        ? (d.daily_stats as Array<{ date: string; shipments: number }>)
        : [],
    };
  } catch (err) {
    console.warn("[analytics] fetch failed:", extractError(err));
    return {
      total_shipments: 0,
      delivered_shipments: 0,
      pending_shipments: 0,
      in_transit_shipments: 0,
      estimated_revenue: 0,
      top_countries: [],
      top_couriers: [],
      monthly_stats: [],
      daily_stats: [],
    };
  }
}

export const fetchAnalyticsData = getAnalyticsSummary;
