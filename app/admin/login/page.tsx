"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    login,
    undefined
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <form action={formAction} className="w-full max-w-sm space-y-4">
        <h1 className="text-lg font-medium text-foreground">관리자 로그인</h1>
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          required
          autoFocus
          className="w-full rounded border border-white/15 bg-transparent px-3 py-2 text-sm text-foreground outline-none focus:border-lime"
        />
        {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded bg-lime px-3 py-2 text-sm font-medium text-black transition-opacity disabled:opacity-60"
        >
          {pending ? "확인 중..." : "로그인"}
        </button>
      </form>
    </main>
  );
}
