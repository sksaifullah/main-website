import apiClient from "@/lib/apiClient";
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

/**
 * Fetches all countries from the backend.
 */
export async function getCountriesList(
  params: CountryFilterParams = {}
): Promise<CountryRecord[]> {
  const res = await apiClient.get<{ success: boolean; data: CountryRecord[] }>(
    "/api/admin/countries",
    { params: { ...params, _t: Date.now() } }
  );
  return res.data?.data || [];
}

/**
 * Creates a new country record.
 */
export async function createCountryRecord(
  payload: CreateCountryPayload
): Promise<CountryRecord> {
  const res = await apiClient.post<{ success: boolean; data: CountryRecord }>(
    "/api/admin/countries",
    payload
  );
  return res.data.data;
}

/**
 * Updates an existing country record.
 */
export async function updateCountryRecord(
  id: string,
  payload: Partial<CreateCountryPayload>
): Promise<CountryRecord> {
  const res = await apiClient.put<{ success: boolean; data: CountryRecord }>(
    `/api/admin/countries/${id}`,
    payload
  );
  return res.data.data;
}

/**
 * Toggles a country active/disabled status.
 */
export async function toggleCountryEnabled(
  id: string,
  enabled: boolean
): Promise<CountryRecord> {
  const res = await apiClient.put<{ success: boolean; data: CountryRecord }>(
    `/api/admin/countries/${id}`,
    { is_enabled: enabled }
  );
  return res.data.data;
}

/**
 * Deletes a country record.
 */
export async function deleteCountryRecord(id: string): Promise<boolean> {
  await apiClient.delete(`/api/admin/countries/${id}`);
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
    "Country ID", "Country Name", "ISO Code", "Currency", "Timezone",
    "Major Cities", "Transit Days", "Status",
  ];

  const rows = countries.map((c) => [
    `"${c.id}"`,
    `"${c.name}"`,
    `"${c.code || ""}"`,
    `"${c.currency || ""}"`,
    `"${c.timezone || ""}"`,
    `"${c.major_cities || ""}"`,
    `"${c.delivery_time || ""}"`,
    `"${c.is_enabled ? "Enabled" : "Disabled"}"`,
  ]);

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `sky_worldwide_countries_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
