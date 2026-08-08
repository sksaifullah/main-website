import apiClient from "@/lib/apiClient";
import {
  PricingRecord,
  WeightSlabRate,
  CreatePricingPayload,
  PricingFilterParams,
  PaginatedPricingResponse,
} from "@/types";

export type {
  PricingRecord,
  WeightSlabRate,
  CreatePricingPayload,
  PricingFilterParams,
  PaginatedPricingResponse,
};

/**
 * Fetches all pricing records from the backend.
 */
export async function getPricingList(
  params: PricingFilterParams = {}
): Promise<PricingRecord[]> {
  const res = await apiClient.get<{ success: boolean; data: PricingRecord[] }>(
    "/api/admin/pricing",
    { params: { ...params, _t: Date.now() } }
  );
  return res.data?.data || [];
}

/**
 * Creates a new pricing slab record.
 */
export async function createPricingRecord(
  payload: CreatePricingPayload
): Promise<PricingRecord> {
  const res = await apiClient.post<{ success: boolean; data: PricingRecord }>(
    "/api/admin/pricing",
    payload
  );
  return res.data.data;
}

/**
 * Updates an existing pricing slab record.
 */
export async function updatePricingRecord(
  id: string,
  payload: Partial<CreatePricingPayload>
): Promise<PricingRecord> {
  const res = await apiClient.put<{ success: boolean; data: PricingRecord }>(
    `/api/admin/pricing/${id}`,
    payload
  );
  return res.data.data;
}

/**
 * Deletes a pricing slab record.
 */
export async function deletePricingRecord(id: string): Promise<boolean> {
  await apiClient.delete(`/api/admin/pricing/${id}`);
  return true;
}

/**
 * Exports pricing records to a CSV file download.
 */
export function exportPricingCSV(records: PricingRecord[]) {
  if (records.length === 0) {
    alert("No pricing records available to export.");
    return;
  }

  const headers = [
    "Pricing ID", "Country", "Zone", "Category", "Currency",
    "Base Express Price", "Fuel Surcharge %", "Notes",
  ];

  const rows = records.map((p) => [
    `"${p.id}"`,
    `"${p.country}"`,
    `"${p.zone}"`,
    `"${p.category}"`,
    `"${p.currency}"`,
    `"${p.base_express_price}"`,
    `"${p.fuel_surcharge_pct || 0}"`,
    `"${p.notes || ""}"`,
  ]);

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `sky_worldwide_pricing_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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
