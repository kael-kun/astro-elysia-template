import type { D1Database } from "@cloudflare/workers-types";
import type { LoginResult, RefreshResult, User, RegisterInput, RegisterResult } from "./auth.types";
import { generateUUID, createAccessToken, createRefreshToken, verifyRefreshToken, verifyToken } from "./auth.utils";
import { verifyPassword, hashPassword } from "../../lib/hashpassword";

export class AuthService {
  constructor(
    private db: D1Database,
    private jwtSecret: string,
    private jwtRefreshSecret: string,
  ) {}

  async findUserByEmail(email: string): Promise<User | null> {
    const result = await this.db.prepare("SELECT * FROM users WHERE email = ?").bind(email).first<User>();
    return result ?? null;
  }

  async login(email: string, password: string): Promise<LoginResult> {
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isValidPassword = await verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error("Invalid email or password");
    }

    const sessionId = generateUUID();
    const refreshToken = await createRefreshToken(sessionId, this.jwtRefreshSecret);
    const refreshTokenHash = await hashPassword(refreshToken);

    const now = Date.now();
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
    const expiresAt = now + thirtyDaysMs;

    await this.db
      .prepare(
        `INSERT INTO sessions (id, user_id, refresh_token_hash, expires_at, created_at, revoked)
         VALUES (?, ?, ?, ?, ?, 0)`,
      )
      .bind(sessionId, user.id, refreshTokenHash, expiresAt, now)
      .run();

    const accessToken = await createAccessToken(sessionId, this.jwtSecret);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string): Promise<RefreshResult> {
    const decoded = await verifyRefreshToken(refreshToken, this.jwtRefreshSecret);
    if (!decoded) {
      throw new Error("Invalid refresh token");
    }

    const sessionId = decoded.sid;

    const session = await this.db
      .prepare("SELECT * FROM sessions WHERE id = ? AND revoked = 0")
      .bind(sessionId)
      .first<{ id: string; user_id: string; expires_at: number; revoked: number; refresh_token_hash: string }>();

    if (!session) {
      throw new Error("Session not found or revoked");
    }

    if (Date.now() > session.expires_at) {
      throw new Error("Refresh token expired");
    }

    const isValidRefreshToken = await verifyToken(refreshToken, session.refresh_token_hash);
    if (!isValidRefreshToken) {
      throw new Error("Invalid refresh token");
    }

    const accessToken = await createAccessToken(sessionId, this.jwtSecret);

    return { accessToken };
  }

  async revokeSession(sessionId: string): Promise<void> {
    await this.db.prepare("UPDATE sessions SET revoked = 1 WHERE id = ?").bind(sessionId).run();
  }

  async register(input: RegisterInput): Promise<RegisterResult> {
    const existing = await this.findUserByEmail(input.email);
    if (existing) {
      throw new Error("Email already registered");
    }

    const passwordHash = await hashPassword(input.password);
    const userId = generateUUID();
    const now = Date.now();

    await this.db
      .prepare("INSERT INTO users (id, email, name, password_hash, created_at) VALUES (?, ?, ?, ?, ?)")
      .bind(userId, input.email, input.name, passwordHash, now)
      .run();

    return {
      user: {
        id: userId,
        email: input.email,
        name: input.name,
      },
    };
  }
}

export function createAuthService(db: D1Database, jwtSecret: string, jwtRefreshSecret: string): AuthService {
  return new AuthService(db, jwtSecret, jwtRefreshSecret);
}
