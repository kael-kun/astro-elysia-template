import { authStore } from "./authStore";

const API_BASE_URL = import.meta.env.PUBLIC_API_URL || window.location.origin;

async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await authStore.getAccessToken();
  console.log("dito sa fetch client");
  console.log(token);
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

function buildUrl(input: string): string {
  return input.startsWith("http") ? input : `${API_BASE_URL}${input}`;
}

async function refreshToken(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) return false;

    const data = (await res.json()) as { accessToken: string };

    authStore.setAuth(data.accessToken);
    return true;
  } catch {
    return false;
  }
}

async function authenticatedFetch(input: string, init: RequestInit = {}, retryCount = 0): Promise<Response> {
  const defaultHeaders = await getAuthHeaders();
  const { redirectOnUnauthorized = true, ...restInit } = init as RequestInit & { redirectOnUnauthorized?: boolean };
  const headers = new Headers(restInit.headers || {});

  Object.entries(defaultHeaders).forEach(([key, value]) => {
    if (!headers.has(key)) {
      headers.set(key, value);
    }
  });

  const url = buildUrl(input);

  try {
    const response = await fetch(url, {
      ...restInit,
      headers,
      credentials: "include",
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      let errorCode: number | undefined;

      try {
        const errorData = await response.json();
        const extractedMessage = getErrorMessage(errorData);
        errorMessage = extractedMessage || errorMessage;
        if (typeof errorData === "object" && errorData !== null) {
          errorCode = (errorData as Record<string, unknown>).errorCode as number | undefined;
        }
      } catch {
        try {
          const errorText = await response.text();
          if (errorText) errorMessage = errorText;
        } catch {}
      }

      if (response.status === 401 || response.status === 403) {
        if (retryCount === 0 && redirectOnUnauthorized) {
          const refreshed = await refreshToken();
          if (refreshed) {
            return authenticatedFetch(input, { ...restInit, redirectOnUnauthorized } as RequestInit, retryCount + 1);
          }
        }

        if (redirectOnUnauthorized) {
          window.location.replace("/auth/login");
        }
        throw new Error(errorMessage);
      }

      if (response.status >= 500) {
        console.error("Server error occurred");
        throw new Error("Internal server error");
      }

      if (response.status === 429) {
        window.dispatchEvent(new CustomEvent("rate-limit-exceeded"));
      }

      const error = new Error(errorMessage);
      Object.defineProperty(error, "errorCode", { value: errorCode, writable: true, enumerable: true });
      throw error;
    }

    return response;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("Network error. Please check your connection.");
    }
    throw error;
  }
}

function getErrorMessage(errorData: unknown): string | null {
  if (typeof errorData === "string") return errorData;

  if (typeof errorData === "object" && errorData !== null) {
    const obj = errorData as Record<string, unknown>;

    if (typeof obj.message === "string") return obj.message;
    if (typeof obj.error === "string") return obj.error;
    if (typeof obj.detail === "string") return obj.detail;
  }

  return null;
}

async function parseJSON<T>(response: Response): Promise<T> {
  if (response.status === 204 || response.headers.get("content-length") === "0") {
    return {} as T;
  }
  const text = await response.text();
  return text ? JSON.parse(text) : ({} as T);
}

const fetchClient = {
  async get<T = unknown>(url: string, options?: RequestInit): Promise<T> {
    const response = await authenticatedFetch(url, {
      method: "GET",
      ...options,
    });
    return parseJSON<T>(response);
  },

  async post<T = unknown, R = unknown>(url: string, data?: R, options?: RequestInit): Promise<T> {
    const response = await authenticatedFetch(url, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
    return parseJSON<T>(response);
  },

  async put<T = unknown, R = unknown>(url: string, data?: R, options?: RequestInit): Promise<T> {
    const response = await authenticatedFetch(url, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
    return parseJSON<T>(response);
  },

  async delete<T = unknown>(url: string, options?: RequestInit): Promise<T> {
    const response = await authenticatedFetch(url, {
      method: "DELETE",
      ...options,
    });
    return parseJSON<T>(response);
  },

  async patch<T = unknown, R = unknown>(url: string, data?: R, options?: RequestInit): Promise<T> {
    const response = await authenticatedFetch(url, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
    return parseJSON<T>(response);
  },
};

export default fetchClient;
