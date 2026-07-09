import Link from "next/link";
import { logout } from "./actions";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <nav className="flex gap-4 text-sm text-muted">
          <Link href="/admin/gallery" className="hover:text-accent">
            갤러리 관리
          </Link>
          <Link href="/admin/projects" className="hover:text-accent">
            프로젝트 관리
          </Link>
        </nav>
        <form action={logout}>
          <button type="submit" className="text-sm text-muted hover:text-accent">
            로그아웃
          </button>
        </form>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-10">{children}</main>
    </div>
  );
}
