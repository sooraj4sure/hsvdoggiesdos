import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me-for-production";

export type TokenPayload = { sub: string; role: "patient" | "admin"; name: string; email: string };

export function signToken(payload: TokenPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export function getAuthUser(): TokenPayload | null {
  const token = cookies().get("token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function requireAuth() {
  const user = getAuthUser();
  if (!user) return null;
  return user;
}

export function requireAdmin() {
  const user = getAuthUser();
  if (!user || user.role !== "admin") return null;
  return user;
}
