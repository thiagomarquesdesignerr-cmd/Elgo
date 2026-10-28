import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import { db } from "./db";

const COOKIE = "elgo_session";
function getSecret() {
  const value = process.env.AUTH_SECRET ?? "";
  if (value.length < 32) {
    throw new Error("AUTH_SECRET precisa ter pelo menos 32 caracteres. Gere com: openssl rand -base64 32");
  }
  return new TextEncoder().encode(value);
}

export async function createSession(userId: string) {
  const secret = getSecret();
  const token = await new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

export async function getCurrentUser() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (!payload.sub) return null;
    return db.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, name: true, email: true },
    });
  } catch {
    return null;
  }
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/entrar");
  return user;
}

// Garante que o portal pertence ao usuário logado; caso contrário, volta ao painel.
export async function requirePortal(portalId: string) {
  const user = await requireUser();
  const portal = await db.portal.findFirst({ where: { id: portalId, ownerId: user.id } });
  if (!portal) redirect("/painel");
  return { user, portal };
}
