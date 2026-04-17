import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import config from "@/config";

/** Normalized error shape for consistent UI / logging after interceptor processing */
export interface NormalizedApiError {
  status: number | null;
  code?: string;
  message: string;
  details?: unknown;
}

declare module "axios" {
  export interface InternalAxiosRequestConfig {
    /** Skip global 401 redirect (e.g. login form wrong password) */
    skipAuthRedirect?: boolean;
  }
}

function extractMessageFromData(data: unknown): string | undefined {
  if (data == null) return undefined;
  if (typeof data === "string" && data.trim()) return data.trim();
  if (typeof data !== "object") return undefined;
  const o = data as Record<string, unknown>;
  if (typeof o.message === "string" && o.message.trim()) return o.message.trim();
  if (typeof o.error === "string" && o.error.trim()) return o.error.trim();
  if (Array.isArray(o.errors)) {
    const parts = o.errors
      .map((e) => {
        if (typeof e === "string") return e;
        if (e && typeof e === "object" && "message" in e && typeof (e as { message: string }).message === "string") {
          return (e as { message: string }).message;
        }
        return null;
      })
      .filter(Boolean) as string[];
    if (parts.length) return parts.join("; ");
  }
  if (o.errors && typeof o.errors === "object" && !Array.isArray(o.errors)) {
    const entries = Object.entries(o.errors as Record<string, unknown>)
      .map(([k, v]) => {
        if (Array.isArray(v)) return `${k}: ${v.join(", ")}`;
        if (v != null) return `${k}: ${String(v)}`;
        return null;
      })
      .filter(Boolean);
    if (entries.length) return entries.join("; ");
  }
  return undefined;
}

function statusFallbackMessage(status: number | null): string {
  switch (status) {
    case 400:
      return "Bad request. Please check your input.";
    case 401:
      return "Unauthorized. Please sign in again.";
    case 403:
      return "You do not have permission to perform this action.";
    case 404:
      return "The requested resource was not found.";
    case 405:
      return "This action is not allowed for this resource.";
    case 408:
      return "The request timed out. Please try again.";
    case 409:
      return "This request conflicts with the current state. Please refresh and try again.";
    case 410:
      return "This resource is no longer available.";
    case 413:
      return "The upload is too large.";
    case 415:
      return "Unsupported media type.";
    case 422:
      return "Validation failed. Please correct the highlighted fields.";
    case 429:
      return "Too many requests. Please wait a moment and try again.";
    case 500:
      return "Something went wrong on the server. Please try again later.";
    case 502:
      return "Bad gateway. The service is temporarily unavailable.";
    case 503:
      return "Service unavailable. Please try again shortly.";
    case 504:
      return "Gateway timeout. Please try again.";
    default:
      return status != null
        ? `Request failed (${status}). Please try again.`
        : "Network error. Check your connection and try again.";
  }
}

function normalizeAxiosError(error: AxiosError): NormalizedApiError {
  const status = error.response?.status ?? null;
  const data = error.response?.data;
  const serverMessage = extractMessageFromData(data);
  const code =
    data && typeof data === "object" && "code" in data && typeof (data as { code: string }).code === "string"
      ? (data as { code: string }).code
      : undefined;

  let message: string;
  if (error.code === "ECONNABORTED" || error.message?.toLowerCase().includes("timeout")) {
    message = "Request timed out. Please try again.";
  } else if (!error.response) {
    message = serverMessage || "Network error. Check your connection and try again.";
  } else {
    message = serverMessage || statusFallbackMessage(status);
  }

  return {
    status,
    code,
    message,
    details: data,
  };
}

function shouldSkipAuthRedirect(cfg?: InternalAxiosRequestConfig): boolean {
  if (cfg?.skipAuthRedirect) return true;
  const url = (cfg?.url || "").toLowerCase();
  const base = (cfg?.baseURL || "").toLowerCase();
  const full = `${base}${url}`;
  if (full.includes("/auth/login") || full.includes("/login") || url.includes("forgot-password")) {
    return true;
  }
  return false;
}

function clearSessionAndRedirectToLogin(): void {
  try {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_access_level");
    localStorage.setItem("auth_sync_event", `logout:${Date.now()}`);
    window.dispatchEvent(new Event("auth:sync"));
  } catch {
    /* ignore */
  }
  const path = window.location.pathname || "";
  if (path === "/login" || path.endsWith("/login")) return;
  window.location.href = "/login";
}

// ✅ Create a single axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || config.baseURLApi,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

// ✅ Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Centralized error handling — all common status codes + network
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const normalized = normalizeAxiosError(error);
    (error as AxiosError & { normalized?: NormalizedApiError }).normalized = normalized;

    const status = normalized.status;
    const cfg = error.config as InternalAxiosRequestConfig | undefined;

    if (status === 401 && !shouldSkipAuthRedirect(cfg)) {
      clearSessionAndRedirectToLogin();
    }

    // Log once with structured info (avoid duplicate noise in dev)
    console.error("[API]", {
      status: normalized.status,
      code: normalized.code,
      message: normalized.message,
      url: cfg?.url,
      method: cfg?.method,
    });

    return Promise.reject(error);
  }
);

// ✅ Generic API service
export class ApiService {
  static async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await api.get(url, config);
    return response.data;
  }

  static async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await api.post(url, data, config);
    return response.data;
  }

  static async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await api.put(url, data, config);
    return response.data;
  }

  static async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await api.patch(url, data, config);
    return response.data;
  }

  static async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await api.delete(url, config);
    return response.data;
  }

  static async upload<T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> {
    const response = await api.post<T>(url, formData, {
      ...config,
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }
}

export { api };
