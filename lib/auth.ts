import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

export const SESSION_COOKIE = "admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7일

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("Missing SESSION_SECRET env var. See docs/06-admin-setup.md.");
  }
  return new TextEncoder().encode(secret);
}

export async function verifyPassword(password: string) {
  const encoded = process.env.ADMIN_PASSWORD_HASH;
  if (!encoded) {
    throw new Error("Missing ADMIN_PASSWORD_HASH env var. See docs/06-admin-setup.md.");
  }
  // scripts/hash-password.mjs가 base64로 감싸서 출력한다 (bcrypt 해시의 $
  // 문자를 .env 파일의 변수 치환 문법과 충돌하지 않게 하기 위함).
  const hash = Buffer.from(encoded, "base64").toString("utf8");
  return bcrypt.compare(password, hash);
}

export async function createSessionToken() {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload.role === "admin";
  } catch {
    return false;
  }
}

/** Server Actions에서 맨 위에 호출해 인증을 재확인한다 (미들웨어와는 별개의 방어선). */
export async function requireAdmin() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  const valid = token ? await verifySessionToken(token) : false;
  if (!valid) {
    throw new Error("인증이 필요합니다.");
  }
}

export async function setSessionCookie() {
  const token = await createSessionToken();
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
