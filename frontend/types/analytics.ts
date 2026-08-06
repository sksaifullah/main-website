export interface AnalyticsOverview {
  totalShipments: number;
  activeShipments: number;
  deliveredShipments: number;
  exceptionShipments: number;
  totalRevenue: number;
  totalCustomers: number;
  averageDeliveryDays: number;
  onTimeDeliveryRate: number;
}

export interface RevenueChartData {
  month?: string;
  date?: string;
  revenue?: number;
  shipments?: number;
  shipmentsCount?: number;
}

export interface AnalyticsSummary {
  total_shipments: number;
  delivered_shipments: number;
  pending_shipments: number;
  in_transit_shipments: number;
  estimated_revenue: number;
  top_countries: Array<{ country: string; count: number; percentage: number }>;
  top_couriers: Array<{ courier: string; count: number; percentage: number }>;
  monthly_stats?: Array<{ month: string; revenue: number }>;
  daily_stats?: Array<{ date: string; shipments: number }>;
}

export interface CourierChartData {
  courier: string;
  shipmentsCount: number;
  sharePercentage: number;
}

export interface CountryChartData {
  country: string;
  shipmentsCount: number;
  sharePercentage: number;
}
