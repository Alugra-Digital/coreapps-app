/**
 * Base API client configuration.
 * Swap fetch implementation for real backend when available.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const error: ApiError = {
        message: response.statusText,
        status: response.status,
      };
      try {
        const body = await response.json();
        error.message = body.message ?? body.error ?? response.statusText;
        error.code = body.code;
      } catch {
        // ignore json parse error
      }
      throw error;
    }

    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      return response.json() as Promise<T>;
    }
    return undefined as T;
  } catch (err) {
    if (err && typeof err === "object" && "message" in err) {
      throw err;
    }
    throw { message: "Network error", status: 0 } as ApiError;
  }
}

export const api = {
  get: <T>(endpoint: string) => apiClient<T>(endpoint, { method: "GET" }),
  post: <T>(endpoint: string, body: unknown) =>
    apiClient<T>(endpoint, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body: unknown) =>
    apiClient<T>(endpoint, { method: "PUT", body: JSON.stringify(body) }),
  patch: <T>(endpoint: string, body: unknown) =>
    apiClient<T>(endpoint, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(endpoint: string) =>
    apiClient<T>(endpoint, { method: "DELETE" }),
};
