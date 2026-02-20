/**
 * Base API client configuration.
 * Uses Bearer token auth and handles 401 via onUnauthorized callback.
 */

import { getToken } from "./tokenStore";

/**
 * Base URL for API requests.
 * - Empty in dev: use relative URLs so Vite proxy forwards /api to backend (avoids CORS, port mismatch)
 * - VITE_API_BASE_URL for prod or when backend is on different host (e.g. https://api.alugra.co.id)
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  errors?: { field: string; message: string }[];
}

/** Callback invoked on 401. Set by AuthProvider to clear token and redirect. */
let onUnauthorizedCallback: (() => void) | null = null;

export function setOnUnauthorized(callback: (() => void) | null): void {
  onUnauthorizedCallback = callback;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = API_BASE_URL ? `${API_BASE_URL.replace(/\/$/, "")}${endpoint}` : endpoint;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(options.headers as Record<string, string>),
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
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
        if (Array.isArray(body.errors)) {
          error.errors = body.errors;
        }
      } catch {
        // ignore json parse error
      }

      if (response.status === 401 && onUnauthorizedCallback) {
        onUnauthorizedCallback();
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
