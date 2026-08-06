export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  detail?: string;
  total?: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export function getErrorMessage(error: unknown, fallbackMessage = "An unexpected error occurred."): string {
  if (typeof error === "object" && error !== null) {
    const err = error as Record<string, unknown>;
    if (err.response && typeof err.response === "object" && err.response !== null) {
      const resp = err.response as Record<string, unknown>;
      if (resp.data && typeof resp.data === "object" && resp.data !== null) {
        const data = resp.data as Record<string, unknown>;
        if (typeof data.detail === "string" && data.detail) return data.detail;
        if (typeof data.message === "string" && data.message) return data.message;
      }
    }
    if (typeof err.message === "string" && err.message) return err.message;
  }
  if (typeof error === "string") return error;
  return fallbackMessage;
}
