import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background px-6 text-center">
      <div className="text-[11px] uppercase tracking-[0.2em] text-muted">404</div>
      <h1 className="mt-4 text-3xl font-semibold text-foreground sm:text-4xl">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="mt-3 max-w-sm text-sm text-muted sm:text-base">
        주소가 잘못됐거나 옮겨진 페이지예요.
      </p>
      <Link
        href="/"
        className="mt-10 rounded-full border border-white/15 px-6 py-2 text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
      >
        홈으로 돌아가기
      </Link>
    </main>
  );
}
