import apiClient, { extractError } from "@/lib/apiClient";
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

/**
 * Fetches combined messages and quote requests from the backend.
 * Backend has separate /api/admin/contacts and /api/admin/quotes endpoints.
 */
export async function getMessagesAndQuotes(
  params: InquiryFilterParams = {}
): Promise<PaginatedInquiriesResponse> {
  try {
    const [contactsRes, quotesRes] = await Promise.all([
      apiClient.get<{ success: boolean; data: ContactMessageItem[] }>(
        "/api/admin/contacts",
        { params: { _t: Date.now() } }
      ),
      apiClient.get<{ success: boolean; data: QuoteRequestItem[] }>(
        "/api/admin/quotes",
        { params: { _t: Date.now() } }
      ),
    ]);

    const messages: ContactMessageItem[] = (contactsRes.data?.data || []).map((m) => ({
      ...m,
      type: "message" as const,
    }));

    const quotes: QuoteRequestItem[] = (quotesRes.data?.data || []).map((q) => ({
      ...q,
      type: "quote" as const,
    }));

    let combined: UnifiedInquiryItem[] = [
      ...messages.map((m) => ({ ...m, type: "message" as const })),
      ...quotes.map((q) => ({ ...q, type: "quote" as const })),
    ];

    // Apply filters
    const typeFilter = params.type || "all";
    const statusFilter = params.status || "";
    const search = (params.search || "").toLowerCase().trim();

    if (typeFilter === "message") combined = combined.filter((i) => i.type === "message");
    else if (typeFilter === "quote") combined = combined.filter((i) => i.type === "quote");

    if (statusFilter) combined = combined.filter((i) => i.status === statusFilter);

    if (search) {
      combined = combined.filter((i) => {
        const matchName = i.name.toLowerCase().includes(search);
        const matchEmail = i.email.toLowerCase().includes(search);
        const matchPhone = (i.phone || "").toLowerCase().includes(search);
        if (i.type === "message") {
          const msg = i as ContactMessageItem;
          return matchName || matchEmail || matchPhone ||
            (msg.subject || "").toLowerCase().includes(search) ||
            (msg.message || "").toLowerCase().includes(search);
        } else {
          const q = i as QuoteRequestItem;
          return matchName || matchEmail || matchPhone ||
            q.origin_country.toLowerCase().includes(search) ||
            q.destination_country.toLowerCase().includes(search);
        }
      });
    }

    // Sort newest first
    combined.sort((a, b) => {
      const ta = a.created_at || "";
      const tb = b.created_at || "";
      return tb.localeCompare(ta);
    });

    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const total = combined.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const startIndex = (page - 1) * pageSize;
    const paginatedItems = combined.slice(startIndex, startIndex + pageSize);

    return {
      items: paginatedItems,
      all: combined,
      messages,
      quotes,
      total,
      page,
      pageSize,
      totalPages,
      unreadMessagesCount: messages.filter((m) => m.status === "Unread" || m.status === "Pending").length,
      newQuotesCount: quotes.filter((q) => q.status === "New" || q.status === "Pending").length,
    };
  } catch (err) {
    console.warn("[messages] fetch failed:", extractError(err));
    return {
      items: [],
      all: [],
      messages: [],
      quotes: [],
      total: 0,
      page: 1,
      pageSize: 10,
      totalPages: 1,
      unreadMessagesCount: 0,
      newQuotesCount: 0,
    };
  }
}

/**
 * Sends a reply to a contact message or quote request.
 */
export async function sendReply(
  id: string,
  type: InquiryType,
  replyText: string
): Promise<boolean> {
  const endpoint = type === "quote"
    ? `/api/admin/quotes/${id}/reply`
    : `/api/admin/contacts/${id}/reply`;
  await apiClient.post(endpoint, { reply: replyText });
  return true;
}

/**
 * Archives an inquiry item (sets status to Archived).
 */
export async function archiveItem(id: string, type: InquiryType): Promise<boolean> {
  const endpoint = type === "quote"
    ? `/api/admin/quotes/${id}`
    : `/api/admin/contacts/${id}`;
  await apiClient.put(endpoint, { status: "Archived", archived: true });
  return true;
}

/**
 * Deletes an inquiry item.
 */
export async function deleteItem(id: string, type: InquiryType): Promise<boolean> {
  const endpoint = type === "quote"
    ? `/api/admin/quotes/${id}`
    : `/api/admin/contacts/${id}`;
  await apiClient.delete(endpoint);
  return true;
}

/**
 * Updates status of a message or quote request.
 */
export async function updateInquiryStatus(
  id: string,
  type: InquiryType,
  newStatus: ItemStatus
): Promise<boolean> {
  const endpoint = type === "quote"
    ? `/api/admin/quotes/${id}`
    : `/api/admin/contacts/${id}`;
  await apiClient.put(endpoint, { status: newStatus });
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
    "ID", "Type", "Customer Name", "Email Address", "Phone",
    "Status", "Created Date", "Details / Route",
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
  link.setAttribute("download", `sky_worldwide_inquiries_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export { getErrorMessage } from "@/types";
