import axios from "axios";
import {
  InquiryType,
  ItemStatus,
  ContactMessageItem,
  QuoteRequestItem,
  UnifiedInquiryItem,
  InquiryFilterParams,
  PaginatedInquiriesResponse,
} from "@/types";

export type {
  InquiryType,
  ItemStatus,
  ContactMessageItem,
  QuoteRequestItem,
  UnifiedInquiryItem,
  InquiryFilterParams,
  PaginatedInquiriesResponse,
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (typeof window !== "undefined" && window.location.origin.includes("localhost")
    ? "http://localhost:8000"
    : "");

const MESSAGES_STORAGE_KEY = "sky_worldwide_messages_db";
const QUOTES_STORAGE_KEY = "sky_worldwide_quotes_db";

const DEFAULT_MESSAGES: ContactMessageItem[] = [
  {
    id: "msg-101",
    type: "message",
    name: "Vikram Malhotra",
    email: "vikram@malhotratech.in",
    phone: "+91 98211 44556",
    subject: "Urgent Medical Shipment to London",
    message: "Need temperature-controlled express air delivery for oncology drugs to Harley St, London. Please advise HS codes and documentation required.",
    status: "Unread",
    created_at: "2026-03-29 11:20 IST",
  },
  {
    id: "msg-102",
    type: "message",
    name: "Sarah Jenkins",
    email: "sjenkins@usimports.com",
    phone: "+1 415 889 0122",
    subject: "Bulk Commercial Air Freight Tariff",
    message: "We export 500kg of textile garments monthly from Mumbai to Los Angeles. Requesting corporate contract rates and transit times.",
    status: "Replied",
    reply: "Dear Sarah, Sent contract proposal to your email with $4.80/kg air freight tariff.",
    replied_at: "2026-03-28",
    created_at: "2026-03-27 16:45 IST",
  },
];

const DEFAULT_QUOTES: QuoteRequestItem[] = [
  {
    id: "quote-201",
    type: "quote",
    name: "Sunil Kapoor",
    email: "sunil@kapoorgroup.com",
    phone: "+91 99200 88776",
    origin_country: "India",
    destination_country: "United States",
    service_type: "Express Air Freight",
    weight_kg: 12.5,
    package_contents: "Homemade sweets and clothing samples",
    estimated_cost: "$185.00",
    status: "New",
    created_at: "2026-03-29 09:15 IST",
  },
  {
    id: "quote-202",
    type: "quote",
    name: "Fatima Al-Zahra",
    email: "fatima@dubaient.ae",
    phone: "+971 50 123 4567",
    origin_country: "India",
    destination_country: "United Arab Emirates",
    service_type: "Food & Pharma Special Care",
    weight_kg: 5.0,
    package_contents: "Prescription medication and herbal supplements",
    estimated_cost: "$65.00",
    status: "Replied",
    reply: "Official AWB Quote #SW-DXB-99 generated at $65 flat rate including doorstep pickup.",
    replied_at: "2026-03-28",
    created_at: "2026-03-28 14:00 IST",
  },
];

function getLocalStore<T>(key: string, defaultData: T[]): T[] {
  if (typeof window === "undefined") return defaultData;
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn(`Could not read local store ${key}:`, e);
  }
  return defaultData;
}

function saveLocalStore<T>(key: string, list: T[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch (e) {
    console.warn(`Could not save local store ${key}:`, e);
  }
}

/**
 * Fetches combined messages and quote requests with filtering and pagination.
 */
export async function getMessagesAndQuotes(
  params: InquiryFilterParams = {}
): Promise<PaginatedInquiriesResponse> {
  try {
    const res = await axios.get<{
      success: boolean;
      data: PaginatedInquiriesResponse;
    }>(`${API_BASE}/api/admin/messages`, {
      params: { ...params, _t: Date.now() },
    });
    if (res.data?.data) {
      return res.data.data;
    }
  } catch (error: unknown) {
    console.warn("[services/messages.ts] API fetch failed, fallback to local DB:", error);
  }

  const messages = getLocalStore<ContactMessageItem>(MESSAGES_STORAGE_KEY, DEFAULT_MESSAGES);
  const quotes = getLocalStore<QuoteRequestItem>(QUOTES_STORAGE_KEY, DEFAULT_QUOTES);

  let combined: UnifiedInquiryItem[] = [
    ...messages.map((m) => ({ ...m, type: "message" as const })),
    ...quotes.map((q) => ({ ...q, type: "quote" as const })),
  ];

  const search = (params.search || "").toLowerCase().trim();
  const typeFilter = params.type || "all";
  const statusFilter = params.status || "";

  if (typeFilter === "message") {
    combined = combined.filter((i) => i.type === "message");
  } else if (typeFilter === "quote") {
    combined = combined.filter((i) => i.type === "quote");
  }

  if (statusFilter) {
    combined = combined.filter((i) => i.status === statusFilter);
  }

  if (search) {
    combined = combined.filter((i) => {
      const matchName = i.name.toLowerCase().includes(search);
      const matchEmail = i.email.toLowerCase().includes(search);
      const matchPhone = (i.phone || "").toLowerCase().includes(search);
      if (i.type === "message") {
        const msg = i as ContactMessageItem;
        return matchName || matchEmail || matchPhone || (msg.subject || "").toLowerCase().includes(search) || msg.message.toLowerCase().includes(search);
      } else {
        const q = i as QuoteRequestItem;
        return matchName || matchEmail || matchPhone || q.origin_country.toLowerCase().includes(search) || q.destination_country.toLowerCase().includes(search);
      }
    });
  }

  const page = params.page || 1;
  const pageSize = params.pageSize || 10;
  const total = combined.length;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const startIndex = (page - 1) * pageSize;
  const paginatedItems = combined.slice(startIndex, startIndex + pageSize);

  return {
    items: paginatedItems,
    total,
    page,
    pageSize,
    totalPages,
    unreadMessagesCount: messages.filter((m) => m.status === "Unread").length,
    newQuotesCount: quotes.filter((q) => q.status === "New").length,
  };
}

/**
 * Updates status of a message or quote request.
 */
export async function updateInquiryStatus(
  id: string,
  type: InquiryType,
  newStatus: ItemStatus
): Promise<boolean> {
  if (type === "quote") {
    const quotes = getLocalStore<QuoteRequestItem>(QUOTES_STORAGE_KEY, DEFAULT_QUOTES);
    const idx = quotes.findIndex((q) => q.id === id);
    if (idx !== -1) {
      quotes[idx].status = newStatus;
      saveLocalStore(QUOTES_STORAGE_KEY, quotes);
      return true;
    }
  } else {
    const messages = getLocalStore<ContactMessageItem>(MESSAGES_STORAGE_KEY, DEFAULT_MESSAGES);
    const idx = messages.findIndex((m) => m.id === id);
    if (idx !== -1) {
      messages[idx].status = newStatus;
      saveLocalStore(MESSAGES_STORAGE_KEY, messages);
      return true;
    }
  }
  return false;
}

/**
 * Records a reply to a message or quote request.
 */
export async function sendReply(
  id: string,
  type: InquiryType,
  replyText: string
): Promise<boolean> {
  const now = new Date().toISOString().slice(0, 10);
  if (type === "quote") {
    const quotes = getLocalStore<QuoteRequestItem>(QUOTES_STORAGE_KEY, DEFAULT_QUOTES);
    const idx = quotes.findIndex((q) => q.id === id);
    if (idx !== -1) {
      quotes[idx].reply = replyText;
      quotes[idx].replied_at = now;
      quotes[idx].status = "Replied";
      saveLocalStore(QUOTES_STORAGE_KEY, quotes);
      return true;
    }
  } else {
    const messages = getLocalStore<ContactMessageItem>(MESSAGES_STORAGE_KEY, DEFAULT_MESSAGES);
    const idx = messages.findIndex((m) => m.id === id);
    if (idx !== -1) {
      messages[idx].reply = replyText;
      messages[idx].replied_at = now;
      messages[idx].status = "Replied";
      saveLocalStore(MESSAGES_STORAGE_KEY, messages);
      return true;
    }
  }
  return false;
}

/**
 * Archives an inquiry item.
 */
export async function archiveItem(id: string, type: InquiryType): Promise<boolean> {
  return updateInquiryStatus(id, type, "Archived");
}

/**
 * Deletes an inquiry item.
 */
export async function deleteItem(id: string, type: InquiryType): Promise<boolean> {
  if (type === "quote") {
    const quotes = getLocalStore<QuoteRequestItem>(QUOTES_STORAGE_KEY, DEFAULT_QUOTES);
    const filtered = quotes.filter((q) => q.id !== id);
    saveLocalStore(QUOTES_STORAGE_KEY, filtered);
  } else {
    const messages = getLocalStore<ContactMessageItem>(MESSAGES_STORAGE_KEY, DEFAULT_MESSAGES);
    const filtered = messages.filter((m) => m.id !== id);
    saveLocalStore(MESSAGES_STORAGE_KEY, filtered);
  }
  return true;
}

/**
 * Exports messages/quotes to CSV download.
 */
export function exportCommunicationCSV(items: UnifiedInquiryItem[]) {
  if (items.length === 0) {
    alert("No inquiry records available to export.");
    return;
  }

  const headers = [
    "ID",
    "Type",
    "Customer Name",
    "Email Address",
    "Phone",
    "Status",
    "Created Date",
    "Details / Route",
  ];

  const rows = items.map((item) => {
    const detail =
      item.type === "quote"
        ? `${(item as QuoteRequestItem).origin_country} -> ${(item as QuoteRequestItem).destination_country} (${(item as QuoteRequestItem).weight_kg}kg)`
        : (item as ContactMessageItem).subject || (item as ContactMessageItem).message;

    return [
      `"${item.id}"`,
      `"${item.type.toUpperCase()}"`,
      `"${item.name}"`,
      `"${item.email}"`,
      `"${item.phone || ""}"`,
      `"${item.status}"`,
      `"${item.created_at}"`,
      `"${detail}"`,
    ];
  });

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute(
    "download",
    `sky_worldwide_inquiries_${new Date().toISOString().slice(0, 10)}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export { getErrorMessage } from "@/types";
