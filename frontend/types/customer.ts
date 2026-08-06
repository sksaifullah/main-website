export type CustomerStatus = "Active" | "Inactive" | "VIP" | "Pending";

export interface CustomerRecord {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  address: string;
  country: string;
  total_shipments: number;
  last_shipment: string;
  status: CustomerStatus;
  created_date: string;
}

export interface CreateCustomerPayload {
  name: string;
  company?: string;
  phone: string;
  email: string;
  address: string;
  country: string;
  status?: CustomerStatus;
}

export interface CustomerFilterParams {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedCustomersResponse {
  customers: CustomerRecord[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
