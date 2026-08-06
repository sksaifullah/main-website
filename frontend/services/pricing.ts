import axios from "axios";
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

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (typeof window !== "undefined" && window.location.origin.includes("localhost")
    ? "http://localhost:8000"
    : "");

const PRICING_STORAGE_KEY = "sky_worldwide_pricing_db";

const DEFAULT_SLABS: WeightSlabRate[] = [
  { min_weight: 0.5, max_weight: 5.0, price_per_kg: 28 },
  { min_weight: 5.1, max_weight: 10.0, price_per_kg: 22 },
  { min_weight: 10.1, max_weight: 25.0, price_per_kg: 18 },
  { min_weight: 25.1, max_weight: 50.0, price_per_kg: 14 },
  { min_weight: 50.1, max_weight: 100.0, price_per_kg: 11 },
];

const DEFAULT_PRICING_RECORDS: PricingRecord[] = [
  {
    id: "prc-01",
    country: "United States",
    zone: "Zone A (North America)",
    category: "Express Air Parcel",
    currency: "USD",
    currency_symbol: "$",
    base_express_price: 25.0,
    base_economy_price: 18.0,
    weight_slabs: DEFAULT_SLABS,
    is_active: true,
    notes: "Direct flight connections to NYC (JFK) & ORD hubs.",
    updated_at: "2026-03-25",
  },
  {
    id: "prc-02",
    country: "United Kingdom",
    zone: "Zone B (Europe)",
    category: "Express Air Parcel",
    currency: "GBP",
    currency_symbol: "£",
    base_express_price: 22.0,
    base_economy_price: 15.0,
    weight_slabs: DEFAULT_SLABS,
    is_active: true,
    notes: "LHR Hub express customs clearance included.",
    updated_at: "2026-03-24",
  },
  {
    id: "prc-03",
    country: "United Arab Emirates",
    zone: "Zone C (Middle East)",
    category: "Express Air Parcel",
    currency: "AED",
    currency_symbol: "AED ",
    base_express_price: 15.0,
    base_economy_price: 10.0,
    weight_slabs: DEFAULT_SLABS,
    is_active: true,
    notes: "Next-day delivery available to Dubai & Abu Dhabi.",
    updated_at: "2026-03-20",
  },
  {
    id: "prc-04",
    country: "Australia",
    zone: "Zone D (Asia Pacific)",
    category: "Express Air Parcel",
    currency: "AUD",
    currency_symbol: "AU$",
    base_express_price: 32.0,
    base_economy_price: 24.0,
    weight_slabs: DEFAULT_SLABS,
    is_active: true,
    notes: "Strict agricultural customs inspection applies.",
    updated_at: "2026-03-18",
  },
];

function getLocalPricingDb(): PricingRecord[] {
  if (typeof window === "undefined") return DEFAULT_PRICING_RECORDS;
  try {
    const raw = localStorage.getItem(PRICING_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Could not read local pricing db:", e);
  }
  return DEFAULT_PRICING_RECORDS;
}

function saveLocalPricingDb(list: PricingRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PRICING_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn("Could not save local pricing db:", e);
  }
}

/**
 * Fetches all pricing records.
 */
export async function getPricingList(): Promise<PricingRecord[]> {
  try {
    const res = await axios.get<{ success: boolean; data: PricingRecord[] }>(
      `${API_BASE}/api/admin/pricing-matrix`,
      { params: { _t: Date.now() } }
    );
    if (res.data?.data) {
      return res.data.data;
    }
  } catch (error: unknown) {
    console.warn("[services/pricing.ts] API fetch failed, fallback to local DB:", error);
  }
  return getLocalPricingDb();
}

/**
 * Calculates estimated shipping charge based on destination, service, and weight.
 */
export async function calculateShippingRate(
  countryName: string,
  weightKg: number,
  serviceType: string = "express"
): Promise<{ estimatedCost: number; currencySymbol: string; breakdown: string }> {
  const records = getLocalPricingDb();
  const found = records.find(
    (p) => p.country.toLowerCase() === countryName.toLowerCase()
  );

  const baseRate = found
    ? serviceType.toLowerCase().includes("economy")
      ? found.base_economy_price
      : found.base_express_price
    : 20.0;

  const symbol = found?.currency_symbol || "$";
  const calculatedCost = Math.max(10, Math.round(baseRate * weightKg * 100) / 100);

  return {
    estimatedCost: calculatedCost,
    currencySymbol: symbol,
    breakdown: `${symbol}${baseRate}/kg x ${weightKg}kg`,
  };
}

/**
 * Fetches filtered & paginated pricing records.
 */
export async function getFilteredPricing(
  params: PricingFilterParams = {}
): Promise<PaginatedPricingResponse> {
  const all = getLocalPricingDb();
  const search = (params.search || "").toLowerCase().trim();
  const zoneFilter = (params.zone || "").toLowerCase().trim();
  const categoryFilter = (params.category || "").toLowerCase().trim();
  const activeOnly = params.activeOnly ?? false;

  const filtered = all.filter((p) => {
    const searchMatch =
      !search ||
      p.country.toLowerCase().includes(search) ||
      p.zone.toLowerCase().includes(search) ||
      p.category.toLowerCase().includes(search);

    const zoneMatch = !zoneFilter || p.zone.toLowerCase().includes(zoneFilter);
    const categoryMatch = !categoryFilter || p.category.toLowerCase().includes(categoryFilter);
    const activeMatch = !activeOnly || p.is_active;

    return searchMatch && zoneMatch && categoryMatch && activeMatch;
  });

  const page = params.page || 1;
  const pageSize = params.pageSize || 10;
  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const startIndex = (page - 1) * pageSize;
  const paginatedItems = filtered.slice(startIndex, startIndex + pageSize);

  return {
    rates: paginatedItems,
    total,
    page,
    pageSize,
    totalPages,
  };
}

/**
 * Creates a new pricing slab record.
 */
export async function createPricingRecord(
  payload: CreatePricingPayload
): Promise<PricingRecord> {
  const current = getLocalPricingDb();

  const newRecord: PricingRecord = {
    id: `prc-${Date.now()}`,
    country: payload.country.trim(),
    zone: payload.zone.trim(),
    category: payload.category.trim() || "Express Air Parcel",
    currency: payload.currency || "USD",
    currency_symbol: payload.currency_symbol || "$",
    base_express_price: Number(payload.base_express_price) || 15,
    base_economy_price: Number(payload.base_economy_price) || 10,
    weight_slabs: payload.weight_slabs && payload.weight_slabs.length > 0 ? payload.weight_slabs : DEFAULT_SLABS,
    is_active: payload.is_active ?? true,
    notes: payload.notes || "",
    updated_at: new Date().toISOString().slice(0, 10),
  };

  const updated = [newRecord, ...current];
  saveLocalPricingDb(updated);
  return newRecord;
}

/**
 * Updates an existing pricing record.
 */
export async function updatePricingRecord(
  id: string,
  payload: Partial<CreatePricingPayload>
): Promise<PricingRecord> {
  const current = getLocalPricingDb();
  const idx = current.findIndex((p) => p.id === id);
  if (idx === -1) {
    throw new Error(`Pricing record ${id} not found.`);
  }

  const existing = current[idx];
  const updatedRecord: PricingRecord = {
    ...existing,
    country: payload.country !== undefined ? payload.country.trim() : existing.country,
    zone: payload.zone !== undefined ? payload.zone.trim() : existing.zone,
    category: payload.category !== undefined ? payload.category.trim() : existing.category,
    currency: payload.currency !== undefined ? payload.currency : existing.currency,
    currency_symbol: payload.currency_symbol !== undefined ? payload.currency_symbol : existing.currency_symbol,
    base_express_price: payload.base_express_price !== undefined ? Number(payload.base_express_price) : existing.base_express_price,
    base_economy_price: payload.base_economy_price !== undefined ? Number(payload.base_economy_price) : existing.base_economy_price,
    weight_slabs: payload.weight_slabs !== undefined ? payload.weight_slabs : existing.weight_slabs,
    is_active: payload.is_active !== undefined ? payload.is_active : existing.is_active,
    notes: payload.notes !== undefined ? payload.notes : existing.notes,
    updated_at: new Date().toISOString().slice(0, 10),
  };

  current[idx] = updatedRecord;
  saveLocalPricingDb(current);
  return updatedRecord;
}

/**
 * Deletes a pricing record.
 */
export async function deletePricingRecord(id: string): Promise<boolean> {
  const current = getLocalPricingDb();
  const filtered = current.filter((p) => p.id !== id);
  saveLocalPricingDb(filtered);
  return true;
}

/**
 * Bulk deletes multiple pricing records.
 */
export async function bulkDeletePricing(ids: string[]): Promise<number> {
  const current = getLocalPricingDb();
  const idSet = new Set(ids);
  const filtered = current.filter((p) => !idSet.has(p.id));
  saveLocalPricingDb(filtered);
  return current.length - filtered.length;
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
    "Pricing ID",
    "Country",
    "Zone",
    "Category",
    "Currency",
    "Express Base Price",
    "Economy Base Price",
    "Status",
    "Notes",
    "Updated At",
  ];

  const rows = records.map((p) => [
    `"${p.id}"`,
    `"${p.country}"`,
    `"${p.zone}"`,
    `"${p.category}"`,
    `"${p.currency} (${p.currency_symbol})"`,
    `"${p.currency_symbol}${p.base_express_price}"`,
    `"${p.currency_symbol}${p.base_economy_price}"`,
    `"${p.is_active ? "Active" : "Inactive"}"`,
    `"${p.notes || ""}"`,
    `"${p.updated_at}"`,
  ]);

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute(
    "download",
    `sky_worldwide_pricing_matrix_${new Date().toISOString().slice(0, 10)}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export { getErrorMessage } from "@/types";
