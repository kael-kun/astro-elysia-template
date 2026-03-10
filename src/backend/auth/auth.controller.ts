import type { AuthService } from "./auth.services";
import type { LoginResult, RefreshResult, RegisterInput, RegisterResult } from "./auth.types";
import { createAuthService } from "./auth.services";

export class AuthController {
  private authService: AuthService;

  constructor(env: Env) {
    this.authService = createAuthService(env.DB, env.JWT_SECRET, env.JWT_REFRESH_SECRET);
  }

  async login(email: string, password: string): Promise<LoginResult> {
    return this.authService.login(email, password);
  }

  async refresh(refreshToken: string): Promise<RefreshResult> {
    return this.authService.refresh(refreshToken);
  }

  async logout(sessionId: string): Promise<void> {
    return this.authService.revokeSession(sessionId);
  }

  async register(input: RegisterInput): Promise<RegisterResult> {
    return this.authService.register(input);
  }
}

export function createAuthController(env: Env): AuthController {
  return new AuthController(env);
}
