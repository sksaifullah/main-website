export type InquiryType = "message" | "quote";

export type ItemStatus =
  | "Unread"
  | "Read"
  | "Replied"
  | "New"
  | "Pending"
  | "Archived"
  | "Resolved"
  | "Closed";

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
  phone?: string;
  origin_country: string;
  destination_country: string;
  service_type: string;
  weight_kg: number;
  package_contents?: string;
  item_description?: string;
  estimated_cost?: string;
  status: ItemStatus;
  reply?: string;
  replied_at?: string;
  created_at: string;
}

export type UnifiedInquiryItem = ContactMessageItem | QuoteRequestItem;

export interface InquiryFilterParams {
  type?: "all" | "message" | "quote";
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedInquiriesResponse {
  items: UnifiedInquiryItem[];
  messages?: ContactMessageItem[];
  quotes?: QuoteRequestItem[];
  all?: UnifiedInquiryItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  unreadMessagesCount?: number;
  newQuotesCount?: number;
}
