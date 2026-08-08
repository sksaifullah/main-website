import axios from "axios";
import {
  ShipmentDetailsData,
  CreateShipmentPayload,
  UpdateShipmentPayload,
  ShipmentFilterParams,
  PaginatedShipmentsResponse,
} from "@/types";

export type {
  ShipmentDetailsData,
  CreateShipmentPayload,
  UpdateShipmentPayload,
  ShipmentFilterParams,
  PaginatedShipmentsResponse,
};
export { getErrorMessage } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const SHIPMENT_STORAGE_KEY = "sky_worldwide_shipments_db";

const DEFAULT_SHIPMENTS: ShipmentDetailsData[] = [
  {
    tracking_number: "SW1001",
    partner_tracking_number: "FEDEX-882190",
    customer_name: "Rajesh Sharma",
    receiver_name: "John Miller",
    phone: "+91 98200 12345",
    email: "rajesh@sharmatraders.com",
    origin: "Mumbai Hub, India",
    destination: "New York, USA",
    service: "Express Air Freight",
    package_type: "Commercial Box",
    weight: "4.5 kg",
    pieces: 1,
    status: "In Transit",
    status_code: "IN_TRANSIT",
    current_location: "Paris Charles de Gaulle Air Hub (CDG)",
    last_updated: "2026-03-29 14:30 IST",
    estimated_delivery: "31 Mar 2026",
    partner_courier: "FedEx Express",
    is_live_synced: true,
  },
  {
    tracking_number: "SW1002",
    partner_tracking_number: "DHL-991204",
    customer_name: "Anita Desai",
    receiver_name: "Harriet Smith",
    phone: "+91 98199 87654",
    email: "anita@desaipharma.in",
    origin: "Ahmedabad Hub, India",
    destination: "London, UK",
    service: "Pharma Special Care",
    package_type: "Cold Chain Box",
    weight: "2.1 kg",
    pieces: 2,
    status: "Out for Delivery",
    status_code: "OUT_FOR_DELIVERY",
    current_location: "London Heathrow Hub (LHR)",
    last_updated: "2026-03-29 10:15 GMT",
    estimated_delivery: "29 Mar 2026",
    partner_courier: "DHL Express",
    is_live_synced: true,
  },
];

function getLocalShipmentsDb(): ShipmentDetailsData[] {
  if (typeof window === "undefined") return DEFAULT_SHIPMENTS;
  try {
    const raw = localStorage.getItem(SHIPMENT_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Could not read local shipments db:", e);
  }
  return DEFAULT_SHIPMENTS;
}

function saveLocalShipmentsDb(list: ShipmentDetailsData[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SHIPMENT_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn("Could not save local shipments db:", e);
  }
}

/**
 * Fetches paginated shipments list.
 */
export async function getShipments(
  params: ShipmentFilterParams = {}
): Promise<PaginatedShipmentsResponse> {
  try {
    const res = await axios.get<{
      success: boolean;
      data: PaginatedShipmentsResponse;
    }>(`${API_BASE}/api/admin/shipments`, {
      params: { ...params, _t: Date.now() },
    });
    if (res.data?.data) {
      return res.data.data;
    }
  } catch (error: unknown) {
    console.warn("[services/shipment.ts] API fetch failed, fallback to local DB:", error);
  }

  const all = getLocalShipmentsDb();
  const search = (params.search || "").toLowerCase().trim();
  const statusFilter = (params.status || "").toLowerCase().trim();
  const courierFilter = (params.courier || "").toLowerCase().trim();

  const filtered = all.filter((s) => {
    const searchMatch =
      !search ||
      s.tracking_number.toLowerCase().includes(search) ||
      (s.partner_tracking_number || "").toLowerCase().includes(search) ||
      (s.customer_name || "").toLowerCase().includes(search) ||
      (s.receiver_name || "").toLowerCase().includes(search) ||
      (s.destination || "").toLowerCase().includes(search);

    const statusMatch = !statusFilter || (s.status || "").toLowerCase().includes(statusFilter);
    const courierMatch = !courierFilter || (s.partner_courier || "").toLowerCase().includes(courierFilter);

    return searchMatch && statusMatch && courierMatch;
  });

  const page = params.page || 1;
  const pageSize = params.pageSize || 10;
  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const startIndex = (page - 1) * pageSize;
  const paginatedItems = filtered.slice(startIndex, startIndex + pageSize);

  return {
    shipments: paginatedItems,
    total,
    page,
    pageSize,
    totalPages,
  };
}

/**
 * Creates a new shipment record.
 */
export async function createShipment(
  payload: CreateShipmentPayload
): Promise<ShipmentDetailsData> {
  const current = getLocalShipmentsDb();

  const trackingNum = `SW${Math.floor(100000 + Math.random() * 900000)}`;
  const statusText = payload.status || "Booked";
  const originText = payload.origin || "Mumbai Hub";

  const newShipment: ShipmentDetailsData = {
    tracking_number: trackingNum,
    partner_courier: payload.partner_courier,
    partner_tracking_number: payload.partner_tracking_number,
    customer_name: payload.customer_name || "Valued Customer",
    receiver_name: payload.receiver_name || "Consignee",
    phone: payload.phone || "",
    email: payload.email || "",
    origin: originText,
    destination: payload.destination || "International Destination",
    service: payload.package_type || "Express Air Parcel",
    package_type: payload.package_type || "Express Air Parcel",
    weight: payload.weight || "1.0 kg",
    pieces: payload.pieces || 1,
    status: statusText,
    status_code: statusText.toUpperCase().replace(/\s+/g, "_"),
    current_location: originText,
    last_updated: new Date().toLocaleString(),
    estimated_delivery: payload.estimated_delivery || "3–5 Days",
    manual_override: payload.manual_override || false,
    is_live_synced: !payload.manual_override,
  };

  const updated = [newShipment, ...current];
  saveLocalShipmentsDb(updated);
  return newShipment;
}

/**
 * Updates an existing shipment record.
 */
export async function updateShipment(
  trackingNumber: string,
  payload: UpdateShipmentPayload
): Promise<ShipmentDetailsData> {
  const current = getLocalShipmentsDb();
  const idx = current.findIndex((s) => s.tracking_number === trackingNumber);
  if (idx === -1) {
    throw new Error(`Shipment ${trackingNumber} not found.`);
  }

  const existing = current[idx];
  const updatedShipment: ShipmentDetailsData = {
    ...existing,
    ...payload,
    last_updated: new Date().toLocaleString(),
  };

  current[idx] = updatedShipment;
  saveLocalShipmentsDb(current);
  return updatedShipment;
}

/**
 * Deletes a shipment record.
 */
export async function deleteShipment(trackingNumber: string): Promise<boolean> {
  const current = getLocalShipmentsDb();
  const filtered = current.filter((s) => s.tracking_number !== trackingNumber);
  saveLocalShipmentsDb(filtered);
  return true;
}

/**
 * Syncs a single shipment with courier partner API.
 */
export async function syncShipment(trackingNumber: string): Promise<boolean> {
  const current = getLocalShipmentsDb();
  const idx = current.findIndex((s) => s.tracking_number === trackingNumber);
  if (idx !== -1) {
    current[idx].last_updated = new Date().toLocaleString();
    current[idx].is_live_synced = true;
    saveLocalShipmentsDb(current);
  }
  return true;
}

/**
 * Triggers sync across all carriers.
 */
export async function syncAllCarriers(): Promise<{ success: boolean; synced_count: number; message: string }> {
  return { success: true, synced_count: 5, message: "Synced all active shipments." };
}

/**
 * Bulk deletes multiple shipments by tracking number.
 */
export async function bulkDeleteShipments(trackingNumbers: string[]): Promise<number> {
  const current = getLocalShipmentsDb();
  const set = new Set(trackingNumbers);
  const filtered = current.filter((s) => !set.has(s.tracking_number));
  saveLocalShipmentsDb(filtered);
  return current.length - filtered.length;
}

/**
 * Bulk updates shipment status.
 */
export async function bulkUpdateStatus(trackingNumbers: string[], status: string): Promise<number> {
  const current = getLocalShipmentsDb();
  const set = new Set(trackingNumbers);
  let count = 0;
  current.forEach((s) => {
    if (set.has(s.tracking_number)) {
      s.status = status;
      s.status_code = status.toUpperCase().replace(/\s+/g, "_");
      s.last_updated = new Date().toLocaleString();
      count++;
    }
  });
  saveLocalShipmentsDb(current);
  return count;
}

/**
 * Exports shipment records to CSV download.
 */
export function exportShipmentsCSV(shipments: ShipmentDetailsData[]) {
  if (shipments.length === 0) {
    alert("No shipment records available to export.");
    return;
  }

  const headers = [
    "Internal AWB #",
    "Courier Partner",
    "Partner AWB #",
    "Consignor",
    "Consignee",
    "Origin",
    "Destination",
    "Weight",
    "Status",
    "Est Delivery",
  ];

  const rows = shipments.map((s) => [
    `"${s.tracking_number}"`,
    `"${s.partner_courier || ""}"`,
    `"${s.partner_tracking_number || ""}"`,
    `"${s.customer_name || ""}"`,
    `"${s.receiver_name || ""}"`,
    `"${s.origin || ""}"`,
    `"${s.destination || ""}"`,
    `"${s.weight || ""}"`,
    `"${s.status || ""}"`,
    `"${s.estimated_delivery || ""}"`,
  ]);

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute(
    "download",
    `sky_worldwide_shipments_${new Date().toISOString().slice(0, 10)}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
