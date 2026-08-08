export interface WeightSlabRate {
  weight_slab?: string;
  express_rate?: number;
  economy_rate?: number;
  min_weight?: number;
  max_weight?: number;
  price_per_kg?: number;
}

export interface PricingRecord {
  id: string;
  country: string;
  zone: string;
  category: string;
  currency: string;
  currency_symbol: string;
  base_express_price: number;
  base_economy_price: number;
  weight_slabs: WeightSlabRate[];
  is_active: boolean;
  notes?: string;
  fuel_surcharge_pct?: number;
  updated_at: string;
  flag_url?: string;
}

export interface CreatePricingPayload {
  country: string;
  zone: string;
  category: string;
  currency?: string;
  currency_symbol?: string;
  base_express_price: number;
  base_economy_price: number;
  weight_slabs?: WeightSlabRate[];
  is_active?: boolean;
  notes?: string;
  flag_url?: string;
}

export interface PricingFilterParams {
  search?: string;
  zone?: string;
  category?: string;
  activeOnly?: boolean;
  page?: number;
  pageSize?: number;
}

export interface PaginatedPricingResponse {
  rates: PricingRecord[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
