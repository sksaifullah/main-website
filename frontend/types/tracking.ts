export interface TimelineEventItem {
  stage?: string;
  status?: string;
  location?: string;
  timestamp?: string;
  date?: string;
  time?: string;
  details?: string;
  description?: string;
  courier?: string;
  completed?: boolean;
}

export interface ShipmentDetailsData {
  tracking_number: string;
  partner_tracking_number?: string;
  partner_courier?: string;
  customer_name?: string;
  status: string;
  status_code?: string;
  current_location: string;
  origin: string;
  destination: string;
  sender_name?: string;
  receiver_name: string;
  service: string;
  package_type?: string;
  weight: string;
  pieces?: number;
  estimated_delivery: string;
  last_updated?: string;
  progress_percent?: number;
  proof_of_delivery?: string;
  is_live_synced?: boolean;
  manual_override?: boolean;
  phone?: string;
  email?: string;
  history?: TimelineEventItem[];
}

export interface TrackingApiResponse {
  success: boolean;
  message?: string;
  detail?: string;
  data?: ShipmentDetailsData;
}
