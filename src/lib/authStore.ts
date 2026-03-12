export interface UserProfile {
  id: string;
  name: string;
  email: string;
}

let accessToken: string | null = null;
let profile: UserProfile | null = null;
let initialized = false;

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
  },

  isAuthenticated() {
    return accessToken !== null;
  },

  async init() {
    if (initialized) return;

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
          console.log(data);
          if (data.user) {
            profile = data.user;
          }
        }
      }
    } catch (error) {
      console.error("Failed to initialize auth:", error);
    }

    initialized = true;
  },
};
