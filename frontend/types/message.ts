export type InquiryType = "message" | "quote";
export type ItemStatus = "Pending" | "Replied" | "Archived" | "Resolved";

export interface ContactMessageItem {
  id: string;
  type: "message";
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: ItemStatus;
  reply?: string;
  replied_at?: string;
  created_at: string;
}

export interface QuoteRequestItem {
  id: string;
  type: "quote";
  name: string;
  email: string;
  phone: string;
  origin_country: string;
  destination_country: string;
  weight_kg: number;
  service_type: string;
  item_description?: string;
  estimated_cost?: string;
  status: ItemStatus;
  reply?: string;
  replied_at?: string;
  created_at: string;
}

export type UnifiedInquiryItem = ContactMessageItem | QuoteRequestItem;

export interface InquiryFilterParams {
  search?: string;
  type?: InquiryType | "all";
  status?: ItemStatus | "all";
  page?: number;
  pageSize?: number;
}

export interface PaginatedInquiriesResponse {
  items: UnifiedInquiryItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
