import axios from "axios";
import { ShipmentDetailsData, TrackingApiResponse, getErrorMessage } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Fetch shipment tracking details from existing Python backend.
 * Endpoint: GET http://127.0.0.1:8000/api/tracking/{trackingNumber}
 */
export async function getShipmentTracking(
  trackingNumber: string
): Promise<ShipmentDetailsData> {
  const trimmed = trackingNumber.trim();
  if (!trimmed) {
    throw new Error("Tracking number cannot be empty.");
  }

  try {
    const response = await apiClient.get<TrackingApiResponse>(
      `/api/tracking/${encodeURIComponent(trimmed)}`,
      {
        params: {
          _t: Date.now(),
        },
      }
    );

    const resData = response.data;

    // Handle nested response format { status: "success", data: { ... } } or direct object
    if (resData && resData.data && resData.data.tracking_number) {
      return resData.data;
    }

    if (resData && (resData as unknown as ShipmentDetailsData).tracking_number) {
      return resData as unknown as ShipmentDetailsData;
    }

    if (resData && resData.detail) {
      throw new Error(resData.detail);
    }

    if (resData && resData.message) {
      throw new Error(resData.message);
    }

    throw new Error(`Shipment with tracking number "${trimmed}" not found.`);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverDetail =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.response?.data?.error;

      if (serverDetail) {
        throw new Error(serverDetail);
      }

      if (error.response?.status === 404) {
        throw new Error(`Tracking number "${trimmed}" was not found.`);
      }

      if (error.code === "ECONNABORTED") {
        throw new Error("Request timed out connecting to tracking server.");
      }

      if (error.code === "ERR_NETWORK") {
        throw new Error("Network error: Unable to connect to backend server.");
      }
    }

    const message = getErrorMessage(error, "An unexpected error occurred while fetching tracking details.");
    throw new Error(message);
  }
}
