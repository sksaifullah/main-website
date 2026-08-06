import { ShipmentDetailsData } from "./tracking";

export interface CreateShipmentPayload {
  partner_courier: string;
  partner_tracking_number: string;
  customer_name?: string;
  receiver_name?: string;
  phone?: string;
  email?: string;
  origin?: string;
  destination?: string;
  weight?: string;
  package_type?: string;
  pieces?: number;
  status?: string;
  estimated_delivery?: string;
  manual_override?: boolean;
}

export interface UpdateShipmentPayload extends Partial<CreateShipmentPayload> {
  current_location?: string;
  status_override?: boolean;
}

export interface ShipmentFilterParams {
  search?: string;
  courier?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedShipmentsResponse {
  shipments: ShipmentDetailsData[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
