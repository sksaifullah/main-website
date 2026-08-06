export interface CountryRecord {
  id: string;
  code: string;
  name: string;
  flag_url: string;
  delivery_time: string;
  currency: string;
  currency_symbol: string;
  timezone: string;
  major_cities: string;
  image_url?: string;
  is_enabled: boolean;
  duty_tax_info?: string;
  updated_at?: string;

  // Optional UI helper properties
  zone?: string;
  delivery_estimate?: string;
  base_tariff?: number;
  restrictions?: string;
}

export interface CreateCountryPayload {
  code: string;
  name: string;
  flag_url?: string;
  delivery_time?: string;
  currency?: string;
  currency_symbol?: string;
  timezone?: string;
  major_cities?: string;
  image_url?: string;
  is_enabled?: boolean;
  duty_tax_info?: string;
  zone?: string;
  delivery_estimate?: string;
  base_tariff?: number;
  restrictions?: string;
}

export interface CountryFilterParams {
  search?: string;
  enabledOnly?: boolean;
  page?: number;
  pageSize?: number;
}

export interface PaginatedCountriesResponse {
  countries: CountryRecord[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
