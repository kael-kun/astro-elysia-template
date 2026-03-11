import fetchClient from "../../../lib/fetchClient";
import { setAccessToken, clearAccessToken } from "../../../lib/authStore";
import { clearAuthCache } from "../../../lib/initAuth";

export interface LoginResponse {
  accessToken: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await fetchClient.post<LoginResponse, LoginCredentials>("/api/auth/login", credentials, { redirectOnUnauthorized: false } as RequestInit);
  
  if (response.accessToken) {
    setAccessToken(response.accessToken);
  }
  
  return response;
}

export async function logout(): Promise<void> {
  try {
    await fetchClient.post("/api/auth/logout");
  } finally {
    clearAccessToken();
    clearAuthCache();
  }
}

export async function refreshToken(): Promise<{ accessToken: string }> {
  return fetchClient.post("/api/auth/refresh");
}
