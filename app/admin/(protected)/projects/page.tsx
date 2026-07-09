import Link from "next/link";
import { getProjects } from "@/lib/data";
import { createProjectAction, deleteProjectAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function ProjectsAdminPage() {
  const items = await getProjects();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-xl font-medium">프로젝트 그리드 관리</h1>
        <p className="mt-1 text-sm text-muted">현재 {items.length}개 항목</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-sm uppercase tracking-wide text-muted">새 항목 추가</h2>
        <form
          action={createProjectAction}
          className="space-y-3 rounded border border-white/10 p-4"
        >
          <input
            name="title"
            placeholder="프로젝트명"
            required
            className="w-full rounded border border-white/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <input
            name="year_category"
            placeholder="연도 · 카테고리 (예: 2025 · 다큐)"
            className="w-full rounded border border-white/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <input
            name="video_url"
            placeholder="영상 링크 (유튜브/비메오, 선택)"
            className="w-full rounded border border-white/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <div>
            <label className="text-xs text-muted">기본 썸네일 (필수)</label>
            <input type="file" name="base_thumbnail" accept="image/*" required className="mt-1 w-full text-sm" />
          </div>
          <div>
            <label className="text-xs text-muted">호버 썸네일 (선택)</label>
            <input type="file" name="hover_thumbnail" accept="image/*" className="mt-1 w-full text-sm" />
          </div>
          <button
            type="submit"
            className="rounded bg-accent px-4 py-2 text-sm font-medium text-black"
          >
            추가
          </button>
        </form>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm uppercase tracking-wide text-muted">항목 목록</h2>
        {items.length === 0 && (
          <p className="text-sm text-muted">등록된 항목이 없습니다.</p>
        )}
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-4 rounded border border-white/10 p-3"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.base_thumbnail_url}
                alt={item.title}
                className="h-16 w-24 rounded object-cover"
              />
              <div className="flex-1">
                <p className="text-sm">{item.title}</p>
                <p className="text-xs text-muted">{item.year_category || "연도·카테고리 미입력"}</p>
              </div>
              <Link
                href={`/admin/projects/${item.id}`}
                className="text-sm text-muted hover:text-accent"
              >
                수정
              </Link>
              <form action={deleteProjectAction.bind(null, item.id)}>
                <button type="submit" className="text-sm text-red-400 hover:text-red-300">
                  삭제
                </button>
              </form>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
