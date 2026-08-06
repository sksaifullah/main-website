import axios from "axios";
import {
  CountryRecord,
  CreateCountryPayload,
  CountryFilterParams,
  PaginatedCountriesResponse,
} from "@/types";

export type {
  CountryRecord,
  CreateCountryPayload,
  CountryFilterParams,
  PaginatedCountriesResponse,
};
export { getErrorMessage } from "@/types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (typeof window !== "undefined" && window.location.origin.includes("localhost")
    ? "http://localhost:8000"
    : "");

const COUNTRY_STORAGE_KEY = "sky_worldwide_countries_db";

const DEFAULT_COUNTRIES: CountryRecord[] = [
  {
    id: "c_usa",
    code: "US",
    name: "United States",
    flag_url: "https://flagcdn.com/w80/us.png",
    delivery_time: "2–4 Days",
    currency: "USD",
    currency_symbol: "$",
    timezone: "EST / PST (UTC-5 to -8)",
    major_cities: "New York, Los Angeles, Chicago, Houston, Miami",
    image_url: "https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=600&q=80",
    is_enabled: true,
    duty_tax_info: "De minimis threshold $800 USD. Fast customs clearance.",
    updated_at: "2026-03-25",
  },
  {
    id: "c_uk",
    code: "GB",
    name: "United Kingdom",
    flag_url: "https://flagcdn.com/w80/gb.png",
    delivery_time: "3–5 Days",
    currency: "GBP",
    currency_symbol: "£",
    timezone: "GMT (UTC+0)",
    major_cities: "London, Manchester, Birmingham, Edinburgh, Glasgow",
    image_url: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80",
    is_enabled: true,
    duty_tax_info: "VAT 20% applies on imports > £135. EORI number recommended.",
    updated_at: "2026-03-24",
  },
  {
    id: "c_uae",
    code: "AE",
    name: "United Arab Emirates",
    flag_url: "https://flagcdn.com/w80/ae.png",
    delivery_time: "1–3 Days",
    currency: "AED",
    currency_symbol: "AED ",
    timezone: "GST (UTC+4)",
    major_cities: "Dubai, Abu Dhabi, Sharjah, Ajman",
    image_url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80",
    is_enabled: true,
    duty_tax_info: "5% customs duty on goods > AED 300. Express air delivery.",
    updated_at: "2026-03-22",
  },
  {
    id: "c_aus",
    code: "AU",
    name: "Australia",
    flag_url: "https://flagcdn.com/w80/au.png",
    delivery_time: "4–6 Days",
    currency: "AUD",
    currency_symbol: "AU$",
    timezone: "AEST (UTC+10)",
    major_cities: "Sydney, Melbourne, Brisbane, Perth",
    image_url: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=600&q=80",
    is_enabled: true,
    duty_tax_info: "GST 10% on low-value imported goods (<= AUD 1,000).",
    updated_at: "2026-03-20",
  },
  {
    id: "c_can",
    code: "CA",
    name: "Canada",
    flag_url: "https://flagcdn.com/w80/ca.png",
    delivery_time: "3–5 Days",
    currency: "CAD",
    currency_symbol: "CA$",
    timezone: "EST / PST (UTC-5 to -8)",
    major_cities: "Toronto, Vancouver, Montreal, Calgary",
    image_url: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=600&q=80",
    is_enabled: true,
    duty_tax_info: "GST/HST applies depending on province.",
    updated_at: "2026-03-18",
  },
  {
    id: "c_sgp",
    code: "SG",
    name: "Singapore",
    flag_url: "https://flagcdn.com/w80/sg.png",
    delivery_time: "2–3 Days",
    currency: "SGD",
    currency_symbol: "S$",
    timezone: "SGT (UTC+8)",
    major_cities: "Singapore City",
    image_url: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=600&q=80",
    is_enabled: true,
    duty_tax_info: "GST 9% on non-OVR goods > SGD 400.",
    updated_at: "2026-03-15",
  },
];

function getLocalCountryDb(): CountryRecord[] {
  if (typeof window === "undefined") return DEFAULT_COUNTRIES;
  try {
    const raw = localStorage.getItem(COUNTRY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Could not read local country db:", e);
  }
  return DEFAULT_COUNTRIES;
}

function saveLocalCountryDb(list: CountryRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(COUNTRY_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn("Could not save local country db:", e);
  }
}

/**
 * Fetches all country destinations.
 */
export async function getCountries(): Promise<CountryRecord[]> {
  try {
    const res = await axios.get<{ success: boolean; data: CountryRecord[] }>(
      `${API_BASE}/api/admin/countries`,
      { params: { _t: Date.now() } }
    );
    if (res.data?.data) {
      return res.data.data;
    }
  } catch (error: unknown) {
    console.warn("[services/country.ts] API fetch failed, fallback to local DB:", error);
  }
  return getLocalCountryDb();
}

/**
 * Fetches filtered and paginated countries list.
 */
export async function getFilteredCountries(
  params: CountryFilterParams = {}
): Promise<PaginatedCountriesResponse> {
  const all = getLocalCountryDb();
  const search = (params.search || "").toLowerCase().trim();

  const filtered = all.filter((c) => {
    const searchMatch =
      !search ||
      c.name.toLowerCase().includes(search) ||
      c.code.toLowerCase().includes(search) ||
      c.currency.toLowerCase().includes(search) ||
      c.major_cities.toLowerCase().includes(search);

    const enabledMatch = !params.enabledOnly || c.is_enabled;

    return searchMatch && enabledMatch;
  });

  const page = params.page || 1;
  const pageSize = params.pageSize || 10;
  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const startIndex = (page - 1) * pageSize;
  const paginatedItems = filtered.slice(startIndex, startIndex + pageSize);

  return {
    countries: paginatedItems,
    total,
    page,
    pageSize,
    totalPages,
  };
}

/**
 * Creates a new country record.
 */
export async function createCountryRecord(
  payload: CreateCountryPayload
): Promise<CountryRecord> {
  const current = getLocalCountryDb();

  const codeUpper = (payload.code || "US").toUpperCase().slice(0, 2);
  const flagUrl =
    payload.flag_url || `https://flagcdn.com/w80/${codeUpper.toLowerCase()}.png`;

  const newRecord: CountryRecord = {
    id: `c_${Date.now()}`,
    code: codeUpper,
    name: payload.name.trim(),
    flag_url: flagUrl,
    delivery_time: payload.delivery_time || "3–5 Days",
    currency: payload.currency || "USD",
    currency_symbol: payload.currency_symbol || "$",
    timezone: payload.timezone || "UTC+0",
    major_cities: payload.major_cities || "Capital City",
    image_url: payload.image_url || "",
    is_enabled: payload.is_enabled ?? true,
    duty_tax_info: payload.duty_tax_info || "",
    updated_at: new Date().toISOString().slice(0, 10),
  };

  const updated = [newRecord, ...current];
  saveLocalCountryDb(updated);
  return newRecord;
}

/**
 * Updates an existing country record.
 */
export async function updateCountryRecord(
  id: string,
  payload: Partial<CreateCountryPayload>
): Promise<CountryRecord> {
  const current = getLocalCountryDb();
  const idx = current.findIndex((c) => c.id === id);
  if (idx === -1) {
    throw new Error(`Country record with ID ${id} not found.`);
  }

  const existing = current[idx];
  const updatedRecord: CountryRecord = {
    ...existing,
    name: payload.name !== undefined ? payload.name.trim() : existing.name,
    code: payload.code !== undefined ? payload.code.toUpperCase().slice(0, 2) : existing.code,
    delivery_time: payload.delivery_time !== undefined ? payload.delivery_time : existing.delivery_time,
    currency: payload.currency !== undefined ? payload.currency : existing.currency,
    currency_symbol: payload.currency_symbol !== undefined ? payload.currency_symbol : existing.currency_symbol,
    timezone: payload.timezone !== undefined ? payload.timezone : existing.timezone,
    major_cities: payload.major_cities !== undefined ? payload.major_cities : existing.major_cities,
    image_url: payload.image_url !== undefined ? payload.image_url : existing.image_url,
    is_enabled: payload.is_enabled !== undefined ? payload.is_enabled : existing.is_enabled,
    duty_tax_info: payload.duty_tax_info !== undefined ? payload.duty_tax_info : existing.duty_tax_info,
    updated_at: new Date().toISOString().slice(0, 10),
  };

  current[idx] = updatedRecord;
  saveLocalCountryDb(current);
  return updatedRecord;
}

/**
 * Toggles status (enabled/disabled) of a country.
 */
export async function toggleCountryStatus(id: string, isEnabled: boolean): Promise<CountryRecord> {
  return updateCountryRecord(id, { is_enabled: isEnabled });
}

/**
 * Deletes a country record.
 */
export async function deleteCountryRecord(id: string): Promise<boolean> {
  const current = getLocalCountryDb();
  const filtered = current.filter((c) => c.id !== id);
  saveLocalCountryDb(filtered);
  return true;
}

/**
 * Exports country records to a CSV file download.
 */
export function exportCountriesCSV(countries: CountryRecord[]) {
  if (countries.length === 0) {
    alert("No country records available to export.");
    return;
  }

  const headers = [
    "Country ID",
    "ISO Code",
    "Country Name",
    "Delivery Time",
    "Currency",
    "Timezone",
    "Major Serviced Cities",
    "Status",
    "Duty & Tax Info",
  ];

  const rows = countries.map((c) => [
    `"${c.id}"`,
    `"${c.code}"`,
    `"${c.name}"`,
    `"${c.delivery_time}"`,
    `"${c.currency} (${c.currency_symbol})"`,
    `"${c.timezone}"`,
    `"${c.major_cities}"`,
    `"${c.is_enabled ? "Enabled" : "Disabled"}"`,
    `"${c.duty_tax_info || ""}"`,
  ]);

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute(
    "download",
    `sky_worldwide_countries_${new Date().toISOString().slice(0, 10)}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const getCountriesList = getCountries;
export const toggleCountryEnabled = toggleCountryStatus;
