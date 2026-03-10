import { hashPassword, verifyPassword } from "../../lib/hashpassword";
import { SignJWT, jwtVerify } from "jose";

export function generateUUID(): string {
  return crypto.randomUUID();
}

export async function createAccessToken(sessionId: string, secretKey: string): Promise<string> {
  const encoder = new TextEncoder();
  const secretKeyBytes = encoder.encode(secretKey);

  return new SignJWT({ sid: sessionId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .setSubject(sessionId)
    .sign(secretKeyBytes);
}

export async function verifyAccessToken(token: string, secretKey: string): Promise<{ sid: string } | null> {
  try {
    const encoder = new TextEncoder();
    const secretKeyBytes = encoder.encode(secretKey);

    const { payload } = await jwtVerify(token, secretKeyBytes, {
      algorithms: ["HS256"],
    });

    return { sid: payload.sid as string };
  } catch {
    return null;
  }
}

export async function createRefreshToken(sessionId: string, secretKey: string): Promise<string> {
  const encoder = new TextEncoder();
  const secretKeyBytes = encoder.encode(secretKey);

  return new SignJWT({ sid: sessionId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .setSubject(sessionId)
    .sign(secretKeyBytes);
}

export async function verifyRefreshToken(token: string, secretKey: string): Promise<{ sid: string } | null> {
  try {
    const encoder = new TextEncoder();
    const secretKeyBytes = encoder.encode(secretKey);

    const { payload } = await jwtVerify(token, secretKeyBytes, {
      algorithms: ["HS256"],
    });

    return { sid: payload.sid as string };
  } catch {
    return null;
  }
}

export async function verifyToken(token: string, hash: string): Promise<boolean> {
  return verifyPassword(token, hash);
}

export function parseAuthHeader(authHeader: string | undefined): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.slice(7);
}
export async function hashPasswordValue(password: string): Promise<string> {
  return hashPassword(password);
}
export async function validatePassword(password: string, hash: string): Promise<boolean> {
  return verifyPassword(password, hash);
}
