import jwt from "jsonwebtoken";

export type JwtUserPayload = {
  id: number;
  email: string;
  name: string;
  role: "super_admin" | "admin" | "staff";
};

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "fallback_access_secret_do_not_use_in_prod";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "fallback_refresh_secret_do_not_use_in_prod";

export function signAccessToken(payload: JwtUserPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN || "15m") as any,
  });
}

export function signRefreshToken(payload: { id: number; email: string }): string {
  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || "7d") as any,
  });
}

export function verifyAccessToken(token: string): JwtUserPayload | null {
  try {
    return jwt.verify(token, ACCESS_SECRET) as JwtUserPayload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): { id: number; email: string } | null {
  try {
    return jwt.verify(token, REFRESH_SECRET) as { id: number; email: string };
  } catch {
    return null;
  }
}
