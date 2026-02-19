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
  // #region agent log
  fetch('http://127.0.0.1:7544/ingest/9f3423bf-0257-4e34-8604-892d2a12af86',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'713667'},body:JSON.stringify({sessionId:'713667',location:'client.ts:apiClient:start',message:'API request',data:{endpoint,url,baseUrl:API_BASE_URL,hasToken:!!getToken()},timestamp:Date.now(),hypothesisId:'H1'})}).catch(()=>{});
  // #endregion
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

      // #region agent log
      fetch('http://127.0.0.1:7544/ingest/9f3423bf-0257-4e34-8604-892d2a12af86',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'713667'},body:JSON.stringify({sessionId:'713667',location:'client.ts:apiClient',message:'API error',data:{endpoint,status:response.status,hasToken:!!token,url,errMsg:error.message},timestamp:Date.now(),hypothesisId:'H2'})}).catch(()=>{});
      // #endregion

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
    // #region agent log
    const errMsg = err && typeof err === "object" && "message" in err ? (err as Error).message : "unknown";
    fetch('http://127.0.0.1:7544/ingest/9f3423bf-0257-4e34-8604-892d2a12af86',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'713667'},body:JSON.stringify({sessionId:'713667',location:'client.ts:apiClient:catch',message:'API fetch exception',data:{endpoint,url,errMsg},timestamp:Date.now(),hypothesisId:'H1'})}).catch(()=>{});
    // #endregion
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
