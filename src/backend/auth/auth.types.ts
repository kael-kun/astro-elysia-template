export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  created_at: number;
}

export interface Session {
  id: string;
  user_id: string;
  refresh_token_hash: string;
  expires_at: number;
  created_at: number;
  revoked: number;
}

export interface LoginResult {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResult {
  accessToken: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

export interface RegisterResult {
  user: AuthUser;
}
