"use server";

import { redirect } from "next/navigation";
import { verifyPassword, setSessionCookie } from "@/lib/auth";

export type LoginState = { error?: string } | undefined;

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  const ok = await verifyPassword(password);
  if (!ok) {
    return { error: "비밀번호가 올바르지 않습니다." };
  }
  await setSessionCookie();
  redirect("/admin");
}
