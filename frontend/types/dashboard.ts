export interface DashboardStatsData {
  total_shipments: number;
  delivered_shipments: number;
  pending_shipments: number;
  in_transit_shipments: number;
  total_revenue: number;
  active_customers: number;
  logs?: SyncLogEntry[];
}

export interface DashboardOverviewData {
  stats: DashboardStatsData;
  recent_shipments: Array<{
    id: string;
    tracking_number: string;
    customer_name: string;
    receiver_name: string;
    origin: string;
    destination: string;
    status: string;
    last_updated: string;
  }>;
}

export interface SyncLogEntry {
  id: string;
  courier?: string;
  partner_courier?: string;
  partner_tracking_number?: string;
  tracking_number?: string;
  shipment_id?: string;
  status: string;
  sync_result?: string;
  http_status?: number;
  response_time_ms?: number;
  message?: string;
  timestamp: string;
  triggered_by?: string;
  result?: string;
  date?: string;
}
