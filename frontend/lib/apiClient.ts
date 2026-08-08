/**
 * Centralized API Client - Sky Worldwide Frontend
 * Single Axios instance with automatic auth header + 401 redirect.
 */
import axios, { AxiosInstance, AxiosError } from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

function getToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("admin_token") || "";
}

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor: attach Authorization header
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle 401 -> redirect to login
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_username");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;

/**
 * Extract a user-friendly error message from an API error.
 */
export function extractError(err: unknown, fallback = "An unexpected error occurred."): string {
  if (!err) return fallback;
  if (axios.isAxiosError(err)) {
    const data = err.response?.data;
    if (data?.detail) return String(data.detail);
    if (data?.message) return String(data.message);
    if (data?.error) return String(data.error);
    if (err.message) return err.message;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}
