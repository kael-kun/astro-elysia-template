export interface UserProfile {
  id: string;
  name: string;
  email: string;
}

const CACHE_KEYS = {
  token: "auth_accessToken",
  profile: "auth_profile",
};

let accessToken: string | null = null;
let profile: UserProfile | null = null;
let initialized = false;

function loadFromSession() {
  const cachedToken = sessionStorage.getItem(CACHE_KEYS.token);
  const cachedProfile = sessionStorage.getItem(CACHE_KEYS.profile);

  if (cachedToken) accessToken = cachedToken;
  if (cachedProfile) profile = JSON.parse(cachedProfile);
}

function saveToSession() {
  if (accessToken) sessionStorage.setItem(CACHE_KEYS.token, accessToken);
  if (profile) sessionStorage.setItem(CACHE_KEYS.profile, JSON.stringify(profile));
}

function clearSession() {
  sessionStorage.removeItem(CACHE_KEYS.token);
  sessionStorage.removeItem(CACHE_KEYS.profile);
}

export const authStore = {
  setAuth(token: string) {
    accessToken = token;
  },

  setProfile(profileData: UserProfile) {
    profile = profileData;
  },

  async getAccessToken() {
    if (!initialized) {
      await this.init();
    }
    return accessToken;
  },

  async getProfile() {
    if (!initialized) {
      await this.init();
    }
    return profile;
  },

  clear() {
    accessToken = null;
    profile = null;
    initialized = false;
    clearSession();
  },

  isAuthenticated() {
    return accessToken !== null;
  },

  async init() {
    if (initialized) return;

    loadFromSession();

    if (accessToken && profile) {
      initialized = true;
      return;
    }

    try {
      const origin = window.location.origin;
      const response = await fetch(`${origin}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        const data = (await response.json()) as { accessToken?: string };
        if (data.accessToken) {
          accessToken = data.accessToken;
        }
      }

      if (accessToken) {
        const response = await fetch(`${origin}/api/auth/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const data = (await response.json()) as { user?: UserProfile };
          if (data.user) {
            profile = data.user;
          }
        }
      }

      saveToSession();
    } catch (error) {
      console.error("Failed to initialize auth:", error);
    }

    initialized = true;
  },
};
