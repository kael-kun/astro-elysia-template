import fetchClient from "../../../lib/fetchClient";
import { authStore } from "../../../lib/authStore";

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
  const response = await fetchClient.post<LoginResponse, LoginCredentials>("/api/auth/login", credentials, {
    redirectOnUnauthorized: false,
  } as RequestInit);

  if (response.accessToken) {
    authStore.setAuth(response.accessToken);
    authStore.init();
  }

  return response;
}

export async function logout(): Promise<void> {
  try {
    await fetchClient.get("/api/auth/logout");
  } finally {
    authStore.clear();
  }
}

export async function refreshToken(): Promise<{ accessToken: string }> {
  return fetchClient.post("/api/auth/refresh");
}
