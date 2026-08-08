import apiClient from "@/lib/apiClient";
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

/**
 * Fetches paginated customers list from the backend.
 */
export async function getCustomers(
  params: CustomerFilterParams = {}
): Promise<PaginatedCustomersResponse> {
  const res = await apiClient.get<{ success: boolean; data: PaginatedCustomersResponse }>(
    "/api/admin/customers",
    { params: { ...params, _t: Date.now() } }
  );
  return res.data?.data || { customers: [], total: 0, page: 1, pageSize: 10, totalPages: 1 };
}

/**
 * Creates a new customer profile.
 */
export async function createCustomer(payload: CreateCustomerPayload): Promise<CustomerRecord> {
  const res = await apiClient.post<{ success: boolean; data: CustomerRecord }>(
    "/api/admin/customers",
    payload
  );
  return res.data.data;
}

/**
 * Updates an existing customer profile.
 */
export async function updateCustomer(
  id: string,
  payload: Partial<CreateCustomerPayload>
): Promise<CustomerRecord> {
  const res = await apiClient.put<{ success: boolean; data: CustomerRecord }>(
    `/api/admin/customers/${id}`,
    payload
  );
  return res.data.data;
}

/**
 * Deletes a customer profile.
 */
export async function deleteCustomer(id: string): Promise<boolean> {
  await apiClient.delete(`/api/admin/customers/${id}`);
  return true;
}

/**
 * Bulk deletes multiple customer profiles.
 */
export async function bulkDeleteCustomers(ids: string[]): Promise<number> {
  const res = await apiClient.post<{ success: boolean; deleted_count: number }>(
    "/api/admin/customers/bulk-delete",
    { ids }
  );
  return res.data.deleted_count || ids.length;
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
    "Customer ID", "Full Name", "Company / Organization", "Email Address",
    "Phone Number", "Country", "Total Shipments", "Last Shipment Date",
    "Account Status", "Registered Date",
  ];

  const rows = customers.map((c) => [
    `"${c.id}"`, `"${c.name}"`, `"${c.company || ""}"`, `"${c.email}"`,
    `"${c.phone}"`, `"${c.country}"`, `"${c.total_shipments}"`,
    `"${c.last_shipment}"`, `"${c.status}"`, `"${c.created_date}"`,
  ]);

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `sky_worldwide_customers_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Imports customer profiles from a parsed JSON array (client-side only, then POSTs to backend).
 */
export async function importCustomersFromJSON(
  jsonArray: Record<string, unknown>[]
): Promise<number> {
  let count = 0;
  for (const item of jsonArray) {
    if (item && typeof item === "object" && item.name && item.email) {
      try {
        await createCustomer({
          name: String(item.name).trim(),
          company: String(item.company || "").trim(),
          email: String(item.email).trim().toLowerCase(),
          phone: String(item.phone || "").trim(),
          address: String(item.address || "").trim(),
          country: String(item.country || "India").trim(),
          status: (item.status as CustomerStatus) || "Active",
        });
        count++;
      } catch {
        // skip invalid records
      }
    }
  }
  return count;
}

export function getErrorMessage(err: unknown, fallback = "An error occurred."): string {
  if (!err) return fallback;
  if (typeof err === "object" && err !== null) {
    const e = err as Record<string, unknown>;
    if (e.response && typeof e.response === "object") {
      const r = e.response as Record<string, unknown>;
      if (r.data && typeof r.data === "object") {
        const d = r.data as Record<string, unknown>;
        if (d.detail) return String(d.detail);
        if (d.message) return String(d.message);
      }
    }
    if (e.message) return String(e.message);
  }
  return fallback;
}
