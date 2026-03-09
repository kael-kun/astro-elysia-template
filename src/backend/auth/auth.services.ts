import type { D1Database } from "@cloudflare/workers-types";

export class AuthService {
  constructor(private db: D1Database) {}
}
export function createAuthService(env: Env): AuthService {
  return new AuthService(env.DB);
}
