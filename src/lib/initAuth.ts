import { setAccessToken } from "./authStore";

const API_BASE_URL = import.meta.env.PUBLIC_API_URL || "";
const CACHE_KEY = "auth_refresh_cache";
const CACHE_TTL = 60000;

interface AuthCache {
  accessToken: string;
  timestamp: number;
}

function getCache(): AuthCache | null {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const cache: AuthCache = JSON.parse(cached);
    if (Date.now() - cache.timestamp > CACHE_TTL) {
      sessionStorage.removeItem(CACHE_KEY);
      return null;
    }
    return cache;
  } catch {
    return null;
  }
}

function setCache(accessToken: string): void {
  try {
    const cache: AuthCache = {
      accessToken,
      timestamp: Date.now(),
    };
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {}
}

export function clearAuthCache(): void {
  try {
    sessionStorage.removeItem(CACHE_KEY);
  } catch {}
}

export async function initAuth(): Promise<boolean> {
  const cached = getCache();
  if (cached) {
    setAccessToken(cached.accessToken);
    return true;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      return false;
    }

    const data = (await res.json()) as { accessToken: string };
    setAccessToken(data.accessToken);
    setCache(data.accessToken);
    return true;
  } catch {
    return false;
  }
}
