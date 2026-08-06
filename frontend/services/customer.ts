import axios from "axios";
import {
  CustomerStatus,
  CustomerRecord,
  CreateCustomerPayload,
  CustomerFilterParams,
  PaginatedCustomersResponse,
} from "@/types";

export type {
  CustomerStatus,
  CustomerRecord,
  CreateCustomerPayload,
  CustomerFilterParams,
  PaginatedCustomersResponse,
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (typeof window !== "undefined" && window.location.origin.includes("localhost")
    ? "http://localhost:8000"
    : "");

const CUSTOMER_STORAGE_KEY = "sky_worldwide_customers_db";

const DEFAULT_CUSTOMERS: CustomerRecord[] = [
  {
    id: "cust-1001",
    name: "Rajesh Sharma",
    company: "Sharma Traders Pvt Ltd",
    email: "rajesh@sharmatraders.com",
    phone: "+91 98200 12345",
    address: "102 Industrial Estate, Andheri East, Mumbai 400069",
    country: "India",
    total_shipments: 24,
    last_shipment: "2026-03-28",
    status: "Active",
    created_date: "2025-01-15",
  },
  {
    id: "cust-1002",
    name: "Anita Desai",
    company: "Desai Pharma Export",
    email: "anita@desaipharma.in",
    phone: "+91 98199 87654",
    address: "Plot 45, GIDC Electronics Zone, Gandhinagar 382028",
    country: "India",
    total_shipments: 58,
    last_shipment: "2026-03-29",
    status: "Active",
    created_date: "2024-11-20",
  },
  {
    id: "cust-1003",
    name: "Michael Miller",
    company: "Global Tech Imports LLC",
    email: "mmiller@globaltech.com",
    phone: "+1 212 555 0199",
    address: "742 Evergreen Terrace, New York, NY 10001",
    country: "USA",
    total_shipments: 12,
    last_shipment: "2026-03-20",
    status: "Active",
    created_date: "2025-02-01",
  },
  {
    id: "cust-1004",
    name: "Siddharth Mehta",
    company: "Mehta Handicrafts",
    email: "sid@mehtacrafts.com",
    phone: "+91 99300 44321",
    address: "12 Zaveri Bazar, Kalbadevi, Mumbai 400002",
    country: "India",
    total_shipments: 5,
    last_shipment: "2026-02-14",
    status: "Inactive",
    created_date: "2025-02-10",
  },
];

function getLocalCustomerDb(): CustomerRecord[] {
  if (typeof window === "undefined") return DEFAULT_CUSTOMERS;
  try {
    const raw = localStorage.getItem(CUSTOMER_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Could not read local customer db:", e);
  }
  return DEFAULT_CUSTOMERS;
}

function saveLocalCustomerDb(list: CustomerRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn("Could not save local customer db:", e);
  }
}

/**
 * Fetches paginated customers list.
 */
export async function getCustomers(
  params: CustomerFilterParams = {}
): Promise<PaginatedCustomersResponse> {
  try {
    const res = await axios.get<{
      success: boolean;
      data: PaginatedCustomersResponse;
    }>(`${API_BASE}/api/admin/customers`, {
      params: { ...params, _t: Date.now() },
    });
    if (res.data?.data) {
      return res.data.data;
    }
  } catch (error: unknown) {
    console.warn("[services/customer.ts] API fetch failed, fallback to local DB:", error);
  }

  // Fallback local memory store filter
  const all = getLocalCustomerDb();
  const search = (params.search || "").toLowerCase().trim();
  const statusFilter = params.status || "";

  const filtered = all.filter((c) => {
    const matchesSearch =
      !search ||
      c.name.toLowerCase().includes(search) ||
      (c.company || "").toLowerCase().includes(search) ||
      c.email.toLowerCase().includes(search) ||
      c.phone.toLowerCase().includes(search) ||
      c.country.toLowerCase().includes(search);

    const matchesStatus = !statusFilter || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const page = params.page || 1;
  const pageSize = params.pageSize || 10;
  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const startIndex = (page - 1) * pageSize;
  const paginatedItems = filtered.slice(startIndex, startIndex + pageSize);

  return {
    customers: paginatedItems,
    total,
    page,
    pageSize,
    totalPages,
  };
}

/**
 * Creates a new customer profile.
 */
export async function createCustomer(
  payload: CreateCustomerPayload
): Promise<CustomerRecord> {
  const current = getLocalCustomerDb();
  const newCustomer: CustomerRecord = {
    id: `cust-${Date.now()}`,
    name: payload.name.trim(),
    company: payload.company?.trim() || "",
    email: payload.email.trim().toLowerCase(),
    phone: payload.phone.trim(),
    address: payload.address.trim(),
    country: payload.country.trim() || "India",
    total_shipments: 0,
    last_shipment: "N/A",
    status: payload.status || "Active",
    created_date: new Date().toISOString().slice(0, 10),
  };

  try {
    const res = await axios.post<{ success: boolean; data: CustomerRecord }>(
      `${API_BASE}/api/admin/customers`,
      newCustomer
    );
    if (res.data?.data) {
      return res.data.data;
    }
  } catch (error: unknown) {
    console.warn("[services/customer.ts] API create failed, using local DB:", error);
  }

  const updated = [newCustomer, ...current];
  saveLocalCustomerDb(updated);
  return newCustomer;
}

/**
 * Updates an existing customer profile.
 */
export async function updateCustomer(
  id: string,
  payload: Partial<CreateCustomerPayload>
): Promise<CustomerRecord> {
  const current = getLocalCustomerDb();
  const idx = current.findIndex((c) => c.id === id);
  if (idx === -1) {
    throw new Error(`Customer with ID ${id} not found.`);
  }

  const existing = current[idx];
  const updatedCustomer: CustomerRecord = {
    ...existing,
    name: payload.name !== undefined ? payload.name.trim() : existing.name,
    company: payload.company !== undefined ? payload.company.trim() : existing.company,
    email: payload.email !== undefined ? payload.email.trim().toLowerCase() : existing.email,
    phone: payload.phone !== undefined ? payload.phone.trim() : existing.phone,
    address: payload.address !== undefined ? payload.address.trim() : existing.address,
    country: payload.country !== undefined ? payload.country.trim() : existing.country,
    status: payload.status !== undefined ? payload.status : existing.status,
  };

  try {
    const res = await axios.put<{ success: boolean; data: CustomerRecord }>(
      `${API_BASE}/api/admin/customers/${id}`,
      updatedCustomer
    );
    if (res.data?.data) {
      return res.data.data;
    }
  } catch (error: unknown) {
    console.warn("[services/customer.ts] API update failed, using local DB:", error);
  }

  current[idx] = updatedCustomer;
  saveLocalCustomerDb(current);
  return updatedCustomer;
}

/**
 * Deletes a customer profile.
 */
export async function deleteCustomer(id: string): Promise<boolean> {
  try {
    await axios.delete(`${API_BASE}/api/admin/customers/${id}`);
  } catch (error: unknown) {
    console.warn("[services/customer.ts] API delete failed, using local DB:", error);
  }

  const current = getLocalCustomerDb();
  const filtered = current.filter((c) => c.id !== id);
  saveLocalCustomerDb(filtered);
  return true;
}

/**
 * Bulk deletes multiple customer profiles.
 */
export async function bulkDeleteCustomers(ids: string[]): Promise<number> {
  const current = getLocalCustomerDb();
  const idSet = new Set(ids);
  const filtered = current.filter((c) => !idSet.has(c.id));
  saveLocalCustomerDb(filtered);
  return current.length - filtered.length;
}

/**
 * Exports customer records to a CSV file download.
 */
export function exportCustomersCSV(customers: CustomerRecord[]) {
  if (customers.length === 0) {
    alert("No customer records available to export.");
    return;
  }

  const headers = [
    "Customer ID",
    "Full Name",
    "Company / Organization",
    "Email Address",
    "Phone Number",
    "Country",
    "Total Shipments",
    "Last Shipment Date",
    "Account Status",
    "Registered Date",
  ];

  const rows = customers.map((c) => [
    `"${c.id}"`,
    `"${c.name}"`,
    `"${c.company || ""}"`,
    `"${c.email}"`,
    `"${c.phone}"`,
    `"${c.country}"`,
    `"${c.total_shipments}"`,
    `"${c.last_shipment}"`,
    `"${c.status}"`,
    `"${c.created_date}"`,
  ]);

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute(
    "download",
    `sky_worldwide_customers_${new Date().toISOString().slice(0, 10)}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Imports customer profiles from a parsed JSON array.
 */
export function importCustomersFromJSON(jsonArray: Record<string, unknown>[]): number {
  const current = getLocalCustomerDb();
  const imported: CustomerRecord[] = [];

  for (const item of jsonArray) {
    if (item && typeof item === "object" && item.name && item.email) {
      imported.push({
        id: `cust-imp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: String(item.name).trim(),
        company: String(item.company || "").trim(),
        email: String(item.email).trim().toLowerCase(),
        phone: String(item.phone || "").trim(),
        address: String(item.address || "").trim(),
        country: String(item.country || "India").trim(),
        total_shipments: Number(item.total_shipments) || 0,
        last_shipment: String(item.last_shipment || "N/A"),
        status: (item.status as CustomerStatus) || "Active",
        created_date: String(item.created_date || new Date().toISOString().slice(0, 10)),
      });
    }
  }

  if (imported.length > 0) {
    const updated = [...imported, ...current];
    saveLocalCustomerDb(updated);
  }

  return imported.length;
}

export { getErrorMessage } from "@/types";
